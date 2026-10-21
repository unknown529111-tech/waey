import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguage";

type Field = "health" | "finance" | "environment" | "education";

interface ArticleCardProps {
  category: string;
  title: string;
  excerpt: string;
  meta: string;
  to: string;
  image?: string;
  field?: Field;
}

// Static class strings so Tailwind emits every field tone.
const TONE: Record<Field | "neutral", string> = {
  health: "border-field-health bg-field-health-tint text-field-health",
  finance: "border-field-finance bg-field-finance-tint text-field-finance",
  environment: "border-field-environment bg-field-environment-tint text-field-environment",
  education: "border-field-education bg-field-education-tint text-field-education",
  neutral: "border-border bg-muted text-muted-foreground",
};

const ArticleCard = ({
  category,
  title,
  excerpt,
  meta,
  to,
  image,
  field,
}: ArticleCardProps) => {
  const { t } = useLanguage();
  const tone = field ? TONE[field] : TONE.neutral;

  const pill = (
    <span
      data-testid="article-pill"
      className={`inline-flex items-center rounded-full border px-3 py-1 font-body text-xs font-bold ${tone}`}
    >
      {category}
    </span>
  );

  return (
    <Link
      to={to}
      aria-label={`${title} — ${t("prim.article.opens")}`}
      className="group flex min-h-11 flex-col overflow-hidden rounded-card border border-border bg-card text-start shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-moss-lg rtl:text-right"
    >
      {image ? (
        <div className="relative">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover"
          />
          <span className="absolute start-4 top-4">{pill}</span>
        </div>
      ) : (
        <div className="px-6 pt-6">{pill}</div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-xl text-balance text-foreground">{title}</h3>
        <p className="font-body line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>
        <p className="mt-auto flex items-center gap-2 border-t border-border pt-4 font-body text-xs text-muted-foreground">
          <CalendarDays className="size-4 shrink-0" aria-hidden />
          <span className="sr-only">{t("prim.article.dateLabel")}</span>
          {meta}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
