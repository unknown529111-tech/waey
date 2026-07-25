import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, CheckCircle2, Trash2, TrendingUp, X } from "lucide-react";
import { bumpStreak } from "@/lib/dailyStorage";
import { recordActivity } from "@/lib/gamification";

interface Goal {
  id: string;
  title: string;
  category: string;
  target: number;
  current: number;
  unit: string;
  createdAt: string;
}

const STORAGE_KEY = "waey_goals";

const loadGoals = (): Goal[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGoals = (goals: Goal[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch { /* ignore */ }
};

const CATEGORIES = ["صحة", "مال", "بيئة", "تعليم", "نفسي"];

export function GoalSetting() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("صحة");
  const [target, setTarget] = useState(10);
  const [unit, setUnit] = useState("يوم");

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  const addGoal = () => {
    if (!title.trim()) return;
    const newGoal: Goal = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      title: title.trim(),
      category,
      target,
      current: 0,
      unit,
      createdAt: new Date().toISOString(),
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    saveGoals(updated);
    setTitle("");
    setTarget(10);
    setUnit("يوم");
    setShowForm(false);
  };

  const incrementGoal = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal || goal.current >= goal.target) return;
    const updated = goals.map((g) =>
      g.id === id ? { ...g, current: Math.min(g.current + 1, g.target) } : g
    );
    setGoals(updated);
    saveGoals(updated);
    bumpStreak();
    recordActivity("challenge");
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  const resetGoal = (id: string) => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, current: 0 } : g
    );
    setGoals(updated);
    saveGoals(updated);
  };

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm" dir="rtl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">أهدافي الشخصية</h2>
            <p className="text-xs text-muted-foreground">حدّد أهدافك وتابع تقدّمك</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          aria-label="إضافة هدف جديد"
          className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 hover:scale-105 transition-all"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="اسم الهدف (مثلاً: أشرب 8 أكواب مياه)"
                className="w-full bg-card border border-border rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              />
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))}
                  className="w-20 bg-card border border-border rounded-full px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors text-center"
                />
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="وحدة"
                  className="w-24 bg-card border border-border rounded-full px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors text-center"
                />
              </div>
              <button
                onClick={addGoal}
                className="w-full h-10 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all"
              >
                إضافة الهدف
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {goals.length === 0 && !showForm && (
        <div className="text-center py-8">
          <Target className="size-10 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">ما عندك أهداف بعد. اضغط + عشان تضيف أول هدف.</p>
        </div>
      )}

      <div className="space-y-3">
        {goals.map((goal) => {
          const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
          const done = goal.current >= goal.target;

          return (
            <motion.div
              key={goal.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                done
                  ? "bg-primary/5 border-primary/30"
                  : "bg-muted/40 border-border/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold truncate ${done ? "text-primary line-through" : ""}`}>
                      {goal.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                      {goal.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!done && (
                    <button
                      onClick={() => incrementGoal(goal.id)}
                      className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 hover:scale-105 transition-all"
                    >
                      <TrendingUp className="size-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => resetGoal(goal.id)}
                    className="size-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80 transition-all"
                    title="إعادة تعيين"
                  >
                    <X className="size-3" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="size-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-all"
                    title="حذف"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${done ? "bg-primary" : "bg-gradient-to-l from-primary to-secondary"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              {done && (
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-primary font-bold">
                  <CheckCircle2 className="size-3.5" />
                  تم تحقيق الهدف! 🎉
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}