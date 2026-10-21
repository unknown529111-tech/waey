import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BatteryMedium,
  Check,
  Coins,
  Droplet,
  Flame,
  Footprints,
  GraduationCap,
  HeartPulse,
  Leaf,
  ListChecks,
  Lock,
  Moon,
  Plus,
  Recycle,
  Scale,
  Smile,
  Snowflake,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/useLanguage";
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
import ProgressRing from "@/components/primitives/ProgressRing";
import SectionHeading from "@/components/primitives/SectionHeading";
import StatTile from "@/components/primitives/StatTile";
import NextField from "@/components/NextField";
import type { Field } from "@/components/primitives/FieldCard";
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
const BIG3_KEY = "waey_big3";
const BIG3_DONE_KEY = "waey_big3_done";
const GOALS_KEY = "waey_goals";

/** Daily goals — the ranges the steppers allow are wider than these. */
const TARGETS = { water: WATER_MAX, sleep: 8, activity: 30, eco: 3 } as const;

type TrackerKey = "water" | "sleep" | "activity" | "eco" | "energy";

type Goal = { id: string; title: string; category: string; target: number; current: number };

const readGoals = (): Goal[] => readJSON<Goal[]>(GOALS_KEY, []);
const writeGoals = (goals: Goal[]) => writeJSON(GOALS_KEY, goals);

const readBig3 = (): string[] =>
  readJSON<Record<string, string[]>>(BIG3_KEY, {})[todayKey()] ?? ["", "", ""];
const readBig3Done = (): boolean[] =>
  readJSON<Record<string, boolean[]>>(BIG3_DONE_KEY, {})[todayKey()] ?? [false, false, false];

/* The four fields, and the route + icon each one owns. */
const FIELDS: Field[] = ["health", "finance", "environment", "education"];

const FIELD_META: Record<Field, { icon: LucideIcon; route: string }> = {
  health: { icon: HeartPulse, route: "/health" },
  finance: { icon: Wallet, route: "/finance" },
  environment: { icon: Leaf, route: "/environment" },
  education: { icon: GraduationCap, route: "/education" },
};

/* "mindfulness" is a goal category but not a field — it lives with health. */
const FIELD_OF_GOAL: Record<string, Field> = {
  health: "health",
  mindfulness: "health",
  finance: "finance",
  environment: "environment",
  education: "education",
};

const SHELL = "mx-auto w-full max-w-[80rem] px-6";

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

/** One counter tracker: water, sleep, activity, eco. */
const Counter = ({
  field,
  icon: Icon,
  label,
  value,
  target,
  unit,
  decLabel,
  incLabel,
  onDec,
  onInc,
}: {
  field: Field;
  icon: LucideIcon;
  label: string;
  value: number;
  target: number;
  unit: string;
  decLabel: string;
  incLabel: string;
  onDec: () => void;
  onInc: () => void;
}) => {
  const { t } = useLanguage();
  const pct = Math.min(100, Math.round((value / target) * 100));

  return (
    <section className="dash-tracker" data-field={field} aria-label={label}>
      <header className="dash-tracker-head">
        <span className="dash-tracker-icon">
          <Icon className="size-4" aria-hidden />
        </span>
        <h3>{label}</h3>
      </header>
      <p className="dash-count font-display">
        <span dir="ltr">
          {value}
          <small>
            {" "}
            / {target} {unit}
          </small>
        </span>
      </p>
      <div
        className="dash-bar"
        role="progressbar"
        aria-label={t("dash.trackers.progressLabel")}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.min(value, target)}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="dash-steps">
        <button type="button" className="stepper" onClick={onDec} aria-label={decLabel}>
          –
        </button>
        <button
          type="button"
          className="stepper stepper-solid"
          onClick={onInc}
          aria-label={incLabel}
        >
          +
        </button>
      </div>
    </section>
  );
};

const Dashboard = () => {
  const { lang, t } = useLanguage();
  const locale = lang === "ar" ? "ar-EG" : "en-US";
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "dashboard" });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
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
    if (water >= TARGETS.water) parts.push(t("impact.water", { n: water, max: TARGETS.water }));
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
    n.toLocaleString(locale, { maximumFractionDigits: 1 });

  /* ── Progress, computed from today's real tracker values ───── */

  const trackers = [
    { field: "health" as Field, value: water, target: TARGETS.water },
    { field: "health" as Field, value: sleep, target: TARGETS.sleep },
    { field: "health" as Field, value: activity, target: TARGETS.activity },
    { field: "health" as Field, value: mood, target: 1 },
    { field: "health" as Field, value: weight, target: 1 },
    { field: "finance" as Field, value: expenses.length, target: 1 },
    { field: "environment" as Field, value: eco, target: TARGETS.eco },
    ...goals.map((g) => ({
      field: FIELD_OF_GOAL[g.category] ?? "health",
      value: g.current,
      target: g.target,
    })),
  ];

  const fieldRows = FIELDS.map((field) => {
    const list = trackers.filter((tr) => tr.field === field);
    const pct = list.length
      ? Math.round(
          (list.reduce((s, tr) => s + Math.min(1, Math.max(0, tr.value / tr.target)), 0) /
            list.length) *
            100,
        )
      : null;
    return {
      field,
      pct,
      done: list.filter((tr) => tr.value >= tr.target).length,
      total: list.length,
    };
  });

  const scoredFields = fieldRows.filter((r) => r.pct !== null);
  const overall = scoredFields.length
    ? Math.round(scoredFields.reduce((s, r) => s + (r.pct ?? 0), 0) / scoredFields.length)
    : 0;
  const pending = trackers.filter((tr) => tr.value < tr.target).length;

  /* ── Recent activity — the last six things actually logged ── */

  type RecentItem = { id: string; field?: Field; icon: LucideIcon; text: string; when: string };
  const recent: RecentItem[] = [];
  for (const day of [...lastNDays(6)].reverse()) {
    const when =
      day === todayKey()
        ? t("dash.recent.today")
        : new Date(`${day}T12:00:00`).toLocaleDateString(locale, { weekday: "long" });
    const entries: Omit<RecentItem, "id" | "when">[] = [];
    const dayWater = getDailyValue("water", day);
    if (dayWater > 0)
      entries.push({
        field: "health",
        icon: Droplet,
        text: t("dash.recent.water", { n: fmt(dayWater) }),
      });
    const daySleep = getDailyValue("sleep", day);
    if (daySleep > 0)
      entries.push({
        field: "health",
        icon: Moon,
        text: t("dash.recent.sleep", { n: fmt(daySleep) }),
      });
    const dayActivity = getDailyValue("activity", day);
    if (dayActivity > 0)
      entries.push({
        field: "health",
        icon: Footprints,
        text: t("dash.recent.activity", { n: fmt(dayActivity) }),
      });
    const dayEco = getDailyValue("eco", day);
    if (dayEco > 0)
      entries.push({
        field: "environment",
        icon: Recycle,
        text: t("dash.recent.eco", { n: fmt(dayEco) }),
      });
    const daySpend = getExpenses(day).reduce((s, e) => s + e.amount, 0);
    if (daySpend > 0)
      entries.push({
        field: "finance",
        icon: Wallet,
        text: t("dash.recent.spend", { n: fmt(daySpend) }),
      });
    if (isChallengeDone(day))
      entries.push({ icon: Trophy, text: t("dash.recent.challenge") });
    entries.forEach((entry, i) => recent.push({ ...entry, id: `${day}-${i}`, when }));
    if (recent.length >= 6) break;
  }

  const todayLabel = new Date().toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ChallengeIcon = challenge.icon;

  return (
    <div className="dash" dir={lang === "ar" ? "rtl" : "ltr"}>
      <SEO title={t("dash.seoTitle")} description={t("dash.seoDesc")} />

      {/* ═══════════ WELCOME + OVERALL PROGRESS ═══════════ */}
      <div className={`${SHELL} pt-8 sm:pt-12`}>
        <div className="dash-top">
          <header className="dash-hero">
            <video
              ref={videoRef}
              className="dash-hero-video"
              src="/Daily-tab.mp4"
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <div className="dash-hero-veil" aria-hidden="true" />

            <p className="eyebrow">{todayLabel}</p>
            <h1 className="font-display dash-hero-title">
              {t("dash.welcome")} <em>{t("dash.welcomeEm")}</em>
            </h1>
            <p className="dash-quote">
              <span className="eyebrow dash-quote-label">{t("dash.quoteLabel")}</span>
              {quote}
            </p>

            <p className="dash-pending">
              {pending > 0 ? (
                <>
                  <span className="dash-pending-dot" aria-hidden="true" />
                  {t("dash.remaining", { n: pending })}
                </>
              ) : (
                <>
                  <Check className="size-4" aria-hidden />
                  {t("dash.allDone")}
                </>
              )}
            </p>

            <div className="dash-hero-actions">
              <button
                className="btn btn-solid min-h-11 px-6 text-sm"
                type="button"
                disabled={checked}
                onClick={doCheckIn}
              >
                {checked ? t("checkin.done") : t("dash.checkIn")}
              </button>
              <span className="dash-chip">
                <Flame className="size-4" aria-hidden />
                <b dir="ltr">{fmt(streakCount)}</b>
                {t("insights.streakDays")}
              </span>
              <span className="dash-chip">
                <Sparkles className="size-4" aria-hidden />
                <b dir="ltr">{fmt(points)}</b>
                {t("dash.pts")}
              </span>
              <div className="seg" role="group" aria-label={t("dash.view.label")}>
                <button
                  type="button"
                  aria-pressed={view === "daily"}
                  className={view === "daily" ? "active" : ""}
                  onClick={() => setView("daily")}
                >
                  {t("nav.dashboard")}
                </button>
                <button
                  type="button"
                  aria-pressed={view === "weekly"}
                  className={view === "weekly" ? "active" : ""}
                  onClick={() => setView("weekly")}
                >
                  {t("dash.weeklyInsights")}
                </button>
              </div>
            </div>
          </header>

          <aside className="dash-progress" aria-labelledby="dash-overall-title">
            <h2 id="dash-overall-title" className="dash-panel-title">
              {t("dash.overall.title")}
            </h2>
            <div className="dash-progress-body">
              <ProgressRing
                value={overall}
                label={t("dash.overall.caption")}
                size={148}
              />
              <ul className="dash-legend">
                {fieldRows.map(({ field, pct }) => {
                  const Icon = FIELD_META[field].icon;
                  return (
                    <li key={field} data-field={field}>
                      <span className="dash-legend-icon">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="dash-legend-name">{t(`fields.${field}`)}</span>
                      <span className="dash-legend-pct" dir="ltr">
                        {pct === null ? "—" : `${fmt(pct)}%`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="dash-panel-note">{t("impact.title")}</p>
            <p className="dash-impact">
              {impactParts.length === 0
                ? t("impact.empty")
                : impactParts.length === 1
                  ? t("impact.single", { part: impactParts[0] })
                  : t("impact.multiple", { parts: impactParts.join(t("impact.join")) })}
            </p>
          </aside>
        </div>

        {/* ═══════════ THE FOUR FIELDS ═══════════ */}
        <ul className="dash-fields">
          {fieldRows.map(({ field, pct, done, total }, i) => {
            const Icon = FIELD_META[field].icon;
            return (
              <li
                key={field}
                className="stagger-item"
                style={{ "--i": i } as CSSProperties}
              >
                <Link
                  to={FIELD_META[field].route}
                  className="dash-field"
                  data-field={field}
                >
                  <span className="dash-field-head">
                    <span className="dash-field-icon">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <Arrow className="dash-field-arrow size-5" aria-hidden />
                  </span>
                  <span className="dash-field-name font-display">{t(`fields.${field}`)}</span>
                  <span className="dash-field-line">
                    {total > 0
                      ? t("dash.field.doneOf", { done: fmt(done), total: fmt(total) })
                      : t("dash.field.noTrackers")}
                  </span>
                  <span className="dash-field-bar" aria-hidden="true">
                    <span style={{ width: `${pct ?? 0}%` }} />
                  </span>
                  <span className="dash-field-foot">
                    <span dir="ltr">{pct === null ? "—" : `${fmt(pct)}%`}</span>
                    <span>{t("dash.field.details")}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ═══════════ DAILY VIEW ═══════════ */}
      <div className={view === "daily" ? "" : "hidden"}>
        <section className={`${SHELL} mt-12`} aria-label={t("dash.trackers.title")}>
          <SectionHeading
            eyebrow={t("dash.trackers.eyebrow")}
            title={t("dash.trackers.title")}
            lead={t("dash.trackers.lead")}
          />

          <div className="dash-trackers">
            <Counter
              field="health"
              icon={Droplet}
              label={t("tracker.water.title")}
              value={water}
              target={TARGETS.water}
              unit={t("tracker.water.cups")}
              decLabel={t("tracker.water.decrease")}
              incLabel={t("tracker.water.add")}
              onDec={() => updateTracker("water", water - 1, setWater)}
              onInc={() => updateTracker("water", water + 1, setWater, "water")}
            />

            <Counter
              field="health"
              icon={Moon}
              label={t("dash.sleep")}
              value={sleep}
              target={TARGETS.sleep}
              unit={t("dash.hour")}
              decLabel={`${t("dash.step.decrease")} — ${t("dash.sleep")}`}
              incLabel={`${t("dash.step.increase")} — ${t("dash.sleep")}`}
              onDec={() => updateTracker("sleep", sleep - 1, setSleep)}
              onInc={() => updateTracker("sleep", sleep + 1, setSleep)}
            />

            <Counter
              field="health"
              icon={Footprints}
              label={t("dash.activity")}
              value={activity}
              target={TARGETS.activity}
              unit={t("dash.minute")}
              decLabel={`${t("dash.step.decrease")} — ${t("dash.activity")}`}
              incLabel={`${t("dash.step.increase")} — ${t("dash.activity")}`}
              onDec={() => updateTracker("activity", activity - 15, setActivity)}
              onInc={() => updateTracker("activity", activity + 15, setActivity)}
            />

            <Counter
              field="environment"
              icon={Recycle}
              label={t("dash.eco")}
              value={eco}
              target={TARGETS.eco}
              unit={t("dash.action")}
              decLabel={`${t("dash.step.decrease")} — ${t("dash.eco")}`}
              incLabel={`${t("dash.step.increase")} — ${t("dash.eco")}`}
              onDec={() => updateTracker("eco", eco - 1, setEco)}
              onInc={() => updateTracker("eco", eco + 1, setEco)}
            />

            {/* Energy */}
            <section className="dash-tracker" data-field="health" aria-label={t("energy.title")}>
              <header className="dash-tracker-head">
                <span className="dash-tracker-icon">
                  <BatteryMedium className="size-4" aria-hidden />
                </span>
                <h3>{t("energy.title")}</h3>
              </header>
              <p className="dash-count font-display">
                <span dir="ltr">{fmt(energy)}%</span>
              </p>
              <div
                className="dash-bar"
                role="progressbar"
                aria-label={t("dash.trackers.progressLabel")}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={energy}
              >
                <span style={{ width: `${Math.min(100, energy)}%` }} />
              </div>
              <p className="dash-hint">{energyLabel}</p>
              <div className="dash-steps">
                <button
                  type="button"
                  className="stepper"
                  onClick={() => updateTracker("energy", energy - 10, setEnergy)}
                  aria-label={`${t("dash.step.decrease")} — ${t("energy.title")}`}
                >
                  –
                </button>
                <button
                  type="button"
                  className="stepper stepper-solid"
                  onClick={() => updateTracker("energy", energy + 10, setEnergy)}
                  aria-label={`${t("dash.step.increase")} — ${t("energy.title")}`}
                >
                  +
                </button>
              </div>
            </section>

            {/* Weight */}
            <section className="dash-tracker" data-field="health" aria-label={t("weight.title")}>
              <header className="dash-tracker-head">
                <span className="dash-tracker-icon">
                  <Scale className="size-4" aria-hidden />
                </span>
                <h3>{t("weight.title")}</h3>
              </header>
              <label className="sr-only" htmlFor="dash-weight">
                {t("weight.title")}
              </label>
              <input
                id="dash-weight"
                className="field dash-input"
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
              <p className="dash-hint">{t("weight.footnote")}</p>
            </section>

            {/* Mood */}
            <section className="dash-tracker" data-field="health" aria-label={t("tracker.mood.title")}>
              <header className="dash-tracker-head">
                <span className="dash-tracker-icon">
                  <Smile className="size-4" aria-hidden />
                </span>
                <h3>{t("tracker.mood.title")}</h3>
              </header>
              <div className="dash-mood">
                {MOODS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={mood === i + 1}
                    onClick={() => changeMood(i)}
                  >
                    {t(`tracker.mood.${m}`)}
                  </button>
                ))}
              </div>
            </section>

            {/* Big 3 */}
            <section className="dash-tracker" data-field="health" aria-label={t("big3.title")}>
              <header className="dash-tracker-head">
                <span className="dash-tracker-icon">
                  <ListChecks className="size-4" aria-hidden />
                </span>
                <h3>{t("big3.title")}</h3>
              </header>
              <p className="dash-hint">{t("big3.subtitle")}</p>
              <div className="dash-tasks">
                {big3.map((task, i) => (
                  <div className="dash-task" key={i}>
                    <button
                      type="button"
                      className="dash-check"
                      aria-pressed={big3Done[i]}
                      aria-label={t("dash.big3.toggle", { n: i + 1 })}
                      onClick={() => toggleBig3(i)}
                    >
                      <Check className="size-5" aria-hidden />
                    </button>
                    <input
                      type="text"
                      value={task}
                      placeholder={t("big3.task", { n: i + 1 })}
                      aria-label={t("big3.task", { n: i + 1 })}
                      onChange={(e) => saveBig3(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Daily challenge */}
            <section className="dash-tracker" aria-label={t("challenge.title")}>
              <header className="dash-tracker-head">
                <span className="dash-tracker-icon">
                  {ChallengeIcon ? (
                    <ChallengeIcon className="size-4" aria-hidden />
                  ) : (
                    <Trophy className="size-4" aria-hidden />
                  )}
                </span>
                <h3>{t("challenge.title")}</h3>
                <span className="dash-tag">{t(challenge.area)}</span>
              </header>
              <p className="dash-challenge">{t(challenge.text)}</p>
              <button
                className={`btn ${challengeDone ? "btn-ghost" : "btn-solid"} min-h-11 px-5 text-sm`}
                type="button"
                disabled={challengeDone}
                onClick={completeChallenge}
              >
                {challengeDone ? t("challenge.done") : t("challenge.do")}
              </button>
            </section>

            {/* Expenses */}
            <section
              className="dash-tracker dash-span-2"
              data-field="finance"
              aria-label={t("tracker.expense.title")}
            >
              <header className="dash-tracker-head">
                <span className="dash-tracker-icon">
                  <Coins className="size-4" aria-hidden />
                </span>
                <h3>{t("tracker.expense.title")}</h3>
                <span className="dash-total" dir="ltr">
                  {fmt(expenseTotal)} {t("tracker.expense.egp")}
                </span>
              </header>

              <form
                className="dash-exp-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitExpense();
                }}
              >
                <input
                  className="field dash-input"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder={t("tracker.expense.placeholder")}
                  aria-label={t("tracker.expense.placeholder")}
                />
                <select
                  className="field dash-input"
                  value={expCat}
                  onChange={(e) => setExpCat(e.target.value)}
                  aria-label={t("tracker.expense.title")}
                >
                  {EXPENSE_CATS.map((c) => (
                    <option key={c} value={c}>
                      {t(`tracker.expense.cat.${c}`)}
                    </option>
                  ))}
                </select>
                <input
                  className="field dash-input dash-wide"
                  type="text"
                  value={expNote}
                  onChange={(e) => setExpNote(e.target.value)}
                  placeholder={t("tracker.expense.note")}
                  aria-label={t("tracker.expense.note")}
                />
                <button
                  className="btn btn-solid dash-wide min-h-11 text-sm"
                  type="submit"
                  disabled={!(Number(expAmount) > 0)}
                >
                  <Plus className="size-4" aria-hidden /> {t("tracker.expense.add")}
                </button>
              </form>

              {expenses.length === 0 ? (
                <p className="dash-hint">{t("tracker.expense.empty")}</p>
              ) : (
                <ul className="dash-rows">
                  {expenses.map((e) => (
                    <li key={e.id}>
                      <span className="dash-row-main">
                        <b dir="ltr">
                          {fmt(e.amount)} {t("tracker.expense.egp")}
                        </b>
                        <span className="dash-tag">{t(`tracker.expense.cat.${e.category}`)}</span>
                        {e.note && <span className="dash-row-note">{e.note}</span>}
                      </span>
                      <button
                        type="button"
                        className="dash-del"
                        onClick={() => deleteExpenseEntry(e.id)}
                        aria-label={t("tracker.expense.delete")}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Personal goals */}
            <section className="dash-tracker" aria-label={t("goal.title")}>
              <header className="dash-tracker-head">
                <span className="dash-tracker-icon">
                  <Target className="size-4" aria-hidden />
                </span>
                <h3>{t("goal.title")}</h3>
              </header>
              <p className="dash-hint">{t("goal.subtitle")}</p>

              {goals.length === 0 ? (
                <p className="dash-empty">{t("goal.empty")}</p>
              ) : (
                <ul className="dash-goals">
                  {goals.map((g) => {
                    const pct =
                      g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
                    const done = g.current >= g.target;
                    return (
                      <li key={g.id} className="dash-goal">
                        <div className="dash-goal-top">
                          <span className="dash-goal-title">{g.title}</span>
                          <span className="dash-tag">{t(`goal.category.${g.category}`)}</span>
                        </div>
                        <div className="dash-bar" aria-hidden="true">
                          <span style={{ width: `${pct}%` }} />
                        </div>
                        <div className="dash-goal-foot">
                          <span className="dash-goal-count" dir="ltr">
                            {fmt(g.current)} / {fmt(g.target)}
                          </span>
                          {done ? (
                            <span className="dash-goal-done">{t("goal.achieved")}</span>
                          ) : (
                            <span className="dash-steps">
                              <button
                                type="button"
                                className="stepper"
                                onClick={() => bumpGoal(g.id, -1)}
                                aria-label={`${t("dash.step.decrease")} — ${g.title}`}
                              >
                                –
                              </button>
                              <button
                                type="button"
                                className="stepper stepper-solid"
                                onClick={() => bumpGoal(g.id, 1)}
                                aria-label={`${t("dash.step.increase")} — ${g.title}`}
                              >
                                +
                              </button>
                            </span>
                          )}
                          <button
                            type="button"
                            className="dash-del"
                            onClick={() => deleteGoal(g.id)}
                            aria-label={`${t("goal.delete")} — ${g.title}`}
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <form
                className="dash-goal-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  addGoal();
                }}
              >
                <input
                  className="field dash-input"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder={t("goal.placeholder")}
                  aria-label={t("goal.placeholder")}
                />
                <input
                  className="field dash-input"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder={t("goal.targetLabel")}
                  aria-label={t("goal.targetLabel")}
                />
                <select
                  className="field dash-input"
                  value={goalCat}
                  onChange={(e) => setGoalCat(e.target.value)}
                  aria-label={t("goal.categoryLabel")}
                >
                  {["health", "finance", "environment", "education", "mindfulness"].map((c) => (
                    <option key={c} value={c}>
                      {t(`goal.category.${c}`)}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-solid min-h-11 text-sm"
                  type="submit"
                  disabled={!goalTitle.trim() || !(Number(goalTarget) > 0)}
                >
                  <Plus className="size-4" aria-hidden /> {t("goal.addBtn")}
                </button>
              </form>
            </section>
          </div>

          <div className="dash-journals">
            <NightReview />
            <GratitudeJournal />
          </div>
        </section>

        {/* ═══════════ ACTIVITY · ACHIEVEMENTS · QUICK STATS ═══════════ */}
        <section className={`${SHELL} mt-12`} aria-label={t("dash.recent.title")}>
          <div className="dash-rail">
            <div className="dash-panel">
              <div className="dash-panel-head">
                <h2 className="dash-panel-title">
                  <Flame className="size-5 text-primary" aria-hidden />
                  {t("dash.recent.title")}
                </h2>
              </div>
              {recent.length === 0 ? (
                <p className="dash-hint">{t("dash.recent.empty")}</p>
              ) : (
                <ul className="dash-activity">
                  {recent.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id} data-field={item.field}>
                        <span className="dash-activity-icon">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="dash-activity-text">{item.text}</span>
                        <span className="dash-activity-when">{item.when}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="dash-panel">
              <div className="dash-panel-head">
                <h2 className="dash-panel-title">
                  <Trophy className="size-5 text-primary" aria-hidden />
                  {t("badge.title")}
                </h2>
                <span className="dash-tag" dir="ltr">
                  {fmt(unlockedIds.length)}/{fmt(BADGES.length)}
                </span>
              </div>
              <p className="dash-hint">
                {t("badge.unlocked", {
                  count: unlockedIds.length,
                  total: BADGES.length,
                })}
              </p>

              <ul className="dash-badges">
                {BADGES.map((b) => {
                  const earned = unlockedIds.includes(b.id);
                  const Icon = b.icon ?? Award;
                  return (
                    <li key={b.id} className={`dash-badge${earned ? " is-earned" : ""}`}>
                      <span className="dash-badge-icon">
                        {earned ? (
                          <Icon className="size-4" aria-hidden />
                        ) : (
                          <Lock className="size-4" aria-hidden />
                        )}
                      </span>
                      <span className="dash-badge-name">{t(BADGE_NAME_KEY[b.id] ?? b.titleKey)}</span>
                      <span className="dash-badge-tag">
                        {earned ? t("badge.earned") : t("badge.locked")}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="dash-badge-actions">
                <button className="btn btn-ghost min-h-11 px-4 text-xs" type="button" onClick={buyFreeze}>
                  {t("dash.freezeStreak")} ({fmt(FREEZE_COST)} {t("dash.pts")})
                </button>
                <button
                  className="btn btn-ghost min-h-11 px-4 text-xs"
                  type="button"
                  onClick={() => setRecoveryOpen(true)}
                >
                  {t("dash.recoverStreak")}
                </button>
                <button
                  className="btn btn-ghost min-h-11 px-4 text-xs"
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
                  className="btn btn-solid min-h-11 px-4 text-xs"
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

              <details className="dash-earn">
                <summary>{t("badge.howToEarn")}</summary>
                <div className="dash-earn-grid">
                  {EARN.map((e) => (
                    <div className="dash-earn-group" key={e.cat}>
                      <p className="dash-earn-cat">{t(e.cat)}</p>
                      <ul>
                        {e.items.map((it, i) => (
                          <li key={i}>
                            {it.mk && <span className="dash-earn-mk">{it.mk}</span>}
                            {t(it.key)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="dash-hint">{t("dash.shopNote")}</p>
              </details>
            </div>

            <aside className="dash-panel" aria-label={t("dash.stats.title")}>
              <div className="dash-panel-head">
                <h2 className="dash-panel-title">{t("dash.stats.title")}</h2>
              </div>
              <div className="dash-stat-list">
                <div className="dash-stat" data-tone="streak">
                  <span className="dash-stat-icon">
                    <Flame className="size-5" aria-hidden />
                  </span>
                  <StatTile
                    label={t("insights.streakDays")}
                    value={`${fmt(streakCount)}`}
                  />
                </div>
                <div className="dash-stat" data-tone="points">
                  <span className="dash-stat-icon">
                    <Sparkles className="size-5" aria-hidden />
                  </span>
                  <StatTile label={t("dash.stats.points")} value={`${fmt(points)}`} />
                </div>
                <div className="dash-stat" data-tone="freeze">
                  <span className="dash-stat-icon">
                    <Snowflake className="size-5" aria-hidden />
                  </span>
                  <StatTile label={t("badge.freezes")} value={`${fmt(freezes)}`} />
                </div>
                <div className="dash-stat" data-tone="badges">
                  <span className="dash-stat-icon">
                    <Award className="size-5" aria-hidden />
                  </span>
                  <StatTile
                    label={t("dash.stats.badges")}
                    value={`${fmt(unlockedIds.length)}/${fmt(BADGES.length)}`}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ═══════════ CLOSING CTA ═══════════ */}
        <section className={`${SHELL} mt-12`}>
          <div className="dash-cta">
            <p className="eyebrow">{t("home.cta.eyebrow")}</p>
            <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">
              {t("dash.cta.title")}
            </h2>
            <p className="dash-cta-body">{t("dash.cta.body")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <NextField to="finance" toRoute="/finance" label={t("field.next.health")} />
              <Link to="/insights" className="btn btn-ghost min-h-11 px-6 text-sm">
                {t("home.insights.action")}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════ WEEKLY VIEW ═══════════ */}
      <div className={view === "weekly" ? "" : "hidden"}>
        <section className={`${SHELL} mt-12`} aria-label={t("dash.weeklyInsights")}>
          <SectionHeading
            eyebrow={t("dash.weeklyInsights")}
            title={t("insights.title")}
            lead={t("insights.subtitle")}
          />

          <div className="card mt-8">
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
                <div className="v" dir="ltr">
                  {fmt(week.totalWater)} {t("insights.cups")}
                </div>
              </div>
              <div className="wstat">
                <div className="l">{t("insights.totalSleep")}</div>
                <div className="v" dir="ltr">
                  {fmt(week.totalSleep)} {t("insights.hours")}
                </div>
              </div>
              <div className="wstat">
                <div className="l">{t("insights.weeklyExpenses")}</div>
                <div className="v" dir="ltr">
                  {fmt(week.totalSpend)} {t("insights.egp")}
                </div>
              </div>
              <div className="wstat">
                <div className="l">{t("insights.streakDays")}</div>
                <div className="v" dir="ltr">
                  {fmt(streakCount)}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
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

            {week.totalSpend === 0 && <p className="dash-hint">{t("insights.noExpenses")}</p>}
          </div>

          <button
            className="btn btn-ghost mt-5 min-h-11 px-5 text-sm"
            type="button"
            onClick={() => setView("daily")}
          >
            <Arrow className="size-4" aria-hidden /> {t("insights.back")}
          </button>
        </section>
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
