import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Minus, Plus } from "lucide-react";
import { getDailyValue, setDailyValue, bumpStreak } from "@/lib/dailyStorage";

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
  const [val, setVal] = useState(getDailyValue(storageKey));

  const update = (n: number) => {
    const next = Math.max(0, Math.min(max, +n.toFixed(1)));
    setVal(next);
    setDailyValue(storageKey, next);
    if (next > 0) bumpStreak();
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`size-5 ${color}`} />
          <h3 className="font-bold">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {val} {goal ? `/ ${goal}` : ""} {unit}
        </span>
      </div>
      {goal && (
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-500 bg-current ${color}`}
            style={{ width: `${Math.min(100, (val / goal) * 100)}%` }}
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          onClick={() => update(val - step)}
          className="size-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center"
          aria-label="نقص"
        >
          <Minus className="size-4" />
        </button>
        <div className="text-2xl font-bold">{val}</div>
        <button
          onClick={() => update(val + step)}
          className={`size-10 rounded-full text-white flex items-center justify-center bg-primary hover:bg-primary/90`}
          aria-label="أضف"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default SimpleTracker;
