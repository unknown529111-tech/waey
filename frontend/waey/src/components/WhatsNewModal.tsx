import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Trophy, FileSpreadsheet, Command, Check } from "lucide-react";
import { readJSON, writeJSON } from "@/lib/dailyStorage";

const WHATS_NEW_KEY = "waey_whats_new_v2_seen";

export function WhatsNewModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isSeen = readJSON<boolean>(WHATS_NEW_KEY, false);
    if (!isSeen) {
      // Small delay for smooth entry after load
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    writeJSON(WHATS_NEW_KEY, true);
    setOpen(false);
  };

  if (!open) return null;

  const updates = [
    {
      icon: <Trophy className="size-5 text-amber-500" />,
      title: "نظام الأوسمة وتجميد الستريك 🏆",
      description: "اكسب نقاط الأنشطة واشترِ 'تجميد الستريك' لحماية تتابعك اليومي إذا يفوتك يوم.",
    },
    {
      icon: <ShieldCheck className="size-5 text-emerald-500" />,
      title: "ذكاء اصطناعي آمن ومخصص 🤖",
      description: "المساعد الذكي أصلح آمن تماماً، ويأخذ في الاعتبار إنجازاتك اليومية لتقديم نصائح مخصصة.",
    },
    {
      icon: <FileSpreadsheet className="size-5 text-sky-500" />,
      title: "تقرير PDF والنسخ الاحتياطي 📄",
      description: "نزّل تقرير صحتك الأسبوعي بصيغة PDF، واحفظ واسترد ملفات النسخ الاحتياطي بسهولة.",
    },
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-card border border-border/50 rounded-[2rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
              <Sparkles className="size-3.5 text-amber-500" />
              تحديث جديد في وعي
            </span>
            <h2 className="text-2xl font-bold text-foreground mb-1">إيه الجديد في منصة وعي؟ ✨</h2>
            <p className="text-xs text-muted-foreground">أضفنا مميزات جديدة لتجربة أسرع وأكثر توازناً في حياتك</p>
          </div>

          {/* Features List */}
          <div className="space-y-3.5 mb-8">
            {updates.map((u, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-muted/40 border border-border/40 flex items-start gap-3 text-right"
              >
                <div className="size-10 rounded-full bg-background border border-border/50 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  {u.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">{u.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{u.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Check className="size-4" />
            فهمت، ابدأ الاستكشاف الآن
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
