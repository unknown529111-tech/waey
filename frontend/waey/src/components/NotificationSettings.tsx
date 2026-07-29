import { useState } from "react";
import { Bell, BellOff, Mail } from "lucide-react";
import { requestNotificationPermission } from "@/lib/notifications";
import { getUserId, syncUserSettings } from "@/lib/supabaseStorage";
import { getEmailReminderEnabled, setEmailReminderEnabled } from "@/lib/emailReminder";
import { useT } from "@/contexts/useLanguage";
import { toast } from "sonner";

const SETTINGS_KEY = "waey_notif_categories";

const NotificationSettings = () => {
  const t = useT();

  const CATEGORIES = [
    { id: "health", label: t('notif.cat.health'), default: true },
    { id: "finance", label: t('notif.cat.finance'), default: true },
    { id: "environment", label: t('notif.cat.environment'), default: true },
    { id: "education", label: t('notif.cat.education'), default: true },
    { id: "mental", label: t('notif.cat.mental'), default: true },
    { id: "daily", label: t('notif.cat.daily'), default: true },
  ];

  const getSaved = (): string[] => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return CATEGORIES.filter((c) => c.default).map((c) => c.id);
  };

  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return "Notification" in window && Notification.permission === "granted";
  });
  const [selected, setSelected] = useState(getSaved);

  const togglePermission = async () => {
    if (!enabled) {
      const result = await requestNotificationPermission();
      setEnabled(result === "granted");
    }
  };

  const toggleCategory = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setSelected(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    const uid = getUserId();
    if (uid) syncUserSettings(uid);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {enabled ? <Bell className="size-5 text-primary" /> : <BellOff className="size-5 text-destructive" />}
          <h3 className="font-bold">{t('notif.title')}</h3>
        </div>
        <button
          onClick={togglePermission}
          className={`text-xs font-bold rounded-full px-3 py-1.5 transition-colors ${
            enabled
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {enabled ? t('notif.enabled') : t('notif.disabled')}
        </button>
      </div>

      {enabled && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`text-[11px] font-bold rounded-full px-3 py-1.5 transition-colors ${
                selected.includes(cat.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
        <p className="text-[10px] text-muted-foreground mt-3">
          {t('notif.footnote')}
        </p>

        <div className="mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-primary" />
              <h3 className="font-bold text-sm">{t('email.title')}</h3>
            </div>
            <button
              onClick={() => {
                const next = !getEmailReminderEnabled();
                setEmailReminderEnabled(next);
                toast.success(next ? t('email.toast.on') : t('email.toast.off'));
              }}
              className={`text-xs font-bold rounded-full px-3 py-1.5 transition-colors ${
                getEmailReminderEnabled()
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {getEmailReminderEnabled() ? t('email.enabled') : t('email.disabled')}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            {t('email.description')}
          </p>
        </div>
      </div>
  );
};

export default NotificationSettings;
