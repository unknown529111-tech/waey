import { useT } from "@/contexts/LanguageContext";
import { Eye, Monitor, Ear } from "lucide-react";

const OfficeHealth = () => {
  const t = useT();

  const tips = [
    {
      icon: Eye,
      title: t("officeHealth.tip1.title"),
      desc: t("officeHealth.tip1.desc"),
      bg: "from-blue-50 to-transparent dark:from-blue-900/20",
    },
    {
      icon: Monitor,
      title: t("officeHealth.tip2.title"),
      desc: t("officeHealth.tip2.desc"),
      bg: "from-green-50 to-transparent dark:from-green-900/20",
    },
    {
      icon: Ear,
      title: t("officeHealth.tip3.title"),
      desc: t("officeHealth.tip3.desc"),
      bg: "from-purple-50 to-transparent dark:from-purple-900/20",
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

export default OfficeHealth;
