import { useState } from "react";
import { Droplet, Minus, Plus } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { getDailyValue, setDailyValue, bumpStreak } from "@/lib/dailyStorage";
import { recordActivity } from "@/lib/gamification";

const GOAL = 8;

const WaterTracker = () => {
  const t = useT();
  const [cups, setCups] = useState(getDailyValue("water"));

  const update = (n: number) => {
    const next = Math.max(0, Math.min(20, n));
    const prev = cups;
    setCups(next);
    setDailyValue("water", next);
    if (next > 0) bumpStreak();
    if (next > prev) recordActivity("water", next - prev);
  };

  const pct = Math.min(100, (cups / GOAL) * 100);

  return (
    <div className="ledger p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="marker-num">01</span>
          <h3 className="font-bold text-sm">{t("tracker.water.title")}</h3>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{cups}/{GOAL} {t("tracker.water.cups")}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-water transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => update(cups - 1)}
          className="stepper"
          aria-label={t("tracker.water.decrease")}
        >
          <Minus className="size-4" />
        </button>
        <div className="flex gap-1 flex-wrap justify-center">
          {Array.from({ length: GOAL }).map((_, i) => (
            <Droplet
              key={i}
              className={`size-5 ${i < cups ? "text-water fill-water" : "text-muted-foreground/25"}`}
            />
          ))}
        </div>
        <button
          onClick={() => update(cups + 1)}
          className="stepper stepper-water"
          aria-label={t("tracker.water.add")}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
