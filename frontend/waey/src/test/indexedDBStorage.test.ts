import "fake-indexeddb/auto";
import { describe, it, expect, vi } from "vitest";

describe("setIDBItem / getIDBItem", () => {
  it("stores and retrieves a string", async () => {
    const { setIDBItem, getIDBItem } = await import("@/lib/indexedDBStorage");
    expect(await setIDBItem("idb_str", "hello")).toBe(true);
    expect(await getIDBItem("idb_str", "fallback")).toBe("hello");
  });

  it("stores and retrieves a number", async () => {
    const { setIDBItem, getIDBItem } = await import("@/lib/indexedDBStorage");
    await setIDBItem("idb_num", 42);
    expect(await getIDBItem("idb_num", 0)).toBe(42);
  });

  it("stores and retrieves an object", async () => {
    const { setIDBItem, getIDBItem } = await import("@/lib/indexedDBStorage");
    const obj = { a: 1, b: [2, 3] };
    await setIDBItem("idb_obj", obj);
    expect(await getIDBItem("idb_obj", null)).toEqual(obj);
  });

  it("stores and retrieves a boolean", async () => {
    const { setIDBItem, getIDBItem } = await import("@/lib/indexedDBStorage");
    await setIDBItem("idb_bool", true);
    expect(await getIDBItem("idb_bool", false)).toBe(true);
  });
});

describe("getIDBItem fallback", () => {
  it("returns fallback when key is missing", async () => {
    const { getIDBItem } = await import("@/lib/indexedDBStorage");
    expect(await getIDBItem("idb_never_set", "default")).toBe("default");
  });
});

describe("removeIDBItem", () => {
  it("removes a stored key", async () => {
    const { setIDBItem, getIDBItem, removeIDBItem } = await import("@/lib/indexedDBStorage");
    await setIDBItem("idb_rm", "value");
    expect(await removeIDBItem("idb_rm")).toBe(true);
    expect(await getIDBItem("idb_rm", "gone")).toBe("gone");
  });

  it("returns true for non-existent key", async () => {
    const { removeIDBItem } = await import("@/lib/indexedDBStorage");
    expect(await removeIDBItem("idb_nonexistent")).toBe(true);
  });
});

describe("error handling", () => {
  it("setIDBItem returns false when indexedDB not available", async () => {
    vi.stubGlobal("indexedDB", undefined);
    const { setIDBItem } = await import("@/lib/indexedDBStorage");
    expect(await setIDBItem("idb_fail", "val")).toBe(false);
  });

  it("getIDBItem returns fallback when indexedDB not available", async () => {
    vi.stubGlobal("indexedDB", undefined);
    const { getIDBItem } = await import("@/lib/indexedDBStorage");
    expect(await getIDBItem("idb_fail", "fall")).toBe("fall");
  });

  it("removeIDBItem returns false when indexedDB not available", async () => {
    vi.stubGlobal("indexedDB", undefined);
    const { removeIDBItem } = await import("@/lib/indexedDBStorage");
    expect(await removeIDBItem("idb_fail")).toBe(false);
  });
});
