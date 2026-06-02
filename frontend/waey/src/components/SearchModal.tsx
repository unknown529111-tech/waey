import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RECIPES } from "@/data/recipes";
import { hospitalsData } from "@/data/hospitals";

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

const staticTips = [
  { title: "اشرب 8 أكواب مياه يومياً", area: "صحة", path: "/health" },
  { title: "طبق قاعدة 50/30/20 في ميزانيتك", area: "مال", path: "/finance" },
  { title: "افصل البلاستيك عن القمامة", area: "بيئة", path: "/environment" },
  { title: "جرب تقنية البومودورو في المذاكرة", area: "تعليم", path: "/education" },
  { title: "نم 7-8 ساعات يومياً", area: "صحة", path: "/health" },
  { title: "وفّر 20 جنيه يومياً", area: "مال", path: "/finance" },
  { title: "اطفي النور في الغرف الفاضية", area: "بيئة", path: "/environment" },
  { title: "استخدم الخرائط الذهنية", area: "تعليم", path: "/education" },
  { title: "مارس التنفس العميق للاسترخاء", area: "صحة", path: "/health" },
  { title: "جرب تقنية 5-4-3-2-1 للتوتر", area: "صحة", path: "/health" },
];

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
  const [query, setQuery] = useState("");
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
          subtitle: `${r.calories} سعرة • ${r.costEGP} ج`,
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
  }, [query]);

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
            placeholder="ابحث عن وصفات، مستشفيات، نصائح..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
          />
          <button onClick={onClose} className="size-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {results.length === 0 && query.trim() && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              لا توجد نتائج لـ "{query}"
            </div>
          )}
          {results.length === 0 && !query.trim() && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              اكتب كلمة للبحث...
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
                  {r.type === "recipe" ? "وصفة" : r.type === "hospital" ? "مستشفى" : "نصيحة"}
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
