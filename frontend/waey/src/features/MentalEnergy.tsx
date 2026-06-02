import { useState } from "react";
import { Battery, BatteryWarning, BatteryCharging, Zap } from "lucide-react";

const MentalEnergy = () => {
  const [energy, setEnergy] = useState(70);

  const getColor = () => {
    if (energy <= 20) return "bg-red-500";
    if (energy <= 40) return "bg-orange-500";
    if (energy <= 60) return "bg-yellow-500";
    return "bg-primary";
  };

  const getIcon = () => {
    if (energy <= 20) return <BatteryWarning className="size-5 text-red-500" />;
    if (energy <= 40) return <Battery className="size-5 text-orange-500" />;
    return <BatteryCharging className="size-5 text-primary" />;
  };

  const getAdvice = () => {
    if (energy <= 20) return "طاقتك منخفضة جداً — خد راحة، بلاش ضغط.";
    if (energy <= 40) return "طاقتك متوسطة — حاول تبدأ بمهمة سهلة.";
    if (energy <= 60) return "طاقتك كويسة — وقت المهام المتوسطة.";
    return "طاقتك عالية — ركز على المهام الصعبة!";
  };

  return (
    <div className="bg-card rounded-3xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="size-4 text-primary" />
        <h3 className="font-bold text-sm">بطارية الطاقة العقلية</h3>
      </div>
      <div className="flex items-center gap-3 mb-2">
        {getIcon()}
        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${getColor()}`} style={{ width: `${energy}%` }} />
        </div>
        <span className="text-sm font-bold tabular-nums">{energy}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={energy}
        onChange={(e) => setEnergy(Number(e.target.value))}
        className="w-full accent-primary mb-2"
      />
      <p className="text-xs text-muted-foreground">{getAdvice()}</p>
    </div>
  );
};

export default MentalEnergy;
