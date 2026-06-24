const CACHE = "paintview-v5";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // Always fetch HTML & JS from network so deploys never serve stale bundles.
  if (
    e.request.mode === "navigate" ||
    url.pathname === "/" ||
    url.pathname.endsWith(".html") ||
    url.pathname.startsWith("/assets/")
  ) {
    e.respondWith(
      fetch(e.request).catch(async () => {
        const cached = await caches.match("/index.html");
        return cached ?? Response.error();
      })
    );
    return;
  }

  // Icons & manifest: cache after first fetch.
  if (url.pathname.startsWith("/assets/icon") || url.pathname === "/manifest.json") {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ??
          fetch(e.request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(e.request, clone));
            }
            return res;
          })
      )
    );
  }
});
