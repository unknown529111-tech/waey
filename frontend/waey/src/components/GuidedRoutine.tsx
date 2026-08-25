import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Sunrise, MoonStar, Volume2, VolumeX } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { recordActivity } from "@/lib/gamification";
import { trackEvent } from "@/lib/analytics";

type Routine = "morning" | "evening";

type Phase = { labelKey: string; promptKey: string; dur: number };

const MORNING: Phase[] = [
  { labelKey: "routine.morning.settle", promptKey: "routine.morning.settlePrompt", dur: 45 },
  { labelKey: "routine.morning.breath", promptKey: "routine.morning.breathPrompt", dur: 60 },
  { labelKey: "routine.morning.gratitude", promptKey: "routine.morning.gratitudePrompt", dur: 90 },
  { labelKey: "routine.morning.intention", promptKey: "routine.morning.intentionPrompt", dur: 60 },
];

const EVENING: Phase[] = [
  { labelKey: "routine.evening.settle", promptKey: "routine.evening.settlePrompt", dur: 45 },
  { labelKey: "routine.evening.breath", promptKey: "routine.evening.breathPrompt", dur: 60 },
  { labelKey: "routine.evening.reflect", promptKey: "routine.evening.reflectPrompt", dur: 90 },
  { labelKey: "routine.evening.release", promptKey: "routine.evening.releasePrompt", dur: 60 },
];

const GuidedRoutine = () => {
  const t = useT();
  const [routine, setRoutine] = useState<Routine>("morning");
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState(true);
  const timerRef = useRef<number>(0);
  const startRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const rewardedRef = useRef(false);

  const phases = routine === "morning" ? MORNING : EVENING;

  const chime = useCallback(() => {
    if (!sound) return;
    try {
      if (!audioRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioRef.current = new Ctx();
      }
      const ctx = audioRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = phaseIdx === phases.length - 1 ? 880 : 660;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {
      /* audio unsupported, ignore */
    }
  }, [sound, phaseIdx, phases.length]);

  const stop = useCallback(() => {
    setActive(false);
    setPhaseIdx(0);
    setProgress(0);
    cancelAnimationFrame(timerRef.current);
    if (rewardedRef.current) {
      rewardedRef.current = false;
      recordActivity("breathing");
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const phase = phases[phaseIdx];
    startRef.current = performance.now();
    chime();

    const tick = (now: number) => {
      const elapsed = (now - startRef.current) / 1000;
      const pct = Math.min(1, elapsed / phase.dur);
      setProgress(pct);

      if (pct >= 1) {
        const next = phaseIdx + 1;
        if (next >= phases.length) {
          setActive(false);
          setPhaseIdx(0);
          setProgress(0);
          rewardedRef.current = true;
          recordActivity("breathing");
          return;
        }
        setPhaseIdx(next);
        setProgress(0);
      }

      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(timerRef.current);
  }, [active, phaseIdx, phases, chime]);

  const pickRoutine = (r: Routine) => {
    stop();
    setRoutine(r);
  };

  const phase = phases[phaseIdx];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-16">
      <div className="bg-card border border-border/50 rounded-[2rem] p-6 md:p-10 shadow-soft text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {routine === "morning" ? <Sunrise className="size-6 text-accent" /> : <MoonStar className="size-6 text-primary" />}
          <h2 className="section-title text-2xl md:text-3xl">{t(`routine.${routine}.title`)}</h2>
        </div>
        <p className="text-muted-foreground mb-8 max-w-[55ch] mx-auto leading-relaxed">
          {t(`routine.${routine}.subtitle`)}
        </p>

        <div className="flex gap-2 mb-10 justify-center flex-wrap">
          {(["morning", "evening"] as Routine[]).map((r) => (
            <button
              key={r}
              onClick={() => pickRoutine(r)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 ${
                routine === r ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {r === "morning" ? <Sunrise className="size-4" /> : <MoonStar className="size-4" />}
              {t(`routine.${r}.tab`)}
            </button>
          ))}
        </div>

        <div className="max-w-sm mx-auto">
          <div className="mb-8">
            <motion.div
              key={`${routine}-${phaseIdx}`}
              initial={{ scale: active ? 0.85 : 1, opacity: 0.6 }}
              animate={{ scale: active ? [0.85, 1.15, 0.85] : 1, opacity: 1 }}
              transition={active ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : {}}
              className="size-40 rounded-full border-4 border-primary/40 bg-primary/10 mx-auto flex items-center justify-center mb-6"
            >
              <div className="size-28 rounded-full border-2 border-accent/50 bg-accent/10 flex items-center justify-center p-4">
                <span className="text-sm font-bold leading-snug">{active ? t(phase.labelKey) : "—"}</span>
              </div>
            </motion.div>

            <div className="h-2 rounded-full bg-secondary overflow-hidden mb-3">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress * 100}%` }} />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed min-h-[3.5rem]">
              {active ? t(phase.promptKey) : t('routine.idle')}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => {
                trackEvent("routine_start", { routine });
                setActive((v) => !v);
              }}
              className="btn btn-moss font-body px-8 py-3 text-sm flex items-center gap-2 hover:scale-[1.03] transition-transform"
            >
              {active ? <Pause className="size-4" /> : <Play className="size-4" />}
              {active ? t('routine.pause') : t('routine.start')}
            </button>
            <button
              onClick={() => { stop(); }}
              className="px-4 py-3 rounded-full text-xs font-bold bg-secondary text-foreground hover:bg-muted flex items-center gap-1.5 transition-all duration-300"
            >
              <RotateCcw className="size-3.5" />
              {t('routine.reset')}
            </button>
            <button
              onClick={() => setSound((s) => !s)}
              aria-label={t('routine.sound')}
              className="size-11 rounded-full bg-secondary text-foreground hover:bg-muted flex items-center justify-center transition-all duration-300"
            >
              {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuidedRoutine;