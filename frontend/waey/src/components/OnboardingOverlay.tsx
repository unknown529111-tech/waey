import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Wallet, TreePine, Brain, Sparkles, ArrowLeft } from "lucide-react";

const ONBOARDING_KEY = "waey_onboarding_done";

const slides = [
  {
    icon: Sparkles,
    title: "أهلاً بك في وعي",
    desc: "منصتك الشاملة للتوازن — صحة، مال، بيئة، تعليم، وصحة نفسية. كل حاجة في مكان واحد.",
  },
  {
    icon: Heart,
    title: "تابع عاداتك اليومية",
    desc: "سجّل مياهك، نومك، نشاطك، ومزاجك كل يوم. وشوف ستريكك وإنجازاتك.",
  },
  {
    icon: Wallet,
    title: "خطط ميزانيتك",
    desc: "حاسبات ذكية للميزانية والفواتير، وخطط 30 يوم للادخار والصحة والبيئة.",
  },
  {
    icon: Brain,
    title: "اختبر نفسك وتعلم",
    desc: "اختبارات تفاعلية، نصائح يومية، ومساعد ذكي يجوب على أسئلتك.",
  },
  {
    icon: Heart,
    title: "صحتك النفسية مهمة",
    desc: "تمارين تنفس، تقنيات للتوتر، وتأريض — كلها أدوات تساعدك تهدي أعصابك.",
  },
];

const OnboardingOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const done = localStorage.getItem(ONBOARDING_KEY);
      if (!done) setVisible(true);
    } catch { /* ignore */ }
  }, []);

  const finish = () => {
    try { localStorage.setItem(ONBOARDING_KEY, "true"); } catch { /* ignore */ }
    setVisible(false);
  };

  if (!visible) return null;

  const s = slides[step];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-card border border-border rounded-3xl p-8 md:p-10 max-w-sm mx-4 w-full text-center"
      >
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <s.icon className="size-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-3">{s.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">{s.desc}</p>

        <div className="flex items-center justify-center gap-1.5 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step < slides.length - 1 ? (
            <>
              <button
                onClick={finish}
                className="flex-1 text-xs font-bold text-muted-foreground rounded-full py-2.5 hover:bg-secondary/60 transition-colors"
              >
                تخطي
              </button>
              <button
                onClick={() => setStep((p) => p + 1)}
                className="flex-1 bg-primary text-primary-foreground text-xs font-bold rounded-full py-2.5 hover:bg-primary/90 transition-colors"
              >
                التالي
              </button>
            </>
          ) : (
            <button
              onClick={finish}
              className="flex-1 bg-primary text-primary-foreground text-xs font-bold rounded-full py-2.5 hover:bg-primary/90 transition-colors"
            >
              ابدأ
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingOverlay;
