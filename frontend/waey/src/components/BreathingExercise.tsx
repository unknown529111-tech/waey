import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { recordActivity } from "@/lib/gamification";

const PHASES = [
  { labelKey: "breathing.inhale", dur: 4, color: "bg-primary/20 border-primary" },
  { labelKey: "breathing.hold", dur: 4, color: "bg-accent/20 border-accent" },
  { labelKey: "breathing.exhale", dur: 6, color: "bg-destructive/10 border-destructive/40" },
];

const BreathingExercise = () => {
  const t = useT();
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number>(0);
  const startRef = useRef(0);
  const cyclesRef = useRef(0);
  const rewardedRef = useRef(false);

  const stop = useCallback(() => {
    setActive(false);
    setPhaseIdx(0);
    setProgress(0);
    cancelAnimationFrame(timerRef.current);
    if (cyclesRef.current >= 1 && !rewardedRef.current) {
      rewardedRef.current = true;
      recordActivity("breathing");
    }
    cyclesRef.current = 0;
  }, []);

  useEffect(() => {
    if (!active) return;
    const phase = PHASES[phaseIdx];
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startRef.current) / 1000;
      const pct = Math.min(1, elapsed / phase.dur);
      setProgress(pct);

      if (pct >= 1) {
        const next = (phaseIdx + 1) % PHASES.length;
        setPhaseIdx(next);
        setProgress(0);
        if (next === 0) cyclesRef.current += 1;
      }

      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(timerRef.current);
  }, [active, phaseIdx]);

  const phase = PHASES[phaseIdx];

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 text-center">
      <h3 className="font-bold text-lg mb-2">{t('breathing.title')}</h3>
      <p className="text-sm text-muted-foreground mb-6">
        {t('breathing.subtitle')}
      </p>

      <div className="flex items-center justify-center mb-6">
        <motion.div
          animate={
            active
              ? {
                  scale: phaseIdx === 0 ? [1, 1.25] : phaseIdx === 2 ? [1.25, 1] : 1.25,
                }
              : {}
          }
          transition={
            active
              ? {
                  duration: phase.dur,
                  ease: "easeInOut",
                  repeat: phaseIdx === 0 ? Infinity : phaseIdx === 2 ? Infinity : 0,
                  repeatDelay: 0,
                }
              : {}
          }
          className={`size-36 md:size-44 rounded-full border-2 flex items-center justify-center transition-colors ${phase.color}`}
        >
          <div>
            <div className="text-2xl font-bold">{t(phase.labelKey)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.ceil(phase.dur * (1 - progress))} {t('breathing.seconds')}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6 max-w-xs mx-auto">
        <div
          className="h-full bg-primary transition-all duration-200 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            if (!active) { rewardedRef.current = false; cyclesRef.current = 0; }
            setActive((p) => !p);
          }}
          className="inline-flex items-center gap-1.5 text-sm font-bold bg-primary text-primary-foreground rounded-full px-6 py-2.5 hover:bg-primary/90 transition-colors"
        >
          {active ? <Pause className="size-4" /> : <Play className="size-4" />}
          {active ? t('breathing.stop') : t('breathing.start')}
        </button>
        {active && (
          <button
            onClick={stop}
            className="size-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
            aria-label={t('breathing.reset')}
          >
            <RotateCcw className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
