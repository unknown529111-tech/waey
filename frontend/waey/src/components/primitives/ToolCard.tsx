import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/useLanguage";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

const ToolCard = ({ icon: Icon, title, description, to }: ToolCardProps) => {
  const { lang } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <Link
      to={to}
      className="group flex min-h-11 items-start gap-4 rounded-2xl border border-border bg-card p-5 text-start shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-moss-lg rtl:text-right"
    >
      <span
        data-testid="tool-icon"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-field-current-tint text-field-current"
      >
        <Icon className="size-5" aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-body font-bold text-foreground">{title}</span>
        <span className="mt-1 block font-body text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>

      <Arrow
        data-testid="arrow"
        className="mt-2.5 size-5 shrink-0 text-muted-foreground transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
        aria-hidden
      />
    </Link>
  );
};

export default ToolCard;
