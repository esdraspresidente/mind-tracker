const CACHE_NAME = 'mind-tracker-v3';
const ASSETS = [
  '/mind-tracker/',
  '/mind-tracker/index.html',
  '/mind-tracker/manifest.json',
  '/mind-tracker/icon-192.png',
  '/mind-tracker/icon-512.png',
  '/mind-tracker/apple-touch-icon.png',
  '/mind-tracker/favicon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(() => {}) // não falha se algum asset não existir
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Só intercepta requests do mesmo origin
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
