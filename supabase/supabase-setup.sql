-- ============================================================
--  Sohan Portfolio — Supabase Database Setup
--  Run this SQL in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Create the "messages" table for contact form submissions
CREATE TABLE IF NOT EXISTS messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (protects your data)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone (anonymous visitors) to INSERT messages
--    This lets website visitors submit the contact form
CREATE POLICY "Allow public inserts"
  ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. Only you (authenticated via Supabase Dashboard) can READ messages
--    Visitors cannot see other people's messages
CREATE POLICY "Only admin can read"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- ✅ Done! Your contact form will now save messages to this table.
