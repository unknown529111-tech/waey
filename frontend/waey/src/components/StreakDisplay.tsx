import { useStreak } from "@/hooks/useStreak";
import { useAuth } from "@/contexts/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Zap } from "lucide-react";

export function StreakDisplay() {
  const { isAuthenticated } = useAuth();
  const { lang, t } = useLanguage();
  const { count, accumulated, newStreakFlash, prizeWinner, lastStreakDate } = useStreak();

  if (!isAuthenticated) return null;

  const today = new Date().toISOString().slice(0, 10);
  const earnedToday = lastStreakDate === today;
  const progress = Math.min((accumulated / 300_000) * 100, 100);

  return (
    <>
      <AnimatePresence>
        {newStreakFlash && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-l from-amber-500/90 to-orange-500/90 text-white px-6 py-3 rounded-full shadow-float-lg flex items-center gap-3 text-sm font-bold"
          >
            <Flame className="size-5" />
            <span> {t('streak.flash')} {count} {t('streak.points')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 left-6 z-40 flex flex-col items-center gap-2">
        <div className="bg-card border border-border/50 rounded-[2rem] shadow-soft px-4 py-3 flex items-center gap-3">
          <div className="relative">
            <Flame className="size-6 text-orange-500" />
            <motion.div
              className="absolute inset-0 size-6"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame className="size-6 text-orange-500/40" />
            </motion.div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground leading-none">{count}</span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-wide">
              <AnimatePresence mode="wait">
                <motion.span
                  key={lang}
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {t('streak.points')}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </div>

        {!earnedToday && (
          <div className="w-full bg-card border border-border/50 rounded-full shadow-soft p-1">
            <div className="flex items-center gap-2 px-2">
              <Zap className="size-3 text-amber-500 shrink-0" />
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-l from-amber-500 to-orange-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {count >= 100 && !prizeWinner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-l from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-[2rem] px-4 py-2 flex items-center gap-2 shadow-soft"
            >
              <Trophy className="size-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lang}
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 12, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    {t('streak.winner')}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
