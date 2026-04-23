/**
 * kv_store.ts
 * A simple key-value store helper backed by Deno KV.
 * Used by the Edge Function server for lightweight caching,
 * rate-limiting, and session tracking without a DB round-trip.
 */

const kv = await Deno.openKv();

/**
 * Store a value under a namespaced key with an optional TTL (in seconds).
 */
export async function kvSet(
  namespace: string,
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> {
  const options = ttlSeconds ? { expireIn: ttlSeconds * 1000 } : undefined;
  await kv.set([namespace, key], value, options);
}

/**
 * Retrieve a value from the store.
 * Returns null if the key does not exist or has expired.
 */
export async function kvGet<T = unknown>(
  namespace: string,
  key: string
): Promise<T | null> {
  const entry = await kv.get<T>([namespace, key]);
  return entry.value;
}

/**
 * Delete a value from the store.
 */
export async function kvDelete(namespace: string, key: string): Promise<void> {
  await kv.delete([namespace, key]);
}

/**
 * Increment a numeric counter atomically. Returns the new value.
 * Useful for rate-limiting (e.g., failed login attempts).
 */
export async function kvIncrement(
  namespace: string,
  key: string,
  ttlSeconds?: number
): Promise<number> {
  const current = (await kvGet<number>(namespace, key)) ?? 0;
  const next = current + 1;
  await kvSet(namespace, key, next, ttlSeconds);
  return next;
}

/**
 * Rate-limit helper.
 * Returns true if the request should be blocked (limit exceeded).
 */
export async function isRateLimited(
  ip: string,
  action: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const count = await kvIncrement(`ratelimit:${action}`, ip, windowSeconds);
  return count > limit;
}
