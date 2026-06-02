import { useState } from "react";
import { Moon, Sunrise, Clock } from "lucide-react";

const CYCLE = 90;
const FALL_ASLEEP = 14;

const SleepCycleCalculator = () => {
  const [mode, setMode] = useState<"bed" | "wake">("bed");
  const [time, setTime] = useState("23:00");
  const [results, setResults] = useState<string[]>([]);

  const calculate = () => {
    const [h, m] = time.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);
    const times: string[] = [];
    const start = mode === "bed" ? 5 : 4;
    const end = mode === "bed" ? 7 : 6;
    for (let cycles = start; cycles <= end; cycles++) {
      const total = cycles * CYCLE + FALL_ASLEEP;
      const d = mode === "bed"
        ? new Date(base.getTime() + total * 60000)
        : new Date(base.getTime() - total * 60000);
      times.push(d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: false }));
    }
    setResults(times);
  };

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 border border-border">
      <div className="flex items-center gap-3 mb-5">
        <Moon className="size-6 text-primary" />
        <div>
          <h3 className="font-bold text-lg">حاسبة دورات النوم</h3>
          <p className="text-xs text-muted-foreground">استيقظ بريقان — احسب أفضل وقت للنوم أو الاستيقاظ</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setMode("bed")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "bed" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
          <Moon className="size-4 inline ml-1" />وقت النوم
        </button>
        <button onClick={() => setMode("wake")} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "wake" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
          <Sunrise className="size-4 inline ml-1" />وقت الاستيقاظ
        </button>
      </div>

      <label className="text-sm font-bold mb-2 block">
        {mode === "bed" ? "هتنام الساعة كام؟" : "عايز تصحى الساعة كام؟"}
      </label>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full bg-muted/50 border border-border rounded-2xl p-3 text-lg font-bold text-center outline-none focus:border-primary/40 transition-colors mb-4"
      />
      <button onClick={calculate} className="w-full bg-primary text-primary-foreground rounded-full py-3 font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        <Clock className="size-4" /> احسب
      </button>

      {results.length > 0 && (
        <div className="mt-5 p-4 bg-primary/5 rounded-2xl border border-primary/15">
          <p className="text-sm font-bold mb-3 text-primary">
            {mode === "bed" ? "أفضل أوقات للاستيقاظ:" : "أفضل أوقات للنوم:"}
          </p>
          <div className="space-y-2">
            {results.map((t, i) => (
              <div key={i} className="flex items-center justify-between bg-card rounded-xl px-4 py-2.5 border border-border">
                <span className="text-sm">دورة {i + 5}</span>
                <span className="text-lg font-bold tabular-nums text-primary">{t}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">كل دورة نوم = 90 دقيقة. استيقظ في نهاية دورة لتكون بريقان.</p>
        </div>
      )}
    </div>
  );
};

export default SleepCycleCalculator;
