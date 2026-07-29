import { getUserId, syncLastNotifTs } from "@/lib/supabaseStorage";

const SETTINGS_KEY = "waey_notif_categories";

// Notification tips are stored with locale keys; call getLocalizedNotifTips(t) to get translated versions for the current language
export interface NotifTip {
  titleKey: string;
  bodyKey: string;
  area: string;
  title?: string;
  body?: string;
}

export const NOTIF_TIPS: NotifTip[] = [
  { titleKey: "notif.tip.title.health", bodyKey: "notif.tip.body.water", area: "health", title: "وعي · صحة", body: "اشرب كوباية مية دلوقتي 💧 جسمك بيشكرك." },
  { titleKey: "notif.tip.title.finance", bodyKey: "notif.tip.body.expense", area: "finance", title: "وعي · مال", body: "سجّل مصروف النهارده في يومي علشان متنساش." },
  { titleKey: "notif.tip.title.environment", bodyKey: "notif.tip.body.light", area: "environment", title: "وعي · بيئة", body: "اطفي نور مش محتاجه — كهربا أقل وفاتورة أقل." },
  { titleKey: "notif.tip.title.education", bodyKey: "notif.tip.body.pomodoro", area: "education", title: "وعي · تعليم", body: "جلسة بومودورو 25 دقيقة دلوقتي تفرق جدًا." },
  { titleKey: "notif.tip.title.health", bodyKey: "notif.tip.body.move", area: "health", title: "وعي · صحة", body: "قوم اتحرك دقيقتين، الجلوس الطويل بيتعب الظهر." },
  { titleKey: "notif.tip.title.finance", bodyKey: "notif.tip.body.budget", area: "finance", title: "وعي · مال", body: "راجع ميزانيتك الأسبوع ده — فيه بند تقدر توفر منه؟" },
  { titleKey: "notif.tip.title.environment", bodyKey: "notif.tip.body.charger", area: "environment", title: "وعي · بيئة", body: "افصل الشاحن من الكهربا لما الموبايل يكمل شحن." },
  { titleKey: "notif.tip.title.education", bodyKey: "notif.tip.body.explain", area: "education", title: "وعي · تعليم", body: "اشرح اللي ذاكرته لحد تاني — الشرح بثبّت المعلومة." },
  { titleKey: "notif.tip.title.health", bodyKey: "notif.tip.body.breathe", area: "health", title: "وعي · صحة", body: "خد نفس عميق 4 ثواني، احبسه 4، طلّعه 4. يهدّيك." },
  { titleKey: "notif.tip.title.daily", bodyKey: "notif.tip.body.daily", area: "daily", title: "وعي · يومي", body: "افتح قسم يومي وعلّم على عاداتك علشان تكمل ستريك." },
  { titleKey: "notif.tip.title.mental", bodyKey: "notif.tip.body.breathe2", area: "mental", title: "وعي · صحة نفسية", body: "جرب التنفس 4-4-6: شهيق 4، احبس 4، زفير 6." },
  { titleKey: "notif.tip.title.mental", bodyKey: "notif.tip.body.walk", area: "mental", title: "وعي · صحة نفسية", body: "خذ 5 دقائق تمشية هادية — العقل بيحتاج تغيير." },
];

// Helper to get localized notification tips
export function getLocalizedTip(t: (key: string) => string, tip: NotifTip): { title: string; body: string } {
  return {
    title: t(tip.titleKey),
    body: t(tip.bodyKey),
  };
}

const LAST_KEY = "waey_last_notif_ts";
const INTERVAL_MS = 2 * 60 * 60 * 1000;

const getEnabledAreas = (): string[] => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return ["health", "finance", "environment", "education", "daily", "mental"];
};

// Store a reference to the current t function for scheduled notifications
let currentT: ((key: string) => string) | null = null;
export function setNotifT(tFn: (key: string) => string) {
  currentT = tFn;
}

const pickTip = () => {
  const enabled = getEnabledAreas();
  const filtered = NOTIF_TIPS.filter((t) => enabled.includes(t.area));
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

const fire = () => {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const tip = pickTip();
  if (!tip) return;
  try {
    const localized = currentT ? getLocalizedTip(currentT, tip) : { title: tip.title || "", body: tip.body || "" };
    new Notification(localized.title, { body: localized.body, icon: "/icon-192.png", badge: "/icon-192.png" });
    localStorage.setItem(LAST_KEY, String(Date.now()));
    const uid = getUserId();
    if (uid) syncLastNotifTs(uid);
  } catch {
    /* ignore */
  }
};

export const requestNotificationPermission = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "default") {
    try {
      return await Notification.requestPermission();
    } catch {
      return "denied";
    }
  }
  return Notification.permission;
};

export const startNotificationScheduler = () => {
  if (typeof window === "undefined" || !("Notification" in window)) return () => {};
  const tick = () => {
    if (Notification.permission !== "granted") return;
    const last = Number(localStorage.getItem(LAST_KEY) || "0");
    if (Date.now() - last >= INTERVAL_MS) fire();
  };
  const initTimer = window.setTimeout(tick, 15_000);
  const interval = window.setInterval(tick, 5 * 60 * 1000);
  return () => {
    window.clearTimeout(initTimer);
    window.clearInterval(interval);
  };
};
