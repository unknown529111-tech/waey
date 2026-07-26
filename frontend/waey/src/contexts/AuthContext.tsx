import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/supabase/client";
import type { User } from "@supabase/supabase-js";
import { importLocalDataToSupabase, setUserId } from "@/lib/supabaseStorage";

interface AuthContextType {
  user: { name: string; email: string } | null;
  supabaseUser: User | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "waey-auth";

function getStoredAuth(): { user: { name: string; email: string }; userId?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredAuth(user: { name: string; email: string }, userId?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, userId }));
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUser(stored.user);
      setIsAuthenticated(true);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        if (!user) {
          setUser({ name: session.user.user_metadata?.name || session.user.email || "", email: session.user.email || "" });
          setStoredAuth({ name: session.user.user_metadata?.name || session.user.email || "", email: session.user.email || "" }, session.user.id);
          setUserId(session.user.id);
        }
        setIsAuthenticated(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        setUser({ name: session.user.user_metadata?.name || session.user.email || "", email: session.user.email || "" });
        setStoredAuth({ name: session.user.user_metadata?.name || session.user.email || "", email: session.user.email || "" }, session.user.id);
        setUserId(session.user.id);
        setIsAuthenticated(true);
      } else {
        setSupabaseUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, error: "يرجى ملء جميع الحقول" };
    }
    if (password.length < 6) {
      return { success: false, error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
    }

    if (!supabase) {
      return { success: false, error: "خدمة التسجيل غير متاحة حاليًا" };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        if (error.message.includes("already")) {
          return { success: false, error: "هذا البريد الإلكتروني مسجل بالفعل" };
        }
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setSupabaseUser(data.user);
        setUser({ name, email });
        setStoredAuth({ name, email }, data.user.id);
        setUserId(data.user.id);
        setIsAuthenticated(true);

        // Import localStorage data
        importLocalDataToSupabase(email, data.user.id).catch(() => {});
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: "حدث خطأ في الاتصال" };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { success: false, error: "خدمة تسجيل الدخول غير متاحة حاليًا" };
    }

    let name = "";

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" };
        }
        if (data?.user) {
          name = data.user.user_metadata?.name || email;
          setSupabaseUser(data.user);
          setUser({ name, email });
          setStoredAuth({ name, email }, data.user.id);
          setUserId(data.user.id);
          setIsAuthenticated(true);

          const hasImported = localStorage.getItem("waey_imported_to_supabase");
          if (!hasImported) {
            importLocalDataToSupabase(email, data.user.id).catch(() => {});
          }
        }
        return { success: true };
      } catch {
        return { success: false, error: "حدث خطأ في الاتصال" };
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    setSupabaseUser(null);
    setUser(null);
    setIsAuthenticated(false);
    clearStoredAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isAuthenticated, isLoaded, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
