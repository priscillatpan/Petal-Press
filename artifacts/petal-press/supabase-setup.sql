-- ============================================================
-- Petal Press — Supabase production setup
-- Run in: Supabase dashboard → SQL Editor → New query
-- ============================================================

-- 1. Add user_id column (links each flower to its owner)
ALTER TABLE flowers
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Enable Row Level Security
ALTER TABLE flowers ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies — users can only see/touch their own flowers
CREATE POLICY "Users can view own flowers"
  ON flowers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flowers"
  ON flowers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flowers"
  ON flowers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flowers"
  ON flowers FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Assign existing flowers to your account
--    Sign into the app first, then replace the email below with yours and run this:
UPDATE flowers
SET user_id = (
  SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE' LIMIT 1
)
WHERE user_id IS NULL;

-- 5. Shared floriography meanings cache
--    Stores AI-generated meanings keyed by species so we only ever
--    pay for a new OpenAI lookup once per species, globally.
CREATE TABLE IF NOT EXISTS flower_meanings (
  scientific_name TEXT PRIMARY KEY,
  common_name TEXT,
  meaning TEXT NOT NULL,
  nickname TEXT NOT NULL,
  theme TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE flower_meanings ENABLE ROW LEVEL SECURITY;

-- Anyone (including the anon key used by the Vercel function) can read the cache
CREATE POLICY "Anyone can read flower meanings"
  ON flower_meanings FOR SELECT
  USING (true);

-- Anyone can add a new cached meaning (non-sensitive shared data, no user info)
CREATE POLICY "Anyone can insert flower meanings"
  ON flower_meanings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update flower meanings"
  ON flower_meanings FOR UPDATE
  USING (true);

-- 6. Theme tag on each flower — closed set of floriography categories,
--    used for the "By Meaning" browse view. Also add to flower_meanings
--    cache above (already included) so re-lookups carry the theme too.
ALTER TABLE flowers
  ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'joy';

ALTER TABLE flower_meanings
  ADD COLUMN IF NOT EXISTS theme TEXT;

-- ============================================================
-- Supabase Auth settings — do in the dashboard UI:
--
-- Authentication → Settings:
--   Site URL:      https://your-domain.vercel.app
--   Redirect URLs: https://your-domain.vercel.app/**
--
-- Authentication → Providers → Email:
--   Email provider is on by default — no changes needed.
--   "Confirm email" stays ON (magic link handles it).
--
-- Storage → flower-images bucket → Policies:
--   Add "Allow authenticated uploads":
--     INSERT for authenticated users, bucket_id = 'flower-images'
--   Add "Allow authenticated reads":
--     SELECT for authenticated users, bucket_id = 'flower-images'
-- ============================================================

-- Vercel env vars to add (Settings → Environment Variables):
--   PLANTNET_API_KEY   = (your Pl@ntNet key)
--   OPENAI_API_KEY     = (your OpenAI key, from platform.openai.com)
--   SUPABASE_URL       = (same value as VITE_SUPABASE_URL, no VITE_ prefix —
--                         needed because Vercel functions don't read Vite's
--                         client-side env vars)
--   SUPABASE_ANON_KEY  = (same value as VITE_SUPABASE_ANON_KEY, no VITE_ prefix)
--   VITE_SUPABASE_URL  = (your Supabase project URL)
--   VITE_SUPABASE_ANON_KEY = (your Supabase anon key)
-- ============================================================
