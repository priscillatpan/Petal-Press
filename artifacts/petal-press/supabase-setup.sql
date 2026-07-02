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
--   VITE_SUPABASE_URL  = (your Supabase project URL)
--   VITE_SUPABASE_ANON_KEY = (your Supabase anon key)
-- ============================================================
