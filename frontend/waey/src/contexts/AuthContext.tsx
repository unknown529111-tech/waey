import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sha256hex } from "@/lib/hash";

interface User {
  name: string;
  email: string;
}

interface StoredUser {
  name: string;
  email: string;
  password: string;
  passwordHash?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "waey-auth";

function getStoredAuth(): { user: User; token: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredAuth(user: User, token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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

  const signUp = async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, error: "يرجى ملء جميع الحقول" };
    }

    if (password.length < 6) {
      return { success: false, error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
    }

    const users = getStoredUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "هذا البريد الإلكتروني مسجل بالفعل" };
    }

    const passwordHash = await sha256hex(password);
    const newUser: StoredUser = { name, email, password: "", passwordHash };
    users.push(newUser);
    saveUsers(users);

    const token = generateToken();
    setStoredAuth({ name, email }, token);
    setUser({ name, email });
    setIsAuthenticated(true);

    return { success: true };
  };

  const signIn = async (email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email === email);
    if (!found) {
      return { success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" };
    }

    let match = false;
    if (found.passwordHash) {
      const inputHash = await sha256hex(password);
      match = inputHash === found.passwordHash;
    }

    if (!match && found.password) {
      match = password === found.password;
      if (match) {
        const passwordHash = await sha256hex(password);
        found.passwordHash = passwordHash;
        found.password = "";
        saveUsers(users);
      }
    }

    if (!match) {
      return { success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" };
    }

    const token = generateToken();
    setStoredAuth({ name: found.name, email: found.email }, token);
    setUser({ name: found.name, email: found.email });
    setIsAuthenticated(true);

    return { success: true };
  };

  const signOut = () => {
    clearStoredAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoaded, signIn, signUp, signOut }}>
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

function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("waey-users");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("waey-users", JSON.stringify(users));
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}