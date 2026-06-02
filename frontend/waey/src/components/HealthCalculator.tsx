import { useState } from "react";
import { HeartPulse } from "lucide-react";

const ResultCard = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div className={`rounded-3xl p-5 text-center ${accent ? "bg-primary text-primary-foreground" : "bg-background border border-border"}`}>
    <span className={`text-xs font-bold block mb-1 ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{label}</span>
    <span className="text-2xl font-bold tabular-nums">{value}</span>
  </div>
);

const HealthCalculator = () => {
  const [drinks, setDrinks] = useState(2);
  const [sweets, setSweets] = useState(1);
  const [fastFood, setFastFood] = useState(1);

  const totalSugar = drinks * 35 + sweets * 25 + fastFood * 15;
  const recommended = 25;
  const points = Math.max(0, 100 - Math.floor((totalSugar / recommended) * 20));

  return (
    <section id="health-calculator" className="py-24 px-6 md:px-12 bg-gradient-to-b from-primary/95 to-primary">
      <div className="max-w-[1000px] mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground px-4 py-2 rounded-full text-sm font-bold mb-4">
          <HeartPulse className="size-4" />
          أداة تفاعلية
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-primary-foreground">
          حاسبة الصحة
        </h2>
        <p className="text-primary-foreground/70 text-lg max-w-[50ch] mx-auto leading-relaxed">
          احسب استهلاكك اليومي من السكر واعرف إذا كان ضمن الحد الصحي الموصى به.
        </p>
      </div>

      <div className="max-w-[900px] mx-auto bg-card rounded-4xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-bold mb-3">
                <span>المشروبات المحلاة يومياً</span>
                <span className="text-destructive tabular-nums">{drinks} مشروبات ({drinks * 35}غ سكر)</span>
              </label>
              <input type="range" min={0} max={8} value={drinks} onChange={(e) => setDrinks(Number(e.target.value))} className="w-full accent-destructive" />
            </div>
            <div>
              <label className="flex justify-between text-sm font-bold mb-3">
                <span>الحلويات والشوكولاتة</span>
                <span className="text-accent tabular-nums">{sweets} قطع ({sweets * 25}غ سكر)</span>
              </label>
              <input type="range" min={0} max={6} value={sweets} onChange={(e) => setSweets(Number(e.target.value))} className="w-full accent-accent" />
            </div>
            <div>
              <label className="flex justify-between text-sm font-bold mb-3">
                <span>وجبات سريعة</span>
                <span className="text-accent tabular-nums">{fastFood} وجبات ({fastFood * 15}غ سكر)</span>
              </label>
              <input type="range" min={0} max={5} value={fastFood} onChange={(e) => setFastFood(Number(e.target.value))} className="w-full accent-accent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="إجمالي السكر اليومي" value={`${totalSugar}غ`} />
            <ResultCard label="الحد الموصى به" value={`${recommended}غ`} />
            <ResultCard label="نقاط الصحة" value={`${points}/100`} accent={points >= 60} />
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {totalSugar <= recommended ? "🌿 رائع! استهلاكك ضمن الحد الصحي الموصى به." : `⚠️ استهلاكك يتجاوز الحد بمقدار ${totalSugar - recommended}غ. حاول استبدال مشروب محلى بالماء!`}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HealthCalculator;
