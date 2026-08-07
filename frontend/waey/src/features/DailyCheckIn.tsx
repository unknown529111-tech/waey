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
      className={`ledger p-5 ${!checkedIn ? "cursor-pointer" : ""}`}
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
            checkedIn ? "bg-moss/15 text-primary" : "bg-secondary/20 text-secondary"
          }`}
        >
          {checkedIn ? (
            <CheckCircle2 className="size-7" />
          ) : (
            <Sparkles className="size-7" />
          )}
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold text-base">{t('checkin.title')}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {checkedIn ? t('checkin.done') : t('checkin.cta')}
          </p>
          {!checkedIn && (
            <p className="text-[11px] text-secondary mt-1 font-medium">
              {t('checkin.subtitle')}
            </p>
          )}
        </div>
        {!checkedIn && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="size-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg shadow-sm"
          >
            +10
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
