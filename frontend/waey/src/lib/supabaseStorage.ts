import { supabase } from "@/supabase/client";
import { queueUpsert, queueDelete, isOffline } from "@/lib/offlineQueue";
import type { Tables } from "@/supabase/types";

type SupabaseClient = NonNullable<typeof supabase>;

function getClient(): SupabaseClient | null {
  return supabase;
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("waey-auth");
    if (!raw) return null;
    const auth = JSON.parse(raw);
    return auth.userId || null;
  } catch {
    return null;
  }
}

export function setUserId(id: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("waey-auth");
    const auth = raw ? JSON.parse(raw) : {};
    auth.userId = id;
    localStorage.setItem("waey-auth", JSON.stringify(auth));
  } catch { /* ignore */ }
}

async function syncUpsert(
  table: string,
  data: Record<string, unknown>,
  conflict?: string
): Promise<void> {
  const sb = getClient();
  if (!sb || isOffline()) {
    queueUpsert(table, data, conflict);
    return;
  }
  try {
    const { error } = await sb
      .from(table)
      .upsert(data, conflict ? { onConflict: conflict } : undefined);
    if (error) queueUpsert(table, data, conflict);
  } catch {
    queueUpsert(table, data, conflict);
  }
}

async function syncDelete(
  table: string,
  column: string,
  value: string
): Promise<void> {
  const sb = getClient();
  if (!sb || isOffline()) {
    queueDelete(table, { [column]: value });
    return;
  }
  try {
    const { error } = await sb.from(table).delete().eq(column, value);
    if (error) queueDelete(table, { [column]: value });
  } catch {
    queueDelete(table, { [column]: value });
  }
}

export async function fetchRows<T>(
  table: string,
  userId: string,
  options?: {
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    columns?: string;
  }
): Promise<T[]> {
  const sb = getClient();
  if (!sb) return [];
  try {
    let query = sb.from(table).select(options?.columns || "*").eq("user_id", userId);
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options?.ascending ?? true });
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    const { data } = await query;
    return (data || []) as T[];
  } catch {
    return [];
  }
}

export async function fetchRow<T>(
  table: string,
  userId: string,
  column: string,
  value: string
): Promise<T | null> {
  const sb = getClient();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .eq(column, value)
      .maybeSingle();
    return data as T | null;
  } catch {
    return null;
  }
}

export function writeLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded */ }
}

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function removeLocal(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch { /* ignore */ }
}

export async function upsertRow<T extends Record<string, unknown>>(
  table: string,
  userId: string,
  data: Partial<T> & { user_id: string },
  conflict?: string
): Promise<void> {
  const row = { ...data, user_id: userId };
  writeLocal(`sb_cache_${table}_${userId}`, row);
  await syncUpsert(table, row, conflict);
}

export async function deleteRow(
  table: string,
  column: string,
  value: string,
  userId?: string
): Promise<void> {
  if (userId) removeLocal(`sb_cache_${table}_${userId}`);
  await syncDelete(table, column, value);
}

export async function importLocalDataToSupabase(email: string, userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;

  const importPromises: Promise<void>[] = [];

  const lsKeys: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) lsKeys[k] = localStorage.getItem(k) || "";
  }

  // 1. Import profile
  if (lsKeys["waey-auth"]) {
    try {
      const auth = JSON.parse(lsKeys["waey-auth"]);
      await sb.from("profiles").upsert({
        user_id: userId,
        email: auth.user?.email || email,
        name: auth.user?.name || "",
        updated_at: new Date().toISOString(),
      }, { onConflict: "email" });
    } catch { /* best-effort */ }
  }

  // 2. Import user_settings
  const settings: Record<string, unknown> = { user_id: userId };
  if (lsKeys["waey-lang"]) settings.lang = lsKeys["waey-lang"];
  if (lsKeys["waey-theme"]) settings.theme = lsKeys["waey-theme"];
  if (lsKeys["waey_notif_categories"]) {
    try { settings.notification_categories = JSON.parse(lsKeys["waey_notif_categories"]); } catch { /* ignore */ }
  }
  if (lsKeys["waey_premium_tier"]) {
    try {
      const pt = JSON.parse(lsKeys["waey_premium_tier"]);
      settings.premium_tier = pt.tier;
      settings.premium_activated_at = pt.activatedAt;
    } catch { /* ignore */ }
  }
  if (lsKeys["waey_onboarding_done"]) settings.onboarding_done = lsKeys["waey_onboarding_done"] === "true";
  if (lsKeys["waey_pwa_dismissed"]) settings.pwa_dismissed = lsKeys["waey_pwa_dismissed"] === "true";
  if (lsKeys["waey_pwa_installed"]) settings.pwa_installed = lsKeys["waey_pwa_installed"] === "true";
  if (lsKeys["waey_whats_new_v2_seen"]) {
    try { settings.whats_new_seen = JSON.parse(lsKeys["waey_whats_new_v2_seen"]); } catch { /* ignore */ }
  }
  importPromises.push(
    sb.from("user_settings").upsert(settings, { onConflict: "user_id" }).then(() => {}).catch(() => {})
  );

  // 3. Import gamification
  if (lsKeys["waey_points"] || lsKeys["waey_unlocked_badges"] || lsKeys["waey_stats"]) {
    const g: Record<string, unknown> = { user_id: userId };
    if (lsKeys["waey_points"]) { try { g.points = JSON.parse(lsKeys["waey_points"]); } catch { /* ignore */ } }
    if (lsKeys["waey_unlocked_badges"]) { try { g.unlocked_badges = JSON.parse(lsKeys["waey_unlocked_badges"]); } catch { /* ignore */ } }
    if (lsKeys["waey_stats"]) {
      try {
        const stats = JSON.parse(lsKeys["waey_stats"]);
        g.total_water_cups = stats.totalWaterCups;
        g.total_expenses_count = stats.totalExpensesCount;
        g.total_challenges_done = stats.totalChallengesDone;
        g.breathing_done = stats.breathingDone;
        g.gratitude_done = stats.gratitudeDone;
      } catch { /* ignore */ }
    }
    importPromises.push(
      sb.from("gamification").upsert(g, { onConflict: "user_id" }).then(() => {}).catch(() => {})
    );
  }

  // 4. Import streak
  if (lsKeys["waey_streak"] || lsKeys["waey_streak_freezes"]) {
    const s: Record<string, unknown> = { user_id: userId };
    if (lsKeys["waey_streak"]) {
      try {
        const st = JSON.parse(lsKeys["waey_streak"]);
        s.count = st.count;
        s.last_day = st.lastDay;
        s.freeze_used = !!st.freezeUsed;
      } catch { /* ignore */ }
    }
    if (lsKeys["waey_streak_freezes"]) { try { s.freeze_count = JSON.parse(lsKeys["waey_streak_freezes"]); } catch { /* ignore */ } }
    importPromises.push(
      sb.from("streaks").upsert(s, { onConflict: "user_id" }).then(() => {}).catch(() => {})
    );
  }

  // 5. Import favorites
  if (lsKeys["waey_recipe_favs"]) {
    try {
      const favs = JSON.parse(lsKeys["waey_recipe_favs"]);
      importPromises.push(
        sb.from("favorites").upsert({ user_id: userId, recipe_ids: favs }, { onConflict: "user_id" }).then(() => {}).catch(() => {})
      );
    } catch { /* ignore */ }
  }

  // 6. Import daily entries (water, sleep, steps, eco, mood, energy, weight)
  const trackers = ["water", "sleep", "steps", "eco", "mood", "energy", "weight"];
  for (const tracker of trackers) {
    const raw = lsKeys[`waey_${tracker}`];
    if (!raw) continue;
    try {
      const map = JSON.parse(raw);
      const entries = Object.entries(map).map(([date_key, value]) => ({
        user_id: userId,
        date_key,
        tracker_type: tracker,
        value: Number(value),
      }));
      for (const entry of entries) {
        importPromises.push(
          sb.from("daily_entries").upsert(entry, { onConflict: "user_id,date_key,tracker_type" }).then(() => {}).catch(() => {})
        );
      }
    } catch { /* ignore */ }
  }

  // 7. Import expenses
  for (const [key, raw] of Object.entries(lsKeys)) {
    if (!key.startsWith("waey_expenses_")) continue;
    const date_key = key.replace("waey_expenses_", "");
    try {
      const list = JSON.parse(raw);
      for (const exp of list) {
        importPromises.push(
          sb.from("expenses").upsert({
            user_id: userId,
            date_key,
            amount: exp.amount,
            category: exp.category,
            note: exp.note || null,
            ts: exp.ts,
          }, { onConflict: "id" }).then(() => {}).catch(() => {})
        );
      }
    } catch { /* ignore */ }
  }

  // 8. Import big3
  if (lsKeys["waey_big3"] || lsKeys["waey_big3_done"]) {
    try {
      const items = lsKeys["waey_big3"] ? JSON.parse(lsKeys["waey_big3"]) : {};
      const dones = lsKeys["waey_big3_done"] ? JSON.parse(lsKeys["waey_big3_done"]) : {};
      for (const [date_key, arr] of Object.entries(items)) {
        const doneArr = dones[date_key] || [false, false, false];
        const entry = {
          user_id: userId,
          date_key,
          item1: (arr as string[])[0] || null,
          item2: (arr as string[])[1] || null,
          item3: (arr as string[])[2] || null,
          done1: (doneArr as boolean[])[0] || false,
          done2: (doneArr as boolean[])[1] || false,
          done3: (doneArr as boolean[])[2] || false,
        };
        importPromises.push(
          sb.from("big3_entries").upsert(entry, { onConflict: "user_id,date_key" }).then(() => {}).catch(() => {})
        );
      }
    } catch { /* ignore */ }
  }

  // 9. Import journal entries
  const journalTypes: Record<string, string> = {
    waey_gratitude: "gratitude",
    waey_review_achievement: "achievement",
    waey_review_lesson: "lesson",
  };
  for (const [lsKey, journalType] of Object.entries(journalTypes)) {
    const raw = lsKeys[lsKey];
    if (!raw) continue;
    try {
      const map = JSON.parse(raw);
      for (const [date_key, content] of Object.entries(map)) {
        importPromises.push(
          sb.from("journal_entries").upsert({
            user_id: userId,
            date_key,
            journal_type: journalType,
            content: String(content),
          }, { onConflict: "user_id,date_key,journal_type" }).then(() => {}).catch(() => {})
        );
      }
    } catch { /* ignore */ }
  }

  // 10. Import screens_off
  if (lsKeys["waey_screens_off"]) {
    try {
      const map = JSON.parse(lsKeys["waey_screens_off"]);
      for (const [date_key, value] of Object.entries(map)) {
        importPromises.push(
          sb.from("screens_off").upsert({
            user_id: userId,
            date_key,
            value: Boolean(value),
          }, { onConflict: "user_id,date_key" }).then(() => {}).catch(() => {})
        );
      }
    } catch { /* ignore */ }
  }

  // 11. Import challenge records
  if (lsKeys["waey_challenge_done"]) {
    try {
      const map = JSON.parse(lsKeys["waey_challenge_done"]);
      for (const [date_key, done] of Object.entries(map)) {
        importPromises.push(
          sb.from("challenge_records").upsert({
            user_id: userId,
            date_key,
            done: Boolean(done),
          }, { onConflict: "user_id,date_key" }).then(() => {}).catch(() => {})
        );
      }
    } catch { /* ignore */ }
  }

  // 12. Import plans
  for (const [key, raw] of Object.entries(lsKeys)) {
    if (!key.startsWith("waey_plan_")) continue;
    const plan_id = key.replace("waey_plan_", "");
    try {
      const plan = JSON.parse(raw);
      importPromises.push(
        sb.from("plans").upsert({
          user_id: userId,
          plan_id,
          started_at: plan.startedAt,
          completed_days: plan.completed || [],
        }, { onConflict: "user_id,plan_id" }).then(() => {}).catch(() => {})
      );
    } catch { /* ignore */ }
  }

  // 13. Import goals
  if (lsKeys["waey_goals"]) {
    try {
      const goals = JSON.parse(lsKeys["waey_goals"]);
      for (const goal of goals) {
        importPromises.push(
          sb.from("goals").upsert({
            user_id: userId,
            title: goal.title,
            category: goal.category,
            target: goal.target,
            current: goal.current || 0,
            unit: goal.unit,
          }).then(() => {}).catch(() => {})
        );
      }
    } catch { /* ignore */ }
  }

  // 14. Import admin items
  const adminItemTypes: Record<string, string> = {
    waey_admin_recipes: "recipe",
    waey_admin_challenges: "challenge",
    waey_admin_quotes: "quote",
  };
  for (const [lsKey, itemType] of Object.entries(adminItemTypes)) {
    const raw = lsKeys[lsKey];
    if (!raw) continue;
    try {
      const items = JSON.parse(raw);
      for (const item of items) {
        importPromises.push(
          sb.from("admin_items").upsert({
            user_id: userId,
            item_type: itemType,
            data: item,
          }).then(() => {}).catch(() => {})
        );
      }
    } catch { /* ignore */ }
  }

  // 15. Import AI chat history
  if (lsKeys["waey_ai_chat"]) {
    try {
      const msgs = JSON.parse(lsKeys["waey_ai_chat"]);
      for (const msg of msgs) {
        importPromises.push(
          sb.from("ai_chat_messages").insert({
            user_id: userId,
            role: msg.role,
            content: msg.content,
          }).then(() => {}).catch(() => {})
        );
      }
    } catch { /* ignore */ }
  }

  await Promise.allSettled(importPromises);
  localStorage.setItem("waey_imported_to_supabase", "true");
}

export async function syncGamification(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  try {
    const points = readLocal<number>("waey_points", 0);
    const unlocked_badges = readLocal<string[]>("waey_unlocked_badges", []);
    const stats = readLocal<{ totalWaterCups: number; totalExpensesCount: number; totalChallengesDone: number; breathingDone: number; gratitudeDone: number }>("waey_stats", {
      totalWaterCups: 0, totalExpensesCount: 0, totalChallengesDone: 0, breathingDone: 0, gratitudeDone: 0
    });
    await sb.from("gamification").upsert({
      user_id: userId,
      points,
      unlocked_badges,
      total_water_cups: stats.totalWaterCups,
      total_expenses_count: stats.totalExpensesCount,
      total_challenges_done: stats.totalChallengesDone,
      breathing_done: stats.breathingDone,
      gratitude_done: stats.gratitudeDone,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch { /* best-effort */ }
}

export async function syncStreak(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  try {
    const streak = readLocal<{ count: number; lastDay: string | null; freezeUsed?: boolean }>("waey_streak", { count: 0, lastDay: null });
    const freezeCount = readLocal<number>("waey_streak_freezes", 0);
    await sb.from("streaks").upsert({
      user_id: userId,
      count: streak.count,
      last_day: streak.lastDay,
      freeze_used: !!streak.freezeUsed,
      freeze_count: freezeCount,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch { /* best-effort */ }
}

export async function syncDailyEntry(userId: string, dateKey: string, trackerType: string, value: number): Promise<void> {
  await syncUpsert("daily_entries", { user_id: userId, date_key: dateKey, tracker_type: trackerType, value, updated_at: new Date().toISOString() }, "user_id,date_key,tracker_type");
}

export async function syncExpense(userId: string, dateKey: string, expense: { id: string; amount: number; category: string; note?: string; ts: number }): Promise<void> {
  await syncUpsert("expenses", { user_id: userId, date_key: dateKey, amount: expense.amount, category: expense.category, note: expense.note || null, ts: expense.ts }, "id");
}

export async function syncFavorites(userId: string): Promise<void> {
  const recipeIds = readLocal<string[]>("waey_recipe_favs", []);
  await syncUpsert("favorites", { user_id: userId, recipe_ids: recipeIds, updated_at: new Date().toISOString() }, "user_id");
}

export async function syncUserSettings(userId: string): Promise<void> {
  const settings: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };
  const lang = localStorage.getItem("waey-lang");
  if (lang) settings.lang = lang;
  const theme = localStorage.getItem("waey-theme");
  if (theme) settings.theme = theme;
  const cats = localStorage.getItem("waey_notif_categories");
  if (cats) { try { settings.notification_categories = JSON.parse(cats); } catch { /* ignore */ } }
  const premium = localStorage.getItem("waey_premium_tier");
  if (premium) { try { const p = JSON.parse(premium); settings.premium_tier = p.tier; settings.premium_activated_at = p.activatedAt; } catch { /* ignore */ } }
  settings.onboarding_done = localStorage.getItem("waey_onboarding_done") === "true";
  settings.pwa_dismissed = localStorage.getItem("waey_pwa_dismissed") === "true";
  settings.pwa_installed = localStorage.getItem("waey_pwa_installed") === "true";
  const wnv = localStorage.getItem("waey_whats_new_v2_seen");
  if (wnv) { try { settings.whats_new_seen = JSON.parse(wnv); } catch { /* ignore */ } }
  await syncUpsert("user_settings", settings, "user_id");
}

export async function syncAdminItems(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  const types = ["waey_admin_recipes", "waey_admin_challenges", "waey_admin_quotes"] as const;
  const typeNames = ["recipe", "challenge", "quote"] as const;
  for (let i = 0; i < types.length; i++) {
    const raw = localStorage.getItem(types[i]);
    if (!raw) continue;
    try {
      const items = JSON.parse(raw);
      for (const item of items) {
        await syncUpsert("admin_items", { user_id: userId, item_type: typeNames[i], data: item }, "id");
      }
    } catch { /* ignore */ }
  }
}

export async function syncPlans(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  const planIds = ["save30", "health30", "eco30"];
  for (const planId of planIds) {
    const raw = localStorage.getItem(`waey_plan_${planId}`);
    if (!raw) continue;
    try {
      const plan = JSON.parse(raw);
      await syncUpsert("plans", { user_id: userId, plan_id: planId, started_at: plan.startedAt, completed_days: plan.completed || [] }, "user_id,plan_id");
    } catch { /* ignore */ }
  }
}

export async function syncGoals(userId: string): Promise<void> {
  const raw = localStorage.getItem("waey_goals");
  if (!raw) return;
  try {
    const goals = JSON.parse(raw);
    for (const goal of goals) {
      await syncUpsert("goals", { user_id: userId, title: goal.title, category: goal.category, target: goal.target, current: goal.current || 0, unit: goal.unit }, "id");
    }
  } catch { /* ignore */ }
}

export async function syncBig3(userId: string): Promise<void> {
  const itemsRaw = localStorage.getItem("waey_big3");
  const donesRaw = localStorage.getItem("waey_big3_done");
  if (!itemsRaw) return;
  try {
    const items = JSON.parse(itemsRaw);
    const dones = donesRaw ? JSON.parse(donesRaw) : {};
    for (const [dateKey, arr] of Object.entries(items)) {
      const doneArr = dones[dateKey] || [false, false, false];
      await syncUpsert("big3_entries", {
        user_id: userId, date_key: dateKey,
        item1: (arr as string[])[0] || null, item2: (arr as string[])[1] || null, item3: (arr as string[])[2] || null,
        done1: (doneArr as boolean[])[0] || false, done2: (doneArr as boolean[])[1] || false, done3: (doneArr as boolean[])[2] || false,
      }, "user_id,date_key");
    }
  } catch { /* ignore */ }
}

export async function syncJournalEntry(userId: string, dateKey: string, journalType: string, content: string): Promise<void> {
  await syncUpsert("journal_entries", { user_id: userId, date_key: dateKey, journal_type: journalType, content }, "user_id,date_key,journal_type");
}

export async function syncScreenOff(userId: string, dateKey: string, value: boolean): Promise<void> {
  await syncUpsert("screens_off", { user_id: userId, date_key: dateKey, value }, "user_id,date_key");
}

export async function syncChallengeRecord(userId: string, dateKey: string, done: boolean): Promise<void> {
  await syncUpsert("challenge_records", { user_id: userId, date_key: dateKey, done }, "user_id,date_key");
}

export async function syncAIChat(userId: string): Promise<void> {
  const raw = localStorage.getItem("waey_ai_chat");
  if (!raw) return;
  try {
    const msgs = JSON.parse(raw);
    if (msgs.length > 0) {
      const sb = getClient();
      if (!sb) return;
      await sb.from("ai_chat_messages").delete().eq("user_id", userId);
      const rows = msgs.map((m: { role: string; content: string }) => ({ user_id: userId, role: m.role, content: m.content }));
      for (const row of rows) {
        await sb.from("ai_chat_messages").insert(row);
      }
    }
  } catch { /* ignore */ }
}

export async function loadGamificationFromSupabase(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  try {
    const { data } = await sb.from("gamification").select("*").eq("user_id", userId).maybeSingle();
    if (data) {
      writeLocal("waey_points", data.points);
      writeLocal("waey_unlocked_badges", data.unlocked_badges);
      writeLocal("waey_stats", {
        totalWaterCups: data.total_water_cups,
        totalExpensesCount: data.total_expenses_count,
        totalChallengesDone: data.total_challenges_done,
        breathingDone: data.breathing_done,
        gratitudeDone: data.gratitude_done,
      });
    }
  } catch { /* best-effort */ }
}

export async function loadStreakFromSupabase(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  try {
    const { data } = await sb.from("streaks").select("*").eq("user_id", userId).maybeSingle();
    if (data) {
      writeLocal("waey_streak", { count: data.count, lastDay: data.last_day, freezeUsed: data.freeze_used });
      writeLocal("waey_streak_freezes", data.freeze_count);
    }
  } catch { /* best-effort */ }
}

export async function loadSettingsFromSupabase(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  try {
    const { data } = await sb.from("user_settings").select("*").eq("user_id", userId).maybeSingle();
    if (data) {
      if (data.lang) localStorage.setItem("waey-lang", data.lang);
      if (data.theme) localStorage.setItem("waey-theme", data.theme);
      writeLocal("waey_notif_categories", data.notification_categories);
      writeLocal("waey_premium_tier", { tier: data.premium_tier, activatedAt: data.premium_activated_at });
      localStorage.setItem("waey_onboarding_done", data.onboarding_done ? "true" : "false");
      localStorage.setItem("waey_pwa_dismissed", data.pwa_dismissed ? "true" : "false");
      localStorage.setItem("waey_pwa_installed", data.pwa_installed ? "true" : "false");
      writeLocal("waey_whats_new_v2_seen", data.whats_new_seen);
    }
  } catch { /* best-effort */ }
}

export async function loadFavoritesFromSupabase(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  try {
    const { data } = await sb.from("favorites").select("*").eq("user_id", userId).maybeSingle();
    if (data) {
      writeLocal("waey_recipe_favs", data.recipe_ids);
    }
  } catch { /* best-effort */ }
}

export async function loadAllFromSupabase(userId: string): Promise<void> {
  await Promise.allSettled([
    loadGamificationFromSupabase(userId),
    loadStreakFromSupabase(userId),
    loadSettingsFromSupabase(userId),
    loadFavoritesFromSupabase(userId),
  ]);
}

export async function syncAnalyticsEvents(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  try {
    const events = readLocal<{ eventName: string; properties?: Record<string, unknown>; timestamp: number }[]>("waey_analytics_events", []);
    for (const event of events) {
      await sb.from("analytics_events").insert({
        user_id: userId,
        event_name: event.eventName,
        properties: event.properties || null,
        ts: event.timestamp,
      });
    }
  } catch { /* best-effort */ }
}

export async function syncLastNotifTs(userId: string): Promise<void> {
  const sb = getClient();
  if (!sb) return;
  const lastTs = localStorage.getItem("waey_last_notif_ts");
  if (!lastTs) return;
  try {
    await sb.from("user_settings").upsert({
      user_id: userId,
      last_notification_ts: new Date(Number(lastTs)).toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch { /* best-effort */ }
}
