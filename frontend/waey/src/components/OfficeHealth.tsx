import { Eye, Monitor, Ear } from "lucide-react";

const tips = [
  {
    icon: Eye,
    title: "قاعدة 20-20-20 للعين",
    desc: "كل 20 دقيقة قدام الشاشة، ابص على حاجة بعيدة 20 قدم (6 متر) لمدة 20 ثانية. بترتاح عضلات العين وتمنع الجفاف والصداع.",
    bg: "from-blue-50 to-transparent dark:from-blue-900/20",
  },
  {
    icon: Monitor,
    title: "تمرينات كرسي المكتب",
    desc: "١. لف رقبتك ببطء 5 مرات لكل اتجاه. ٢. ضم كتفيك لورا 10 مرات. ٣. قف واجلس ببطء 5 مرات من غير ما تستخدم إيدك. بتمنع حدبة الموبايل (Tech Neck).",
    bg: "from-green-50 to-transparent dark:from-green-900/20",
  },
  {
    icon: Ear,
    title: "الصحة السمعية — قاعدة 60/60",
    desc: "استخدم السماعات على 60% من أقصى صوت لمدة لا تتجاوز 60 دقيقة متواصلة. بعدها خد راحة 10 دقائق. بيحمي أذنك من الطنين وضعف السمع المبكر.",
    bg: "from-purple-50 to-transparent dark:from-purple-900/20",
  },
];

const OfficeHealth = () => (
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

export default OfficeHealth;
