import { Check } from "lucide-react";

interface TipListProps {
  title: string;
  items: string[];
}

const TipList = ({ title, items }: TipListProps) => (
  <div className="rounded-card border border-border bg-card p-6 text-start shadow-soft rtl:text-right">
    <h3 className="font-display text-lg text-foreground">{title}</h3>
    <ul role="list" className="mt-4 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 font-body text-sm leading-relaxed text-foreground"
        >
          <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-field-current-tint text-field-current">
            <Check data-testid="tick" className="size-3.5" aria-hidden />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default TipList;
