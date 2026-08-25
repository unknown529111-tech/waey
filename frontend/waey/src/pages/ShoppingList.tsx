import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBasket, Trash2, CheckCheck, UtensilsCrossed } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import {
  getShoppingList,
  toggleShoppingItem,
  removeShoppingItem,
  clearCheckedItems,
  clearShoppingList,
  type ShoppingItem,
} from "@/lib/shoppingList";

const ShoppingList = () => {
  const t = useT();
  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    trackEvent("page_view", { page: "shopping-list" });
    setItems(getShoppingList());
  }, []);

  const done = items.filter((i) => i.checked).length;

  return (
    <div className="relative min-h-[60vh]">
      <div className="relative">
        <PageHero title={t('shopping.title')} subtitle={t('shopping.subtitle')} />

        <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBasket className="size-4 text-primary" />
              <span className="font-bold tabular-nums">{items.length}</span> {t('shopping.items')}
              {done > 0 && (
                <span className="text-accent font-bold tabular-nums">
                  · {done} {t('shopping.done')}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {done > 0 && (
                <button
                  onClick={() => setItems(clearCheckedItems())}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-secondary text-foreground hover:bg-muted transition-all duration-300"
                >
                  {t('shopping.clearChecked')}
                </button>
              )}
              {items.length > 0 && (
                <button
                  onClick={() => setItems(clearShoppingList())}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-300"
                >
                  {t('shopping.clearAll')}
                </button>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="bg-card border border-border/50 rounded-[2rem] p-10 text-center shadow-soft">
              <UtensilsCrossed className="size-10 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground mb-6">{t('shopping.empty')}</p>
              <Link to="/recipes" className="btn btn-moss font-body px-6 py-2.5 text-sm inline-flex items-center gap-2 hover:scale-[1.03] transition-transform">
                {t('shopping.goToRecipes')}
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.key}
                  className={`group flex items-center gap-4 bg-card border border-border/50 rounded-[2rem] px-5 py-3.5 shadow-soft transition-all duration-300 ${
                    item.checked ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-moss-lg"
                  }`}
                >
                  <button
                    onClick={() => setItems(toggleShoppingItem(item.key))}
                    aria-label={t('shopping.done')}
                    className={`size-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-300 ${
                      item.checked
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {item.checked && <CheckCheck className="size-3.5" />}
                  </button>
                  <span className={`flex-1 leading-relaxed text-sm md:text-base ${item.checked ? "line-through" : ""}`}>
                    {item.name}
                  </span>
                  <button
                    onClick={() => setItems(removeShoppingItem(item.key))}
                    aria-label={t('shopping.clearAll')}
                    className="size-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ShoppingList;