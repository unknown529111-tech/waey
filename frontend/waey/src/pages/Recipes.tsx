import { useMemo, useState } from "react";
import { RECIPES, type Recipe } from "@/data/recipes";
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

const MEAL_LABELS: Record<string, string> = {
  فطار: "breakfast",
  غدا: "lunch",
  عشا: "dinner",
  حلو: "dessert",
  مشروب: "drink",
};

const mealOf = (tags: Recipe["tags"]) => {
  for (const t of tags) if (t in MEAL_LABELS) return MEAL_LABELS[t];
  return "Any";
};

const displayName = (r: Recipe) => r.nameEn ?? r.name;
const displayIngredients = (r: Recipe) => r.ingredientsEn ?? r.ingredients;

const Recipes = () => {
  const { lang } = useLanguage();
  const t = useT();

  const [maxCal, setMaxCal] = useState(1000);
  const [maxCost, setMaxCost] = useState(200);
  const [activeTags, setActiveTags] = useState<Recipe["tags"][number][]>([]);
  const [search, setSearch] = useState("");
  const [favs, setFavs] = useState<string[]>([]);
  const [shopping, setShopping] = useState<string[]>([]);
  const [listOpen, setListOpen] = useState(false);

  const toggleTag = (tag: Recipe["tags"][number]) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));

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
        for (const t of activeTags) if (!r.tags.includes(t)) return false;
        const q = search.trim().toLowerCase();
        if (q && !displayName(r).toLowerCase().includes(q)) return false;
        return true;
      }),
    [maxCal, maxCost, activeTags, search]
  );

  return (
    <div className="relative min-h-[60vh]" dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="field-hero">
        <p className="field-eyebrow">{t("recipe.eyebrow")}</p>
        <h1 className="field-title">{t("recipes.title")}</h1>
        <p className="field-desc">{t("recipes.subtitle")}</p>
      </header>

      <div className="wrap">
        <section className="controls">
          <div className="controls-top">
            <div className="field">
              <label htmlFor="maxCal">{t("recipes.maxCalories")}</label>
              <input
                id="maxCal"
                type="number"
                value={maxCal}
                min={0}
                onChange={(e) => setMaxCal(Number(e.target.value) || 0)}
              />
            </div>
            <div className="field">
              <label htmlFor="maxCost">{`${t("recipes.maxCost")} (${t("recipes.costUnit")})`}</label>
              <input
                id="maxCost"
                type="number"
                value={maxCost}
                min={0}
                onChange={(e) => setMaxCost(Number(e.target.value) || 0)}
              />
            </div>
            <div className="spacer" />
            <span className="stat-chip">
              {t("recipes.favorites")} <b>{favs.length}</b>
            </span>
            <button className="btn btn-ghost" type="button" onClick={() => setListOpen(true)}>
              {t("shopping.title")} (<b>{shopping.length}</b>)
            </button>
          </div>

          <div className="chips">
            <input
              className="search"
              type="search"
              placeholder={t("recipe.searchPlaceholder")}
              aria-label={t("recipe.searchAria")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {DIET_TAGS.map((d) => (
              <button
                key={d.tag}
                type="button"
                className={`chip${activeTags.includes(d.tag) ? " active" : ""}`}
                onClick={() => toggleTag(d.tag)}
              >
                {t(`recipes.tag.${d.labelKey}`)}
              </button>
            ))}
          </div>
        </section>

        <p className="count-line">
          {t("recipe.countLine", { shown: filtered.length, total: RECIPES.length })}
        </p>

        {filtered.length === 0 ? (
          <p className="empty">{t("recipes.empty")}</p>
        ) : (
          <div className="grid">
            {filtered.map((r) => {
              const isFav = favs.includes(r.id);
              const isAdded = shopping.includes(r.id);
              return (
                <div className="rcard" key={r.id}>
                  <div className="rhead">
                    <h3>{displayName(r)}</h3>
                    <span className="meal">
                      {mealOf(r.tags) === "Any" ? t("recipe.mealAny") : t(`recipes.tag.${mealOf(r.tags)}`)}
                    </span>
                  </div>
                  <div className="rstats">
                    <div className="s">
                      <b>{r.calories}</b>
                      <span>{t("recipes.calorieUnit")}</span>
                    </div>
                    <div className="s">
                      <b>{r.costEGP}</b>
                      <span>{t("recipes.costUnit")}</span>
                    </div>
                    <div className="s">
                      <b>{r.prepMin}</b>
                      <span>{t("recipes.prepMinUnit")}</span>
                    </div>
                  </div>
                  <div className="rtags">
                    {DIET_TAGS.filter((d) => r.tags.includes(d.tag)).map((d) => (
                      <span key={d.tag}>{t(`recipes.tag.${d.labelKey}`)}</span>
                    ))}
                  </div>
                  <details className="ing">
                    <summary>{t("recipes.ingredients")}</summary>
                    <ul className="ing-list">
                      {displayIngredients(r).map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </details>
                  <div className="ractions">
                    <button
                      type="button"
                      className={`fav${isFav ? " on" : ""}`}
                      onClick={() => toggleFav(r.id)}
                    >
                       {isFav ? t("recipe.saved") : t("recipe.save")}
                    </button>
                    <button
                      type="button"
                      className={`add${isAdded ? " on" : ""}`}
                      onClick={() => toggleShop(r.id)}
                    >
                      {isAdded ? t("shopping.added") : t("shopping.addToCart")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        className={`overlay${listOpen ? " open" : ""}`}
        onClick={() => setListOpen(false)}
      >
        <div
          className="sheet"
          role="dialog"
          aria-modal="true"
          aria-label={t("shopping.title")}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>{t("shopping.title")}</h2>
          <ul className="slist">
            {shopping.map((id) => {
              const r = RECIPES.find((x) => x.id === id);
              if (!r) return null;
              return (
                <li key={id}>
                  <span>{displayName(r)}</span>
                  <button className="rm" type="button" onClick={() => removeShop(id)}>
                    {t("recipe.remove")}
                  </button>
                </li>
              );
            })}
          </ul>
          {shopping.length === 0 && (
            <p className="empty">{t("shopping.empty")}</p>
          )}
          <div className="sheet-foot">
             <button className="btn btn-ghost" type="button" onClick={clearShop}>
               {t("shopping.clearAll")}
             </button>
             <button className="btn btn-solid" type="button" onClick={() => setListOpen(false)}>
               {t("shopping.done")}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
