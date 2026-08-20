/* VELUNTU PWA Service Worker (v6 - Com Navegação Mobile-First & Microinterações) */

const CACHE_NAME = 'veluntu-v6';
const ASSETS_TO_CACHE = [
  './index.html',
  './egito.html',
  './africa-do-sul.html',
  './madagascar.html',
  './destino.html',
  './mapa.html',
  './colecao.html',
  './css/variables.css',
  './css/main.css',
  './css/map.css',
  './css/fullmap.css',
  './css/affinity.css',
  './css/journal.css',
  './css/pwaNav.css',
  './css/destination.css',
  './css/components.css',
  './js/data.js',
  './js/userJournal.js',
  './js/affinityExplorer.js',
  './js/map.js',
  './js/interactiveMap.js',
  './js/destination.js',
  './js/pwaManager.js',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching Complete Mobile PWA App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Dynamic caching of visited pages/images
          if (event.request.method === 'GET' && !event.request.url.includes('chrome-extension')) {
            cache.put(event.request.url, fetchRes.clone());
          }
          return fetchRes;
        });
      }).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
