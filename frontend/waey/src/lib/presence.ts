import { supabase } from "@/supabase/client";

export type PresenceEntry = {
  id: string;
  email: string;
  name: string;
  startAt: number;
  lastActive: number;
  active: boolean;
};

export type SessionRecord = {
  id: string;
  email: string;
  name: string;
  startAt: number;
  endAt: number;
  durationMs: number;
};

const PRESENCE_KEY = "waey_presence";
const SESSIONS_KEY = "waey_sessions";

function safeParse<T>(raw: string | null, fallback: T): T {
  try { return raw ? JSON.parse(raw) : fallback; } catch { /* ignore parse errors */ return fallback; }
}

export function getLocalPresence(): Record<string, PresenceEntry> {
  return safeParse<Record<string, PresenceEntry>>(localStorage.getItem(PRESENCE_KEY), {});
}

export function saveLocalPresence(p: Record<string, PresenceEntry>) {
  localStorage.setItem(PRESENCE_KEY, JSON.stringify(p));
}

export function getLocalSessions(): SessionRecord[] {
  return safeParse<SessionRecord[]>(localStorage.getItem(SESSIONS_KEY), []);
}

export function saveLocalSessions(s: SessionRecord[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(s));
}

function genId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try { return crypto.randomUUID(); } catch { /* fallthrough */ }
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAny = any;

function supabaseCall() {
  return supabase as unknown as SupabaseAny;
}

function upsertPresence(data: Record<string, unknown>) {
  if (!supabase) return;
  supabaseCall().from("presence").upsert(data).then(() => {}).catch(() => { /* best-effort; ignore network errors */ });
}

export function startSession(email: string, name: string, id?: string) {
  const now = Date.now();
  const sid = id || genId();
  const p = getLocalPresence();
  p[sid] = { id: sid, email, name, startAt: now, lastActive: now, active: true };
  saveLocalPresence(p);

  try {
    upsertPresence({ id: sid, email, name, start_at: new Date(now).toISOString(), last_active: new Date(now).toISOString(), active: true });
  } catch { /* best-effort */ }

  return sid;
}

export function pingSession(id: string) {
  const now = Date.now();
  const p = getLocalPresence();
  if (p[id]) {
    p[id].lastActive = now;
    p[id].active = true;
    saveLocalPresence(p);
  }
  try {
    upsertPresence({ id, last_active: new Date(now).toISOString(), active: true });
  } catch { /* best-effort */ }
}

export function endSession(id: string) {
  const now = Date.now();
  const p = getLocalPresence();
  const entry = p[id];
  if (!entry) return null;
  const duration = now - entry.startAt;
  const sessions = getLocalSessions();
  sessions.push({ id: entry.id, email: entry.email, name: entry.name, startAt: entry.startAt, endAt: now, durationMs: duration });
  saveLocalSessions(sessions);

  delete p[id];
  saveLocalPresence(p);

  try {
    if (supabase) {
      supabaseCall().from("sessions").insert({ id: entry.id, email: entry.email, name: entry.name, start_at: new Date(entry.startAt).toISOString(), end_at: new Date(now).toISOString(), duration_ms: duration }).then(() => {}).catch(() => { /* best-effort */ });
      supabaseCall().from("presence").delete().eq("id", id).then(() => {}).catch(() => { /* best-effort */ });
    }
  } catch { /* best-effort */ }

  return { id: entry.id, email: entry.email, name: entry.name, startAt: entry.startAt, endAt: now, durationMs: duration } as SessionRecord;
}

export function getOnlineList(thresholdMs = 120_000) {
  const now = Date.now();
  const p = getLocalPresence();
  return Object.values(p).filter((e) => e.active && (now - e.lastActive) <= thresholdMs);
}

export function getOnlineCount(thresholdMs = 120_000) {
  return getOnlineList(thresholdMs).length;
}

export function getSignedInCount() {
  const sessions = getLocalSessions();
  const presence = getLocalPresence();
  const set = new Set<string>();
  sessions.forEach((s) => set.add(s.email));
  Object.values(presence).forEach((p) => set.add(p.email));
  return set.size;
}

export function getMinSessionDuration() {
  const sessions = getLocalSessions();
  if (!sessions || sessions.length === 0) return 0;
  return Math.min(...sessions.map((s) => s.durationMs || Infinity));
}

export function getAllSessions() {
  return getLocalSessions();
}
