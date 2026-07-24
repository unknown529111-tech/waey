export const RATE_LIMIT_PREFIX = "rl:";

export function recordAttempt(key: string) {
  try {
    const k = RATE_LIMIT_PREFIX + key;
    const raw = localStorage.getItem(k) || "[]";
    const arr = JSON.parse(raw) as number[];
    const now = Date.now();
    arr.push(now);
    localStorage.setItem(k, JSON.stringify(arr));
  } catch { /* best-effort; localStorage may be unavailable */ }
}

export function isRateLimited(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
  try {
    const k = RATE_LIMIT_PREFIX + key;
    const raw = localStorage.getItem(k) || "[]";
    let arr = JSON.parse(raw) as number[];
    const cutoff = Date.now() - windowMs;
    arr = arr.filter((t) => t >= cutoff);
    localStorage.setItem(k, JSON.stringify(arr));
    const limited = arr.length >= limit;
    const retryAfterMs = limited ? Math.max(0, (arr[0] ?? 0) + windowMs - Date.now()) : 0;
    return { limited, remaining: Math.max(0, limit - arr.length), retryAfterMs };
  } catch {
    return { limited: false, remaining: limit, retryAfterMs: 0 };
  }
}

export function resetAttempts(key: string) {
  try {
    localStorage.removeItem(RATE_LIMIT_PREFIX + key);
  } catch { /* best-effort */ }
}
