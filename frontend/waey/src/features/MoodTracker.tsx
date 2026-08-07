import { useState } from "react";
import { Smile } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { getMood, setMood, bumpStreak } from "@/lib/dailyStorage";
import { recordActivity } from "@/lib/gamification";

const MOODS = [
  { v: 1, e: "😞", key: "tracker.mood.bad" },
  { v: 2, e: "😕", key: "tracker.mood.tired" },
  { v: 3, e: "😐", key: "tracker.mood.okay" },
  { v: 4, e: "🙂", key: "tracker.mood.good" },
  { v: 5, e: "😄", key: "tracker.mood.excellent" },
];

const MoodTracker = () => {
  const t = useT();
  const [val, setVal] = useState(getMood());
  const choose = (v: number) => {
    setVal(v);
    setMood(v);
    bumpStreak();
    recordActivity("challenge");
  };

  return (
    <div className="ledger p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <Smile className="size-5 text-secondary" />
        <h3 className="font-bold text-sm">{t("tracker.mood.title")}</h3>
      </div>
      <div className="flex justify-between gap-1.5">
        {MOODS.map((m) => (
          <button
            key={m.v}
            onClick={() => choose(m.v)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl border transition-all ${
              val === m.v
                ? "border-secondary bg-secondary/10 ring-1 ring-secondary/40"
                : "border-transparent hover:bg-muted/60"
            }`}
            aria-label={t(m.key)}
          >
            <span className="text-2xl">{m.e}</span>
            <span className="text-[10px] text-muted-foreground">{t(m.key)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
