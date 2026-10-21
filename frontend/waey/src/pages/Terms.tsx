import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import { useLanguage } from "@/contexts/useLanguage";
import "./utility-hero.css";
import "./Legal.css";

const SHELL = "mx-auto w-full max-w-[80rem] px-6";

// The dictionary owns the copy; this table only says which keys exist.
// `body: false` marks a section that is a list and no paragraph.
const SECTIONS: { key: string; items?: string[]; contact?: boolean; body?: boolean }[] = [
  { key: "s1" },
  { key: "s2" },
  { key: "s3" },
  { key: "s4" },
  { key: "s5", items: ["item1", "item2", "item3", "item4"], body: false },
  { key: "s6" },
  { key: "s7" },
  { key: "s8", contact: true },
];

const Terms = () => {
  const { lang, t } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="legal" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="utility-hero">
        <PageHero
          eyebrow={t("legal.terms.eyebrow")}
          title={t("terms.title")}
          lead={t("terms.subtitle")}
        />
      </div>

      {/* ═══════════ FIND THE CLAUSE ═══════════ */}
      <section className={SHELL} aria-label={t("legal.contents.title")}>
        <SectionHeading
          eyebrow={t("legal.contents.eyebrow")}
          title={t("legal.contents.title")}
          lead={t("legal.contents.lead")}
        />

        <div className="legal-layout">
          <nav className="legal-rail" aria-labelledby="terms-toc-title">
            <p id="terms-toc-title" className="eyebrow legal-rail-title">
              {t("legal.nav.label")}
            </p>
            <ul role="list" className="legal-toc">
              {SECTIONS.map(({ key }) => (
                <li key={key}>
                  <a href={`#terms-${key}`} className="legal-toc-link">
                    {t(`terms.${key}.title`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="legal-body">
            {SECTIONS.map(({ key, items, contact, body = true }) => (
              <section
                key={key}
                id={`terms-${key}`}
                tabIndex={-1}
                className="legal-card"
              >
                <SectionHeading title={t(`terms.${key}.title`)} />
                {body && (
                  <p className="font-body legal-p">
                    {t(`terms.${key}.body`)}{" "}
                    {contact && (
                      <a
                        href="mailto:waey.official.mk@gmail.com"
                        className="legal-mail"
                      >
                        waey.official.mk@gmail.com
                      </a>
                    )}
                  </p>
                )}
                {items && (
                  <ul role="list" className="legal-items">
                    {items.map((item) => (
                      <li key={item} className="font-body">
                        {t(`terms.${key}.${item}`)}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHERE NEXT ═══════════ */}
      <section className={`${SHELL} pb-20`} aria-label={t("legal.closing.title")}>
        <div className="legal-cta">
          <p className="eyebrow">{t("legal.closing.eyebrow")}</p>
          <h2 className="font-display legal-cta-title">{t("legal.closing.title")}</h2>
          <p className="font-body legal-cta-body">{t("legal.closing.body")}</p>
          <div className="legal-cta-actions">
            <Link to="/dashboard" className="legal-cta-primary">
              {t("legal.closing.back")}
              <Arrow className="size-4" aria-hidden />
            </Link>
            <a
              href="mailto:waey.official.mk@gmail.com"
              className="legal-cta-secondary"
            >
              <Mail className="size-4" aria-hidden />
              waey.official.mk@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
