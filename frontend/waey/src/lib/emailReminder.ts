import { getUserId, syncUserSettings } from "@/lib/supabaseStorage";

const EMAIL_REMINDER_KEY = "waey_email_reminder";

export function getEmailReminderEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(EMAIL_REMINDER_KEY) === "true";
  } catch {
    return false;
  }
}

export function setEmailReminderEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EMAIL_REMINDER_KEY, enabled ? "true" : "false");
    const uid = getUserId();
    if (uid) syncUserSettings(uid);
  } catch { /* ignore */ }
}
