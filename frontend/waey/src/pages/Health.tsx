import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Candy,
  ClipboardList,
  Droplet,
  Flame,
  HeartPulse,
  Moon,
  Scale,
  Stethoscope,
  Timer,
  Utensils,
  Wind,
} from "lucide-react";
import ArticleCard from "@/components/primitives/ArticleCard";
import NextField from "@/components/NextField";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import StatBand from "@/components/primitives/StatBand";
import TipList from "@/components/primitives/TipList";
import ToolCard from "@/components/primitives/ToolCard";
import { useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import "./Health.css";

/* ── Interactive Health tools (faithful port of health.html) ── */

type RoutineKey = "morning" | "evening";
const ROUTINES: Record<RoutineKey, { key: string; secs: number }[]> = {
  morning: [
    { key: "routine.morning.step1", secs: 45 },
    { key: "routine.morning.step2", secs: 60 },
    { key: "routine.morning.step3", secs: 60 },
    { key: "routine.morning.step4", secs: 75 },
    { key: "routine.morning.step5", secs: 60 },
  ],
  evening: [
    { key: "routine.evening.step1", secs: 45 },
    { key: "routine.evening.step2", secs: 60 },
    { key: "routine.evening.step3", secs: 60 },
    { key: "routine.evening.step4", secs: 75 },
    { key: "routine.evening.step5", secs: 60 },
  ],
};

function MorningRoutineTool() {
  const { t } = useLanguage();
  const [cur, setCur] = useState<RoutineKey>("morning");
  const [running, setRunning] = useState(false);
  const [prog, setProg] = useState<{ step: number; elapsed: number }>({ step: 0, elapsed: 0 });
  const [status, setStatus] = useState("");

  const steps = ROUTINES[cur];
  const total = steps.reduce((s, x) => s + x.secs, 0);
  const doneSecs =
    steps.slice(0, prog.step).reduce((s, x) => s + x.secs, 0) +
    (prog.step < steps.length ? prog.elapsed : 0);
  const pct = prog.step >= steps.length ? 100 : Math.min(100, Math.round((doneSecs / total) * 100));

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setProg((p) => {
        const dur = ROUTINES[cur][p.step]?.secs ?? 1;
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
  }, [running, prog.step, cur, t]);

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
            aria-pressed={cur === "morning"}
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
            aria-pressed={cur === "evening"}
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
      <p className="tool-desc">
        {t("routine.morning.subtitle")} {t("routine.idle")}
      </p>
      <ul className="routine-list">
        {steps.map((s, i) => {
          const cls = i === prog.step && running ? "active" : i < prog.step ? "done" : "";
          return (
            <li key={s.key} className={cls}>
              <span>{t(s.key)}</span>
              <span dir="ltr">
                {s.secs} {t("breathing.seconds")}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="calc-row calc-actions">
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
        <span className="tool-note" role="status">
          {status}
        </span>
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
  const warn = over > 0 ? t("healthCalc.warnOver", { over }) : t("healthCalc.warnOk");

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("healthCalc.title")}</span>
        <span className="tool-note">{t("healthCalc.note")}</span>
      </div>
      <p className="tool-desc">{t("healthCalc.desc")}</p>
      <div className="sugar-preset">
        <div className="sp">
          {t("healthCalc.drinks.label")}
          <b dir="ltr">
            35 {t("healthCalc.gram")}
          </b>
        </div>
        <div className="sp">
          {t("healthCalc.sweets.label")}
          <b dir="ltr">
            25 {t("healthCalc.gram")}
          </b>
        </div>
        <div className="sp">
          {t("healthCalc.fastfood.label")}
          <b dir="ltr">
            15 {t("healthCalc.gram")}
          </b>
        </div>
      </div>
      <div className="calc-row">
        <label htmlFor="sugar-drinks">{t("healthCalc.drinks.label")}</label>
        <input
          id="sugar-drinks"
          type="number"
          min={0}
          value={drink}
          onChange={(e) => setDrink(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="calc-row">
        <label htmlFor="sugar-sweets">{t("healthCalc.sweets.label")}</label>
        <input
          id="sugar-sweets"
          type="number"
          min={0}
          value={sweet}
          onChange={(e) => setSweet(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="calc-row">
        <label htmlFor="sugar-meals">{t("healthCalc.fastfood.label")}</label>
        <input
          id="sugar-meals"
          type="number"
          min={0}
          value={meal}
          onChange={(e) => setMeal(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="res-grid" aria-live="polite">
        <div className="res">
          <div className="l">{t("healthCalc.result.total")}</div>
          <div className="v" dir="ltr">
            {total} {t("healthCalc.gram")}
          </div>
        </div>
        <div className="res">
          <div className="l">{t("healthCalc.result.recommended")}</div>
          <div className="v" dir="ltr">
            25 {t("healthCalc.gram")}
          </div>
        </div>
        <div className="res">
          <div className="l">{t("healthCalc.result.points")}</div>
          <div className="v" dir="ltr">
            {score}/100
          </div>
        </div>
        <div className="res warn">
          <div className="l">{t("healthCalc.noteLabel")}</div>
          <div className="v tool-desc">{warn}</div>
        </div>
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
      <p className="tool-desc">{t("calorie.subtitle")}</p>
      <div className="calc-row">
        <span className="calc-label">{t("calorie.sex")}</span>
        <div className="seg">
          <button
            type="button"
            aria-pressed={sex === "male"}
            className={sex === "male" ? "active" : ""}
            onClick={() => setSex("male")}
          >
            {t("calorie.male")}
          </button>
          <button
            type="button"
            aria-pressed={sex === "female"}
            className={sex === "female" ? "active" : ""}
            onClick={() => setSex("female")}
          >
            {t("calorie.female")}
          </button>
        </div>
      </div>
      <div className="calc-row">
        <label htmlFor="calorie-weight">{t("calorie.weight")}</label>
        <input
          id="calorie-weight"
          type="number"
          min={0}
          value={w}
          onChange={(e) => setW(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="calc-row">
        <label htmlFor="calorie-height">{t("calorie.height")}</label>
        <input
          id="calorie-height"
          type="number"
          min={0}
          value={h}
          onChange={(e) => setH(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="calc-row">
        <label htmlFor="calorie-age">{t("calorie.age")}</label>
        <input
          id="calorie-age"
          type="number"
          min={0}
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="calc-row">
        <label htmlFor="calorie-activity">{t("calorie.activity")}</label>
        <select id="calorie-activity" value={act} onChange={(e) => setAct(parseFloat(e.target.value))}>
          <option value={1.2}>
            {t("calorie.activity.sedentary")} — {t("calorie.activity.sedentary.desc")}
          </option>
          <option value={1.375}>
            {t("calorie.activity.light")} — {t("calorie.activity.light.desc")}
          </option>
          <option value={1.55}>
            {t("calorie.activity.moderate")} — {t("calorie.activity.moderate.desc")}
          </option>
          <option value={1.725}>
            {t("calorie.activity.active")} — {t("calorie.activity.active.desc")}
          </option>
          <option value={1.9}>
            {t("calorie.activity.intense")} — {t("calorie.activity.intense.desc")}
          </option>
        </select>
      </div>
      <div className="res-grid" aria-live="polite">
        <div className="res">
          <div className="l">{t("calorie.bmr")}</div>
          <div className="v" dir="ltr">
            {Math.round(bmr).toLocaleString("en-US")}
          </div>
        </div>
        <div className="res">
          <div className="l">{t("calorie.tdee")}</div>
          <div className="v" dir="ltr">
            {Math.round(tdee).toLocaleString("en-US")}
          </div>
        </div>
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
      <p className="tool-desc">{t("waterCalc.subtitle")}</p>
      <div className="calc-row">
        <label htmlFor="water-weight">{t("waterCalc.weight")}</label>
        <input
          id="water-weight"
          type="number"
          min={0}
          value={w}
          onChange={(e) => setW(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="calc-row">
        <label htmlFor="water-height">{t("waterCalc.height")}</label>
        <input
          id="water-height"
          type="number"
          min={0}
          value={h}
          onChange={(e) => setH(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="calc-row">
        <label htmlFor="water-age">{t("waterCalc.age")}</label>
        <input
          id="water-age"
          type="number"
          min={0}
          value={a}
          onChange={(e) => setA(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="calc-row">
        <label htmlFor="water-activity">{t("waterCalc.activity")}</label>
        <select
          id="water-activity"
          value={act}
          onChange={(e) => setAct(e.target.value as "low" | "medium" | "high")}
        >
          <option value="low">
            {t("waterCalc.lowLabel")} — {t("waterCalc.lowDesc")}
          </option>
          <option value="medium">
            {t("waterCalc.medLabel")} — {t("waterCalc.medDesc")}
          </option>
          <option value="high">
            {t("waterCalc.highLabel")} — {t("waterCalc.highDesc")}
          </option>
        </select>
      </div>
      <div className="res-grid" aria-live="polite">
        <div className="res">
          <div className="l">{t("waterCalc.result")}</div>
          <div className="v">
            {L.toFixed(1)} {t("health.waterUnit")}
          </div>
        </div>
        <div className="res">
          <div className="l">{t("waterCalc.aboutLabel")}</div>
          <div className="v">{t("waterCalc.cups", { n: Math.round(L / 0.25) })}</div>
        </div>
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
      <p className="tool-desc">{t("sleepCalc.note")}</p>
      <div className="calc-row">
        <label htmlFor="sleep-bedtime">{t("sleepCalc.sleepTime")}</label>
        <input
          id="sleep-bedtime"
          type="time"
          value={bed}
          onChange={(e) => setBed(e.target.value)}
        />
      </div>
      <button className="btn btn-solid" type="button" onClick={calc}>
        {t("sleepCalc.calc")}
      </button>
      <div className="res-grid" aria-live="polite">
        {out.map((o) => (
          <div className="res" key={o.cycles}>
            <div className="l">
              {o.cycles} {t("sleepCalc.cycle")} ({o.hours}
              {t("insights.hours")})
            </div>
            <div className="v" dir="ltr">
              {o.time}
            </div>
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
      <p className="tool-desc">{t("plate.subtitle")}</p>
      <div className="plate-wrap">
        <div className="plate" aria-hidden="true" />
        <div className="plate-legend">
          <div>
            <b>{t("plate.half")}:</b> {t("plate.vegSection")}
          </div>
          <div>
            <b>{t("plate.proteinQuarter")}:</b> {t("plate.proteinSection")}
          </div>
          <div>
            <b>{t("plate.carbsQuarter")}:</b> {t("plate.carbsSection")}
          </div>
          <div className="tool-note">
            {t("plate.vegName")}: {t("plate.vegItems")}. {t("plate.proteinName")}:{" "}
            {t("plate.proteinItems")}. {t("plate.carbsName")}: {t("plate.carbsItems")}.
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
        <div className="breath-circle" style={{ transform: `scale(${scale})` }}>
          {label}
        </div>
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

const HOSPITAL_TYPE: Record<string, string> = {
  university: "hospital.typeUniversity",
  public: "hospital.typePublic",
  private: "hospital.typePrivate",
};

function HospitalTool() {
  const { t } = useLanguage();
  const govs = Array.from(new Set(HOSPITALS.map((hosp) => hosp.gov))).sort();
  const [gov, setGov] = useState("");
  const [type, setType] = useState("all");
  const list = HOSPITALS.filter(
    (hosp) => (!gov || hosp.gov === gov) && (type === "all" || hosp.type === type)
  );

  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("hospital.badge")}</span>
        <span className="tool-note">{t("hospital.note")}</span>
      </div>
      <p className="tool-desc">{t("hospital.subtitle")}</p>
      <div className="hosp-controls">
        <label className="sr-only" htmlFor="hospital-gov">
          {t("hospital.governorate")}
        </label>
        <select id="hospital-gov" value={gov} onChange={(e) => setGov(e.target.value)}>
          <option value="">{t("hospital.selectGovernorate")}</option>
          {govs.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="hospital-type">
          {t("hospital.typeLabel")}
        </label>
        <select id="hospital-type" value={type} onChange={(e) => setType(e.target.value)}>
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
              <div className="hm">
                {hosp.gov} · {t(HOSPITAL_TYPE[hosp.type])}
              </div>
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
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

/* ── Page data ────────────────────────────────────────────────── */

const SHELL = "mx-auto w-full max-w-[80rem] px-6 py-14 sm:py-20";
const GRID = "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4";
const TOOL_GRID = "mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3";

// Every card points at a section on this page or a route that exists in App.tsx.
const TOOLS = [
  {
    icon: Droplet,
    to: "#water",
    titleKey: "waterCalc.title",
    descKey: "waterCalc.subtitle",
  },
  {
    icon: Flame,
    to: "#calories",
    titleKey: "calorie.title",
    descKey: "calorie.subtitle",
  },
  {
    icon: Candy,
    to: "#sugar",
    titleKey: "healthCalc.title",
    descKey: "healthCalc.desc",
  },
  {
    icon: Moon,
    to: "#sleep",
    titleKey: "sleepCalc.title",
    descKey: "sleepCalc.subtitle",
  },
  {
    icon: Scale,
    to: "/dashboard",
    titleKey: "health.tracker.title",
    descKey: "health.tracker.desc",
  },
  {
    icon: Timer,
    to: "#routine",
    titleKey: "routine.morning.title",
    descKey: "routine.morning.subtitle",
  },
  {
    icon: Utensils,
    to: "#plate",
    titleKey: "plate.title",
    descKey: "plate.subtitle",
  },
  {
    icon: Wind,
    to: "#breathing",
    titleKey: "breathing.title",
    descKey: "breathing.subtitle",
  },
  {
    icon: Stethoscope,
    to: "#hospitals",
    titleKey: "hospital.badge",
    descKey: "hospital.subtitle",
  },
  {
    icon: HeartPulse,
    to: "#first-aid",
    titleKey: "health.firstAid",
    descKey: "health.firstAidSub",
  },
  {
    icon: ClipboardList,
    to: "#checkups",
    titleKey: "health.checkups",
    descKey: "health.checkupsSub",
  },
];

const TIPS = [
  "quicktips.week1.tip1.tip",
  "quicktips.week1.tip2.tip",
  "quicktips.week1.tip3.tip",
  "quicktips.week1.tip4.tip",
];

const INSIGHTS = [
  {
    categoryKey: "health.sleep",
    titleKey: "sleepHygiene.digitalSunset.title",
    excerptKey: "sleepHygiene.digitalSunset.desc",
  },
  {
    categoryKey: "health.office",
    titleKey: "officeHealth.tip1.title",
    excerptKey: "officeHealth.tip1.desc",
  },
  {
    categoryKey: "health.digital",
    titleKey: "digitalWellness.dopamine.title",
    excerptKey: "digitalWellness.dopamine.desc",
  },
  {
    categoryKey: "health.stress",
    titleKey: "health.stressTip1",
    excerptKey: "health.stressDesc1",
  },
];

const HEALTH_VIDEO = "/Health-tab.mp4";

const Health = () => {
  const { lang, t } = useLanguage();
  const { hash, key } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "health" });
  }, []);

  // ToolCard renders a router Link, and a hash navigation does not scroll on
  // its own — so the tool cards' #anchors are honoured here.
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }, [hash, key]);

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

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="health">
      <PageHero
        eyebrow={t("health.eyebrow")}
        title={t("health.title")}
        lead={t("health.subtitle")}
        primaryAction={{ label: t("health.hero.primary"), to: "/dashboard" }}
        media={
          <div className="health-media">
            <video
              ref={videoRef}
              src={HEALTH_VIDEO}
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
            />
          </div>
        }
      />

      <section className={SHELL} aria-label={t("health.intro.title")}>
        <SectionHeading
          eyebrow={t("health.intro.eyebrow")}
          title={t("health.intro.title")}
          lead={t("health.intro.lead")}
        />
      </section>

      <section className={SHELL} aria-label={t("health.tools")}>
        <SectionHeading
          eyebrow={t("health.tools.eyebrow")}
          title={t("health.tools")}
          lead={t("health.toolsSub")}
        />
        <div className={TOOL_GRID}>
          {TOOLS.map(({ icon, to, titleKey, descKey }, i) => (
            <div key={titleKey} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <ToolCard
                icon={icon}
                to={to}
                title={t(titleKey)}
                description={t(descKey)}
              />
            </div>
          ))}
        </div>

        <div className="health-tools-grid mt-10 grid gap-6 lg:grid-cols-2">
          <div id="routine" className="health-anchor min-w-0">
            <MorningRoutineTool />
          </div>
          <div id="water" className="health-anchor min-w-0">
            <WaterCalculatorTool />
          </div>
          <div id="calories" className="health-anchor min-w-0">
            <CalorieCalculatorTool />
          </div>
          <div id="sugar" className="health-anchor min-w-0">
            <SugarCalculatorTool />
          </div>
          <div id="sleep" className="health-anchor min-w-0">
            <SleepCycleTool />
          </div>
          <div id="plate" className="health-anchor min-w-0">
            <EgyptianPlateTool />
          </div>
          <div id="breathing" className="health-anchor min-w-0">
            <BreathingTool />
          </div>
          <div id="hospitals" className="health-anchor min-w-0">
            <HospitalTool />
          </div>
        </div>

        <div id="first-aid" className="health-anchor mt-14">
          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            {t("health.firstAid")}
          </h2>
          <p className="font-body mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t("health.firstAidSub")}
          </p>
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
          <div className="panel mt-4">
            <h4>{t("firstAid.sugarDrop.title")}</h4>
            <ol className="steps">
              <li>{t("firstAid.sugarDrop.step1")}</li>
              <li>{t("firstAid.sugarDrop.step2")}</li>
              <li>{t("firstAid.sugarDrop.step3")}</li>
              <li>{t("firstAid.sugarDrop.step4")}</li>
            </ol>
          </div>
        </div>

        <div id="checkups" className="health-anchor mt-14">
          <h2 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            {t("health.checkups")}
          </h2>
          <p className="font-body mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t("health.checkupsSub")}
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="ck-table">
              <caption className="sr-only">{t("checkups.title")}</caption>
              <thead>
                <tr>
                  <th scope="col">{t("checkups.test")}</th>
                  <th scope="col">{t("checkups.category")}</th>
                  <th scope="col">{t("checkups.frequency")}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tKey: "checkups.cbc", cKey: "checkups.all", fKey: "checkups.yearly" },
                  { tKey: "checkups.vitaminD", cKey: "checkups.all", fKey: "checkups.yearlyAfter30" },
                  { tKey: "checkups.hba1c", cKey: "checkups.all", fKey: "checkups.yearly" },
                  { tKey: "checkups.lipids", cKey: "checkups.all", fKey: "checkups.yearly" },
                  { tKey: "checkups.mammogram", cKey: "checkups.women", fKey: "checkups.biennialAfter40" },
                  { tKey: "checkups.psa", cKey: "checkups.men", fKey: "checkups.yearlyAfter45" },
                  { tKey: "checkups.dental", cKey: "checkups.all", fKey: "checkups.every6Months" },
                  { tKey: "checkups.liverKidney", cKey: "checkups.all", fKey: "checkups.yearly" },
                ].map((row) => (
                  <tr key={row.tKey}>
                    <td>{t(row.tKey)}</td>
                    <td>{t(row.cKey)}</td>
                    <td>{t(row.fKey)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={SHELL} aria-label={t("quicktips.title")}>
        <SectionHeading
          eyebrow={t("health.eyebrow")}
          title={t("quicktips.title")}
          lead={t("quicktips.subtitle")}
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <TipList title={t("health.tips.checklist")} items={TIPS.map((key) => t(key))} />
        </div>
      </section>

      <section className={SHELL} aria-label={t("health.insights.title")}>
        <SectionHeading
          eyebrow={t("health.insights.eyebrow")}
          title={t("health.insights.title")}
          lead={t("health.insights.lead")}
          action={{ label: t("home.insights.action"), to: "/insights" }}
        />
        <div className={GRID}>
          {INSIGHTS.map(({ categoryKey, titleKey, excerptKey }, i) => (
            <div key={titleKey} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <ArticleCard
                category={t(categoryKey)}
                title={t(titleKey)}
                excerpt={t(excerptKey)}
                meta={t("health.insights.meta")}
                to="/insights"
                field="health"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="health-stat">
        <StatBand
          items={[
            { value: String(TOOLS.length), label: t("health.stats.tools") },
            { value: String(TIPS.length), label: t("health.stats.tips") },
            { value: "0", label: t("home.stats.ads") },
            { value: "100%", label: t("home.stats.data") },
          ]}
        />
      </div>

      <section className={SHELL}>
        <div className="health-cta">
          <p className="eyebrow mb-3">{t("home.cta.eyebrow")}</p>
          <h2 className="font-display text-3xl text-balance tracking-tight text-foreground sm:text-4xl">
            {t("health.perfectTitle")}
          </h2>
          <p className="font-body mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t("health.perfectBody")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/dashboard" className="btn btn-solid min-h-11 px-6 text-sm">
              {t("home.cta.dashboard")}
            </Link>
            <Link to="/insights" className="btn btn-ghost min-h-11 px-6 text-sm">
              {t("home.insights.action")}
            </Link>
            <NextField
              to="finance"
              toRoute="/finance"
              label={t("field.next.health")}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Health;
