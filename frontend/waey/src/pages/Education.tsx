import {
  BookOpen,
  Brain,
  CalendarDays,
  Compass,
  Lightbulb,
  ListChecks,
  Timer,
} from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import ArticleCard from "@/components/primitives/ArticleCard";
import NextField from "@/components/NextField";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import StatBand from "@/components/primitives/StatBand";
import TipList from "@/components/primitives/TipList";
import ToolCard from "@/components/primitives/ToolCard";
import { useLanguage, useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import "./Education.css";

/* ── Interactive tools (faithful port of education.html) ──────── */

function PomodoroTool() {
  const t = useT();
  const FOCUS = 25 * 60;
  const BREAK = 5 * 60;
  const [remaining, setRemaining] = useState(FOCUS);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r > 0) return r - 1;
        setMode((m) => {
          const next = m === "focus" ? "break" : "focus";
          if (m === "focus") setCycles((c) => c + 1);
          return next;
        });
        return mode === "focus" ? BREAK : FOCUS;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("edu.tool.pomodoroName")}</span>
        <span className="tool-note">{t("edu.tool.pomodoroNote")}</span>
      </div>
      <div className="pomo-display">{fmt(remaining)}</div>
      <div className="pomo-mode">{mode === "focus" ? t("edu.tool.pomodoroFocus") : t("edu.tool.pomodoroBreak")}</div>
      <div className="pomo-cycles">{t("edu.tool.pomodoroCycles")} {cycles}</div>
      <div className="pomo-controls">
        <button className="btn btn-solid" type="button" onClick={() => setRunning((r) => !r)}>
          {running ? t("edu.tool.pomodoroPause") : t("edu.tool.pomodoroStart")}
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => {
            setRunning(false);
            setMode("focus");
            setRemaining(FOCUS);
            setCycles(0);
          }}
        >
          {t("edu.tool.pomodoroReset")}
        </button>
      </div>
    </div>
  );
}

function BrainDumpTool() {
  const t = useT();
  const [text, setText] = useState("");
  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("edu.tool.brainName")}</span>
        <span className="tool-note">{t("edu.tool.brainNote")}</span>
      </div>
      <textarea
        className="dump-area"
        aria-label={t("edu.tool.brainName")}
        placeholder={t("edu.tool.brainPlaceholder")}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="dump-foot">
        <span className="dump-count">{text.length} {t("edu.tool.brainChars")}</span>
        <button className="btn btn-ghost" type="button" onClick={() => setText("")}>
          {t("edu.tool.brainClear")}
        </button>
      </div>
    </div>
  );
}

const SOUNDS = [
  { id: "lofi", titleKey: "edu.tool.sound.lofi", subKey: "edu.tool.sound.lofiSub" },
  { id: "jazz", titleKey: "edu.tool.sound.jazz", subKey: "edu.tool.sound.jazzSub" },
  { id: "rain", titleKey: "edu.tool.sound.rain", subKey: "edu.tool.sound.rainSub" },
];

function SoundSessionsTool() {
  const t = useT();
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("edu.tool.soundName")}</span>
        <span className="tool-note">{t("edu.tool.soundNote")}</span>
      </div>
      <div className="sound-grid">
        {SOUNDS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={sel === s.id}
            className={`sound-opt${sel === s.id ? " selected" : ""}`}
            onClick={() => setSel(s.id)}
          >
            <span className="s-title">{t(s.titleKey)}</span>
            <span className="s-sub">{t(s.subKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const VARK_OPT_KEYS = [
  "edu.tool.vark.opt0",
  "edu.tool.vark.opt1",
  "edu.tool.vark.opt2",
  "edu.tool.vark.opt3",
];

function VarkSampleTool() {
  const t = useT();
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  return (
    <div className="tool">
      <div className="tool-head">
        <span className="tool-name">{t("edu.tool.varkName")}</span>
        <span className="tool-note">{t("edu.tool.varkNote")}</span>
      </div>
      <p className="vark-q">{t("edu.tool.varkQ")}</p>
      <div className="vark-opts">
        {VARK_OPT_KEYS.map((k, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={sel === i}
            className={`vark-opt${sel === i ? " selected" : ""}`}
            onClick={() => setSel(i)}
          >
            {t(k)}
          </button>
        ))}
      </div>
      <div className="vark-foot">
        <span className="vark-progress">{done ? t("edu.tool.vark.sample") : t("edu.tool.vark.progress")}</span>
        <button className="btn btn-ghost" type="button" onClick={() => setDone(true)}>
          {t("edu.tool.vark.next")}
        </button>
      </div>
    </div>
  );
}

const EDUCATION_VIDEO = "/Education-tab.mp4";

/* ── Page shell (same idiom as Health.tsx) ───────────────────── */

const SHELL = "mx-auto w-full max-w-[80rem] px-6 py-14 sm:py-20";
const GRID = "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4";
const TOOL_GRID = "mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3";

// Every card points at an anchor on this page, or a route in App.tsx.
const TOOLS = [
  { icon: BookOpen, to: "#methods", titleKey: "edu.methods", descKey: "edu.sec.methods.sub" },
  {
    icon: Timer,
    to: "#tools",
    titleKey: "edu.tool.pomodoroName",
    descKey: "edu.tool.pomodoroNote",
  },
  { icon: Lightbulb, to: "#focus", titleKey: "edu.sec.focus.kicker", descKey: "edu.sec.focus.sub" },
  { icon: Compass, to: "#style", titleKey: "edu.sec.style.kicker", descKey: "edu.sec.style.sub" },
  { icon: ListChecks, to: "#tips", titleKey: "edu.sec.lost.kicker", descKey: "edu.sec.lost.sub" },
  { icon: CalendarDays, to: "/dashboard", titleKey: "edu.plan.title", descKey: "edu.plan.desc" },
];

const INSIGHTS = [
  {
    categoryKey: "edu.sec.methods.kicker",
    titleKey: "edu.studyMethods.1.title",
    excerptKey: "edu.studyMethods.1.desc",
  },
  {
    categoryKey: "edu.sec.focus.kicker",
    titleKey: "edu.focusTips.0.title",
    excerptKey: "edu.focusTips.0.desc",
  },
  {
    categoryKey: "edu.sec.notes.kicker",
    titleKey: "edu.tool.cornellName",
    excerptKey: "edu.tool.cornellDesc",
  },
  { categoryKey: "edu.sec.lost.kicker", titleKey: "edu.futureTitle", excerptKey: "edu.futureBody1" },
];

const Education = () => {
  const t = useT();
  const { lang } = useLanguage();
  const { hash, key } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "education" });
  }, []);

  // The hero clip stays still when the reader asked for less motion.
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

  // ToolCard renders a router Link, and a hash navigation does not scroll on
  // its own — so the cards' #anchors are honoured here.
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }, [hash, key]);

  const studyMethods = [
    { id: "pomodoro", icon: Timer, title: t('edu.studyMethods.0.title'), desc: t('edu.studyMethods.0.desc') },
    { id: "active-recall", icon: BookOpen, title: t('edu.studyMethods.1.title'), desc: t('edu.studyMethods.1.desc') },
    { id: "spaced", icon: Compass, title: t('edu.studyMethods.2.title'), desc: t('edu.studyMethods.2.desc') },
    { id: "feynman", icon: Brain, title: t('edu.studyMethods.3.title'), desc: t('edu.studyMethods.3.desc') },
    { id: "mindmap", icon: Lightbulb, title: t('edu.studyMethods.4.title'), desc: t('edu.studyMethods.4.desc') },
    { id: "plan", icon: Compass, title: t('edu.studyMethods.5.title'), desc: t('edu.studyMethods.5.desc') },
  ];

  const focusTips = [
    { id: "phone-off", title: t('edu.focusTips.0.title'), desc: t('edu.focusTips.0.desc') },
    { id: "two-min", title: t('edu.focusTips.1.title'), desc: t('edu.focusTips.1.desc') },
    { id: "change-place", title: t('edu.focusTips.2.title'), desc: t('edu.focusTips.2.desc') },
    { id: "water-breath", title: t('edu.focusTips.3.title'), desc: t('edu.focusTips.3.desc') },
    { id: "write-down", title: t('edu.focusTips.4.title'), desc: t('edu.focusTips.4.desc') },
    { id: "sleep", title: t('edu.focusTips.5.title'), desc: t('edu.focusTips.5.desc') },
  ];

  // The page's checklist: the reminders for the hard days.
  const lostTips = [
    t('edu.lostTips.0'), t('edu.lostTips.1'), t('edu.lostTips.2'),
    t('edu.lostTips.3'), t('edu.lostTips.4'), t('edu.lostTips.5'),
  ];

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="education">
      <PageHero
        eyebrow={t("edu.heroEyebrow")}
        title={t("edu.title")}
        lead={t("edu.subtitle")}
        primaryAction={{ label: t("edu.hero.primary"), to: "#tools" }}
        media={
          <div className="education-media">
            <video
              ref={videoRef}
              src={EDUCATION_VIDEO}
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

      <section className={SHELL} aria-label={t("edu.intro.title")}>
        <SectionHeading
          eyebrow={t("field.intro.eyebrow")}
          title={t("edu.intro.title")}
          lead={t("edu.intro.lead")}
        />
      </section>

      <section className={SHELL} aria-label={t("edu.tools.title")}>
        <SectionHeading
          eyebrow={t("edu.tools.eyebrow")}
          title={t("edu.tools.title")}
          lead={t("edu.tools.lead")}
        />
        <div className={TOOL_GRID}>
          {TOOLS.map(({ icon, to, titleKey, descKey }, i) => (
            <div key={titleKey} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <ToolCard icon={icon} to={to} title={t(titleKey)} description={t(descKey)} />
            </div>
          ))}
        </div>
      </section>

      <section className="field-section" id="methods">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("edu.sec.methods.kicker")}</p>
          <h2 className="field-section-title">{t("edu.sec.methods.title1")}<em>{t("edu.sec.methods.title2")}</em></h2>
          <p className="field-section-sub">{t("edu.sec.methods.sub")}</p>
        </div>
      </section>
      <div className="feature-grid">
        {studyMethods.map((m, i) => (
          <div className="feature" key={m.id} style={{ "--i": i } as CSSProperties}>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
          </div>
        ))}
      </div>

      <section className="field-section" id="focus">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("edu.sec.focus.kicker")}</p>
          <h2 className="field-section-title">{t("edu.sec.focus.title1")}<em>{t("edu.sec.focus.title2")}</em></h2>
          <p className="field-section-sub">{t("edu.sec.focus.sub")}</p>
        </div>
      </section>
      <div className="feature-grid">
        {focusTips.map((tip, i) => (
          <div className="feature" key={tip.id} style={{ "--i": i } as CSSProperties}>
            <h3>{tip.title}</h3>
            <p>{tip.desc}</p>
          </div>
        ))}
      </div>

      {/* Learning tips — the page's checklist */}
      <section id="tips" className={SHELL} aria-label={t("quicktips.title")}>
        <SectionHeading
          eyebrow={t("edu.heroEyebrow")}
          title={t("quicktips.title")}
          lead={t("quicktips.subtitle")}
        />
        <div className="mt-10 max-w-3xl">
          <TipList title={t("edu.tips.checklist")} items={lostTips} />
        </div>
      </section>

      <section className="field-section" id="style">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("edu.sec.style.kicker")}</p>
          <h2 className="field-section-title">{t("edu.sec.style.title1")}<em>{t("edu.sec.style.title2")}</em></h2>
          <p className="field-section-sub">{t("edu.sec.style.sub")}</p>
        </div>
        <VarkSampleTool />
      </section>

      <section className="field-section" id="tools">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("edu.sec.tools.kicker")}</p>
          <h2 className="field-section-title">{t("edu.sec.tools.title1")}<em>{t("edu.sec.tools.title2")}</em></h2>
          <p className="field-section-sub">{t("edu.sec.tools.sub")}</p>
        </div>
        <PomodoroTool />
        <BrainDumpTool />
        <SoundSessionsTool />
      </section>

      <section className="field-section" id="notes">
        <div className="field-section-head">
          <p className="field-section-kicker">{t("edu.sec.notes.kicker")}</p>
          <h2 className="field-section-title">{t("edu.sec.notes.title1")}<em>{t("edu.sec.notes.title2")}</em></h2>
          <p className="field-section-sub">{t("edu.sec.notes.sub")}</p>
        </div>
        <div className="tool">
          <div className="tool-head">
            <span className="tool-name">{t("edu.tool.cornellName")}</span>
            <button className="btn btn-ghost" type="button" onClick={() => window.print()}>{t("edu.tool.cornellDownload")}</button>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1rem" }}>
            {t("edu.tool.cornellDesc")}
          </p>
          <div className="cornell">
            <div className="c-box c-notes">
              <label htmlFor="cornell-notes">{t("edu.tool.cornell.notes")}</label>
              <textarea id="cornell-notes" placeholder={t("edu.tool.cornell.notesPh")} />
            </div>
            <div className="c-box">
              <label htmlFor="cornell-cue">{t("edu.tool.cornell.cue")}</label>
              <textarea id="cornell-cue" placeholder={t("edu.tool.cornell.cuePh")} />
            </div>
            <div className="c-box c-summary">
              <label htmlFor="cornell-summary">{t("edu.tool.cornell.summary")}</label>
              <textarea id="cornell-summary" placeholder={t("edu.tool.cornell.summaryPh")} />
            </div>
          </div>
        </div>
      </section>

      <section className={SHELL} aria-label={t("edu.insights.title")}>
        <SectionHeading
          eyebrow={t("edu.insights.eyebrow")}
          title={t("edu.insights.title")}
          lead={t("edu.insights.lead")}
          action={{ label: t("home.insights.action"), to: "/insights" }}
        />
        <div className={GRID}>
          {INSIGHTS.map(({ categoryKey, titleKey, excerptKey }, i) => (
            <div key={titleKey} className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <ArticleCard
                category={t(categoryKey)}
                title={t(titleKey)}
                excerpt={t(excerptKey)}
                meta={t("edu.insights.meta")}
                to="/insights"
                field="education"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="education-stat">
        <StatBand
          items={[
            { value: String(TOOLS.length), label: t("edu.stats.tools") },
            { value: String(lostTips.length), label: t("edu.stats.tips") },
            { value: "0", label: t("home.stats.ads") },
            { value: "100%", label: t("home.stats.data") },
          ]}
        />
      </div>

      <section className={SHELL}>
        <div className="education-cta">
          <p className="eyebrow mb-3">{t("home.cta.eyebrow")}</p>
          <h2 className="font-display text-3xl text-balance tracking-tight text-foreground sm:text-4xl">
            {t("edu.cta.title")}
          </h2>
          <p className="font-body mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t("edu.cta.body")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="#tools" className="btn btn-solid min-h-11 px-6 text-sm">
              {t("edu.tool.pomodoroName")}
            </Link>
            <Link to="/dashboard" className="btn btn-ghost min-h-11 px-6 text-sm">
              {t("home.cta.dashboard")}
            </Link>
            <NextField
              to="health"
              toRoute="/health"
              label={t("field.next.education")}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Education;
