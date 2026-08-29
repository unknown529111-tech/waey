import { useStreak } from "@/hooks/useStreak";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/useLanguage";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, ShieldAlert } from "lucide-react";
import { getStreakFreezes } from "@/lib/streak";

export function StreakDisplay() {
  const { isAuthenticated } = useAuth();
  const { lang, t } = useLanguage();
  const { count, newStreakFlash, prizeWinner } = useStreak();
  const freezes = getStreakFreezes();

  if (!isAuthenticated) return null;

  return (
    <>
      <AnimatePresence>
        {newStreakFlash && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-l from-warning/90 to-warning/90 text-white px-6 py-3 rounded-full shadow-float-lg flex items-center gap-3 text-sm font-bold"
          >
            <Flame className="size-5" />
            <span> {t('streak.flash')} {count} {t('streak.points')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 left-6 z-40 flex flex-col items-center gap-2">
        <div className="card shadow-soft px-4 py-3 flex items-center gap-3">
          <div className="relative">
            <Flame className="size-6 text-warning" />
            <motion.div
              className="absolute inset-0 size-6"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame className="size-6 text-warning/40" />
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

          {freezes > 0 && (
            <div className="size-7 rounded-full bg-muted text-foreground flex items-center justify-center text-xs font-bold mr-1" title={`${freezes} تجميد حماية متاح`}>
              <ShieldAlert className="size-3.5" />
            </div>
          )}
        </div>

        <AnimatePresence>
          {count >= 100 && !prizeWinner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-l from-warning/20 to-warning/20 border border-warning/30 rounded-card px-4 py-2 flex items-center gap-2 shadow-soft"
            >
              <Trophy className="size-4 text-warning" />
              <span className="text-xs font-bold text-warning dark:text-warning-bright">
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
