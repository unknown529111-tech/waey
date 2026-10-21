import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowRight, GraduationCap, HeartPulse, Leaf, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";

export type Field = "health" | "finance" | "environment" | "education";

interface FieldCardProps {
  field: Field;
  title: string;
  description: string;
  to: string;
  icon?: LucideIcon;
}

// Static class strings so Tailwind emits every field tone.
const TONE: Record<Field, { plate: string; defaultIcon: LucideIcon }> = {
  health: { plate: "bg-field-health-tint text-field-health", defaultIcon: HeartPulse },
  finance: { plate: "bg-field-finance-tint text-field-finance", defaultIcon: Wallet },
  environment: { plate: "bg-field-environment-tint text-field-environment", defaultIcon: Leaf },
  education: { plate: "bg-field-education-tint text-field-education", defaultIcon: GraduationCap },
};

const FieldCard = ({ field, title, description, to, icon }: FieldCardProps) => {
  const { lang } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const { plate, defaultIcon: DefaultIcon } = TONE[field];
  const Icon = icon ?? DefaultIcon;

  return (
    <Link
      to={to}
      className="group flex min-h-11 flex-col gap-6 rounded-card border border-border bg-card p-6 text-start shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-moss-lg rtl:text-right"
    >
      <span className="flex items-start justify-between gap-4">
        <span
          data-testid="field-icon"
          className={`inline-flex size-12 shrink-0 items-center justify-center rounded-2xl ${plate}`}
        >
          <Icon className="size-6" aria-hidden />
        </span>
        <Arrow
          data-testid="arrow"
          className="mt-3 size-5 shrink-0 text-muted-foreground transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
          aria-hidden
        />
      </span>

      <div>
        <h3 className="font-display text-xl text-foreground">{title}</h3>
        <p className="font-body mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default FieldCard;
