import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
}

const PageHero = ({ title, subtitle, icon, badge }: PageHeroProps) => (
  <div className="text-center py-12 px-4 sm:px-6 lg:px-8 max-w-[60ch] mx-auto">
    {badge && (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 bg-card/70 backdrop-blur px-5 py-2 rounded-full text-xs font-bold text-muted-foreground border border-border/50 shadow-soft mb-5 hover:scale-105 transition-transform duration-300"
      >
        {icon}
        {badge}
      </motion.span>
    )}
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-4"
    >
      {title}
    </motion.h1>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base md:text-lg text-muted-foreground max-w-[55ch] mx-auto leading-[1.9]"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export default PageHero;
