-- Create profiles table for syncing users & streaks
CREATE TABLE IF NOT EXISTS profiles (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  streak_count INTEGER DEFAULT 0,
  accumulated_ms BIGINT DEFAULT 0,
  last_tick BIGINT DEFAULT 0,
  last_streak_date TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create prize table
CREATE TABLE IF NOT EXISTS prize (
  id SERIAL PRIMARY KEY,
  winner_email TEXT REFERENCES profiles(email),
  claimed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read/insert/update profiles (anon key access)
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Prize: anyone can read, anyone with service_key can manage
CREATE POLICY "Anyone can read prize"
  ON prize FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage prize"
  ON prize FOR ALL
  USING (true)
  WITH CHECK (true);
