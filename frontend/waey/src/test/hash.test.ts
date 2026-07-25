import { describe, it, expect } from "vitest";
import { sha256hex } from "@/lib/hash";

describe("sha256hex", () => {
  it("hashes a string to hex", async () => {
    const hash = await sha256hex("hello");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  it("produces deterministic output", async () => {
    const a = await sha256hex("password123");
    const b = await sha256hex("password123");
    expect(a).toBe(b);
  });

  it("produces different output for different inputs", async () => {
    const a = await sha256hex("abc");
    const b = await sha256hex("abd");
    expect(a).not.toBe(b);
  });

  it("handles empty string", async () => {
    const hash = await sha256hex("");
    expect(hash).toHaveLength(64);
  });

  it("handles Arabic text", async () => {
    const hash = await sha256hex("مرحبا");
    expect(hash).toHaveLength(64);
  });
});
