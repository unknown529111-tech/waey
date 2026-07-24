import { useT } from "@/contexts/useLanguage";
import { Sunset, Clock, Apple } from "lucide-react";

const SleepHygiene = () => {
  const t = useT();

  const tips = [
    {
      icon: Sunset,
      title: t("sleepHygiene.digitalSunset.title"),
      desc: t("sleepHygiene.digitalSunset.desc"),
      bg: "from-indigo-50 to-transparent dark:from-indigo-900/20",
    },
    {
      icon: Clock,
      title: t("sleepHygiene.powerNap.title"),
      desc: t("sleepHygiene.powerNap.desc"),
      bg: "from-amber-50 to-transparent dark:from-amber-900/20",
    },
    {
      icon: Apple,
      title: t("sleepHygiene.food.title"),
      desc: t("sleepHygiene.food.desc"),
      bg: "from-green-50 to-transparent dark:from-green-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tips.map((tip, i) => (
        <div key={i} className={`bg-gradient-to-br ${tip.bg} bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-0.5`}>
          <tip.icon className="size-7 text-primary mb-3" />
          <h3 className="font-bold text-sm mb-2">{tip.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default SleepHygiene;
