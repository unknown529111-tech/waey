import { Brain } from "lucide-react";
import PageHero from "@/components/PageHero";
import AwarenessQuiz from "@/components/AwarenessQuiz";

const Quiz = () => (
  <div className="relative min-h-[60vh]">
    <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-background to-primary/5 pointer-events-none" />
    <div className="absolute top-0 left-1/4 size-[450px] bg-accent/15 blur-3xl pointer-events-none animate-blob-slow" style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }} />
    <div className="absolute bottom-0 right-0 size-[300px] bg-primary/10 blur-3xl pointer-events-none animate-blob-slow" style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 50% 60%", animationDelay: "1s" }} />

    <div className="relative">
      <PageHero
        badge="اختبر وعيك"
        icon={<Brain className="size-4" />}
        title="10 أسئلة جديدة كل يوم"
        subtitle="اختبر معلوماتك في الصحة والمال والبيئة."
      />
      <AwarenessQuiz />
    </div>
  </div>
);

export default Quiz;
