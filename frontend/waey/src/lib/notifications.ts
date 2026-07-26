import { getUserId, syncLastNotifTs } from "@/lib/supabaseStorage";

const SETTINGS_KEY = "waey_notif_categories";

const TIPS = [
  { title: "وعي · صحة", body: "اشرب كوباية مية دلوقتي 💧 جسمك بيشكرك.", area: "صحة" },
  { title: "وعي · مال", body: "سجّل مصروف النهارده في يومي علشان متنساش.", area: "مال" },
  { title: "وعي · بيئة", body: "اطفي نور مش محتاجه — كهربا أقل وفاتورة أقل.", area: "بيئة" },
  { title: "وعي · تعليم", body: "جلسة بومودورو 25 دقيقة دلوقتي تفرق جدًا.", area: "تعليم" },
  { title: "وعي · صحة", body: "قوم اتحرك دقيقتين، الجلوس الطويل بيتعب الظهر.", area: "صحة" },
  { title: "وعي · مال", body: "راجع ميزانيتك الأسبوع ده — فيه بند تقدر توفر منه؟", area: "مال" },
  { title: "وعي · بيئة", body: "افصل الشاحن من الكهربا لما الموبايل يكمل شحن.", area: "بيئة" },
  { title: "وعي · تعليم", body: "اشرح اللي ذاكرته لحد تاني — الشرح بثبّت المعلومة.", area: "تعليم" },
  { title: "وعي · صحة", body: "خد نفس عميق 4 ثواني، احبسه 4، طلّعه 4. يهدّيك.", area: "صحة" },
  { title: "وعي · يومي", body: "افتح قسم يومي وعلّم على عاداتك علشان تكمل ستريك.", area: "يومي" },
  { title: "وعي · صحة نفسية", body: "جرب التنفس 4-4-6: شهيق 4، احبس 4، زفير 6.", area: "صحة نفسية" },
  { title: "وعي · صحة نفسية", body: "خذ 5 دقائق تمشية هادية — العقل بيحتاج تغيير.", area: "صحة نفسية" },
];

const LAST_KEY = "waey_last_notif_ts";
const INTERVAL_MS = 2 * 60 * 60 * 1000;

const getEnabledAreas = (): string[] => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return ["صحة", "مال", "بيئة", "تعليم", "يومي"];
};

const pickTip = () => {
  const enabled = getEnabledAreas();
  const filtered = TIPS.filter((t) => enabled.includes(t.area));
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

const fire = () => {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const t = pickTip();
  if (!t) return;
  try {
    new Notification(t.title, { body: t.body, icon: "/icon-192.png", badge: "/icon-192.png" });
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
