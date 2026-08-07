import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeroProps {
  title: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
  titleClass?: string;
  subtitleClass?: string;
}

const PageHero = ({ title, subtitle, titleClass, subtitleClass }: PageHeroProps) => (
  <div className="text-center py-12 px-4 sm:px-6 lg:px-8 max-w-[60ch] mx-auto">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-4xl md:text-6xl font-bold text-primary tracking-tight mb-4"
    >
      <span className={`rule-mark ${titleClass || ''}`}>{title}</span>
    </motion.h1>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`text-base md:text-lg text-muted-foreground max-w-[55ch] mx-auto leading-[1.9] ${subtitleClass || ''}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export default PageHero;
