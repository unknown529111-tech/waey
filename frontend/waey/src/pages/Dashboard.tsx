import { useEffect, useMemo, useState } from "react";
import { useLanguage, useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import {
  BADGES,
  getUserPoints,
  deductPoints,
  addPoints,
  getUnlockedBadgeIds,
  recordActivity,
  evaluateBadges,
} from "@/lib/gamification";
import {
  getStreakFreezes,
  addStreakFreeze,
  bumpStreak,
  todayKey,
  lastNDays,
  getDailyValue,
  setDailyValue,
  getMood,
  setMood,
  getExpenses,
  addExpense,
  removeExpense,
  getDailyChallenge,
  isChallengeDone,
  markChallengeDone,
  getDailyQuote,
  readJSON,
  writeJSON,
  type ExpenseEntry,
} from "@/lib/dailyStorage";
import { getStreakState } from "@/lib/streak";
import { StreakRecoveryModal } from "@/components/StreakRecoveryModal";
import NightReview from "@/features/NightReview";
import GratitudeJournal from "@/features/GratitudeJournal";
import { toast } from "sonner";
import { Sparkles, Lock, Plus, Trash2 } from "lucide-react";
import "./Dashboard.css";

/* ── Badge name/description keys keyed by gamification badge ids ── */

const BADGE_DESC_KEY: Record<string, string> = {
  first_step: "badge.progress.firstStep",
  streak_7: "badge.progress.streak7",
  streak_30: "badge.progress.streak30",
  streak_100: "badge.progress.streak100",
  water_8: "badge.progress.water8",
  water_100: "badge.progress.water100",
  breathing_peace: "badge.progress.breathing",
  gratitude_heart: "badge.progress.gratitude",
  finance_wise: "badge.progress.finance",
  challenge_hero: "badge.progress.challenge",
};

const BADGE_NAME_KEY: Record<string, string> = {
  first_step: "badge.name.firstStep",
  streak_7: "badge.name.weeklyCommitment",
  streak_30: "badge.name.monthlyAchievement",
  streak_100: "badge.name.waeyChampion",
  water_8: "badge.name.fullHydration",
  water_100: "badge.name.hydrationMaster",
  breathing_peace: "badge.name.momentOfPeace",
  gratitude_heart: "badge.name.gratefulHeart",
  finance_wise: "badge.name.financialAwareness",
  challenge_hero: "badge.name.challengeHero",
};

type EarnItem = { mk?: string; key: string };
const EARN: { cat: string; items: EarnItem[] }[] = [
  {
    cat: "badge.category.streak",
    items: [
      { mk: "✓", key: "dash.earn.firstStep" },
      { mk: "✓", key: "dash.earn.streak7" },
      { mk: "•", key: "dash.earn.streak30" },
      { mk: "•", key: "dash.earn.streak100" },
    ],
  },
  {
    cat: "badge.category.water",
    items: [
      { mk: "✓", key: "dash.earn.water8" },
      { mk: "•", key: "dash.earn.water100" },
    ],
  },
  {
    cat: "badge.category.mindfulness",
    items: [
      { mk: "•", key: "dash.earn.breathing" },
      { mk: "•", key: "dash.earn.gratitude" },
    ],
  },
  {
    cat: "badge.category.finance",
    items: [{ mk: "•", key: "dash.earn.finance" }],
  },
  {
    cat: "badge.category.challenge",
    items: [{ mk: "✓", key: "dash.earn.challenge" }],
  },
  {
    cat: "badge.shop",
    items: [
      { key: "badge.shopTip1" },
      { key: "badge.shopTip2" },
      { key: "badge.shopTip3" },
    ],
  },
];

const MOODS = ["bad", "tired", "okay", "good", "excellent"] as const;

const EXPENSE_CATS = [
  "food",
  "transport",
  "bills",
  "health",
  "entertainment",
  "other",
] as const;

const FREEZE_COST = 50;
const WATER_MAX = 8;
const SLEEP_MAX = 12;
const ACTIVITY_MAX = 120;
const ECO_MAX = 10;
const BIG3_KEY = "waey_big3";
const BIG3_DONE_KEY = "waey_big3_done";
const GOALS_KEY = "waey_goals";

type TrackerKey = "water" | "sleep" | "activity" | "eco" | "energy";

type Goal = { id: string; title: string; category: string; target: number; current: number };

const readGoals = (): Goal[] => readJSON<Goal[]>(GOALS_KEY, []);
const writeGoals = (goals: Goal[]) => writeJSON(GOALS_KEY, goals);

const readBig3 = (): string[] =>
  readJSON<Record<string, string[]>>(BIG3_KEY, {})[todayKey()] ?? ["", "", ""];
const readBig3Done = (): boolean[] =>
  readJSON<Record<string, boolean[]>>(BIG3_DONE_KEY, {})[todayKey()] ?? [false, false, false];

function Bars({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(1, ...data);
  return (
    <div className="bars">
      {data.map((v, i) => {
        const h = Math.max(3, Math.round((v / max) * 100));
        return (
          <div className="col" key={`${labels[i]}-${i}`}>
            <span className="num">{Number.isInteger(v) ? v : v.toFixed(1)}</span>
            <div className="bar" style={{ height: `${h}%` }} />
            <span className="day">{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

const Dashboard = () => {
  const { lang, t } = useLanguage();

  useEffect(() => {
    trackEvent("page_view", { page: "dashboard" });
  }, []);

  const [view, setView] = useState<"daily" | "weekly">("daily");

  // Gamification
  const [points, setPoints] = useState(getUserPoints);
  const [freezes, setFreezes] = useState(getStreakFreezes);
  const [unlockedIds, setUnlockedIds] = useState<string[]>(getUnlockedBadgeIds);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Check-in — reflects the real streak (already active today?)
  const [checked, setChecked] = useState(() => getStreakState().lastDay === todayKey());

  // Trackers — all persisted per-day via dailyStorage
  const [water, setWater] = useState(() => getDailyValue("water"));
  const [sleep, setSleep] = useState(() => getDailyValue("sleep"));
  const [activity, setActivity] = useState(() => getDailyValue("activity"));
  const [eco, setEco] = useState(() => getDailyValue("eco"));
  const [energy, setEnergy] = useState(() => getDailyValue("energy"));
  const [weight, setWeight] = useState(() => getDailyValue("weight"));
  const [mood, setMoodState] = useState(() => getMood());

  // Expenses
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => getExpenses());
  const [expAmount, setExpAmount] = useState("");
  const [expCat, setExpCat] = useState<string>(EXPENSE_CATS[0]);
  const [expNote, setExpNote] = useState("");

  // Big 3 tasks + daily challenge
  const [big3, setBig3] = useState<string[]>(readBig3);
  const [big3Done, setBig3Done] = useState<boolean[]>(readBig3Done);
  const [challengeDone, setChallengeDone] = useState(() => isChallengeDone());
  const challenge = useMemo(() => getDailyChallenge(), []);
  const quote = useMemo(() => getDailyQuote(lang), [lang]);

  // Personal goals
  const [goals, setGoals] = useState<Goal[]>(readGoals);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCat, setGoalCat] = useState("health");

  /** Re-read points/freezes/badges after any action; toast new badges. */
  const refreshProgress = (announce = false) => {
    setPoints(getUserPoints());
    setFreezes(getStreakFreezes());
    const newly = evaluateBadges();
    setUnlockedIds(getUnlockedBadgeIds());
    if (announce) {
      newly.forEach((id) =>
        toast.success(t("dash.badgeUnlockedToast", { name: t(BADGE_NAME_KEY[id] ?? id) })),
      );
    }
    return newly;
  };

  const updateTracker = (
    key: TrackerKey,
    next: number,
    setter: (v: number) => void,
    activityType?: "water",
  ) => {
    const clamped = Math.max(0, next);
    setter(clamped);
    setDailyValue(key, clamped);
    if (activityType) recordActivity(activityType);
    refreshProgress(true);
  };

  const changeMood = (index: number) => {
    setMoodState(index + 1);
    setMood(index + 1);
  };

  const saveBig3 = (index: number, value: string) => {
    const next = [...big3];
    next[index] = value;
    setBig3(next);
    const map = readJSON<Record<string, string[]>>(BIG3_KEY, {});
    map[todayKey()] = next;
    writeJSON(BIG3_KEY, map);
  };

  const toggleBig3 = (index: number) => {
    const next = [...big3Done];
    next[index] = !big3Done[index];
    setBig3Done(next);
    const map = readJSON<Record<string, boolean[]>>(BIG3_DONE_KEY, {});
    map[todayKey()] = next;
    writeJSON(BIG3_DONE_KEY, map);
    if (next[index]) {
      bumpStreak();
      setChecked(true);
      refreshProgress(true);
    }
  };

  const submitExpense = () => {
    const amount = Number(expAmount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    addExpense({ amount, category: expCat, note: expNote.trim() || undefined });
    setExpenses(getExpenses());
    setExpAmount("");
    setExpNote("");
    recordActivity("expense");
    refreshProgress(true);
  };

  const deleteExpenseEntry = (id: string) => {
    removeExpense(id);
    setExpenses(getExpenses());
  };

  const doCheckIn = () => {
    if (checked) return;
    const before = getStreakState().lastDay;
    const after = bumpStreak();
    if (after.lastDay !== before) addPoints(10);
    setChecked(true);
    refreshProgress(true);
    toast.success(t("checkin.toast"));
  };

  const buyFreeze = () => {
    if (!deductPoints(FREEZE_COST)) {
      toast.error(t("dash.notEnoughPoints", { cost: FREEZE_COST }));
      return;
    }
    addStreakFreeze(1);
    refreshProgress();
    toast.success(t("dash.freezeToast"));
  };

  const completeChallenge = () => {
    if (challengeDone) return;
    markChallengeDone();
    recordActivity("challenge");
    addPoints(10);
    bumpStreak();
    setChallengeDone(true);
    setChecked(true);
    refreshProgress(true);
    toast.success(t("challenge.toast"));
  };

  const addGoal = () => {
    const target = Number(goalTarget);
    if (!goalTitle.trim() || !Number.isFinite(target) || target <= 0) return;
    const next: Goal[] = [
      ...goals,
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
        title: goalTitle.trim(),
        category: goalCat,
        target,
        current: 0,
      },
    ];
    setGoals(next);
    writeGoals(next);
    setGoalTitle("");
    setGoalTarget("");
  };

  const bumpGoal = (id: string, delta: number) => {
    const next = goals.map((g) =>
      g.id === id ? { ...g, current: Math.min(g.target, Math.max(0, g.current + delta)) } : g,
    );
    setGoals(next);
    writeGoals(next);
  };

  const deleteGoal = (id: string) => {
    const next = goals.filter((g) => g.id !== id);
    setGoals(next);
    writeGoals(next);
  };

  const expenseTotal = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const streakCount = getStreakState().count;

  /** Real 7-day rollup for the weekly view */
  const week = useMemo(() => {
    const days = lastNDays(7);
    const locale = lang === "ar" ? "ar-EG" : "en-US";
    const labels = days.map((d) =>
      new Date(`${d}T12:00:00`).toLocaleDateString(locale, { weekday: "short" }),
    );
    const waters = days.map((d) => getDailyValue("water", d));
    const sleeps = days.map((d) => getDailyValue("sleep", d));
    const activities = days.map((d) => getDailyValue("activity", d));
    const moods = days.map((d) => getDailyValue("mood", d));
    const spend = days.map((d) => getExpenses(d).reduce((s, e) => s + e.amount, 0));
    return {
      labels,
      waters,
      sleeps,
      activities,
      moods,
      spend,
      totalWater: waters.reduce((a, b) => a + b, 0),
      totalSleep: Math.round(sleeps.reduce((a, b) => a + b, 0) * 10) / 10,
      totalSpend: spend.reduce((a, b) => a + b, 0),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, view]);

  /** "Today's impact" — built only from what the user actually logged */
  const impactParts = useMemo(() => {
    const parts: string[] = [];
    if (water >= WATER_MAX) parts.push(t("impact.water", { n: water, max: WATER_MAX }));
    if (sleep >= 7) parts.push(t("impact.sleep", { n: sleep }));
    if (eco > 0) parts.push(t("impact.eco", { n: eco }));
    return parts;
  }, [water, sleep, eco, t]);

  const energyLabel =
    energy === 0
      ? t("tracker.energy.veryLow")
      : energy <= 33
        ? t("tracker.energy.low")
        : energy <= 66
          ? t("tracker.energy.medium")
          : t("tracker.energy.high");

  const fmt = (n: number) =>
    n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 1 });

  const waterPct = Math.min(100, Math.round((water / WATER_MAX) * 100));

  return (
    <div className="relative min-h-[60vh]" dir={lang === "ar" ? "rtl" : "ltr"}>
      <SEO title={t("dash.seoTitle")} description={t("dash.seoDesc")} />

      <div className="field-hero-media">
        <video
          className="field-video-bg"
          src="/Daily-tab.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="field-video-overlay" aria-hidden="true" />

        <header className="field-hero">
          <p className="field-eyebrow">{t("dash.eyebrow")}</p>
          <h1 className="field-title">
            {t("dash.h1a")} <em>{t("dash.h1b")}</em>
          </h1>
          <p className="field-desc">{t("dash.subtitle")}</p>
          <div className="seg" style={{ marginTop: "1.5rem" }} role="tablist" aria-label="View">
            <button
              type="button"
              className={view === "daily" ? "active" : ""}
              aria-selected={view === "daily"}
              onClick={() => setView("daily")}
            >
              {t("nav.dashboard")}
            </button>
            <button
              type="button"
              className={view === "weekly" ? "active" : ""}
              aria-selected={view === "weekly"}
              onClick={() => setView("weekly")}
            >
              {t("dash.weeklyInsights")}
            </button>
          </div>
        </header>
      </div>

      {/* ═══════════ DAILY VIEW ═══════════ */}
      <div className={`wrap${view === "daily" ? "" : " hidden"}`}>
        <section className="card">
          <h2>{t("badge.title")}</h2>
          <p className="sub">
            {t("badge.unlocked", { count: unlockedIds.length, total: BADGES.length })}
          </p>
          <div className="badge-summary">
            <span className="stat-chip"><b className="stat-num">{points}</b> {t("dash.pts")}</span>
            <span className="stat-chip"><b className="stat-num">{freezes}</b> {t("badge.freezes")}</span>
            <div className="badge-actions">
              <button className="btn btn-ghost" type="button" onClick={buyFreeze}>
                {t("dash.freezeStreak")} ({FREEZE_COST} {t("dash.pts")})
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => setRecoveryOpen(true)}>
                {t("dash.recoverStreak")}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  const earned = BADGES.filter((b) => unlockedIds.includes(b.id))
                    .map((b) => `• ${t(BADGE_NAME_KEY[b.id] ?? b.titleKey)}`)
                    .join("\n");
                  const text = `${t("badge.title")}\n${earned || t("badge.noneEarned")}\n\n${t("badge.shareSignature")}`;
                  navigator.clipboard
                    .writeText(text)
                    .then(() => toast.success(t("badge.copySuccess")))
                    .catch(() => toast.error(t("badge.copyFail")));
                }}
              >
                {t("badge.shareAll")}
              </button>
              <button
                className="btn btn-solid"
                type="button"
                disabled={exporting}
                onClick={async () => {
                  setExporting(true);
                  try {
                    const { generateBadgesPDF, downloadBlob } = await import("@/lib/share");
                    const blob = await generateBadgesPDF(t);
                    const dateStr = new Date().toISOString().split("T")[0];
                    downloadBlob(blob, `waey-badges-${dateStr}.pdf`);
                    toast.success(t("badge.pdfSuccess"));
                  } catch {
                    toast.error(t("badge.pdfFail"));
                  } finally {
                    setExporting(false);
                  }
                }}
              >
                {t("badge.pdf")}
              </button>
            </div>
          </div>
          <div className="badge-grid">
            {BADGES.map((b) => {
              const earned = unlockedIds.includes(b.id);
              return (
                <div key={b.id} className={`badge${earned ? " earned" : ""}`}>
                  <div className="ico">{earned ? <Sparkles size={18} /> : <Lock size={18} />}</div>
                  <div className="nm">{t(BADGE_NAME_KEY[b.id] ?? b.titleKey)}</div>
                  <div className="ds">{t(BADGE_DESC_KEY[b.id] ?? b.descKey)}</div>
                  <div className="tag">{earned ? t("badge.earned") : t("badge.locked")}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card">
          <h2>{t("badge.howToEarn")}</h2>
          <div className="earn-list">
            {EARN.map((e) => (
              <div className="earn" key={e.cat}>
                <div className="cat">{t(e.cat)}</div>
                <ul>
                  {e.items.map((it, i) => (
                    <li key={i}>
                      {it.mk && <span className="mk">{it.mk}</span>}
                      {t(it.key)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="shop-note">{t("dash.shopNote")}</p>
        </section>

        <section className="card">
          <h2>{t("goal.title")}</h2>
          <p className="sub">{t("goal.subtitle")}</p>

          {goals.length === 0 ? (
            <div className="goals-empty">{t("goal.empty")}</div>
          ) : (
            <ul className="goals-list">
              {goals.map((g) => {
                const pct =
                  g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
                const done = g.current >= g.target;
                return (
                  <li key={g.id} className={`goal${done ? " done" : ""}`}>
                    <div className="goal-top">
                      <span className="goal-title">{g.title}</span>
                      <span className="goal-cat">{t(`goal.category.${g.category}`)}</span>
                    </div>
                    <div className="goal-track">
                      <div className="goal-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="goal-foot">
                      <span className="goal-count">
                        {fmt(g.current)} / {fmt(g.target)}
                      </span>
                      {done ? (
                        <span className="goal-done">{t("goal.achieved")}</span>
                      ) : (
                        <span className="goal-ctr">
                          <button
                            type="button"
                            className="stepper"
                            onClick={() => bumpGoal(g.id, -1)}
                            aria-label={t("weight.decrease")}
                          >
                            –
                          </button>
                          <button
                            type="button"
                            className="stepper stepper-solid"
                            onClick={() => bumpGoal(g.id, 1)}
                            aria-label={t("goal.addBtn")}
                          >
                            +
                          </button>
                        </span>
                      )}
                      <button
                        type="button"
                        className="goal-del"
                        onClick={() => deleteGoal(g.id)}
                        aria-label={t("goal.delete")}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="goals-add">
            <input
              className="field"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder={t("goal.placeholder")}
            />
            <input
              className="field"
              type="number"
              min={1}
              inputMode="numeric"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              placeholder={t("goal.targetLabel")}
            />
            <select className="field" value={goalCat} onChange={(e) => setGoalCat(e.target.value)}>
              {["health", "finance", "environment", "education", "mindfulness"].map((c) => (
                <option key={c} value={c}>
                  {t(`goal.category.${c}`)}
                </option>
              ))}
            </select>
            <button
              className="btn btn-moss"
              type="button"
              onClick={addGoal}
              disabled={!goalTitle.trim() || !(Number(goalTarget) > 0)}
            >
              <Plus className="size-4" /> {t("goal.addBtn")}
            </button>
          </div>
        </section>

        <section className="card">
          <h2>{t("checkin.title")}</h2>
          <p className="sub">{t("checkin.subtitle")}</p>
          <div className="checkin">
            <span className="flame stat-num">{t("checkin.cta")}</span>
            <span className="stat-chip">
              <b className="stat-num">{streakCount}</b> {t("insights.streakDays")}
            </span>
            <button className="btn btn-solid" type="button" disabled={checked} onClick={doCheckIn}>
              {checked ? t("checkin.done") : t("dash.checkIn")}
            </button>
          </div>
        </section>

        <section className="card">
          <h2>{t("challenge.title")}</h2>
          <p className="sub">{t(challenge.area)}</p>
          <div className="checkin">
            <span>{t(challenge.text)}</span>
            <button
              className={`btn ${challengeDone ? "btn-solid" : "btn-ghost"}`}
              type="button"
              disabled={challengeDone}
              onClick={completeChallenge}
            >
              {challengeDone ? t("challenge.done") : t("challenge.do")}
            </button>
          </div>
        </section>

        <section className="card">
          <h2>{t("fields.health")}</h2>
          <h3 style={{ marginTop: "0.75rem" }}>{t("big3.title")}</h3>
          <p className="sub">{t("big3.subtitle")}</p>
          <div className="tasks">
            {big3.map((task, i) => (
              <div className="task-row" key={i}>
                <button
                  type="button"
                  className={`task-check${big3Done[i] ? " on" : ""}`}
                  aria-pressed={big3Done[i]}
                  aria-label={t("big3.task", { n: i + 1 })}
                  onClick={() => toggleBig3(i)}
                >
                  ✓
                </button>
                <input
                  type="text"
                  value={task}
                  placeholder={t("big3.task", { n: i + 1 })}
                  onChange={(e) => saveBig3(i, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="metrics" style={{ marginTop: "1.25rem" }}>
            <div className="metric">
              <div className="lab">{t("energy.title")}</div>
              <div className="val stat-num">{energy}%</div>
              <div className="energy-bar">
                <div className="energy-fill" style={{ width: `${Math.min(100, energy)}%` }} />
              </div>
              <p className="sub" style={{ marginTop: "0.5rem" }}>{energyLabel}</p>
              <div className="ctr">
                <button type="button" className="stepper" onClick={() => updateTracker("energy", energy - 10, setEnergy)} aria-label="–">–</button>
                <button type="button" className="stepper stepper-solid" onClick={() => updateTracker("energy", energy + 10, setEnergy)} aria-label="+">+</button>
              </div>
            </div>

            <div className="metric">
              <div className="top">
                <span className="lab">{t("tracker.water.title")}</span>
                <span className="val stat-num">
                  {water}
                  <small>/{WATER_MAX} {t("tracker.water.cups")}</small>
                </span>
              </div>
              <div className="energy-bar">
                <div className="energy-fill" style={{ width: `${waterPct}%` }} />
              </div>
              <div className="ctr">
                <button type="button" className="stepper" onClick={() => updateTracker("water", water - 1, setWater)} aria-label={t("tracker.water.decrease")}>–</button>
                <button type="button" className="stepper stepper-solid" onClick={() => updateTracker("water", water + 1, setWater, "water")} aria-label={t("tracker.water.add")}>+</button>
              </div>
            </div>

            <div className="metric">
              <div className="top">
                <span className="lab">{t("dash.sleep")}</span>
                <span className="val stat-num">
                  {fmt(sleep)}
                  <small>/{SLEEP_MAX} {t("dash.hour")}</small>
                </span>
              </div>
              <div className="ctr">
                <button type="button" className="stepper" onClick={() => updateTracker("sleep", sleep - 1, setSleep)} aria-label="–">–</button>
                <button type="button" className="stepper stepper-solid" onClick={() => updateTracker("sleep", sleep + 1, setSleep)} aria-label="+">+</button>
              </div>
            </div>

            <div className="metric">
              <div className="top">
                <span className="lab">{t("dash.activity")}</span>
                <span className="val stat-num">
                  {activity}
                  <small>/{ACTIVITY_MAX} {t("dash.minute")}</small>
                </span>
              </div>
              <div className="ctr">
                <button type="button" className="stepper" onClick={() => updateTracker("activity", activity - 15, setActivity)} aria-label="–">–</button>
                <button type="button" className="stepper stepper-solid" onClick={() => updateTracker("activity", activity + 15, setActivity)} aria-label="+">+</button>
              </div>
            </div>

            <div className="metric">
              <div className="top">
                <span className="lab">{t("dash.eco")}</span>
                <span className="val stat-num">
                  {eco}
                  <small>/{ECO_MAX} {t("dash.action")}</small>
                </span>
              </div>
              <div className="ctr">
                <button type="button" className="stepper" onClick={() => updateTracker("eco", eco - 1, setEco)} aria-label="–">–</button>
                <button type="button" className="stepper stepper-solid" onClick={() => updateTracker("eco", eco + 1, setEco)} aria-label="+">+</button>
              </div>
            </div>

            <div className="metric">
              <div className="top"><span className="lab">{t("weight.title")}</span></div>
              <input
                className="field"
                type="number"
                min={0}
                step="0.1"
                inputMode="decimal"
                value={weight || ""}
                placeholder={t("weight.placeholder")}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setWeight(v);
                  setDailyValue("weight", v);
                }}
              />
              <p className="sub" style={{ marginTop: "0.5rem" }}>{t("weight.footnote")}</p>
            </div>
          </div>
        </section>

        <section className="card">
          <h2>{t("tracker.expense.title")}</h2>
          <div className="exp-head">
            <span className="sub" style={{ margin: 0 }}>{t("tracker.expense.title")}</span>
            <span className="exp-total stat-num">
              {fmt(expenseTotal)} {t("insights.egp")}
            </span>
          </div>
          <div className="tasks">
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              placeholder={t("tracker.expense.placeholder")}
            />
            <select value={expCat} onChange={(e) => setExpCat(e.target.value)} className="field">
              {EXPENSE_CATS.map((c) => (
                <option key={c} value={c}>
                  {t(`tracker.expense.cat.${c}`)}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={expNote}
              onChange={(e) => setExpNote(e.target.value)}
              placeholder={t("tracker.expense.note")}
            />
            <button
              className="btn btn-moss"
              type="button"
              onClick={submitExpense}
              disabled={!(Number(expAmount) > 0)}
            >
              <Plus className="size-4" /> {t("tracker.expense.add")}
            </button>
          </div>

          {expenses.length === 0 ? (
            <p className="sub" style={{ marginTop: "0.75rem" }}>{t("tracker.expense.empty")}</p>
          ) : (
            <ul className="exp-list">
              {expenses.map((e) => (
                <li key={e.id}>
                  <span className="exp-amt stat-num">
                    {fmt(e.amount)} {t("tracker.expense.egp")}
                  </span>
                  <span className="exp-cat">{t(`tracker.expense.cat.${e.category}`)}</span>
                  {e.note && <span className="exp-note">{e.note}</span>}
                  <button
                    type="button"
                    className="goal-del"
                    onClick={() => deleteExpenseEntry(e.id)}
                    aria-label={t("tracker.expense.delete")}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="daily-features">
          <NightReview />
          <GratitudeJournal />
        </div>

        <section className="card">
          <h2>{t("dash.todaysWisdom")}</h2>
          <p className="wisdom stat-num">{quote}</p>
        </section>

        <section className="card">
          <h2>{t("impact.title")}</h2>
          <div className="impact-box">
            {impactParts.length === 0
              ? t("impact.empty")
              : impactParts.length === 1
                ? t("impact.single", { part: impactParts[0] })
                : t("impact.multiple", { parts: impactParts.join(t("impact.join")) })}
          </div>
        </section>

        <section className="card">
          <h2>{t("tracker.mood.title")}</h2>
          <div className="mood-row">
            {MOODS.map((m, i) => (
              <button
                key={m}
                type="button"
                className={mood === i + 1 ? "sel" : ""}
                aria-pressed={mood === i + 1}
                onClick={() => changeMood(i)}
              >
                {t(`tracker.mood.${m}`)}
              </button>
            ))}
          </div>
        </section>


      </div>

      {/* ═══════════ WEEKLY VIEW ═══════════ */}
      <div className={`wrap${view === "weekly" ? "" : " hidden"}`}>
        <section className="card">
          <h2>{t("insights.report")}</h2>
          <ul className="report-note">
            <li>
              {week.totalSleep / 7 >= 7
                ? t("insights.sleep.good")
                : week.totalSleep / 7 >= 6
                  ? t("insights.sleep.medium")
                  : t("insights.sleep.low")}
            </li>
            <li>
              {week.totalWater >= 21 ? t("insights.water.good") : t("insights.water.low")}
            </li>
          </ul>
          <div className="weekly-stats">
            <div className="wstat">
              <div className="l">{t("insights.totalWater")}</div>
              <div className="v stat-num">{fmt(week.totalWater)} {t("insights.cups")}</div>
            </div>
            <div className="wstat">
              <div className="l">{t("insights.totalSleep")}</div>
              <div className="v stat-num">{fmt(week.totalSleep)} {t("insights.hours")}</div>
            </div>
            <div className="wstat">
              <div className="l">{t("insights.weeklyExpenses")}</div>
              <div className="v stat-num">{fmt(week.totalSpend)} {t("insights.egp")}</div>
            </div>
            <div className="wstat">
              <div className="l">{t("insights.streakDays")}</div>
              <div className="v stat-num">{fmt(streakCount)}</div>
            </div>
          </div>
        </section>

        <section className="card">
          <h2>{t("insights.title")}</h2>
          <p className="sub">{t("insights.subtitle")}</p>

          <div className="chart">
            <div className="ctitle">{t("insights.waterChart")}</div>
            <Bars data={week.waters} labels={week.labels} />
          </div>
          <div className="chart">
            <div className="ctitle">{t("insights.expensesChart")}</div>
            <Bars data={week.spend} labels={week.labels} />
          </div>
          <div className="chart">
            <div className="ctitle">{t("insights.sleepChart")}</div>
            <Bars data={week.sleeps} labels={week.labels} />
          </div>
          <div className="chart">
            <div className="ctitle">{t("insights.dailyActivity")}</div>
            <Bars data={week.activities} labels={week.labels} />
          </div>
          <div className="chart">
            <div className="ctitle">{t("tracker.mood.title")}</div>
            <Bars data={week.moods} labels={week.labels} />
          </div>

          {week.totalSpend === 0 && (
            <p className="sub">{t("insights.noExpenses")}</p>
          )}
        </section>

        <div style={{ margin: "1.25rem 0 0" }}>
          <button className="btn btn-ghost" type="button" onClick={() => setView("daily")}>
            ← {t("insights.back")}
          </button>
        </div>
      </div>

      <StreakRecoveryModal
        open={recoveryOpen}
        onClose={() => setRecoveryOpen(false)}
        onRestored={() => {
          setChecked(true);
          refreshProgress();
        }}
      />
    </div>
  );
};

export default Dashboard;


