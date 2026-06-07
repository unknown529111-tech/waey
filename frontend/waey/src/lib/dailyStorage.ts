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
  "quote.item.0",
  "quote.item.1",
  "quote.item.2",
  "quote.item.3",
  "quote.item.4",
  "quote.item.5",
  "quote.item.6",
  "quote.item.7",
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
