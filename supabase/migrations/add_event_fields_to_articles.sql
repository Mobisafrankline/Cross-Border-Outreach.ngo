-- ============================================================
-- Migration: Add event-specific fields to articles table
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Drop the old CHECK constraint on `type` (doesn't include 'events')
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_type_check;

-- 2. Re-add the CHECK constraint that now includes 'events'
ALTER TABLE articles
  ADD CONSTRAINT articles_type_check
  CHECK (type IN ('article', 'news', 'blog', 'story', 'events'));

-- 3. Add event-specific columns (safe: IF NOT EXISTS)
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS event_date       TEXT,
  ADD COLUMN IF NOT EXISTS event_time       TEXT,
  ADD COLUMN IF NOT EXISTS event_location   TEXT,
  ADD COLUMN IF NOT EXISTS event_address    TEXT,
  ADD COLUMN IF NOT EXISTS event_capacity   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS event_registered INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ticket_price     TEXT DEFAULT 'Free',
  ADD COLUMN IF NOT EXISTS event_status     TEXT DEFAULT 'upcoming',
  ADD COLUMN IF NOT EXISTS organizer        TEXT,
  ADD COLUMN IF NOT EXISTS contact_email    TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone    TEXT;

-- 4. Add CHECK on event_status
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_event_status_check;
ALTER TABLE articles
  ADD CONSTRAINT articles_event_status_check
  CHECK (event_status IN ('upcoming', 'past') OR event_status IS NULL);
