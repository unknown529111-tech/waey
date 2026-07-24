import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Play, Pause, RotateCcw, Wind, Moon, Sun, Cloud } from "lucide-react";

type Soundscape = {
  id: string;
  label: string;
  icon: typeof Wind;
  color: string;
  freq: number;
};

const SOUNDSCAPES: Soundscape[] = [
  { id: "rain", label: "أمطار 🌧️", icon: Cloud, color: "text-blue-400", freq: 200 },
  { id: "ocean", label: "أمواج 🌊", icon: Moon, color: "text-cyan-400", freq: 300 },
  { id: "wind", label: "نسيم 🌬️", icon: Wind, color: "text-emerald-400", freq: 400 },
  { id: "sunset", label: "غروب 🌅", icon: Sun, color: "text-orange-400", freq: 500 },
];

const MEDITATION_TIMES = [2, 5, 10, 15];

export function GuidedMeditation() {
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [duration, setDuration] = useState(5 * 60);
  const [phase, setPhase] = useState<"idle" | "breathing" | "done">("idle");
  const [activeSound, setActiveSound] = useState(SOUNDSCAPES[0]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= duration) {
            setPlaying(false);
            setPhase("done");
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, duration]);

  const start = () => {
    setSeconds(0);
    setPhase("breathing");
    setPlaying(true);
  };

  const stop = () => {
    setPlaying(false);
    setPhase("idle");
    setSeconds(0);
  };

  const togglePlay = () => {
    if (phase === "idle") start();
    else setPlaying(!playing);
  };

  const progress = duration > 0 ? (seconds / duration) * 100 : 0;
  const remain = duration - seconds;
  const mins = Math.floor(remain / 60);
  const secs = remain % 60;

  const breathPhase = seconds % 8;
  const isInhale = breathPhase < 4;

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm" dir="rtl">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Headphones className="size-5 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold">التأمل guided والاسترخاء</h2>
          <p className="text-xs text-muted-foreground">جلسات تأمل قصيرة مع sounds مهدئة</p>
        </div>
      </div>

      {/* Soundscape Selection */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {SOUNDSCAPES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSound(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSound.id === s.id
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <s.icon className={`size-3.5 ${s.color}`} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Duration Selection */}
      {phase === "idle" && (
        <div className="flex gap-2 mb-4">
          {MEDITATION_TIMES.map((t) => (
            <button
              key={t}
              onClick={() => setDuration(t * 60)}
              className={`flex-1 h-10 rounded-full text-xs font-bold transition-all ${
                duration === t * 60
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t} د
            </button>
          ))}
        </div>
      )}

      {/* Meditation Timer */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-500/5 to-transparent border border-indigo-500/10 text-center">
        <div className="relative size-32 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={phase === "done" ? "hsl(var(--primary))" : "#6366F1"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {phase === "done" ? (
              <span className="text-2xl">🧘</span>
            ) : phase === "breathing" ? (
              <motion.span
                key={isInhale ? "inhale" : "exhale"}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: isInhale ? 1.2 : 0.8, opacity: 1 }}
                transition={{ duration: 4 }}
                className="text-3xl"
              >
                {isInhale ? "🌬️" : "💨"}
              </motion.span>
            ) : (
              <Headphones className="size-8 text-indigo-400" />
            )}
          </div>
        </div>

        {phase !== "idle" && (
          <div className="text-3xl font-bold text-indigo-500 tabular-nums mb-2" dir="ltr">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
        )}

        {phase === "breathing" && (
          <p className="text-xs text-indigo-400 font-bold mb-3">
            {isInhale ? "شهيق..." : "زفير..."}
          </p>
        )}

        {phase === "done" && (
          <p className="text-xs text-primary font-bold mb-3">أحسنت! 🎉 اشتغلت على نفسك 👍</p>
        )}

        {phase === "idle" && (
          <p className="text-xs text-muted-foreground mb-4">اختر المدة المناسبة وابدأ</p>
        )}

        <div className="flex items-center justify-center gap-3">
          {phase !== "done" ? (
            <button
              onClick={togglePlay}
              className="size-12 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 hover:scale-105 transition-all shadow-md"
            >
              {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            </button>
          ) : (
            <button
              onClick={stop}
              className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 hover:scale-105 transition-all shadow-md"
            >
              <RotateCcw className="size-5" />
            </button>
          )}
          {playing && (
            <button
              onClick={stop}
              className="size-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-muted/80 transition-all"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-bold">
          🧘 4-4-4-4: شهيق 4ث - احبس 4ث - زفير 4ث - انتظر 4ث
        </span>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-bold">
          🔊 {activeSound.label}
        </span>
      </div>
    </div>
  );
}