import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { requestNotificationPermission } from "@/lib/notifications";

const CATEGORIES = [
  { id: "صحة", label: "الصحة", default: true },
  { id: "مال", label: "المالية", default: true },
  { id: "بيئة", label: "البيئة", default: true },
  { id: "تعليم", label: "التعليم", default: true },
  { id: "صحة نفسية", label: "الصحة النفسية", default: true },
  { id: "يومي", label: "يومي", default: true },
];

const SETTINGS_KEY = "waey_notif_categories";

const getSaved = (): string[] => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return CATEGORIES.filter((c) => c.default).map((c) => c.id);
};

const NotificationSettings = () => {
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
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {enabled ? <Bell className="size-5 text-primary" /> : <BellOff className="size-5 text-destructive" />}
          <h3 className="font-bold">إعدادات الإشعارات</h3>
        </div>
        <button
          onClick={togglePermission}
          className={`text-xs font-bold rounded-full px-3 py-1.5 transition-colors ${
            enabled
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {enabled ? "مفعلة" : "فعّل الإشعارات"}
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
        الإشعارات بتظهر كل ساعتين بنصائح من الأقسام اللي تختارها.
      </p>
    </div>
  );
};

export default NotificationSettings;
