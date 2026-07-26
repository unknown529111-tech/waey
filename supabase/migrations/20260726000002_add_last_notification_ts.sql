-- Add last_notification_ts column to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS last_notification_ts TIMESTAMPTZ;
