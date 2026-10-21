import { useState } from "react";
import {
  BookOpen,
  Calculator,
  Droplet,
  HeartPulse,
  Leaf,
  Moon,
  Wallet,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import FieldCard from "./FieldCard";
import ToolCard from "./ToolCard";
import TipList from "./TipList";
import StatBand from "./StatBand";
import PageHero from "./PageHero";
import NewsletterBand from "./NewsletterBand";
import ArticleCard from "./ArticleCard";
import ProgressRing from "./ProgressRing";
import StatTile from "./StatTile";

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
  { icon: Moon, title: "حاسبة النوم", description: "احسب ساعات نومك التي تحتاجها.", to: "/insights" },
  { icon: Calculator, title: "حاسبة السعرات", description: "اعرف احتياجك اليومي من الطاقة.", to: "/health" },
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

const ARTICLES = [
  {
    category: "الصحة",
    title: "خمس عادات بسيطة لصحتك اليومية",
    excerpt: "تغييرات صغيرة في روتينك اليومي تصنع فرقًا حقيقيًا في طاقتك ووعيك بجسدك.",
    meta: "1 أكتوبر 2026",
    to: "/insights",
    field: "health" as const,
  },
  {
    category: "المال",
    title: "نصائح ذكية لإدارة مصروفك",
    excerpt: "تعلّم كيف تدير أموالك، تقلّل المصاريف غير الضرورية، وتحقق أهدافك المالية.",
    meta: "28 سبتمبر 2026",
    to: "/insights",
    field: "finance" as const,
  },
  {
    category: "البيئة",
    title: "خطوات صغيرة، أثر كبير على البيئة",
    excerpt: "خيارات يومية بسيطة تساعدك على حماية كوكبك والحفاظ على موارده.",
    meta: "25 سبتمبر 2026",
    to: "/insights",
    field: "environment" as const,
  },
];

const PrimitivesPreview = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        eyebrow="معاينة العناصر"
        title="العناصر الأساسية"
        lead="كل ما تبنيه الصفحات القادمة من هذه القطع: بطاقات، عناوين، أرقام، وحقول — كلها على الرموز نفسها."
        primaryAction={{ label: "ابدأ رحلتك", to: "/health" }}
        secondaryAction={{ label: "استكشف المجالات", to: "/fields" }}
      />

      <div className="mx-auto max-w-[80rem] space-y-16 px-6 pb-16">
        <SectionHeading
          eyebrow="المجالات"
          title="اختر مجالك"
          lead="أربعة مجالات، وخطوة صغيرة واحدة كل يوم."
          action={{ label: "كل المجالات", to: "/fields" }}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FIELDS.map((f) => (
            <FieldCard key={f.field} {...f} />
          ))}
        </div>

        <SectionHeading
          eyebrow="الأدوات"
          title="احسبها بسرعة"
          lead="حاسبات بسيطة تجيب عن سؤال واحد، في دقيقة."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {TOOLS.map((t) => (
            <ToolCard key={t.title} {...t} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            <ProgressRing value={72} label="خطوات اليوم" field="health" />
            <ProgressRing value={45} label="ميزانية الشهر" field="finance" />
            <ProgressRing value={0} label="دروس مقروءة" field="education" />
            <ProgressRing value={100} label="أيام متتالية" field="environment" />
          </div>
          <TipList title="نصائح سريعة" items={TIPS} />
        </div>

        <div className="grid gap-4 rounded-card border border-border bg-card p-6 sm:grid-cols-3">
          <StatTile label="متابعة اليوم" value="12" field="health" />
          <StatTile
            label="المصروف هذا الشهر"
            value="1,240"
            field="finance"
            delta={{ value: "8%", direction: "down" }}
          />
          <StatTile
            label="أيام الالتزام"
            value="24"
            field="environment"
            delta={{ value: "3", direction: "up" }}
          />
        </div>

        <SectionHeading
          eyebrow="أحدث الرؤى"
          title="نصائح وقصص وموارد"
          lead="محتوى عملي يدعمك في رحلتك."
          action={{ label: "كل المقالات", to: "/insights" }}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <ArticleCard key={a.title} {...a} />
          ))}
        </div>

        <button
          onClick={() => setCount((c) => c + 1)}
          className="min-h-11 rounded-full bg-primary px-6 font-bold text-primary-foreground"
        >
          عدّاد {count}
        </button>
      </div>

      <StatBand items={STATS} />

      <NewsletterBand
        heading="اشترك في رسائل وعي"
        description="رسالة واحدة كل أسبوع عن الصحة والمال والبيئة والتعلّم."
        placeholder="أدخل بريدك الإلكتروني"
        buttonLabel="اشترك"
        onSubmit={() => {}}
      />
    </div>
  );
};

export default PrimitivesPreview;
