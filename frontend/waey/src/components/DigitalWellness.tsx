import { Smartphone, Bell } from "lucide-react";

const items = [
  {
    icon: Smartphone,
    title: "صيام الدوبامين (Dopamine Detox)",
    desc: "الريلز والتيك توك بيبوظوا الدوبامين في دماغك — بتدمن السرعة وبتزهق من المذاكرة والشغل بسرعة. جرب يوم واحد في الأسبوع من غير سوشيال ميديا. هتحس بفرق في التركيز والطاقة.",
    bg: "from-rose-50 to-transparent dark:from-rose-900/20",
  },
  {
    icon: Bell,
    title: "تنظيف البيئة الرقمية",
    desc: "إلغاء متابعة الحسابات اللي بتحسسك بالنقص أو بتوترك. إخفاء الإشعارات الحمرا من على وش الموبايل. الـ Notification الواحد بياخد من وقتك 15 دقيقة من التشتيت.",
    bg: "from-teal-50 to-transparent dark:from-teal-900/20",
  },
];

const DigitalWellness = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {items.map((t, i) => (
      <div key={i} className={`bg-gradient-to-br ${t.bg} bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-0.5`}>
        <t.icon className="size-7 text-primary mb-3" />
        <h3 className="font-bold text-sm mb-2">{t.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
      </div>
    ))}
  </div>
);

export default DigitalWellness;
