import { useT } from "@/contexts/useLanguage";
import { Heart, AlertTriangle, Activity } from "lucide-react";

const FirstAidGuide = () => {
  const t = useT();

  const emergencies = [
    {
      icon: AlertTriangle,
      title: t("firstAid.burns.title"),
      steps: [
        t("firstAid.burns.step1"),
        t("firstAid.burns.step2"),
        t("firstAid.burns.step3"),
        t("firstAid.burns.step4"),
      ],
      color: "text-red-500",
      bg: "from-red-50 to-transparent dark:from-red-900/20",
    },
    {
      icon: Activity,
      title: t("firstAid.choking.title"),
      steps: [
        t("firstAid.choking.step1"),
        t("firstAid.choking.step2"),
        t("firstAid.choking.step3"),
        t("firstAid.choking.step4"),
      ],
      color: "text-orange-500",
      bg: "from-orange-50 to-transparent dark:from-orange-900/20",
    },
    {
      icon: Heart,
      title: t("firstAid.sugarDrop.title"),
      steps: [
        t("firstAid.sugarDrop.step1"),
        t("firstAid.sugarDrop.step2"),
        t("firstAid.sugarDrop.step3"),
        t("firstAid.sugarDrop.step4"),
      ],
      color: "text-primary",
      bg: "from-primary/5 to-transparent dark:from-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {emergencies.map((e, i) => (
        <div key={i} className={`bg-gradient-to-br ${e.bg} bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-0.5`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <e.icon className={`size-5 ${e.color}`} />
            </div>
            <h3 className="font-bold text-sm">{e.title}</h3>
          </div>
          <ul className="space-y-2.5">
            {e.steps.map((step, j) => (
              <li key={j} className="flex gap-2 text-xs leading-relaxed">
                <span className="shrink-0 size-5 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {j + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FirstAidGuide;
