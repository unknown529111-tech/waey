import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RECIPES } from "@/data/recipes";
import { hospitalsData } from "@/data/hospitals";
import { useT } from "@/contexts/useLanguage";

const allHospitals = hospitalsData.flatMap((g) =>
  g.cities.flatMap((c) =>
    c.hospitals.map((h) => ({
      id: h.id,
      name: h.name,
      address: h.address,
      type: h.type,
      city: c.city,
      governorate: g.name,
    }))
  )
);

const SUGGESTION_AREAS: Record<number, string> = {
  1: "goal.category.health",
  2: "goal.category.finance",
  3: "goal.category.environment",
  4: "goal.category.education",
  5: "goal.category.health",
  6: "goal.category.finance",
  7: "goal.category.environment",
  8: "goal.category.education",
  9: "goal.category.health",
  10: "goal.category.health",
};

type Result = {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  type: "recipe" | "hospital" | "tip";
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const SearchModal = ({ open, onClose }: Props) => {
  const t = useT();
  const [query, setQuery] = useState("");

  const staticTips = useMemo(() => [
    { title: t('search.suggestion1'), area: t(SUGGESTION_AREAS[1]), path: "/health" },
    { title: t('search.suggestion2'), area: t(SUGGESTION_AREAS[2]), path: "/finance" },
    { title: t('search.suggestion3'), area: t(SUGGESTION_AREAS[3]), path: "/environment" },
    { title: t('search.suggestion4'), area: t(SUGGESTION_AREAS[4]), path: "/education" },
    { title: t('search.suggestion5'), area: t(SUGGESTION_AREAS[5]), path: "/health" },
    { title: t('search.suggestion6'), area: t(SUGGESTION_AREAS[6]), path: "/finance" },
    { title: t('search.suggestion7'), area: t(SUGGESTION_AREAS[7]), path: "/environment" },
    { title: t('search.suggestion8'), area: t(SUGGESTION_AREAS[8]), path: "/education" },
    { title: t('search.suggestion9'), area: t(SUGGESTION_AREAS[9]), path: "/health" },
    { title: t('search.suggestion10'), area: t(SUGGESTION_AREAS[10]), path: "/health" },
  ], [t]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const out: Result[] = [];

    RECIPES.forEach((r) => {
      if (
        r.name.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q)) ||
        r.ingredients?.some((i) => i.toLowerCase().includes(q))
      ) {
        out.push({
          id: `recipe-${r.id}`,
          title: r.name,
          subtitle: `${r.calories} ${t('recipes.calorieUnit')} • ${r.costEGP} ${t('recipes.costUnit')}`,
          path: "/recipes",
          type: "recipe",
        });
      }
    });

    allHospitals.forEach((h) => {
      if (
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.governorate.toLowerCase().includes(q)
      ) {
        out.push({
          id: `hospital-${h.id}`,
          title: h.name,
          subtitle: `${h.city}، ${h.governorate}`,
          path: "/health",
          type: "hospital",
        });
      }
    });

    staticTips.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.area.toLowerCase().includes(q)) {
        out.push({
          id: `tip-${t.title}`,
          title: t.title,
          subtitle: t.area,
          path: t.path,
          type: "tip",
        });
      }
    });

    return out.slice(0, 20);
  }, [query, staticTips, t]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl w-full max-w-lg mx-4 max-h-[60vh] flex flex-col shadow-soft-lg overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
          />
          <button onClick={onClose} className="size-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {results.length === 0 && query.trim() && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              {t('search.noResultsFor').replace('{query}', query)}
            </div>
          )}
          {results.length === 0 && !query.trim() && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              {t('search.empty')}
            </div>
          )}
          {results.map((r) => (
            <Link
              key={r.id}
              to={r.path}
              onClick={onClose}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-secondary/60 transition-colors group"
            >
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.subtitle}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  {r.type === "recipe" ? t('search.type.recipe') : r.type === "hospital" ? t('search.type.hospital') : t('search.type.tip')}
                </span>
                <ArrowLeft className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
