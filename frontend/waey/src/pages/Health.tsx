import { Heart, ChefHat, ArrowLeft, Wind, Brain, Feather, Sparkles, BookOpen, Moon, Smartphone, Stethoscope, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import QuickTips from "@/components/QuickTips";
import HealthCalculator from "@/components/HealthCalculator";
import HospitalFinder from "@/components/HospitalFinder";
import BreathingExercise from "@/components/BreathingExercise";
import SleepCycleCalculator from "@/components/SleepCycleCalculator";
import WaterCalculator from "@/components/WaterCalculator";
import EgyptianPlate from "@/components/EgyptianPlate";
import OfficeHealth from "@/components/OfficeHealth";
import FirstAidGuide from "@/components/FirstAidGuide";
import SleepHygiene from "@/components/SleepHygiene";
import DigitalWellness from "@/components/DigitalWellness";
import CheckupsTable from "@/components/CheckupsTable";
import { useT } from "@/contexts/LanguageContext";

const Health = () => {
  const t = useT();

  const stressTips = [
    { icon: Wind, title: t('health.stressTip1'), desc: t('health.stressDesc1') },
    { icon: Brain, title: t('health.stressTip2'), desc: t('health.stressDesc2') },
    { icon: Sparkles, title: t('health.stressTip3'), desc: t('health.stressDesc3') },
    { icon: Heart, title: t('health.stressTip4'), desc: t('health.stressDesc4') },
    { icon: BookOpen, title: t('health.stressTip5'), desc: t('health.stressDesc5') },
  ];

  const groundingSteps = [
    { num: "5", label: t('health.groundSee'), desc: t('health.groundSeeDesc') },
    { num: "4", label: t('health.groundTouch'), desc: t('health.groundTouchDesc') },
    { num: "3", label: t('health.groundHear'), desc: t('health.groundHearDesc') },
    { num: "2", label: t('health.groundSmell'), desc: t('health.groundSmellDesc') },
    { num: "1", label: t('health.groundTaste'), desc: t('health.groundTasteDesc') },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
      <PageHero
        badge={t('health.badge')}
        icon={<Heart className="size-4" />}
        title={t('health.title')}
        subtitle={t('health.subtitle')}
      />
      <QuickTips />
      <HealthCalculator />

      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/recipes"
            className="group flex items-center justify-between bg-card rounded-3xl border border-border/50 p-8 hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-300 shadow-soft"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-[2rem] bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                <ChefHat className="size-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{t('health.recipesHeading')}</h3>
                <p className="text-xs text-muted-foreground">{t('health.recipesDesc')}</p>
              </div>
            </div>
            <ArrowLeft className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 space-y-14">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
            <Wind className="size-6" />
            {t('health.breathing')}
          </h2>
          <BreathingExercise />
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
            <HeartPulse className="size-6" />
            {t('health.tools')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <SleepCycleCalculator />
            <WaterCalculator />
            <EgyptianPlate />
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
            <Smartphone className="size-6" />
            {t('health.office')}
          </h2>
          <OfficeHealth />
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-destructive flex items-center gap-2">
            <HeartPulse className="size-6" />
            {t('health.firstAid')}
          </h2>
          <p className="text-muted-foreground mb-6 -mt-4 text-sm">
            دقيقة واحدة ممكن تنقذ حياة — احفظ الخطوات دي أو شاركها مع أهلك
          </p>
          <FirstAidGuide />
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
            <Moon className="size-6" />
            {t('health.sleep')}
          </h2>
          <SleepHygiene />
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
            <Smartphone className="size-6" />
            {t('health.digital')}
          </h2>
          <DigitalWellness />
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
            <Stethoscope className="size-6" />
            {t('health.checkups')}
          </h2>
          <p className="text-muted-foreground mb-6 -mt-4 text-sm">
            الوقاية خير من العلاج — زي ما بتعمل صيانة للعربية، جسمك محتاج صيانة كل سنة
          </p>
          <CheckupsTable />
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-secondary flex items-center gap-2">
            <Brain className="size-6" />
            {t('health.stress')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stressTips.map((tip, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-3xl p-6 shadow-soft hover:-translate-y-1 hover:shadow-moss-lg transition-all duration-300">
                <div className="size-10 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-3">
                  <tip.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-base mb-1.5">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
            <Feather className="size-6" />
            {t('health.grounding')}
          </h2>
          <p className="text-muted-foreground mb-6 -mt-4">
            لو حاسس بقلق أو هلع، استخدم الحواس الخمسة عشان ترجع للحظة اللي أنت فيها:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {groundingSteps.map((g, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-3xl p-6 text-center shadow-soft hover:-translate-y-1 hover:shadow-moss-lg transition-all duration-300">
                <div className="size-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-3">
                  {g.num}
                </div>
                <h3 className="font-bold text-sm mb-1">{g.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-card to-secondary/10 p-8 md:p-12 text-center shadow-soft">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full -translate-x-1/2 translate-y-1/2" />
          <div className="relative">
            <Heart className="size-10 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-primary">
              {t('health.perfectTitle')}
            </h2>
            <p className="text-base leading-loose max-w-[600px] mx-auto text-foreground/90">
              {t('health.perfectBody')}
              <br />
              <span className="font-bold text-primary">{t('health.restMind')}</span>
              <br />
              {t('health.breathe')}
            </p>
          </div>
        </div>
      </section>

      <HospitalFinder />
      </div>
    </div>
  );
};

export default Health;
