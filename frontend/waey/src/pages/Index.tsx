import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Droplet, ShoppingCart, Sparkles, Utensils } from "lucide-react";
import heroNature from "@/assets/hero-nature.jpg";
import ArticleCard from "@/components/primitives/ArticleCard";
import FieldCard from "@/components/primitives/FieldCard";
import NewsletterBand from "@/components/primitives/NewsletterBand";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import StatBand from "@/components/primitives/StatBand";
import TipList from "@/components/primitives/TipList";
import ToolCard from "@/components/primitives/ToolCard";
import { useLanguage, useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { setEmailReminderEnabled } from "@/lib/emailReminder";
import "./Index.css";

const REMINDER_EMAIL_KEY = "waey_reminder_email";

// One shell for every band, so the page reads as one column of sections.
const SHELL = "mx-auto w-full max-w-[80rem] px-6 py-14 sm:py-20";
const GRID = "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4";

const FIELDS = [
  { field: "health", to: "/health", titleKey: "fields.health", descKey: "fields.healthDesc" },
  { field: "finance", to: "/finance", titleKey: "fields.finance", descKey: "fields.financeDesc" },
  {
    field: "environment",
    to: "/environment",
    titleKey: "fields.environment",
    descKey: "fields.environmentDesc",
  },
  {
    field: "education",
    to: "/education",
    titleKey: "fields.education",
    descKey: "fields.educationDesc",
  },
] as const;

// Real app copy: the quick-tips families already written in ar.ts / en.ts.
const INSIGHTS = [
  { tipKey: "quicktips.week1.tip1", excerptKey: "home.insights.excerpt1" },
  { tipKey: "quicktips.week1.tip2", excerptKey: "home.insights.excerpt2" },
  { tipKey: "quicktips.week1.tip3", excerptKey: "home.insights.excerpt3" },
  { tipKey: "quicktips.week1.tip4", excerptKey: "home.insights.excerpt4" },
];

const TIPS = [
  "quicktips.week3.tip1",
  "quicktips.week3.tip2",
  "quicktips.week3.tip3",
  "quicktips.week3.tip4",
];

const TOOLS = [
  { icon: Droplet, to: "/health", key: "home.tools.tracker" },
  { icon: Utensils, to: "/recipes", key: "home.tools.recipes" },
  { icon: ShoppingCart, to: "/shopping-list", key: "home.tools.shopping" },
  { icon: Sparkles, to: "/insights", key: "home.tools.insights" },
];

const Index = () => {
  const t = useT();
  const { lang } = useLanguage();
  const [reminderSaved, setReminderSaved] = useState(false);

  useEffect(() => {
    trackEvent("page_view", { page: "home" });
  }, []);

  // No mailing list in this app: the address stays on this device and turns on
  // the existing daily reminder toggle.
  const saveReminder = (email: string) => {
    try {
      localStorage.setItem(REMINDER_EMAIL_KEY, email);
    } catch {
      /* private mode — the reminder toggle below still works */
    }
    setEmailReminderEnabled(true);
    setReminderSaved(true);
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="home">
      <PageHero
        eyebrow={t("home.hero.eyebrow")}
        title={t("home.hero.title")}
        lead={t("home.hero.lead")}
        primaryAction={{ label: t("home.hero.primary"), to: "/dashboard" }}
        secondaryAction={{ label: t("home.hero.secondary"), to: "/health" }}
        media={
          <div className="home-media">
            <img
              src={heroNature}
              alt={t("home.hero.mediaAlt")}
              width={1160}
              height={790}
              loading="eager"
              decoding="async"
            />
          </div>
        }
      />

      <section className={SHELL} aria-labelledby="home-fields">
        <div id="home-fields">
          <SectionHeading
            eyebrow={t("fields.eyebrow")}
            title={t("fields.title")}
            lead={t("fields.subtitle")}
          />
        </div>
        <div className={GRID}>
          {FIELDS.map(({ field, to, titleKey, descKey }, i) => (
            <div key={to} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <FieldCard field={field} to={to} title={t(titleKey)} description={t(descKey)} />
            </div>
          ))}
        </div>
      </section>

      <section className={SHELL} aria-labelledby="home-insights">
        <div id="home-insights">
          <SectionHeading
            eyebrow={t("home.insights.eyebrow")}
            title={t("home.insights.title")}
            lead={t("home.insights.lead")}
            action={{ label: t("home.insights.action"), to: "/insights" }}
          />
        </div>
        <div className={GRID}>
          {INSIGHTS.map(({ tipKey, excerptKey }, i) => (
            <div key={tipKey} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <ArticleCard
                category={t(`${tipKey}.category`)}
                title={t(`${tipKey}.tip`)}
                excerpt={t(excerptKey)}
                meta={t("home.insights.meta")}
                to="/insights"
                field="health"
              />
            </div>
          ))}
        </div>
      </section>

      <section className={SHELL} aria-labelledby="home-tools">
        <div id="home-tools">
          <SectionHeading
            eyebrow={t("home.tools.eyebrow")}
            title={t("home.tools.title")}
            lead={t("home.tools.lead")}
          />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {TOOLS.map(({ icon, to, key }, i) => (
              <div key={key} className="stagger-item" style={{ "--i": i } as CSSProperties}>
                <ToolCard
                  icon={icon}
                  to={to}
                  title={t(`${key}.title`)}
                  description={t(`${key}.desc`)}
                />
              </div>
            ))}
          </div>
          <TipList
            title={t("quicktips.title")}
            items={TIPS.map((key) => t(`${key}.tip`))}
          />
        </div>
      </section>

      <StatBand
        items={[
          { value: "4", label: t("home.stats.fields") },
          { value: "1", label: t("home.stats.platform") },
          { value: "0", label: t("home.stats.ads") },
          { value: "100%", label: t("home.stats.data") },
        ]}
      />

      <NewsletterBand
        heading={t("home.newsletter.heading")}
        description={t("home.newsletter.description")}
        placeholder={t("home.newsletter.placeholder")}
        buttonLabel={t("home.newsletter.button")}
        onSubmit={saveReminder}
      />
      <div className="bg-secondary pb-12">
        <div aria-live="polite" className="mx-auto w-full max-w-[80rem] px-6">
          {reminderSaved && (
            <p className="font-body text-sm font-bold text-secondary-foreground">
              {t("home.newsletter.success")}
            </p>
          )}
        </div>
      </div>

      <section className={SHELL}>
        <div className="home-cta">
          <p className="eyebrow mb-3">{t("home.cta.eyebrow")}</p>
          <h2 className="font-display text-3xl text-balance tracking-tight text-foreground sm:text-4xl">
            {t("home.cta.title")}
          </h2>
          <p className="font-body mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t("home.cta.lead")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/dashboard" className="btn btn-moss min-h-11 px-6 text-sm">
              {t("home.cta.dashboard")}
            </Link>
            <Link to="/recipes" className="btn btn-ink min-h-11 px-6 text-sm">
              {t("home.cta.recipes")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
