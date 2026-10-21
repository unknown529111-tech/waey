import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";

type Field = "health" | "finance" | "environment" | "education";

interface NextFieldProps {
  /** The field this link goes to. */
  to: Field;
  /** The route of the field it goes to. */
  toRoute: string;
  /** The reader-facing name of the field it goes to. */
  label: string;
}

// The next field wears its own accent, so the link previews the colour the
// reader is about to land on — colour stays a navigational cue.
const ACCENT: Record<Field, { text: string; plate: string }> = {
  health: { text: "text-field-health", plate: "bg-field-health-tint" },
  finance: { text: "text-field-finance", plate: "bg-field-finance-tint" },
  environment: { text: "text-field-environment", plate: "bg-field-environment-tint" },
  education: { text: "text-field-education", plate: "bg-field-education-tint" },
};

const NextField = ({ to, toRoute, label }: NextFieldProps) => {
  const { lang, t } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const accent = ACCENT[to];

  return (
    <Link
      to={toRoute}
      className={`group inline-flex min-h-11 items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${accent.text}`}
    >
      <span
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full ${accent.plate}`}
      >
        <Arrow
          className="size-4 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
          aria-hidden
        />
      </span>
      <span className="text-start rtl:text-right">
        <span className="block font-body text-xs font-medium text-muted-foreground">
          {t("field.next.label")}
        </span>
        <span className="block font-body text-sm font-bold">{label}</span>
      </span>
    </Link>
  );
};

export default NextField;
