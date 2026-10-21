import { useLanguage } from "@/contexts/useLanguage";
import type { Field } from "./FieldCard";

interface ProgressRingProps {
  value: number;
  label: string;
  field?: Field;
  size?: number;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Static class strings so Tailwind emits every field tone.
const TONE: Record<Field, { arc: string; value: string }> = {
  health: { arc: "stroke-field-health", value: "text-field-health" },
  finance: { arc: "stroke-field-finance", value: "text-field-finance" },
  environment: { arc: "stroke-field-environment", value: "text-field-environment" },
  education: { arc: "stroke-field-education", value: "text-field-education" },
};

const ProgressRing = ({ value, label, field, size = 120 }: ProgressRingProps) => {
  const { t } = useLanguage();
  const pct = Math.min(100, Math.max(0, value));
  const sign = t('prim.percent');
  const tone = field ? TONE[field] : { arc: "stroke-field-current", value: "text-foreground" };

  return (
    <figure className="flex min-w-0 flex-col items-center gap-3 text-center">
      <div className="relative mx-auto" style={{ width: size, maxWidth: "100%" }}>
        <svg
          role="img"
          aria-label={`${label} ${pct}${sign}`}
          viewBox="0 0 120 120"
          width={size}
          height={size}
          className="block h-auto w-full"
        >
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          <circle
            data-testid="ring-arc"
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - pct / 100)}
            className={tone.arc}
          />
        </svg>
        <span
          aria-hidden
          className={`absolute inset-0 flex items-center justify-center font-display font-semibold tabular-nums ${tone.value}`}
          style={{ fontSize: size * 0.22 }}
        >
          {pct}
          {sign}
        </span>
      </div>
      <figcaption className="font-body max-w-full text-sm leading-snug text-muted-foreground">
        {label}
      </figcaption>
    </figure>
  );
};

export default ProgressRing;
