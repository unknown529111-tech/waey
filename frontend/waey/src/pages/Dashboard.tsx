import { useEffect, useState } from "react";
import { useLanguage, useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import {
  BADGES,
  getUserPoints,
  deductPoints,
  addPoints,
  getUnlockedBadgeIds,
  type Badge,
} from "@/lib/gamification";
import { getStreakFreezes, addStreakFreeze, getStreak, bumpStreak } from "@/lib/dailyStorage";
import { StreakRecoveryModal } from "@/components/StreakRecoveryModal";
import { toast } from "sonner";
import { Sparkles, Lock } from "lucide-react";
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

const DAYS = [
  { d: "21", k: "dash.day.fri" },
  { d: "22", k: "dash.day.sat" },
  { d: "23", k: "dash.day.sun" },
  { d: "24", k: "dash.day.mon" },
  { d: "25", k: "dash.day.tue" },
  { d: "26", k: "dash.day.wed" },
  { d: "27", k: "dash.day.thu" },
];

function Bars({ data }: { data: number[] }) {
  const t = useT();
  const max = Math.max(1, ...data);
  return (
    <div className="bars">
      {data.map((v, i) => {
        const h = Math.max(3, Math.round((v / max) * 100));
        return (
          <div className="col" key={i}>
            <span className="num">{v}</span>
            <div className="bar" style={{ height: `${h}%` }} />
            <span className="day">{DAYS[i].d} {t(DAYS[i].k)}</span>
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

  // Real gamification state
  const [points, setPoints] = useState(getUserPoints());
  const [freezes, setFreezes] = useState(getStreakFreezes());
  const [unlockedIds, setUnlockedIds] = useState<string[]>(getUnlockedBadgeIds);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [checked, setChecked] = useState(false);

  // Challenge
  const [challengeDone, setChallengeDone] = useState(false);

  // Water
  const [water, setWater] = useState(0);

  // Mood + bedtime
  const [mood, setMood] = useState<number | null>(null);
  const [bedtime, setBedtime] = useState(false);

  return (
    <div className="relative min-h-[60vh]" dir={lang === "ar" ? "rtl" : "ltr"}>
      <SEO
        title={t("dash.seoTitle")}
        description={t("dash.seoDesc")}
      />

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
          <h1 className="field-title">{t("dash.h1a")} <em>{t("dash.h1b")}</em></h1>
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
            <span className="stat-chip"><b>{points}</b> {t("dash.pts")}</span>
            <span className="stat-chip"><b>{freezes}</b> {t("badge.freezes")}</span>
            <div className="badge-actions">
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  if (deductPoints(50)) {
                    addStreakFreeze(1);
                    setPoints(getUserPoints());
                    setFreezes(getStreakFreezes());
                  } else {
                    toast.error(t("badge.buyFreeze"));
                  }
                }}
              >
                {t("badge.buyFreeze")}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setRecoveryOpen(true)}
              >
                {t("badge.recoverStreak")}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                disabled={exporting}
                onClick={async () => {
                  setExporting(true);
                  try {
                    const { generateAchievementsShareText, shareContent } = await import("@/lib/share");
                    const text = generateAchievementsShareText(t);
                    const success = await shareContent({ title: t("badge.shareTitle"), text });
                    toast.success(success ? t("badge.shareSuccess") : t("badge.copySuccess"));
                  } catch {
                    toast.error(t("badge.copyFail"));
                  } finally {
                    setExporting(false);
                  }
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
          <div className="goals-empty">{t("goal.empty")}</div>
          <div className="goals-add">
            <button className="btn btn-ghost" type="button">+ {t("goal.add")}</button>
          </div>
        </section>

        <section className="card">
          <h2>{t("checkin.title")}</h2>
          <p className="sub">{t("checkin.subtitle")}</p>
          <div className="checkin">
            <span className="flame">{t("checkin.cta")}</span>
            <button
              className="btn btn-solid"
              type="button"
              disabled={checked}
              onClick={() => {
                if (checked) return;
                bumpStreak();
                addPoints(10);
                setPoints(getUserPoints());
                setChecked(true);
              }}
            >
              {checked ? t("checkin.done") : t("dash.checkIn")}
            </button>
          </div>
        </section>

        <section className="card">
          <h2>{t("challenge.title")}</h2>
          <p className="sub">{t("challenge.item.0.area")}</p>
          <div className="checkin">
            <span>{t("challenge.item.0.text")}</span>
            <button
              className={`btn ${challengeDone ? "btn-solid" : "btn-ghost"}`}
              type="button"
              disabled={challengeDone}
              onClick={() => setChallengeDone(true)}
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
            <input type="text" placeholder={t("big3.task", { n: 1 })} />
            <input type="text" placeholder={t("big3.task", { n: 2 })} />
            <input type="text" placeholder={t("big3.task", { n: 3 })} />
          </div>

          <div className="metrics" style={{ marginTop: "1.25rem" }}>
            <div className="metric">
              <div className="lab">{t("energy.title")}</div>
              <div className="val">0%</div>
              <div className="energy-bar"><div className="energy-fill" /></div>
              <p className="sub" style={{ marginTop: "0.5rem" }}>{t("tracker.energy.veryLow")}</p>
            </div>
            <div className="metric">
              <div className="top">
                <span className="lab">{t("tracker.water.title")}</span>
                <span className="val">{water}<small>/8 {t("tracker.water.cups")}</small></span>
              </div>
              <div className="ctr">
                <button type="button" onClick={() => setWater((w) => (w > 0 ? w - 1 : w))} aria-label="Decrease water">–</button>
                <button type="button" onClick={() => setWater((w) => (w < 8 ? w + 1 : w))} aria-label="Increase water">+</button>
              </div>
            </div>
            <div className="metric">
              <div className="top"><span className="lab">{t("weight.title")}</span></div>
              <div className="val" style={{ fontSize: "1.1rem", color: "var(--muted-foreground)" }}>-- / --</div>
              <p className="sub" style={{ marginTop: "0.5rem" }}>{t("weight.footnote")}</p>
            </div>
            <div className="metric">
              <div className="top"><span className="lab">{t("dash.sleep")}</span><span className="val">0<small>/8 {t("dash.hour")}</small></span></div>
            </div>
            <div className="metric">
              <div className="top"><span className="lab">{t("dash.activity")}</span><span className="val">0<small>/30 {t("dash.minute")}</small></span></div>
            </div>
            <div className="metric">
              <div className="top"><span className="lab">{t("dash.eco")}</span><span className="val">0<small>/3 {t("dash.action")}</small></span></div>
            </div>
          </div>

          <div style={{ marginTop: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>{t("tracker.expense.title")}</span>
              <span style={{ fontFamily: "'Instrument Serif','Amiri',serif", fontSize: "1.4rem" }}>0.00 {t("insights.egp")}</span>
            </div>
            <div className="tasks" style={{ marginTop: "0.6rem" }}>
              <input type="text" placeholder={t("tracker.expense.placeholder")} />
              <input type="text" placeholder={t("tracker.expense.cat.food")} />
              <input type="text" placeholder={t("tracker.expense.note")} />
            </div>
            <p className="sub" style={{ marginTop: "0.6rem" }}>{t("tracker.expense.empty")}</p>
          </div>
        </section>

        <section className="card">
          <h2>{t("night.title")}</h2>
          <div className="review-grid">
            <div>
              <label>{t("night.achievement")}</label>
              <textarea rows={2} placeholder={t("daily.nightReview.achievementPlaceholder")} />
            </div>
            <div>
              <label>{t("night.lesson")}</label>
              <textarea rows={2} placeholder={t("daily.nightReview.lessonPlaceholder")} />
            </div>
            <div className="full">
              <label>{t("dash.bedtimeRoutine")}</label>
              <div className="bedtime-toggle">
                <span
                  className={`switch${bedtime ? " on" : ""}`}
                  role="switch"
                  aria-checked={bedtime}
                  tabIndex={0}
                  onClick={() => setBedtime((b) => !b)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setBedtime((b) => !b); } }}
                >
                  <span className="dot" />
                </span>
                <span className="sub" style={{ margin: 0 }}>{t("daily.nightReview.screensOn")}</span>
              </div>
            </div>
            <div className="full">
              <label>{t("dash.todaysWisdom")}</label>
              <p style={{ fontFamily: "'Instrument Serif','Amiri',serif", fontSize: "1.3rem" }}>الحركة اليومية سر الحياة.</p>
            </div>
            <div className="full">
              <label>{t("tracker.mood.title")}</label>
              <div className="mood-row">
                {MOODS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    className={mood === i ? "sel" : ""}
                    onClick={() => setMood(i)}
                  >
                    {t(`tracker.mood.${m}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className="full">
              <label>{t("gratitude.title")}</label>
              <textarea rows={2} placeholder={t("gratitude.subtitle")} />
            </div>
          </div>
        </section>

        <section className="card">
          <h2>{t("impact.title")}</h2>
          <div className="impact-box">{t("impact.empty")}</div>
        </section>
      </div>

      {/* ═══════════ WEEKLY VIEW ═══════════ */}
      <div className={`wrap${view === "weekly" ? "" : " hidden"}`}>
        <section className="card">
          <h2>{t("insights.report")}</h2>
          <ul className="report-note">
            <li>{t("insights.sleep.low")}</li>
            <li>{t("insights.water.low")}</li>
          </ul>
          <div className="weekly-stats">
            <div className="wstat"><div className="l">{t("insights.totalWater")}</div><div className="v">0 {t("insights.cups")}</div></div>
            <div className="wstat"><div className="l">{t("insights.totalSleep")}</div><div className="v">0.0 {t("insights.hours")}</div></div>
            <div className="wstat"><div className="l">{t("insights.weeklyExpenses")}</div><div className="v">0 {t("insights.egp")}</div></div>
            <div className="wstat"><div className="l">{t("insights.streakDays")}</div><div className="v">1</div></div>
          </div>
        </section>

        <section className="card">
          <h2>{t("insights.title")}</h2>
          <p className="sub">{t("insights.subtitle")}</p>

          <div className="chart"><div className="ctitle">{t("insights.waterChart")}</div><Bars data={[0, 0, 0, 0, 0, 0, 0]} /></div>
          <div className="chart"><div className="ctitle">{t("insights.expensesChart")}</div><Bars data={[0, 0, 0, 0, 0, 0, 0]} /></div>
          <div className="chart"><div className="ctitle">{t("insights.sleepChart")}</div><Bars data={[0, 0, 0, 0, 0, 0, 0]} /></div>
          <div className="chart"><div className="ctitle">{t("insights.expenseDistribution")}</div><p className="sub">{t("insights.noExpenses")}</p></div>
          <div className="chart"><div className="ctitle">{t("insights.dailyActivity")}</div><Bars data={[0, 0, 0, 0, 0, 0, 0]} /></div>
        </section>

        <div style={{ margin: "1.25rem 0 0" }}>
          <button className="btn btn-ghost" type="button" onClick={() => setView("daily")}>← {t("insights.back")}</button>
        </div>
      </div>

      <footer className="footer">
        <p>{t("footer.tagline")} <a href="/">{t("footer.backHome")}</a></p>
      </footer>

      <StreakRecoveryModal
        open={recoveryOpen}
        onClose={() => setRecoveryOpen(false)}
        onRestored={() => setChecked(true)}
      />
    </div>
  );
};

export default Dashboard;
