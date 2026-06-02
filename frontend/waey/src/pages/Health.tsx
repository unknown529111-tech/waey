import { Heart, ChefHat, ArrowLeft, Wind, Brain, Feather, Sparkles, BookOpen, Moon, Smartphone, Stethoscope, HeartPulse, Droplets, UtensilsCrossed } from "lucide-react";
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

const stressTips = [
  { icon: Wind, title: "تنفس 4-4-6", desc: "شهيق 4 ثوان، احبس 4، زفير 6. كرر 5 مرات — بيهدي الجهاز العصبي فوراً." },
  { icon: Brain, title: "اكتب اللي في دماغك", desc: "كل كلمة أو قلق في بالك، اكتبه على ورقة. التفريغ الذهني بيقلل التوتر 50%." },
  { icon: Sparkles, title: "امشِي 5 دقائق", desc: "غيّر المكان، خد نفس عميق، لاحظ حواليك. المشي البطيء بيهدي الأفكار." },
  { icon: Heart, title: "كفاية ضغط على نفسك", desc: "أنت مش مطلوب منك تكون perfect. الخطأ جزء من التعلم." },
  { icon: BookOpen, title: "اقرأ حاجة خفيفة", desc: "اقرا آية قرآنية، ذكر، أو جملة تحفيزية. الكلمة الحلوة بتغير المود." },
];

const groundingSteps = [
  { num: "5", label: "حاجات تشوفها", desc: "حولك 5 حاجات تقدر تشوفها — قلم، شباك، ضوء..." },
  { num: "4", label: "حاجات تلمسها", desc: "4 حاجات تقدر تلمسها — قميصك، الطاولة، الموبايل..." },
  { num: "3", label: "حاجات تسمعها", desc: "3 أصوات بتسمعها دلوقتي — المروحة، العربية، صوتك..." },
  { num: "2", label: "حاجات تشمها", desc: "ريحتين تقدر تشمهم — القهوة، الهوا..." },
  { num: "1", label: "حاجة تتذوقها", desc: "حاجة واحدة تتذوقها — مية، نعناع، أو حتى ابتسامة." },
];

const Health = () => (
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
    <div className="relative">
    <PageHero
      badge="الصحة الشاملة"
      icon={<Heart className="size-4" />}
      title="ابنِ صحتك بخطوات يومية"
      subtitle="عادات بسيطة لجسد قوي وعقل صافي. نصائح متجددة كل أسبوع."
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
              <h3 className="font-bold text-sm">وصفات صحية</h3>
              <p className="text-xs text-muted-foreground">أكل بيتي مصري بسعرات وتكلفة</p>
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
          تمارين التنفس العميق
        </h2>
        <BreathingExercise />
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          <HeartPulse className="size-6" />
          أدوات صحية تفاعلية
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
          صحة الشاشة والمكتب
        </h2>
        <OfficeHealth />
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-destructive flex items-center gap-2">
          <HeartPulse className="size-6" />
          دليل الإسعافات الأولية السريع
        </h2>
        <p className="text-muted-foreground mb-6 -mt-4 text-sm">
          دقيقة واحدة ممكن تنقذ حياة — احفظ الخطوات دي أو شاركها مع أهلك
        </p>
        <FirstAidGuide />
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          <Moon className="size-6" />
          نظافة النوم (Sleep Hygiene)
        </h2>
        <SleepHygiene />
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          <Smartphone className="size-6" />
          الصحة الرقمية (Digital Wellness)
        </h2>
        <DigitalWellness />
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          <Stethoscope className="size-6" />
          الفحوصات الدورية
        </h2>
        <p className="text-muted-foreground mb-6 -mt-4 text-sm">
          الوقاية خير من العلاج — زي ما بتعمل صيانة للعربية، جسمك محتاج صيانة كل سنة
        </p>
        <CheckupsTable />
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-secondary flex items-center gap-2">
          <Brain className="size-6" />
          نصائح سريعة للتوتر
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stressTips.map((t, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-3xl p-6 shadow-soft hover:-translate-y-1 hover:shadow-moss-lg transition-all duration-300">
              <div className="size-10 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-3">
                <t.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-bold text-base mb-1.5">{t.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          <Feather className="size-6" />
          تقنية التأريض (5-4-3-2-1)
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
            مش لازم تكون perfect
          </h2>
          <p className="text-base leading-loose max-w-[600px] mx-auto text-foreground/90">
            في وعي، إحنا مش بنطلب منك تكون مثالي. بنطلب منك تجرب، تتعلم، وتتحسن شوية كل يوم.
            <br />
            <span className="font-bold text-primary">عقلك محتاج راحة زيه زي جسدك.</span>
            <br />
            خد نفس، أنت كفايه.
          </p>
        </div>
      </div>
    </section>

    <HospitalFinder />
    </div>
  </div>
);

export default Health;
