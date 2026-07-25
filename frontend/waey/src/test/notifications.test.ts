import { describe, it, expect, beforeEach, vi } from "vitest";
import { requestNotificationPermission, startNotificationScheduler } from "@/lib/notifications";

interface MockNotification {
  permission: NotificationPermission;
  requestPermission?: (...args: unknown[]) => unknown;
  (title: string, opts?: NotificationOptions): void;
}

let origNotification: PropertyDescriptor | undefined;

function setMockNotification(mock: Partial<MockNotification>) {
  (window as unknown as Record<string, unknown>).Notification = mock;
}

function deleteNotification() {
  delete (window as unknown as Record<string, unknown>).Notification;
}

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
    deleteNotification();
    expect(await requestNotificationPermission()).toBe("unsupported");
  });

  it('returns "denied" when requestPermission throws', async () => {
    setMockNotification({
      permission: "default",
      requestPermission: vi.fn().mockRejectedValue(new Error("fail")),
    });
    expect(await requestNotificationPermission()).toBe("denied");
  });

  it('returns "granted" when permission is already granted', async () => {
    setMockNotification({
      permission: "granted",
      requestPermission: vi.fn(),
    });
    expect(await requestNotificationPermission()).toBe("granted");
  });

  it('returns "denied" when permission is already denied', async () => {
    setMockNotification({
      permission: "denied",
      requestPermission: vi.fn(),
    });
    expect(await requestNotificationPermission()).toBe("denied");
  });

  it('calls requestPermission when permission is "default"', async () => {
    const requestPermission = vi.fn().mockResolvedValue("granted" as NotificationPermission);
    setMockNotification({
      permission: "default",
      requestPermission,
    });
    expect(await requestNotificationPermission()).toBe("granted");
    expect(requestPermission).toHaveBeenCalledOnce();
  });
});

describe("startNotificationScheduler", () => {
  it("returns a cleanup function", () => {
    setMockNotification({ permission: "granted" });
    vi.useFakeTimers();
    const cleanup = startNotificationScheduler();
    expect(cleanup).toBeInstanceOf(Function);
    vi.useRealTimers();
  });

  it("cleanup clears timers and no Notification is created after cleanup", () => {
    const notify = vi.fn();
    const MockCtor = function Notification(title: string, opts?: NotificationOptions) {
      notify(title, opts);
    } as unknown as MockNotification;
    MockCtor.permission = "granted";
    setMockNotification(MockCtor);

    localStorage.setItem("waey_last_notif_ts", "0");
    vi.useFakeTimers();
    const cleanup = startNotificationScheduler();

    vi.advanceTimersByTime(16_000);
    expect(notify).toHaveBeenCalled();

    cleanup();
    notify.mockClear();
    vi.advanceTimersByTime(5 * 60 * 1000 + 1000);
    expect(notify).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("cleanup function is a no-op when Notification not available", () => {
    const orig = (window as unknown as Record<string, unknown>).Notification;
    deleteNotification();
    const cleanup = startNotificationScheduler();
    expect(cleanup).toBeInstanceOf(Function);
    cleanup();
    (window as unknown as Record<string, unknown>).Notification = orig;
  });
});
