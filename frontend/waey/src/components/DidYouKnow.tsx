import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const facts = [
  // صحة
  { fact: "المشي 30 دقيقة يومياً يقلل خطر الإصابة بأمراض القلب والسكتة الدماغية بشكل ملحوظ. (منظمة الصحة العالمية)", emoji: "🚶", category: "صحة" },
  { fact: "شرب الماء بانتظام طوال اليوم يحافظ على وظائف الكلى والدماغ ويقلل الإرهاق. (Harvard T.H. Chan School of Public Health)", emoji: "💧", category: "صحة" },
  { fact: "النوم من 7 إلى 9 ساعات يومياً للبالغين يحسّن المناعة والتركيز والمزاج. (CDC)", emoji: "😴", category: "صحة" },
  { fact: "تناول 5 حصص من الفاكهة والخضروات يومياً يقلل خطر الأمراض المزمنة. (WHO)", emoji: "🥗", category: "صحة" },
  { fact: "غسل اليدين بالماء والصابون لمدة 20 ثانية يقلل انتشار العدوى التنفسية بنسبة كبيرة. (CDC)", emoji: "🧼", category: "صحة" },
  { fact: "التدخين هو السبب الأول للوفيات التي يمكن الوقاية منها حول العالم. (WHO)", emoji: "🚭", category: "صحة" },
  { fact: "الجلوس لفترات طويلة يومياً يرتبط بزيادة خطر أمراض القلب حتى لمن يمارسون الرياضة. (Mayo Clinic)", emoji: "🪑", category: "صحة" },

  // مال
  { fact: "قاعدة 50/30/20 تقترح تخصيص 50% للضروريات و30% للرغبات و20% للادخار وسداد الديون. (CFPB - مكتب حماية المستهلك المالي الأمريكي)", emoji: "💰", category: "مال" },
  { fact: "بناء صندوق طوارئ يغطي مصاريف 3 إلى 6 أشهر يحميك من الديون عند الأزمات. (Investopedia)", emoji: "🛟", category: "مال" },
  { fact: "الفائدة المركبة تجعل أموالك تنمو بشكل أسرع كلما بدأت الادخار مبكراً. (U.S. SEC - Investor.gov)", emoji: "📈", category: "مال" },
  { fact: "تتبّع المصروفات اليومية لمدة شهر يكشف عادات إنفاق غير ضرورية يمكن تقليلها. (NerdWallet)", emoji: "📊", category: "مال" },
  { fact: "سداد ديون البطاقات الائتمانية أولاً يوفّر مبالغ كبيرة بسبب ارتفاع فوائدها. (Federal Reserve)", emoji: "💳", category: "مال" },
  { fact: "تنويع الاستثمارات بين أصول مختلفة يقلل المخاطر على المدى الطويل. (U.S. SEC)", emoji: "🧺", category: "مال" },

  // بيئة
  { fact: "إعادة تدوير علبة ألمنيوم واحدة توفر طاقة كافية لتشغيل التلفاز لحوالي 3 ساعات. (U.S. EPA)", emoji: "♻️", category: "بيئة" },
  { fact: "حوالي ثلث الطعام المنتج عالمياً يُهدر سنوياً، وهو ما يعادل 1.3 مليار طن. (FAO - منظمة الأغذية والزراعة)", emoji: "🍽️", category: "بيئة" },
  { fact: "إغلاق صنبور الماء أثناء تنظيف الأسنان يوفر حتى 30 لتر ماء يومياً للفرد. (EPA WaterSense)", emoji: "🚰", category: "بيئة" },
  { fact: "استبدال مصباح تقليدي بمصباح LED يوفر حتى 75% من الطاقة ويعمر أطول بكثير. (U.S. Department of Energy)", emoji: "💡", category: "بيئة" },
  { fact: "الأجهزة الكهربائية في وضع الاستعداد (Standby) تستهلك حتى 10% من فاتورة الكهرباء. (IEA - وكالة الطاقة الدولية)", emoji: "🔌", category: "بيئة" },
  { fact: "زراعة الأشجار من أكثر الحلول فعالية لامتصاص ثاني أكسيد الكربون من الجو. (UNEP - برنامج الأمم المتحدة للبيئة)", emoji: "🌳", category: "بيئة" },
  { fact: "البلاستيك يحتاج مئات السنين ليتحلل في الطبيعة، وإعادة تدويره تقلل التلوث بشكل كبير. (UNEP)", emoji: "🧴", category: "بيئة" },

  // تعليم
  { fact: "تقنية بومودورو (25 دقيقة تركيز + 5 دقائق راحة) ترفع الإنتاجية بنسبة تصل إلى 40% مقارنة بالمذاكرة المتواصلة.", emoji: "🍅", category: "تعليم" },
  { fact: "الاستدعاء النشط (Active Recall) يثبت المعلومة في الذاكرة أضعاف مجرد إعادة القراءة. (Science Magazine)", emoji: "🧠", category: "تعليم" },
  { fact: "المراجعة المتباعدة (Spaced Repetition) تحسّن الاحتفاظ بالمعلومات بنسبة 50% أكثر من المذاكرة المكثفة. (Nature)", emoji: "🔄", category: "تعليم" },
  { fact: "الطلاب اللي بيشرحوا اللي ذاكروه لغيرهم (تأثير فينمان) بيفهموا أعمق بنسبة 90%. (MIT)", emoji: "👨‍🏫", category: "تعليم" },
  { fact: "تقسيم المهام الكبيرة لمهام صغيرة (Chunking) يقلل الضغط ويسهل البدء في المذاكرة. (APA)", emoji: "🧩", category: "تعليم" },
  { fact: "النوم بعد المذاكرة مباشرة يحسّن تثبيت المعلومات في الذاكرة طويلة المدى بنسبة 40%. (Harvard Medical School)", emoji: "😴", category: "تعليم" },
  { fact: "تغيير مكان المذاكرة كل فترة ينشط الدماغ ويزيد الاحتفاظ بالمعلومات مقارنة بمكان ثابت. (Princeton University)", emoji: "🔄", category: "تعليم" },
];

const DidYouKnow = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % facts.length);
  const prev = () => setCurrent((c) => (c - 1 + facts.length) % facts.length);

  const f = facts[current];

  return (
    <section className="px-6 md:px-12 py-16">
      <div className="max-w-[800px] mx-auto">
        <motion.div
          className="bg-card rounded-3xl p-8 md:p-12 border border-border text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="size-5 text-accent" />
            <span className="text-sm font-bold text-accent">هل تعلم؟</span>
            <Sparkles className="size-5 text-accent" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-4xl block mb-4">{f.emoji}</span>
              <p className="text-lg md:text-xl font-medium leading-relaxed max-w-[50ch] mx-auto">
                {f.fact}
              </p>
              <span className="inline-block mt-4 text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                {f.category}
              </span>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="size-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="text-sm text-muted-foreground tabular-nums">
              {current + 1} / {facts.length}
            </span>
            <button
              onClick={next}
              className="size-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DidYouKnow;
