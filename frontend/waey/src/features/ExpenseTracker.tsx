import { useState } from "react";
import { Wallet, Plus, Trash2 } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import {
  getExpenses,
  addExpense,
  removeExpense,
  bumpStreak,
} from "@/lib/dailyStorage";
import { recordActivity } from "@/lib/gamification";

const CATEGORIES = [
  { value: "طعام", key: "expense.category.food" },
  { value: "مواصلات", key: "expense.category.transport" },
  { value: "ترفيه", key: "expense.category.entertainment" },
  { value: "فواتير", key: "expense.category.bills" },
  { value: "صحة", key: "expense.category.health" },
  { value: "أخرى", key: "expense.category.other" },
];

const getCategoryKey = (catValue: string): string =>
  CATEGORIES.find((c) => c.value === catValue)?.key ?? catValue;

const ExpenseTracker = () => {
  const t = useT();
  const [list, setList] = useState(getExpenses());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [note, setNote] = useState("");

  const total = list.reduce((s, e) => s + e.amount, 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0) return;
    addExpense({ amount: n, category, note: note.trim() || undefined });
    setList(getExpenses());
    setAmount("");
    setNote("");
    bumpStreak();
    recordActivity("expense");
  };

  const remove = (id: string) => {
    removeExpense(id);
    setList(getExpenses());
  };

  return (
    <div className="ledger p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Wallet className="size-5 text-secondary" />
          <h3 className="font-bold text-sm">{t("tracker.expense.title")}</h3>
        </div>
        <span className="text-sm font-extrabold text-secondary tabular-nums">{total.toFixed(2)} {t('tracker.expense.egp')}</span>
      </div>

      <form onSubmit={submit} className="grid grid-cols-12 gap-2 mb-3">
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t("tracker.expense.placeholder")}
          className="col-span-4 field rounded-xl px-3 py-2 text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="col-span-4 field rounded-xl px-2 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{t(c.key)}</option>
          ))}
        </select>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("tracker.expense.note")}
          maxLength={40}
          className="col-span-3 field rounded-xl px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="col-span-1 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/88 transition-colors"
          aria-label={t("tracker.expense.add")}
        >
          <Plus className="size-4" />
        </button>
      </form>

      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {list.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">
            {t("tracker.expense.empty")}
          </p>
        )}
        {list.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between bg-muted/40 rounded-xl px-3 py-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs bg-card px-2 py-0.5 rounded-full text-muted-foreground border border-border/70">
                {t(getCategoryKey(e.category))}
              </span>
              {e.note && <span className="text-xs text-muted-foreground">{e.note}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tabular-nums">{e.amount.toFixed(2)} {t('tracker.expense.egp')}</span>
              <button
                onClick={() => remove(e.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label={t("tracker.expense.delete")}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTracker;
