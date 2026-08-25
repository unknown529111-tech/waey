const KEY = "waey_shopping_list";

export type ShoppingItem = {
  key: string;
  name: string;
  checked: boolean;
};

export const getShoppingList = (): ShoppingItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

function save(list: ShoppingItem[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function itemKey(name: string): string {
  return name.trim().toLowerCase();
}

/** Add ingredient names; existing unchecked items stay, checked ones reset to unchecked. */
export const addToShoppingList = (names: string[]): ShoppingItem[] => {
  const list = getShoppingList();
  for (const raw of names) {
    const name = raw.trim();
    if (!name) continue;
    const key = itemKey(name);
    const existing = list.find((i) => i.key === key);
    if (existing) {
      existing.checked = false;
    } else {
      list.push({ key, name, checked: false });
    }
  }
  save(list);
  return list;
};

export const toggleShoppingItem = (key: string): ShoppingItem[] => {
  const list = getShoppingList().map((i) =>
    i.key === key ? { ...i, checked: !i.checked } : i
  );
  save(list);
  return list;
};

export const removeShoppingItem = (key: string): ShoppingItem[] => {
  const list = getShoppingList().filter((i) => i.key !== key);
  save(list);
  return list;
};

export const clearCheckedItems = (): ShoppingItem[] => {
  const list = getShoppingList().filter((i) => !i.checked);
  save(list);
  return list;
};

export const clearShoppingList = (): ShoppingItem[] => {
  save([]);
  return [];
};