import { ReactNode } from "react";

interface PageHeroProps {
  title: ReactNode;
  subtitle?: string;
  eyebrow?: string;
  titleClass?: string;
  subtitleClass?: string;
}

const PageHero = ({ title, subtitle, eyebrow, titleClass, subtitleClass }: PageHeroProps) => (
  <header className="pt-14 pb-8 px-6 max-w-[80rem] mx-auto text-right">
    {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
    <h1
      className={`animate-fade-rise-delay font-display font-normal text-foreground text-4xl sm:text-5xl md:text-6xl text-balance tracking-tight ${titleClass || ''}`}
      style={{ lineHeight: 1.0, letterSpacing: "-2px" }}
    >
      {title}
    </h1>
    {subtitle && (
      <p
        className={`animate-fade-rise-delay-2 font-body text-base sm:text-lg text-muted-foreground max-w-2xl mt-6 leading-relaxed ltr:text-left rtl:text-right ${subtitleClass || ''}`}
        style={{ marginInlineStart: 0 }}
      >
        {subtitle}
      </p>
    )}
  </header>
);

export default PageHero;
