import { Droplets, Footprints, Apple, Bed } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const allTips = [
  // Week 1
  [
    { icon: Droplets, category: "الماء أولاً", tip: "اشرب كوباية مية أول ما تصحى من النوم — بتطرد سموم الجسم وتنشط الدورة الدموية فوراً.", color: "text-primary" },
    { icon: Footprints, category: "الحركة البسيطة", tip: "امش 10 دقايق بعد الأكل. بيساعد على الهضم ويمنع تخزين الدهون ويحسن السكر في الدم.", color: "text-accent" },
    { icon: Apple, category: "تقليل السكر", tip: "استبدل المشروبات الغازية بماء مع شرائح الليمون. تقليل السكر يحسن طاقتك ومزاجك خلال أسبوع واحد.", color: "text-destructive" },
    { icon: Bed, category: "النوم الكافي", tip: "النوم 7-8 ساعات مش ترف — هو وقت صيانة جسمك. الحرمان من النوم بيأثر على المناعة والذاكرة.", color: "text-primary" },
  ],
  // Week 2
  [
    { icon: Droplets, category: "الترطيب المستمر", tip: "وزع شرب المية على اليوم مش مرة واحدة. كوباية كل ساعة أحسن من لتر مرة واحدة.", color: "text-primary" },
    { icon: Footprints, category: "الجلوس الطويل", tip: "قف كل ساعة لمدة 5 دقايق. الجلوس المستمر بيزود خطر الأمراض القلبية حتى لو بتتمرن.", color: "text-accent" },
    { icon: Apple, category: "فطار ملكي", tip: "وجبة إفطار صحية كل صباح تحسن التركيز وتقلل الرغبة في الأكل السريع بنسبة 50%.", color: "text-destructive" },
    { icon: Bed, category: "الضوء الأزرق", tip: "قلل استخدام الموبايل قبل النوم بساعة. الضوء الأزرق بيكتم هرمون النوم ويخلي نومك تقيل.", color: "text-primary" },
  ],
  // Week 3
  [
    { icon: Droplets, category: "الماء والتركيز", tip: "جفاف خفيف في الجسم بيقلل التركيز والأداء الذهني بنسبة 20%. حافظ على المية طول اليوم.", color: "text-primary" },
    { icon: Footprints, category: "المشي والدماغ", tip: "المشي 30 دقيقة يومياً بيحسن المزاج ويقلل خطر الأمراض المزمنة بنسبة 40%.", color: "text-accent" },
    { icon: Apple, category: "الوجبات الصغيرة", tip: "كل 3-4 ساعات وجبة صغيرة بدل وجبتين كبيرتين. بيثبت السكر ويمنع الخمول.", color: "text-destructive" },
    { icon: Bed, category: "مواعيد النوم", tip: "نام وقوم في نفس الوقت كل يوم — حتى في الإجازة. الجسم بيعشق الروتين.", color: "text-primary" },
  ],
  // Week 4
  [
    { icon: Droplets, category: "الماء والبشرة", tip: "الماء مش بس للشرب — غسل الوش بمية باردة الصبح ينعش البشرة ويحسن الدورة الدموية.", color: "text-primary" },
    { icon: Footprints, category: "الدرج بدل المصعد", tip: "استخدام الدرج بدل المصعد لمدة دقيقة واحدة يحرق 10 سعرات وينشط القلب.", color: "text-accent" },
    { icon: Apple, category: "أكل بيتي", tip: "الطبخ في البيت يخليك تتحكم في الزيت والملح والسكر — ويوفر فلوس كمان.", color: "text-destructive" },
    { icon: Bed, category: "النوم والمناعة", tip: "النوم الكافي بيقوي المناعة. اللي بينام أقل من 6 ساعات أكثر عرضة للبرد والأنفلونزا.", color: "text-primary" },
  ],
];

const getWeekIndex = () => {
  const start = new Date("2025-01-01").getTime();
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((now - start) / weekMs) % allTips.length;
};

const QuickTips = () => {
  const [weekIndex, setWeekIndex] = useState(getWeekIndex);
  const tips = allTips[weekIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setWeekIndex(getWeekIndex());
    }, 60 * 60 * 1000); // check every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="tips" className="bg-card rounded-t-[3rem] px-6 md:px-12 py-24">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight mb-4">
            نصائح سريعة
          </h2>
          <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto leading-relaxed">
            قطرات يومية من الوعي تروي عقلك. نصائح مركزة تتجدد كل أسبوع!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tips.map((tip, i) => (
            <motion.div
              key={`${weekIndex}-${tip.category}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-start gap-5 p-6 bg-card rounded-3xl border border-border"
            >
              <div className="size-10 bg-card rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <tip.icon className={`size-5 ${tip.color}`} />
              </div>
              <div>
                <h4 className="font-bold mb-2">{tip.category}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.tip}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickTips;
