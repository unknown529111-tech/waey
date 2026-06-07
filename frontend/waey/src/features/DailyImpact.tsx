import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getDailyValue } from "@/lib/dailyStorage";
import { useT } from "@/contexts/LanguageContext";

const DailyImpact = () => {
  const t = useT();
  const [impact, setImpact] = useState("");

  useEffect(() => {
    const water = getDailyValue("water");
    const eco = getDailyValue("eco");
    const sleep = getDailyValue("sleep");

    const parts: string[] = [];
    if (water >= 6) parts.push(t('impact.water').replace('{n}', String(water)).replace('{max}', '8'));
    if (sleep >= 7) parts.push(t('impact.sleep').replace('{n}', String(sleep)));
    if (eco >= 2) parts.push(t('impact.eco').replace('{n}', String(eco)));

    if (parts.length === 0) setImpact(t('impact.empty'));
    else if (parts.length >= 2) setImpact(t('impact.multiple').replace('{parts}', parts.join(t('impact.join'))));
    else setImpact(t('impact.single').replace('{part}', parts[0]));
  }, [t]);

  return (
    <div className="bg-gradient-to-l from-primary/10 via-leaf-light/20 to-sun-warm/20 rounded-3xl p-5 border border-primary/15">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="size-5 text-accent" />
        <h3 className="font-bold text-sm">{t('impact.title')}</h3>
      </div>
      <p className="text-sm leading-relaxed">{impact}</p>
    </div>
  );
};

export default DailyImpact;
