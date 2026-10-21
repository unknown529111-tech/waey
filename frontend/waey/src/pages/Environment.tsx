import { useEffect, useRef, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Leaf, Recycle, Salad, Sparkles, Zap } from "lucide-react";
import ArticleCard from "@/components/primitives/ArticleCard";
import NextField from "@/components/NextField";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import StatBand from "@/components/primitives/StatBand";
import TipList from "@/components/primitives/TipList";
import ToolCard from "@/components/primitives/ToolCard";
import { useLanguage, useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import "./Environment.css";

const ENVIRONMENT_VIDEO = "/Environment-tab.mp4";

/* ── Page shell (same idiom as Health.tsx) ───────────────────── */

const SHELL = "mx-auto w-full max-w-[80rem] px-6 py-14 sm:py-20";
const GRID = "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4";
const TOOL_GRID = "mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3";

// Every card points at an anchor on this page, or a route in App.tsx.
const TOOLS = [
  { icon: Leaf, to: "/dashboard", titleKey: "dash.eco", descKey: "env.ecoTrackerDesc" },
  {
    icon: Sparkles,
    to: "#cleaners",
    titleKey: "env.naturalCleaners.title",
    descKey: "env.naturalCleaners.subtitle",
  },
  { icon: Zap, to: "#tips", titleKey: "env.energyWater.title", descKey: "env.energyWater.subtitle" },
  { icon: Salad, to: "#waste", titleKey: "env.zeroWaste.title", descKey: "env.zeroWaste.subtitle" },
  { icon: Recycle, to: "#recycling", titleKey: "recycle.title", descKey: "recycle.subtitle" },
  {
    icon: BarChart3,
    to: "#numbers",
    titleKey: "env.visualStats.title",
    descKey: "env.visualStats.subtitle",
  },
];

const INSIGHTS = [
  { categoryKey: "env.zeroWaste.title", titleKey: "env.zeroWaste.0.title", excerptKey: "env.zeroWaste.0.desc" },
  { categoryKey: "recycle.title", titleKey: "recycle.idea.0.title", excerptKey: "recycle.idea.0.desc" },
  { categoryKey: "env.energyWater.title", titleKey: "env.tip.2.title", excerptKey: "env.tip.2.desc" },
  {
    categoryKey: "env.naturalCleaners.title",
    titleKey: "env.cleaner.1.natural",
    excerptKey: "env.cleaner.1.benefit",
  },
];

const Environment = () => {
  const t = useT();
  const { lang } = useLanguage();
  const { hash, key } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "environment" });
  }, []);

  // The hero clip stays still when the reader asked for less motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
  }, []);

  // ToolCard renders a router Link, and a hash navigation does not scroll on
  // its own — so the cards' #anchors are honoured here.
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }, [hash, key]);

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

  // The page's checklist: each saved tip keeps both its heading and its why.
  const energyTips = [
    `${t('env.tip.0.title').trim()} — ${t('env.tip.0.desc')}`,
    `${t('env.tip.1.title').trim()} — ${t('env.tip.1.desc')}`,
    `${t('env.tip.2.title').trim()} — ${t('env.tip.2.desc')}`,
    `${t('env.tip.3.title').trim()} — ${t('env.tip.3.desc')}`,
    `${t('env.tip.4.title').trim()} — ${t('env.tip.4.desc')}`,
    `${t('env.tip.5.title').trim()} — ${t('env.tip.5.desc')}`,
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
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="environment">
      <PageHero
        eyebrow={t("env.eyebrow")}
        title={t("env.title")}
        lead={t("env.subtitle")}
        primaryAction={{ label: t("env.hero.primary"), to: "#cleaners" }}
        media={
          <div className="environment-media">
            <video
              ref={videoRef}
              src={ENVIRONMENT_VIDEO}
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
            />
          </div>
        }
      />

      <section className={SHELL} aria-label={t("env.intro.title")}>
        <SectionHeading
          eyebrow={t("field.intro.eyebrow")}
          title={t("env.intro.title")}
          lead={t("env.intro.lead")}
        />
      </section>

      <section className={SHELL} aria-label={t("env.tools.title")}>
        <SectionHeading
          eyebrow={t("env.tools.eyebrow")}
          title={t("env.tools.title")}
          lead={t("env.tools.lead")}
        />
        <div className={TOOL_GRID}>
          {TOOLS.map(({ icon, to, titleKey, descKey }, i) => (
            <div key={titleKey} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <ToolCard icon={icon} to={to} title={t(titleKey)} description={t(descKey)} />
            </div>
          ))}
        </div>
      </section>

      <section className="field-section" id="cleaners" data-od-id="natural-cleaners">
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

      {/* Energy & water — the page's checklist */}
      <section id="tips" className={SHELL} aria-label={t("quicktips.title")}>
        <SectionHeading
          eyebrow={t("env.eyebrow")}
          title={t("quicktips.title")}
          lead={t("quicktips.subtitle")}
        />
        <div className="mt-10 max-w-3xl">
          <TipList title={t("env.tips.checklist")} items={energyTips} />
        </div>
      </section>

      <section className="field-section" id="waste" data-od-id="zero-waste">
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

      <section className="field-section" id="numbers" data-od-id="visual-stats">
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

      <section className="field-section" id="recycling" data-od-id="recycling">
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

      <section className={SHELL} aria-label={t("env.insights.title")}>
        <SectionHeading
          eyebrow={t("env.insights.eyebrow")}
          title={t("env.insights.title")}
          lead={t("env.insights.lead")}
          action={{ label: t("home.insights.action"), to: "/insights" }}
        />
        <div className={GRID}>
          {INSIGHTS.map(({ categoryKey, titleKey, excerptKey }, i) => (
            <div key={titleKey} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <ArticleCard
                category={t(categoryKey)}
                title={t(titleKey)}
                excerpt={t(excerptKey)}
                meta={t("env.insights.meta")}
                to="/insights"
                field="environment"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="environment-stat">
        <StatBand
          items={[
            { value: String(TOOLS.length), label: t("env.stats.tools") },
            { value: String(energyTips.length), label: t("env.stats.tips") },
            { value: "0", label: t("home.stats.ads") },
            { value: "100%", label: t("home.stats.data") },
          ]}
        />
      </div>

      <section className={SHELL}>
        <div className="environment-cta">
          <p className="eyebrow mb-3">{t("home.cta.eyebrow")}</p>
          <h2 className="font-display text-3xl text-balance tracking-tight text-foreground sm:text-4xl">
            {t("env.cta.title")}
          </h2>
          <p className="font-body mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t("env.cta.body")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="#cleaners" className="btn btn-solid min-h-11 px-6 text-sm">
              {t("env.naturalCleaners.title")}
            </Link>
            <Link to="/dashboard" className="btn btn-ghost min-h-11 px-6 text-sm">
              {t("home.cta.dashboard")}
            </Link>
            <NextField
              to="education"
              toRoute="/education"
              label={t("field.next.environment")}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Environment;
