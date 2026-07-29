import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle, RotateCcw } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { bumpStreak } from "@/lib/dailyStorage";
import { recordActivity } from "@/lib/gamification";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: "health" | "finance" | "environment";
}

const allQuestions: Question[] = [
  // Questions are stored with numeric keys; actual text comes from t()
  { question: "q1", options: ["q1o1", "q1o2", "q1o3", "q1o4"], correct: 2, explanation: "q1e", category: "environment" },
  { question: "q2", options: ["q2o1", "q2o2", "q2o3", "q2o4"], correct: 1, explanation: "q2e", category: "environment" },
  { question: "q3", options: ["q3o1", "q3o2", "q3o3", "q3o4"], correct: 3, explanation: "q3e", category: "environment" },
  { question: "q4", options: ["q4o1", "q4o2", "q4o3", "q4o4"], correct: 2, explanation: "q4e", category: "environment" },
  { question: "q5", options: ["q5o1", "q5o2", "q5o3", "q5o4"], correct: 3, explanation: "q5e", category: "environment" },
  { question: "q6", options: ["q6o1", "q6o2", "q6o3", "q6o4"], correct: 2, explanation: "q6e", category: "environment" },
  { question: "q7", options: ["q7o1", "q7o2", "q7o3", "q7o4"], correct: 1, explanation: "q7e", category: "environment" },
  { question: "q8", options: ["q8o1", "q8o2", "q8o3", "q8o4"], correct: 3, explanation: "q8e", category: "environment" },
  { question: "q9", options: ["q9o1", "q9o2", "q9o3", "q9o4"], correct: 3, explanation: "q9e", category: "environment" },
  { question: "q10", options: ["q10o1", "q10o2", "q10o3", "q10o4"], correct: 2, explanation: "q10e", category: "environment" },
  // صحة
  { question: "q11", options: ["q11o1", "q11o2", "q11o3", "q11o4"], correct: 1, explanation: "q11e", category: "health" },
  { question: "q12", options: ["q12o1", "q12o2", "q12o3", "q12o4"], correct: 2, explanation: "q12e", category: "health" },
  { question: "q13", options: ["q13o1", "q13o2", "q13o3", "q13o4"], correct: 2, explanation: "q13e", category: "health" },
  { question: "q14", options: ["q14o1", "q14o2", "q14o3", "q14o4"], correct: 3, explanation: "q14e", category: "health" },
  { question: "q15", options: ["q15o1", "q15o2", "q15o3", "q15o4"], correct: 2, explanation: "q15e", category: "health" },
  { question: "q16", options: ["q16o1", "q16o2", "q16o3", "q16o4"], correct: 1, explanation: "q16e", category: "health" },
  { question: "q17", options: ["q17o1", "q17o2", "q17o3", "q17o4"], correct: 2, explanation: "q17e", category: "health" },
  { question: "q18", options: ["q18o1", "q18o2", "q18o3", "q18o4"], correct: 2, explanation: "q18e", category: "health" },
  { question: "q19", options: ["q19o1", "q19o2", "q19o3", "q19o4"], correct: 1, explanation: "q19e", category: "health" },
  { question: "q20", options: ["q20o1", "q20o2", "q20o3", "q20o4"], correct: 2, explanation: "q20e", category: "health" },
  // مال
  { question: "q21", options: ["q21o1", "q21o2", "q21o3", "q21o4"], correct: 2, explanation: "q21e", category: "finance" },
  { question: "q22", options: ["q22o1", "q22o2", "q22o3", "q22o4"], correct: 2, explanation: "q22e", category: "finance" },
  { question: "q23", options: ["q23o1", "q23o2", "q23o3", "q23o4"], correct: 2, explanation: "q23e", category: "finance" },
  { question: "q24", options: ["q24o1", "q24o2", "q24o3", "q24o4"], correct: 2, explanation: "q24e", category: "finance" },
  { question: "q25", options: ["q25o1", "q25o2", "q25o3", "q25o4"], correct: 2, explanation: "q25e", category: "finance" },
  { question: "q26", options: ["q26o1", "q26o2", "q26o3", "q26o4"], correct: 1, explanation: "q26e", category: "finance" },
  { question: "q27", options: ["q27o1", "q27o2", "q27o3", "q27o4"], correct: 3, explanation: "q27e", category: "finance" },
  { question: "q28", options: ["q28o1", "q28o2", "q28o3", "q28o4"], correct: 1, explanation: "q28e", category: "finance" },
  { question: "q29", options: ["q29o1", "q29o2", "q29o3", "q29o4"], correct: 0, explanation: "q29e", category: "finance" },
  { question: "q30", options: ["q30o1", "q30o2", "q30o3", "q30o4"], correct: 2, explanation: "q30e", category: "finance" },
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
  const quizRewarded = useRef(false);

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
      if (!quizRewarded.current) {
        quizRewarded.current = true;
        bumpStreak();
        recordActivity("challenge");
      }
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

                <h3 className="text-xl font-bold leading-relaxed">{t(`quiz.${q.question}`)}</h3>

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
                        <span>{t(`quiz.${opt}`)}</span>
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
                      💡 {t(`quiz.${q.explanation}`)}
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
