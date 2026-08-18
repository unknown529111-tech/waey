import { ReactNode } from "react";

interface PageHeroProps {
  title: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
  titleClass?: string;
  subtitleClass?: string;
}

const PageHero = ({ title, subtitle, icon, badge, titleClass, subtitleClass }: PageHeroProps) => (
  <div className="text-center pt-14 pb-10 px-6 max-w-4xl mx-auto">
    {badge && (
      <div className="animate-fade-rise inline-flex items-center gap-2 text-xs font-body font-medium text-muted-foreground bg-card/60 border border-border/50 rounded-full px-4 py-1.5 mb-6">
        {icon}
        {badge}
      </div>
    )}
    <h1
      className={`animate-fade-rise-delay font-display font-normal text-foreground text-4xl sm:text-6xl md:text-7xl text-balance tracking-tight ${titleClass || ''}`}
      style={{ lineHeight: 1.05 }}
    >
      <span className={`rule-mark ${titleClass || ''}`}>{title}</span>
    </h1>
    {subtitle && (
      <p
        className={`animate-fade-rise-delay-2 font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed ${subtitleClass || ''}`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default PageHero;
