import { useState, useMemo, useEffect } from "react";
import { ChefHat, Clock, Flame, Coins, X, Heart } from "lucide-react";
import PageHero from "@/components/PageHero";
import { RECIPES, type Recipe } from "@/data/recipes";
import { getAdminRecipes, type AdminItem } from "@/lib/adminContent";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";

const Recipes = () => {
  const t = useT();

  useEffect(() => {
    trackEvent("page_view", { page: "recipes" });
  }, []);
  const ALL_TAGS: Recipe["tags"][number][] = ["نباتي", "سريع", "اقتصادي", "صحي", "بروتين عالي"];
  // Arabic tag keys are used for internal filtering; labels come from t()
  const TAG_LABELS: Record<string, string> = {
    نباتي: t('recipes.tag.vegan'),
    سريع: t('recipes.tag.quick'),
    اقتصادي: t('recipes.tag.economic'),
    صحي: t('recipes.tag.healthy'),
    'بروتين عالي': t('recipes.tag.highProtein'),
  };
  const [maxCal, setMaxCal] = useState(1000);
  const [maxCost, setMaxCost] = useState(200);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [open, setOpen] = useState<Recipe | AdminItem<Recipe> | null>(null);
  const [favs, setFavs] = useState<string[]>([]);
  const [favOnly, setFavOnly] = useState(false);

  // Merge hardcoded + admin recipes
  const allRecipes = useMemo<(Recipe | AdminItem<Recipe>)[]>(() => {
    const admin = getAdminRecipes();
    return [...RECIPES, ...admin];
  }, []);

  useEffect(() => {
    setFavs(getFavorites());
  }, []);

  const toggle = (id: string) => setFavs(toggleFavorite(id));
  const getId = (r: Recipe | AdminItem<Recipe>) => "_adminId" in r ? r._adminId : r.id;

  const filtered = useMemo(
    () =>
      allRecipes.filter(
        (r) =>
          r.calories <= maxCal &&
          r.costEGP <= maxCost &&
          (activeTags.length === 0 || activeTags.every((t) => r.tags.includes(t as Recipe["tags"][number]))) &&
          (!favOnly || favs.includes("_adminId" in r ? r._adminId : r.id))
      ),
    [maxCal, maxCost, activeTags, favOnly, favs, allRecipes]
  );

  const toggleTag = (t: string) =>
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="relative min-h-[60vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge={t('recipes.badge')}
          icon={<ChefHat className="size-4" />}
          title={t('recipes.title')}
          subtitle={t('recipes.subtitle')}
        />

        <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-6xl mx-auto">
          <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft mb-8 space-y-5">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>{t('recipes.maxCalories')}</span>
                <span className="text-primary tabular-nums">{maxCal} {t('recipes.calorieUnit')}</span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={maxCal}
                onChange={(e) => setMaxCal(Number(e.target.value))}
                className="w-full accent-[hsl(var(--primary))]"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>{t('recipes.maxCost')}</span>
                <span className="text-accent tabular-nums">{maxCost} {t('recipes.costUnit')}</span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={maxCost}
                onChange={(e) => setMaxCost(Number(e.target.value))}
                className="w-full accent-[hsl(var(--accent))]"
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <button
                onClick={() => setFavOnly((v) => !v)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1 hover:scale-105 active:scale-95 ${
                  favOnly
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                <Heart className={`size-3.5 ${favOnly ? "fill-current" : ""}`} />
                {t('recipes.favorites')} ({favs.length})
              </button>
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                    activeTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-muted"
                  }`}
                >
                  {TAG_LABELS[tag]}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">{t('recipes.empty')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r) => {
                const rid = getId(r);
                const isFav = favs.includes(rid);
                return (
                  <div
                    key={rid}
                    className="relative text-right bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft hover:-translate-y-1 hover:border-primary hover:shadow-moss-lg transition-all duration-300"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(rid);
                      }}
                      className="absolute top-4 left-4 size-10 rounded-full bg-secondary hover:bg-destructive/10 hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-300"
                      aria-label={t('recipes.favorites')}
                    >
                      <Heart className={`size-4 ${isFav ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                    </button>
                    <button onClick={() => setOpen(r)} className="text-right w-full">
                      <div className="text-5xl mb-3">{r.emoji}</div>
                      <h3 className="font-bold text-lg mb-3">{r.name}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Flame className="size-3.5 text-destructive" />
                          <span className="tabular-nums">{r.calories}</span> {t('recipes.calorieUnit')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Coins className="size-3.5 text-accent" />
                          <span className="tabular-nums">{r.costEGP}</span> {t('recipes.egp')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-primary" />
                          <span className="tabular-nums">{r.prepMin}</span> {t('recipes.min')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {r.tags.map((t) => (
                          <span key={t} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {open && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setOpen(null)}
          >
            <div
              className="bg-card rounded-[2rem] max-w-[600px] w-full max-h-[85vh] overflow-y-auto p-8 relative shadow-soft-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 left-4 size-10 bg-secondary rounded-full flex items-center justify-center hover:bg-muted hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <X className="size-4" />
              </button>
              <button
                onClick={() => toggle(getId(open))}
                className="absolute top-4 left-16 size-10 bg-secondary rounded-full flex items-center justify-center hover:bg-destructive/10 hover:scale-105 active:scale-95 transition-all duration-300"
                aria-label={t('recipes.favorites')}
              >
                <Heart className={`size-4 ${favs.includes(getId(open)) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
              </button>
              <div className="text-6xl mb-4">{open.emoji}</div>
              <h2 className="text-2xl font-bold mb-2">{open.name}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
                <span>🔥 {open.calories} {t('recipes.calorieUnit')}</span>
                <span>💰 {open.costEGP} {t('recipes.costUnitServing')}</span>
                <span>⏱ {open.prepMin} {t('recipes.prepMinUnit')}</span>
                <span>👥 {open.servings} {t('recipes.servingsUnit')}</span>
              </div>
              <h3 className="font-bold mb-2">{t('recipes.ingredients')}:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm mb-6 marker:text-primary">
                {open.ingredients.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <h3 className="font-bold mb-2">{t('recipes.instructions')}:</h3>
              <ol className="space-y-2 text-sm">
                {open.steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
