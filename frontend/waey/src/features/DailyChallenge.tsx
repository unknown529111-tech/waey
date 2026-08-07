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
import { useT } from "@/contexts/useLanguage";

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
      className="bg-gradient-to-br from-primary/[0.06] via-card to-accent/10 border border-border/70 border-s-2 border-s-secondary rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-2 text-xs font-bold text-primary mb-4">
        <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-[10px] shadow-sm">
          <Trophy className="size-3.5" />
        </span>
        {t('challenge.title')}
      </div>
      <div className="flex items-start gap-4">
        <div className="text-5xl leading-none">{challenge.emoji}</div>
        <div className="flex-1">
          <p className="text-lg md:text-xl font-bold leading-relaxed mb-2">
            {t(challenge.text)}
          </p>
          <span className="inline-block text-xs bg-secondary/10 text-secondary border border-secondary/25 px-2.5 py-0.5 rounded-full font-bold">
            {t(challenge.area)}
          </span>
        </div>
      </div>
      <button
        onClick={handleDone}
        disabled={done}
        className={`btn mt-5 px-6 py-3 text-sm ${
          done ? "bg-primary/15 text-primary cursor-default" : "btn-moss"
        }`}
      >
        <Check className="size-4" />
        {done ? t('challenge.done') : t('challenge.do')}
      </button>
    </motion.div>
  );
};

export default DailyChallenge;
