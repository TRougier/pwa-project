const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = ["/", "/reception", "/room", "/gallery", "/favicon.ico", "/icon1.png",
   "/icon2.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).catch(() => {
        if (event.request.destination === "document") {
          return caches.match("/");
        }
        return new Response("", { status: 503, statusText: "Offline" });
      });
    })
  );
});
