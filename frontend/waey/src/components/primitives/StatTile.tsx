import { TrendingDown, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguage";
import type { Field } from "./FieldCard";

interface StatTileProps {
  label: string;
  value: string;
  delta?: { value: string; direction: "up" | "down" };
  field?: Field;
}

// Static class strings so Tailwind emits every field tone.
const TONE: Record<Field, string> = {
  health: "text-field-health",
  finance: "text-field-finance",
  environment: "text-field-environment",
  education: "text-field-education",
};

const StatTile = ({ label, value, delta, field }: StatTileProps) => {
  const { t } = useLanguage();
  const isUp = delta?.direction === "up";
  const Trend = isUp ? TrendingUp : TrendingDown;

  return (
    <div className="flex min-w-0 flex-col gap-1 text-start">
      <div className="flex flex-wrap items-center gap-2">
        <p
          className={`font-display text-3xl leading-none tabular-nums ${
            field ? TONE[field] : "text-foreground"
          }`}
        >
          {value}
        </p>
        {delta && (
          <span
            data-testid="delta-chip"
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
              isUp ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
            }`}
          >
            <Trend data-testid="delta-icon" className="size-3.5 shrink-0" aria-hidden />
            <span className="tabular-nums">{delta.value}</span>
            <span className="sr-only">
              {t(isUp ? 'prim.delta.up' : 'prim.delta.down')}
            </span>
          </span>
        )}
      </div>
      <p className="font-body text-sm leading-snug text-muted-foreground">{label}</p>
    </div>
  );
};

export default StatTile;
