import { useState, useEffect } from "react";
import { Target, Check, RotateCcw, Play } from "lucide-react";
import PageHero from "@/components/PageHero";
import { PLANS, getPlanState, startPlan, togglePlanDay, resetPlan } from "@/lib/plansData";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useT } from "@/contexts/LanguageContext";

const Plans = () => {
  const t = useT();
  const [selected, setSelected] = useState<string>(PLANS[0].id);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    refresh();
  }, [selected]);

  const plan = PLANS.find((p) => p.id === selected)!;
  const state = getPlanState(plan.id);
  const completed = state?.completed ?? [];
  const progress = (completed.length / 30) * 100;

  const handleStart = () => {
    startPlan(plan.id);
    toast.success(t('plans.started').replace('{title}', plan.title) + ' 🎉');
    refresh();
  };

  const handleToggle = (idx: number) => {
    const s = togglePlanDay(plan.id, idx);
    if (s.completed.length === 30) {
      toast.success(t('plans.completed'));
    }
    refresh();
  };

  const handleReset = () => {
    resetPlan(plan.id);
    toast(t('plans.resetMessage'));
    refresh();
  };

  return (
    <div className="relative min-h-[60vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge={t('plans.badge')}
          icon={<Target className="size-4" />}
          title={t('plans.title')}
          subtitle={t('plans.subtitle')}
        />

        <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {PLANS.map((p) => {
              const ps = getPlanState(p.id);
              const pct = ps ? (ps.completed.length / 30) * 100 : 0;
              const isActive = selected === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`text-right rounded-[2rem] p-6 border-2 transition-all duration-300 hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-soft-lg"
                      : "bg-card border-[#DED8CF]/50 dark:border-border/50 hover:border-primary/50 shadow-soft"
                  }`}
                >
                  <div className="text-4xl mb-2">{p.emoji}</div>
                  <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                  <p className={`text-xs leading-relaxed ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {p.description}
                  </p>
                  {ps && (
                    <div className="mt-3 text-xs font-bold tabular-nums">
                      {ps.completed.length}/30 {t('common.day')}
                    </div>
                  )}
                  <div className="mt-2 h-1.5 rounded-full bg-background/40 overflow-hidden">
                    <div
                      className={`h-full ${isActive ? "bg-primary-foreground" : "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 md:p-10 shadow-soft">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {plan.emoji} {plan.title}
                </h2>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="flex gap-2">
                {!state ? (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <Play className="size-4" />
                    {t('plans.start')}
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-bold text-sm hover:bg-muted hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <RotateCcw className="size-4" />
                    {t('plans.reset')}
                  </button>
                )}
              </div>
            </div>

            {state && (
              <>
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span>{completed.length} / 30 {t('common.day')}</span>
                  <span className="text-primary tabular-nums">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="mb-8" />
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.days.map((task, idx) => {
                const done = completed.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => state && handleToggle(idx)}
                    disabled={!state}
                    className={`flex items-start gap-3 text-right p-4 rounded-[2rem] border-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                      done
                        ? "bg-primary/10 border-primary"
                        : "bg-background border-[#DED8CF]/50 dark:border-border/50 hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`shrink-0 size-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        done ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                      }`}
                    >
                      {done ? <Check className="size-4" /> : idx + 1}
                    </div>
                    <span className={`text-sm leading-relaxed ${done ? "line-through text-muted-foreground" : ""}`}>
                      {task}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Plans;
