import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { bumpStreak, todayKey } from "@/lib/dailyStorage";
import { recordActivity, evaluateBadges } from "@/lib/gamification";
import { getUserId, syncJournalEntry } from "@/lib/supabaseStorage";

const GratitudeJournal = () => {
  const t = useT();
  const today = new Date().toDateString();
  const [text, setText] = useState(() => {
    try { return JSON.parse(localStorage.getItem("waey_gratitude") || "{}")[today] || ""; } catch { return ""; }
  });
  const rewardedRef = useRef(false);

  useEffect(() => {
    if (text.trim().length > 0 && !rewardedRef.current) {
      rewardedRef.current = true;
      bumpStreak();
      recordActivity("gratitude");
      evaluateBadges();
    }
  }, [text]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_gratitude") || "{}");
    stored[today] = text;
    localStorage.setItem("waey_gratitude", JSON.stringify(stored));
    const uid = getUserId();
    if (uid && text.trim()) syncJournalEntry(uid, todayKey(), "gratitude", text);
  }, [text, today]);

  return (
    <div className="bg-card rounded-3xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="size-5 text-accent" />
        <h3 className="font-bold text-sm">{t('daily.gratitude.title')}</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{t('daily.gratitude.desc')}</p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('daily.gratitude.placeholder')}
        className="w-full bg-muted/50 border border-border rounded-2xl p-3 text-sm outline-none focus:border-primary/40 transition-colors"
      />
    </div>
  );
};

export default GratitudeJournal;
