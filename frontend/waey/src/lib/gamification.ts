// Gamification & Milestone Badges Engine for Waey (وعي)
import { getDailyValue, readJSON, writeJSON, todayKey } from "./dailyStorage";
import { getStreakState } from "@/lib/streak";

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: "streak" | "water" | "mindfulness" | "finance" | "challenge";
  reqValue: number;
}

export const BADGES: Badge[] = [
  {
    id: "first_step",
    emoji: "🥉",
    title: "خطوة الأولى",
    description: "أكملت أول نشاط لك في المنصة",
    category: "streak",
    reqValue: 1,
  },
  {
    id: "streak_7",
    emoji: "🥈",
    title: "التزام أسبوعي",
    description: "حافظت على سلسلة وعي لمدة 7 أيام متتالية",
    category: "streak",
    reqValue: 7,
  },
  {
    id: "streak_30",
    emoji: "🥇",
    title: "إنجاز شهري",
    description: "وصلت لسلسلة 30 يوماً من الوعي والتوازن",
    category: "streak",
    reqValue: 30,
  },
  {
    id: "streak_100",
    emoji: "👑",
    title: "بطل وعي",
    description: "100 يوم من الإنجاز والتغيير الإيجابي المستمر",
    category: "streak",
    reqValue: 100,
  },
  {
    id: "water_8",
    emoji: "💧",
    title: "ارتواء تام",
    description: "شربت 8 أكواب مياه في يوم واحد",
    category: "water",
    reqValue: 8,
  },
  {
    id: "water_100",
    emoji: "🌊",
    title: "سيد الهيدرات",
    description: "وصلت لمجموع 100 كوب مياه مشربة",
    category: "water",
    reqValue: 100,
  },
  {
    id: "breathing_peace",
    emoji: "🧘",
    title: "لحظة هدوء",
    description: "أكملت تمرين التنفس واسترخيت",
    category: "mindfulness",
    reqValue: 1,
  },
  {
    id: "gratitude_heart",
    emoji: "📝",
    title: "قلب شاكر",
    description: "دونّت في دفتر الامتنان اليومي",
    category: "mindfulness",
    reqValue: 1,
  },
  {
    id: "finance_wise",
    emoji: "💰",
    title: "وعي مالي",
    description: "سجّلت 5 مصروفات لمتابعة ميزانيتك",
    category: "finance",
    reqValue: 5,
  },
  {
    id: "challenge_hero",
    emoji: "🌟",
    title: "بطل التحديات",
    description: "أنجزت 5 تحديات يومية",
    category: "challenge",
    reqValue: 5,
  },
];

const UNLOCKED_BADGES_KEY = "waey_unlocked_badges";
const POINTS_KEY = "waey_points";
const STATS_KEY = "waey_stats";

export interface UserStats {
  totalWaterCups: number;
  totalExpensesCount: number;
  totalChallengesDone: number;
  breathingDone: number;
  gratitudeDone: number;
}

export function getUserStats(): UserStats {
  return readJSON<UserStats>(STATS_KEY, {
    totalWaterCups: 0,
    totalExpensesCount: 0,
    totalChallengesDone: 0,
    breathingDone: 0,
    gratitudeDone: 0,
  });
}

export function saveUserStats(stats: UserStats) {
  writeJSON(STATS_KEY, stats);
}

export function getUnlockedBadgeIds(): string[] {
  return readJSON<string[]>(UNLOCKED_BADGES_KEY, []);
}

export function unlockBadge(badgeId: string): boolean {
  const current = getUnlockedBadgeIds();
  if (current.includes(badgeId)) return false;
  const updated = [...current, badgeId];
  writeJSON(UNLOCKED_BADGES_KEY, updated);
  addPoints(25); // Award +25 bonus points per badge unlocked
  return true;
}

// Points system
export function getUserPoints(): number {
  return readJSON<number>(POINTS_KEY, 0);
}

export function addPoints(pts: number): number {
  const current = getUserPoints();
  const next = current + pts;
  writeJSON(POINTS_KEY, next);
  return next;
}

export function deductPoints(pts: number): boolean {
  const current = getUserPoints();
  if (current < pts) return false;
  writeJSON(POINTS_KEY, current - pts);
  return true;
}

export function getEffectiveStreakCount(): number {
  return getStreakState().count;
}

// Evaluate unlocked badges based on current activity
export function evaluateBadges(): string[] {
  const unlocked = getUnlockedBadgeIds();
  const newlyUnlocked: string[] = [];

  const streakCount = getEffectiveStreakCount();
  const stats = getUserStats();
  const todayWater = getDailyValue("water");

  BADGES.forEach((b) => {
    if (unlocked.includes(b.id)) return;

    let qualifies = false;
    switch (b.id) {
      case "first_step":
        qualifies = streakCount >= 1 || stats.totalWaterCups > 0 || stats.gratitudeDone > 0;
        break;
      case "streak_7":
        qualifies = streakCount >= 7;
        break;
      case "streak_30":
        qualifies = streakCount >= 30;
        break;
      case "streak_100":
        qualifies = streakCount >= 100;
        break;
      case "water_8":
        qualifies = todayWater >= 8;
        break;
      case "water_100":
        qualifies = stats.totalWaterCups >= 100;
        break;
      case "breathing_peace":
        qualifies = stats.breathingDone >= 1;
        break;
      case "gratitude_heart":
        qualifies = stats.gratitudeDone >= 1;
        break;
      case "finance_wise":
        qualifies = stats.totalExpensesCount >= 5;
        break;
      case "challenge_hero":
        qualifies = stats.totalChallengesDone >= 5;
        break;
    }

    if (qualifies) {
      const added = unlockBadge(b.id);
      if (added) newlyUnlocked.push(b.id);
    }
  });

  return newlyUnlocked;
}

// Helper to track activity completion and add points
export function recordActivity(type: "water" | "expense" | "challenge" | "breathing" | "gratitude", count = 1) {
  const stats = getUserStats();

  switch (type) {
    case "water":
      stats.totalWaterCups += count;
      break;
    case "expense":
      stats.totalExpensesCount += count;
      break;
    case "challenge":
      stats.totalChallengesDone += count;
      break;
    case "breathing":
      stats.breathingDone += count;
      break;
    case "gratitude":
      stats.gratitudeDone += count;
      break;
  }

  saveUserStats(stats);
  addPoints(25);
  const newlyUnlocked = evaluateBadges();
  if (newlyUnlocked.length > 0) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("waey-badges-updated", { detail: newlyUnlocked }));
    }
  }
}
