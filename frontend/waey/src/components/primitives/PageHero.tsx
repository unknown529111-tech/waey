import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguage";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  primaryAction?: { label: string; to: string };
  secondaryAction?: { label: string; to: string };
  media?: ReactNode;
}

const PageHero = ({
  eyebrow,
  title,
  lead,
  primaryAction,
  secondaryAction,
  media,
}: PageHeroProps) => {
  const { lang, t } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <header
      aria-label={t("prim.pageHero.label")}
      className="animate-fade-rise mx-auto w-full max-w-[80rem] px-6 py-14 sm:py-20"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0 max-w-2xl text-start">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="font-display text-4xl break-words tracking-tight text-balance text-foreground sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {lead && (
            <p className="font-body mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {lead}
            </p>
          )}

          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {primaryAction && (
                <Link
                  to={primaryAction.to}
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-soft transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                >
                  {primaryAction.label}
                  <Arrow
                    data-testid="arrow"
                    className="size-4 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              )}
              {secondaryAction && (
                <Link
                  to={secondaryAction.to}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-bold text-foreground shadow-soft transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>

        {media && (
          <div role="group" aria-label={t("prim.pageHero.media")} className="min-w-0">
            {media}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHero;
