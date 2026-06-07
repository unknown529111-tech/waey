import { UtensilsCrossed } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

const EgyptianPlate = () => {
  const t = useT();

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
            <div className="w-1/2 h-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center p-2">
              <div className="text-center">
                <span className="text-2xl">🥬</span>
                <p className="text-xs font-bold mt-1">{t('plate.half')}</p>
                <p className="text-[10px] text-muted-foreground">{t('plate.vegSection')}</p>
              </div>
            </div>
            <div className="w-1/2 h-full flex flex-col">
              <div className="h-1/2 bg-red-50 dark:bg-red-900/20 flex items-center justify-center p-1">
                <div className="text-center">
                  <span className="text-xl">🍗</span>
                  <p className="text-[10px] font-bold mt-0.5">{t('plate.proteinQuarter')}</p>
                  <p className="text-[8px] text-muted-foreground">{t('plate.proteinSection')}</p>
                </div>
              </div>
              <div className="h-1/2 bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center p-1">
                <div className="text-center">
                  <span className="text-xl">🍚</span>
                  <p className="text-[10px] font-bold mt-0.5">{t('plate.carbsQuarter')}</p>
                  <p className="text-[8px] text-muted-foreground">{t('plate.carbsSection')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { emoji: "🥬", nameKey: 'plate.vegName', itemsKey: 'plate.vegItems' },
            { emoji: "🍗", nameKey: 'plate.proteinName', itemsKey: 'plate.proteinItems' },
            { emoji: "🍚", nameKey: 'plate.carbsName', itemsKey: 'plate.carbsItems' },
          ].map((s, i) => (
            <div key={i} className="bg-muted/40 rounded-2xl p-3 text-center border border-border">
              <span className="text-xl">{s.emoji}</span>
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
