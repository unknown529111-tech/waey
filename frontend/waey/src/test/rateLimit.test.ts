import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  recordAttempt,
  isRateLimited,
  resetAttempts,
  RATE_LIMIT_PREFIX,
} from "@/lib/rateLimit";

beforeEach(() => localStorage.clear());

describe("recordAttempt", () => {
  it("stores a timestamp under the rate-limit key", () => {
    recordAttempt("login");
    const raw = localStorage.getItem(`${RATE_LIMIT_PREFIX}login`);
    expect(raw).not.toBeNull();
    const arr = JSON.parse(raw!);
    expect(Array.isArray(arr)).toBe(true);
    expect(arr).toHaveLength(1);
    expect(typeof arr[0]).toBe("number");
  });

  it("appends multiple attempts", () => {
    recordAttempt("login");
    recordAttempt("login");
    const raw = localStorage.getItem(`${RATE_LIMIT_PREFIX}login`);
    const arr = JSON.parse(raw!);
    expect(arr).toHaveLength(2);
  });

  it("handles localStorage errors gracefully", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(() => recordAttempt("x")).not.toThrow();
    vi.restoreAllMocks();
  });
});

describe("isRateLimited", () => {
  it("returns not limited with remaining attempts when under limit", () => {
    recordAttempt("search");
    recordAttempt("search");
    const result = isRateLimited("search", 5, 60_000);
    expect(result.limited).toBe(false);
    expect(result.remaining).toBe(3);
    expect(result.retryAfterMs).toBe(0);
  });

  it("returns limited when over limit", () => {
    for (let i = 0; i < 5; i++) recordAttempt("search");
    const result = isRateLimited("search", 5, 60_000);
    expect(result.limited).toBe(true);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("expires old attempts outside the window", () => {
    vi.useFakeTimers();
    for (let i = 0; i < 5; i++) recordAttempt("search");
    vi.advanceTimersByTime(60_001);
    const result = isRateLimited("search", 5, 60_000);
    expect(result.limited).toBe(false);
    expect(result.remaining).toBe(5);
    vi.useRealTimers();
  });

  it("respects custom limit and window", () => {
    recordAttempt("api");
    recordAttempt("api");
    const result = isRateLimited("api", 2, 30_000);
    expect(result.limited).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("returns defaults when localStorage errors", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    const result = isRateLimited("x", 5, 60_000);
    expect(result.limited).toBe(false);
    expect(result.remaining).toBe(5);
    expect(result.retryAfterMs).toBe(0);
    vi.restoreAllMocks();
  });
});

describe("resetAttempts", () => {
  it("removes the stored key", () => {
    recordAttempt("login");
    resetAttempts("login");
    const raw = localStorage.getItem(`${RATE_LIMIT_PREFIX}login`);
    expect(raw).toBeNull();
  });

  it("does nothing for unknown keys", () => {
    expect(() => resetAttempts("nonexistent")).not.toThrow();
  });
});
