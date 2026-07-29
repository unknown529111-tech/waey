import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/contexts/useLanguage";

const FACTS_COUNT = 35;

const FACT_EMOJIS = [
  "🚶", "💧", "😴", "🥗", "🧼", "🚭", "🪑",
  "💰", "🛟", "📈", "📊", "💳", "🧺",
  "♻️", "🍽️", "🚰", "💡", "🔌", "🌳", "🧴",
  "🍅", "🧠", "🔄", "👨‍🏫", "🧩", "😴", "🔄",
];

const DidYouKnow = () => {
  const t = useT();
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % FACTS_COUNT);
  const prev = () => setCurrent((c) => (c - 1 + FACTS_COUNT) % FACTS_COUNT);

  return (
    <section className="px-6 md:px-12 py-16">
      <div className="max-w-[800px] mx-auto">
        <motion.div
          className="bg-card rounded-3xl p-8 md:p-12 border border-border text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="size-5 text-accent" />
            <span className="text-sm font-bold text-accent">{t('dYK.title')}</span>
            <Sparkles className="size-5 text-accent" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-4xl block mb-4">{FACT_EMOJIS[current] || "💡"}</span>
              <p className="text-lg md:text-xl font-medium leading-relaxed max-w-[50ch] mx-auto">
                {t(`dYK.fact${current + 1}`)}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="size-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="text-sm text-muted-foreground tabular-nums">
              {current + 1} / {FACTS_COUNT}
            </span>
            <button
              onClick={next}
              className="size-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DidYouKnow;
