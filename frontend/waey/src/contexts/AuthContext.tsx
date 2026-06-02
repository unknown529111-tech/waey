import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./auth-context";
import { startSession, pingSession, endSession } from "@/lib/presence";
import { isRateLimited, recordAttempt, resetAttempts } from "@/lib/rateLimit";
import { sanitizeString, sanitizeEmail, sanitizePassword, isValidEmail } from "@/lib/sanitize";
import { sha256hex } from "@/lib/hash";

interface User {
  name: string;
  email: string;
}

const USERS_KEY = "waey_users";
const SESSION_KEY = "waey_session";
const SESSION_ID_KEY = "waey_session_id";

function getUsers(): Record<string, { name: string; password: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { name: string; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  // Presence: start/ping/end session for admin metrics
  useEffect(() => {
    let timer: number | undefined;

    const handleBeforeUnload = () => {
      try {
        const sid = localStorage.getItem(SESSION_ID_KEY);
        if (sid) endSession(sid);
      } catch {}
    };

    if (user) {
      let sid = localStorage.getItem(SESSION_ID_KEY);
      if (!sid) {
        sid = startSession(user.email, user.name);
        localStorage.setItem(SESSION_ID_KEY, sid);
      } else {
        // ensure presence exists (upsert)
        startSession(user.email, user.name, sid);
      }
      try { pingSession(sid); } catch {}

      timer = window.setInterval(() => {
        try {
          const s = localStorage.getItem(SESSION_ID_KEY);
          if (s) pingSession(s);
        } catch {}
      }, 15_000);

      window.addEventListener("beforeunload", handleBeforeUnload);
      const onVisibility = () => {
        if (document.visibilityState === "hidden") {
          try { const s = localStorage.getItem(SESSION_ID_KEY); if (s) pingSession(s); } catch {}
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        if (timer) clearInterval(timer);
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    } else {
      const sid = localStorage.getItem(SESSION_ID_KEY);
      if (sid) {
        try { endSession(sid); } catch {}
        localStorage.removeItem(SESSION_ID_KEY);
      }
    }
  }, [user]);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const sEmail = sanitizeEmail(email);
    const sPassword = sanitizePassword(password);

    if (!isValidEmail(sEmail)) return "بريد إلكتروني غير صالح";

    const rlKey = `signin:${sEmail}`;
    const rl = isRateLimited(rlKey);
    if (rl.limited) {
      const minutes = Math.ceil(rl.retryAfterMs / 60000) || 1;
      return `الحد الأقصى لمحاولات الدخول تم الوصول إليه. حاول مرة أخرى بعد ${minutes} دقيقة.`;
    }

    const users = getUsers();
    const record = users[sEmail];
    if (!record) {
      recordAttempt(rlKey);
      return "لا يوجد حساب بهذا البريد الإلكتروني";
    }

    const stored = record.password || "";

    // If stored password looks like a SHA-256 hex (64 chars), compare hashed
    if (stored.length === 64) {
      const h = await sha256hex(sPassword);
      if (h !== stored) {
        recordAttempt(rlKey);
        return "كلمة المرور غير صحيحة";
      }
    } else {
      // legacy plaintext password - migrate to hash on successful login
      if (stored !== sPassword) {
        recordAttempt(rlKey);
        return "كلمة المرور غير صحيحة";
      }
      const newHash = await sha256hex(sPassword);
      users[sEmail].password = newHash;
      saveUsers(users);
    }

    // successful login -> reset attempts
    resetAttempts(rlKey);
    setUser({ name: record.name, email: sEmail });
    return null;
  };

  const signUp = async (name: string, email: string, password: string): Promise<string | null> => {
    const sName = sanitizeString(name, 100);
    const sEmail = sanitizeEmail(email);
    const sPassword = sanitizePassword(password);

    if (!isValidEmail(sEmail)) return "بريد إلكتروني غير صالح";
    if (sPassword.length < 6) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";

    const rlKey = `signup:${sEmail}`;
    const rl = isRateLimited(rlKey);
    if (rl.limited) {
      const minutes = Math.ceil(rl.retryAfterMs / 60000) || 1;
      return `الحد الأقصى لمحاولات إنشاء الحساب تم الوصول إليه. حاول مرة أخرى بعد ${minutes} دقيقة.`;
    }

    const users = getUsers();
    if (users[sEmail]) {
      recordAttempt(rlKey);
      return "هذا البريد مسجل بالفعل";
    }

    const hashed = await sha256hex(sPassword);
    users[sEmail] = { name: sName, password: hashed };
    saveUsers(users);
    resetAttempts(rlKey);
    setUser({ name: sName, email: sEmail });
    return null;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
