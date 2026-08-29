import { UtensilsCrossed, LeafyGreen, Drumstick, CookingPot } from "lucide-react";
import { useT } from "@/contexts/useLanguage";

const EgyptianPlate = () => {
  const t = useT();

  const groups = [
    { icon: LeafyGreen, nameKey: 'plate.vegName', itemsKey: 'plate.vegItems', chip: "bg-success-soft text-success" },
    { icon: Drumstick, nameKey: 'plate.proteinName', itemsKey: 'plate.proteinItems', chip: "bg-danger-soft text-danger" },
    { icon: CookingPot, nameKey: 'plate.carbsName', itemsKey: 'plate.carbsItems', chip: "bg-muted text-foreground" },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 border border-border">
      <div className="flex items-center gap-3 mb-5">
        <UtensilsCrossed className="size-6 text-primary" />
        <div>
          <h3 className="font-bold text-lg">{t('plate.title')}</h3>
          <p className="text-xs text-muted-foreground">{t('plate.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Plate visual */}
        <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-border shadow-lg mb-6">
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full bg-success-soft flex items-center justify-center p-2">
              <div className="text-center">
                <LeafyGreen className="size-7 mx-auto mb-1 text-success" />
                <p className="text-xs font-bold mt-1">{t('plate.half')}</p>
                <p className="text-[10px] text-muted-foreground">{t('plate.vegSection')}</p>
              </div>
            </div>
            <div className="w-1/2 h-full flex flex-col">
              <div className="h-1/2 bg-danger-soft flex items-center justify-center p-1">
                <div className="text-center">
                  <Drumstick className="size-5 mx-auto mb-0.5 text-danger" />
                  <p className="text-[10px] font-bold mt-0.5">{t('plate.proteinQuarter')}</p>
                  <p className="text-[8px] text-muted-foreground">{t('plate.proteinSection')}</p>
                </div>
              </div>
              <div className="h-1/2 bg-muted/50 flex items-center justify-center p-1">
                <div className="text-center">
                  <CookingPot className="size-5 mx-auto mb-0.5 text-muted-foreground" />
                  <p className="text-[10px] font-bold mt-0.5">{t('plate.carbsQuarter')}</p>
                  <p className="text-[8px] text-muted-foreground">{t('plate.carbsSection')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          {groups.map((s, i) => (
            <div key={i} className="bg-muted/40 rounded-2xl p-3 text-center border border-border">
              <div className={`size-10 mx-auto rounded-full flex items-center justify-center mb-1.5 ${s.chip}`}>
                <s.icon className="size-5" />
              </div>
              <p className="text-xs font-bold mt-1">{t(s.nameKey)}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{t(s.itemsKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EgyptianPlate;