import { describe, it, expect, beforeEach } from "vitest";
import {
  getPremiumState,
  setPremiumTier,
  isPremiumFeature,
} from "@/lib/premiumTier";

beforeEach(() => localStorage.clear());

describe("getPremiumState", () => {
  it("defaults to free tier", () => {
    const state = getPremiumState();
    expect(state.tier).toBe("free");
  });
});

describe("setPremiumTier", () => {
  it("stores the tier and activatedAt", () => {
    setPremiumTier("pro");
    const state = getPremiumState();
    expect(state.tier).toBe("pro");
    expect(state.activatedAt).toBeDefined();
    expect(typeof state.activatedAt).toBe("string");
  });

  it("overwrites previous tier", () => {
    setPremiumTier("free");
    expect(getPremiumState().tier).toBe("free");
    setPremiumTier("plus");
    expect(getPremiumState().tier).toBe("plus");
  });
});

describe("isPremiumFeature", () => {
  it("free cannot use ai_unlimited", () => {
    setPremiumTier("free");
    expect(isPremiumFeature("ai_unlimited")).toBe(false);
  });

  it("free cannot use export_excel", () => {
    setPremiumTier("free");
    expect(isPremiumFeature("export_excel")).toBe(false);
  });

  it("free cannot use advanced_insights", () => {
    setPremiumTier("free");
    expect(isPremiumFeature("advanced_insights")).toBe(false);
  });

  it("free can use offline_sync", () => {
    setPremiumTier("free");
    expect(isPremiumFeature("offline_sync")).toBe(true);
  });

  it("plus can use ai_unlimited but not advanced_insights", () => {
    setPremiumTier("plus");
    expect(isPremiumFeature("ai_unlimited")).toBe(true);
    expect(isPremiumFeature("advanced_insights")).toBe(false);
  });

  it("pro can use all features", () => {
    setPremiumTier("pro");
    expect(isPremiumFeature("ai_unlimited")).toBe(true);
    expect(isPremiumFeature("export_excel")).toBe(true);
    expect(isPremiumFeature("advanced_insights")).toBe(true);
    expect(isPremiumFeature("priority_support")).toBe(true);
    expect(isPremiumFeature("custom_themes")).toBe(true);
    expect(isPremiumFeature("offline_sync")).toBe(true);
  });

  it("unknown features return true (not gated)", () => {
    setPremiumTier("free");
    expect(isPremiumFeature("nonexistent_feature")).toBe(true);
  });
});
