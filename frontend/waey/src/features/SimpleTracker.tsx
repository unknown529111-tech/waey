import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Minus, Plus } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { getDailyValue, setDailyValue, bumpStreak } from "@/lib/dailyStorage";
import { recordActivity } from "@/lib/gamification";

interface Props {
  storageKey: string;
  title: string;
  unit: string;
  icon: LucideIcon;
  color: string; // tailwind text color class
  step?: number;
  goal?: number;
  max?: number;
}

const SimpleTracker = ({
  storageKey,
  title,
  unit,
  icon: Icon,
  color,
  step = 1,
  goal,
  max = 24,
}: Props) => {
  const t = useT();
  const [val, setVal] = useState(getDailyValue(storageKey));

  const getActivityType = (key: string): "water" | "challenge" => {
    if (key === "water") return "water";
    return "challenge";
  };

  const update = (n: number) => {
    const next = Math.max(0, Math.min(max, +n.toFixed(1)));
    setVal(next);
    setDailyValue(storageKey, next);
    if (next > 0) {
      bumpStreak();
      recordActivity(getActivityType(storageKey), 1);
    }
  };

  return (
    <div className="ledger p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Icon className={`size-5 ${color}`} />
          <h3 className="font-bold text-sm">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {val} {goal ? `/ ${goal}` : ""} {unit}
        </span>
      </div>
      {goal && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-500 bg-current ${color}`}
            style={{ width: `${Math.min(100, (val / goal) * 100)}%` }}
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          onClick={() => update(val - step)}
          className="stepper"
          aria-label={t("tracker.simple.decrease")}
        >
          <Minus className="size-4" />
        </button>
        <div className="text-2xl font-extrabold tabular-nums">{val}</div>
        <button
          onClick={() => update(val + step)}
          className={`stepper stepper-solid`}
          aria-label={t("tracker.simple.add")}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default SimpleTracker;
