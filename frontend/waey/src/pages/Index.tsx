import { Link } from "react-router-dom";
import { useT, useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect, type CSSProperties } from "react";
import { Activity, Calculator, Sparkles, ShieldCheck, type LucideIcon } from "lucide-react";
import "./Index.css";

const CAPABILITIES: { Icon: LucideIcon; key: string }[] = [
  { Icon: Activity, key: "about.cap1" },
  { Icon: Calculator, key: "about.cap2" },
  { Icon: Sparkles, key: "about.cap3" },
  { Icon: ShieldCheck, key: "about.cap4" },
];

const FIELDS = [
  { to: "/health", titleKey: "fields.health", descKey: "fields.healthDesc", corner: "corner-accent-tl" },
  { to: "/finance", titleKey: "fields.finance", descKey: "fields.financeDesc", corner: "corner-accent-br" },
  { to: "/environment", titleKey: "fields.environment", descKey: "fields.environmentDesc", corner: "corner-accent-tr" },
  { to: "/education", titleKey: "fields.education", descKey: "fields.educationDesc", corner: "corner-accent-bl" },
];

const Index = () => {
  const t = useT();
  const { lang } = useLanguage();

  const title2 = t("hero.title2");
  const title2Split = title2.lastIndexOf(" ");
  const title2a = title2.slice(0, title2Split);
  const title2b = title2.slice(title2Split + 1);

  const fieldsTitle = t("fields.title");
  const ftSplit = fieldsTitle.indexOf(" ");
  const fieldsTitleA = fieldsTitle.slice(0, ftSplit);
  const fieldsTitleB = fieldsTitle.slice(ftSplit + 1);

  useEffect(() => {
    trackEvent("page_view", { page: "home" });
  }, []);

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="home-container" data-od-id="hero-page">
        {/* Ambient organic blobs */}
        <div className="blob blob-moss hero-blob-1" aria-hidden="true" />
        <div className="blob blob-clay hero-blob-2" aria-hidden="true" />
        <div className="blob blob-sand hero-blob-3" aria-hidden="true" />

        <section className="hero" data-od-id="hero">
          <h1 className="headline animate-fade-rise">
            {t("hero.title1")}
            <br />
            {title2a} <em>{title2b}</em>
          </h1>
          <p className="desc animate-fade-rise-delay">{t("hero.desc")}</p>
          <div className="hero-actions animate-fade-rise-delay-2">
            <a href="#home-fields" className="btn btn-moss hero-cta" data-od-id="hero-cta">
              {t("hero.cta")}
            </a>
            <Link to="/dashboard" className="btn btn-ink hero-ghost">
              {t("nav.dashboard")}
            </Link>
          </div>
        </section>
      </div>

      <section className="home-about" id="what-is-waey" data-od-id="home-about">
        <div className="blob blob-clay about-blob" aria-hidden="true" />
        <div className="home-about-inner">
          <div className="home-about-head">
            <p className="eyebrow">{t("about.eyebrow")}</p>
            <h2 className="home-about-title">{t("about.title")}</h2>
            <p className="home-about-lead">{t("about.lead")}</p>
          </div>

          <div className="about-caps">
            {CAPABILITIES.map(({ Icon, key }) => (
              <article key={key} className="about-cap">
                <span className="about-cap-icon" aria-hidden="true">
                  <Icon className="size-6" />
                </span>
                <h3 className="about-cap-title">{t(`${key}.title`)}</h3>
                <p className="about-cap-desc">{t(`${key}.desc`)}</p>
              </article>
            ))}
          </div>

          <p className="about-calm">{t("about.calm")}</p>
        </div>
      </section>

      <section className="home-fields" id="home-fields" data-od-id="home-fields">
        <div className="home-fields-inner">
          <div className="home-fields-head">
            <p className="eyebrow">{t("fields.eyebrow")}</p>
            <h2 className="home-fields-title">
              {fieldsTitleA} <em className="em-muted">{fieldsTitleB}</em>
            </h2>
            <p className="home-fields-sub">{t("fields.subtitle")}</p>
          </div>
          <div className="field-cards">
            {FIELDS.map((f, i) => (
              <Link
                key={f.to}
                to={f.to}
                className={`field-card ${f.corner}`}
                style={{ "--i": i } as CSSProperties}
              >
                <span className="marker-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="field-card-title">{t(f.titleKey)}</span>
                <span className="field-card-desc">{t(f.descKey)}</span>
                <span className="field-card-arrow">
                  {lang === "ar" ? t("fields.open") : "Open →"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

