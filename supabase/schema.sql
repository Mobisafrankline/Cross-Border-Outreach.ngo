-- ============================================================
-- Cross-Border Outreach NGO — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Donors ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donors (
  id              UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email           TEXT UNIQUE NOT NULL,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  phone           TEXT,
  address         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  total_donated   NUMERIC DEFAULT 0,
  donation_count  INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','inactive'))
);

ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors can view own profile"
  ON donors FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Donors can update own profile"
  ON donors FOR UPDATE USING (auth.uid() = id);

-- Admins can see all donors (service role bypasses RLS by default)

-- ── 2. Donations ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id          UUID REFERENCES donors(id) ON DELETE SET NULL,
  amount            NUMERIC NOT NULL CHECK (amount > 0),
  program           TEXT NOT NULL,
  date              TIMESTAMPTZ DEFAULT NOW(),
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed')),
  payment_method    TEXT,
  stripe_payment_id TEXT,
  receipt_number    TEXT UNIQUE
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors can view own donations"
  ON donations FOR SELECT USING (auth.uid() = donor_id);

-- ── 3. Gallery Images ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_images (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url         TEXT NOT NULL,
  alt         TEXT,
  title       TEXT,
  category    TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public can read gallery images
CREATE POLICY "Anyone can view gallery"
  ON gallery_images FOR SELECT USING (true);

-- Only authenticated users can upload (admin check via Edge Function)
CREATE POLICY "Authenticated users can insert gallery"
  ON gallery_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Uploader can delete their images"
  ON gallery_images FOR DELETE USING (auth.uid() = uploaded_by);

-- ── 4. Articles ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type           TEXT NOT NULL CHECK (type IN ('article','news','blog','story')),
  title          TEXT NOT NULL,
  excerpt        TEXT,
  content        TEXT,
  author         TEXT,
  category       TEXT,
  featured_image TEXT,
  tags           TEXT[] DEFAULT '{}',
  status         TEXT DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public can view published articles
CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT USING (status = 'published');

-- Authenticated users can manage articles (admin-only enforced via Edge Function)
CREATE POLICY "Authenticated users can manage articles"
  ON articles FOR ALL USING (auth.role() = 'authenticated');

-- ── 5. Admins ─────────────────────────────────────────────────
-- Simple allowlist — insert the UUID of each admin user here.
CREATE TABLE IF NOT EXISTS admins (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name  TEXT,
  phone      TEXT,
  location   TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only service role (Edge Function) reads this table.
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION register_admin(
  secret_code TEXT,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF secret_code = 'Cr055-B0rder5@2s4' THEN
    INSERT INTO admins (id, first_name, last_name, phone, location) 
    VALUES (auth.uid(), p_first_name, p_last_name, p_phone, p_location) 
    ON CONFLICT (id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      phone = EXCLUDED.phone,
      location = EXCLUDED.location;
  ELSE
    RAISE EXCEPTION 'Invalid admin code';
  END IF;
END;
$$;

-- ── 6. RPC: increment_donor_totals ────────────────────────────
-- Called by the Edge Function after a successful donation.
CREATE OR REPLACE FUNCTION increment_donor_totals(
  p_donor_id UUID,
  p_amount   NUMERIC
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE donors
  SET
    total_donated  = total_donated + p_amount,
    donation_count = donation_count + 1
  WHERE id = p_donor_id;
END;
$$;

-- ── 7. Storage Buckets ────────────────────────────────────────
-- Run these in the Supabase Storage UI or via the API.
-- Bucket: images (public)  — for gallery uploads
-- Bucket: receipts (private) — for donation receipts
--
-- Dashboard → Storage → New Bucket
--   Name: images    | Public: true
--   Name: receipts  | Public: false
