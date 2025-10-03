const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",
  "/favicon.ico",
  "/icon1.png",
  "/icon2.png"
];

// Installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("Service Worker: caching files");
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn("❌ Impossible de mettre en cache :", url, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Intercepter les requêtes
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si trouvé dans le cache, on le renvoie
      if (cachedResponse) {
        return cachedResponse;
      }
      // Sinon on fait la requête réseau
      return fetch(event.request).catch(() => {
        // Ici tu peux renvoyer une page fallback si tu veux
        if (event.request.destination === "document") {
          return caches.match("/"); // renvoyer index.html
        }
      });
    })
  );
});
