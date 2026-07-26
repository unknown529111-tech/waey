import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Target } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { bumpStreak, todayKey } from "@/lib/dailyStorage";
import { recordActivity } from "@/lib/gamification";
import { getUserId, syncBig3 } from "@/lib/supabaseStorage";

const DailyBig3 = () => {
  const t = useT();
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
    const uid = getUserId();
    if (uid) syncBig3(uid);
  }, [tasks, today]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_big3_done") || "{}");
    stored[today] = done;
    localStorage.setItem("waey_big3_done", JSON.stringify(stored));
    const uid = getUserId();
    if (uid) syncBig3(uid);
  }, [done, today]);

  const toggleDone = (i: number) => {
    const next = [...done];
    next[i] = !next[i];
    setDone(next);
    if (next[i]) {
      bumpStreak();
      recordActivity("challenge");
    }
  };

  return (
    <div className="bg-card rounded-3xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Target className="size-5 text-primary" />
        <h3 className="font-bold text-sm">{t('big3.title')}</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{t('big3.subtitle')}</p>
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
              placeholder={t('big3.task').replace('{n}', String(i + 1))}
              className={`flex-1 bg-transparent border-b border-border py-1.5 text-sm outline-none focus:border-primary/40 transition-colors ${done[i] ? "line-through text-muted-foreground" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyBig3;
