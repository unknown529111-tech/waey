const FREEZE_KEY = "waey_streak_freeze";

export const getFreezeCount = () => {
  const month = new Date().toISOString().slice(0, 7);
  try {
    const raw = JSON.parse(localStorage.getItem(FREEZE_KEY) || "{}");
    return raw[month] ?? 3;
  } catch { return 3; }
};

export const useFreeze = () => {
  const month = new Date().toISOString().slice(0, 7);
  const used = 3 - getFreezeCount();
  const freeze = () => {
    const raw = JSON.parse(localStorage.getItem(FREEZE_KEY) || "{}");
    raw[month] = (raw[month] ?? 3) - 1;
    localStorage.setItem(FREEZE_KEY, JSON.stringify(raw));
  };
  return { freezes: getFreezeCount(), used, freeze };
};
