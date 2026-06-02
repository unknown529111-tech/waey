import { describe, it, expect, beforeEach } from "vitest";
import { getFavorites, toggleFavorite, isFavorite } from "@/lib/favorites";

beforeEach(() => {
  localStorage.clear();
});

describe("getFavorites", () => {
  it("returns empty array when nothing stored", () => {
    expect(getFavorites()).toEqual([]);
  });

  it("returns stored favorites", () => {
    localStorage.setItem("waey_recipe_favs", JSON.stringify(["a", "b"]));
    expect(getFavorites()).toEqual(["a", "b"]);
  });

  it("returns empty array on corrupt JSON", () => {
    localStorage.setItem("waey_recipe_favs", "garbage");
    expect(getFavorites()).toEqual([]);
  });
});

describe("toggleFavorite", () => {
  it("adds a new favorite", () => {
    toggleFavorite("recipe-1");
    expect(getFavorites()).toEqual(["recipe-1"]);
  });

  it("removes an existing favorite", () => {
    toggleFavorite("recipe-1");
    toggleFavorite("recipe-1");
    expect(getFavorites()).toEqual([]);
  });

  it("returns the new list", () => {
    const list = toggleFavorite("abc");
    expect(list).toEqual(["abc"]);
  });

  it("handles multiple items", () => {
    toggleFavorite("a");
    toggleFavorite("b");
    expect(getFavorites()).toEqual(["a", "b"]);
  });

  it("only removes the exact id", () => {
    toggleFavorite("a");
    toggleFavorite("b");
    toggleFavorite("a");
    expect(getFavorites()).toEqual(["b"]);
  });
});

describe("isFavorite", () => {
  it("returns false when not favorited", () => {
    expect(isFavorite("x")).toBe(false);
  });

  it("returns true after favoriting", () => {
    toggleFavorite("x");
    expect(isFavorite("x")).toBe(true);
  });

  it("returns false after un-favoriting", () => {
    toggleFavorite("x");
    toggleFavorite("x");
    expect(isFavorite("x")).toBe(false);
  });
});
