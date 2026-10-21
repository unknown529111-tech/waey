import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageContext } from "@/contexts/useLanguage";
import ar from "@/locales/ar";
import en from "@/locales/en";

export function renderInLang(ui: ReactElement, lang: "ar" | "en" = "ar") {
  const dict = lang === "ar" ? ar : en;
  const t = (key: string) => dict[key] ?? key;

  return render(
    <LanguageContext.Provider value={{ lang, setLang: () => {}, toggleLang: () => {}, t }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </LanguageContext.Provider>,
  );
}
