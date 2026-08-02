import { describe, it, expect, beforeEach } from "vitest";
import { PLANS, getPlanState, startPlan, togglePlanDay, resetPlan } from "@/lib/plansData";

beforeEach(() => {
  localStorage.clear();
});

describe("PLANS", () => {
  it("exports 3 plans", () => {
    expect(PLANS).toHaveLength(3);
  });

  it("each plan has 30 days", () => {
    for (const p of PLANS) {
      expect(p.days).toHaveLength(30);
    }
  });

  it("each plan has an id, title, emoji, description, area", () => {
    for (const p of PLANS) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.emoji).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(["health", "finance", "environment"]).toContain(p.area);
    }
  });
});

describe("getPlanState", () => {
  it("returns null for unstarted plan", () => {
    expect(getPlanState("save30")).toBeNull();
  });

  it("returns plan state after starting", () => {
    startPlan("save30");
    const s = getPlanState("save30");
    expect(s).not.toBeNull();
    expect(s!.completed).toEqual([]);
    expect(s!.startedAt).toBeTruthy();
  });
});

describe("startPlan", () => {
  it("stores a new plan in localStorage", () => {
    const s = startPlan("health30");
    expect(s.completed).toEqual([]);
    expect(s.startedAt).toBeTruthy();
    const raw = localStorage.getItem("waey_plan_health30");
    expect(raw).toBeTruthy();
  });
});

describe("togglePlanDay", () => {
  it("marks a day as completed", () => {
    startPlan("eco30");
    const s = togglePlanDay("eco30", 0);
    expect(s.completed).toContain(0);
  });

  it("unmarks a previously completed day", () => {
    startPlan("eco30");
    togglePlanDay("eco30", 0);
    const s = togglePlanDay("eco30", 0);
    expect(s.completed).not.toContain(0);
  });

  it("auto-starts plan if not started", () => {
    const s = togglePlanDay("save30", 5);
    expect(s.completed).toContain(5);
  });

  it("tracks multiple days", () => {
    startPlan("health30");
    togglePlanDay("health30", 0);
    togglePlanDay("health30", 1);
    togglePlanDay("health30", 2);
    const s = getPlanState("health30");
    expect(s!.completed.sort()).toEqual([0, 1, 2]);
  });
});

describe("resetPlan", () => {
  it("removes plan data from localStorage", () => {
    startPlan("save30");
    resetPlan("save30");
    expect(getPlanState("save30")).toBeNull();
    expect(localStorage.getItem("waey_plan_save30")).toBeNull();
  });

  it("does nothing for nonexistent plan", () => {
    resetPlan("nonexistent");
    expect(getPlanState("nonexistent")).toBeNull();
  });
});
