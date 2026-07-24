import { useState } from "react";
import { Droplets } from "lucide-react";
import { useT } from "@/contexts/useLanguage";

const WaterCalculator = () => {
  const t = useT();
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(30);
  const [activity, setActivity] = useState<"low" | "med" | "high">("med");

  const activityBonus = activity === "low" ? 0 : activity === "med" ? 0.35 : 0.7;
  const liters = Math.max(1, weight * 0.033 + (height - 160) * 0.005 + (30 - age) * 0.005 + activityBonus);

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 border border-border">
      <div className="flex items-center gap-3 mb-5">
        <Droplets className="size-6 text-primary" />
        <div>
          <h3 className="font-bold text-lg">{t('waterCalc.title')}</h3>
          <p className="text-xs text-muted-foreground">{t('waterCalc.subtitle')}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-bold mb-2 block">{t('waterCalc.weight')} <span className="text-primary">{weight}</span></label>
        <input type="range" min={30} max={180} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>30</span><span>105</span><span>180</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-bold mb-2 block">{t('waterCalc.height')} <span className="text-primary">{height}</span></label>
        <input type="range" min={130} max={220} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>130</span><span>175</span><span>220</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-bold mb-2 block">{t('waterCalc.age')} <span className="text-primary">{age}</span></label>
        <input type="range" min={10} max={100} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>10</span><span>55</span><span>100</span>
        </div>
      </div>

      <div className="mb-5">
        <label className="text-sm font-bold mb-2 block">{t('waterCalc.activity')}</label>
        <div className="flex gap-2">
          {[
            { id: "low", labelKey: 'waterCalc.lowLabel', descKey: 'waterCalc.lowDesc' },
            { id: "med", labelKey: 'waterCalc.medLabel', descKey: 'waterCalc.medDesc' },
            { id: "high", labelKey: 'waterCalc.highLabel', descKey: 'waterCalc.highDesc' },
          ].map((a) => (
            <button
              key={a.id}
              onClick={() => setActivity(a.id as typeof activity)}
              className={`flex-1 p-3 rounded-2xl text-xs font-bold border transition-all ${
                activity === a.id ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border hover:bg-secondary/80"
              }`}
            >
              <div className="text-sm">{t(a.labelKey)}</div>
              <div className="opacity-70 mt-0.5">{t(a.descKey)}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 bg-primary/5 rounded-2xl border border-primary/15 text-center">
        <p className="text-xs text-muted-foreground mb-1">{t('waterCalc.result')}</p>
        <p className="text-4xl font-bold text-primary">{liters.toFixed(1)} <span className="text-lg">{t('waterCalc.liter')}</span></p>
        <p className="text-xs text-muted-foreground mt-2">{t('waterCalc.cups').replace('{n}', String(Math.round(liters / 0.25)))}</p>
      </div>
    </div>
  );
};

export default WaterCalculator;
