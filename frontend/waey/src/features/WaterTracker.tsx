import { useState } from "react";
import { Droplet, Minus, Plus } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { getDailyValue, setDailyValue, bumpStreak } from "@/lib/dailyStorage";

const GOAL = 8;

const WaterTracker = () => {
  const t = useT();
  const [cups, setCups] = useState(getDailyValue("water"));

  const update = (n: number) => {
    const next = Math.max(0, Math.min(20, n));
    setCups(next);
    setDailyValue("water", next);
    if (next > 0) bumpStreak();
  };

  const pct = Math.min(100, (cups / GOAL) * 100);

  return (
    <div className="bg-card border border-border rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplet className="size-5 text-[#3B82F6]" />
          <h3 className="font-bold">{t("tracker.water.title")}</h3>
        </div>
        <span className="text-xs text-muted-foreground">{cups}/{GOAL} {t("tracker.water.cups")}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-[#3B82F6] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => update(cups - 1)}
          className="size-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center"
          aria-label={t("tracker.water.decrease")}
        >
          <Minus className="size-4" />
        </button>
        <div className="flex gap-1">
          {Array.from({ length: GOAL }).map((_, i) => (
            <Droplet
              key={i}
              className={`size-5 ${i < cups ? "text-[#3B82F6] fill-[#3B82F6]" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
        <button
          onClick={() => update(cups + 1)}
          className="size-10 rounded-full bg-[#3B82F6] text-white hover:bg-[#3B82F6]/80 flex items-center justify-center"
          aria-label={t("tracker.water.add")}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
