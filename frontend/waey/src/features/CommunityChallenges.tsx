import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Flame, Trophy, CheckCircle, HeartHandshake } from "lucide-react";

interface CommunityGoal {
  id: string;
  title: string;
  category: string;
  currentCount: number;
  targetCount: number;
  unit: string;
  joined: boolean;
}

export function CommunityChallenges() {
  const [goals, setGoals] = useState<CommunityGoal[]>([
    {
      id: "water_community",
      title: "تحدي 10,000 كوب ماء مجتمعي 💧",
      category: "صحة",
      currentCount: 8420,
      targetCount: 10000,
      unit: "كوب",
      joined: true,
    },
    {
      id: "streak_community",
      title: "تحدي 500 يوم من التتابع والالتزام 🔥",
      category: "استدامة",
      currentCount: 420,
      targetCount: 500,
      unit: "يوم تتابع",
      joined: false,
    },
    {
      id: "eco_community",
      title: "تحدي 1,000 عمل بيئي وتوفير طاقة 🌿",
      category: "بيئة",
      currentCount: 780,
      targetCount: 1000,
      unit: "مبادرة",
      joined: false,
    },
  ]);

  const toggleJoin = (id: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              joined: !g.joined,
              currentCount: g.joined ? g.currentCount - 1 : g.currentCount + 1,
            }
          : g
      )
    );
  };

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm mb-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Users className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">التحديات الجماعية والأهداف المشتركة</h2>
            <p className="text-xs text-muted-foreground">شارِك مجتمع وعي في تحقيق أهداف أسبوعية موحدة</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          مشاركات مجهولة الهوية 🔒
        </span>
      </div>

      {/* Goals Grid */}
      <div className="space-y-4">
        {goals.map((g) => {
          const pct = Math.min(Math.round((g.currentCount / g.targetCount) * 100), 100);

          return (
            <div
              key={g.id}
              className="p-4 rounded-2xl bg-muted/40 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold truncate">{g.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    {g.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span>
                    التقدم: <strong className="text-foreground">{g.currentCount}</strong> / {g.targetCount} {g.unit}
                  </span>
                  <span>({pct}%)</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <button
                onClick={() => toggleJoin(g.id)}
                className={`h-10 px-5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-sm ${
                  g.joined
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {g.joined ? (
                  <>
                    <CheckCircle className="size-4" />
                    مشارك الآن
                  </>
                ) : (
                  <>
                    <HeartHandshake className="size-4" />
                    انضم للتحدي
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
