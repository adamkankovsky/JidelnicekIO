const CACHE_NAME = 'jidelnicek-v1';

const PRECACHE_URLS = [
  './',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);

      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(() => null);

      if (cached) {
        fetchPromise;
        return cached;
      }

      const networkResponse = await fetchPromise;
      if (networkResponse) {
        return networkResponse;
      }

      if (request.mode === 'navigate') {
        const fallback = await cache.match('./');
        if (fallback) return fallback;
      }

      return new Response('Offline', { status: 503, statusText: 'Offline' });
    })
  );
});
