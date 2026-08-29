import { useT, useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect, useRef } from "react";
import "./Environment.css";

const ENVIRONMENT_VIDEO = "/Environment-tab.mp4";

const Environment = () => {
  const t = useT();
  const { lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "environment" });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
  }, []);

  const cleaners = [
    {
      chemical: t('env.cleaner.0.chemical'),
      natural: t('env.cleaner.0.natural'),
      benefit: t('env.cleaner.0.benefit'),
    },
    {
      chemical: t('env.cleaner.1.chemical'),
      natural: t('env.cleaner.1.natural'),
      benefit: t('env.cleaner.1.benefit'),
    },
    {
      chemical: t('env.cleaner.2.chemical'),
      natural: t('env.cleaner.2.natural'),
      benefit: t('env.cleaner.2.benefit'),
    },
    {
      chemical: t('env.cleaner.3.chemical'),
      natural: t('env.cleaner.3.natural'),
      benefit: t('env.cleaner.3.benefit'),
    },
    {
      chemical: t('env.cleaner.4.chemical'),
      natural: t('env.cleaner.4.natural'),
      benefit: t('env.cleaner.4.benefit'),
    },
  ];

  const energyTips = [
    { title: t('env.tip.0.title'), desc: t('env.tip.0.desc') },
    { title: t('env.tip.1.title'), desc: t('env.tip.1.desc') },
    { title: t('env.tip.2.title'), desc: t('env.tip.2.desc') },
    { title: t('env.tip.3.title'), desc: t('env.tip.3.desc') },
    { title: t('env.tip.4.title'), desc: t('env.tip.4.desc') },
    { title: t('env.tip.5.title'), desc: t('env.tip.5.desc') },
  ];

  const zeroWaste = [
    { title: t('env.zeroWaste.0.title'), desc: t('env.zeroWaste.0.desc'), impact: t('env.zeroWaste.0.impact') },
    { title: t('env.zeroWaste.1.title'), desc: t('env.zeroWaste.1.desc'), impact: t('env.zeroWaste.1.impact') },
    { title: t('env.zeroWaste.2.title'), desc: t('env.zeroWaste.2.desc'), impact: t('env.zeroWaste.2.impact') },
    { title: t('env.zeroWaste.3.title'), desc: t('env.zeroWaste.3.desc'), impact: t('env.zeroWaste.3.impact') },
  ];

  const stats = [
    { num: t('env.stat.0.stat'), cap: t('env.stat.0.unit'), note: t('env.stat.0.impact') },
    { num: t('env.stat.1.stat'), cap: t('env.stat.1.unit'), note: t('env.stat.1.impact') },
    { num: t('env.stat.2.stat'), cap: t('env.stat.2.unit'), note: t('env.stat.2.impact') },
    { num: t('env.stat.3.stat'), cap: t('env.stat.3.unit'), note: t('env.stat.3.impact') },
  ];

  const recycling = [
    { title: t('recycle.idea.0.title'), desc: t('recycle.idea.0.desc') },
    { title: t('recycle.idea.1.title'), desc: t('recycle.idea.1.desc') },
    { title: t('recycle.idea.2.title'), desc: t('recycle.idea.2.desc') },
    { title: t('recycle.idea.3.title'), desc: t('recycle.idea.3.desc') },
  ];

  return (
    <div className="relative min-h-[60vh] pb-16" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="field-hero-media">
        <video
          className="field-video-bg"
          ref={videoRef}
          src={ENVIRONMENT_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="field-video-overlay" aria-hidden="true" />

        <header className="field-hero">
          <p className="field-eyebrow">{t("env.eyebrow")}</p>
          <h1 className="field-title">{t("env.h1a")} <em>{t("env.h1b")}</em></h1>
          <p className="field-desc">
            {t("env.heroDesc")}
          </p>
        </header>
      </div>

      <section className="field-section" data-od-id="natural-cleaners">
        <div className="field-section-head">
          <p className="field-section-kicker">{t('env.naturalCleaners.title')}</p>
          <h2 className="field-section-title">{t("env.h2.swap1")} <em>{t("env.h2.swap2")}</em></h2>
          <p className="field-section-sub">{t('env.naturalCleaners.subtitle')}</p>
        </div>
        <table className="alt-table" data-od-id="cleaners-table">
          <thead>
            <tr>
              <th className="col-chem">{t('env.cleaner.table.chemical')}</th>
              <th className="col-nat">{t('env.cleaner.table.natural')}</th>
              <th className="col-ben">{t('env.cleaner.table.benefit')}</th>
            </tr>
          </thead>
          <tbody>
            {cleaners.map((c, i) => (
              <tr key={i}>
                <td className="col-chem">{c.chemical}</td>
                <td className="col-nat nat">{c.natural}</td>
                <td className="col-ben ben">{c.benefit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="field-section" data-od-id="energy-water">
        <div className="field-section-head">
          <p className="field-section-kicker">{t('env.energyWater.title')}</p>
          <h2 className="field-section-title">{t("env.h2.less1")} <em>{t("env.h2.less2")}</em></h2>
          <p className="field-section-sub">{t('env.energyWater.subtitle')}</p>
        </div>
      </section>
      <div className="feature-grid">
        {energyTips.map((tip, i) => (
          <div className="feature" key={i}>
            <h3>{tip.title}</h3>
            <p>{tip.desc}</p>
          </div>
        ))}
      </div>

      <section className="field-section" data-od-id="zero-waste">
        <div className="field-section-head">
          <p className="field-section-kicker">{t('env.zeroWaste.title')}</p>
          <h2 className="field-section-title">{t("env.h2.waste1")} <em>{t("env.h2.waste2")}</em></h2>
          <p className="field-section-sub">{t('env.zeroWaste.subtitle')}</p>
        </div>
      </section>
      <div className="feature-grid">
        {zeroWaste.map((item, i) => (
          <div className="feature" key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <span className="benefit">{item.impact}</span>
          </div>
        ))}
      </div>

      <section className="field-section" data-od-id="visual-stats">
        <div className="field-section-head">
          <p className="field-section-kicker">{t('env.visualStats.title')}</p>
          <h2 className="field-section-title">{t("env.h2.numbers1")} <em>{t("env.h2.numbers2")}</em></h2>
          <p className="field-section-sub">{t('env.visualStats.subtitle')}</p>
        </div>
      </section>
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="num">{s.num}</div>
            <div className="cap">{s.cap}</div>
            <div className="note">{s.note}</div>
          </div>
        ))}
      </div>

      <section className="field-section" data-od-id="recycling">
        <div className="field-section-head">
          <p className="field-section-kicker">{t('recycle.title')}</p>
          <h2 className="field-section-title">{t("env.h2.treasure1")} <em>{t("env.h2.treasure2")}</em></h2>
          <p className="field-section-sub">{t("env.recycleSub")}</p>
        </div>
      </section>
      <div className="feature-grid">
        {recycling.map((item, i) => (
          <div className="feature" key={i}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      <footer className="footer">
        <p>{t("footer.tagline")} <a href="/">{t("footer.backHome")}</a></p>
      </footer>
    </div>
  );
};

export default Environment;
