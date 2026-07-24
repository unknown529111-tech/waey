// Lightweight localStorage utilities for daily trackers
// All values are namespaced and stored per-day where relevant

export const todayKey = (d: Date = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const lastNDays = (n: number): string[] => {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(todayKey(d));
  }
  return out;
};

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// Per-day numeric tracker (water cups, sleep hours, etc.)
export type DailyMap = Record<string, number>;

export const getDailyMap = (key: string): DailyMap =>
  readJSON<DailyMap>(`waey_${key}`, {});

export const setDailyValue = (key: string, value: number, date = todayKey()) => {
  const map = getDailyMap(key);
  map[date] = value;
  writeJSON(`waey_${key}`, map);
};

export const getDailyValue = (key: string, date = todayKey()): number =>
  getDailyMap(key)[date] ?? 0;

// Per-day list tracker (expenses)
export type ExpenseEntry = { id: string; amount: number; category: string; note?: string; ts: number };
export const getExpenses = (date = todayKey()): ExpenseEntry[] =>
  readJSON<ExpenseEntry[]>(`waey_expenses_${date}`, []);
export const addExpense = (e: Omit<ExpenseEntry, "id" | "ts">, date = todayKey()) => {
  const list = getExpenses(date);
  list.push({ ...e, id: crypto.randomUUID(), ts: Date.now() });
  writeJSON(`waey_expenses_${date}`, list);
};
export const removeExpense = (id: string, date = todayKey()) => {
  writeJSON(
    `waey_expenses_${date}`,
    getExpenses(date).filter((x) => x.id !== id)
  );
};

// Streak: increments when user completes any tracker on a new day
const STREAK_KEY = "waey_streak";
const FREEZES_KEY = "waey_streak_freezes";

export type StreakState = { count: number; lastDay: string | null; freezeUsed?: boolean };

export const getStreak = (): StreakState =>
  readJSON<StreakState>(STREAK_KEY, { count: 0, lastDay: null });

export function getStreakFreezes(): number {
  return readJSON<number>(FREEZES_KEY, 0);
}

export function addStreakFreeze(count = 1) {
  writeJSON(FREEZES_KEY, getStreakFreezes() + count);
}

export function consumeStreakFreeze(): boolean {
  const current = getStreakFreezes();
  if (current <= 0) return false;
  writeJSON(FREEZES_KEY, current - 1);
  return true;
}

export const bumpStreak = (): StreakState => {
  const today = todayKey();
  const s = getStreak();
  if (s.lastDay === today) return s;

  const yesterday = todayKey(new Date(Date.now() - 86400000));
  const dayBeforeYesterday = todayKey(new Date(Date.now() - 2 * 86400000));

  let count = 1;
  let freezeUsed = false;

  if (s.lastDay === yesterday) {
    count = s.count + 1;
  } else if (s.lastDay === dayBeforeYesterday && getStreakFreezes() > 0) {
    // 1-day grace period protected by a streak freeze!
    consumeStreakFreeze();
    count = s.count + 1;
    freezeUsed = true;
  }

  const next: StreakState = {
    count,
    lastDay: today,
    freezeUsed,
  };
  writeJSON(STREAK_KEY, next);
  return next;
};

export function restoreStreak(): boolean {
  const pointsKey = "waey_points";
  const points = readJSON<number>(pointsKey, 0);
  if (points < 50) return false;

  const current = getStreak();
  const yesterday = todayKey(new Date(Date.now() - 86400000));
  const restoredCount = Math.max(current.count, 1);

  const next: StreakState = {
    count: restoredCount,
    lastDay: yesterday,
    freezeUsed: false,
  };
  writeJSON(STREAK_KEY, next);
  writeJSON(pointsKey, points - 50);
  return true;
}

// ==================== CHALLENGES (daily) ====================
export type ChallengeDef = { emoji: string; text: string; area: string };

export const CHALLENGES: ChallengeDef[] = [
  { emoji: "💧", text: "challenge.item.0.text", area: "challenge.item.0.area" },
  { emoji: "💰", text: "challenge.item.1.text", area: "challenge.item.1.area" },
  { emoji: "💡", text: "challenge.item.2.text", area: "challenge.item.2.area" },
  { emoji: "🚶", text: "challenge.item.3.text", area: "challenge.item.3.area" },
  { emoji: "♻️", text: "challenge.item.4.text", area: "challenge.item.4.area" },
  { emoji: "📒", text: "challenge.item.5.text", area: "challenge.item.5.area" },
  { emoji: "😴", text: "challenge.item.6.text", area: "challenge.item.6.area" },
  { emoji: "🌿", text: "challenge.item.7.text", area: "challenge.item.7.area" },
  { emoji: "🍎", text: "challenge.item.8.text", area: "challenge.item.8.area" },
  { emoji: "💵", text: "challenge.item.9.text", area: "challenge.item.9.area" },
  { emoji: "🧘", text: "challenge.item.10.text", area: "challenge.item.10.area" },
  { emoji: "🚿", text: "challenge.item.11.text", area: "challenge.item.11.area" },
  { emoji: "📵", text: "challenge.item.12.text", area: "challenge.item.12.area" },
  { emoji: "🥤", text: "challenge.item.13.text", area: "challenge.item.13.area" },
];

function getMergedChallenges(): ChallengeDef[] {
  const admin = getAdminChallengesRaw();
  return [...CHALLENGES, ...admin];
}

function getAdminChallengesRaw(): ChallengeDef[] {
  try {
    const raw = localStorage.getItem("waey_admin_challenges");
    return raw ? JSON.parse(raw).map((c: Record<string, unknown>) => ({ emoji: c.emoji, text: c.text, area: c.area })) : [];
  } catch { return []; }
}

export const getDailyChallenge = () => {
  const d = new Date();
  const dayNum = Math.floor(d.getTime() / 86400000);
  const all = getMergedChallenges();
  return all[dayNum % all.length];
}

const CHALLENGE_DONE_KEY = "waey_challenge_done";
export const isChallengeDone = (date = todayKey()) =>
  readJSON<Record<string, boolean>>(CHALLENGE_DONE_KEY, {})[date] === true;
export const markChallengeDone = (date = todayKey()) => {
  const map = readJSON<Record<string, boolean>>(CHALLENGE_DONE_KEY, {});
  map[date] = true;
  writeJSON(CHALLENGE_DONE_KEY, map);
};

// Mood: per day store value 1..5
export const setMood = (v: number) => setDailyValue("mood", v);
export const getMood = () => getDailyValue("mood");

// ==================== QUOTES (daily) ====================
export const QUOTES: string[] = [
  // الصحة (1-25)
  "صحتك أغلى من أي ثروة.",
  "الوقاية خير من العلاج.",
  "الحركة اليومية سر الحياة.",
  "النوم الجيد نصف الصحة.",
  "الماء دواء مجاني.",
  "الغذاء الصحي استثمار للمستقبل.",
  "لا تؤجل فحصك الطبي.",
  "العقل السليم في الجسم السليم.",
  "قلل السكر تزد صحتك.",
  "الرياضة عادة وليست مناسبة.",
  "التوازن أساس الصحة.",
  "الراحة تعيد للجسم قوته.",
  "التدخين يسرق العمر.",
  "ابتسم، فالراحة النفسية علاج.",
  "كل باعتدال تعش بصحة.",
  "الصحة تبدأ من طبقك.",
  "لا تهمل إشارات جسدك.",
  "اشرب الماء قبل أن تشعر بالعطش.",
  "الصحة نعمة لا تُقدّر بثمن.",
  "النشاط يزيد الإنتاج.",
  "الصحة النفسية لا تقل أهمية عن الجسدية.",
  "دقائق من المشي خير من ساعات من الكسل.",
  "الوقاية تبدأ بالعادات اليومية.",
  "كل لقمة تؤثر في مستقبلك.",
  "حافظ على صحتك قبل أن تضطر للبحث عنها.",

  // المال (26-50)
  "ادخر اليوم لتطمئن غدًا.",
  "لا تنفق أكثر مما تكسب.",
  "المال خادم جيد وسيد سيئ.",
  "الاستثمار يصنع المستقبل.",
  "الميزانية طريق الاستقرار.",
  "القليل المستمر خير من الكثير المنقطع.",
  "لا تجعل الديون عادة.",
  "المعرفة تزيد قيمة المال.",
  "خطط قبل أن تشتري.",
  "كل جنيه له قيمة.",
  "الإنفاق الواعي يوفر الكثير.",
  "النجاح المالي يبدأ بالانضباط.",
  "لا تشتري ما لا تحتاج.",
  "الادخار عادة الأغنياء.",
  "المال يحتاج إلى إدارة لا إلى أمنيات.",
  "استثمر في نفسك أولًا.",
  "لا تجعل العاطفة تقود قراراتك المالية.",
  "الدخل الجيد يحتاج إلى إدارة جيدة.",
  "الصبر مفتاح النجاح المالي.",
  "الوقت يصنع قيمة الاستثمار.",
  "المال وسيلة لا غاية.",
  "تعلم قبل أن تستثمر.",
  "لا تؤجل أهدافك المالية.",
  "النجاح المالي يبدأ بخطوة صغيرة.",
  "الحكمة في الإنفاق أغنى من كثرة الدخل.",

  // البيئة (51-75)
  "الأرض بيتنا جميعًا.",
  "ازرع شجرة تزرع حياة.",
  "النظافة مسؤولية الجميع.",
  "الماء نعمة فلا تهدره.",
  "البيئة النظيفة صحة للجميع.",
  "قلل النفايات تحمِ الطبيعة.",
  "إعادة التدوير عادة حضارية.",
  "كل قطرة ماء لها قيمة.",
  "حافظ على الهواء نقيًا.",
  "الطبيعة أمانة في أعناقنا.",
  "لا ترمِ القمامة في غير مكانها.",
  "الطاقة مسؤولية مشتركة.",
  "ازرع اليوم لتحصد غدًا.",
  "البيئة الصحية تصنع مجتمعًا أفضل.",
  "وفر الكهرباء تحافظ على الموارد.",
  "الأرض لا تحتاجنا، نحن من نحتاجها.",
  "احترام البيئة احترام للحياة.",
  "قلل البلاستيك تحمِ الكوكب.",
  "الطبيعة تكافئ من يحافظ عليها.",
  "ابدأ بنفسك في حماية البيئة.",
  "كل عمل صغير يصنع فرقًا كبيرًا.",
  "الشجرة هدية للأجيال القادمة.",
  "لا تلوث ما لا تستطيع إصلاحه.",
  "البيئة النظيفة مسؤولية وليست خيارًا.",
  "حماية البيئة استثمار في المستقبل.",

  // التعليم (76-100)
  "العلم نور.",
  "التعلم لا يتوقف.",
  "اقرأ لتكبر فكريًا.",
  "المعرفة قوة.",
  "السؤال بداية الفهم.",
  "كل يوم فرصة لتعلم جديد.",
  "النجاح يبدأ بالتعلم.",
  "الكتاب خير صديق.",
  "التعليم يفتح الأبواب.",
  "لا تخجل من التعلم.",
  "الخبرة تكمل المعرفة.",
  "التعلم استثمار لا يخسر.",
  "العلم يبني الأمم.",
  "المثابرة طريق التفوق.",
  "الفشل خطوة نحو النجاح.",
  "التعلم يصنع المستقبل.",
  "الفضول مفتاح الإبداع.",
  "المعرفة تزيد بالعمل.",
  "العقل ينمو بالقراءة.",
  "اجعل التعلم عادة يومية.",
  "الوقت الذي تقضيه في التعلم لا يضيع.",
  "لا تتوقف عن تطوير نفسك.",
  "المعلم يزرع والأجيال تحصد.",
  "العلم يرفع صاحبه.",
  "من تعلم اليوم قاد الغد.",
];

function getMergedQuotes(): string[] {
  const admin = getAdminQuotesRaw();
  return [...QUOTES, ...admin];
}

function getAdminQuotesRaw(): string[] {
  try {
    const raw = localStorage.getItem("waey_admin_quotes");
    return raw ? JSON.parse(raw).map((q: Record<string, unknown>) => q.text as string) : [];
  } catch { return []; }
}

// Seeded random for deterministic daily quote (same for all users on same day)
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const getDailyQuote = () => {
  const d = new Date();
  const dayNum = Math.floor(d.getTime() / 86400000);
  const all = getMergedQuotes();
  if (all.length === 0) return "";
  const idx = Math.floor(seededRandom(dayNum) * all.length);
  return all[idx];
};