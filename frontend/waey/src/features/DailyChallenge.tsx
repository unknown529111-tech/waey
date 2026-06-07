import { useState } from "react";
import { Check, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import {
  getDailyChallenge,
  isChallengeDone,
  markChallengeDone,
  bumpStreak,
} from "@/lib/dailyStorage";
import { toast } from "sonner";
import { useT } from "@/contexts/LanguageContext";

const DailyChallenge = () => {
  const t = useT();
  const challenge = getDailyChallenge();
  const [done, setDone] = useState(isChallengeDone());

  const handleDone = () => {
    if (done) return;
    markChallengeDone();
    bumpStreak();
    setDone(true);
    toast.success(t('challenge.toast'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border rounded-3xl p-6 md:p-8 shadow-soft"
    >
      <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
        <Trophy className="size-4" />
        {t('challenge.title')}
      </div>
      <div className="flex items-start gap-4">
        <div className="text-5xl">{challenge.emoji}</div>
        <div className="flex-1">
          <p className="text-lg md:text-xl font-bold leading-relaxed mb-1">
            {t(challenge.text)}
          </p>
          <span className="inline-block text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
            {t(challenge.area)}
          </span>
        </div>
      </div>
      <button
        onClick={handleDone}
        disabled={done}
        className={`mt-5 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
          done
            ? "bg-primary/20 text-primary cursor-default"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        <Check className="size-4" />
        {done ? t('challenge.done') : t('challenge.do')}
      </button>
    </motion.div>
  );
};

export default DailyChallenge;
