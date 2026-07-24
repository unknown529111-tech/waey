import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  todayKey,
  lastNDays,
  readJSON,
  writeJSON,
  getDailyMap,
  setDailyValue,
  getDailyValue,
  getExpenses,
  addExpense,
  removeExpense,
  getStreak,
  bumpStreak,
  restoreStreak,
  getDailyChallenge,
  isChallengeDone,
  markChallengeDone,
  getDailyQuote,
  setMood,
  getMood,
} from "@/lib/dailyStorage";

beforeEach(() => {
  localStorage.clear();
});

// Helper to freeze a date
function mockDate(iso: string) {
  const now = new Date(iso).getTime();
  vi.setSystemTime(now);
}

describe("todayKey", () => {
  it("returns YYYY-MM-DD for today", () => {
    const result = todayKey();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns correct key for a specific date", () => {
    const d = new Date(2025, 0, 15); // Jan 15, 2025
    expect(todayKey(d)).toBe("2025-01-15");
  });

  it("pads single-digit month and day", () => {
    const d = new Date(2025, 8, 5); // Sep 5, 2025
    expect(todayKey(d)).toBe("2025-09-05");
  });
});

describe("lastNDays", () => {
  it("returns N strings in descending order", () => {
    vi.useFakeTimers();
    mockDate("2025-03-20T12:00:00Z");
    const days = lastNDays(3);
    expect(days).toEqual(["2025-03-18", "2025-03-19", "2025-03-20"]);
    vi.useRealTimers();
  });

  it("returns 1 day for n=1", () => {
    vi.useFakeTimers();
    mockDate("2025-01-01T12:00:00Z");
    expect(lastNDays(1)).toEqual(["2025-01-01"]);
    vi.useRealTimers();
  });
});

describe("readJSON / writeJSON", () => {
  it("returns fallback when key is missing", () => {
    expect(readJSON("nonexistent", 42)).toBe(42);
  });

  it("reads what was written", () => {
    writeJSON("test_key", { a: 1, b: "hello" });
    expect(readJSON("test_key", null)).toEqual({ a: 1, b: "hello" });
  });

  it("returns fallback on corrupt data", () => {
    localStorage.setItem("corrupt", "not-json");
    expect(readJSON("corrupt", "fallback")).toBe("fallback");
  });
});

describe("DailyMap (getDailyMap / setDailyValue / getDailyValue)", () => {
  it("starts empty", () => {
    expect(getDailyMap("water")).toEqual({});
  });

  it("sets and gets a value", () => {
    setDailyValue("water", 8, "2025-03-15");
    expect(getDailyValue("water", "2025-03-15")).toBe(8);
  });

  it("returns 0 for missing date", () => {
    expect(getDailyValue("water", "2099-01-01")).toBe(0);
  });

  it("stores multiple keys independently", () => {
    setDailyValue("water", 8, "2025-03-10");
    setDailyValue("sleep", 7, "2025-03-10");
    expect(getDailyValue("water", "2025-03-10")).toBe(8);
    expect(getDailyValue("sleep", "2025-03-10")).toBe(7);
  });

  it("overwrites existing value", () => {
    setDailyValue("water", 4, "2025-03-01");
    setDailyValue("water", 6, "2025-03-01");
    expect(getDailyValue("water", "2025-03-01")).toBe(6);
  });
});

describe("expenses (getExpenses / addExpense / removeExpense)", () => {
  it("starts empty", () => {
    expect(getExpenses("2025-01-01")).toEqual([]);
  });

  it("adds an expense with generated id and ts", () => {
    addExpense({ amount: 50, category: "طعام" }, "2025-01-01");
    const list = getExpenses("2025-01-01");
    expect(list).toHaveLength(1);
    expect(list[0].amount).toBe(50);
    expect(list[0].category).toBe("طعام");
    expect(list[0].id).toBeDefined();
    expect(list[0].ts).toBeGreaterThan(0);
  });

  it("removes an expense by id", () => {
    addExpense({ amount: 30, category: "مواصلات" }, "2025-02-01");
    const [first] = getExpenses("2025-02-01");
    removeExpense(first.id, "2025-02-01");
    expect(getExpenses("2025-02-01")).toEqual([]);
  });

  it("stores expenses per-date independently", () => {
    addExpense({ amount: 10, category: "أ" }, "2025-01-01");
    addExpense({ amount: 20, category: "ب" }, "2025-01-02");
    expect(getExpenses("2025-01-01")).toHaveLength(1);
    expect(getExpenses("2025-01-02")).toHaveLength(1);
  });
});

describe("streak (getStreak / bumpStreak)", () => {
  it("starts at 0 with null lastDay", () => {
    const s = getStreak();
    expect(s.count).toBe(0);
    expect(s.lastDay).toBeNull();
  });

  it("bumps to 1 on first completion", () => {
    vi.useFakeTimers();
    mockDate("2025-06-01T10:00:00Z");
    const s = bumpStreak();
    expect(s.count).toBe(1);
    expect(s.lastDay).toBe("2025-06-01");
    vi.useRealTimers();
  });

  it("does not double-bump same day", () => {
    vi.useFakeTimers();
    mockDate("2025-06-01T10:00:00Z");
    bumpStreak();
    const s2 = bumpStreak();
    expect(s2.count).toBe(1);
    vi.useRealTimers();
  });

  it("increments on consecutive days", () => {
    vi.useFakeTimers();
    mockDate("2025-06-01T10:00:00Z");
    bumpStreak();
    mockDate("2025-06-02T10:00:00Z");
    const s = bumpStreak();
    expect(s.count).toBe(2);
    expect(s.lastDay).toBe("2025-06-02");
    vi.useRealTimers();
  });

  it("resets to 1 after a gap", () => {
    vi.useFakeTimers();
    mockDate("2025-06-01T10:00:00Z");
    bumpStreak();
    mockDate("2025-06-05T10:00:00Z"); // 4-day gap
    const s = bumpStreak();
    expect(s.count).toBe(1);
    expect(s.lastDay).toBe("2025-06-05");
    vi.useRealTimers();
  });

  it("restores streak when user has enough points", () => {
    vi.useFakeTimers();
    mockDate("2025-06-01T10:00:00Z");
    bumpStreak(); // streak count = 1, lastDay = 2025-06-01

    // 5-day gap without activity
    mockDate("2025-06-06T10:00:00Z");

    // Initially fails with < 50 points
    expect(restoreStreak()).toBe(false);

    // Give points
    writeJSON("waey_points", 100);

    // Now restore succeeds
    expect(restoreStreak()).toBe(true);

    // Points deducted
    expect(readJSON<number>("waey_points", 0)).toBe(50);

    // Last day set to yesterday (2025-06-05)
    const current = getStreak();
    expect(current.lastDay).toBe("2025-06-05");

    // Bumping today (2025-06-06) continues the streak to count = 2
    const updated = bumpStreak();
    expect(updated.count).toBe(2);
    expect(updated.lastDay).toBe("2025-06-06");

    vi.useRealTimers();
  });
});

describe("daily challenge", () => {
  it("returns a challenge with emoji, text, and area (i18n keys)", () => {
    const c = getDailyChallenge();
    expect(c.emoji).toBeTruthy();
    expect(c.text).toMatch(/^challenge\.item\.\d+\.text$/);
    expect(c.area).toMatch(/^challenge\.item\.\d+\.area$/);
  });

  it("is deterministic per day", () => {
    vi.useFakeTimers();
    mockDate("2025-06-15T12:00:00Z");
    const a = getDailyChallenge();
    const b = getDailyChallenge();
    expect(a).toEqual(b);
    vi.useRealTimers();
  });

  it("starts undone", () => {
    vi.useFakeTimers();
    mockDate("2025-06-01T12:00:00Z");
    expect(isChallengeDone()).toBe(false);
    vi.useRealTimers();
  });

  it("can be marked done", () => {
    vi.useFakeTimers();
    mockDate("2025-06-01T12:00:00Z");
    markChallengeDone();
    expect(isChallengeDone()).toBe(true);
    vi.useRealTimers();
  });

  it("tracks completion per-date", () => {
    vi.useFakeTimers();
    mockDate("2025-06-01T12:00:00Z");
    markChallengeDone();
    mockDate("2025-06-02T12:00:00Z");
    expect(isChallengeDone()).toBe(false);
    vi.useRealTimers();
  });
});

describe("daily quote", () => {
  it("returns a non-empty Arabic string", () => {
    const q = getDailyQuote();
    expect(q.length).toBeGreaterThan(0);
  });

  it("is deterministic per day", () => {
    vi.useFakeTimers();
    mockDate("2025-06-15T12:00:00Z");
    expect(getDailyQuote()).toBe(getDailyQuote());
    vi.useRealTimers();
  });
});

describe("mood", () => {
  it("defaults to 0", () => {
    expect(getMood()).toBe(0);
  });

  it("sets mood value", () => {
    setMood(4);
    expect(getMood()).toBe(4);
  });
});
