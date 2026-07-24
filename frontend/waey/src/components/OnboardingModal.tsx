import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Wallet, Leaf, GraduationCap, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { readJSON, writeJSON } from "@/lib/dailyStorage";

const ONBOARDING_KEY = "waey_onboarding_done";

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const isDone = readJSON<boolean>(ONBOARDING_KEY, false);
    if (!isDone) {
      setOpen(true);
    }
  }, []);

  const steps = [
    {
      title: "أهلاً بك في منصة وعي! 👋",
      subtitle: "رحلتك اليومية للتوازن الشامل في الحياة",
      description: "منصة وعي تهدف لمساعدتك في وبناء عادات إيجابية مستدامة في 4 أركان أساسية بدون تعقيد.",
      icon: <Sparkles className="size-8 text-amber-500" />,
      badge: "البداية",
    },
    {
      title: "الصحة البدنية والنفسية 💚",
      subtitle: "تابع نشاطك وشرب المياه ونومك ومزاجك",
      description: "سجّل أكواب المياه اليومية، وتمرين التنفس والاسترخاء، ومتابعة المزاج لتحافظ على طاقتك الذكية.",
      icon: <Heart className="size-8 text-emerald-500" />,
      badge: "الصحة",
    },
    {
      title: "الوعي المالي والاستدامة 💰",
      subtitle: "إدارة ميزانيتك ووصفات بيئية واقتصادية",
      description: "تتبع مصاريفك اليومية بحكمة، واكتشف وصفات صحية موفرة مع نصائح التدوير وترشيد الاستهلاك.",
      icon: <Wallet className="size-8 text-amber-600" />,
      badge: "المال والبيئة",
    },
    {
      title: "السلسلة والأوسمة 🏆",
      subtitle: "احصل على نقاط مجانية وحافظ على تتابعك",
      description: "تأكّد من تسجيل نشاطك يومياً لبناء سلسلة الوعي، واكسب النقاط لفتح الأوسمة وشراء حماية التجميد!",
      icon: <GraduationCap className="size-8 text-primary" />,
      badge: "الإنجازات",
    },
  ];

  const current = steps[step];

  const handleFinish = () => {
    writeJSON(ONBOARDING_KEY, true);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-card border border-border/50 rounded-[2rem] p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
        >
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Badge */}
          <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary mb-3">
            {current.badge}
          </span>

          {/* Icon */}
          <div className="size-16 mx-auto mb-4 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center shadow-inner">
            {current.icon}
          </div>

          {/* Title & Description */}
          <h2 className="text-xl font-bold mb-1">{current.title}</h2>
          <p className="text-xs font-medium text-primary mb-3">{current.subtitle}</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-8 px-2">
            {current.description}
          </p>

          {/* Navigation Controls */}
          <div className="flex gap-3 justify-center">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="h-11 px-5 rounded-full bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-all flex items-center gap-1"
              >
                <ArrowRight className="size-3.5" />
                السابق
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex-1 h-11 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                التالي
                <ArrowLeft className="size-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex-1 h-11 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="size-4" />
                ابدأ رحلة الوعي الآن
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
