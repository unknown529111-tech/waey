// Waey PWA Service Worker - Offline-first strategy
// Version: increment when changing cache keys
const CACHE_VERSION = "waey-v6";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

const NETWORK_TIMEOUT = 5000;

// Assets to precache on install
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/404.html",
];

// Cache strategies
const NETWORK_FIRST = "network-first";
const CACHE_FIRST = "cache-first";

// Route patterns and their strategies (same-origin paths only)
const ROUTES = [
  { pattern: /^\/$|\/dashboard|\/health|\/finance|\/environment|\/education|\/assistant|\/insights|\/recipes|\/plans|\/quiz/, strategy: NETWORK_FIRST },
  { pattern: /\.(js|css|woff2?|png|jpg|jpeg|svg|ico|webp)$/, strategy: CACHE_FIRST },
  { pattern: /\/api\/|\/functions\//, strategy: NETWORK_FIRST },
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("Precache partial failure:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  // Only handle same-origin requests. Third-party URLs (analytics beacons,
  // CDN scripts, Supabase API, fonts from other hosts, etc.) must pass
  // through untouched — intercepting them causes unhandled fetch failures
  // when they are blocked or unreachable (e.g. by an ad blocker).
  if (url.origin !== self.location.origin) return;

  const route = ROUTES.find((r) => r.pattern.test(url.pathname));
  const strategy = route?.strategy || NETWORK_FIRST;

  event.respondWith(handleRequest(request, strategy).catch(() => {
    // Never surface an unhandled rejection from the fetch handler.
    return new Response("", { status: 504, statusText: "Gateway Timeout" });
  }));
});

async function handleRequest(request, strategy) {
  const url = new URL(request.url);
  const isImage = !!url.pathname.match(/\.(png|jpg|jpeg|svg|webp)$/);
  const cacheName = isImage ? IMAGE_CACHE : DYNAMIC_CACHE;

  switch (strategy) {
    case NETWORK_FIRST:
      return networkFirst(request, cacheName);
    case CACHE_FIRST:
      return cacheFirst(request, cacheName);
    default:
      return networkFirst(request, cacheName);
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), NETWORK_TIMEOUT)),
    ]);
    if (response.ok && request.mode !== "navigate") {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      // Never serve a stale app shell: fall back to the precached home page
      const offline = await caches.match("/");
      return offline || new Response("Offline", { status: 503 });
    }
    // Non-navigation request with no cached copy: signal failure instead of
    // throwing, so blocked/failed fetches never become unhandled rejections.
    return new Response("", { status: 504, statusText: "Gateway Timeout" });
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    return new Response("Offline", { status: 503 });
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-offline-actions") {
    event.waitUntil(syncOfflineActions());
  }
});

async function syncOfflineActions() {
  console.log("Background sync triggered");
}

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      dir: "rtl",
      lang: "ar",
      data: data.url,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});