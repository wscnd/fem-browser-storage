self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      try {
        const fetchResponse = await fetch(event.request);
        const cache = await cache.open("cm-images");

        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      } catch (error) {
        const cachedResponse = await caches.match(event.request);
        return cachedResponse ? cachedResponse : fetch(event.request);
      }
    })()
  );
});

self.addEventListener("fetch", async (event) => {
  event.respondWith(
    (async () => {
      try {
        const fetchResponse = await fetch(event.request);
        const cache = await cache.open("cm-images");

        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      } catch (e) {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
      }
    })()
  );
});
