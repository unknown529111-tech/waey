import "./Health.css";
import { useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect, useRef, useState } from "react";

/* ── Interactive Health tools (faithful port of health.html) ── */

type RoutineKey = "morning" | "evening";
const ROUTINES: Record<RoutineKey, [string, number][]> = {
  morning: [
    ["Drink a glass of water", 45],
    ["Stretch & roll shoulders", 60],
    ["Breathe 4-4-6 ×3", 60],
    ["Set your one key intention", 75],
    ["Read something light", 60],
  ],
  evening: [
    ["Tidy your space", 45],
    ["Digital sunset (phone away)", 60],
    ["Stretch & neck rolls", 60],
    ["Plan tomorrow’s 3 tasks", 75],
    ["Gratitude: name 1 good thing", 60],
  ],
};

function MorningRoutineTool() {
  const { t } = useLanguage();
  const [cur, setCur] = useState<RoutineKey>("morning");
  const [running, setRunning] = useState(false);
  const [prog, setProg] = useState<{ step: number; elapsed: number }>({ step: 0, elapsed: 0 });
  const [status, setStatus] = useState("");

  const steps = ROUTINES[cur];
  const total = steps.reduce((s, x) => s + x[1], 0);
  const doneSecs =
    steps.slice(0, prog.step).reduce((s, x) => s + x[1], 0) + (prog.step < steps.length ? prog.elapsed : 0);
  const pct = prog.step >= steps.length ? 100 : Math.min(100, Math.round((doneSecs / total) * 100));

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setProg((p) => {
        const dur = ROUTINES[cur][p.step]?.[1] ?? 1;
        const ne = p.elapsed + 1;
        if (ne >= dur) return { step: p.step + 1, elapsed: 0 };
        return { step: p.step, elapsed: ne };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, cur]);

  useEffect(() => {
    if (running && prog.step >= ROUTINES[cur].length) {
      setRunning(false);
      setStatus(t("health.routineDone"));
    }
  }, [running, prog.step, cur]);

  useEffect(() => {
    if (running && prog.step > 0 && prog.step < ROUTINES[cur].length) beep();
  }, [prog.step, running, cur]);

  const reset = () => {
    setRunning(false);
    setProg({ step: 0, elapsed: 0 });
    setStatus("");
  };

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("routine.morning.title")}</span>
        <div className="seg">
          <button
            type="button"
            className={cur === "morning" ? "active" : ""}
            onClick={() => {
              setCur("morning");
              reset();
            }}
          >
            {t("routine.morning.tab")}
          </button>
          <button
            type="button"
            className={cur === "evening" ? "active" : ""}
            onClick={() => {
              setCur("evening");
              reset();
            }}
          >
            {t("routine.evening.tab")}
          </button>
        </div>
      </div>
      <p style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))", lineHeight: 1.6, marginBottom: "0.75rem" }}>
        {t("routine.morning.subtitle")} {t("routine.idle")}
      </p>
      <ul className="routine-list">
        {steps.map((s, i) => {
          const cls =
            i === prog.step && running ? "active" : i < prog.step ? "done" : "";
          return (
            <li key={i} className={cls}>
              <span>{s[0]}</span>
              <span>{s[1]}s</span>
            </li>
          );
        })}
      </ul>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="calc-row" style={{ marginTop: "0.75rem" }}>
        <button
          className="btn btn-solid"
          type="button"
          onClick={() => {
            if (running) {
              setRunning(false);
              setStatus("");
            } else {
              setStatus(t("health.routineInProgress"));
              setRunning(true);
            }
          }}
        >
          {running ? t("routine.pause") : t("routine.start")}
        </button>
        <button className="btn btn-ghost" type="button" onClick={reset}>
          {t("routine.reset")}
        </button>
        <span style={{ fontSize: "0.85rem", color: "hsl(var(--muted-foreground))" }}>{status}</span>
      </div>
    </div>
  );
}

function SugarCalculatorTool() {
  const { t } = useLanguage();
  const [drink, setDrink] = useState(2);
  const [sweet, setSweet] = useState(1);
  const [meal, setMeal] = useState(1);
  const total = drink * 35 + sweet * 25 + meal * 15;
  const limit = 25;
  const over = Math.max(0, total - limit);
  const score = Math.max(0, Math.min(100, Math.round((limit / Math.max(total, 1)) * 52)));
  const warn = over > 0
    ? t("healthCalc.warnOver", { over })
    : t("healthCalc.warnOk");

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("healthCalc.title")}</span>
        <span className="tool-note">{t("healthCalc.note")}</span>
      </div>
      <p style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))", lineHeight: 1.6, marginBottom: "0.75rem" }}>
        {t("healthCalc.desc")}
      </p>
      <div className="sugar-preset">
        <div className="sp">{t("healthCalc.drinks.label")}<b>35g</b>each</div>
        <div className="sp">{t("healthCalc.sweets.label")}<b>25g</b>each</div>
        <div className="sp">{t("healthCalc.fastfood.label")}<b>15g</b>each</div>
      </div>
      <div className="calc-row">
        <label>{t("healthCalc.drinks.label")}</label>
        <input type="number" min={0} value={drink} onChange={(e) => setDrink(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="calc-row">
        <label>{t("healthCalc.sweets.label")}</label>
        <input type="number" min={0} value={sweet} onChange={(e) => setSweet(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="calc-row">
        <label>{t("healthCalc.fastfood.label")}</label>
        <input type="number" min={0} value={meal} onChange={(e) => setMeal(parseFloat(e.target.value) || 0)} />
      </div>
      <div className="res-grid">
        <div className="res"><div className="l">{t("healthCalc.result.total")}</div><div className="v">{total}g</div></div>
        <div className="res"><div className="l">{t("healthCalc.result.recommended")}</div><div className="v">25g</div></div>
        <div className="res"><div className="l">{t("healthCalc.result.points")}</div><div className="v">{score}/100</div></div>
        <div className="res warn"><div className="l">{t("healthCalc.noteLabel")}</div><div className="v" style={{ fontSize: "0.95rem" }}>{warn}</div></div>
      </div>
    </div>
  );
}

function CalorieCalculatorTool() {
  const { t } = useLanguage();
  const [sex, setSex] = useState<"male" | "female">("male");
  const [w, setW] = useState(70);
  const [h, setH] = useState(170);
  const [a, setA] = useState(25);
  const [act, setAct] = useState(1.55);
  const bmr = 10 * w + 6.25 * h - 5 * a + (sex === "male" ? 5 : -161);
  const tdee = bmr * act;

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("calorie.title")}</span>
        <span className="tool-note">{t("calorie.note")}</span>
      </div>
      <p style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))", lineHeight: 1.6, marginBottom: "0.75rem" }}>
        {t("calorie.subtitle")}
      </p>
      <div className="calc-row">
        <label>{t("calorie.sex")}</label>
        <div className="seg">
          <button type="button" className={sex === "male" ? "active" : ""} onClick={() => setSex("male")}>{t("calorie.male")}</button>
          <button type="button" className={sex === "female" ? "active" : ""} onClick={() => setSex("female")}>{t("calorie.female")}</button>
        </div>
      </div>
      <div className="calc-row"><label>{t("calorie.weight")}</label><input type="number" min={0} value={w} onChange={(e) => setW(parseFloat(e.target.value) || 0)} /></div>
      <div className="calc-row"><label>{t("calorie.height")}</label><input type="number" min={0} value={h} onChange={(e) => setH(parseFloat(e.target.value) || 0)} /></div>
      <div className="calc-row"><label>{t("calorie.age")}</label><input type="number" min={0} value={a} onChange={(e) => setA(parseFloat(e.target.value) || 0)} /></div>
      <div className="calc-row">
        <label>{t("calorie.activity")}</label>
        <select value={act} onChange={(e) => setAct(parseFloat(e.target.value))}>
          <option value={1.2}>{t("calorie.activity.sedentary")} — {t("calorie.activity.sedentary.desc")}</option>
          <option value={1.375}>{t("calorie.activity.light")} — {t("calorie.activity.light.desc")}</option>
          <option value={1.55}>{t("calorie.activity.moderate")} — {t("calorie.activity.moderate.desc")}</option>
          <option value={1.725}>{t("calorie.activity.active")} — {t("calorie.activity.active.desc")}</option>
          <option value={1.9}>{t("calorie.activity.intense")} — {t("calorie.activity.intense.desc")}</option>
        </select>
      </div>
      <div className="res-grid">
        <div className="res"><div className="l">{t("calorie.bmr")}</div><div className="v">{Math.round(bmr).toLocaleString("en-US")}</div></div>
        <div className="res"><div className="l">{t("calorie.tdee")}</div><div className="v">{Math.round(tdee).toLocaleString("en-US")}</div></div>
      </div>
      <p className="calc-note">{t("calorie.disclaimer")}</p>
    </div>
  );
}

function WaterCalculatorTool() {
  const { t } = useLanguage();
  const [w, setW] = useState(70);
  const [h, setH] = useState(170);
  const [a, setA] = useState(30);
  const [act, setAct] = useState<"low" | "medium" | "high">("medium");
  const bonus = act === "low" ? 0 : act === "medium" ? 0.35 : 0.7;
  const L = w * 0.033 + bonus;

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("waterCalc.title")}</span>
        <span className="tool-note">{t("waterCalc.note")}</span>
      </div>
      <p style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))", lineHeight: 1.6, marginBottom: "0.75rem" }}>
        {t("waterCalc.subtitle")}
      </p>
      <div className="calc-row"><label>{t("waterCalc.weight")}</label><input type="number" min={0} value={w} onChange={(e) => setW(parseFloat(e.target.value) || 0)} /></div>
      <div className="calc-row"><label>{t("waterCalc.height")}</label><input type="number" min={0} value={h} onChange={(e) => setH(parseFloat(e.target.value) || 0)} /></div>
      <div className="calc-row"><label>{t("waterCalc.age")}</label><input type="number" min={0} value={a} onChange={(e) => setA(parseFloat(e.target.value) || 0)} /></div>
      <div className="calc-row">
        <label>{t("waterCalc.activity")}</label>
        <select value={act} onChange={(e) => setAct(e.target.value as "low" | "medium" | "high")}>
          <option value="low">{t("waterCalc.lowLabel")} — {t("waterCalc.lowDesc")}</option>
          <option value="medium">{t("waterCalc.medLabel")} — {t("waterCalc.medDesc")}</option>
          <option value="high">{t("waterCalc.highLabel")} — {t("waterCalc.highDesc")}</option>
        </select>
      </div>
      <div className="res-grid">
        <div className="res"><div className="l">{t("waterCalc.result")}</div><div className="v">{L.toFixed(1)} L</div></div>
        <div className="res"><div className="l">{t("waterCalc.aboutLabel")}</div><div className="v">{t("waterCalc.cups", { n: Math.round(L / 0.25) })}</div></div>
      </div>
    </div>
  );
}

function SleepCycleTool() {
  const { t } = useLanguage();
  const [bed, setBed] = useState("23:00");
  const [out, setOut] = useState<{ cycles: number; hours: number; time: string }[]>([]);

  const calc = () => {
    const parts = (bed || "23:00").split(":");
    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);
    const base = hh * 60 + mm + 15;
    setOut(
      [4, 5, 6].map((cycles) => {
        const mins = base + cycles * 90;
        const h = Math.floor(mins / 60) % 24;
        const m = mins % 60;
        const time = `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
        return { cycles, hours: cycles * 1.5, time };
      })
    );
  };

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("sleepCalc.title")}</span>
        <span className="tool-note">{t("sleepCalc.subtitle")}</span>
      </div>
        <p style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))", lineHeight: 1.6, marginBottom: "0.75rem" }}>
          {t("sleepCalc.note")}
        </p>
      <div className="calc-row">
        <label>{t("sleepCalc.sleepTime")}</label>
        <input type="time" value={bed} onChange={(e) => setBed(e.target.value)} />
      </div>
      <button className="btn btn-solid" type="button" onClick={calc}>{t("sleepCalc.calc")}</button>
      <div className="res-grid">
        {out.map((o) => (
          <div className="res" key={o.cycles}>
            <div className="l">{o.cycles} cycles ({o.hours}h)</div>
            <div className="v">{o.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EgyptianPlateTool() {
  const { t } = useLanguage();
  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("plate.title")}</span>
        <span className="tool-note">{t("plate.subtitle")}</span>
      </div>
      <p style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))", lineHeight: 1.6, marginBottom: "0.5rem" }}>
        {t("plate.subtitle")}
      </p>
      <div className="plate-wrap">
        <div className="plate" aria-hidden="true" />
        <div className="plate-legend">
          <div><b>{t("plate.half")}:</b> {t("plate.vegSection")}</div>
          <div><b>{t("plate.proteinQuarter")}:</b> {t("plate.proteinSection")}</div>
          <div><b>{t("plate.carbsQuarter")}:</b> {t("plate.carbsSection")}</div>
          <div style={{ marginTop: "0.5rem", color: "hsl(var(--muted-foreground))", fontSize: "0.85rem" }}>
            {t("plate.vegName")}: {t("plate.vegItems")}. {t("plate.proteinName")}: {t("plate.proteinItems")}. {t("plate.carbsName")}: {t("plate.carbsItems")}.
          </div>
        </div>
      </div>
    </div>
  );
}

function BreathingTool() {
  const { t } = useLanguage();
   const [running, setRunning] = useState(false);
   const [label, setLabel] = useState(t("breathing.ready"));
  const [scale, setScale] = useState(1);
  const runningRef = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    runningRef.current = running;
    if (!running) {
      setLabel(t("breathing.ready"));
      setScale(1);
      return;
    }
    let cancelled = false;
    const phase = (lbl: string, sc: number, ms: number, next: () => void) => {
      if (cancelled || !runningRef.current) return;
      setLabel(lbl);
      setScale(sc);
      timer.current = window.setTimeout(next, ms);
    };
    const cycle = () => {
      phase(t("breathing.inhale"), 1.3, 4000, () =>
        phase(t("breathing.hold"), 1.3, 4000, () =>
          phase(t("breathing.exhale"), 0.8, 6000, () => {
            if (runningRef.current && !cancelled) cycle();
          })
        )
      );
    };
    cycle();
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [running, t]);

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("breathing.title")}</span>
        <span className="tool-note">{t("breathing.subtitle")}</span>
      </div>
      <div className="breath-stage">
        <div className="breath-circle" style={{ transform: `scale(${scale})` }}>{label}</div>
        <button className="btn btn-solid" type="button" onClick={() => setRunning((r) => !r)}>
          {running ? t("breathing.stop") : t("breathing.start")}
        </button>
      </div>
    </div>
  );
}

interface Hospital {
  name: string;
  gov: string;
  type: string;
}

const HOSPITALS: Hospital[] = [
  { name: "Kasr Al-Ainy Hospital", gov: "Cairo", type: "university" },
  { name: "Ain Shams University Hospital", gov: "Cairo", type: "university" },
  { name: "El-Demerdash Hospital", gov: "Cairo", type: "university" },
  { name: "Maadi Military Hospital", gov: "Cairo", type: "public" },
  { name: "Heliopolis Hospital (Al Salam)", gov: "Cairo", type: "private" },
  { name: "Giza Police Hospital", gov: "Giza", type: "public" },
  { name: "Agouza Hospital", gov: "Giza", type: "public" },
  { name: "Alexandria Main University Hospital", gov: "Alexandria", type: "university" },
  { name: "El-Shatby University Hospital", gov: "Alexandria", type: "university" },
  { name: "Mansoura University Hospital", gov: "Dakahlia", type: "university" },
  { name: "Tanta University Hospital", gov: "Gharbia", type: "university" },
  { name: "Assiut University Hospital", gov: "Assiut", type: "university" },
  { name: "Aswan University Hospital", gov: "Aswan", type: "university" },
  { name: "Sohag University Hospital", gov: "Sohag", type: "university" },
  { name: "Zagazig University Hospital", gov: "Sharkia", type: "university" },
  { name: "Beni-Suef University Hospital", gov: "Beni Suef", type: "university" },
];

function HospitalTool() {
  const { t } = useLanguage();
  const govs = Array.from(new Set(HOSPITALS.map((hosp) => hosp.gov))).sort();
  const [gov, setGov] = useState("");
  const [type, setType] = useState("all");
  const list = HOSPITALS.filter((hosp) => (!gov || hosp.gov === gov) && (type === "all" || hosp.type === type));

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("hospital.badge")}</span>
        <span className="tool-note">{t("hospital.note")}</span>
      </div>
      <p style={{ fontSize: "0.9rem", color: "hsl(var(--muted-foreground))", lineHeight: 1.6, marginBottom: "0.75rem" }}>
        {t("hospital.subtitle")}
      </p>
      <div className="hosp-controls">
        <select value={gov} onChange={(e) => setGov(e.target.value)}>
          <option value="">{t("hospital.selectGovernorate")}</option>
          {govs.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">{t("hospital.all")}</option>
          <option value="public">{t("hospital.typePublic")}</option>
          <option value="university">{t("hospital.typeUniversity")}</option>
          <option value="private">{t("hospital.typePrivate")}</option>
        </select>
      </div>
      <ul className="hosp-list">
        {list.length === 0 ? (
          <li className="hosp-empty">{t("hospital.noResults")}</li>
        ) : (
          list.map((hosp) => (
            <li key={hosp.name}>
              <div className="hn">{hosp.name}</div>
              <div className="hm">{hosp.gov} · {hosp.type}</div>
            </li>
          ))
        )}
      </ul>
      <p className="calc-note">{t("hospital.disclaimer", { 0: "123" })}</p>
    </div>
  );
}

function beep() {
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const C = new Ctor();
    const o = C.createOscillator();
    const g = C.createGain();
    o.connect(g);
    g.connect(C.destination);
    o.frequency.value = 660;
    g.gain.value = 0.05;
    o.start();
    setTimeout(() => {
      o.stop();
      C.close();
    }, 150);
  } catch {
    /* no-op */
  }
}

/* ── Page ─────────────────────────────────────────────────────── */

const quickTips: { hKey: string; pKey: string }[] = [
  { hKey: "quicktips.week3.tip1.category", pKey: "quicktips.week3.tip1.tip" },
  { hKey: "quicktips.week3.tip2.category", pKey: "quicktips.week3.tip2.tip" },
  { hKey: "quicktips.week3.tip3.category", pKey: "quicktips.week3.tip3.tip" },
  { hKey: "quicktips.week3.tip4.category", pKey: "quicktips.week3.tip4.tip" },
  { hKey: "health.recipesHeading", pKey: "health.recipesDesc" },
];

const officeTips: { hKey: string; pKey: string }[] = [
  { hKey: "officeHealth.tip1.title", pKey: "officeHealth.tip1.desc" },
  { hKey: "officeHealth.tip2.title", pKey: "officeHealth.tip2.desc" },
  { hKey: "officeHealth.tip3.title", pKey: "officeHealth.tip3.desc" },
];

const sleepTips: { hKey: string; pKey: string }[] = [
  { hKey: "sleepHygiene.digitalSunset.title", pKey: "sleepHygiene.digitalSunset.desc" },
  { hKey: "sleepHygiene.powerNap.title", pKey: "sleepHygiene.powerNap.desc" },
  { hKey: "sleepHygiene.food.title", pKey: "sleepHygiene.food.desc" },
];

const digitalTips: { hKey: string; pKey: string }[] = [
  { hKey: "digitalWellness.dopamine.title", pKey: "digitalWellness.dopamine.desc" },
  { hKey: "digitalWellness.cleanup.title", pKey: "digitalWellness.cleanup.desc" },
];

const stressTips: { hKey: string; pKey: string }[] = [
  { hKey: "health.stressTip1", pKey: "health.stressDesc1" },
  { hKey: "health.stressTip2", pKey: "health.stressDesc2" },
  { hKey: "health.stressTip3", pKey: "health.stressDesc3" },
  { hKey: "health.stressTip4", pKey: "health.stressDesc4" },
  { hKey: "health.stressTip5", pKey: "health.stressDesc5" },
];

const checkups: { tKey: string; cKey: string; fKey: string }[] = [
  { tKey: "checkups.cbc", cKey: "checkups.all", fKey: "checkups.yearly" },
  { tKey: "checkups.vitaminD", cKey: "checkups.all", fKey: "checkups.yearlyAfter30" },
  { tKey: "checkups.hba1c", cKey: "checkups.all", fKey: "checkups.yearly" },
  { tKey: "checkups.lipids", cKey: "checkups.all", fKey: "checkups.yearly" },
  { tKey: "checkups.mammogram", cKey: "checkups.women", fKey: "checkups.biennialAfter40" },
  { tKey: "checkups.psa", cKey: "checkups.men", fKey: "checkups.yearlyAfter45" },
  { tKey: "checkups.dental", cKey: "checkups.all", fKey: "checkups.every6Months" },
  { tKey: "checkups.liverKidney", cKey: "checkups.all", fKey: "checkups.yearly" },
];

const groundSteps: { n: string; labKey: string }[] = [
  { n: "5", labKey: "health.groundSeeDesc" },
  { n: "4", labKey: "health.groundTouchDesc" },
  { n: "3", labKey: "health.groundHearDesc" },
  { n: "2", labKey: "health.groundSmellDesc" },
  { n: "1", labKey: "health.groundTasteDesc" },
];

const HEALTH_VIDEO = "/Health-tab.mp4";

const Health = () => {
  const { lang, t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "health" });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
  }, []);

  return (
    <div className="relative" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="field-hero-media">
        <video
          className="field-video-bg"
          ref={videoRef}
          src={HEALTH_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="field-video-overlay" aria-hidden="true" />

        <header className="field-hero">
          <p className="field-eyebrow">{t("health.eyebrow")}</p>
          <h1 className="field-title">{t("health.title")}</h1>
          <p className="field-desc">{t("quicktips.subtitle")}</p>
        </header>
      </div>

      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("quicktips.title")}</p>
          <h2 className="field-section-title">{t("health.h2.quickDrops1")} <em>{t("health.h2.quickDrops2")}</em></h2>
        </div>
      </section>
      <div className="feature-grid">
        {quickTips.map((m) => (
          <div className="feature" key={m.hKey}><h3>{t(m.hKey)}</h3><p>{t(m.pKey)}</p></div>
        ))}
      </div>

      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("health.office")}</p>
          <h2 className="field-section-title">{t("health.h2.protectBody1")} <em>{t("health.h2.protectBody2")}</em></h2>
        </div>
      </section>
      <div className="feature-grid">
        {officeTips.map((m) => (
          <div className="feature" key={m.hKey}><h3>{t(m.hKey)}</h3><p>{t(m.pKey)}</p></div>
        ))}
      </div>

      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("health.firstAid")}</p>
          <h2 className="field-section-title">{t("health.h2.firstAid1")} <em>{t("health.h2.firstAid2")}</em></h2>
          <p className="field-section-sub">{t("health.firstAidSub")}</p>
        </div>
        <div className="two-col">
          <div className="panel">
            <h4>{t("firstAid.burns.title")}</h4>
            <ol className="steps">
              <li>{t("firstAid.burns.step1")}</li>
              <li>{t("firstAid.burns.step2")}</li>
              <li>{t("firstAid.burns.step3")}</li>
              <li>{t("firstAid.burns.step4")}</li>
            </ol>
          </div>
          <div className="panel">
            <h4>{t("firstAid.choking.title")}</h4>
            <ol className="steps">
              <li>{t("firstAid.choking.step1")}</li>
              <li>{t("firstAid.choking.step2")}</li>
              <li>{t("firstAid.choking.step3")}</li>
              <li>{t("firstAid.choking.step4")}</li>
            </ol>
          </div>
        </div>
        <div className="panel" style={{ marginTop: "1rem" }}>
          <h4>{t("firstAid.sugarDrop.title")}</h4>
          <ol className="steps">
            <li>{t("firstAid.sugarDrop.step1")}</li>
            <li>{t("firstAid.sugarDrop.step2")}</li>
            <li>{t("firstAid.sugarDrop.step3")}</li>
            <li>{t("firstAid.sugarDrop.step4")}</li>
          </ol>
        </div>
      </section>

      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("health.sleep")}</p>
          <h2 className="field-section-title">{t("health.h2.rest1")} <em>{t("health.h2.rest2")}</em></h2>
        </div>
      </section>
      <div className="feature-grid">
        {sleepTips.map((m) => (
          <div className="feature" key={m.hKey}><h3>{t(m.hKey)}</h3><p>{t(m.pKey)}</p></div>
        ))}
      </div>

      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("health.digital")}</p>
          <h2 className="field-section-title">{t("health.h2.attention1")} <em>{t("health.h2.attention2")}</em></h2>
        </div>
      </section>
      <div className="feature-grid">
        {digitalTips.map((m) => (
          <div className="feature" key={m.hKey}><h3>{t(m.hKey)}</h3><p>{t(m.pKey)}</p></div>
        ))}
      </div>

      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("health.checkups")}</p>
          <h2 className="field-section-title">{t("health.h2.serviceBody1")} <em>{t("health.h2.serviceBody2")}</em></h2>
          <p className="field-section-sub">{t("health.checkupsSub")}</p>
        </div>
        <table className="ck-table">
          <thead>
            <tr><th>{t("checkups.test")}</th><th>{t("checkups.category")}</th><th>{t("checkups.frequency")}</th></tr>
          </thead>
          <tbody>
            {checkups.map((row) => (
              <tr key={row.tKey}><td>{t(row.tKey)}</td><td>{t(row.cKey)}</td><td>{t(row.fKey)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("health.stress")}</p>
          <h2 className="field-section-title">{t("health.h2.calm1")} <em>{t("health.h2.calm2")}</em></h2>
        </div>
      </section>
      <div className="feature-grid">
        {stressTips.map((m) => (
          <div className="feature" key={m.hKey}><h3>{t(m.hKey)}</h3><p>{t(m.pKey)}</p></div>
        ))}
      </div>

      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("health.grounding")}</p>
          <h2 className="field-section-title">{t("health.h2.present1")} <em>{t("health.h2.present2")}</em></h2>
          <p className="field-section-sub">{t("health.groundingDesc")}</p>
        </div>
        <div className="ground">
          {groundSteps.map((g) => (
            <div className="g" key={g.n}>
              <div className="n">{g.n}</div>
              <div className="lab">{t(g.labKey)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="closing">
        <p>{t("health.perfectTitle")}</p>
        <p className="small">
          {t("health.perfectBody")} {t("health.restMind")} {t("health.breathe")}
        </p>
      </section>

      <section className="field-section">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("health.tools")}</p>
          <h2 className="field-section-title">{t("health.h2.work1")} <em>{t("health.h2.work2")}</em></h2>
          <p className="field-section-sub">{t("health.toolsSub")}</p>
        </div>
        <MorningRoutineTool />
        <SugarCalculatorTool />
        <CalorieCalculatorTool />
        <WaterCalculatorTool />
        <SleepCycleTool />
        <EgyptianPlateTool />
        <BreathingTool />
        <HospitalTool />
      </section>

      <footer className="footer">
        <p>{t("footer.tagline")} <a href="/">{t("footer.backHome")}</a></p>
      </footer>
    </div>
  );
};

export default Health;
