import { motion } from "framer-motion";
import BlobBackground from "./BlobBackground";
import BlurVignette from "./BlurVignette";
import { useLanguage } from "@/contexts/useLanguage";

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <header className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center gap-8 overflow-hidden bg-gradient-to-br from-leaf-light/40 via-background to-sun-warm/30">
      <BlobBackground count={2} className="z-0" />
      <BlurVignette className="z-[1]" />
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="relative z-10 text-4xl md:text-6xl font-bold text-balance leading-[1.15] tracking-tight"
      >
        {t('hero.title1')}
        <br />
        <span className="text-primary mt-6 block">{t('hero.title2')}</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16 }}
        className="relative z-10 text-base md:text-lg max-w-[55ch] text-muted-foreground text-pretty leading-[1.9]"
      >
        {t('hero.desc')}
      </motion.p>
    </header>
  );
};

export default HeroSection;
