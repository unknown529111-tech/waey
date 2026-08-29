import { Link } from "react-router-dom";
import { useT, useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect, useRef, type CSSProperties } from "react";
import "./Index.css";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

const FIELDS = [
  { to: "/health", titleKey: "fields.health", descKey: "fields.healthDesc" },
  { to: "/finance", titleKey: "fields.finance", descKey: "fields.financeDesc" },
  { to: "/environment", titleKey: "fields.environment", descKey: "fields.environmentDesc" },
  { to: "/education", titleKey: "fields.education", descKey: "fields.educationDesc" },
];

const Index = () => {
  const t = useT();
  const { lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
  }, []);

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="home-container" data-od-id="hero-page">
        <video
          className="video-bg"
          data-od-id="video-bg"
          ref={videoRef}
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="gradient-overlay" aria-hidden="true" />

        <section className="hero" data-od-id="hero">
          <h1 className="headline animate-fade-rise">
            {t("hero.title1")}
            <br />
            {title2a} <em>{title2b}</em>
          </h1>
          <p className="desc animate-fade-rise-delay">
            Waey gathers your health, money, environment, and education into one calm space — gentle
            habits, quiet streaks, and an assistant that stays with you.
          </p>
          <a
            href="#home-fields"
            className="btn-cta hero-cta animate-fade-rise-delay-2"
            data-od-id="hero-cta"
          >
            {t("hero.cta")}
          </a>
        </section>
      </div>

      <section className="home-fields" id="home-fields" data-od-id="home-fields">
        <div className="home-fields-inner">
          <div className="home-fields-head">
            <p className="home-fields-eyebrow">{t("fields.eyebrow")}</p>
              <h2 className="home-fields-title">
                {fieldsTitleA} <em>{fieldsTitleB}</em>
              </h2>
            <p className="home-fields-sub">{t("fields.subtitle")}</p>
          </div>
          <div className="field-cards">
            {FIELDS.map((f, i) => (
              <Link
                key={f.to}
                to={f.to}
                className="field-card"
                style={{ "--i": i } as CSSProperties}
              >
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

      <footer className="footer">
        <p>
          Waey — awareness in one calm place.{" "}
          <a href="#home-fields">Begin your journey</a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
