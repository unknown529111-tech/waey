import { useLanguage } from "@/contexts/useLanguage";

interface StatBandProps {
  items: { value: string; label: string }[];
}

const StatBand = ({ items }: StatBandProps) => {
  const { t } = useLanguage();

  // In dark mode --footer flips to pale mist and --primary-foreground flips to
  // dark ink, so the same text token clears 4.5:1 on both grounds.
  return (
    <section
      aria-label={t('prim.statsLabel')}
      className="w-full bg-primary text-primary-foreground dark:bg-footer"
    >
      <div className="mx-auto grid max-w-[80rem] grid-cols-2 gap-x-8 gap-y-10 px-6 py-16 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-start rtl:text-right">
            <p className="font-display text-4xl tabular-nums sm:text-5xl">{item.value}</p>
            <p className="font-body mt-2 text-sm leading-relaxed">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatBand;
