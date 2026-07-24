// Offline sync queue for tracker writes
// When offline, Supabase syncs are queued and flushed on reconnect.
// localStorage writes already work offline (they're local), so the queue
// only handles server-side operations (Supabase upserts, etc.)

const QUEUE_KEY = "waey_offline_queue";

interface QueueItem {
  type: "supabase_upsert" | "supabase_delete";
  table: string;
  data: Record<string, unknown>;
  conflict?: string;
  timestamp: number;
}

function getQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueueItem[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/** Enqueue a Supabase upsert for later replay */
export function queueUpsert(table: string, data: Record<string, unknown>, conflict?: string) {
  const queue = getQueue();
  queue.push({ type: "supabase_upsert", table, data, conflict, timestamp: Date.now() });
  if (queue.length > 200) queue.splice(0, queue.length - 200);
  saveQueue(queue);
}

/** Enqueue a Supabase delete for later replay */
export function queueDelete(table: string, data: Record<string, unknown>) {
  const queue = getQueue();
  queue.push({ type: "supabase_delete", table, data, timestamp: Date.now() });
  if (queue.length > 200) queue.splice(0, queue.length - 200);
  saveQueue(queue);
}

/** Flush all queued operations to Supabase. Returns count of successful ops. */
export async function flushQueue(): Promise<number> {
  const queue = getQueue();
  if (queue.length === 0) return 0;

  let flushed = 0;
  try {
    const { supabase } = await import("@/supabase/client");
    if (!supabase) return 0;

    for (const item of queue) {
      try {
        if (item.type === "supabase_upsert") {
          const { error } = await supabase
            .from(item.table)
            .upsert(item.data, item.conflict ? { onConflict: item.conflict } : undefined);
          if (error) break; // stop on first failure
        } else if (item.type === "supabase_delete") {
          let query = supabase.from(item.table).delete();
          // Apply the data as match conditions
          for (const [col, val] of Object.entries(item.data)) {
            query = query.eq(col as string, val as string);
          }
          const { error } = await query;
          if (error) break;
        }
        flushed++;
      } catch {
        break; // network still down
      }
    }
  } catch {
    // Supabase import failed
    return 0;
  }

  saveQueue(queue.slice(flushed));
  return flushed;
}

/** Get the count of pending offline operations */
export function getQueueSize(): number {
  return getQueue().length;
}

/** Check if the app is currently offline */
export function isOffline(): boolean {
  if (typeof navigator !== "undefined") {
    return !navigator.onLine;
  }
  return false;
}

/**
 * Initialize offline/online listeners.
 * Call once in your app entry point.
 */
export function initOfflineSync(): () => void {
  const handleOnline = async () => {
    const count = await flushQueue();
    if (count > 0) {
      console.log(`[waey] Flushed ${count} offline operations`);
      window.dispatchEvent(new CustomEvent("waey-sync-flushed", { detail: { count } }));
    }
  };

  const handleOffline = () => {
    window.dispatchEvent(new CustomEvent("waey-offline"));
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Flush any pending items from previous session
  if (!isOffline()) {
    flushQueue();
  }

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}
