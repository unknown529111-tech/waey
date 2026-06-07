import { GraduationCap, BookOpen, Brain, Timer, Target, Sparkles, Compass, Heart, Lightbulb } from "lucide-react";
import PageHero from "@/components/PageHero";
import VarkTest from "@/components/VarkTest";
import EducationFeatures from "@/components/EducationFeatures";
import { useT } from "@/contexts/LanguageContext";

const Education = () => {
  const t = useT();

  const studyMethods = [
    { id: "pomodoro", icon: Timer, title: "تقنية بومودورو", desc: "ذاكر 25 دقيقة بتركيز كامل، ثم استرح 5 دقائق. بعد 4 جلسات خد راحة 20–30 دقيقة. بتساعدك تركز من غير ما تتعب." },
    { id: "active-recall", icon: BookOpen, title: "الاستدعاء النشط (Active Recall)", desc: "بدل ما تقرا تاني وتاني، اقفل الكتاب وحاول تفتكر المعلومة بنفسك أو اشرحها بصوت عالي. ده بيثبّت المعلومة أضعاف." },
    { id: "spaced", icon: Target, title: "المراجعة المتباعدة (Spaced Repetition)", desc: "راجع المادة بعد يوم، ثم بعد 3 أيام، ثم أسبوع. كل مرة بتقوي الذاكرة بدل ما تنسى قبل الامتحان." },
    { id: "feynman", icon: Brain, title: "اشرح اللي فهمته (Feynman)", desc: "اشرح الموضوع كأنك بتعلّمه لطفل. لو لخبطت في حتة يبقى دي اللي محتاج تذاكرها تاني." },
    { id: "mindmap", icon: Sparkles, title: "خرائط ذهنية", desc: "ارسم أفكار الدرس على ورقة بسهم وألوان. مفيدة جدًا للمواد اللي فيها ترابط زي التاريخ والأحياء." },
    { id: "plan", icon: Compass, title: "خطة يوم بسيطة", desc: "اكتب 3 مهام بس تخلصهم النهارده. أهم من قائمة طويلة بتفشل تكملها. ابدأ بالأصعب وانت لسه طاقتك حلوة." },
  ];

  const focusTips = [
    { id: "phone-off", title: "قفل الموبايل في أوضة تانية", desc: "مش الصامت، قفله أو سيبه برّه. الإشعار الواحد بيكسر تركيزك 15–20 دقيقة." },
    { id: "two-min", title: "اعمل قاعدة الـ 2 دقيقة", desc: "لو تايه ومش عارف تبدأ، قول لنفسك: هذاكر دقيقتين بس. غالبًا هتلاقي نفسك كملت." },
    { id: "change-place", title: "غيّر المكان", desc: "لما دماغك تقفل، قوم اتحرك أو غيّر الأوضة. المخ بيشتغل أحسن مع التغيير البسيط." },
    { id: "water-breath", title: "اشرب مية وخد نفس عميق", desc: "كوباية مية وخمس أنفاس بطيئة بتعيد تركيزك أكتر من قهوة تانية." },
    { id: "write-down", title: "اكتب اللي بيشغلك", desc: "لو فيه قلق أو فكرة بتقطعك، اكتبها على ورقة وارجع لها بعدين. بكده تفضي دماغك." },
    { id: "sleep", title: "نام كويس", desc: "السهر يلغي اللي ذاكرته. 7–8 ساعات نوم أهم من ساعتين مذاكرة زيادة." },
  ];

  const lostTips = [
    "ابدأ بأي حاجة صغيرة. الحركة بتولّد الدافع، مش العكس.",
    "متقارنش نفسك بحد. كل واحد له سرعته وطريقه.",
    "حدد هدف واحد للأسبوع، مش 10 أهداف للسنة.",
    "لو فشلت في يوم، كمل في اللي بعده. فشل اليوم مش فشل العمر.",
    "اطلب مساعدة. صديق، مدرس، أو حتى محادثة مع المساعد الذكي هنا.",
    "افتكر إنك مش لوحدك—كلنا بنحس بالتيه أحيانًا.",
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
              خد الاختبار ده عشان تعرف أنت فين، وبعدها هتتعلم إزاي تذاكر بطريقتك.
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
              فكّر في مستقبلك
            </h2>
            <p className="text-base md:text-lg leading-loose max-w-[700px] mx-auto text-foreground/90">
              اللي بتعمله النهارده—حتى لو حاسس إنه قليل—هو الأساس اللي بكرة هيقف عليه.
              <br />
              اعمل اللي عليك بإخلاص، وذاكر، وحاول، واصبر،
              <br />
              <span className="font-bold text-primary">والباقي على ربنا.</span>
              <br />
              <br />
              متخافش من البطء، خاف بس من الوقوف. خطوة كل يوم أحسن من قفزة كل سنة.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Education;
