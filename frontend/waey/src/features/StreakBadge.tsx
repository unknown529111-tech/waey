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
      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground border border-secondary/40 rounded-full px-4 py-1.5 shadow-sm"
    >
      <Flame className="size-4" />
      <span className="font-bold text-sm tabular-nums">
        {streak.count} {t('streak.points')}
      </span>
    </motion.div>
  );
};

export default StreakBadge;
