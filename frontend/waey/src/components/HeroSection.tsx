import BlobBackground from "./BlobBackground";
import BlurVignette from "./BlurVignette";
import HeroVideoBackground from "./HeroVideoBackground";
import { useLanguage } from "@/contexts/useLanguage";

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <header className="relative overflow-hidden">
      <BlobBackground count={2} className="z-0" />
      <BlurVignette className="z-[1]" />
      <HeroVideoBackground />

      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
        style={{ paddingTop: "calc(8rem - 75px)" }}
      >
        <div className="animate-fade-rise mb-0">
          <h1
            className="font-display font-normal text-foreground text-5xl sm:text-7xl md:text-8xl max-w-7xl text-balance"
            style={{ lineHeight: 0.95, letterSpacing: "-2.46px" }}
          >
            {t('hero.title1')}
            <br />
            <span className="text-muted-foreground">{t('hero.title2')}</span>
          </h1>
        </div>

        <p className="animate-fade-rise-delay font-body text-base sm:text-lg text-muted-foreground max-w-2xl mt-8 leading-relaxed">
          {t('hero.desc')}
        </p>
      </section>
    </header>
  );
};

export default HeroSection;
