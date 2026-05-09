const VERSION = 'v' + Date.now();

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll())
      .then(clients => clients.forEach(c => c.postMessage({ type: 'RELOAD' })))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .catch(() => caches.match(e.request))
  );
});
