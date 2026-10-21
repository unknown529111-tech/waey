import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguage";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: { label: string; to: string };
}

const SectionHeading = ({ eyebrow, title, lead, action }: SectionHeadingProps) => {
  const { lang } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="animate-fade-rise-delay flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl rtl:text-right">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-3xl text-balance tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {lead && (
          <p className="font-body mt-4 text-base leading-relaxed text-muted-foreground">
            {lead}
          </p>
        )}
      </div>

      {action && (
        <Link
          to={action.to}
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full px-4 text-sm font-bold text-primary transition-colors hover:bg-accent sm:self-auto"
        >
          {action.label}
          <Arrow
            data-testid="arrow"
            className="size-4 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;
