import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Headphones, BookOpen, Hand, ArrowLeft, RotateCcw } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

type Style = "visual" | "auditory" | "readwrite" | "kinesthetic" | null;

interface Question {
  text: string;
  options: { text: string; style: Style }[];
}

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

const VarkTest = () => {
  const t = useT();
  const [step, setStep] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, number>>({
    visual: 0, auditory: 0, readwrite: 0, kinesthetic: 0,
  });
  const [result, setResult] = useState<Style>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const questions: Question[] = [
    {
      text: t('vark.q1.text'),
      options: [
        { text: t('vark.q1.o1'), style: "visual" },
        { text: t('vark.q1.o2'), style: "auditory" },
        { text: t('vark.q1.o3'), style: "readwrite" },
        { text: t('vark.q1.o4'), style: "kinesthetic" },
      ],
    },
    {
      text: t('vark.q2.text'),
      options: [
        { text: t('vark.q2.o1'), style: "visual" },
        { text: t('vark.q2.o2'), style: "auditory" },
        { text: t('vark.q2.o3'), style: "readwrite" },
        { text: t('vark.q2.o4'), style: "kinesthetic" },
      ],
    },
    {
      text: t('vark.q3.text'),
      options: [
        { text: t('vark.q3.o1'), style: "visual" },
        { text: t('vark.q3.o2'), style: "auditory" },
        { text: t('vark.q3.o3'), style: "readwrite" },
        { text: t('vark.q3.o4'), style: "kinesthetic" },
      ],
    },
    {
      text: t('vark.q4.text'),
      options: [
        { text: t('vark.q4.o1'), style: "visual" },
        { text: t('vark.q4.o2'), style: "auditory" },
        { text: t('vark.q4.o3'), style: "readwrite" },
        { text: t('vark.q4.o4'), style: "kinesthetic" },
      ],
    },
    {
      text: t('vark.q5.text'),
      options: [
        { text: t('vark.q5.o1'), style: "visual" },
        { text: t('vark.q5.o2'), style: "auditory" },
        { text: t('vark.q5.o3'), style: "readwrite" },
        { text: t('vark.q5.o4'), style: "kinesthetic" },
      ],
    },
    {
      text: t('vark.q6.text'),
      options: [
        { text: t('vark.q6.o1'), style: "visual" },
        { text: t('vark.q6.o2'), style: "auditory" },
        { text: t('vark.q6.o3'), style: "readwrite" },
        { text: t('vark.q6.o4'), style: "kinesthetic" },
      ],
    },
    {
      text: t('vark.q7.text'),
      options: [
        { text: t('vark.q7.o1'), style: "visual" },
        { text: t('vark.q7.o2'), style: "auditory" },
        { text: t('vark.q7.o3'), style: "readwrite" },
        { text: t('vark.q7.o4'), style: "kinesthetic" },
      ],
    },
    {
      text: t('vark.q8.text'),
      options: [
        { text: t('vark.q8.o1'), style: "visual" },
        { text: t('vark.q8.o2'), style: "auditory" },
        { text: t('vark.q8.o3'), style: "readwrite" },
        { text: t('vark.q8.o4'), style: "kinesthetic" },
      ],
    },
    {
      text: t('vark.q9.text'),
      options: [
        { text: t('vark.q9.o1'), style: "visual" },
        { text: t('vark.q9.o2'), style: "auditory" },
        { text: t('vark.q9.o3'), style: "readwrite" },
        { text: t('vark.q9.o4'), style: "kinesthetic" },
      ],
    },
    {
      text: t('vark.q10.text'),
      options: [
        { text: t('vark.q10.o1'), style: "visual" },
        { text: t('vark.q10.o2'), style: "auditory" },
        { text: t('vark.q10.o3'), style: "readwrite" },
        { text: t('vark.q10.o4'), style: "kinesthetic" },
      ],
    },
  ];

  const labels: Record<string, string> = {
    visual: t('vark.label.visual'),
    auditory: t('vark.label.auditory'),
    readwrite: t('vark.label.readwrite'),
    kinesthetic: t('vark.label.kinesthetic'),
  };

  const advice: Record<string, { strategies: string[]; improve: string[] }> = {
    visual: {
      strategies: [
        t('vark.advice.visual.s1'),
        t('vark.advice.visual.s2'),
        t('vark.advice.visual.s3'),
        t('vark.advice.visual.s4'),
        t('vark.advice.visual.s5'),
        t('vark.advice.visual.s6'),
      ],
      improve: [
        t('vark.advice.visual.i1'),
        t('vark.advice.visual.i2'),
        t('vark.advice.visual.i3'),
      ],
    },
    auditory: {
      strategies: [
        t('vark.advice.auditory.s1'),
        t('vark.advice.auditory.s2'),
        t('vark.advice.auditory.s3'),
        t('vark.advice.auditory.s4'),
        t('vark.advice.auditory.s5'),
        t('vark.advice.auditory.s6'),
      ],
      improve: [
        t('vark.advice.auditory.i1'),
        t('vark.advice.auditory.i2'),
        t('vark.advice.auditory.i3'),
      ],
    },
    readwrite: {
      strategies: [
        t('vark.advice.readwrite.s1'),
        t('vark.advice.readwrite.s2'),
        t('vark.advice.readwrite.s3'),
        t('vark.advice.readwrite.s4'),
        t('vark.advice.readwrite.s5'),
        t('vark.advice.readwrite.s6'),
      ],
      improve: [
        t('vark.advice.readwrite.i1'),
        t('vark.advice.readwrite.i2'),
        t('vark.advice.readwrite.i3'),
      ],
    },
    kinesthetic: {
      strategies: [
        t('vark.advice.kinesthetic.s1'),
        t('vark.advice.kinesthetic.s2'),
        t('vark.advice.kinesthetic.s3'),
        t('vark.advice.kinesthetic.s4'),
        t('vark.advice.kinesthetic.s5'),
        t('vark.advice.kinesthetic.s6'),
      ],
      improve: [
        t('vark.advice.kinesthetic.i1'),
        t('vark.advice.kinesthetic.i2'),
        t('vark.advice.kinesthetic.i3'),
      ],
    },
  };

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
          <h3 className="text-2xl font-bold mb-1">{t('vark.result.heading')}</h3>
          <p className={`text-xl font-bold ${colors[result]}`}>{labels[result]}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              {t('vark.result.strategyTitle')}
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
              {t('vark.result.improveTitle')}
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
          {t('vark.result.restart')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl p-6 md:p-8 border border-border bg-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">{t('vark.title')}</h3>
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
