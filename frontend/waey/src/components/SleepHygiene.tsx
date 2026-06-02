import { Sunset, Clock, Apple } from "lucide-react";

const tips = [
  {
    icon: Sunset,
    title: "غروب الشمس الرقمي (Digital Sunset)",
    desc: "قبل النوم بساعة: خفف إضاءة الشاشات، ابعد الموبايل بره الأوضة، اقرا كتاب ورقي أو سمع بودكاست هادي. الضوء الأزرق بيكتم هرمون النوم (الميلاتونين).",
    bg: "from-indigo-50 to-transparent dark:from-indigo-900/20",
  },
  {
    icon: Clock,
    title: "القيلولة الاستراتيجية (Power Nap)",
    desc: "20 دقيقة بالظبط — مش أكتر. بتشحن طاقتك وبتصحي بريقان من غير ما تدخل في نوم عميق. أكتر من 30 دقيقة وهتصحى كسلان ومش قادر تتحرك.",
    bg: "from-amber-50 to-transparent dark:from-amber-900/20",
  },
  {
    icon: Apple,
    title: "أكلات بتنام وأكلات بتصحى",
    desc: "قبل النوم: ينّسون، حليب دافي، موز. بالليل ممنوع: شوكولاتة، أكل دسم، كافيين بعد العصر (الساعة 4). دول بيخربوا جودة النوم.",
    bg: "from-green-50 to-transparent dark:from-green-900/20",
  },
];

const SleepHygiene = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {tips.map((t, i) => (
      <div key={i} className={`bg-gradient-to-br ${t.bg} bg-card rounded-3xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-0.5`}>
        <t.icon className="size-7 text-primary mb-3" />
        <h3 className="font-bold text-sm mb-2">{t.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
      </div>
    ))}
  </div>
);

export default SleepHygiene;
