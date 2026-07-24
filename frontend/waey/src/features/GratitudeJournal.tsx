import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useT } from "@/contexts/useLanguage";

const GratitudeJournal = () => {
  const t = useT();
  const today = new Date().toDateString();
  const [text, setText] = useState(() => {
    try { return JSON.parse(localStorage.getItem("waey_gratitude") || "{}")[today] || ""; } catch { return ""; }
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("waey_gratitude") || "{}");
    stored[today] = text;
    localStorage.setItem("waey_gratitude", JSON.stringify(stored));
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
