import { useState, useEffect, useRef } from "react";
import { Moon, Trophy, Lightbulb, Smartphone } from "lucide-react";
import { useT } from "@/contexts/useLanguage";
import { bumpStreak, todayKey } from "@/lib/dailyStorage";
import { recordActivity } from "@/lib/gamification";
import { getUserId, syncJournalEntry, syncScreenOff } from "@/lib/supabaseStorage";

const NightReview = () => {
  const t = useT();
  const today = new Date().toDateString();
  const rewardedRef = useRef(false);
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
    const uid = getUserId();
    if (uid && achievement.trim()) syncJournalEntry(uid, todayKey(), "achievement", achievement);
  }, [achievement, today]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_review_lesson") || "{}");
    stored[today] = lesson;
    localStorage.setItem("waey_review_lesson", JSON.stringify(stored));
    const uid = getUserId();
    if (uid && lesson.trim()) syncJournalEntry(uid, todayKey(), "lesson", lesson);
  }, [lesson, today]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_screens_off") || "{}");
    stored[today] = screensOff;
    localStorage.setItem("waey_screens_off", JSON.stringify(stored));
    const uid = getUserId();
    if (uid) syncScreenOff(uid, todayKey(), screensOff);
  }, [screensOff, today]);

  useEffect(() => {
    if (!rewardedRef.current && (achievement.trim().length > 0 || lesson.trim().length > 0 || screensOff)) {
      rewardedRef.current = true;
      bumpStreak();
      recordActivity("challenge");
    }
  }, [achievement, lesson, screensOff]);

  return (
    <div className="ledger p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <Moon className="size-5 text-primary" />
        <h3 className="font-bold text-sm">{t('daily.nightReview.title')}</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold flex items-center gap-1.5 mb-1.5">
            <Trophy className="size-3.5 text-secondary" /> {t('daily.nightReview.achievement')}
          </label>
          <input value={achievement} onChange={(e) => setAchievement(e.target.value)} placeholder={t('daily.nightReview.achievementPlaceholder')} className="w-full field rounded-2xl p-2.5 text-xs" />
        </div>
        <div>
          <label className="text-xs font-bold flex items-center gap-1.5 mb-1.5">
            <Lightbulb className="size-3.5 text-secondary" /> {t('daily.nightReview.lesson')}
          </label>
          <input value={lesson} onChange={(e) => setLesson(e.target.value)} placeholder={t('daily.nightReview.lessonPlaceholder')} className="w-full field rounded-2xl p-2.5 text-xs" />
        </div>
        <button onClick={() => setScreensOff(!screensOff)} className={`flex items-center gap-2 w-full p-3 rounded-2xl text-xs font-bold transition-all border ${screensOff ? "bg-water-soft/50 border-water/40 text-water" : "field"}`}>
          <Smartphone className="size-4" />
          {screensOff ? t('daily.nightReview.screensOff') : t('daily.nightReview.screensOn')}
        </button>
      </div>
    </div>
  );
};

export default NightReview;
