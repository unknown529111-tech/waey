import { useState } from "react";
import { Flame } from "lucide-react";

const CalorieCalculator = () => {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(25);
  const [activity, setActivity] = useState(1.55);

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = Math.round(bmr * activity);

  const activityLevels = [
    { value: 1.2, label: "خامل", desc: "بدون رياضة" },
    { value: 1.375, label: "خفيف", desc: "1-3 أيام/أسبوع" },
    { value: 1.55, label: "معتدل", desc: "3-5 أيام/أسبوع" },
    { value: 1.725, label: "نشط", desc: "6-7 أيام/أسبوع" },
    { value: 1.9, label: "شديد", desc: "يومي + عمل بدني" },
  ];

  return (
    <section className="py-20 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
          <Flame className="size-4" />
          حساب السعرات
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
          احسب احتياجك اليومي من السعرات
        </h2>
        <p className="text-muted-foreground text-lg max-w-[50ch] mx-auto leading-relaxed">
          أدخل بياناتك لتحصل على تقدير دقيق بناءً على وزنك، طولك، وعمرك.
        </p>
      </div>

      <div className="max-w-[900px] mx-auto bg-card rounded-4xl p-8 md:p-12 border border-border shadow-soft">
        <div className="space-y-8">
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setGender("male")}
              className={`px-8 py-2.5 rounded-2xl text-sm font-bold transition-colors ${
                gender === "male"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-primary/10"
              }`}
            >
              ذكر
            </button>
            <button
              onClick={() => setGender("female")}
              className={`px-8 py-2.5 rounded-2xl text-sm font-bold transition-colors ${
                gender === "female"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-primary/10"
              }`}
            >
              أنثى
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">الوزن (كجم)</label>
              <input
                type="number"
                min={30}
                max={300}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-12 px-4 rounded-2xl bg-secondary border border-border text-center text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">الطول (سم)</label>
              <input
                type="number"
                min={100}
                max={250}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-12 px-4 rounded-2xl bg-secondary border border-border text-center text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">العمر</label>
              <input
                type="number"
                min={10}
                max={120}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-12 px-4 rounded-2xl bg-secondary border border-border text-center text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-3">مستوى النشاط</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {activityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setActivity(level.value)}
                  className={`p-3 rounded-2xl text-center text-sm transition-colors ${
                    activity === level.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  <span className="block font-bold">{level.label}</span>
                  <span className="text-[11px] opacity-70">{level.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl p-6 text-center bg-secondary">
                <span className="text-xs font-bold text-muted-foreground block mb-1">سعرات الراحة (BMR)</span>
                <span className="text-3xl font-bold tabular-nums">{Math.round(bmr)}</span>
                <span className="text-sm text-muted-foreground block mt-1">سعرة/يوم</span>
              </div>
              <div className="rounded-3xl p-6 text-center bg-primary text-primary-foreground">
                <span className="text-xs font-bold text-primary-foreground/70 block mb-1">احتياجك اليومي (TDEE)</span>
                <span className="text-3xl font-bold tabular-nums">{tdee}</span>
                <span className="text-sm text-primary-foreground/70 block mt-1">سعرة/يوم</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            هذه النتائج تقريبية وتختلف حسب عوامل فردية. يُنصح باستشارة أخصائي تغذية.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CalorieCalculator;
