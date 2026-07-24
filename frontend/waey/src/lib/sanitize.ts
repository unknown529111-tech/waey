export function sanitizeString(input: string, maxLen = 1000) {
  if (!input) return "";
  let s = input.replace(/<[^>]*>/g, "");
  s = s.replace(/javascript\s*:/gi, "blocked:");
  s = s.replace(/data\s*:\s*text\/html/gi, "blocked:");
  s = s.replace(/vbscript\s*:/gi, "blocked:");
  s = s.replace(/on\w+\s*=/gi, "blocked=");
  s = s.replace(/\s+/g, " ").trim();
  if (s.length > maxLen) s = s.slice(0, maxLen);
  return s;
}

export function sanitizeEmail(email: string) {
  if (!email) return "";
  return email.trim().toLowerCase().slice(0, 254);
}

export function sanitizePassword(password: string, maxLen = 128) {
  if (!password) return "";
  const s = password.trim();
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

export function isValidEmail(email: string) {
  const e = sanitizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}