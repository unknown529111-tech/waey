import type { Recipe } from "@/data/recipes";

// ==================== ADMIN AUTH ====================
const ADMIN_KEY = "waey_admin";
const DEFAULT_PASSWORD = "5112009Asm$$";

export function isAdminLoggedIn(): boolean {
  try { return localStorage.getItem(ADMIN_KEY) === "1"; } catch { return false; }
}
export function adminLogin(password: string): boolean {
  if (password === DEFAULT_PASSWORD || password === import.meta.env.VITE_ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, "1");
    return true;
  }
  return false;
}
export function adminLogout() {
  localStorage.removeItem(ADMIN_KEY);
}

// ==================== ADMIN RECIPES ====================
const ADMIN_RECIPES_KEY = "waey_admin_recipes";

export type AdminItem<T> = T & { _adminId: string };

export function getAdminRecipes(): AdminItem<Recipe>[] {
  try {
    const raw = localStorage.getItem(ADMIN_RECIPES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveAdminRecipes(recipes: AdminItem<Recipe>[]) {
  localStorage.setItem(ADMIN_RECIPES_KEY, JSON.stringify(recipes));
}

export function addAdminRecipe(r: Recipe): AdminItem<Recipe>[] {
  const list = getAdminRecipes();
  const item: AdminItem<Recipe> = { ...r, _adminId: "admin_" + Date.now() };
  list.push(item);
  saveAdminRecipes(list);
  return list;
}

export function updateAdminRecipe(id: string, updates: Partial<Recipe>): AdminItem<Recipe>[] {
  const list = getAdminRecipes();
  const idx = list.findIndex((r) => r._adminId === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates };
    saveAdminRecipes(list);
  }
  return list;
}

export function deleteAdminRecipe(id: string): AdminItem<Recipe>[] {
  const list = getAdminRecipes().filter((r) => r._adminId !== id);
  saveAdminRecipes(list);
  return list;
}

// ==================== ADMIN CHALLENGES ====================
const ADMIN_CHALLENGES_KEY = "waey_admin_challenges";

export interface ChallengeItem {
  emoji: string;
  text: string;
  area: string;
  _adminId: string;
}

export function getAdminChallenges(): ChallengeItem[] {
  try {
    const raw = localStorage.getItem(ADMIN_CHALLENGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAdminChallenges(list: ChallengeItem[]) {
  localStorage.setItem(ADMIN_CHALLENGES_KEY, JSON.stringify(list));
}

export function addAdminChallenge(c: { emoji: string; text: string; area: string }): ChallengeItem[] {
  const list = getAdminChallenges();
  list.push({ ...c, _adminId: "ch_" + Date.now() });
  saveAdminChallenges(list);
  return list;
}

export function updateAdminChallenge(id: string, updates: Partial<ChallengeItem>): ChallengeItem[] {
  const list = getAdminChallenges();
  const idx = list.findIndex((c) => c._adminId === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates };
    saveAdminChallenges(list);
  }
  return list;
}

export function deleteAdminChallenge(id: string): ChallengeItem[] {
  const list = getAdminChallenges().filter((c) => c._adminId !== id);
  saveAdminChallenges(list);
  return list;
}

// ==================== ADMIN QUOTES ====================
const ADMIN_QUOTES_KEY = "waey_admin_quotes";

export type QuoteItem = { text: string; _adminId: string };

export function getAdminQuotes(): QuoteItem[] {
  try {
    const raw = localStorage.getItem(ADMIN_QUOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAdminQuotes(list: QuoteItem[]) {
  localStorage.setItem(ADMIN_QUOTES_KEY, JSON.stringify(list));
}

export function addAdminQuote(text: string): QuoteItem[] {
  const list = getAdminQuotes();
  list.push({ text, _adminId: "qt_" + Date.now() });
  saveAdminQuotes(list);
  return list;
}

export function updateAdminQuote(id: string, text: string): QuoteItem[] {
  const list = getAdminQuotes();
  const idx = list.findIndex((q) => q._adminId === id);
  if (idx >= 0) {
    list[idx].text = text;
    saveAdminQuotes(list);
  }
  return list;
}

export function deleteAdminQuote(id: string): QuoteItem[] {
  const list = getAdminQuotes().filter((q) => q._adminId !== id);
  saveAdminQuotes(list);
  return list;
}

// ==================== DATA EXPORT ====================
export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try { data[key] = JSON.parse(localStorage.getItem(key) || ""); }
      catch { data[key] = localStorage.getItem(key); }
    }
  }
  return JSON.stringify(data, null, 2);
}

export function resetAllData(): void {
  const preserve = [ADMIN_KEY, "waey_theme", "waey_onboarding_done"];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && !preserve.includes(k)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}
