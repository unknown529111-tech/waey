import { Quote } from "lucide-react";
import { getDailyQuote } from "@/lib/dailyStorage";
import { useT } from "@/contexts/useLanguage";

const DailyQuote = () => {
  const t = useT();
  return (
    <div className="ledger p-6">
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center size-9 rounded-full bg-secondary/15 text-secondary flex-none">
          <Quote className="size-4" />
        </span>
        <div>
          <div className="eyebrow mb-2">{t('quote.title')}</div>
          <p className="text-base md:text-lg leading-relaxed font-bold text-foreground">
            {t(getDailyQuote())}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;
