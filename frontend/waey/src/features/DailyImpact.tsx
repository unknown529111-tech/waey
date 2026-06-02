import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getDailyValue } from "@/lib/dailyStorage";

const DailyImpact = () => {
  const [impact, setImpact] = useState("");

  useEffect(() => {
    const water = getDailyValue("water");
    const eco = getDailyValue("eco");
    const sleep = getDailyValue("sleep");

    const parts: string[] = [];
    if (water >= 6) parts.push(`شربت مية كفاية (${water}/8)`);
    if (sleep >= 7) parts.push(`نمت كويس (${sleep} ساعات)`);
    if (eco >= 2) parts.push(`عملت ${eco} أفعال بيئية`);

    if (parts.length === 0) setImpact("لسه ما سجلتش حاجة النهارده — ابدأ بأي حاجة صغيرة.");
    else if (parts.length >= 2) setImpact(`النهارده ${parts.join("، و ")}. أنت بتفرق! 👏`);
    else setImpact(`النهارده ${parts[0]}. خطوة كويسة استمر! 💪`);
  }, []);

  return (
    <div className="bg-gradient-to-l from-primary/10 via-leaf-light/20 to-sun-warm/20 rounded-3xl p-5 border border-primary/15">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="size-5 text-accent" />
        <h3 className="font-bold text-sm">أثر اليوم</h3>
      </div>
      <p className="text-sm leading-relaxed">{impact}</p>
    </div>
  );
};

export default DailyImpact;
