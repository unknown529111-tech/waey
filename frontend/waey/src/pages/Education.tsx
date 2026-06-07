import { GraduationCap, BookOpen, Brain, Timer, Target, Sparkles, Compass, Heart, Lightbulb } from "lucide-react";
import PageHero from "@/components/PageHero";
import VarkTest from "@/components/VarkTest";
import EducationFeatures from "@/components/EducationFeatures";
import { useT } from "@/contexts/LanguageContext";

const Education = () => {
  const t = useT();

  const studyMethods = [
    { id: "pomodoro", icon: Timer, title: t('edu.studyMethods.0.title'), desc: t('edu.studyMethods.0.desc') },
    { id: "active-recall", icon: BookOpen, title: t('edu.studyMethods.1.title'), desc: t('edu.studyMethods.1.desc') },
    { id: "spaced", icon: Target, title: t('edu.studyMethods.2.title'), desc: t('edu.studyMethods.2.desc') },
    { id: "feynman", icon: Brain, title: t('edu.studyMethods.3.title'), desc: t('edu.studyMethods.3.desc') },
    { id: "mindmap", icon: Sparkles, title: t('edu.studyMethods.4.title'), desc: t('edu.studyMethods.4.desc') },
    { id: "plan", icon: Compass, title: t('edu.studyMethods.5.title'), desc: t('edu.studyMethods.5.desc') },
  ];

  const focusTips = [
    { id: "phone-off", title: t('edu.focusTips.0.title'), desc: t('edu.focusTips.0.desc') },
    { id: "two-min", title: t('edu.focusTips.1.title'), desc: t('edu.focusTips.1.desc') },
    { id: "change-place", title: t('edu.focusTips.2.title'), desc: t('edu.focusTips.2.desc') },
    { id: "water-breath", title: t('edu.focusTips.3.title'), desc: t('edu.focusTips.3.desc') },
    { id: "write-down", title: t('edu.focusTips.4.title'), desc: t('edu.focusTips.4.desc') },
    { id: "sleep", title: t('edu.focusTips.5.title'), desc: t('edu.focusTips.5.desc') },
  ];

  const lostTips = [
    t('edu.lostTips.0'),
    t('edu.lostTips.1'),
    t('edu.lostTips.2'),
    t('edu.lostTips.3'),
    t('edu.lostTips.4'),
    t('edu.lostTips.5'),
  ];

  return (
    <div className="relative min-h-[60vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/30 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge={t('edu.badge')}
          icon={<GraduationCap className="size-4" />}
          title={t('edu.title')}
          subtitle={t('edu.subtitle')}
        />

        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 space-y-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
              <BookOpen className="size-6" />
              {t('edu.methods')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {studyMethods.map((m) => (
                <div
                  key={m.id}
                  className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft hover:-translate-y-1 hover:shadow-moss-lg transition-all duration-300"
                >
                  <m.icon className="size-8 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-2">{m.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
              <Brain className="size-6" />
              {t('edu.focus')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {focusTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 bg-gradient-to-l from-sun-warm/30 to-transparent shadow-soft hover:-translate-y-0.5 hover:shadow-moss-lg transition-all duration-300"
                >
                  <h3 className="font-bold mb-1.5">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
              <Lightbulb className="size-6" />
              {t('edu.learningStyle')}
            </h2>
            <p className="text-muted-foreground mb-6 -mt-4">
              {t('edu.varkDesc')}
            </p>
            <VarkTest />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
              <Compass className="size-6" />
              {t('edu.lost')}
            </h2>
            <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 md:p-8 shadow-soft">
              <ul className="space-y-3">
                {lostTips.map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 size-7 rounded-full bg-primary/15 text-primary text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-sm md:text-base pt-0.5">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <EducationFeatures />

          <div className="bg-gradient-to-l from-primary/15 via-leaf-light/40 to-sun-warm/30 rounded-[2rem] p-8 md:p-12 border border-primary/20 text-center shadow-soft">
            <Heart className="size-10 text-accent mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
              {t('edu.futureTitle')}
            </h2>
            <p className="text-base md:text-lg leading-loose max-w-[700px] mx-auto text-foreground/90">
              {t('edu.futureBody1')}
              <br />
              {t('edu.futureBody2')}
              <br />
              <span className="font-bold text-primary">{t('edu.futureBody3')}</span>
              <br />
              <br />
              {t('edu.futureBody4')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Education;
