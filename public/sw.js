self.addEventListener("install", function (event) {
    console.log("Service Worker: installé");
    self.skipWaiting(); // maintenant TypeScript comprend
});
self.addEventListener("activate", function (event) {
    console.log("Service Worker: activé");
});
self.addEventListener("fetch", function (event) {
    console.log("Service Worker: fetch", event.request.url);
});
