import { useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import { useLanguage } from "@/contexts/useLanguage";
import "./Faq.css";

const FAQ_KEYS = [
  "what",
  "trackers",
  "streak",
  "points",
  "data",
  "offline",
  "pwa",
] as const;

const SHELL = "mx-auto w-full max-w-[80rem] px-6";

const Faq = () => {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState("");
  // One answer at a time, the first one open so the page is not seven closed lids.
  const [openKey, setOpenKey] = useState<string | null>(FAQ_KEYS[0]);
  const searchId = useId();

  // Search reads the question's own keywords in BOTH languages, so an Arabic
  // page finds an English word and an English page finds an Arabic one.
  //
  // The keywords come from the dictionary this page already has, and NOT
  // from importing @/locales/ar and @/locales/en directly. Importing them
  // here moved both dictionaries into this page's chunk and made the entry
  // pull it eagerly: the entry grew from 92 kB to 368 kB and the whole build
  // grew by 209 kB, for a page most visitors never open.
  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [...FAQ_KEYS];
    return FAQ_KEYS.filter((key) =>
      [
        t(`faq.${key}.title`),
        t(`faq.${key}.searchAr`),
        t(`faq.${key}.searchEn`),
      ].some((text) => text?.toLowerCase().includes(needle)),
    );
  }, [query, t]);

  return (
    <div className="faq" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="utility-hero">
        <PageHero
          eyebrow={t("faq.eyebrow")}
          title={t("faq.title")}
          lead={t("faq.subtitle")}
        />
      </div>

      {/* ═══════════ FIND ONE ANSWER ═══════════ */}
      <section className={`${SHELL} pb-16`} aria-label={t("faq.list.title")}>
        <SectionHeading
          eyebrow={t("faq.list.eyebrow")}
          title={t("faq.list.title")}
          lead={t("faq.list.lead")}
        />

        <div className="faq-search">
          <label htmlFor={searchId} className="faq-search-label">
            {t("faq.search.label")}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("faq.search.placeholder")}
            autoComplete="off"
            className="field faq-search-input"
          />
        </div>

        {items.length === 0 ? (
          <div role="status" className="faq-empty">
            <p className="font-display faq-empty-title">{t("faq.empty.title")}</p>
            <p className="font-body faq-empty-body">{t("faq.empty.body")}</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="faq-clear"
            >
              {t("faq.empty.clear")}
            </button>
          </div>
        ) : (
          <ul role="list" className="faq-list">
            {items.map((key) => {
              const open = openKey === key;
              const panelId = `faq-panel-${key}`;
              const buttonId = `faq-question-${key}`;
              return (
                <li key={key} className="faq-item">
                  <h3 className="faq-q-heading">
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={open}
                      aria-controls={panelId}
                      className="faq-q"
                      onClick={() => setOpenKey(open ? null : key)}
                    >
                      <span className="font-display faq-q-text">
                        {t(`faq.${key}.title`)}
                      </span>
                      <ChevronDown className="faq-chevron" aria-hidden />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!open}
                    className="faq-a"
                  >
                    <p className="font-body">{t(`faq.${key}.body`)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ═══════════ WHERE NEXT ═══════════ */}
      <section className={`${SHELL} pb-20`} aria-label={t("faq.closing.title")}>
        <div className="faq-cta">
          <p className="eyebrow">{t("faq.closing.eyebrow")}</p>
          <h2 className="font-display faq-cta-title">{t("faq.closing.title")}</h2>
          <p className="font-body faq-cta-body">{t("faq.closing.body")}</p>
          <div className="faq-cta-actions">
            <Link to="/assistant" className="faq-cta-primary">
              {t("faq.closing.assistant")}
            </Link>
            <Link to="/dashboard" className="faq-cta-secondary">
              {t("faq.closing.dashboard")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
