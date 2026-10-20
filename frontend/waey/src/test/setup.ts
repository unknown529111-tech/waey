import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Node >= 24 ships a global `localStorage` that is undefined unless
// --localstorage-file is passed. vitest's populateGlobal sees the key already
// present on globalThis and therefore skips jsdom's working copy, so every
// storage-backed test dies on `localStorage.clear()`. Re-attach jsdom's copy.
const jsdomWindow = (globalThis as { jsdom?: { window?: Window } }).jsdom?.window;
if (typeof globalThis.localStorage === "undefined" && jsdomWindow?.localStorage) {
  Object.defineProperty(globalThis, "localStorage", {
    value: jsdomWindow.localStorage,
    configurable: true,
    writable: true,
  });
}
