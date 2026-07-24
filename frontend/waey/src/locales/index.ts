import ar from './ar';
import en from './en';

export type Locale = Record<string, string>;

const locales: Record<string, Locale> = { ar, en };

export type Lang = 'ar' | 'en';

export function getLocale(lang: Lang): Locale {
  return locales[lang] || ar;
}