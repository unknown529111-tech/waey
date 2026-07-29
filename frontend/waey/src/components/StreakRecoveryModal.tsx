import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, X, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { getStreak, restoreStreak } from "@/lib/dailyStorage";
import { getUserPoints } from "@/lib/gamification";
import { toast } from "sonner";
import { useT } from "@/contexts/useLanguage";

interface StreakRecoveryModalProps {
  open: boolean;
  onClose: () => void;
  onRestored?: () => void;
}

export function StreakRecoveryModal({ open, onClose, onRestored }: StreakRecoveryModalProps) {
  const [streak, setStreak] = useState(getStreak());
  const [points, setPoints] = useState(getUserPoints());
  const [loading, setLoading] = useState(false);
  const t = useT();

  useEffect(() => {
    if (open) {
      setStreak(getStreak());
      setPoints(getUserPoints());
    }
  }, [open]);

  if (!open) return null;

  const COST = 50;
  const canAfford = points >= COST;

  const handleRestore = async () => {
    setLoading(true);
    try {
      const success = restoreStreak();
      if (success) {
        toast.success(t('streakRecovery.success'));
        setStreak(getStreak());
        setPoints(getUserPoints());
        onRestored?.();
        setTimeout(() => onClose(), 800);
      } else {
        toast.error(t('streakRecovery.noPoints'));
      }
    } catch {
      toast.error(t('streakRecovery.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-card border border-border/60 rounded-3xl p-6 shadow-float overflow-hidden"
          dir="rtl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="size-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{t('streakRecovery.title')}</h2>
              <p className="text-xs text-muted-foreground">{t('streakRecovery.desc')}</p>
            </div>
          </div>

          {/* Streak Status Box */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-3 mb-5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">{t('streakRecovery.currentStreak')}</span>
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="size-4" />
                {t('streakRecovery.days', { count: streak.count })}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">{t('streakRecovery.yourPoints')}</span>
              <span className="inline-flex items-center gap-1 text-primary">
                <Sparkles className="size-4" />
                {t('streakRecovery.points', { count: points })}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold border-t border-border/40 pt-2">
              <span className="text-muted-foreground">{t('streakRecovery.costLabel')}</span>
              <span className="text-amber-600 font-extrabold">{t('streakRecovery.cost', { cost: COST })}</span>
            </div>
          </div>

          {/* Info / Warning Callout */}
          {!canAfford ? (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2 mb-5">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{t('streakRecovery.insufficient', { diff: COST - points })}</span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-start gap-2 mb-5">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
              <span>{t('streakRecovery.sufficient')}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestore}
              disabled={!canAfford || loading}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-moss disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RotateCcw className="size-4" />
              {loading ? t('streakRecovery.recovering') : t('streakRecovery.recover', { cost: COST })}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-2xl border border-border text-sm font-bold hover:bg-muted transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}