import { useState, useEffect, type ReactNode } from 'react';
import ar from '@/locales/ar';
import en from '@/locales/en';
import type { Lang } from '@/locales';
import { LanguageContext } from './useLanguage';

const locales: Record<Lang, Record<string, string>> = { ar, en };
const langOrder: Lang[] = ['en', 'ar'];

function loadLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('waey-lang');
  if (langOrder.includes(stored as Lang)) return stored as Lang;
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang);
  const [locale, setLocale] = useState<Record<string, string>>(locales[loadLang()]);

  useEffect(() => {
    setLocale(locales[lang]);

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    localStorage.setItem('waey-lang', lang);
  }, [lang]);

  const setLang = (newLang: Lang) => setLangState(newLang);
  const toggleLang = () => setLangState(prev => {
    const idx = langOrder.indexOf(prev);
    return langOrder[(idx + 1) % langOrder.length];
  });

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const base = locale[key] ?? key;
    if (!vars) return base;
    return base.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match
    );
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}