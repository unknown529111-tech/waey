import { useT } from "@/contexts/useLanguage";
import { Smartphone, Bell } from "lucide-react";

const DigitalWellness = () => {
  const t = useT();

  const items = [
    {
      icon: Smartphone,
      title: t("digitalWellness.dopamine.title"),
      desc: t("digitalWellness.dopamine.desc"),
      bg: "from-rose-50 to-transparent dark:from-rose-900/20",
    },
    {
      icon: Bell,
      title: t("digitalWellness.cleanup.title"),
      desc: t("digitalWellness.cleanup.desc"),
      bg: "from-teal-50 to-transparent dark:from-teal-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className={`bg-gradient-to-br ${item.bg} bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-0.5`}>
          <item.icon className="size-7 text-primary mb-3" />
          <h3 className="font-bold text-sm mb-2">{item.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default DigitalWellness;
