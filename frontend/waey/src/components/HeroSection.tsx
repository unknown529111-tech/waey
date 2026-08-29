import HeroVideoBackground from "./HeroVideoBackground";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";
import type { CSSProperties } from "react";

const FIELDS = [
  { to: "/health", key: "fields.health", descKey: "fields.healthDesc" },
  { to: "/finance", key: "fields.finance", descKey: "fields.financeDesc" },
  { to: "/environment", key: "fields.environment", descKey: "fields.environmentDesc" },
  { to: "/education", key: "fields.education", descKey: "fields.educationDesc" },
];

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <div>
      <header className="relative overflow-hidden">
        <HeroVideoBackground />

        <section
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-32"
          style={{ paddingTop: "calc(8rem - 75px)" }}
        >
          <h1
            className="animate-fade-rise font-display font-normal text-foreground text-5xl sm:text-7xl md:text-8xl max-w-7xl text-balance"
            style={{ lineHeight: 0.95, letterSpacing: "-2.46px" }}
          >
            {t('hero.title1')}
            <br />
            <span className="text-muted-foreground">{t('hero.title2')}</span>
          </h1>

          <p className="animate-fade-rise-delay font-body text-base sm:text-lg text-muted-foreground max-w-2xl mt-8 leading-relaxed">
            {t('hero.desc')}
          </p>

          <a
            href="#home-fields"
            className="btn btn-moss animate-fade-rise-delay-2 mt-12 px-14 py-5 text-base"
          >
            {t('hero.cta')}
          </a>
        </section>
      </header>

      {/* One app · four fields — editorial card grid */}
      <section id="home-fields" className="bg-background px-6 md:px-10 pt-24 pb-28">
        <div className="max-w-[80rem] mx-auto">
          <div className="max-w-[50rem] mb-12">
            <p className="eyebrow mb-4">{t('fields.eyebrow')}</p>
            <h2 className="font-display font-normal text-3xl sm:text-4xl text-foreground" style={{ lineHeight: 1.0, letterSpacing: "-1.5px" }}>
              {t('fields.title')}
            </h2>
            <p className="mt-5 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-[40rem]">
              {t('fields.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FIELDS.map((f, i) => (
              <Link
                key={f.to}
                to={f.to}
                className="ledger stagger-item group flex flex-col gap-2.5 p-8"
                style={{ "--i": i } as CSSProperties}
              >
                <span className="font-display font-normal text-3xl text-foreground" style={{ lineHeight: 1.0 }}>
                  {t(f.key)}
                </span>
                <span className="text-muted-foreground text-[0.95rem] leading-relaxed max-w-[28rem]">
                  {t(f.descKey)}
                </span>
                <span className="mt-2 text-sm font-semibold text-foreground opacity-70 group-hover:opacity-100 transition-opacity ltr:inline rtl:hidden">
                  Open ←
                </span>
                <span className="mt-2 text-sm font-semibold text-foreground opacity-70 group-hover:opacity-100 transition-opacity hidden rtl:inline">
                  {t('fields.open')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
