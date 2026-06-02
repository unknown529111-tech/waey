import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  initStreak,
  tickStreak,
  getStreak,
  getAllStreaks,
  pauseStreak,
  getPrizeInfo,
} from "@/lib/streak";

beforeEach(() => {
  localStorage.clear();
});

function mockDate(iso: string) {
  const now = new Date(iso).getTime();
  vi.setSystemTime(now);
}

describe("initStreak", () => {
  it("creates a streak entry for a new user", () => {
    vi.useFakeTimers();
    mockDate("2025-01-01T00:00:00Z");
    initStreak("user@test.com");
    const s = getStreak("user@test.com");
    expect(s.count).toBe(0);
    expect(s.accumulatedMs).toBe(0);
    expect(s.lastTick).toBeGreaterThan(0);
    vi.useRealTimers();
  });

  it("does not overwrite an existing streak", () => {
    vi.useFakeTimers();
    mockDate("2025-01-01T00:00:00Z");
    initStreak("user@test.com");
    const streaks = getAllStreaks();
    const originalTick = streaks["user@test.com"].lastTick;

    mockDate("2025-01-02T00:00:00Z");
    initStreak("user@test.com");
    const after = getAllStreaks();
    expect(after["user@test.com"].lastTick).toBe(originalTick);
    vi.useRealTimers();
  });
});

describe("tickStreak", () => {
  it("returns zero for uninitialized user", () => {
    const result = tickStreak("ghost@test.com");
    expect(result).toEqual({ newStreak: false, count: 0 });
  });

  it("grants a streak after accumulating 5 minutes (300s) via frequent ticks", () => {
    vi.useFakeTimers();
    mockDate("2025-01-01T00:00:00Z");
    initStreak("user@test.com");

    // Tick every 60 seconds (under 2min threshold) to accumulate 5 minutes
    for (let s = 60; s <= 300; s += 60) {
      mockDate(`2025-01-01T00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}Z`);
      const result = tickStreak("user@test.com");
      if (s >= 300) {
        expect(result.newStreak).toBe(true);
        expect(result.count).toBe(1);
      }
    }
    vi.useRealTimers();
  });

  it("ignores gaps longer than 2 minutes", () => {
    vi.useFakeTimers();
    mockDate("2025-01-01T00:00:00Z");
    initStreak("user@test.com");

    // First tick after 1 minute (under 2min)
    mockDate("2025-01-01T00:01:00Z");
    tickStreak("user@test.com");

    // Then a 10-minute gap
    mockDate("2025-01-01T00:11:00Z");
    const result = tickStreak("user@test.com");
    expect(result.newStreak).toBe(false);
    expect(result.count).toBe(0);
    vi.useRealTimers();
  });

  it("only grants one streak per day", () => {
    vi.useFakeTimers();
    mockDate("2025-01-01T00:00:00Z");
    initStreak("user@test.com");

    // Accumulate enough across several ticks
    for (let i = 0; i < 6; i++) {
      mockDate(`2025-01-01T00:0${i}:00Z`);
      tickStreak("user@test.com");
    }

    // Now count should be 1 (accumulated 5min of <2min intervals in 1 day)
    const result = getStreak("user@test.com");
    expect(result.count).toBe(1);
    vi.useRealTimers();
  });

  it("accumulates across multiple days", () => {
    vi.useFakeTimers();
    for (let day = 1; day <= 3; day++) {
      const dayStr = String(day).padStart(2, "0");
      mockDate(`2025-01-${dayStr}T00:00:00Z`);
      initStreak(`user@test.com`); // init only first time

      // Rapid ticks to accumulate 5+ minutes
      for (let m = 0; m < 6; m++) {
        mockDate(`2025-01-${dayStr}T00:0${m}:00Z`);
        tickStreak("user@test.com");
      }
    }

    const s = getStreak("user@test.com");
    expect(s.count).toBe(3);
    vi.useRealTimers();
  });
});

describe("getStreak", () => {
  it("returns a default for unknown user", () => {
    const s = getStreak("unknown");
    expect(s.count).toBe(0);
    expect(s.accumulatedMs).toBe(0);
  });

  it("returns data for initialized user", () => {
    vi.useFakeTimers();
    mockDate("2025-01-01T00:00:00Z");
    initStreak("known@test.com");
    const s = getStreak("known@test.com");
    expect(s.lastTick).toBeGreaterThan(0);
    vi.useRealTimers();
  });
});

describe("getAllStreaks", () => {
  it("returns empty object when none exist", () => {
    expect(getAllStreaks()).toEqual({});
  });

  it("returns all streaks", () => {
    vi.useFakeTimers();
    mockDate("2025-01-01T00:00:00Z");
    initStreak("a@test.com");
    initStreak("b@test.com");
    const all = getAllStreaks();
    expect(Object.keys(all).sort()).toEqual(["a@test.com", "b@test.com"]);
    vi.useRealTimers();
  });
});

describe("pauseStreak", () => {
  it("updates lastTick to now", () => {
    vi.useFakeTimers();
    mockDate("2025-01-01T00:00:00Z");
    initStreak("user@test.com");
    const before = getStreak("user@test.com").lastTick;

    mockDate("2025-01-01T05:00:00Z");
    pauseStreak("user@test.com");
    const after = getStreak("user@test.com").lastTick;
    expect(after).toBeGreaterThan(before);
    vi.useRealTimers();
  });
});

describe("getPrizeInfo", () => {
  it("returns default state", () => {
    const p = getPrizeInfo();
    expect(p.winner).toBeNull();
    expect(p.claimedAt).toBeNull();
  });

  it("awards prize at 100 streaks across separate days", () => {
    vi.useFakeTimers();
    // Simulate 100 separate days of streaks
    const base = new Date("2025-01-01T00:00:00Z").getTime();
    for (let day = 0; day < 100; day++) {
      vi.setSystemTime(base + day * 86400000); // each day + 1 day in ms
      if (day === 0) initStreak("champ@test.com");

      // Accumulate 5+ minutes via rapid ticks
      for (let m = 0; m < 6; m++) {
        vi.setSystemTime(base + day * 86400000 + m * 60000); // each minute
        tickStreak("champ@test.com");
      }
    }

    const p = getPrizeInfo();
    expect(p.winner).toBe("champ@test.com");
    expect(p.claimedAt).toBeGreaterThan(0);
    vi.useRealTimers();
  });
});
