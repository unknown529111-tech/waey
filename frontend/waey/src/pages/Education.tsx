import { BookOpen, Brain, Compass, Lightbulb, Timer } from "lucide-react";
import { useT, useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect, useRef, useState, type CSSProperties } from "react";

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
          <div
            key={s.id}
            className={`sound-opt${sel === s.id ? " selected" : ""}`}
            onClick={() => setSel(s.id)}
          >
            <div className="s-title">{t(s.titleKey)}</div>
            <div className="s-sub">{t(s.subKey)}</div>
          </div>
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
          <div
            key={i}
            className={`vark-opt${sel === i ? " selected" : ""}`}
            onClick={() => setSel(i)}
          >
            {t(k)}
          </div>
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

const Education = () => {
  const t = useT();
  const { lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "education" });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
  }, []);

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

  const lostTips = [
    t('edu.lostTips.0'), t('edu.lostTips.1'), t('edu.lostTips.2'),
    t('edu.lostTips.3'), t('edu.lostTips.4'), t('edu.lostTips.5'),
  ];

  return (
    <div className="relative min-h-[60vh]" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="field-hero-media">
        <video
          className="field-video-bg"
          ref={videoRef}
          src={EDUCATION_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="field-video-overlay" aria-hidden="true" />

        <header className="field-hero">
          <p className="field-eyebrow">{t("edu.heroEyebrow")}</p>
          <h1 className="field-title">{t("edu.heroTitle1")}<em>{t("edu.heroTitle2")}</em></h1>
          <p className="field-desc">
            {t("edu.heroDesc")}
          </p>
        </header>
      </div>

       <section className="field-section">
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

       <section className="field-section">
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

       <section className="field-section">
         <div className="field-section-head">
           <p className="field-section-kicker">{t("edu.sec.style.kicker")}</p>
           <h2 className="field-section-title">{t("edu.sec.style.title1")}<em>{t("edu.sec.style.title2")}</em></h2>
           <p className="field-section-sub">{t("edu.sec.style.sub")}</p>
         </div>
         <VarkSampleTool />
       </section>

       <section className="field-section">
         <div className="field-section-head">
           <p className="field-section-kicker">{t("edu.sec.lost.kicker")}</p>
           <h2 className="field-section-title">{t("edu.sec.lost.title1")}<em>{t("edu.sec.lost.title2")}</em></h2>
           <p className="field-section-sub">{t("edu.sec.lost.sub")}</p>
         </div>
       </section>
      <div className="feature-grid">
        {lostTips.map((tip, i) => (
          <div className="feature" key={i} style={{ "--i": i } as CSSProperties}>
            <h3>{String(i + 1).padStart(2, "0")}</h3>
            <p>{tip}</p>
          </div>
        ))}
      </div>

       <section className="field-section">
         <div className="field-section-head">
           <p className="field-section-kicker">{t("edu.sec.tools.kicker")}</p>
           <h2 className="field-section-title">{t("edu.sec.tools.title1")}<em>{t("edu.sec.tools.title2")}</em></h2>
           <p className="field-section-sub">{t("edu.sec.tools.sub")}</p>
         </div>
         <PomodoroTool />
         <BrainDumpTool />
         <SoundSessionsTool />
       </section>

       <section className="field-section">
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
               <label>{t("edu.tool.cornell.notes")}</label>
               <textarea placeholder={t("edu.tool.cornell.notesPh")} />
             </div>
             <div className="c-box">
               <label>{t("edu.tool.cornell.cue")}</label>
               <textarea placeholder={t("edu.tool.cornell.cuePh")} />
             </div>
             <div className="c-box c-summary">
               <label>{t("edu.tool.cornell.summary")}</label>
               <textarea placeholder={t("edu.tool.cornell.summaryPh")} />
             </div>
           </div>
         </div>
       </section>

       <section className="closing">
         <p>{t("edu.closingTitle")}</p>
         <p className="small">
           {t("edu.closingText")}
         </p>
       </section>
    </div>
  );
};

export default Education;
