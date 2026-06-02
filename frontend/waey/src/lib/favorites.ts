const KEY = "waey_recipe_favs";

export const getFavorites = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const toggleFavorite = (id: string): string[] => {
  const list = getFavorites();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const isFavorite = (id: string) => getFavorites().includes(id);
