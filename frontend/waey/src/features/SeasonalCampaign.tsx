import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MoonStar, BookOpenCheck, Sun, CheckCircle2 } from "lucide-react";

type CampaignTab = "ramadan" | "exams" | "summer";

export function SeasonalCampaign() {
  const [activeTab, setActiveTab] = useState<CampaignTab>("ramadan");

  const campaigns = {
    ramadan: {
      title: "دليل الصيام الصحي والتوازن في رمضان 🌙",
      subtitle: "نصائح للحفاظ على طاقتك ورطوبة جسمك خلال الشهر الفضيل",
      icon: <MoonStar className="size-5 text-amber-500" />,
      tips: [
        { title: "تقسيم شرب المياه", text: "وزّع 8 أكواب مياه بين الإفطار والسحور لتجنب الجفاف." },
        { title: "الإفطار التدريجي", text: "ابدأ بالتمر والماء ثم انتظر 10 دقائق قبل الوجبة الرئيسية." },
        { title: "السحور المشبع", text: "تناول البروتين والألياف مثل الفول والزبادي لتقليل الجوع." },
      ],
    },
    exams: {
      title: "دليل التركيز والاستذكار في موسم الامتحانات 📚",
      subtitle: "استراتيجيات تنشيط الذاكرة وتقليل التوتر الامتحاني",
      icon: <BookOpenCheck className="size-5 text-emerald-500" />,
      tips: [
        { title: "تقنية البومودورو", text: "ذاكر 25 دقيقة واسترح 5 دقائق لتجديد نشاط العقل." },
        { title: "أغذية الذاكرة", text: "تناول المكسرات والموز والماء بكثرة لتعزيز التركيز." },
        { title: "النوم الكافي", text: "احرص على 7-8 ساعات نوم قبل يوم الامتحان لترسيخ المعلومات." },
      ],
    },
    summer: {
      title: "تحدي الهيدرات والانتعاش الصيفي ☀️",
      subtitle: "حماية جسمك من إجهاد الحرارة وحفظ الطاقة",
      icon: <Sun className="size-5 text-orange-500" />,
      tips: [
        { title: "مشروبات الانتعاش", text: "إضافة شرايح الليمون والنعناع للمياه لتشجيع الشرب." },
        { title: "تجنب الشمس المباشرة", text: "تقليل الحركة في أوقات الذروة من 12 ظهراً لـ 4 عصراً." },
        { title: "الفواكه الغنية بالماء", text: "تناول البطيخ والخيار يومياً لترطيب طبيعي مضاعف." },
      ],
    },
  };

  const current = campaigns[activeTab];

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm mb-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Calendar className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">الحملات الأدلة الموسمية</h2>
            <p className="text-xs text-muted-foreground">نصائح متجددة حسب الموسم والمناسبات</p>
          </div>
        </div>

        {/* Campaign Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("ramadan")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "ramadan" ? "bg-amber-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <MoonStar className="size-3.5" />
            رمضان
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "exams" ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <BookOpenCheck className="size-3.5" />
            الامتحانات
          </button>
          <button
            onClick={() => setActiveTab("summer")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "summer" ? "bg-orange-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Sun className="size-3.5" />
            الصيف
          </button>
        </div>
      </div>

      {/* Campaign Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/40">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
              {current.icon}
              {current.title}
            </h3>
            <p className="text-xs text-muted-foreground">{current.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {current.tips.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  <h4>{tip.title}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
