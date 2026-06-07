import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import ar from '@/locales/ar';
import en from '@/locales/en';
import type { Lang } from '@/locales';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const locales: Record<Lang, Record<string, string>> = { ar, en };

function loadLang(): Lang {
  if (typeof window === 'undefined') return 'ar';
  const stored = localStorage.getItem('waey-lang');
  if (stored === 'ar' || stored === 'en') return stored;
  return 'ar';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);
  const [locale, setLocale] = useState<Record<string, string>>(locales[loadLang()]);

  useEffect(() => {
    setLocale(locales[lang]);

    // Set dir on <html>
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    localStorage.setItem('waey-lang', lang);
  }, [lang]);

  const setLang = (newLang: Lang) => setLangState(newLang);
  const toggleLang = () => setLangState(prev => (prev === 'ar' ? 'en' : 'ar'));

  const t = (key: string): string => locale[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export function useT(): (key: string) => string {
  return useLanguage().t;
}
