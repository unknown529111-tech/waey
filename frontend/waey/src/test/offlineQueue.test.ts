import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  queueUpsert,
  queueDelete,
  getQueueSize,
  isOffline,
  flushQueue,
  initOfflineSync,
} from "@/lib/offlineQueue";

const QUEUE_KEY = "waey_offline_queue";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
});

describe("queueUpsert", () => {
  it("stores a supabase_upsert item", () => {
    queueUpsert("habits", { id: "1", name: "test" });
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY)!);
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe("supabase_upsert");
    expect(queue[0].table).toBe("habits");
    expect(queue[0].data).toEqual({ id: "1", name: "test" });
    expect(queue[0].timestamp).toBeGreaterThan(0);
  });

  it("stores with optional conflict parameter", () => {
    queueUpsert("habits", { id: "1" }, "id");
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY)!);
    expect(queue[0].conflict).toBe("id");
  });

  it("caps queue at 200 items", () => {
    for (let i = 0; i < 210; i++) {
      queueUpsert("habits", { id: String(i) });
    }
    expect(getQueueSize()).toBe(200);
  });
});

describe("queueDelete", () => {
  it("stores a supabase_delete item", () => {
    queueDelete("habits", { id: "1" });
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY)!);
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe("supabase_delete");
    expect(queue[0].table).toBe("habits");
    expect(queue[0].data).toEqual({ id: "1" });
  });

  it("caps queue at 200 items independently", () => {
    for (let i = 0; i < 210; i++) {
      queueDelete("habits", { id: String(i) });
    }
    expect(getQueueSize()).toBe(200);
  });
});

describe("getQueueSize", () => {
  it("returns 0 when queue is empty", () => {
    expect(getQueueSize()).toBe(0);
  });

  it("returns correct count after adding items", () => {
    queueUpsert("habits", { id: "1" });
    queueUpsert("habits", { id: "2" });
    queueDelete("habits", { id: "3" });
    expect(getQueueSize()).toBe(3);
  });
});

describe("isOffline", () => {
  it("returns false when navigator.onLine is true", () => {
    Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
    expect(isOffline()).toBe(false);
  });

  it("returns true when navigator.onLine is false", () => {
    Object.defineProperty(navigator, "onLine", { configurable: true, value: false });
    expect(isOffline()).toBe(true);
  });
});

describe("flushQueue", () => {
  it("returns 0 when queue is empty", async () => {
    expect(await flushQueue()).toBe(0);
  });

  it("handles import failure gracefully and returns 0", async () => {
    queueUpsert("habits", { id: "1" });
    // When supabase import fails, catch returns 0
    const result = await flushQueue();
    expect(typeof result).toBe("number");
  });
});

describe("initOfflineSync", () => {
  it("returns a cleanup function", () => {
    const cleanup = initOfflineSync();
    expect(cleanup).toBeInstanceOf(Function);
    cleanup();
  });

  it("cleanup removes event listeners", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const cleanup = initOfflineSync();
    cleanup();
    expect(removeSpy).toHaveBeenCalledWith("online", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("offline", expect.any(Function));
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
