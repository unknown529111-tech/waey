import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle, RotateCcw } from "lucide-react";
import { useT } from "@/contexts/useLanguage";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: "health" | "finance" | "environment";
}

const allQuestions: Question[] = [
  // بيئة
  { question: "كم لتر من الماء يُهدر عند ترك الصنبور مفتوحاً أثناء غسل الأسنان؟", options: ["2 لتر", "6 لترات", "12 لتر", "20 لتر"], correct: 2, explanation: "ترك الصنبور مفتوحاً لمدة دقيقتين يهدر حوالي 12 لتراً من الماء!", category: "environment" },
  { question: "كم تستهلك الأجهزة في وضع الاستعداد (Standby) من إجمالي فاتورة الكهرباء؟", options: ["1-2%", "5-10%", "15-20%", "25-30%"], correct: 1, explanation: "الأجهزة في وضع الاستعداد تستهلك 5-10% من فاتورة الكهرباء. أطفئها من المصدر!", category: "environment" },
  { question: "ما المدة التي يحتاجها الكيس البلاستيكي ليتحلل في الطبيعة؟", options: ["10 سنوات", "50 سنة", "200 سنة", "500 سنة"], correct: 3, explanation: "الأكياس البلاستيكية تحتاج حتى 500 سنة للتحلل! استخدم الأكياس القماشية.", category: "environment" },
  { question: "ما نسبة المياه التي يمكن توفيرها باستخدام رأس دش موفر للمياه؟", options: ["10%", "25%", "40%", "60%"], correct: 2, explanation: "رأس الدش الموفر يقلل استهلاك المياه بنسبة 40% دون التأثير على ضغط المياه.", category: "environment" },
  { question: "كم تنتج الأسرة الواحدة من النفايات الغذائية سنوياً في المتوسط؟", options: ["50 كيلو", "100 كيلو", "200 كيلو", "300+ كيلو"], correct: 3, explanation: "تنتج الأسرة الواحدة أكثر من 300 كيلو نفايات غذائية سنوياً! خطط وجباتك لتقلل الهدر.", category: "environment" },
  { question: "كم شجرة يمكن إنقاذها بإعادة تدوير طن واحد من الورق؟", options: ["5 أشجار", "10 أشجار", "17 شجرة", "25 شجرة"], correct: 2, explanation: "إعادة تدوير طن واحد من الورق تنقذ 17 شجرة و26,500 لتر من الماء!", category: "environment" },
  { question: "ما أكبر مصدر لتلوث المحيطات؟", options: ["النفايات الصناعية", "البلاستيك", "تسرب النفط", "الصرف الصحي"], correct: 1, explanation: "البلاستيك يشكل 80% من نفايات المحيطات. أكثر من 8 مليون طن بلاستيك يصل للمحيطات سنوياً.", category: "environment" },
  { question: "كم لتر ماء يحتاج إنتاج كيلو لحم بقري واحد؟", options: ["1,000 لتر", "5,000 لتر", "10,000 لتر", "15,000 لتر"], correct: 3, explanation: "إنتاج كيلو لحم بقري يحتاج حوالي 15,000 لتر ماء! تقليل اللحوم يوفر موارد ضخمة.", category: "environment" },
  { question: "ما نسبة الطاقة التي توفرها لمبات LED مقارنة بالعادية؟", options: ["30%", "50%", "70%", "80%"], correct: 3, explanation: "لمبات LED توفر حتى 80% من الطاقة وتدوم 25 مرة أطول من اللمبات التقليدية.", category: "environment" },
  { question: "كم درجة يجب ضبط التكييف عليها لتوفير الطاقة؟", options: ["18°C", "20°C", "24°C", "28°C"], correct: 2, explanation: "ضبط التكييف على 24 درجة يوفر حتى 30% من استهلاك الكهرباء مقارنة بـ 20 درجة.", category: "environment" },
  // صحة
  { question: "ما الحد الأقصى الموصى به لاستهلاك السكر يومياً للبالغين؟", options: ["50 غرام", "25 غرام", "40 غرام", "15 غرام"], correct: 1, explanation: "توصي منظمة الصحة العالمية بعدم تجاوز 25 غراماً من السكر المضاف يومياً.", category: "health" },
  { question: "ما أفضل وقت لشرب الماء لتحسين عملية الهضم؟", options: ["أثناء الأكل", "بعد الأكل مباشرة", "قبل الأكل بـ 30 دقيقة", "لا فرق"], correct: 2, explanation: "شرب الماء قبل الأكل بـ 30 دقيقة يساعد في تحسين الهضم والشعور بالشبع.", category: "health" },
  { question: "كم ساعة نوم يحتاجها البالغ يومياً للحفاظ على صحته؟", options: ["4-5 ساعات", "6 ساعات", "7-9 ساعات", "10+ ساعات"], correct: 2, explanation: "يحتاج البالغ 7-9 ساعات نوم يومياً. قلة النوم تزيد خطر الأمراض المزمنة.", category: "health" },
  { question: "كم خطوة يُنصح بالمشي يومياً للحفاظ على الصحة؟", options: ["3,000", "5,000", "7,000", "10,000"], correct: 3, explanation: "المشي 10,000 خطوة يومياً يحسن صحة القلب ويقلل خطر السكري والسمنة.", category: "health" },
  { question: "ما كمية الماء الموصى بشربها يومياً للبالغ؟", options: ["4 أكواب", "6 أكواب", "8 أكواب", "12 كوب"], correct: 2, explanation: "يُنصح بشرب 8 أكواب (حوالي 2 لتر) ماء يومياً للحفاظ على ترطيب الجسم.", category: "health" },
  { question: "ما أكثر مصدر خفي للسكر في النظام الغذائي اليومي؟", options: ["الفواكه", "العصائر المعلبة", "الأرز", "الخبز"], correct: 1, explanation: "العصائر المعلبة تحتوي على سكر مضاف أكثر من المشروبات الغازية أحياناً!", category: "health" },
  { question: "كم دقيقة رياضة يومية تكفي للحفاظ على الصحة؟", options: ["10 دقائق", "20 دقيقة", "30 دقيقة", "60 دقيقة"], correct: 2, explanation: "30 دقيقة نشاط بدني معتدل يومياً تكفي لتقليل خطر أمراض القلب بنسبة 35%.", category: "health" },
  { question: "ما تأثير الجلوس لأكثر من 6 ساعات متواصلة؟", options: ["لا تأثير", "آلام ظهر فقط", "يزيد خطر أمراض القلب", "يضعف النظر"], correct: 2, explanation: "الجلوس المطول يزيد خطر أمراض القلب والسكري. قم كل 30 دقيقة للتحرك!", category: "health" },
  { question: "ما أفضل بديل صحي للمشروبات الغازية؟", options: ["عصير معلب", "ماء بالليمون والنعناع", "مشروب طاقة", "قهوة بالسكر"], correct: 1, explanation: "الماء بالليمون والنعناع بديل صحي ومنعش بدون سكريات مضافة.", category: "health" },
  { question: "كم غرام ألياف يحتاجها الجسم يومياً؟", options: ["10 غرام", "15 غرام", "25-30 غرام", "50 غرام"], correct: 2, explanation: "يحتاج الجسم 25-30 غرام ألياف يومياً لتحسين الهضم والشعور بالشبع.", category: "health" },
  // مال
  { question: "ما النسبة المثالية للادخار من الدخل الشهري حسب قاعدة 50/30/20؟", options: ["10%", "15%", "20%", "30%"], correct: 2, explanation: "قاعدة 50/30/20: 50% للاحتياجات، 30% للرغبات، 20% للادخار والاستثمار.", category: "finance" },
  { question: "ما هو صندوق الطوارئ المالي المثالي؟", options: ["راتب شهر واحد", "راتب 3 أشهر", "راتب 3-6 أشهر", "راتب سنة"], correct: 2, explanation: "يُنصح بتوفير ما يعادل 3-6 أشهر من المصاريف كصندوق طوارئ مالي.", category: "finance" },
  { question: "ما أفضل استراتيجية للتعامل مع الديون المتعددة؟", options: ["تجاهلها", "سداد الأصغر أولاً", "سداد الأعلى فائدة أولاً", "اقتراض المزيد"], correct: 2, explanation: "طريقة 'كرة الثلج' (سداد الأعلى فائدة أولاً) توفر أكثر على المدى الطويل.", category: "finance" },
  { question: "كم يوفر تحضير الطعام في المنزل مقارنة بالمطاعم؟", options: ["20%", "40%", "60%", "80%"], correct: 2, explanation: "تحضير الطعام في المنزل يوفر حتى 60% مقارنة بالأكل في المطاعم!", category: "finance" },
  { question: "ما النسبة المثالية لإنفاق الإيجار من الدخل؟", options: ["50%", "40%", "30%", "20%"], correct: 2, explanation: "يُنصح ألا يتجاوز الإيجار 30% من الدخل الشهري لتحقيق توازن مالي.", category: "finance" },
  { question: "ما أول خطوة في التخطيط المالي الشخصي؟", options: ["الاستثمار", "تتبع المصاريف", "فتح حساب بنكي", "شراء عقار"], correct: 1, explanation: "تتبع المصاريف لمدة شهر هو الخطوة الأولى لفهم أين تذهب أموالك وكيف توفر.", category: "finance" },
  { question: "كم تكلفك القهوة اليومية من كافيه سنوياً؟", options: ["3,000 ج.م", "7,000 ج.م", "12,000 ج.م", "18,000+ ج.م"], correct: 3, explanation: "قهوة بـ 50 ج.م يومياً = 18,000+ ج.م سنوياً! حضرها في البيت ووفر أكثر من 15,000 ج.م.", category: "finance" },
  { question: "ما قاعدة 72 في الاستثمار؟", options: ["نسبة الضرائب", "مدة مضاعفة المال", "حد الاقتراض", "نسبة التأمين"], correct: 1, explanation: "قاعدة 72: اقسم 72 على نسبة العائد = عدد السنوات لمضاعفة أموالك. عائد 8% = 9 سنوات.", category: "finance" },
  { question: "ما أكبر خطأ مالي يقع فيه الشباب؟", options: ["عدم الادخار مبكراً", "الإنفاق على التعليم", "فتح حساب بنكي", "العمل بوظيفة واحدة"], correct: 0, explanation: "تأخير الادخار هو أكبر خطأ. البدء مبكراً يمنح أموالك وقتاً أطول للنمو بفضل الفائدة المركبة.", category: "finance" },
  { question: "كم يمكنك توفيره بإلغاء اشتراكات غير مستخدمة؟", options: ["100 ج.م/شهر", "300 ج.م/شهر", "500+ ج.م/شهر", "لا يوجد فرق"], correct: 2, explanation: "الاشتراكات المنسية (تطبيقات، صالات رياضية) تكلف أكثر من 500 ج.م شهرياً في المتوسط!", category: "finance" },
];

const categoryColors = {
  health: "text-destructive",
  finance: "text-accent",
  environment: "text-primary",
};

const getDayIndex = () => {
  const start = new Date("2025-01-01").getTime();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((now - start) / dayMs);
};

const getDailyQuestions = (count: number): Question[] => {
  const dayIndex = getDayIndex();
  const shuffled = [...allQuestions];
  // Seeded shuffle based on day
  let seed = dayIndex * 2654435761;
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

const AwarenessQuiz = () => {
  const t = useT();
  const questions = useMemo(() => getDailyQuestions(10), []);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  const percent = Math.round((score / questions.length) * 100);

  return (
    <section id="quiz" className="px-6 md:px-12 py-24 bg-gradient-to-b from-card to-background">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Brain className="size-6 text-primary" />
            <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">
              {t('quiz.heading')}
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-[50ch] mx-auto leading-relaxed">
            {t('quiz.description')}
          </p>
        </div>

        <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-soft">
          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <div className="text-6xl font-bold text-primary tabular-nums">
                  {percent}%
                </div>
                <p className="text-xl font-bold">
                  {percent >= 80
                    ? t('quiz.resultExcellent')
                    : percent >= 50
                    ? t('quiz.resultGood')
                    : t('quiz.resultLow')}
                </p>
                <p className="text-muted-foreground">
                  {t('quiz.resultScore').replace('{score}', String(score)).replace('{total}', String(questions.length))}
                </p>
                <div>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
                  >
                    <RotateCcw className="size-4" />
                    {t('quiz.retry')}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span className={`font-bold ${categoryColors[q.category]}`}>
                    {t('quiz.category.' + q.category)}
                  </span>
                  <span className="tabular-nums">
                    {currentQ + 1} / {questions.length}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentQ + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>

                <h3 className="text-xl font-bold leading-relaxed">{q.question}</h3>

                <div className="space-y-3">
                  {q.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={answered}
                      className={`w-full text-right p-4 rounded-2xl border-2 font-medium transition-all ${
                        answered
                          ? idx === q.correct
                            ? "border-primary bg-primary/10 text-primary"
                            : idx === selected
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border opacity-50"
                          : selected === idx
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {answered && idx === q.correct && (
                          <CheckCircle className="size-5 text-primary shrink-0" />
                        )}
                        <span>{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-2xl leading-relaxed">
                      💡 {q.explanation}
                    </p>
                    <button
                      onClick={handleNext}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-bold hover:bg-primary/90 transition-colors"
                    >
                      {currentQ + 1 >= questions.length ? t('quiz.showResult') : t('quiz.nextQuestion')}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AwarenessQuiz;
