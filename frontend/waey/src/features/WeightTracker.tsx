import { useState } from "react";
import { Scale, Minus, Plus } from "lucide-react";
import { getDailyValue, setDailyValue, bumpStreak } from "@/lib/dailyStorage";
import { recordActivity } from "@/lib/gamification";

const STORAGE_KEY = "weight";

const WeightTracker = () => {
  const [val, setVal] = useState(getDailyValue(STORAGE_KEY) || 0);

  const update = (n: number) => {
    const next = Math.max(0, Math.min(300, +n.toFixed(1)));
    const prev = val;
    setVal(next);
    setDailyValue(STORAGE_KEY, next);
    if (next > 0) bumpStreak();
    if (next !== prev) recordActivity("challenge");
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scale className="size-5 text-primary" />
          <h3 className="font-bold">الوزن</h3>
        </div>
        <span className="text-xs text-muted-foreground">{val > 0 ? `${val} كجم` : "--"}</span>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => update(val - 0.5)}
          className="size-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
          aria-label="نقص"
        >
          <Minus className="size-4" />
        </button>
        <div className="text-2xl font-bold">{val > 0 ? val : "--"}</div>
        <button
          onClick={() => update(val + 0.5)}
          className="size-10 rounded-full text-white flex items-center justify-center bg-primary hover:bg-primary/90"
          aria-label="أضف"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-2">سجّل وزنك كل يوم لمتابعة التغير</p>
    </div>
  );
};

export default WeightTracker;
