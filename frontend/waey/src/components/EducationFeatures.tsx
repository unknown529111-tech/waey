import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Trash2, Volume2, Download, CheckCircle2, XCircle, Sparkles, Brain, BookOpen, Lightbulb, Apple } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

/* ─── Pomodoro Timer ─── */

const PomodoroTimer = ({ t }: { t: (key: string) => string }) => {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setActive(false);
          setCycles((c) => c + 1);
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            gain.gain.value = 0.3;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          } catch { /* audio context may not be available */ }
          return 25 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const toggle = () => setActive((p) => !p);
  const reset = () => { setActive(false); setSeconds(25 * 60); };

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 border border-border text-center">
      <h3 className="font-bold text-lg mb-1">{t('eduFeatures.pomodoro.title')}</h3>
      <p className="text-xs text-muted-foreground mb-6">{t('eduFeatures.pomodoro.subtitle')}</p>
      <div className="text-5xl md:text-6xl font-bold tabular-nums text-primary mb-6" dir="ltr">
        {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <button onClick={toggle} className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-soft">
          {active ? <Pause className="size-5" /> : <Play className="size-5" />}
        </button>
        <button onClick={reset} className="size-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
          <RotateCcw className="size-5" />
        </button>
      </div>
      <div className="text-sm text-muted-foreground">
        {t('eduFeatures.pomodoro.cycles')} <span className="font-bold text-primary">{cycles}</span>
      </div>
    </div>
  );
};

/* ─── Brain Dump Box ─── */

const BrainDumpBox = ({ t }: { t: (key: string) => string }) => {
  const [text, setText] = useState("");

  const clear = () => {
    if (text.trim() && confirm(t('eduFeatures.brainDump.confirm'))) setText("");
    else if (!text.trim()) setText("");
  };

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="size-6 text-primary" />
        <div>
          <h3 className="font-bold text-lg">{t('eduFeatures.brainDump.title')}</h3>
          <p className="text-xs text-muted-foreground">{t('eduFeatures.brainDump.desc')}</p>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('eduFeatures.brainDump.placeholder')}
        className="w-full h-32 bg-muted/50 border border-border rounded-2xl p-4 text-sm resize-none outline-none focus:border-primary/40 transition-colors placeholder:text-muted-foreground"
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-muted-foreground">{text.length} {t('eduFeatures.brainDump.chars')}</span>
        <button onClick={clear} className="flex items-center gap-1.5 text-xs font-bold bg-destructive/10 text-destructive rounded-full px-4 py-2 hover:bg-destructive/20 transition-colors">
          <Trash2 className="size-3.5" />
          {t('eduFeatures.brainDump.clear')}
        </button>
      </div>
    </div>
  );
};

/* ─── Study Sound Player (MP3) ─── */

const STUDY_SOUNDS = [
  { id: "lofi-study", label: "📚 Lo-Fi Study", src: "/sounds/1 A.M Study Session 📚 [lofi hip hop] [lTRiuFIWV54].mp3" },
  { id: "jazz-study", label: "☕ Jazz & Coffee", src: "/sounds/Books, Coffee, & Jazz  1 Full Hour Jazz Favorites  Studying Music  Work Aid.mp3" },
  { id: "rain-study", label: "🌧️ Rain Study", src: "/sounds/study with me in rain   thunderstorm sound  1-hour pomodoro 2x25.mp3" },
];

const StudySoundPlayer = ({ t }: { t: (key: string) => string }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActiveId(null);
  }, []);

  const play = useCallback((id: string, src: string) => {
    if (activeId === id) { stop(); return; }
    stop();
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(() => {});
    audioRef.current = audio;
    setActiveId(id);
  }, [activeId, stop]);

  useEffect(() => () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } }, []);

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 border border-border">
      <h3 className="font-bold text-lg mb-1">{t('eduFeatures.soundPlayer.title')}</h3>
      <p className="text-xs text-muted-foreground mb-5">{t('eduFeatures.soundPlayer.subtitle')}</p>
      <div className="flex flex-col gap-3">
        {STUDY_SOUNDS.map((s) => (
          <button
            key={s.id}
            onClick={() => play(s.id, s.src)}
            className={`flex items-center gap-3 text-sm font-bold rounded-2xl px-5 py-4 transition-all text-right ${
              activeId === s.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {activeId === s.id ? <Volume2 className="size-5 shrink-0" /> : <Play className="size-5 shrink-0" />}
            <span className="flex-1">{s.label}</span>
            {activeId === s.id && (
              <span className="text-xs opacity-70">{t('eduFeatures.soundPlayer.pressToStop')}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Component ─── */

const EducationFeatures = () => {
  const t = useT();

  const cornellSteps = [
    { label: t('eduFeatures.cornell.steps.0.label'), desc: t('eduFeatures.cornell.steps.0.desc') },
    { label: t('eduFeatures.cornell.steps.1.label'), desc: t('eduFeatures.cornell.steps.1.desc') },
    { label: t('eduFeatures.cornell.steps.2.label'), desc: t('eduFeatures.cornell.steps.2.desc') },
  ];

  const examPrepDo = [
    t('eduFeatures.examPrep.do.0'),
    t('eduFeatures.examPrep.do.1'),
    t('eduFeatures.examPrep.do.2'),
    t('eduFeatures.examPrep.do.3'),
    t('eduFeatures.examPrep.do.4'),
  ];

  const examPrepDont = [
    t('eduFeatures.examPrep.dont.0'),
    t('eduFeatures.examPrep.dont.1'),
    t('eduFeatures.examPrep.dont.2'),
    t('eduFeatures.examPrep.dont.3'),
    t('eduFeatures.examPrep.dont.4'),
  ];

  const brainFoods = [
    { emoji: "🥜", name: t('eduFeatures.brainFood.items.0.name'), desc: t('eduFeatures.brainFood.items.0.desc') },
    { emoji: "🍫", name: t('eduFeatures.brainFood.items.1.name'), desc: t('eduFeatures.brainFood.items.1.desc') },
    { emoji: "🫐", name: t('eduFeatures.brainFood.items.2.name'), desc: t('eduFeatures.brainFood.items.2.desc') },
    { emoji: "🥚", name: t('eduFeatures.brainFood.items.3.name'), desc: t('eduFeatures.brainFood.items.3.desc') },
    { emoji: "🥑", name: t('eduFeatures.brainFood.items.4.name'), desc: t('eduFeatures.brainFood.items.4.desc') },
    { emoji: "🐟", name: t('eduFeatures.brainFood.items.5.name'), desc: t('eduFeatures.brainFood.items.5.desc') },
  ];

  const avoidFoods = [
    t('eduFeatures.avoidFoods.0'),
    t('eduFeatures.avoidFoods.1'),
    t('eduFeatures.avoidFoods.2'),
    t('eduFeatures.avoidFoods.3'),
  ];

  const groundingItems = [
    { n: "٥", label: t('eduFeatures.grounding.see') },
    { n: "٤", label: t('eduFeatures.grounding.touch') },
    { n: "٣", label: t('eduFeatures.grounding.hear') },
    { n: "٢", label: t('eduFeatures.grounding.smell') },
    { n: "١", label: t('eduFeatures.grounding.taste') },
  ];

  return (
    <section className="px-6 md:px-12 max-w-[1200px] mx-auto pb-16 space-y-12">

      {/* ─── Interactive Tools ─── */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          <Sparkles className="size-6" />
          {t('eduFeatures.interactiveTools')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <PomodoroTimer t={t} />
          <BrainDumpBox t={t} />
          <StudySoundPlayer t={t} />
        </div>
      </div>

      {/* ─── Note-Taking & Summarization ─── */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          <BookOpen className="size-6" />
          {t('eduFeatures.noteTaking')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Cornell Notes */}
          <div className="bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <span className="text-3xl mb-3">📓</span>
            <h3 className="font-bold text-lg mb-2">{t('eduFeatures.cornell.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {t('eduFeatures.cornell.desc')}
            </p>
            <div className="flex-1 space-y-3 bg-muted/40 rounded-2xl p-4 border border-border">
              {cornellSteps.map((s, i) => (
                <div key={i}>
                  <p className="text-sm font-bold">{s.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-bold bg-primary/10 text-primary rounded-full py-3 hover:bg-primary/20 transition-colors">
              <Download className="size-4" />
              {t('eduFeatures.cornell.download')}
            </button>
          </div>

          {/* Blurting */}
          <div className="bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <span className="text-3xl mb-3">💥</span>
            <h3 className="font-bold text-lg mb-2">{t('eduFeatures.blurting.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {t('eduFeatures.blurting.desc')}
            </p>
            <div className="flex-1 bg-primary/5 rounded-2xl p-5 border border-primary/15">
              <ol className="space-y-3 text-sm leading-relaxed">
                <li><span className="font-bold text-primary">١.</span> {t('eduFeatures.blurting.step1')}</li>
                <li><span className="font-bold text-primary">٢.</span> {t('eduFeatures.blurting.step2')}</li>
                <li><span className="font-bold text-primary">٣.</span> {t('eduFeatures.blurting.step3')}</li>
                <li><span className="font-bold text-primary">٤.</span> {t('eduFeatures.blurting.step4')}</li>
              </ol>
            </div>
          </div>

          {/* Interleaving */}
          <div className="bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <span className="text-3xl mb-3">🔄</span>
            <h3 className="font-bold text-lg mb-2">{t('eduFeatures.interleaving.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {t('eduFeatures.interleaving.desc')}
            </p>
            <div className="flex-1 bg-accent/10 rounded-2xl p-5 border border-accent/20">
              <p className="text-sm leading-relaxed">
                <span className="font-bold">{t('eduFeatures.interleaving.exampleLabel')}</span> {t('eduFeatures.interleaving.example')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Exam Anxiety ─── */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          <Lightbulb className="size-6" />
          {t('eduFeatures.examAnxiety')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Night Before Checklist */}
          <div className="bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1">
            <span className="text-3xl mb-3 block">🌙</span>
            <h3 className="font-bold text-lg mb-2">{t('eduFeatures.nightBefore.title')}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> {t('eduFeatures.nightBefore.doTitle')}
                </p>
                <ul className="space-y-1.5">
                  {examPrepDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                  <XCircle className="size-3.5" /> {t('eduFeatures.nightBefore.dontTitle')}
                </p>
                <ul className="space-y-1.5">
                  {examPrepDont.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-red-500 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 5-4-3-2-1 Grounding */}
          <div className="bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1">
            <span className="text-3xl mb-3 block">🧘‍♂️</span>
            <h3 className="font-bold text-lg mb-2">{t('eduFeatures.grounding.title')}</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              {t('eduFeatures.grounding.desc')}
            </p>
            <div className="space-y-2">
              {groundingItems.map((g, i) => (
                <div key={i} className="flex items-center gap-3 bg-primary/5 rounded-xl px-4 py-2.5">
                  <span className="size-8 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {g.n}
                  </span>
                  <span className="text-sm">{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reverse Engineering */}
          <div className="bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1">
            <span className="text-3xl mb-3 block">🕵️‍♂️</span>
            <h3 className="font-bold text-lg mb-2">{t('eduFeatures.reverse.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {t('eduFeatures.reverse.desc')}
            </p>
            <ol className="space-y-3 text-sm leading-relaxed">
              <li><span className="font-bold text-primary">١.</span> {t('eduFeatures.reverse.step1')}</li>
              <li><span className="font-bold text-primary">٢.</span> {t('eduFeatures.reverse.step2')}</li>
              <li><span className="font-bold text-primary">٣.</span> {t('eduFeatures.reverse.step3')}</li>
              <li><span className="font-bold text-primary">٤.</span> {t('eduFeatures.reverse.step4')}</li>
            </ol>
          </div>
        </div>
      </div>

      {/* ─── Study Environment ─── */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          <Apple className="size-6" />
          {t('eduFeatures.studyEnv')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Brain Food */}
          <div className="bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1">
            <span className="text-3xl mb-3 block">🥑</span>
            <h3 className="font-bold text-lg mb-2">{t('eduFeatures.brainFood.title')}</h3>
            <p className="text-xs text-muted-foreground mb-4">{t('eduFeatures.brainFood.desc')}</p>
            <div className="space-y-2 mb-4">
              {brainFoods.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span>{f.emoji}</span>
                  <span className="font-bold text-xs">{f.name}</span>
                  <span className="text-xs text-muted-foreground">— {f.desc}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs font-bold text-destructive mb-2">{t('eduFeatures.brainFood.avoidTitle')}</p>
              <ul className="space-y-1">
                {avoidFoods.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-destructive">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lighting & Space */}
          <div className="bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1">
            <span className="text-3xl mb-3 block">💡</span>
            <h3 className="font-bold text-lg mb-2">{t('eduFeatures.lighting.title')}</h3>
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-2xl p-4 border border-border">
                <p className="text-sm font-bold mb-1">{t('eduFeatures.lighting.item1.title')}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('eduFeatures.lighting.item1.desc')}</p>
              </div>
              <div className="bg-muted/40 rounded-2xl p-4 border border-border">
                <p className="text-sm font-bold mb-1">{t('eduFeatures.lighting.item2.title')}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('eduFeatures.lighting.item2.desc')}</p>
              </div>
              <div className="bg-muted/40 rounded-2xl p-4 border border-border">
                <p className="text-sm font-bold mb-1">{t('eduFeatures.lighting.item3.title')}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('eduFeatures.lighting.item3.desc')}</p>
              </div>
            </div>
          </div>

          {/* Focus Apps */}
          <div className="bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1">
            <span className="text-3xl mb-3 block">📱</span>
            <h3 className="font-bold text-lg mb-2">{t('eduFeatures.focusApps.title')}</h3>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              {t('eduFeatures.focusApps.desc')}
            </p>
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <span>🌳</span>
                  <p className="text-sm font-bold">Forest</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('eduFeatures.focusApps.forest.desc')}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <span>🍅</span>
                  <p className="text-sm font-bold">Focus To-Do</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('eduFeatures.focusApps.focusToDo.desc')}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <span>⚪</span>
                  <p className="text-sm font-bold">Offtime</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('eduFeatures.focusApps.offtime.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default EducationFeatures;
