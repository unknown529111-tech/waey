// Privacy-first local analytics helper for Waey platform
// Collects anonymous feature usage metrics without tracking personal identifiers
import { getUserId, syncAnalyticsEvents } from "@/lib/supabaseStorage";

const EVENTS_KEY = "waey_analytics_events";

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    events.push({
      eventName,
      properties,
      timestamp: Date.now(),
    });
    // Keep last 100 anonymous events locally
    if (events.length > 100) events.splice(0, events.length - 100);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    const uid = getUserId();
    if (uid) syncAnalyticsEvents(uid);
  } catch {
    /* ignore */
  }
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
