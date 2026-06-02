import { useState } from "react";
import { Smile } from "lucide-react";
import { getMood, setMood, bumpStreak } from "@/lib/dailyStorage";

const MOODS = [
  { v: 1, e: "😞", label: "سيئ" },
  { v: 2, e: "😕", label: "تعبان" },
  { v: 3, e: "😐", label: "عادي" },
  { v: 4, e: "🙂", label: "كويس" },
  { v: 5, e: "😄", label: "ممتاز" },
];

const MoodTracker = () => {
  const [val, setVal] = useState(getMood());
  const choose = (v: number) => {
    setVal(v);
    setMood(v);
    bumpStreak();
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Smile className="size-5 text-accent" />
        <h3 className="font-bold">مزاج اليوم</h3>
      </div>
      <div className="flex justify-between gap-1">
        {MOODS.map((m) => (
          <button
            key={m.v}
            onClick={() => choose(m.v)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${
              val === m.v
                ? "bg-primary/15 ring-2 ring-primary"
                : "hover:bg-secondary"
            }`}
            aria-label={m.label}
          >
            <span className="text-2xl">{m.e}</span>
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
