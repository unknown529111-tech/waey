import { Stethoscope } from "lucide-react";

const checkups = [
  { test: "صورة دم كاملة (CBC)", gender: "الكل", freq: "سنوياً" },
  { test: "فيتامين د (Vitamin D)", gender: "الكل", freq: "سنوياً" },
  { test: "سكر تراكمي (HbA1c)", gender: "الكل", freq: "سنوياً بعد الـ 30" },
  { test: "دهون وضغط الدم", gender: "الكل", freq: "سنوياً" },
  { test: "سرطان الثدي (ماموجرام)", gender: "للنساء", freq: "كل سنتين بعد الـ 40" },
  { test: "البروستاتا (PSA)", gender: "للرجال", freq: "سنوياً بعد الـ 45" },
  { test: "نظافة الأسنان", gender: "الكل", freq: "كل 6 شهور" },
  { test: "وظائف كبد وكلية", gender: "الكل", freq: "سنوياً" },
];

const CheckupsTable = () => (
  <div className="bg-card rounded-3xl p-6 md:p-8 border border-border">
    <div className="flex items-center gap-3 mb-5">
      <Stethoscope className="size-6 text-primary" />
      <div>
        <h3 className="font-bold text-lg">جدول صيانة جسمك</h3>
        <p className="text-xs text-muted-foreground">زي ما بتعمل صيانة للعربية — أهم التحاليل والمعاينات الدورية</p>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-right py-3 px-2 font-bold">التحليل / الفحص</th>
            <th className="text-right py-3 px-2 font-bold">الفئة</th>
            <th className="text-right py-3 px-2 font-bold">التكرار</th>
          </tr>
        </thead>
        <tbody>
          {checkups.map((c, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className="py-3 px-2 text-sm">{c.test}</td>
              <td className="py-3 px-2">
                <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${
                  c.gender === "الكل" ? "bg-primary/10 text-primary" :
                  c.gender.includes("نساء") ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" :
                  "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                }`}>{c.gender}</span>
              </td>
              <td className="py-3 px-2 text-sm text-muted-foreground">{c.freq}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default CheckupsTable;
