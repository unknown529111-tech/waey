import { useState, useEffect } from "react";
import { Moon, Trophy, Lightbulb, Smartphone } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

const NightReview = () => {
  const t = useT();
  const today = new Date().toDateString();
  const [achievement, setAchievement] = useState(() => {
    try { return JSON.parse(localStorage.getItem("waey_review_achievement") || "{}")[today] || ""; } catch { return ""; }
  });
  const [lesson, setLesson] = useState(() => {
    try { return JSON.parse(localStorage.getItem("waey_review_lesson") || "{}")[today] || ""; } catch { return ""; }
  });
  const [screensOff, setScreensOff] = useState(() => {
    try { return JSON.parse(localStorage.getItem("waey_screens_off") || "{}")[today] || false; } catch { return false; }
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_review_achievement") || "{}");
    stored[today] = achievement;
    localStorage.setItem("waey_review_achievement", JSON.stringify(stored));
  }, [achievement, today]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_review_lesson") || "{}");
    stored[today] = lesson;
    localStorage.setItem("waey_review_lesson", JSON.stringify(stored));
  }, [lesson, today]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_screens_off") || "{}");
    stored[today] = screensOff;
    localStorage.setItem("waey_screens_off", JSON.stringify(stored));
  }, [screensOff, today]);

  return (
    <div className="bg-card rounded-3xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Moon className="size-5 text-indigo-500" />
        <h3 className="font-bold text-sm">{t('daily.nightReview.title')}</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold flex items-center gap-1.5 mb-1.5">
            <Trophy className="size-3.5 text-accent" /> {t('daily.nightReview.achievement')}
          </label>
          <input value={achievement} onChange={(e) => setAchievement(e.target.value)} placeholder={t('daily.nightReview.achievementPlaceholder')} className="w-full bg-muted/50 border border-border rounded-2xl p-2.5 text-xs outline-none focus:border-primary/40 transition-colors" />
        </div>
        <div>
          <label className="text-xs font-bold flex items-center gap-1.5 mb-1.5">
            <Lightbulb className="size-3.5 text-yellow-500" /> {t('daily.nightReview.lesson')}
          </label>
          <input value={lesson} onChange={(e) => setLesson(e.target.value)} placeholder={t('daily.nightReview.lessonPlaceholder')} className="w-full bg-muted/50 border border-border rounded-2xl p-2.5 text-xs outline-none focus:border-primary/40 transition-colors" />
        </div>
        <button onClick={() => setScreensOff(!screensOff)} className={`flex items-center gap-2 w-full p-3 rounded-2xl text-xs font-bold transition-all ${screensOff ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" : "bg-secondary text-muted-foreground"}`}>
          <Smartphone className="size-4" />
          {screensOff ? t('daily.nightReview.screensOff') : t('daily.nightReview.screensOn')}
        </button>
      </div>
    </div>
  );
};

export default NightReview;
