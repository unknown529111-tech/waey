import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/supabase/client";
import type { User } from "@supabase/supabase-js";
import { importLocalDataToSupabase, setUserId } from "@/lib/supabaseStorage";
import { useT } from "@/contexts/useLanguage";

interface AuthContextType {
  user: { name: string; email: string } | null;
  supabaseUser: User | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const t = useT();

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, error: t('auth.fillAllFields') };
    }
    if (password.length < 6) {
      return { success: false, error: t('auth.passwordMin') };
    }

    if (!supabase) {
      return { success: false, error: t('auth.registerUnavailable') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        if (error.message.includes("already")) {
          return { success: false, error: t('auth.emailAlreadyRegistered') };
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
      return { success: false, error: t('auth.connectionError') };
    }
  }, [t]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { success: false, error: t('auth.loginUnavailable') };
    }

    let name = "";

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { success: false, error: t('auth.invalidCredentials') };
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
        return { success: false, error: t('auth.connectionError') };
      }
    }
  }, [t]);

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

export type { AuthContextType };
