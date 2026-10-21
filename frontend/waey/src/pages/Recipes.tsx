import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RECIPES, type Recipe } from "@/data/recipes";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import StatBand from "@/components/primitives/StatBand";
import { useLanguage, useT } from "@/contexts/useLanguage";
import "./Recipes.css";

/* ── Filter vocabulary (mirrors recipes.html English diet chips) ──
   Mapped onto the Arabic tag enum used by the app's recipe data. */
const DIET_TAGS: { labelKey: string; tag: Recipe["tags"][number] }[] = [
  { labelKey: "vegan", tag: "نباتي" },
  { labelKey: "quick", tag: "سريع" },
  { labelKey: "economic", tag: "اقتصادي" },
  { labelKey: "healthy", tag: "صحي" },
  { labelKey: "highProtein", tag: "بروتين عالي" },
];

/* Meal tags live in the same tag list; MEAL_LABELS is the tag → key map. */
const MEAL_LABELS: Record<string, string> = {
  فطار: "breakfast",
  غدا: "lunch",
  عشا: "dinner",
  حلو: "dessert",
  مشروب: "drink",
};

// The meal chips are read from the data, so a recipe the data never carries
// can never appear as a filter.
const MEAL_TAGS = Array.from(new Set(RECIPES.flatMap((r) => r.tags)))
  .filter((tag) => tag in MEAL_LABELS)
  .map((tag) => ({ tag, labelKey: MEAL_LABELS[tag] }));

const mealOf = (tags: Recipe["tags"]) => {
  for (const tag of tags) if (tag in MEAL_LABELS) return MEAL_LABELS[tag];
  return "Any";
};

// Language-aware display: Arabic (default) shows the canonical Arabic fields,
// English shows the translated overrides when present.
const displayName = (r: Recipe, lang: string) =>
  lang === "en" ? r.nameEn ?? r.name : r.name;
const displayIngredients = (r: Recipe, lang: string) =>
  lang === "en" ? r.ingredientsEn ?? r.ingredients : r.ingredients;

const SHELL = "mx-auto w-full max-w-[80rem] px-6";

const Recipes = () => {
  const { lang } = useLanguage();
  const t = useT();

  const [maxCal, setMaxCal] = useState(1000);
  const [maxCost, setMaxCost] = useState(200);
  const [activeTags, setActiveTags] = useState<Recipe["tags"][number][]>([]);
  const [activeMeals, setActiveMeals] = useState<Recipe["tags"][number][]>([]);
  const [search, setSearch] = useState("");
  const [favs, setFavs] = useState<string[]>([]);
  const [shopping, setShopping] = useState<string[]>([]);

  const toggleTag = (tag: Recipe["tags"][number]) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));

  const toggleMeal = (tag: Recipe["tags"][number]) =>
    setActiveMeals((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));

  const toggleFav = (id: string) =>
    setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleShop = (id: string) =>
    setShopping((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const removeShop = (id: string) => setShopping((prev) => prev.filter((x) => x !== id));
  const clearShop = () => setShopping([]);

  const filtered = useMemo(
    () =>
      RECIPES.filter((r) => {
        if (r.calories > maxCal) return false;
        if (r.costEGP > maxCost) return false;
        for (const tag of activeTags) if (!r.tags.includes(tag)) return false;
        for (const meal of activeMeals) if (!r.tags.includes(meal)) return false;
        const q = search.trim().toLowerCase();
        if (q && !displayName(r, lang).toLowerCase().includes(q)) return false;
        return true;
      }),
    [maxCal, maxCost, activeTags, activeMeals, search, lang],
  );

  const scrollToShopping = () => {
    const target = document.getElementById("shopping");
    if (!target) return;
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="recipes" dir={lang === "ar" ? "rtl" : "ltr"}>
      <PageHero
        eyebrow={t("recipe.eyebrow")}
        title={t("recipes.title")}
        lead={t("recipes.subtitle")}
      />

      {/* ═══════════ FILTERS ═══════════ */}
      <section className={SHELL} aria-label={t("recipes.filters.title")}>
        <SectionHeading
          eyebrow={t("recipes.filters.eyebrow")}
          title={t("recipes.filters.title")}
          lead={t("recipes.filters.lead")}
        />

        <div className="rec-filters mt-8">
          <div className="rec-fields">
            <div className="rec-field">
              <label htmlFor="maxCal">{t("recipes.maxCalories")}</label>
              <input
                id="maxCal"
                className="field rec-input"
                type="number"
                min={0}
                dir="ltr"
                value={maxCal}
                onChange={(e) => setMaxCal(Number(e.target.value) || 0)}
              />
            </div>

            <div className="rec-field">
              <label htmlFor="maxCost">{`${t("recipes.maxCost")} (${t("recipes.costUnit")})`}</label>
              <input
                id="maxCost"
                className="field rec-input"
                type="number"
                min={0}
                dir="ltr"
                value={maxCost}
                onChange={(e) => setMaxCost(Number(e.target.value) || 0)}
              />
            </div>

            <div className="rec-field rec-field-search">
              <label htmlFor="recipe-search">{t("recipe.searchAria")}</label>
              <input
                id="recipe-search"
                className="field rec-input"
                type="search"
                aria-label={t("recipe.searchAria")}
                placeholder={t("recipe.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <fieldset className="rec-group">
            <legend>{t("recipes.filters.diet")}</legend>
            <div className="rec-chips">
              {DIET_TAGS.map((d) => (
                <button
                  key={d.tag}
                  type="button"
                  className="rec-chip"
                  aria-pressed={activeTags.includes(d.tag)}
                  onClick={() => toggleTag(d.tag)}
                >
                  {t(`recipes.tag.${d.labelKey}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="rec-group">
            <legend>{t("recipes.filters.meals")}</legend>
            <div className="rec-chips">
              <button
                type="button"
                className="rec-chip"
                aria-pressed={activeMeals.length === 0}
                onClick={() => setActiveMeals([])}
              >
                {t("recipes.filters.all")}
              </button>
              {MEAL_TAGS.map((d) => (
                <button
                  key={d.tag}
                  type="button"
                  className="rec-chip"
                  aria-pressed={activeMeals.includes(d.tag)}
                  onClick={() => toggleMeal(d.tag)}
                >
                  {t(`recipes.tag.${d.labelKey}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="rec-actions">
            <span className="rec-fav">
              {t("recipes.favorites")} <b dir="ltr">{favs.length}</b>
            </span>
            <button
              type="button"
              className="btn btn-ghost min-h-11 px-5 text-sm"
              onClick={scrollToShopping}
            >
              {t("shopping.title")} (<b dir="ltr">{shopping.length}</b>)
            </button>
          </div>

          <p className="rec-count" aria-live="polite">
            {t("recipe.countLine", { shown: filtered.length, total: RECIPES.length })}
          </p>
        </div>
      </section>

      {/* ═══════════ THE NUMBERS ═══════════ */}
      <div className="mt-14">
        <StatBand
          items={[
            { value: String(RECIPES.length), label: t("recipes.stats.total") },
            { value: String(filtered.length), label: t("recipes.stats.matching") },
            { value: String(MEAL_TAGS.length), label: t("recipes.stats.mealTypes") },
          ]}
        />
      </div>

      {/* ═══════════ THE LIBRARY ═══════════ */}
      <section id="library" className={`${SHELL} mt-14 scroll-mt-24`} aria-label={t("recipes.library.title")}>
        <SectionHeading
          eyebrow={t("recipes.library.eyebrow")}
          title={t("recipes.library.title")}
          lead={t("recipes.library.lead")}
        />

        {filtered.length === 0 ? (
          <p className="rec-empty mt-8">{t("recipes.empty")}</p>
        ) : (
          <div className="rec-grid mt-8">
            {filtered.map((r) => {
              const isFav = favs.includes(r.id);
              const isAdded = shopping.includes(r.id);
              const name = displayName(r, lang);
              const meal = mealOf(r.tags);
              return (
                <article className="rec-card" key={r.id}>
                  <div className="rec-card-head">
                    <span className="rec-plate" aria-hidden="true">
                      {r.emoji}
                    </span>
                    <h3 className="font-display">{name}</h3>
                    <span className="rec-meal">
                      {meal === "Any" ? t("recipe.mealAny") : t(`recipes.tag.${meal}`)}
                    </span>
                  </div>

                  <div className="rec-stats">
                    <div className="rec-stat">
                      <b dir="ltr">{r.calories}</b>
                      <span>{t("recipes.calorieUnit")}</span>
                    </div>
                    <div className="rec-stat">
                      <b dir="ltr">{r.costEGP}</b>
                      <span>{t("recipes.costUnit")}</span>
                    </div>
                    <div className="rec-stat">
                      <b dir="ltr">{r.prepMin}</b>
                      <span>{t("recipes.prepMinUnit")}</span>
                    </div>
                  </div>

                  <div className="rec-tags">
                    {DIET_TAGS.filter((d) => r.tags.includes(d.tag)).map((d) => (
                      <span key={d.tag}>{t(`recipes.tag.${d.labelKey}`)}</span>
                    ))}
                  </div>

                  <details className="rec-ing">
                    <summary>{t("recipes.ingredients")}</summary>
                    <ul className="rec-ing-list">
                      {displayIngredients(r, lang).map((ing, n) => (
                        <li key={`${n}-${ing}`}>{ing}</li>
                      ))}
                    </ul>
                  </details>

                  <div className="rec-card-actions">
                    <button
                      type="button"
                      className="btn btn-ghost min-h-11 flex-1 px-4 text-xs"
                      aria-pressed={isFav}
                      aria-label={`${isFav ? t("recipe.saved") : t("recipe.save")} — ${name}`}
                      onClick={() => toggleFav(r.id)}
                    >
                      {isFav ? t("recipe.saved") : t("recipe.save")}
                    </button>
                    <button
                      type="button"
                      className={`btn ${isAdded ? "btn-solid" : "btn-ghost"} min-h-11 flex-1 px-4 text-xs`}
                      aria-pressed={isAdded}
                      aria-label={`${isAdded ? t("shopping.added") : t("shopping.addToCart")} — ${name}`}
                      onClick={() => toggleShop(r.id)}
                    >
                      {isAdded ? t("shopping.added") : t("shopping.addToCart")}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════ SHOPPING LIST ═══════════ */}
      <section id="shopping" className={`${SHELL} mt-14 scroll-mt-24`} aria-label={t("shopping.title")}>
        <SectionHeading
          eyebrow={t("recipes.shopping.eyebrow")}
          title={t("shopping.title")}
          lead={t("shopping.subtitle")}
        />

        <div className="rec-shop-card mt-8">
          {shopping.length === 0 ? (
            <p className="rec-empty">{t("shopping.empty")}</p>
          ) : (
            <>
              <ul className="rec-shop-list">
                {shopping.map((id) => {
                  const r = RECIPES.find((x) => x.id === id);
                  if (!r) return null;
                  const name = displayName(r, lang);
                  return (
                    <li key={id}>
                      <span>{name}</span>
                      <button
                        type="button"
                        className="rec-remove"
                        aria-label={`${t("recipe.remove")} — ${name}`}
                        onClick={() => removeShop(id)}
                      >
                        {t("recipe.remove")}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="rec-shop-foot">
                <button
                  className="btn btn-ghost min-h-11 px-5 text-sm"
                  type="button"
                  onClick={clearShop}
                >
                  {t("shopping.clearAll")}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══════════ WHERE NEXT ═══════════ */}
      <section className={`${SHELL} mt-14 pb-20`} aria-label={t("recipes.cta.title")}>
        <div className="rec-cta">
          <p className="eyebrow">{t("recipes.cta.eyebrow")}</p>
          <h2 className="font-display rec-cta-title">{t("recipes.cta.title")}</h2>
          <p className="font-body rec-cta-body">{t("recipes.cta.body")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/shopping-list" className="btn btn-solid min-h-11 px-6 text-sm">
              {t("shopping.title")}
            </Link>
            <Link to="/dashboard" className="btn btn-ghost min-h-11 px-6 text-sm">
              {t("home.cta.dashboard")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Recipes;
