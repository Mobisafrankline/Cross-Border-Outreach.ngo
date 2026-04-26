-- ============================================================
-- Cross-Border Outreach NGO — Supabase Database Schema (IDEMPOTENT)
-- Safe to re-run: drops existing policies before recreating them.
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

DROP POLICY IF EXISTS "Donors can view own profile"   ON donors;
DROP POLICY IF EXISTS "Donors can insert own profile" ON donors;
DROP POLICY IF EXISTS "Donors can update own profile" ON donors;

CREATE POLICY "Donors can view own profile"
  ON donors FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Donors can insert own profile"
  ON donors FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Donors can update own profile"
  ON donors FOR UPDATE USING (auth.uid() = id);


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

DROP POLICY IF EXISTS "Donors can view own donations"   ON donations;
DROP POLICY IF EXISTS "Donors can insert own donations" ON donations;

CREATE POLICY "Donors can view own donations"
  ON donations FOR SELECT USING (auth.uid() = donor_id);

CREATE POLICY "Donors can insert own donations"
  ON donations FOR INSERT
  WITH CHECK (auth.uid() = donor_id);


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

DROP POLICY IF EXISTS "Anyone can view gallery"              ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can insert gallery" ON gallery_images;
DROP POLICY IF EXISTS "Uploader can delete their images"    ON gallery_images;

CREATE POLICY "Anyone can view gallery"
  ON gallery_images FOR SELECT USING (true);

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

DROP POLICY IF EXISTS "Anyone can read published articles"      ON articles;
DROP POLICY IF EXISTS "Authenticated users can manage articles" ON articles;

CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can manage articles"
  ON articles FOR ALL USING (auth.role() = 'authenticated');


-- ── 5. Admins ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name  TEXT,
  phone      TEXT,
  location   TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view own record"   ON admins;
DROP POLICY IF EXISTS "Admins can insert own record" ON admins;
DROP POLICY IF EXISTS "Admins can update own record" ON admins;

CREATE POLICY "Admins can view own record"
  ON admins FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can insert own record"
  ON admins FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update own record"
  ON admins FOR UPDATE USING (auth.uid() = id);


-- ── 5a. register_admin RPC ────────────────────────────────────
CREATE OR REPLACE FUNCTION register_admin(
  secret_code  TEXT,
  p_first_name TEXT DEFAULT NULL,
  p_last_name  TEXT DEFAULT NULL,
  p_phone      TEXT DEFAULT NULL,
  p_location   TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF secret_code = 'Cr055-B0rder5@2s4' THEN
    INSERT INTO admins (id, first_name, last_name, phone, location)
    VALUES (auth.uid(), p_first_name, p_last_name, p_phone, p_location)
    ON CONFLICT (id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name  = EXCLUDED.last_name,
      phone      = EXCLUDED.phone,
      location   = EXCLUDED.location;
  ELSE
    RAISE EXCEPTION 'Invalid admin code';
  END IF;
END;
$$;

-- ── 5b. get_all_system_users RPC ────────────────────────────────────
-- Allows fetching all auth users and joining with admins/donors tables to determine role.
CREATE OR REPLACE FUNCTION get_all_system_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  user_type TEXT,
  first_name TEXT,
  last_name TEXT
)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT 
    au.id,
    au.email::text,
    COALESCE(a.phone, d.phone, au.phone::text, au.raw_user_meta_data->>'phone') AS phone,
    au.created_at,
    au.last_sign_in_at,
    CASE 
      WHEN a.id IS NOT NULL THEN 'Admin'
      WHEN d.id IS NOT NULL THEN 'Donor'
      ELSE 'User'
    END AS user_type,
    COALESCE(a.first_name, d.first_name, au.raw_user_meta_data->>'first_name') AS first_name,
    COALESCE(a.last_name, d.last_name, au.raw_user_meta_data->>'last_name') AS last_name
  FROM auth.users au
  LEFT JOIN admins a ON au.id = a.id
  LEFT JOIN donors d ON au.id = d.id
  ORDER BY au.created_at DESC;
$$;


-- ── 6. RPC: increment_donor_totals ────────────────────────────
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
-- Create these manually in Supabase Dashboard → Storage → New Bucket:
--   Name: images    | Public: true   (gallery uploads)
--   Name: receipts  | Public: false  (donation receipts)