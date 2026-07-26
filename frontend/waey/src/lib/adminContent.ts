import type { Recipe } from "@/data/recipes";
import { getUserId, syncAdminItems } from "@/lib/supabaseStorage";

// ==================== ADMIN AUTH ====================
const ADMIN_TOKEN_KEY = "waey_admin_token";

/** Calls Supabase edge function to verify admin password and get a signed token */
async function callAdminAuth(body: Record<string, string | boolean>): Promise<Record<string, unknown> | null> {
  try {
    const { supabase } = await import("@/supabase/client");
    if (!supabase) return null;
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-auth`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) return null;
    return (await resp.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isAdminLoggedIn(): boolean {
  try {
    return !!localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch { return false; }
}

/**
 * Admin login — sends password to edge function, stores returned token.
 * Returns true on success, false on failure or network error.
 */
export async function adminLogin(password: string): Promise<boolean> {
  const result = await callAdminAuth({ password });
  if (result && typeof result.token === "string") {
    localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
    return true;
  }
  return false;
}

/**
 * Verify the stored token is still valid (server-side check).
 * Call this on page load to detect expired tokens.
 */
export async function verifyAdminToken(): Promise<boolean> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) return false;
  const result = await callAdminAuth({ token, verify: true });
  if (result && result.valid === true) return true;
  // Token expired or invalid — clear it
  adminLogout();
  return false;
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
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
  const uid = getUserId();
  if (uid) syncAdminItems(uid);
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
  const uid = getUserId();
  if (uid) syncAdminItems(uid);
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
  const uid = getUserId();
  if (uid) syncAdminItems(uid);
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

// ==================== DATA EXPORT & LAZY XLSX ====================
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

/** Dynamic lazy import of xlsx library only when user clicks export */
export async function exportToExcelAsync(fileName = "waey_data.xlsx") {
  try {
    const XLSX = await import("xlsx");
    const data: Record<string, unknown>[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("waey_")) {
        data.push({ Key: key, Value: localStorage.getItem(key) });
      }
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WaeyData");
    XLSX.writeFile(workbook, fileName);
    return true;
  } catch (err) {
    console.error("Failed to load XLSX lazily:", err);
    return false;
  }
}

export function resetAllData(): void {
  const preserve = [ADMIN_TOKEN_KEY, "waey-theme", "waey_onboarding_done"];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && !preserve.includes(k)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}
