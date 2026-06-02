import { useState } from "react";
import { Wallet, Plus, Trash2 } from "lucide-react";
import {
  getExpenses,
  addExpense,
  removeExpense,
  bumpStreak,
} from "@/lib/dailyStorage";

const CATEGORIES = ["طعام", "مواصلات", "ترفيه", "فواتير", "صحة", "أخرى"];

const ExpenseTracker = () => {
  const [list, setList] = useState(getExpenses());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
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
  };

  const remove = (id: string) => {
    removeExpense(id);
    setList(getExpenses());
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="size-5 text-accent" />
          <h3 className="font-bold">مصروف اليوم</h3>
        </div>
        <span className="text-sm font-bold text-accent">{total.toFixed(2)} ج</span>
      </div>

      <form onSubmit={submit} className="grid grid-cols-12 gap-2 mb-3">
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="المبلغ"
          className="col-span-4 bg-secondary/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="col-span-4 bg-secondary/60 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="ملاحظة"
          maxLength={40}
          className="col-span-3 bg-secondary/60 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          className="col-span-1 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90"
          aria-label="أضف"
        >
          <Plus className="size-4" />
        </button>
      </form>

      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {list.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">
            لم تسجل مصاريف اليوم بعد.
          </p>
        )}
        {list.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between bg-secondary/40 rounded-xl px-3 py-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs bg-card px-2 py-0.5 rounded-full text-muted-foreground">
                {e.category}
              </span>
              {e.note && <span className="text-xs text-muted-foreground">{e.note}</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{e.amount.toFixed(2)} ج</span>
              <button
                onClick={() => remove(e.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="حذف"
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
