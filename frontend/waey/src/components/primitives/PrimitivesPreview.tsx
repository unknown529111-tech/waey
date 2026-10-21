import { useState } from "react";
import { Droplet, Leaf, Moon, Wallet, BookOpen, Calculator, HeartPulse } from "lucide-react";
import SectionHeading from "./SectionHeading";
import FieldCard from "./FieldCard";
import ToolCard from "./ToolCard";
import TipList from "./TipList";
import StatBand from "./StatBand";

const FIELDS = [
  {
    field: "health" as const,
    title: "صحتك تبدأ بخطوة",
    description: "ماء، نوم، حركة، ووزن — تتبّع يومك الصحي بوضوح.",
    to: "/health",
    icon: HeartPulse,
  },
  {
    field: "finance" as const,
    title: "مالك بوعي",
    description: "اعرف أين يذهب كل جنيه قبل أن ينتهي الشهر.",
    to: "/finance",
    icon: Wallet,
  },
  {
    field: "environment" as const,
    title: "بيئة تستاهل العناية",
    description: "عادات بسيطة تخفّض استهلاكك وتُحسّن حياتك.",
    to: "/environment",
    icon: Leaf,
  },
  {
    field: "education" as const,
    title: "تعلّم بلا ضغط",
    description: "درس قصير واحد كل يوم، وخطوة بخطوة.",
    to: "/education",
    icon: BookOpen,
  },
];

const TOOLS = [
  { icon: Droplet, title: "حاسبة الماء", description: "كم كوباً تحتاج يومك؟", to: "/health" },
  { icon: Moon, title: "حاسبة النوم", description: "احسب ساعات نومك اللي محتاجها.", to: "/insights" },
  { icon: Calculator, title: "حاسبة السعرات", description: "اعرف احتياجك اليومي.", to: "/health" },
];

const TIPS = [
  "اشرب كوب ماء قبل كل وجبة.",
  "امشِ عشر دقائق بعد الغداء.",
  "اكتب مصروفك اليومي قبل النوم.",
  "اقرأ عشر صفحات قبل النوم.",
];

const STATS = [
  { value: "14", label: "متابعة يومية" },
  { value: "4", label: "مجالات الوعي" },
  { value: "100%", label: "بياناتك عندك" },
  { value: "0", label: "إعلانات" },
];

const PrimitivesPreview = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[80rem] space-y-16 px-6 py-16">
        <SectionHeading
          eyebrow="معاينة"
          title="العناصر الأساسية"
          lead="كل ما تبنيه الصفحات القادمة من هذه القطع."
          action={{ label: "الرئيسية", to: "/" }}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FIELDS.map((f) => (
            <FieldCard key={f.field} {...f} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-3">
            {TOOLS.map((t) => (
              <ToolCard key={t.title} {...t} />
            ))}
          </div>
          <TipList title="نصائح سريعة" items={TIPS} />
        </div>

        <StatBand items={STATS} />

        <button
          onClick={() => setCount((c) => c + 1)}
          className="min-h-11 rounded-full bg-primary px-6 font-bold text-primary-foreground"
        >
          عدّاد {count}
        </button>
      </div>
    </div>
  );
};

export default PrimitivesPreview;
