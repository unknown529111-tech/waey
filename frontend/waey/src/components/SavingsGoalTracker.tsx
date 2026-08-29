import { useState, useEffect } from "react";
import { PiggyBank, Target, Plus, RotateCcw, PartyPopper, Clock } from "lucide-react";
import { useT, useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import {
  getSavingsGoal,
  setSavingsGoal,
  addDeposit,
  resetSavingsGoal,
  type SavingsGoal,
} from "@/lib/savingsGoal";

const SavingsGoalTracker = () => {
  const t = useT();
  const { lang } = useLanguage();
  const [goal, setGoal] = useState<SavingsGoal>(getSavingsGoal());
  const [targetInput, setTargetInput] = useState("");
  const [depositInput, setDepositInput] = useState("");

  useEffect(() => {
    trackEvent("page_view", { page: "finance-goal" });
  }, []);

  const pct = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
  const remaining = Math.max(0, goal.target - goal.saved);
  const complete = goal.target > 0 && goal.saved >= goal.target;

  const fmt = (n: number) => n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16">
      <div className="card p-6 md:p-10">
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank className="size-6 text-foreground" />
          <h2 className="section-title text-2xl md:text-3xl">{t('finance.goal.title')}</h2>
        </div>
        <p className="text-muted-foreground mb-8 max-w-[55ch] leading-relaxed -mt-1">
          {t('finance.goal.subtitle')}
        </p>

        {goal.target === 0 ? (
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-lg"
            onSubmit={(e) => {
              e.preventDefault();
              const val = Number(targetInput);
              if (val > 0) setGoal(setSavingsGoal(val));
            }}
          >
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder={t('finance.goal.setTarget')}
              className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button type="submit" className="btn btn-moss font-body px-6 py-3 text-sm flex items-center gap-2 justify-center hover:scale-[1.03] transition-transform">
              <Target className="size-4" />
              {t('finance.goal.save')}
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2 flex-wrap gap-2">
                <span className="text-primary tabular-nums">
                  {t('finance.goal.saved')}: {fmt(goal.saved)} {t('finance.goal.of')} {fmt(goal.target)} {t('calc.currencySymbol.egp')}
                </span>
                <span className="text-muted-foreground">
                  {complete ? (
                    <span className="flex items-center gap-1 text-foreground">
                      <PartyPopper className="size-4" />
                      {t('finance.goal.complete')}
                    </span>
                  ) : (
                    <span className="tabular-nums">{fmt(remaining)} {t('finance.goal.remaining')}</span>
                  )}
                </span>
              </div>
              <div className="h-4 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-center text-sm font-bold text-primary mt-2 tabular-nums">{pct}%</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <form
                className="flex flex-1 gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = Number(depositInput);
                  if (val > 0) {
                    setGoal(addDeposit(val));
                    setDepositInput("");
                  }
                }}
              >
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={depositInput}
                  onChange={(e) => setDepositInput(e.target.value)}
                  placeholder={t('finance.goal.deposit')}
                  className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button type="submit" className="btn btn-moss font-body px-6 py-3 text-sm flex items-center gap-2 justify-center hover:scale-[1.03] transition-transform">
                  <Plus className="size-4" />
                  {t('finance.goal.add')}
                </button>
              </form>
              <button
                onClick={() => {
                  if (confirm(t('finance.goal.reset') + "?")) setGoal(resetSavingsGoal());
                }}
                className="px-4 py-3 rounded-full text-xs font-bold bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center gap-1.5 justify-center transition-all duration-300"
              >
                <RotateCcw className="size-3.5" />
                {t('finance.goal.reset')}
              </button>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                {t('finance.goal.deposits')}
              </h3>
              {goal.deposits.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('finance.goal.noDeposits')}</p>
              ) : (
                <ul className="space-y-2">
                  {[...goal.deposits].reverse().map((d, i) => (
                    <li key={i} className="flex justify-between items-center bg-secondary/40 rounded-2xl px-4 py-2.5 text-sm">
                      <span className="text-foreground font-bold tabular-nums">+{fmt(d.amount)} {t('calc.currencySymbol.egp')}</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(d.date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SavingsGoalTracker;