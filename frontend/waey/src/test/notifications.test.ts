import { describe, it, expect, beforeEach, vi } from "vitest";
import { requestNotificationPermission, startNotificationScheduler } from "@/lib/notifications";

let origNotification: PropertyDescriptor | undefined;

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  origNotification = Object.getOwnPropertyDescriptor(window, "Notification");
});

afterEach(() => {
  if (origNotification) {
    Object.defineProperty(window, "Notification", origNotification);
  }
});

describe("requestNotificationPermission", () => {
  it('returns "unsupported" when Notification is not available', async () => {
    delete (window as any).Notification;
    expect(await requestNotificationPermission()).toBe("unsupported");
  });

  it('returns "denied" when requestPermission throws', async () => {
    (window as any).Notification = {
      permission: "default",
      requestPermission: vi.fn().mockRejectedValue(new Error("fail")),
    };
    expect(await requestNotificationPermission()).toBe("denied");
  });

  it('returns "granted" when permission is already granted', async () => {
    (window as any).Notification = {
      permission: "granted",
      requestPermission: vi.fn(),
    };
    expect(await requestNotificationPermission()).toBe("granted");
  });

  it('returns "denied" when permission is already denied', async () => {
    (window as any).Notification = {
      permission: "denied",
      requestPermission: vi.fn(),
    };
    expect(await requestNotificationPermission()).toBe("denied");
  });

  it('calls requestPermission when permission is "default"', async () => {
    const requestPermission = vi.fn().mockResolvedValue("granted" as NotificationPermission);
    (window as any).Notification = {
      permission: "default",
      requestPermission,
    };
    expect(await requestNotificationPermission()).toBe("granted");
    expect(requestPermission).toHaveBeenCalledOnce();
  });
});

describe("startNotificationScheduler", () => {
  it("returns a cleanup function", () => {
    (window as any).Notification = { permission: "granted" };
    vi.useFakeTimers();
    const cleanup = startNotificationScheduler();
    expect(cleanup).toBeInstanceOf(Function);
    vi.useRealTimers();
  });

  it("cleanup clears timers and no Notification is created after cleanup", () => {
    const notify = vi.fn();
    (window as any).Notification = function Notification(title: string, opts?: NotificationOptions) {
      notify(title, opts);
    };
    (window as any).Notification.permission = "granted";

    localStorage.setItem("waey_last_notif_ts", "0");
    vi.useFakeTimers();
    const cleanup = startNotificationScheduler();

    // Advance past the 15s initial timer
    vi.advanceTimersByTime(16_000);
    expect(notify).toHaveBeenCalled();

    // Cleanup and reset
    cleanup();
    notify.mockClear();
    vi.advanceTimersByTime(5 * 60 * 1000 + 1000);
    expect(notify).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("cleanup function is a no-op when Notification not available", () => {
    const orig = (window as any).Notification;
    (window as any).Notification = undefined;
    const cleanup = startNotificationScheduler();
    expect(cleanup).toBeInstanceOf(Function);
    cleanup();
    (window as any).Notification = orig;
  });
});
