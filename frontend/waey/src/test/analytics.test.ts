import { describe, it, expect, beforeEach, vi } from "vitest";
import { trackEvent, getAnalyticsEvents } from "@/lib/analytics";

beforeEach(() => localStorage.clear());

describe("trackEvent", () => {
  it("stores an event and retrieves it", () => {
    trackEvent("page_view", { page: "/home" });
    const events = getAnalyticsEvents();
    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe("page_view");
    expect(events[0].properties).toEqual({ page: "/home" });
    expect(typeof events[0].timestamp).toBe("number");
  });

  it("stores multiple events", () => {
    trackEvent("a");
    trackEvent("b");
    trackEvent("c");
    expect(getAnalyticsEvents()).toHaveLength(3);
  });

  it("limits to 100 events", () => {
    for (let i = 0; i < 110; i++) trackEvent(`evt_${i}`);
    const events = getAnalyticsEvents();
    expect(events).toHaveLength(100);
    expect(events[0].eventName).toBe("evt_10");
    expect(events[99].eventName).toBe("evt_109");
  });

  it("handles empty properties", () => {
    trackEvent("click");
    const events = getAnalyticsEvents();
    expect(events[0].properties).toBeUndefined();
  });

  it("does not throw when localStorage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    expect(() => trackEvent("test")).not.toThrow();
    vi.restoreAllMocks();
  });
});

describe("getAnalyticsEvents", () => {
  it("returns empty array when no events exist", () => {
    expect(getAnalyticsEvents()).toEqual([]);
  });

  it("returns empty array on localStorage error", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(getAnalyticsEvents()).toEqual([]);
    vi.restoreAllMocks();
  });
});
