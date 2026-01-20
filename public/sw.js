const CACHE_NAME = "my-app-cache-v2";
const PRECACHE_URLS = ["/", "/favicon.ico", "/icon1.png", "/icon2.png", "/manifest.webmanifest"];

// Install: pré-cache minimal
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

// Activate: purge anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // On ignore les requêtes non GET
  if (req.method !== "GET") return;

  // 1) Next static assets: cache-first
  // (JS/CSS/fonts/images build)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;

        return fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => cached); // si offline et pas en cache => undefined
      })
    );
    return;
  }

  // 2) Images: cache-first (optionnel mais utile)
  if (req.destination === "image") {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;

        return fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  // 3) Pages (documents): network-first (évite de servir "/" à la place)
  if (req.destination === "document") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(async () => {
          // fallback: page demandée si en cache, sinon "/"
          const cached = await caches.match(req);
          return cached || (await caches.match("/"));
        })
    );
    return;
  }

  // 4) Par défaut: network-first léger
  event.respondWith(
    fetch(req)
      .then((res) => res)
      .catch(() => caches.match(req))
  );
});
