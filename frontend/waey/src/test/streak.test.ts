import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  initStreak,
  getStreakState,
  getStreakFreezes,
  addStreakFreeze,
  consumeStreakFreeze,
  bumpStreak,
  restoreStreak,
  getPrizeInfo,
  tryClaimPrize,
} from "@/lib/streak";

beforeEach(() => {
  localStorage.clear();
});

function mockDate(iso: string) {
  vi.setSystemTime(new Date(iso));
}

describe("initStreak", () => {
  it("is a no-op", () => {
    expect(initStreak()).toBeUndefined();
  });
});

describe("getStreakState", () => {
  it("returns zero state by default", () => {
    const s = getStreakState();
    expect(s.count).toBe(0);
    expect(s.lastDay).toBeNull();
  });
});

describe("freeze functions", () => {
  it("getStreakFreezes returns 0 initially", () => {
    expect(getStreakFreezes()).toBe(0);
  });

  it("addStreakFreeze increases count", () => {
    addStreakFreeze(3);
    expect(getStreakFreezes()).toBe(3);
  });

  it("consumeStreakFreeze returns false when none available", () => {
    expect(consumeStreakFreeze()).toBe(false);
  });

  it("consumeStreakFreeze deducts one freeze", () => {
    addStreakFreeze(2);
    expect(consumeStreakFreeze()).toBe(true);
    expect(getStreakFreezes()).toBe(1);
  });
});

describe("bumpStreak", () => {
  it("sets count to 1 on first bump", () => {
    vi.useFakeTimers();
    mockDate("2025-06-15T00:00:00Z");
    const s = bumpStreak();
    expect(s.count).toBe(1);
    expect(s.lastDay).toBe("2025-06-15");
    vi.useRealTimers();
  });

  it("increments count on consecutive days", () => {
    vi.useFakeTimers();
    mockDate("2025-06-15T00:00:00Z");
    bumpStreak();

    mockDate("2025-06-16T00:00:00Z");
    const s = bumpStreak();
    expect(s.count).toBe(2);
    vi.useRealTimers();
  });

  it("resets to 1 after missing more than 1 day", () => {
    vi.useFakeTimers();
    mockDate("2025-06-15T00:00:00Z");
    bumpStreak();

    mockDate("2025-06-17T00:00:00Z");
    const s = bumpStreak();
    expect(s.count).toBe(1);
    vi.useRealTimers();
  });

  it("freeze protects a 1-day gap", () => {
    vi.useFakeTimers();
    mockDate("2025-06-15T00:00:00Z");
    bumpStreak();
    addStreakFreeze(1);

    mockDate("2025-06-17T00:00:00Z");
    const s = bumpStreak();
    expect(s.count).toBe(2);
    expect(s.freezeUsed).toBe(true);
    expect(getStreakFreezes()).toBe(0);
    vi.useRealTimers();
  });

  it("does not double-bump same day", () => {
    vi.useFakeTimers();
    mockDate("2025-06-15T00:00:00Z");
    bumpStreak();
    const s = bumpStreak();
    expect(s.count).toBe(1);
    vi.useRealTimers();
  });
});

describe("restoreStreak", () => {
  it("returns false when not enough points", () => {
    expect(restoreStreak()).toBe(false);
  });

  it("restores streak for 50 points", () => {
    vi.useFakeTimers();
    mockDate("2025-06-15T00:00:00Z");
    bumpStreak();
    localStorage.setItem("waey_points", JSON.stringify(100));

    mockDate("2025-06-17T00:00:00Z");
    expect(restoreStreak()).toBe(true);
    const s = getStreakState();
    expect(s.count).toBe(1);
    expect(s.lastDay).toBe("2025-06-16");
    expect(JSON.parse(localStorage.getItem("waey_points")!)).toBe(50);
    vi.useRealTimers();
  });
});

describe("getPrizeInfo", () => {
  it("returns null winner by default", () => {
    expect(getPrizeInfo().winner).toBeNull();
  });
});

describe("prize claim at 100", () => {
  it("claims prize when streak reaches 100", () => {
    vi.useFakeTimers();
    localStorage.setItem("waey_streak", JSON.stringify({ count: 99, lastDay: "2025-04-09" }));
    mockDate("2025-04-10T00:00:00Z");
    const s = bumpStreak();
    expect(s.count).toBe(100);
    // Manually trigger prize claim (no email to avoid async Supabase sync)
    tryClaimPrize("champ@test.com", 100);
    const prize = getPrizeInfo();
    expect(prize.winner).toBe("champ@test.com");
    expect(prize.claimedAt).toBeGreaterThan(0);
    vi.useRealTimers();
  });
});
