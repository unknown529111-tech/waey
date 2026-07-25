import { describe, it, expect, afterEach, vi } from "vitest";
import { shareContent, downloadBlob } from "@/lib/share";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("shareContent", () => {
  it("uses navigator.share when available", async () => {
    const shareFn = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share: shareFn });
    const result = await shareContent({ text: "hello" });
    expect(shareFn).toHaveBeenCalledWith({ text: "hello" });
    expect(result).toBe(true);
  });

  it("falls back to clipboard when navigator.share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const result = await shareContent({ text: "clip text" });
    expect(writeText).toHaveBeenCalledWith("clip text");
    expect(result).toBe(true);
  });

  it("handles AbortError gracefully and falls back to clipboard", async () => {
    const shareFn = vi.fn().mockRejectedValue({ name: "AbortError" });
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share: shareFn, clipboard: { writeText } });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await shareContent({ text: "fallback" });
    expect(shareFn).toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledWith("fallback");
    expect(result).toBe(true);
    warnSpy.mockRestore();
  });

  it("returns false when both share and clipboard fail", async () => {
    const shareFn = vi.fn().mockRejectedValue({ name: "NotAllowedError" });
    const writeText = vi.fn().mockRejectedValue(new Error("Clipboard blocked"));
    vi.stubGlobal("navigator", { share: shareFn, clipboard: { writeText } });
    const result = await shareContent({ text: "fail" });
    expect(result).toBe(false);
  });
});

describe("downloadBlob", () => {
  it("creates anchor, triggers click, and cleans up", () => {
    const clickFn = vi.fn();
    const mockAnchor = { href: "", download: "", click: clickFn };
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:mock"),
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal("document", {
      createElement: vi.fn().mockReturnValue(mockAnchor),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    });
    const blob = new Blob(["test"]);
    downloadBlob(blob, "report.pdf");
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockAnchor.href).toBe("blob:mock");
    expect(mockAnchor.download).toBe("report.pdf");
    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
    expect(clickFn).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
  });
});
