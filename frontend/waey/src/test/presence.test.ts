import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  startSession,
  pingSession,
  endSession,
  getOnlineList,
  getOnlineCount,
  getSignedInCount,
  getMinSessionDuration,
  getAllSessions,
  getLocalPresence,
  getLocalSessions,
} from "@/lib/presence";

vi.mock("@/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({ then: vi.fn(() => ({ catch: vi.fn() })) })),
      insert: vi.fn(() => ({ then: vi.fn(() => ({ catch: vi.fn() })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ then: vi.fn(() => ({ catch: vi.fn() })) })) })),
    })),
  },
}));

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

function mockCrypto() {
  if (typeof crypto === "undefined" || !crypto.randomUUID) {
    Object.defineProperty(globalThis, "crypto", {
      value: {
        randomUUID: () => "00000000-0000-0000-0000-000000000001",
      },
      writable: true,
    });
  }
}

function freezeTime(ts: number) {
  vi.useFakeTimers();
  vi.setSystemTime(ts);
}

describe("startSession", () => {
  it("creates a presence entry with correct fields", () => {
    mockCrypto();
    const sid = startSession("a@b.com", "Alice");
    const p = getLocalPresence();
    expect(p[sid]).toBeDefined();
    expect(p[sid].email).toBe("a@b.com");
    expect(p[sid].name).toBe("Alice");
    expect(p[sid].active).toBe(true);
    expect(p[sid].startAt).toBeGreaterThan(0);
    expect(p[sid].lastActive).toBe(p[sid].startAt);
  });

  it("accepts a custom id", () => {
    const sid = startSession("a@b.com", "Alice", "custom-id");
    const p = getLocalPresence();
    expect(p["custom-id"]).toBeDefined();
    expect(sid).toBe("custom-id");
  });

  it("creates multiple independent sessions", () => {
    mockCrypto();
    const s1 = startSession("a@b.com", "Alice");
    const s2 = startSession("b@c.com", "Bob");
    const p = getLocalPresence();
    expect(Object.keys(p)).toHaveLength(2);
    expect(p[s1].email).toBe("a@b.com");
    expect(p[s2].email).toBe("b@c.com");
  });
});

describe("pingSession", () => {
  it("updates lastActive", () => {
    mockCrypto();
    freezeTime(1000);
    const sid = startSession("a@b.com", "Alice");
    freezeTime(5000);
    pingSession(sid);
    const p = getLocalPresence();
    expect(p[sid].lastActive).toBe(5000);
    expect(p[sid].active).toBe(true);
    vi.useRealTimers();
  });

  it("does nothing for non-existent session", () => {
    pingSession("ghost");
    expect(getLocalPresence()).toEqual({});
  });
});

describe("endSession", () => {
  it("moves entry to sessions and removes from presence", () => {
    mockCrypto();
    freezeTime(1000);
    const sid = startSession("a@b.com", "Alice");
    freezeTime(6000);
    const result = endSession(sid);
    expect(result).not.toBeNull();
    expect(result!.email).toBe("a@b.com");
    expect(result!.durationMs).toBe(5000);

    const p = getLocalPresence();
    expect(p[sid]).toBeUndefined();

    const sessions = getLocalSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].id).toBe(sid);
    expect(sessions[0].durationMs).toBe(5000);
    vi.useRealTimers();
  });

  it("returns null for non-existent session", () => {
    expect(endSession("ghost")).toBeNull();
  });

  it("accumulates multiple sessions", () => {
    mockCrypto();
    freezeTime(1000);
    const s1 = startSession("a@b.com", "Alice");
    freezeTime(3000);
    endSession(s1);
    freezeTime(5000);
    const s2 = startSession("a@b.com", "Alice");
    freezeTime(8000);
    endSession(s2);
    expect(getLocalSessions()).toHaveLength(2);
    vi.useRealTimers();
  });
});

describe("getOnlineList", () => {
  it("returns active entries within threshold", () => {
    mockCrypto();
    freezeTime(1000);
    const sid = startSession("a@b.com", "Alice");
    freezeTime(5000);
    const list = getOnlineList(10000);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(sid);
    vi.useRealTimers();
  });

  it("excludes entries past threshold", () => {
    mockCrypto();
    freezeTime(1000);
    startSession("a@b.com", "Alice");
    freezeTime(200000);
    const list = getOnlineList(120000);
    expect(list).toHaveLength(0);
    vi.useRealTimers();
  });
});

describe("getOnlineCount", () => {
  it("returns the count of online entries", () => {
    mockCrypto();
    freezeTime(1000);
    startSession("a@b.com", "Alice");
    startSession("b@c.com", "Bob");
    freezeTime(5000);
    expect(getOnlineCount(10000)).toBe(2);
    vi.useRealTimers();
  });
});

describe("getSignedInCount", () => {
  it("counts unique emails from sessions and presence", () => {
    mockCrypto();
    freezeTime(1000);
    startSession("a@b.com", "Alice");
    startSession("b@c.com", "Bob");
    freezeTime(5000);
    endSession("00000000-0000-0000-0000-000000000001");
    freezeTime(6000);
    startSession("c@d.com", "Charlie");
    expect(getSignedInCount()).toBe(3);
    vi.useRealTimers();
  });

  it("does not double-count same email", () => {
    mockCrypto();
    freezeTime(1000);
    const sid = startSession("a@b.com", "Alice");
    freezeTime(5000);
    endSession(sid);
    freezeTime(6000);
    startSession("a@b.com", "Alice");
    expect(getSignedInCount()).toBe(1);
    vi.useRealTimers();
  });
});

describe("getMinSessionDuration", () => {
  it("returns 0 when no sessions exist", () => {
    expect(getMinSessionDuration()).toBe(0);
  });

  it("returns the minimum duration among sessions", () => {
    mockCrypto();
    freezeTime(1000);
    const s1 = startSession("a@b.com", "Alice");
    freezeTime(3000);
    endSession(s1);
    freezeTime(5000);
    const s2 = startSession("b@c.com", "Bob");
    freezeTime(10000);
    endSession(s2);
    expect(getMinSessionDuration()).toBe(2000);
    vi.useRealTimers();
  });
});

describe("getAllSessions", () => {
  it("returns empty array when no sessions", () => {
    expect(getAllSessions()).toEqual([]);
  });

  it("returns all session records", () => {
    mockCrypto();
    freezeTime(1000);
    const sid = startSession("a@b.com", "Alice");
    freezeTime(5000);
    endSession(sid);
    const all = getAllSessions();
    expect(all).toHaveLength(1);
    expect(all[0].email).toBe("a@b.com");
    vi.useRealTimers();
  });
});
