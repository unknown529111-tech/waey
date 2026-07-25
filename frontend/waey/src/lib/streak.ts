import { queueUpsert } from "@/lib/offlineQueue";

const STREAK_KEY = "waey_streak";
const FREEZES_KEY = "waey_streak_freezes";
const PRIZE_KEY = "waey_prize";

export type StreakState = { count: number; lastDay: string | null; freezeUsed?: boolean };

interface PrizeData {
  winner: string | null;
  claimedAt: number | null;
}

// ---- Lazy Supabase client ----
async function getSupabase() {
  try {
    const { supabase } = await import("@/supabase/client");
    return supabase;
  } catch {
    return null;
  }
}

// ---- LocalStorage helpers ----
function localDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lastDay: null };
  } catch {
    return { count: 0, lastDay: null };
  }
}

function saveStreak(s: StreakState) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(s));
}

function getPrize(): PrizeData {
  try {
    return JSON.parse(localStorage.getItem(PRIZE_KEY) || '{"winner":null,"claimedAt":null}');
  } catch {
    return { winner: null, claimedAt: null };
  }
}

function savePrize(data: PrizeData) {
  localStorage.setItem(PRIZE_KEY, JSON.stringify(data));
}

// ---- Supabase sync ----
async function syncProfile(email: string, name: string, streak: StreakState) {
  const profileRecord = {
    email,
    name,
    streak_count: streak.count,
    last_streak_date: streak.lastDay,
    updated_at: new Date().toISOString(),
  };
  const sb = await getSupabase();
  if (!sb) {
    queueUpsert("profiles", profileRecord, "email");
    return;
  }
  try {
    const { error } = await sb.from("profiles").upsert(profileRecord, { onConflict: "email" });
    if (error) queueUpsert("profiles", profileRecord, "email");
  } catch {
    queueUpsert("profiles", profileRecord, "email");
  }
}

async function syncPrize(data: PrizeData) {
  const sb = await getSupabase();
  if (!sb) return;
  try {
    await sb.from("prize").delete().neq("id", 0);
    if (data.winner) {
      await sb.from("prize").insert({
        winner_email: data.winner,
        claimed_at: new Date(data.claimedAt!).toISOString(),
      });
    }
  } catch { /* offline, ignore */ }
}

// ---- Public streak API ----

/** No-op for backward compat */
export function initStreak(): void {}

/** Get current streak state */
export const getStreakState = (): StreakState => getStreak();

/** Freeze functions */
export function getStreakFreezes(): number {
  try {
    return JSON.parse(localStorage.getItem(FREEZES_KEY) || "0");
  } catch {
    return 0;
  }
}

export function addStreakFreeze(count = 1) {
  localStorage.setItem(FREEZES_KEY, JSON.stringify(getStreakFreezes() + count));
}

export function consumeStreakFreeze(): boolean {
  const current = getStreakFreezes();
  if (current <= 0) return false;
  localStorage.setItem(FREEZES_KEY, JSON.stringify(current - 1));
  return true;
}

/** Bump the streak for a new active day */
export const bumpStreak = (email?: string): StreakState => {
  const today = localDateString();
  const s = getStreak();
  if (s.lastDay === today) return s;

  const yesterday = localDateString(new Date(Date.now() - 86400000));
  const dayBeforeYesterday = localDateString(new Date(Date.now() - 2 * 86400000));

  let count = 1;
  let freezeUsed = false;

  if (s.lastDay === yesterday) {
    count = s.count + 1;
  } else if (s.lastDay === dayBeforeYesterday && getStreakFreezes() > 0) {
    consumeStreakFreeze();
    count = s.count + 1;
    freezeUsed = true;
  }

  const next = { count, lastDay: today, freezeUsed };
  saveStreak(next);

  if (email) {
    tryClaimPrize(email, count);
    syncProfile(email, "", next);
  }

  return next;
};

/** Restore streak using points */
export function restoreStreak(email?: string): boolean {
  const pointsKey = "waey_points";
  let points = 0;
  try {
    const raw = localStorage.getItem(pointsKey);
    if (!raw) return false;
    points = JSON.parse(raw);
  } catch {
    return false;
  }
  if (points < 50) return false;

  const current = getStreak();
  const yesterday = localDateString(new Date(Date.now() - 86400000));
  const restoredCount = Math.max(current.count, 1);

  const next: StreakState = { count: restoredCount, lastDay: yesterday };
  saveStreak(next);
  localStorage.setItem(pointsKey, JSON.stringify(points - 50));

  if (email) syncProfile(email, "", next);
  return true;
}

// ---- Prize system ----

export function getPrizeInfo(): PrizeData {
  return getPrize();
}

export function tryClaimPrize(email: string, count: number) {
  if (count < 100) return;
  const prize = getPrize();
  if (prize.winner) return;
  prize.winner = email;
  prize.claimedAt = Date.now();
  savePrize(prize);
  syncPrize(prize);
}

// ---- Fetch from Supabase (for admin) ----

export async function fetchSupabaseUsers(): Promise<{ email: string; name: string; streak_count: number }[]> {
  const sb = await getSupabase();
  if (!sb) return [];
  try {
    const { data } = await sb.from("profiles").select("email, name, streak_count").order("streak_count", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function fetchSupabasePrize(): Promise<{ winner_email: string; claimed_at: string } | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const { data } = await sb.from("prize").select("winner_email, claimed_at").limit(1).single();
    return data || null;
  } catch {
    return null;
  }
}
