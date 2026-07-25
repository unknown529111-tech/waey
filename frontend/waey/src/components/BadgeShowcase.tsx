import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Lock, Sparkles, Share2, Check, Coins, ShieldAlert, RotateCcw, Download } from "lucide-react";
import {
  BADGES,
  getUnlockedBadgeIds,
  getUserPoints,
  getUserStats,
  getEffectiveStreakCount,
  deductPoints,
  type Badge,
} from "@/lib/gamification";
import { getStreakFreezes, addStreakFreeze, getDailyValue } from "@/lib/dailyStorage";
import { StreakRecoveryModal } from "@/components/StreakRecoveryModal";
import { generateAchievementsShareText, shareContent, downloadBlob, generateBadgesPDF } from "@/lib/share";
import { toast } from "sonner";

// Maps each badge category to an emoji, title, and Arabic label generator.
const CATEGORY_ORDER: { id: Badge["category"]; icon: string; title: string }[] = [
  { id: "streak", icon: "🔥", title: "أوسمة التتابع (Streak)" },
  { id: "water", icon: "💧", title: "أوسمة المياه" },
  { id: "mindfulness", icon: "🧘", title: "أوسمة الوعي والتأمل" },
  { id: "finance", icon: "💰", title: "وسام الوعي المالي" },
  { id: "challenge", icon: "🌟", title: "وسام التحديات" },
];

// Returns 0..1 progress toward unlocking the given badge based on live stats.
function badgeProgress(b: Badge): number {
  const streak = getEffectiveStreakCount();
  const stats = getUserStats();
  const todayWater = getDailyValue("water");
  switch (b.id) {
    case "first_step":
      return streak >= 1 || stats.totalWaterCups > 0 || stats.gratitudeDone > 0 ? 1 : 0;
    case "streak_7":
      return Math.min(streak / 7, 1);
    case "streak_30":
      return Math.min(streak / 30, 1);
    case "streak_100":
      return Math.min(streak / 100, 1);
    case "water_8":
      return Math.min(todayWater / 8, 1);
    case "water_100":
      return Math.min(stats.totalWaterCups / 100, 1);
    case "breathing_peace":
      return stats.breathingDone >= 1 ? 1 : 0;
    case "gratitude_heart":
      return stats.gratitudeDone >= 1 ? 1 : 0;
    case "finance_wise":
      return Math.min(stats.totalExpensesCount / 5, 1);
    case "challenge_hero":
      return Math.min(stats.totalChallengesDone / 5, 1);
    default:
      return 0;
  }
}

// Arabic description of the action required to unlock this badge.
function progressLabel(b: Badge): string {
  switch (b.id) {
    case "first_step":
      return "أول نشاط";
    case "streak_7":
      return "7 أيام";
    case "streak_30":
      return "30 يوماً";
    case "streak_100":
      return "100 يوم";
    case "water_8":
      return "8 أكواب / يوم";
    case "water_100":
      return "100 كوب إجمالاً";
    case "breathing_peace":
      return "تمرين تنفس";
    case "gratitude_heart":
      return "تدوين امتنان";
    case "finance_wise":
      return "5 مصروفات";
    case "challenge_hero":
      return "5 تحديات";
    default:
      return b.description;
  }
}

export function BadgeShowcase() {
  const [unlockedIds, setUnlockedIds] = useState(() => getUnlockedBadgeIds());
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [copied, setCopied] = useState(false);
  const [points, setPoints] = useState(() => getUserPoints());
  const [freezes, setFreezes] = useState(() => getStreakFreezes());
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      setUnlockedIds(getUnlockedBadgeIds());
      setPoints(getUserPoints());
      const names = detail.map((id) => BADGES.find((b) => b.id === id)?.title || id);
      toast.success(`🎉 أوسمة جديدة: ${names.join("، ")}`);
    };
    window.addEventListener("waey-badges-updated", handler);
    return () => window.removeEventListener("waey-badges-updated", handler);
  }, []);

  const handleBuyFreeze = () => {
    if (deductPoints(50)) {
      addStreakFreeze(1);
      setPoints(getUserPoints());
      setFreezes(getStreakFreezes());
    }
  };

  const handleShare = (badge: Badge) => {
    const text = `🏆 حققت إنجاز "${badge.title}" (${badge.emoji}) في منصة وعي (Waey)! ${badge.description}`;
    if (navigator.share) {
      navigator.share({ title: badge.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareAll = async () => {
    try {
      const text = generateAchievementsShareText();
      const success = await shareContent({ title: "إنجازاتي في وعي", text });
      toast.success(success ? "تم نسخ الإنجازات للمشاركة" : "تم النسخ للحافظة");
    } catch {
      toast.error("فشل النسخ");
    }
  };

  const handleDownloadBadgesPDF = async () => {
    try {
      const blob = generateBadgesPDF();
      const dateStr = new Date().toISOString().split("T")[0];
      downloadBlob(blob, `waey-badges-${dateStr}.pdf`);
      toast.success("تم تحميل الأوسمة كـ PDF");
    } catch {
      toast.error("فشل إنشاء PDF");
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm mb-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Award className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">لوحة الأوسمة والإنجازات</h2>
            <p className="text-xs text-muted-foreground">
              تم فتح {unlockedIds.length} من {BADGES.length} أوسمة
            </p>
          </div>
        </div>

        {/* Points & Freeze Shop */}
        <div className="flex items-center gap-3 bg-muted/50 p-2 px-4 rounded-full border border-border/40 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Coins className="size-4" />
            <span>{points} نقطة</span>
          </div>

          <div className="h-4 w-px bg-border/60" />

          <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400">
            <ShieldAlert className="size-4" />
            <span>{freezes} تجميد</span>
          </div>

          {points >= 50 && (
            <button
              onClick={handleBuyFreeze}
              className="h-7 px-3 rounded-full bg-cyan-600 text-white text-[11px] font-bold hover:bg-cyan-700 transition-all shadow-sm flex items-center gap-1 mr-1"
            >
              شراء تجميد (50 ن)
            </button>
          )}

          <button
            onClick={() => setRecoveryOpen(true)}
            className="h-7 px-3 rounded-full bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 transition-all shadow-sm flex items-center gap-1 mr-1"
          >
            <RotateCcw className="size-3" />
            استعادة السلسلة (50 ن)
          </button>

          <button
            onClick={handleShareAll}
            className="h-7 px-3 rounded-full bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 transition-all shadow-sm flex items-center gap-1 mr-1"
          >
            <Share2 className="size-3" />
            مشاركة الكل
          </button>

          <button
            onClick={handleDownloadBadgesPDF}
            className="h-7 px-3 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold hover:bg-secondary/80 transition-all shadow-sm flex items-center gap-1"
          >
            <Download className="size-3" />
            PDF الأوسمة
          </button>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {BADGES.map((b) => {
          const isUnlocked = unlockedIds.includes(b.id);

          return (
            <motion.div
              key={b.id}
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => setSelectedBadge(b)}
              className={`cursor-pointer p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[140px] relative ${
                isUnlocked
                  ? "bg-gradient-to-b from-card to-amber-500/5 border-amber-500/30 shadow-sm"
                  : "bg-muted/30 border-border/40 opacity-60 hover:opacity-80"
              }`}
            >
              <div className="relative mb-2">
                <span className="text-3xl filter drop-shadow-sm">{b.emoji}</span>
                {!isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full p-1 shadow-sm">
                    <Lock className="size-3 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold mb-1 truncate max-w-[110px]">{b.title}</h3>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                  {b.description}
                </p>
              </div>

              {isUnlocked && (
                <span className="mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  مفتوح ✨
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* How to Earn Badges Guide — live progress pulled from real stats */}
      <div className="mt-6 pt-5 border-t border-border/40">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500" />
          كيف تكسب الأوسمة؟
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORY_ORDER.map((cat) => {
            const items = BADGES.filter((b) => b.category === cat.id);
            return (
              <div key={cat.id} className="p-3.5 rounded-2xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{cat.icon}</span>
                  <h4 className="text-xs font-bold">{cat.title}</h4>
                </div>
                <ul className="space-y-1.5">
                  {items.map((b) => {
                    const done = unlockedIds.includes(b.id);
                    const pct = Math.min(100, Math.round(badgeProgress(b) * 100));
                    const lbl = progressLabel(b);
                    return (
                      <li key={b.id} className="text-[11px] flex flex-col gap-1 leading-relaxed">
                        <div className="flex items-start gap-1.5">
                          <span className={`mt-0.5 shrink-0 ${done ? "text-amber-500" : "text-primary"}`}>
                            {done ? "✓" : "•"}
                          </span>
                          <span className="flex-1">
                            {lbl} → {b.emoji} {b.title}
                          </span>
                        </div>
                        {!done && pct < 100 && (
                          <div className="ms-4 h-1 rounded-full bg-border overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {/* Points shop card — still instructional */}
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🛒</span>
              <h4 className="text-xs font-bold">متجر النقاط</h4>
            </div>
            <ul className="space-y-1.5">
              {[
                "اكسب 10-25 نقطة من كل نشاط",
                "اشترِ تجميد الستريك بـ 50 نقطة",
                "التجميد يحمي تتابعك إذا فاتك يوم",
              ].map((step, j) => (
                <li key={j} className="text-[11px] text-muted-foreground flex items-start gap-1.5 leading-relaxed">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Badge detail & Share Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border/50 rounded-[2rem] p-6 max-w-sm w-full text-center shadow-xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="size-20 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center text-4xl shadow-inner">
                {selectedBadge.emoji}
              </div>

              <h3 className="text-xl font-bold mb-1">{selectedBadge.title}</h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                {selectedBadge.description}
              </p>

              {unlockedIds.includes(selectedBadge.id) ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5">
                    <Sparkles className="size-4" />
                    <span>تم الحصول على هذا الوسام!</span>
                  </div>

                  <button
                    onClick={() => handleShare(selectedBadge)}
                    className="w-full h-11 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="size-4 text-emerald-300" />
                        تم نسخ النص!
                      </>
                    ) : (
                      <>
                        <Share2 className="size-4" />
                        مشاركة الإنجاز
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center gap-1.5">
                  <Lock className="size-4" />
                  <span>واصل التتبع في المنصة لفتح هذا الوسام</span>
                </div>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="mt-4 text-xs text-muted-foreground font-bold hover:underline"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <StreakRecoveryModal
        open={recoveryOpen}
        onClose={() => setRecoveryOpen(false)}
        onRestored={() => {
          setPoints(getUserPoints());
          setFreezes(getStreakFreezes());
        }}
      />
    </div>
  );
}
