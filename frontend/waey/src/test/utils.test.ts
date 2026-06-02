import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes via clsx", () => {
    const hideExtra = false;
    const result = cn("base", hideExtra && "hidden", "visible");
    expect(result).toBe("base visible");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    // twMerge should merge these: px-4 should be overridden by px-6
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("handles array arguments", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });
});
