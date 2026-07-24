let updateInterval: ReturnType<typeof setInterval> | null = null;
let updateToastTimer: ReturnType<typeof setTimeout> | null = null;

export function registerSW() {
  // Skip SW registration in development to avoid "Offline" issues
  if (import.meta.env.DEV) {
    console.log("[SW] Skipping registration in development mode");
    return;
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          updateInterval = setInterval(() => registration.update(), 60 * 60 * 1000);

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            const onStateChange = () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                showUpdateToast();
              }
              if (newWorker.state === "activated") {
                newWorker.removeEventListener("statechange", onStateChange);
              }
            };
            newWorker.addEventListener("statechange", onStateChange);
          });
        })
        .catch(() => {});
    });
  }
}

export function unregisterSW() {
  if (updateInterval) clearInterval(updateInterval);
  if (updateToastTimer) clearTimeout(updateToastTimer);
}

function showUpdateToast() {
  if (document.getElementById("sw-update-toast")) return;

  const toast = document.createElement("div");
  toast.id = "sw-update-toast";
  toast.className = "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[360px] z-[100]";
  toast.innerHTML = `
    <div class="bg-card border border-border/50 rounded-3xl shadow-float p-4 flex items-center gap-3">
      <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center">
        <svg class="size-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-bold">تحديث متاح</p>
        <p class="text-xs text-muted-foreground">نسخة جديدة من وعي جاهزة</p>
      </div>
      <button id="sw-update-btn" class="px-3 py-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition">
        تحديث الآن
      </button>
    </div>
  `;
  document.body.appendChild(toast);

  document.getElementById("sw-update-btn")?.addEventListener("click", () => {
    window.location.reload();
  });

  updateToastTimer = setTimeout(() => {
    const el = document.getElementById("sw-update-toast");
    if (el) el.remove();
  }, 30_000);
}