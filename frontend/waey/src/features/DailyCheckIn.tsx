import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { getDailyValue, setDailyValue, todayKey } from "@/lib/dailyStorage";
import { bumpStreak } from "@/lib/streak";
import { addPoints } from "@/lib/gamification";
import { toast } from "sonner";

const CHECKIN_KEY = "waey_checkin";

export function DailyCheckIn() {
  const t = useT();
  const [checkedIn, setCheckedIn] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setCheckedIn(getDailyValue(CHECKIN_KEY) === 1);
  }, []);

  const handleCheckIn = () => {
    if (checkedIn) return;
    setDailyValue(CHECKIN_KEY, 1);
    bumpStreak();
    addPoints(10);
    setCheckedIn(true);
    setAnimating(true);
    toast.success(t('checkin.toast'));
    setTimeout(() => setAnimating(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-5 border transition-all ${
        checkedIn
          ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 border-green-200 dark:border-green-800/30"
          : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200 dark:border-amber-800/30 cursor-pointer hover:shadow-float-lg hover:-translate-y-0.5 active:scale-[0.98]"
      } transition-all duration-300`}
      onClick={checkedIn ? undefined : handleCheckIn}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCheckIn(); }}
      dir="rtl"
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={animating ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className={`size-14 rounded-full flex items-center justify-center shrink-0 ${
            checkedIn
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-amber-100 dark:bg-amber-900/30"
          }`}
        >
          {checkedIn ? (
            <CheckCircle2 className="size-7 text-green-600 dark:text-green-400" />
          ) : (
            <Sparkles className="size-7 text-amber-600 dark:text-amber-400" />
          )}
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold text-base">{t('checkin.title')}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {checkedIn ? t('checkin.done') : t('checkin.cta')}
          </p>
          {!checkedIn && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
              {t('checkin.subtitle')}
            </p>
          )}
        </div>
        {!checkedIn && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="size-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm"
          >
            +10
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
