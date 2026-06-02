import { Heart, AlertTriangle, Activity } from "lucide-react";

const emergencies = [
  {
    icon: AlertTriangle,
    title: "حروق",
    steps: ["اجري المية الباردة على المكان 10–20 دقيقة — مش معجون أسنان ولا زيت!", "غطي الحرق بشاش نظيف مش قطن.", "ماتكسرش الفقاعات لو ظهرت.", "لو الحرق كبير أو في الوجه اتصل بالإسعاف فوراً."],
    color: "text-red-500",
    bg: "from-red-50 to-transparent dark:from-red-900/20",
  },
  {
    icon: Activity,
    title: "اختناق بأكل",
    steps: ["قف ورا الشخص وحط إيدك على بطنه.", "ضغطات سريعة لداخل وفوق (مناورة هيمليك).", "كرر لل 5 مرات — في اتجاه بطني سريع.", "لو فقد وعيه اتصل بالإسعاف وابدأ الضغط على الصدر."],
    color: "text-orange-500",
    bg: "from-orange-50 to-transparent dark:from-orange-900/20",
  },
  {
    icon: Heart,
    title: "هبوط سكر أو ضغط",
    steps: ["لو حاسس بدوخة/عرق/رجفة: اشرب عصير أو كل حاجة سكرية.", "لو ضغطك نازل مع ألم في الصدر: استلقِ وارفع رجلك.", "لو هتغمى عليك: حط راسك بين ركبتك.", "لو الحالة متكررة أو خطيرة: اتصل بالطوارئ."],
    color: "text-primary",
    bg: "from-primary/5 to-transparent dark:from-primary/10",
  },
];

const FirstAidGuide = () => (
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

export default FirstAidGuide;
