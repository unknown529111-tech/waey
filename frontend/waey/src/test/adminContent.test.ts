import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { Recipe } from "@/data/recipes";
import {
  isAdminLoggedIn,
  adminLogin,
  adminLogout,
  getAdminRecipes,
  addAdminRecipe,
  updateAdminRecipe,
  deleteAdminRecipe,
  getAdminChallenges,
  addAdminChallenge,
  updateAdminChallenge,
  deleteAdminChallenge,
  getAdminQuotes,
  addAdminQuote,
  updateAdminQuote,
  deleteAdminQuote,
  exportAllData,
  resetAllData,
} from "@/lib/adminContent";

vi.mock("@/supabase/client", () => ({ supabase: {} }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("isAdminLoggedIn", () => {
  beforeEach(() => { localStorage.clear(); });

  it("returns false when not logged in", () => {
    expect(isAdminLoggedIn()).toBe(false);
  });
});

describe("adminLogin", () => {
  beforeEach(() => { localStorage.clear(); });

  it("returns false on network error", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));
    const result = await adminLogin("password123");
    expect(result).toBe(false);
  });

  it("returns true on success and sets auth state", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: "valid-token" }),
    }));
    const result = await adminLogin("correct-password");
    expect(result).toBe(true);
    expect(isAdminLoggedIn()).toBe(true);
  });
});

describe("adminLogout", () => {
  beforeEach(() => { localStorage.clear(); });

  it("clears auth state", () => {
    localStorage.setItem("waey_admin", "1");
    localStorage.setItem("waey_admin_token", "token123");
    adminLogout();
    expect(isAdminLoggedIn()).toBe(false);
  });
});

describe("getAdminRecipes", () => {
  beforeEach(() => { localStorage.clear(); });

  it("returns empty array initially", () => {
    expect(getAdminRecipes()).toEqual([]);
  });
});

describe("addAdminRecipe", () => {
  beforeEach(() => { localStorage.clear(); });

  it("adds item with _adminId", () => {
    const recipe: Recipe = {
      id: "test-id", name: "Test Recipe", emoji: "🍽️", calories: 100,
      costEGP: 10, prepMin: 5, servings: 1, ingredients: [], steps: [], tags: [],
    };
    const result = addAdminRecipe(recipe);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Test Recipe");
    expect(result[0]._adminId).toMatch(/^admin_/);
  });
});

describe("updateAdminRecipe", () => {
  beforeEach(() => { localStorage.clear(); });

  it("updates recipe by id", () => {
    addAdminRecipe({
      id: "orig-id", name: "Original", emoji: "🍽️", calories: 100,
      costEGP: 10, prepMin: 5, servings: 1, ingredients: [], steps: [], tags: [],
    });
    const id = getAdminRecipes()[0]._adminId;
    const updated = updateAdminRecipe(id, { name: "Updated" });
    expect(updated[0].name).toBe("Updated");
  });
});

describe("deleteAdminRecipe", () => {
  beforeEach(() => { localStorage.clear(); });

  it("removes recipe by id", () => {
    addAdminRecipe({
      id: "del-id", name: "To Delete", emoji: "🍽️", calories: 100,
      costEGP: 10, prepMin: 5, servings: 1, ingredients: [], steps: [], tags: [],
    });
    const id = getAdminRecipes()[0]._adminId;
    const result = deleteAdminRecipe(id);
    expect(result).toHaveLength(0);
  });
});

describe("exportAllData", () => {
  beforeEach(() => { localStorage.clear(); });

  it("returns JSON string of localStorage", () => {
    localStorage.setItem("waey_test", JSON.stringify({ nested: true }));
    const json = exportAllData();
    const parsed = JSON.parse(json);
    expect(parsed.waey_test).toEqual({ nested: true });
  });
});

describe("resetAllData", () => {
  beforeEach(() => { localStorage.clear(); });

  it("preserves waey_admin_token, waey_theme, and waey_onboarding_done", () => {
    localStorage.setItem("waey-theme", "dark");
    localStorage.setItem("waey_onboarding_done", "true");
    localStorage.setItem("waey_admin_token", "saved-token");
    localStorage.setItem("waey_something", "delete-me");
    resetAllData();
    expect(localStorage.getItem("waey-theme")).toBe("dark");
    expect(localStorage.getItem("waey_onboarding_done")).toBe("true");
    expect(localStorage.getItem("waey_admin_token")).toBe("saved-token");
    expect(localStorage.getItem("waey_something")).toBeNull();
  });
});
