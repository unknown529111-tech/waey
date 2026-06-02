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
export type StreakState = { count: number; lastDay: string | null };

export const getStreak = (): StreakState =>
  readJSON<StreakState>(STREAK_KEY, { count: 0, lastDay: null });

export const bumpStreak = (): StreakState => {
  const today = todayKey();
  const s = getStreak();
  if (s.lastDay === today) return s;
  const yesterday = todayKey(new Date(Date.now() - 86400000));
  const next: StreakState = {
    count: s.lastDay === yesterday ? s.count + 1 : 1,
    lastDay: today,
  };
  writeJSON(STREAK_KEY, next);
  return next;
};

// ==================== CHALLENGES (daily) ====================
export type ChallengeDef = { emoji: string; text: string; area: string };

export const CHALLENGES: ChallengeDef[] = [
  { emoji: "💧", text: "اشرب 8 أكواب مياه اليوم.", area: "صحة" },
  { emoji: "💰", text: "وفّر 20 جنيه ولا تشتري قهوة جاهزة.", area: "مال" },
  { emoji: "💡", text: "أطفئ الأنوار في كل غرفة فاضية.", area: "بيئة" },
  { emoji: "🚶", text: "امشِ 20 دقيقة متواصلة.", area: "صحة" },
  { emoji: "♻️", text: "افصل البلاستيك عن باقي القمامة اليوم.", area: "بيئة" },
  { emoji: "📒", text: "اكتب كل مصاريف اليوم بدون استثناء.", area: "مال" },
  { emoji: "😴", text: "نَم 7 ساعات على الأقل الليلة.", area: "صحة" },
  { emoji: "🌿", text: "اروِ نبتة أو ازرع بذرة في البلكونة.", area: "بيئة" },
  { emoji: "🍎", text: "استبدل الوجبة الخفيفة بفاكهة.", area: "صحة" },
  { emoji: "💵", text: "حوّل 5% من دخلك اليوم لحساب التوفير.", area: "مال" },
  { emoji: "🧘", text: "خصص 5 دقائق لتنفس عميق وهدوء.", area: "صحة" },
  { emoji: "🚿", text: "قلّل وقت الاستحمام لـ 5 دقائق.", area: "بيئة" },
  { emoji: "📵", text: "ابتعد عن الموبايل ساعة قبل النوم.", area: "صحة" },
  { emoji: "🥤", text: "استخدم زجاجة قابلة لإعادة الاستخدام.", area: "بيئة" },
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
};

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
  "الصحة تاج على رؤوس الأصحاء.",
  "القرش الأبيض ينفع في اليوم الأسود.",
  "التغيير الحقيقي يبدأ بخطوة صغيرة كل يوم.",
  "الأرض ليست ميراثًا من آبائنا، بل أمانة من أبنائنا.",
  "من جدّ وجد، ومن زرع حصد.",
  "ادّخر قرشًا اليوم، تجد جنيهًا غدًا.",
  "اشرب الماء يصفو ذهنك.",
  "ابتسم، فالابتسامة صدقة.",
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

export const getDailyQuote = () => {
  const d = new Date();
  const dayNum = Math.floor(d.getTime() / 86400000);
  const all = getMergedQuotes();
  return all[dayNum % all.length];
};
