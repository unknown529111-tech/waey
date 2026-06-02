import { Quote } from "lucide-react";
import { getDailyQuote } from "@/lib/dailyStorage";

const DailyQuote = () => (
  <div className="bg-gradient-to-l from-accent/[0.06] to-primary/[0.04] border border-border rounded-3xl p-5">
    <div className="flex items-start gap-3">
      <Quote className="size-5 text-accent shrink-0 mt-1" />
      <div>
        <div className="text-xs font-bold text-accent mb-1">حكمة اليوم</div>
        <p className="text-sm md:text-base leading-relaxed font-medium">
          {getDailyQuote()}
        </p>
      </div>
    </div>
  </div>
);

export default DailyQuote;
