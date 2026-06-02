import { Flame, Snowflake } from "lucide-react";
import { motion } from "framer-motion";
import { getStreak } from "@/lib/dailyStorage";
import { useEffect, useState } from "react";
import { getFreezeCount } from "./useFreeze";

const StreakBadge = () => {
  const [streak, setStreak] = useState(getStreak());
  const [freezes, setFreezes] = useState(getFreezeCount());

  useEffect(() => {
    const onStorage = () => { setStreak(getStreak()); setFreezes(getFreezeCount()); };
    window.addEventListener("storage", onStorage);
    const t = setInterval(onStorage, 2000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(t); };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-2 bg-gradient-to-l from-accent/20 to-accent/5 border border-accent/30 rounded-full px-4 py-2"
      >
        <Flame className="size-5 text-accent" />
        <span className="font-bold text-sm text-accent">
          {streak.count > 0 ? `${streak.count} يوم متتالي` : "ابدأ سلسلتك اليوم"}
        </span>
      </motion.div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-2 border border-border">
        <Snowflake className="size-3.5" />
        <span className="tabular-nums">{freezes}/3</span>
      </div>
    </div>
  );
};

export default StreakBadge;
