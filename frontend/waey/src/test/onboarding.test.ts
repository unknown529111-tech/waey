import { describe, it, expect, beforeEach } from "vitest";
import { readJSON, writeJSON } from "@/lib/dailyStorage";

describe("Onboarding & Progressive Disclosure", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("identifies new user as uncompleted onboarding", () => {
    const isDone = readJSON<boolean>("waey_onboarding_done", false);
    expect(isDone).toBe(false);
  });

  it("persists onboarding completion flag", () => {
    writeJSON("waey_onboarding_done", true);
    const isDone = readJSON<boolean>("waey_onboarding_done", false);
    expect(isDone).toBe(true);
  });
});
