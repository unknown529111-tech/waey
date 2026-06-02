const STREAKS_KEY = "waey_streaks";
const PRIZE_KEY = "waey_prize";
const STREAK_INTERVAL = 300_000;
const TICK_INTERVAL = 10_000;

interface StreakData {
  count: number;
  accumulatedMs: number;
  lastTick: number;
  lastStreakDate: string;
}

interface PrizeData {
  winner: string | null;
  claimedAt: number | null;
}

function getStreaks(): Record<string, StreakData> {
  try {
    return JSON.parse(localStorage.getItem(STREAKS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStreaks(data: Record<string, StreakData>) {
  localStorage.setItem(STREAKS_KEY, JSON.stringify(data));
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

export function initStreak(email: string) {
  const streaks = getStreaks();
  if (!streaks[email]) {
    streaks[email] = { count: 0, accumulatedMs: 0, lastTick: Date.now(), lastStreakDate: "" };
    saveStreaks(streaks);
  }
}

export function tickStreak(email: string): { newStreak: boolean; count: number } {
  const streaks = getStreaks();
  const data = streaks[email];
  if (!data) return { newStreak: false, count: 0 };

  const now = Date.now();
  const elapsed = now - data.lastTick;
  if (elapsed > 0 && elapsed < 120_000) {
    data.accumulatedMs += elapsed;
  }
  data.lastTick = now;

  let newStreak = false;
  const today = new Date().toISOString().slice(0, 10);
  while (data.accumulatedMs >= STREAK_INTERVAL) {
    if (today !== data.lastStreakDate) {
      data.count += 1;
      data.lastStreakDate = today;
      newStreak = true;
    }
    data.accumulatedMs -= STREAK_INTERVAL;
  }

  saveStreaks(streaks);

  if (newStreak) {
    tryClaimPrize(email, data.count);
  }

  return { newStreak, count: data.count };
}

export function getStreak(email: string): StreakData {
  const streaks = getStreaks();
  return streaks[email] || { count: 0, accumulatedMs: 0, lastTick: 0, lastStreakDate: "" };
}

export function getAllStreaks(): Record<string, StreakData> {
  return getStreaks();
}

export function pauseStreak(email: string) {
  const streaks = getStreaks();
  if (streaks[email]) {
    streaks[email].lastTick = Date.now();
    saveStreaks(streaks);
  }
}

export function getPrizeInfo(): PrizeData {
  return getPrize();
}

function tryClaimPrize(email: string, count: number) {
  if (count < 100) return;
  const prize = getPrize();
  if (prize.winner) return;
  prize.winner = email;
  prize.claimedAt = Date.now();
  savePrize(prize);
}

export function getUsers(): Record<string, { name: string; password: string }> {
  try {
    return JSON.parse(localStorage.getItem("waey_users") || "{}");
  } catch {
    return {};
  }
}
export function resetPrize() {
  const key = "waey_prize";
  localStorage.setItem(key, JSON.stringify({ winner: null, claimedAt: null }));
}

