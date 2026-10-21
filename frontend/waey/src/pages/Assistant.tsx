import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, HardDrive, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AIChat from "@/components/AIChat";
import FieldCard from "@/components/primitives/FieldCard";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import type { Field } from "@/components/primitives/FieldCard";
import { useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import "./utility-hero.css";
import "./Assistant.css";

const SHELL = "mx-auto w-full max-w-[80rem] px-6";

const FIELDS: { field: Field; to: string }[] = [
  { field: "health", to: "/health" },
  { field: "finance", to: "/finance" },
  { field: "environment", to: "/environment" },
  { field: "education", to: "/education" },
];

const NOTES: { key: string; icon: LucideIcon }[] = [
  { key: "history", icon: HardDrive },
  { key: "context", icon: Activity },
  { key: "proxy", icon: Server },
];

const Assistant = () => {
  const { lang, t } = useLanguage();

  useEffect(() => {
    trackEvent("page_view", { page: "assistant" });
  }, []);

  return (
    <div className="assistant" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="utility-hero">
        <PageHero
          eyebrow={t("assistant.eyebrow")}
          title={t("assistant.title")}
          lead={t("assistant.subtitle")}
        />
      </div>

      {/* ═══════════ THE CHAT ═══════════ */}
      <AIChat />

      {/* ═══════════ WHAT IT COVERS ═══════════ */}
      <section className={`${SHELL} mt-16`} aria-label={t("assistant.cover.title")}>
        <SectionHeading
          eyebrow={t("assistant.cover.eyebrow")}
          title={t("assistant.cover.title")}
          lead={t("assistant.cover.lead")}
        />
        <div className="asst-fields">
          {FIELDS.map(({ field, to }) => (
            <FieldCard
              key={field}
              field={field}
              to={to}
              title={t(`fields.${field}`)}
              description={t(`assistant.cover.${field}`)}
            />
          ))}
        </div>
      </section>

      {/* ═══════════ WHAT IS KEPT ═══════════ */}
      <section className={`${SHELL} mt-16`} aria-label={t("assistant.privacy.title")}>
        <SectionHeading
          eyebrow={t("assistant.privacy.eyebrow")}
          title={t("assistant.privacy.title")}
          lead={t("assistant.privacy.lead")}
        />
        <ul role="list" className="asst-notes">
          {NOTES.map(({ key, icon: Icon }) => (
            <li key={key} className="asst-note">
              <span className="asst-note-icon">
                <Icon aria-hidden />
              </span>
              <div>
                <h3 className="font-display asst-note-title">
                  {t(`assistant.privacy.${key}.title`)}
                </h3>
                <p className="font-body asst-note-body">
                  {t(`assistant.privacy.${key}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══════════ WHERE NEXT ═══════════ */}
      <section className={`${SHELL} mt-16 pb-20`} aria-label={t("assistant.cta.title")}>
        <div className="asst-cta">
          <p className="eyebrow">{t("assistant.cta.eyebrow")}</p>
          <h2 className="font-display asst-cta-title">{t("assistant.cta.title")}</h2>
          <p className="font-body asst-cta-body">{t("assistant.cta.body")}</p>
          <div className="asst-cta-actions">
            <Link to="/dashboard" className="asst-cta-primary">
              {t("assistant.cta.dashboard")}
            </Link>
            <Link to="/faq" className="asst-cta-secondary">
              {t("assistant.cta.faq")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assistant;
