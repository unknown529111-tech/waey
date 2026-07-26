-- Migration: Create all user-data tables for Supabase storage migration
-- This replaces localStorage as primary storage for all user data

-- ===== 1. Add user_id to existing profiles table =====
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Update RLS policies on profiles to use user_id
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;

CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ===== 2. User settings (lang, theme, notifications, premium) =====
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  lang TEXT DEFAULT 'ar',
  theme TEXT DEFAULT 'light',
  notification_categories TEXT[] DEFAULT ARRAY['صحة','مال','بيئة','تعليم','صحة نفسية','يومي'],
  premium_tier TEXT DEFAULT 'free',
  premium_activated_at TIMESTAMPTZ,
  onboarding_done BOOLEAN DEFAULT false,
  pwa_dismissed BOOLEAN DEFAULT false,
  pwa_installed BOOLEAN DEFAULT false,
  whats_new_seen BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== 3. Gamification (points, badges, stats) =====
CREATE TABLE IF NOT EXISTS gamification (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  unlocked_badges TEXT[] DEFAULT '{}',
  total_water_cups INTEGER DEFAULT 0,
  total_expenses_count INTEGER DEFAULT 0,
  total_challenges_done INTEGER DEFAULT 0,
  breathing_done INTEGER DEFAULT 0,
  gratitude_done INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== 4. Streaks =====
CREATE TABLE IF NOT EXISTS streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  last_day TEXT,
  freeze_used BOOLEAN DEFAULT false,
  freeze_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== 5. Daily entries (water, sleep, steps, eco, mood, energy, weight) =====
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_key TEXT NOT NULL,
  tracker_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_entries_unique ON daily_entries(user_id, date_key, tracker_type);
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date ON daily_entries(user_id, date_key);

-- ===== 6. Expenses =====
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_key TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  note TEXT,
  ts BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date_key);

-- ===== 7. Big3 =====
CREATE TABLE IF NOT EXISTS big3_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_key TEXT NOT NULL,
  item1 TEXT, item2 TEXT, item3 TEXT,
  done1 BOOLEAN DEFAULT false, done2 BOOLEAN DEFAULT false, done3 BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_big3_user_date ON big3_entries(user_id, date_key);

-- ===== 8. Journal (gratitude, achievement, lesson) =====
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_key TEXT NOT NULL,
  journal_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_journal_user_date_type ON journal_entries(user_id, date_key, journal_type);

-- ===== 9. Screens off =====
CREATE TABLE IF NOT EXISTS screens_off (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_key TEXT NOT NULL,
  value BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_screens_off_user_date ON screens_off(user_id, date_key);

-- ===== 10. Goals =====
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target NUMERIC NOT NULL,
  current NUMERIC DEFAULT 0,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);

-- ===== 11. Challenge records =====
CREATE TABLE IF NOT EXISTS challenge_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_key TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_challenge_user_date ON challenge_records(user_id, date_key);

-- ===== 12. Favorites =====
CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_ids TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== 13. Plans =====
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_days INTEGER[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_plans_user_plan ON plans(user_id, plan_id);

-- ===== 14. AI chat =====
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chat_user_created ON ai_chat_messages(user_id, created_at ASC);

-- ===== 15. Analytics =====
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  properties JSONB,
  ts BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_analytics_user_ts ON analytics_events(user_id, ts);

-- ===== 16. Admin items =====
CREATE TABLE IF NOT EXISTS admin_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_items_user_type ON admin_items(user_id, item_type);

-- ===== 17. Presence & Sessions (already exist, ensure RLS) =====
ALTER TABLE IF EXISTS presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sessions ENABLE ROW LEVEL SECURITY;

-- ===== Enable RLS on all tables =====
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE big3_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE screens_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_items ENABLE ROW LEVEL SECURITY;

-- ===== RLS Policies: users can CRUD only their own data =====
DROP POLICY IF EXISTS "users_select_user_settings" ON user_settings;
DROP POLICY IF EXISTS "users_insert_user_settings" ON user_settings;
DROP POLICY IF EXISTS "users_update_user_settings" ON user_settings;
DROP POLICY IF EXISTS "users_delete_user_settings" ON user_settings;
CREATE POLICY "users_select_user_settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_user_settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_user_settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_user_settings" ON user_settings FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_gamification" ON gamification;
DROP POLICY IF EXISTS "users_insert_gamification" ON gamification;
DROP POLICY IF EXISTS "users_update_gamification" ON gamification;
DROP POLICY IF EXISTS "users_delete_gamification" ON gamification;
CREATE POLICY "users_select_gamification" ON gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_gamification" ON gamification FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_gamification" ON gamification FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_gamification" ON gamification FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_streaks" ON streaks;
DROP POLICY IF EXISTS "users_insert_streaks" ON streaks;
DROP POLICY IF EXISTS "users_update_streaks" ON streaks;
DROP POLICY IF EXISTS "users_delete_streaks" ON streaks;
CREATE POLICY "users_select_streaks" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_streaks" ON streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_streaks" ON streaks FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_streaks" ON streaks FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_daily_entries" ON daily_entries;
DROP POLICY IF EXISTS "users_insert_daily_entries" ON daily_entries;
DROP POLICY IF EXISTS "users_update_daily_entries" ON daily_entries;
DROP POLICY IF EXISTS "users_delete_daily_entries" ON daily_entries;
CREATE POLICY "users_select_daily_entries" ON daily_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_daily_entries" ON daily_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_daily_entries" ON daily_entries FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_daily_entries" ON daily_entries FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_expenses" ON expenses;
DROP POLICY IF EXISTS "users_insert_expenses" ON expenses;
DROP POLICY IF EXISTS "users_update_expenses" ON expenses;
DROP POLICY IF EXISTS "users_delete_expenses" ON expenses;
CREATE POLICY "users_select_expenses" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_big3_entries" ON big3_entries;
DROP POLICY IF EXISTS "users_insert_big3_entries" ON big3_entries;
DROP POLICY IF EXISTS "users_update_big3_entries" ON big3_entries;
DROP POLICY IF EXISTS "users_delete_big3_entries" ON big3_entries;
CREATE POLICY "users_select_big3_entries" ON big3_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_big3_entries" ON big3_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_big3_entries" ON big3_entries FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_big3_entries" ON big3_entries FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_journal_entries" ON journal_entries;
DROP POLICY IF EXISTS "users_insert_journal_entries" ON journal_entries;
DROP POLICY IF EXISTS "users_update_journal_entries" ON journal_entries;
DROP POLICY IF EXISTS "users_delete_journal_entries" ON journal_entries;
CREATE POLICY "users_select_journal_entries" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_journal_entries" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_journal_entries" ON journal_entries FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_journal_entries" ON journal_entries FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_screens_off" ON screens_off;
DROP POLICY IF EXISTS "users_insert_screens_off" ON screens_off;
DROP POLICY IF EXISTS "users_update_screens_off" ON screens_off;
DROP POLICY IF EXISTS "users_delete_screens_off" ON screens_off;
CREATE POLICY "users_select_screens_off" ON screens_off FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_screens_off" ON screens_off FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_screens_off" ON screens_off FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_screens_off" ON screens_off FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_goals" ON goals;
DROP POLICY IF EXISTS "users_insert_goals" ON goals;
DROP POLICY IF EXISTS "users_update_goals" ON goals;
DROP POLICY IF EXISTS "users_delete_goals" ON goals;
CREATE POLICY "users_select_goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_goals" ON goals FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_goals" ON goals FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_challenge_records" ON challenge_records;
DROP POLICY IF EXISTS "users_insert_challenge_records" ON challenge_records;
DROP POLICY IF EXISTS "users_update_challenge_records" ON challenge_records;
DROP POLICY IF EXISTS "users_delete_challenge_records" ON challenge_records;
CREATE POLICY "users_select_challenge_records" ON challenge_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_challenge_records" ON challenge_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_challenge_records" ON challenge_records FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_challenge_records" ON challenge_records FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_favorites" ON favorites;
DROP POLICY IF EXISTS "users_insert_favorites" ON favorites;
DROP POLICY IF EXISTS "users_update_favorites" ON favorites;
DROP POLICY IF EXISTS "users_delete_favorites" ON favorites;
CREATE POLICY "users_select_favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_favorites" ON favorites FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_plans" ON plans;
DROP POLICY IF EXISTS "users_insert_plans" ON plans;
DROP POLICY IF EXISTS "users_update_plans" ON plans;
DROP POLICY IF EXISTS "users_delete_plans" ON plans;
CREATE POLICY "users_select_plans" ON plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_plans" ON plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_plans" ON plans FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_plans" ON plans FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_ai_chat_messages" ON ai_chat_messages;
DROP POLICY IF EXISTS "users_insert_ai_chat_messages" ON ai_chat_messages;
DROP POLICY IF EXISTS "users_update_ai_chat_messages" ON ai_chat_messages;
DROP POLICY IF EXISTS "users_delete_ai_chat_messages" ON ai_chat_messages;
CREATE POLICY "users_select_ai_chat_messages" ON ai_chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_ai_chat_messages" ON ai_chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_ai_chat_messages" ON ai_chat_messages FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_ai_chat_messages" ON ai_chat_messages FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "users_insert_analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "users_update_analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "users_delete_analytics_events" ON analytics_events;
CREATE POLICY "users_select_analytics_events" ON analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_analytics_events" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_analytics_events" ON analytics_events FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_analytics_events" ON analytics_events FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select_admin_items" ON admin_items;
DROP POLICY IF EXISTS "users_insert_admin_items" ON admin_items;
DROP POLICY IF EXISTS "users_update_admin_items" ON admin_items;
DROP POLICY IF EXISTS "users_delete_admin_items" ON admin_items;
CREATE POLICY "users_select_admin_items" ON admin_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_admin_items" ON admin_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_admin_items" ON admin_items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_admin_items" ON admin_items FOR DELETE USING (auth.uid() = user_id);
