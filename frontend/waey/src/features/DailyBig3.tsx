import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Target } from "lucide-react";

const DailyBig3 = () => {
  const today = new Date().toDateString();
  const [tasks, setTasks] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("waey_big3") || "{}")[today] || ["", "", ""]; } catch { return ["", "", ""]; }
  });
  const [done, setDone] = useState<boolean[]>(() => {
    try { return JSON.parse(localStorage.getItem("waey_big3_done") || "{}")[today] || [false, false, false]; } catch { return [false, false, false]; }
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_big3") || "{}");
    stored[today] = tasks;
    localStorage.setItem("waey_big3", JSON.stringify(stored));
  }, [tasks, today]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_big3_done") || "{}");
    stored[today] = done;
    localStorage.setItem("waey_big3_done", JSON.stringify(stored));
  }, [done, today]);

  const toggleDone = (i: number) => {
    const next = [...done];
    next[i] = !next[i];
    setDone(next);
  };

  return (
    <div className="bg-card rounded-3xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Target className="size-5 text-primary" />
        <h3 className="font-bold text-sm">أهم 3 مهام النهارده</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">حدد 3 مهام بس — لو خلصتهم يعتبر يومك ناجح</p>
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-2">
            <button onClick={() => toggleDone(i)} className="shrink-0">
              {done[i] ? <CheckCircle2 className="size-5 text-green-500" /> : <Circle className="size-5 text-muted-foreground" />}
            </button>
            <input
              value={task}
              onChange={(e) => {
                const next = [...tasks];
                next[i] = e.target.value;
                setTasks(next);
              }}
              placeholder={`مهمة ${i + 1}`}
              className={`flex-1 bg-transparent border-b border-border py-1.5 text-sm outline-none focus:border-primary/40 transition-colors ${done[i] ? "line-through text-muted-foreground" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyBig3;
