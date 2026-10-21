import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCheck,
  ShoppingBasket,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import StatBand from "@/components/primitives/StatBand";
import { useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import "./utility-hero.css";
import "./ShoppingList.css";
import {
  getShoppingList,
  toggleShoppingItem,
  removeShoppingItem,
  clearCheckedItems,
  clearShoppingList,
  type ShoppingItem,
} from "@/lib/shoppingList";

const SHELL = "mx-auto w-full max-w-[80rem] px-6";

const ShoppingList = () => {
  const { lang, t } = useLanguage();
  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    trackEvent("page_view", { page: "shopping-list" });
    setItems(getShoppingList());
  }, []);

  const done = items.filter((i) => i.checked).length;
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="shopping" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="utility-hero">
        <PageHero
          eyebrow={t("shopping.eyebrow")}
          title={t("shopping.title")}
          lead={t("shopping.subtitle")}
        />
      </div>

      {/* ═══════════ THE LIST ═══════════ */}
      <section className={SHELL} aria-label={t("shopping.list.title")}>
        <SectionHeading
          eyebrow={t("shopping.list.eyebrow")}
          title={t("shopping.list.title")}
          lead={t("shopping.list.lead")}
        />

        <div className="shop-toolbar">
          <p className="shop-count mono-label">
            <ShoppingBasket className="size-4 shrink-0" aria-hidden />
            <span dir="ltr" className="shop-count-value tabular-nums">
              {items.length}
            </span>
            <span>{t("shopping.items")}</span>
            {done > 0 && (
              <>
                <span aria-hidden>·</span>
                <span dir="ltr" className="shop-count-value tabular-nums">
                  {done}
                </span>
                <span>{t("shopping.done")}</span>
              </>
            )}
          </p>

          <div className="shop-actions">
            {done > 0 && (
              <button
                type="button"
                onClick={() => setItems(clearCheckedItems())}
                className="shop-btn shop-btn-soft"
              >
                {t("shopping.clearChecked")}
              </button>
            )}
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setItems(clearShoppingList())}
                className="shop-btn shop-btn-danger"
              >
                {t("shopping.clearAll")}
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="shop-empty">
            <UtensilsCrossed className="shop-empty-icon size-9" aria-hidden />
            <p className="font-body shop-empty-text">{t("shopping.empty")}</p>
            <Link to="/recipes" className="shop-empty-link">
              {t("shopping.goToRecipes")}
              <Arrow className="size-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <ul role="list" className="shop-list">
            {items.map((item) => (
              <li
                key={item.key}
                className={`shop-item${item.checked ? " is-checked" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setItems(toggleShoppingItem(item.key))}
                  aria-pressed={item.checked}
                  aria-label={t(
                    item.checked ? "shopping.markUndone" : "shopping.markDone",
                    { name: item.name },
                  )}
                  className="shop-toggle"
                >
                  <CheckCheck className="size-5" aria-hidden />
                </button>

                <span className="font-body shop-name">{item.name}</span>

                <button
                  type="button"
                  onClick={() => setItems(removeShoppingItem(item.key))}
                  aria-label={t("shopping.removeItem", { name: item.name })}
                  className="shop-remove"
                >
                  <Trash2 className="size-5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ═══════════ THE THREE NUMBERS ═══════════ */}
      <div className="shop-metrics">
        <StatBand
          items={[
            { value: String(items.length), label: t("shopping.stat.total") },
            { value: String(done), label: t("shopping.stat.done") },
            { value: String(items.length - done), label: t("shopping.stat.left") },
          ]}
        />
      </div>

      {/* ═══════════ WHERE NEXT ═══════════ */}
      <section className={`${SHELL} pb-20`} aria-label={t("shopping.closing.title")}>
        <div className="shop-cta">
          <p className="eyebrow">{t("shopping.closing.eyebrow")}</p>
          <h2 className="font-display shop-cta-title">{t("shopping.closing.title")}</h2>
          <p className="font-body shop-cta-body">{t("shopping.closing.body")}</p>
          <div className="shop-cta-actions">
            <Link to="/recipes" className="shop-cta-primary">
              {t("shopping.goToRecipes")}
              <Arrow className="size-4" aria-hidden />
            </Link>
            <Link to="/dashboard" className="shop-cta-secondary">
              {t("shopping.closing.dashboard")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShoppingList;
