const KEY = "waey_savings_goal";

export type SavingsGoal = {
  target: number;
  saved: number;
  startedAt: string | null;
  deposits: { amount: number; date: string }[];
};

export const getSavingsGoal = (): SavingsGoal => {
  if (typeof window === "undefined") return { target: 0, saved: 0, startedAt: null, deposits: [] };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { target: 0, saved: 0, startedAt: null, deposits: [] };
  } catch {
    return { target: 0, saved: 0, startedAt: null, deposits: [] };
  }
};

function save(goal: SavingsGoal) {
  localStorage.setItem(KEY, JSON.stringify(goal));
}

export const setSavingsGoal = (target: number): SavingsGoal => {
  const goal = getSavingsGoal();
  const next: SavingsGoal = {
    ...goal,
    target: Math.max(0, Math.round(target)),
    startedAt: goal.startedAt ?? new Date().toISOString(),
  };
  save(next);
  return next;
};

export const addDeposit = (amount: number): SavingsGoal => {
  const goal = getSavingsGoal();
  const deposit = { amount: Math.max(0, Math.round(amount)), date: new Date().toISOString() };
  const next: SavingsGoal = {
    ...goal,
    saved: goal.saved + deposit.amount,
    startedAt: goal.startedAt ?? new Date().toISOString(),
    deposits: [...goal.deposits, deposit],
  };
  save(next);
  return next;
};

export const resetSavingsGoal = (): SavingsGoal => {
  const next: SavingsGoal = { target: 0, saved: 0, startedAt: null, deposits: [] };
  save(next);
  return next;
};