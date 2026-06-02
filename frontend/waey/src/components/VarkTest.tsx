import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Headphones, BookOpen, Hand, ArrowLeft, RotateCcw } from "lucide-react";

type Style = "visual" | "auditory" | "readwrite" | "kinesthetic" | null;

interface Question {
  text: string;
  options: { text: string; style: Style }[];
}

const questions: Question[] = [
  {
    text: "لما تحفز نفسك بالمذاكرة أفضل حاجة تشغلك؟",
    options: [
      { text: "فيديو أو إنفوجرافيك يشرح الموضوع", style: "visual" },
      { text: "تسمع حد يشرحه أو تناقشه مع صديق", style: "auditory" },
      { text: "تقراه في كتاب أو مقال مكتوب", style: "readwrite" },
      { text: "تجرب بنفسك أو تحل مسائل عملية", style: "kinesthetic" },
    ],
  },
  {
    text: "أثناء المحاضرة، إيه اللي بيخليك تفهم أكتر؟",
    options: [
      { text: "الشرائح والصور اللي بتوضح الكلام", style: "visual" },
      { text: "شرح الدكتور أو تسجيل الصوت", style: "auditory" },
      { text: "تكتب الملاحظات وتقراها بعدين", style: "readwrite" },
      { text: "تطبق اللي اتشرح على طول", style: "kinesthetic" },
    ],
  },
  {
    text: "لما تجرب تتعلم حاجة جديدة على النت، بتروح لـ...",
    options: [
      { text: "فيديوهات يوتيوب ورسومات توضيحية", style: "visual" },
      { text: "بودكاست أو شرح صوتي", style: "auditory" },
      { text: "أرتيكل أو مدونة بتشرح بالتفصيل", style: "readwrite" },
      { text: "تجارب تفاعلية أو محاكاة عملية", style: "kinesthetic" },
    ],
  },
  {
    text: "إيه الطريقة اللي بتثبت بيه المعلومة في دماغك؟",
    options: [
      { text: "لون معين أو شكل معين في خريطة ذهنية", style: "visual" },
      { text: "لما تسمعها في أغنية أو قافية", style: "auditory" },
      { text: "لما تكتبها أكتر من مرة", style: "readwrite" },
      { text: "لما تجربها بنفسك على أرض الواقع", style: "kinesthetic" },
    ],
  },
  {
    text: "لما تروح مكان جديد، إزاي بتعرف الطريق؟",
    options: [
      { text: "بتتذكر معالم بصرية زي مباني أو لافتات", style: "visual" },
      { text: "بتسأل الناس وتتذكر التعليمات الصوتية", style: "auditory" },
      { text: "بتقرا الخريطة أو اللافتات المكتوبة", style: "readwrite" },
      { text: "بتدور بنفسك وتجرب طرق مختلفة", style: "kinesthetic" },
    ],
  },
  {
    text: "في الإجازة، إيه أحسن نشاط بالنسبالك؟",
    options: [
      { text: "فيلم وثائقي أو رسم أو تصوير", style: "visual" },
      { text: "سماع موسيقى أو بودكاست أو مقابلة صحاب", style: "auditory" },
      { text: "قراية كتاب أو مجلة أو كتابة مذكرات", style: "readwrite" },
      { text: "رياضة أو مشوار أو حاجة عملية بإيديك", style: "kinesthetic" },
    ],
  },
  {
    text: "لما تذاكر عايز تذاكر بذكاء، أول حاجة تعملها؟",
    options: [
      { text: "ترتب المعلومات في جدول أو رسم بياني", style: "visual" },
      { text: "تسمع شرح للموضوع وأنت مغمض عينيك", style: "auditory" },
      { text: "تلخص الدرس وتكتب النقاط المهمة", style: "readwrite" },
      { text: "تحل أسئلة وتمارين من أولها", style: "kinesthetic" },
    ],
  },
  {
    text: "لما تسمع كلمة 'تفاحة'، إيه أول حاجة تجي في دماغك؟",
    options: [
      { text: "شكل التفاحة ولونها الأحمر", style: "visual" },
      { text: "صوت الكلمة نفسها أو أكل التفاح", style: "auditory" },
      { text: "كلمة Apple بطريقة كتابتها", style: "readwrite" },
      { text: "ملمس التفاحة وطعمها في فمك", style: "kinesthetic" },
    ],
  },
  {
    text: "إيه أسهل حاجة تفهم منها شرح جديد؟",
    options: [
      { text: "رسم توضيحي أو ماب", style: "visual" },
      { text: "مناقشة جماعية أو شرح مسموع", style: "auditory" },
      { text: "نقطة مكتوبة بـ bullets", style: "readwrite" },
      { text: "نموذج تطبيقي أو لعبة تعليمية", style: "kinesthetic" },
    ],
  },
  {
    text: "لما تذاكر كلمات إنجليزية جديدة، بتعمل إيه؟",
    options: [
      { text: "تكتب الكلمة جنب صورة معبرة عنها", style: "visual" },
      { text: "تسمع نطقها وتكرره بصوت عالي", style: "auditory" },
      { text: "تكتب الكلمة ومعناها أكتر من مرة", style: "readwrite" },
      { text: "تستخدم الكلمة في جملة عملية أو موقف حقيقي", style: "kinesthetic" },
    ],
  },
];

const labels: Record<string, string> = {
  visual: "بصري (Visual)",
  auditory: "سمعي (Auditory)",
  readwrite: "قراءة وكتابة (Read/Write)",
  kinesthetic: "حركي (Kinesthetic)",
};

const icons: Record<string, React.ElementType> = {
  visual: Eye,
  auditory: Headphones,
  readwrite: BookOpen,
  kinesthetic: Hand,
};

const colors: Record<string, string> = {
  visual: "text-blue-500",
  auditory: "text-purple-500",
  readwrite: "text-amber-500",
  kinesthetic: "text-green-500",
};

const bgColors: Record<string, string> = {
  visual: "from-blue-500/20 to-blue-500/5",
  auditory: "from-purple-500/20 to-purple-500/5",
  readwrite: "from-amber-500/20 to-amber-500/5",
  kinesthetic: "from-green-500/20 to-green-500/5",
};

const advice: Record<string, { strategies: string[]; improve: string[] }> = {
  visual: {
    strategies: [
      "استخدم الخرائط الذهنية والرسوم البيانية لكل باب",
      "لون الملاحظات بألوان مختلفة حسب الموضوع",
      "حول المعلومات لجداول ومخططات بصرية",
      "شاهد فيديوهات تعليمية ووثائقيات عن المادة",
      "استخدم البطاقات التعليمية المصورة (Flashcards)",
      "ارسم أفكار الدرس بدل ما تكتبها طول الوقت",
    ],
    improve: [
      "جرب تشرح المعلومات بصوت عالي عشان تنشط الذاكرة السمعية",
      "اكتب ملخصات قصيرة بأسلوبك لتدريب الذاكرة القرائية",
      "درب نفسك على حل تمارين عملية عشان تنوع أسلوبك",
    ],
  },
  auditory: {
    strategies: [
      "سجل المحاضرات واستمع ليها تاني",
      "ناقش اللي ذاكرته مع زميل أو اشرحه لحد",
      "استخدم التكرار الصوتي (قل المعلومة بصوت عالي)",
      "اسمع بودكاست أو فيديوهات شرح لنفس الموضوع",
      "اقرأ الدرس بصوت عالي وانت بتذاكر",
      "استخدم القوافي والأغاني لحفظ المعلومات الصعبة",
    ],
    improve: [
      "حول ملاحظاتك لخرائط ذهنية عشان تشغل حاسة البصر",
      "اكتب النقاط المهمة في دفتر عشان ترسخها",
      "جرب تطبق المعلومات بشكل عملي عشان تثبت أكتر",
    ],
  },
  readwrite: {
    strategies: [
      "اكتب ملخصات ومذكرات بخط إيدك لكل درس",
      "استخدم القوائم والنقاط (bullet points) في المذاكرة",
      "اقرأ المصادر المكتوبة: كتب، أبحاث، مقالات",
      "حول المعلومات لأسئلة وأجوبة مكتوبة",
      "أعد كتابة اللي فهمته من غير ما تشوف الكتاب",
      "استخدم القواميس والمعاجم لفهم المصطلحات",
    ],
    improve: [
      "حاول تسمع شرح سريع للموضوع عشان تتنوع",
      "استخدم الصور والرسوم عشان تكسر الروتين",
      "طبق اللي قرأته بحل تمارين أو تطبيق عملي",
    ],
  },
  kinesthetic: {
    strategies: [
      "طبّق اللي بتذاكره بحل مسائل وتمارين كتير",
      "استخدم التجارب العملية والنماذج المجسمة",
      "قم أو امشي وانت بتذاكر—الحركة بتساعدك تركز",
      "اقسم المذاكرة لجلسات قصيرة وحركية",
      "استخدم أدوات زي العداد أو البطاقات المتحركة",
      "ادرس في أماكن عملية زي المعمل أو ورشة العمل",
    ],
    improve: [
      "جرب تشوف فيديوهات تعليمية عشان تضيف الجانب البصري",
      "ناقش الموضوع مع زمايلك عشان تشغل الجانب السمعي",
      "اكتب خطوات العمل عشان ترسخها في دماغك",
    ],
  },
};

const VarkTest = () => {
  const [step, setStep] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, number>>({
    visual: 0, auditory: 0, readwrite: 0, kinesthetic: 0,
  });
  const [result, setResult] = useState<Style>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = (style: Style) => {
    if (!style) return;
    setScores((prev) => ({ ...prev, [style]: prev[style] + 1 }));
    setSelected(questions[step].options.findIndex((o) => o.style === style));
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep((s) => s + 1);
        setSelected(null);
      } else {
        const updatedScores = { ...scores, [style]: (scores[style] || 0) + 1 };
        const finalSorted = Object.entries(updatedScores).sort((a, b) => b[1] - a[1]);
        setResult(finalSorted[0][0] as Style);
      }
    }, 400);
  };

  const reset = () => {
    setStep(0);
    setScores({ visual: 0, auditory: 0, readwrite: 0, kinesthetic: 0 });
    setResult(null);
    setSelected(null);
  };

  const progress = ((step + 1) / questions.length) * 100;

  if (result) {
    const Icon = icons[result];
    const adv = advice[result];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-6 md:p-8 border border-border bg-gradient-to-br ${bgColors[result]}`}
      >
        <div className="text-center mb-6">
          <Icon className={`size-14 mx-auto mb-3 ${colors[result]}`} />
          <h3 className="text-2xl font-bold mb-1">نمطك هو</h3>
          <p className={`text-xl font-bold ${colors[result]}`}>{labels[result]}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              إزاي تتعلم بذكاء حسب نمطك
            </h4>
            <ul className="space-y-2">
              {adv.strategies.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span className="shrink-0 size-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
              <ArrowLeft className="size-5 text-accent" />
              عشان تطور نفسك—جرب كمان
            </h4>
            <ul className="space-y-2">
              {adv.improve.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span className="shrink-0 size-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={reset}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold px-6 py-3 hover:opacity-90 transition-all"
        >
          <RotateCcw className="size-4" />
          اختبر مرة تانية
        </button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl p-6 md:p-8 border border-border bg-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">اختبر نمط تعلمك</h3>
        <span className="text-sm text-muted-foreground">
          {step + 1} / {questions.length}
        </span>
      </div>

      <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-lg font-bold mb-5 leading-relaxed">
            {questions[step].text}
          </p>

          <div className="space-y-2.5">
            {questions[step].options.map((opt, i) => {
              const Icon = icons[opt.style || "visual"];
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => !isSelected && handleAnswer(opt.style)}
                  disabled={isSelected}
                  className={`w-full text-right flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 scale-[0.98]"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <Icon className={`size-5 shrink-0 ${colors[opt.style || "visual"]}`} />
                  <span className="text-sm leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VarkTest;