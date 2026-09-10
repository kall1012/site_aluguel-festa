// Service Worker para DEPIL JOY - PWA
const CACHE_NAME = 'depil-joy-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/img/banner-depiljoy.png?v=20260907-2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  const isBanner = requestUrl.pathname === '/img/banner-depiljoy.png';

  event.respondWith(
    isBanner
      ? fetch(event.request, { cache: 'reload' })
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => caches.match(event.request))
      : caches.match(event.request)
          .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
