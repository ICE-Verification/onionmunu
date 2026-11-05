const CACHE_NAME = 'onion-pos-v2';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// الجلب من الإنترنت أولاً للحصول على أحدث كود، وعند انقطاع الإنترنت يعمل من الذاكرة
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, resClone);
        });
        return response;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});
