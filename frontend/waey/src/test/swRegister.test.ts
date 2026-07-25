import { describe, it, expect, afterEach, vi } from "vitest";
import { registerSW, unregisterSW } from "@/lib/swRegister";

function setupSWEnv(dev = false) {
  vi.stubEnv("DEV", dev);
  vi.stubGlobal("window", {
    addEventListener: vi.fn(),
    location: { reload: vi.fn() },
  });
  vi.stubGlobal("navigator", {
    serviceWorker: {
      register: vi.fn().mockResolvedValue({
        update: vi.fn(),
        installing: null,
        addEventListener: vi.fn(),
      }),
      controller: null,
    },
  });
  vi.stubGlobal("document", {
    getElementById: vi.fn().mockReturnValue(null),
    createElement: vi.fn().mockReturnValue({ id: "", className: "", innerHTML: "" }),
    body: { appendChild: vi.fn() },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("registerSW", () => {
  it("does nothing in DEV mode", () => {
    setupSWEnv(true);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    registerSW();
    expect(logSpy).toHaveBeenCalledWith("[SW] Skipping registration in development mode");
    expect(navigator.serviceWorker.register).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("calls navigator.serviceWorker.register when not in dev", () => {
    setupSWEnv(false);
    registerSW();
    expect(window.addEventListener).toHaveBeenCalledWith("load", expect.any(Function));
    const loadCallback = (window.addEventListener as ReturnType<typeof vi.fn>).mock.calls[0][1];
    loadCallback();
    expect(navigator.serviceWorker.register).toHaveBeenCalledWith("/sw.js", { scope: "/" });
  });
});

describe("unregisterSW", () => {
  it("clears intervals when called after registerSW", async () => {
    setupSWEnv(false);
    const clearIntervalSpy = vi.spyOn(global, "clearInterval");
    registerSW();
    const loadCallback = (window.addEventListener as ReturnType<typeof vi.fn>).mock.calls[0][1];
    loadCallback();
    await new Promise(resolve => setTimeout(resolve, 0));
    unregisterSW();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
