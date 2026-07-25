import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { getStreakState as getStreak } from "@/lib/streak";
import { useEffect, useState } from "react";
import { useT } from "@/contexts/useLanguage";

const StreakBadge = () => {
  const t = useT();
  const [streak, setStreak] = useState(getStreak());

  useEffect(() => {
    const onStorage = () => { setStreak(getStreak()); };
    window.addEventListener("storage", onStorage);
    const t = setInterval(onStorage, 2000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(t); };
  }, []);

  if (streak.count <= 0) return null;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-2 bg-gradient-to-l from-accent/20 to-accent/5 border border-accent/30 rounded-full px-4 py-2"
    >
      <Flame className="size-5 text-accent" />
      <span className="font-bold text-sm text-accent tabular-nums">
        {streak.count} {t('streak.points')}
      </span>
    </motion.div>
  );
};

export default StreakBadge;
