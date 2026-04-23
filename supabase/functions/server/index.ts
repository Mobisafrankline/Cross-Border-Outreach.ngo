/**
 * index.ts — Supabase Edge Function: "server"
 *
 * Handles server-side operations that require elevated privileges
 * or cannot be safely done from the browser:
 *   - Verifying admin role before granting admin-dashboard access
 *   - Recording a completed donation (updating totals atomically)
 *   - Generating a signed receipt download URL
 *
 * Rate-limiting is enforced via the Deno KV store (kv_store.ts).
 *
 * Deploy:  supabase functions deploy server
 * Invoke:  POST https://<project>.supabase.co/functions/v1/server
 *          Authorization: Bearer <user-JWT>
 *          Content-Type: application/json
 *          Body: { "action": "<action>", ...payload }
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isRateLimited } from "./kv_store.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ─── CORS Headers ────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Helper: JSON response ────────────────────────────────────────────────────
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ─── Helper: Verify caller JWT and return user ────────────────────────────────
async function getCallerUser(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const jwt = authHeader.replace("Bearer ", "").trim();
  if (!jwt) return null;

  // Use service-role client to verify the JWT
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await admin.auth.getUser(jwt);
  if (error || !data.user) return null;
  return data.user;
}

// ─── Action: verify_admin ─────────────────────────────────────────────────────
async function verifyAdmin(userId: string) {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await admin
    .from("admins")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error) return { isAdmin: false, error: error.message };
  return { isAdmin: !!data, error: null };
}

// ─── Action: record_donation ──────────────────────────────────────────────────
async function recordDonation(payload: {
  donor_id: string;
  amount: number;
  program: string;
  payment_method: string;
  stripe_payment_id?: string;
}) {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const receipt_number = `RCP-${Date.now()}`;

  // Insert donation row
  const { data: donation, error: insertError } = await admin
    .from("donations")
    .insert({
      ...payload,
      date: new Date().toISOString(),
      status: "completed",
      receipt_number,
    })
    .select()
    .single();

  if (insertError) return { donation: null, error: insertError.message };

  // Update donor totals atomically via RPC (ensure this function exists in Supabase)
  await admin.rpc("increment_donor_totals", {
    p_donor_id: payload.donor_id,
    p_amount: payload.amount,
  });

  return { donation, error: null };
}

// ─── Action: get_receipt_url ──────────────────────────────────────────────────
async function getReceiptUrl(receiptPath: string) {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await admin.storage
    .from("receipts")
    .createSignedUrl(receiptPath, 60 * 60); // 1 hour

  return { url: data?.signedUrl ?? null };
}

// ─── Action: get_admin_stats ──────────────────────────────────────────────────
async function getAdminStats() {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const [donorsRes, donationsRes, articlesRes, imagesRes] = await Promise.all([
    admin.from("donors").select("id", { count: "exact", head: true }),
    admin.from("donations").select("amount"),
    admin.from("articles").select("id", { count: "exact", head: true }),
    admin.from("gallery_images").select("id", { count: "exact", head: true }),
  ]);

  const totalDonations = (donationsRes.data ?? []).reduce(
    (sum: number, d: { amount: number }) => sum + (d.amount ?? 0),
    0
  );

  return {
    totalDonors: donorsRes.count ?? 0,
    totalDonations,
    publishedArticles: articlesRes.count ?? 0,
    galleryImages: imagesRes.count ?? 0,
  };
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Rate-limit by IP: max 60 requests per minute
  const clientIp =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const limited = await isRateLimited(clientIp, "api", 60, 60);
  if (limited) {
    return json({ error: "Too many requests. Please slow down." }, 429);
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { action, ...payload } = body;

  // Authenticate caller
  const user = await getCallerUser(req);
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  // Route to action handler
  switch (action) {
    case "verify_admin": {
      const result = await verifyAdmin(user.id);
      return json(result);
    }

    case "record_donation": {
      // Ensure donor is recording their own donation
      if (payload.donor_id !== user.id) {
        return json({ error: "Forbidden" }, 403);
      }
      const result = await recordDonation(payload as Parameters<typeof recordDonation>[0]);
      return json(result);
    }

    case "get_receipt_url": {
      if (typeof payload.receipt_path !== "string") {
        return json({ error: "receipt_path required" }, 400);
      }
      const result = await getReceiptUrl(payload.receipt_path);
      return json(result);
    }

    case "get_admin_stats": {
      const { isAdmin } = await verifyAdmin(user.id);
      if (!isAdmin) return json({ error: "Admin access required" }, 403);
      const stats = await getAdminStats();
      return json(stats);
    }

    default:
      return json({ error: `Unknown action: ${action}` }, 400);
  }
});
