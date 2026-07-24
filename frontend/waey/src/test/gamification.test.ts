import { describe, it, expect, beforeEach } from "vitest";
import {
  getUserPoints,
  addPoints,
  deductPoints,
  getUnlockedBadgeIds,
  unlockBadge,
  evaluateBadges,
  recordActivity,
  BADGES,
} from "@/lib/gamification";
import {
  getStreakFreezes,
  addStreakFreeze,
  consumeStreakFreeze,
  bumpStreak,
  getStreak,
  writeJSON,
  todayKey,
} from "@/lib/dailyStorage";

describe("Gamification & Retention Features", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Points System", () => {
    it("starts with 0 points", () => {
      expect(getUserPoints()).toBe(0);
    });

    it("adds points correctly", () => {
      addPoints(50);
      expect(getUserPoints()).toBe(50);
    });

    it("deducts points when sufficient balance exists", () => {
      addPoints(100);
      const success = deductPoints(40);
      expect(success).toBe(true);
      expect(getUserPoints()).toBe(60);
    });

    it("prevents deduction when points are insufficient", () => {
      addPoints(20);
      const success = deductPoints(50);
      expect(success).toBe(false);
      expect(getUserPoints()).toBe(20);
    });
  });

  describe("Badge Unlocking", () => {
    it("starts with empty unlocked badges", () => {
      expect(getUnlockedBadgeIds()).toEqual([]);
    });

    it("unlocks a badge and awards bonus points", () => {
      const initialPts = getUserPoints();
      const unlocked = unlockBadge("first_step");
      expect(unlocked).toBe(true);
      expect(getUnlockedBadgeIds()).toContain("first_step");
      expect(getUserPoints()).toBe(initialPts + 25);
    });

    it("does not re-unlock an already unlocked badge", () => {
      unlockBadge("first_step");
      const ptsAfterFirst = getUserPoints();
      const unlockedAgain = unlockBadge("first_step");
      expect(unlockedAgain).toBe(false);
      expect(getUserPoints()).toBe(ptsAfterFirst);
    });

    it("evaluates badges automatically when activities are recorded", () => {
      recordActivity("gratitude");
      expect(getUnlockedBadgeIds()).toContain("gratitude_heart");
    });
  });

  describe("Streak Freeze Grace Period", () => {
    it("manages freeze inventory correctly", () => {
      expect(getStreakFreezes()).toBe(0);
      addStreakFreeze(2);
      expect(getStreakFreezes()).toBe(2);
      const used = consumeStreakFreeze();
      expect(used).toBe(true);
      expect(getStreakFreezes()).toBe(1);
    });

    it("preserves streak during a 1-day missed gap if freeze is active", () => {
      addStreakFreeze(1);
      // Simulate streak last logged day before yesterday
      const twoDaysAgo = todayKey(new Date(Date.now() - 2 * 86400000));
      writeJSON("waey_streak", { count: 5, lastDay: twoDaysAgo });

      const next = bumpStreak();
      expect(next.count).toBe(6);
      expect(next.freezeUsed).toBe(true);
      expect(getStreakFreezes()).toBe(0); // consumed
    });
  });
});
