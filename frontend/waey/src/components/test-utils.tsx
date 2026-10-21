import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageContext } from "@/contexts/useLanguage";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import ar from "@/locales/ar";
import en from "@/locales/en";

const DICTS = { ar, en };

/**
 * Renders the site chrome (navbar, footer) with the contexts it needs:
 * language, router, auth and theme. `path` sets the router's location so
 * the active-route state can be exercised.
 */
export function renderChrome(
  ui: ReactElement,
  { lang = "ar" as "ar" | "en", path = "/", auth }: {
    lang?: "ar" | "en";
    path?: string;
    auth?: Partial<AuthContextType>;
  } = {},
) {
  const dict = DICTS[lang];
  const t = (key: string, vars?: Record<string, string | number>) => {
    const base = dict[key] ?? key;
    if (!vars) return base;
    return base.replace(/\{(\w+)\}/g, (m, name) =>
      name in vars ? String(vars[name]) : m,
    );
  };

  const authValue: AuthContextType = {
    user: null,
    supabaseUser: null,
    isAuthenticated: false,
    isLoaded: true,
    signIn: async () => ({ success: true }),
    signUp: async () => ({ success: true }),
    signOut: () => {},
    ...auth,
  };

  return render(
    <LanguageContext.Provider value={{ lang, setLang: () => {}, toggleLang: () => {}, t }}>
      <AuthContext.Provider value={authValue}>
        <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {}, setTheme: () => {} }}>
          <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </LanguageContext.Provider>,
  );
}
