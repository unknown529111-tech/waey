import { useT, useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./Finance.css";

/* ── Shared currency model (faithful port of finance.html) ────── */
type Cur = "EGP" | "SAR" | "AED";
const RATES: Record<Cur, number> = { EGP: 1.55, SAR: 0.19, AED: 0.18 };
const SYM: Record<Cur, string> = { EGP: "EGP", SAR: "SAR", AED: "AED" };
const CURRENCIES: Cur[] = ["EGP", "SAR", "AED"];
const fmt = (n: number) => n.toLocaleString("en-US");

interface Device {
  name: string;
  w: number;
  h: number;
}

/* ── Savings Goal Tracker ─────────────────────────────────────── */
function SavingsGoalTracker({ cur, setCur }: { cur: Cur; setCur: (c: Cur) => void }) {
  const t = useT();
  const [target, setTarget] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const [deposits, setDeposits] = useState<number[]>([]);

  const tNum = parseFloat(target) || 0;
  const total = deposits.reduce((s, d) => s + d, 0);
  const pct = tNum > 0 ? Math.min(100, Math.round((total / tNum) * 100)) : 0;
  const remaining = Math.max(0, tNum - total);

  const addDeposit = () => {
    const d = parseFloat(deposit) || 0;
    if (d <= 0) return;
    setDeposits((prev) => [...prev, d]);
    setDeposit("");
  };

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("finance.goal.title")}</span>
        <div className="cur-pills">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`cur-pill${cur === c ? " active" : ""}`}
              onClick={() => setCur(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1rem" }}>
        {t("finance.goal.subtitle")}
      </p>
      <div className="goal-row">
        <input
          type="number"
          placeholder={t("finance.goal.setTarget")}
          min={0}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <input
          type="number"
          placeholder={t("finance.goal.deposit")}
          min={0}
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />
        <button className="btn btn-solid" type="button" onClick={addDeposit}>
          {t("finance.goal.add")}
        </button>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="goal-meta">
        <span>{t("finance.goal.percentComplete", { pct })}</span>
        <span>
          {tNum > 0
            ? t("finance.goal.metaSaved", { saved: fmt(total), cur: SYM[cur], remaining: fmt(remaining) })
            : t("finance.goal.setTargetBegin")}
        </span>
      </div>
      <ul className="dep-history">
        {deposits.length === 0 ? (
          <li>
            <span>{t("finance.goal.noDeposits")}</span>
            <span />
          </li>
        ) : (
          deposits.map((d, i) => (
            <li key={i}>
              <span>{t("finance.goal.depositLabel")}</span>
              <span className="amt">{fmt(d)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/* ── Electricity Calculator ───────────────────────────────────── */
function ElectricityCalculator({ cur }: { cur: Cur }) {
  const t = useT();
  const [devices, setDevices] = useState<Device[]>([
    { name: "AC", w: 1500, h: 6 },
    { name: "Refrigerator", w: 150, h: 24 },
    { name: "TV", w: 100, h: 5 },
  ]);
  const [name, setName] = useState("");
  const [watt, setWatt] = useState("");
  const [hours, setHours] = useState("");

  const daily = devices.reduce((s, d) => s + (d.w / 1000) * d.h, 0);
  const cost = daily * 30 * RATES[cur];
  const save = cost * 0.2;

  const setField = (i: number, key: "w" | "h", value: string) => {
    const v = parseFloat(value) || 0;
    setDevices((prev) => prev.map((d, idx) => (idx === i ? { ...d, [key]: v } : d)));
  };
  const removeDevice = (i: number) =>
    setDevices((prev) => prev.filter((_, idx) => idx !== i));
  const addDevice = () => {
    const w = parseFloat(watt) || 0;
    if (!name.trim() || w <= 0) return;
    setDevices((prev) => [...prev, { name: name.trim(), w, h: parseFloat(hours) || 0 }]);
    setName("");
    setWatt("");
    setHours("");
  };

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("calc.electricity")}</span>
        <span className="tool-note">{t("calc.electricityNote")}</span>
      </div>
      <table className="calc-table">
        <thead>
          <tr>
            <th className="dev-name">{t("calc.thDevice")}</th>
            <th>{t("calc.thWatts")}</th>
            <th>{t("calc.hourDay")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {devices.map((d, i) => (
            <tr key={i}>
              <td className="dev-name" data-label={t("calc.thDevice")}>
                {d.name}
              </td>
              <td data-label={t("calc.thWatts")}>
                <input
                  type="number"
                  min={0}
                  value={d.w}
                  onChange={(e) => setField(i, "w", e.target.value)}
                />
              </td>
              <td data-label={t("calc.hourDay")}>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={d.h}
                  onChange={(e) => setField(i, "h", e.target.value)}
                />
              </td>
              <td data-label="">
                <button
                  className="btn btn-ghost"
                  type="button"
                  style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }}
                  onClick={() => removeDevice(i)}
                >
                  {t("calc.remove")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="calc-add">
        <input type="text" placeholder={t("calc.devicePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder={t("calc.wattsPlaceholder")} min={0} value={watt} onChange={(e) => setWatt(e.target.value)} />
        <input
          type="number"
          placeholder={t("calc.hourDay")}
          min={0}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <button className="btn btn-ghost" type="button" onClick={addDevice}>
          {t("calc.addDevice")}
        </button>
      </div>
      <div className="calc-out">
        <div className="box">
          <div className="l">{t("calc.dailyConsumption")}</div>
          <div className="v">{daily.toFixed(1)} kWh</div>
        </div>
        <div className="box">
          <div className="l">{t("calc.monthlyCost")}</div>
          <div className="v">{SYM[cur]} {fmt(Math.round(cost))}</div>
        </div>
        <div className="box save">
          <div className="l">{t("calc.youCanSave")}</div>
          <div className="v">{SYM[cur]} {fmt(Math.round(save))}</div>
        </div>
      </div>
       <p className="foot-note">
         {t("calc.electricityFootnote")}
       </p>
    </div>
  );
}

/* ── Monthly Budget ──────────────────────────────────────────── */
function MonthlyBudget({ cur }: { cur: Cur }) {
  const t = useT();
  const [income, setIncome] = useState("");
  const inc = parseFloat(income) || 0;
  const cell = (v: number) => `${SYM[cur]} ${fmt(Math.round(v))}`;

  const budgetCells = [
    { name: t("financeFeatures.envelopes.0.name"), pct: t("financeFeatures.envelopes.0.pct"), mult: 0.5 },
    { name: t("financeFeatures.envelopes.1.name"), pct: t("financeFeatures.envelopes.1.pct"), mult: 0.2 },
    { name: t("financeFeatures.envelopes.2.name"), pct: t("financeFeatures.envelopes.2.pct"), mult: 0.1 },
    { name: t("financeFeatures.envelopes.3.name"), pct: t("financeFeatures.envelopes.3.pct"), mult: 0.2 },
  ];

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("calc.budget")}</span>
        <span className="tool-note">{t("calc.budgetNote")}</span>
      </div>
      <div className="budget-row">
        <input
          type="number"
          placeholder={t("calc.income")}
          min={0}
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
        <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>{SYM[cur]}</span>
      </div>
      <div className="budget-grid">
        {budgetCells.map((bc, i) => (
          <div className="budget-cell" key={i}>
            <div className="bn">{bc.name} · {bc.pct}</div>
            <div className="bv">{cell(inc * bc.mult)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FINANCE_VIDEO = "/Finance-tab.mp4";

const Finance = () => {
  const t = useT();
  const { lang } = useLanguage();
  const [cur, setCur] = useState<Cur>("EGP");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "finance" });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
  }, []);

  const principles = [
    { title: t("finance.principles.0.title"), desc: t("finance.principles.0.desc") },
    { title: t("finance.principles.1.title"), desc: t("finance.principles.1.desc") },
    { title: t("finance.principles.2.title"), desc: t("finance.principles.2.desc") },
    { title: t("finance.principles.3.title"), desc: t("finance.principles.3.desc") },
    { title: t("finance.principles.4.title"), desc: t("finance.principles.4.desc") },
    { title: t("finance.principles.5.title"), desc: t("finance.principles.5.desc") },
  ];

  const everydayTips = [
    t("finance.tips.0"), t("finance.tips.1"), t("finance.tips.2"), t("finance.tips.3"),
    t("finance.tips.4"), t("finance.tips.5"), t("finance.tips.6"), t("finance.tips.7"),
    t("finance.tips.8"), t("finance.tips.9"),
  ];

  const buyQuestions = [
    { question: t("finance.buyQuestions.0.question"), tip: t("finance.buyQuestions.0.tip") },
    { question: t("finance.buyQuestions.1.question"), tip: t("finance.buyQuestions.1.tip") },
    { question: t("finance.buyQuestions.2.question"), tip: t("finance.buyQuestions.2.tip") },
  ];

  const earnTips = [
    { title: t("finance.earnTips.0.title"), desc: t("finance.earnTips.0.desc") },
    { title: t("finance.earnTips.1.title"), desc: t("finance.earnTips.1.desc") },
    { title: t("finance.earnTips.2.title"), desc: t("finance.earnTips.2.desc") },
    { title: t("finance.earnTips.3.title"), desc: t("finance.earnTips.3.desc") },
  ];

  const valueComparison = [
    { method: t("financeFeatures.valueComparison.0.method"), desc: t("financeFeatures.valueComparison.0.desc"), result: t("financeFeatures.valueComparison.0.result") },
    { method: t("financeFeatures.valueComparison.1.method"), desc: t("financeFeatures.valueComparison.1.desc"), result: t("financeFeatures.valueComparison.1.result") },
    { method: t("financeFeatures.valueComparison.2.method"), desc: t("financeFeatures.valueComparison.2.desc"), result: t("financeFeatures.valueComparison.2.result") },
  ];

  const envelopes = [
    { name: t("financeFeatures.envelopes.0.name"), pct: t("financeFeatures.envelopes.0.pct"), fill: 100 },
    { name: t("financeFeatures.envelopes.1.name"), pct: t("financeFeatures.envelopes.1.pct"), fill: 40 },
    { name: t("financeFeatures.envelopes.2.name"), pct: t("financeFeatures.envelopes.2.pct"), fill: 20 },
    { name: t("financeFeatures.envelopes.3.name"), pct: t("financeFeatures.envelopes.3.pct"), fill: 40 },
  ];

  const spendingTriggers = [
    { trigger: t("financeFeatures.spendingTriggers.0.trigger"), fix: t("financeFeatures.spendingTriggers.0.fix") },
    { trigger: t("financeFeatures.spendingTriggers.1.trigger"), fix: t("financeFeatures.spendingTriggers.1.fix") },
    { trigger: t("financeFeatures.spendingTriggers.2.trigger"), fix: t("financeFeatures.spendingTriggers.2.fix") },
  ];

  const warnings = [
    t("finance.warnings.0"), t("finance.warnings.1"), t("finance.warnings.2"), t("finance.warnings.3"),
  ];

  const supermarketTraps = [
    t("financeFeatures.supermarketTraps.0"),
    t("financeFeatures.supermarketTraps.1"),
    t("financeFeatures.supermarketTraps.2"),
    t("financeFeatures.supermarketTraps.3"),
    t("financeFeatures.supermarketTraps.4"),
  ];

  const boostTips = [
    {
      title: t("financeFeatures.incomeAdditions.0.title"),
      desc: [
        t("financeFeatures.incomeAdditions.0.items.0"),
        t("financeFeatures.incomeAdditions.0.items.1"),
        t("financeFeatures.incomeAdditions.0.items.2"),
        t("financeFeatures.incomeAdditions.0.items.3"),
      ].join(" "),
    },
    {
      title: t("financeFeatures.incomeAdditions.1.title"),
      desc: [
        t("financeFeatures.incomeAdditions.1.items.0"),
        t("financeFeatures.incomeAdditions.1.items.1"),
        t("financeFeatures.incomeAdditions.1.items.2"),
      ].join(" "),
    },
    {
      title: t("financeFeatures.incomeAdditions.2.title"),
      desc: [
        t("financeFeatures.incomeAdditions.2.items.0"),
        t("financeFeatures.incomeAdditions.2.items.1"),
        t("financeFeatures.incomeAdditions.2.items.2"),
      ].join(" "),
    },
  ];

  return (
    <div className="relative" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="field-hero-media">
        <video
          className="field-video-bg"
          ref={videoRef}
          src={FINANCE_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="field-video-overlay" aria-hidden="true" />

        <header className="field-hero">
          <p className="field-eyebrow">{t("finance.eyebrow")}</p>
          <h1 className="field-title">
            {t("finance.h1a")} <em>{t("finance.h1b")}</em>
          </h1>
          <p className="field-desc">
            {t("finance.heroDesc")}
          </p>
        </header>
      </div>

      {/* Financial Principles */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("finance.principles")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.principles1")} <em>{t("finance.h2.principles2")}</em>
          </h2>
          <p className="field-section-sub">{t("finance.h2.principlesSub")}</p>
        </div>
      </section>
      <div className="feature-grid">
        {principles.map((p, i) => (
          <div className="feature" key={i} style={{ "--i": i } as CSSProperties}>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Daily Savings Tips */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("finance.tips")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.habits1")} <em>{t("finance.h2.habits2")}</em>
          </h2>
          <p className="field-section-sub">{t("finance.h2.habitsSub")}</p>
        </div>
      </section>
      <div className="tips">
        {everydayTips.map((tip, i) => (
          <div className="tip" key={i}>
            <span>{tip}</span>
          </div>
        ))}
      </div>

      {/* Before You Buy */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("finance.beforeBuy")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.questions1")} <em>{t("finance.h2.questions2")}</em>
          </h2>
          <p className="field-section-sub">
            {t("finance.askBefore")}
          </p>
        </div>
      </section>
      <div className="feature-grid">
        {buyQuestions.map((item, i) => (
          <div className="feature" key={i} style={{ "--i": i } as CSSProperties}>
            <h3>{item.question}</h3>
            <p>{item.tip}</p>
          </div>
        ))}
      </div>

      {/* Earn More */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("finance.earnMore")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.earn1")} <em>{t("finance.h2.earn2")}</em>
          </h2>
          <p className="field-section-sub">{t("finance.h2.earnSub")}</p>
        </div>
      </section>
      <div className="feature-grid">
        {earnTips.map((e, i) => (
          <div className="feature" key={i} style={{ "--i": i } as CSSProperties}>
            <h3>{e.title}</h3>
            <p>{e.desc}</p>
          </div>
        ))}
      </div>

      {/* Inflation */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("financeFeatures.inflationTitle")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.inflation1")} <em>{t("finance.h2.inflation2")}</em>
          </h2>
          <p className="field-section-sub">{t("financeFeatures.inflationDesc")}</p>
        </div>
      </section>
      <div className="triplet">
        {valueComparison.map((v, i) => (
          <div className="trip" key={i}>
            <h3>{v.method}</h3>
            <div className="where">{v.desc}</div>
            <div className="verdict">{v.result}</div>
          </div>
        ))}
      </div>

      {/* Digital Envelope System */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("financeFeatures.digitalEnvelopes")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.envelopes1")} <em>{t("finance.h2.envelopes2")}</em>
          </h2>
          <p className="field-section-sub">{t("financeFeatures.digitalEnvelopesDesc")}</p>
        </div>
      </section>
      <div className="envelope">
        {envelopes.map((e, i) => (
          <div className="env-row" key={i}>
            <span className="env-name">{e.name}</span>
            <span className="env-track">
              <span className="env-fill" style={{ width: `${e.fill}%` }} />
            </span>
            <span className="env-pct">{e.pct}</span>
          </div>
        ))}
      </div>

      {/* Financial Psychology */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("financeFeatures.psychologyTitle")}</p>
          <h2 className="field-section-title">
            {t("financeFeatures.spendingTriggersTitle")}
          </h2>
          <p className="field-section-sub">{t("finance.h2.psychSub")}</p>
        </div>
      </section>
      <div className="feature-grid">
        {spendingTriggers.map((s, i) => (
          <div className="feature" key={i} style={{ "--i": i } as CSSProperties}>
            <h3>{s.trigger}</h3>
            <p>{s.fix}</p>
          </div>
        ))}
      </div>
      <div className="feature-grid" style={{ marginTop: "1rem" }}>
        <div className="feature" style={{ gridColumn: "1 / -1" } as CSSProperties}>
          <h3>{t("financeFeatures.supermarketTrapsTitle")}</h3>
          <ul className="check-list" style={{ marginTop: "0.5rem" }}>
            {supermarketTraps.map((trap, i) => (
              <li key={i}>
                <span className="mk">–</span>
                <span>{trap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* No-Spend Days Challenge */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("financeFeatures.noSpendTitle")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.nospend1")} <em>{t("finance.h2.nospend2")}</em>
          </h2>
          <p className="field-section-sub">
            {t("financeFeatures.noSpendDesc")}
          </p>
        </div>
      </section>
      <div className="chips">
        <span className="chip">{t("financeFeatures.noSpendDays.0")}</span>
        <span className="chip">{t("financeFeatures.noSpendDays.1")}</span>
      </div>

      {/* Budgets for Special Situations */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("financeFeatures.budgetsTitle")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.budgets1")} <em>{t("finance.h2.budgets2")}</em>
          </h2>
          <p className="field-section-sub">{t("finance.h2.budgetsSub")}</p>
        </div>
      </section>
      <div className="two-col">
        <div className="panel">
          <h4>{t("financeFeatures.budgetPlans.0.title")}</h4>
          <ul className="check-list">
            <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.0.tips.0")}</span></li>
            <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.0.tips.1")}</span></li>
            <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.0.tips.2")}</span></li>
            <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.0.tips.3")}</span></li>
            <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.0.tips.4")}</span></li>
          </ul>
        </div>
        <div className="panel">
          <h4>{t("financeFeatures.budgetPlans.1.title")}</h4>
          <ul className="check-list">
            <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.1.tips.0")}</span></li>
            <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.1.tips.1")}</span></li>
            <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.1.tips.2")}</span></li>
            <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.1.tips.3")}</span></li>
          </ul>
        </div>
      </div>
      <div className="panel" style={{ marginTop: "1rem" }}>
        <h4>{t("financeFeatures.budgetPlans.2.title")}</h4>
        <ul className="check-list">
          <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.2.tips.0")}</span></li>
          <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.2.tips.1")}</span></li>
          <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.2.tips.2")}</span></li>
          <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.2.tips.3")}</span></li>
          <li><span className="mk">–</span><span>{t("financeFeatures.budgetPlans.2.tips.4")}</span></li>
        </ul>
      </div>

      {/* Getting Out of Debt */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("financeFeatures.debtTitle")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.debt1")} <em>{t("finance.h2.debt2")}</em>
          </h2>
          <p className="field-section-sub">{t("finance.h2.debtSub")}</p>
        </div>
      </section>
      <div className="two-col">
        <div className="panel">
          <h4>{t("financeFeatures.debtMethods.0.title")}</h4>
          <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            {t("financeFeatures.debtMethods.0.desc")}
          </p>
          <h5>{t("financeFeatures.prosLabel")}</h5>
          <ul className="check-list pros">
            <li><span className="mk">+</span><span>{t("financeFeatures.debtMethods.0.pros.0")}</span></li>
            <li><span className="mk">+</span><span>{t("financeFeatures.debtMethods.0.pros.1")}</span></li>
          </ul>
          <h5>{t("financeFeatures.consLabel")}</h5>
          <ul className="check-list cons">
            <li><span className="mk">–</span><span>{t("financeFeatures.debtMethods.0.cons.0")}</span></li>
          </ul>
        </div>
        <div className="panel">
          <h4>{t("financeFeatures.debtMethods.1.title")}</h4>
          <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            {t("financeFeatures.debtMethods.1.desc")}
          </p>
          <h5>{t("financeFeatures.prosLabel")}</h5>
          <ul className="check-list pros">
            <li><span className="mk">+</span><span>{t("financeFeatures.debtMethods.1.pros.0")}</span></li>
            <li><span className="mk">+</span><span>{t("financeFeatures.debtMethods.1.pros.1")}</span></li>
          </ul>
          <h5>{t("financeFeatures.consLabel")}</h5>
          <ul className="check-list cons">
            <li><span className="mk">–</span><span>{t("financeFeatures.debtMethods.1.cons.0")}</span></li>
          </ul>
        </div>
      </div>
      <div className="panel" style={{ marginTop: "1rem" }}>
        <h4>{t("financeFeatures.refinanceTitle")}</h4>
        <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
          {t("financeFeatures.refinanceDesc")}
        </p>
      </div>

      {/* Boost Your Income */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("financeFeatures.incomeTitle")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.leverage1")} <em>{t("finance.h2.leverage2")}</em>
          </h2>
          <p className="field-section-sub">{t("finance.h2.leverageSub")}</p>
        </div>
      </section>
      <div className="feature-grid">
        {boostTips.map((b, i) => (
          <div className="feature" key={i} style={{ "--i": i } as CSSProperties}>
            <h3>{b.title}</h3>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Warnings */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("finance.warnings")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.warnings1")} <em>{t("finance.h2.warnings2")}</em>
          </h2>
        </div>
      </section>
      <div className="feature-grid">
        {warnings.map((w, i) => (
          <div className="feature" key={i} style={{ "--i": i } as CSSProperties}>
            <h3>{t(`finance.warnTitle.${i}`)}</h3>
            <p>{w}</p>
          </div>
        ))}
      </div>

      {/* Interactive Tools */}
      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("calc.title")}</p>
          <h2 className="field-section-title">
            {t("finance.h2.tools1")} <em>{t("finance.h2.tools2")}</em>
          </h2>
          <p className="field-section-sub">
            {t("finance.h2.toolsSub")}
          </p>
        </div>
      </section>
      <SavingsGoalTracker cur={cur} setCur={setCur} />
      <ElectricityCalculator cur={cur} />
      <MonthlyBudget cur={cur} />

      {/* Closing */}
      <section className="closing">
        <p>{t("finance.footerQuote1")}</p>
        <p className="small">{t("finance.footerQuote3")}</p>
      </section>

      <footer className="footer">
        <p>
          {t("footer.tagline")} <a href="/">{t("footer.backHome")}</a>
        </p>
      </footer>
    </div>
  );
};

export default Finance;
