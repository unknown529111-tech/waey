import { Stethoscope } from "lucide-react";
import { useT } from "@/contexts/useLanguage";

const CheckupsTable = () => {
  const t = useT();

  const checkups = [
    { testKey: 'checkups.cbc', genderKey: 'checkups.all', freqKey: 'checkups.yearly', type: 'all' },
    { testKey: 'checkups.vitaminD', genderKey: 'checkups.all', freqKey: 'checkups.yearly', type: 'all' },
    { testKey: 'checkups.hba1c', genderKey: 'checkups.all', freqKey: 'checkups.yearlyAfter30', type: 'all' },
    { testKey: 'checkups.lipids', genderKey: 'checkups.all', freqKey: 'checkups.yearly', type: 'all' },
    { testKey: 'checkups.mammogram', genderKey: 'checkups.women', freqKey: 'checkups.biennialAfter40', type: 'women' },
    { testKey: 'checkups.psa', genderKey: 'checkups.men', freqKey: 'checkups.yearlyAfter45', type: 'men' },
    { testKey: 'checkups.dental', genderKey: 'checkups.all', freqKey: 'checkups.every6Months', type: 'all' },
    { testKey: 'checkups.liverKidney', genderKey: 'checkups.all', freqKey: 'checkups.yearly', type: 'all' },
  ];

  const getGenderStyle = (type: string) => {
    if (type === 'all') return "bg-primary/10 text-primary";
    if (type === 'women') return "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
  };

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 border border-border">
      <div className="flex items-center gap-3 mb-5">
        <Stethoscope className="size-6 text-primary" />
        <div>
          <h3 className="font-bold text-lg">{t('checkups.title')}</h3>
          <p className="text-xs text-muted-foreground">{t('checkups.subtitle')}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-right py-3 px-2 font-bold">{t('checkups.test')}</th>
              <th className="text-right py-3 px-2 font-bold">{t('checkups.category')}</th>
              <th className="text-right py-3 px-2 font-bold">{t('checkups.frequency')}</th>
            </tr>
          </thead>
          <tbody>
            {checkups.map((c, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-3 px-2 text-sm">{t(c.testKey)}</td>
                <td className="py-3 px-2">
                  <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${getGenderStyle(c.type)}`}>{t(c.genderKey)}</span>
                </td>
                <td className="py-3 px-2 text-sm text-muted-foreground">{t(c.freqKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckupsTable;
