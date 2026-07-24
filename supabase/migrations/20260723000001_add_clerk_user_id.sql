-- Add clerk_user_id to profiles for Clerk webhook sync
ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS clerk_user_id TEXT UNIQUE;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);