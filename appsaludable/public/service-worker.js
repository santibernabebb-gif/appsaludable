
const CACHE_NAME = 'adelgaza-saludable-v2';
const ASSETS_TO_CACHE = [
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // No interceptar llamadas a la API
  if (url.pathname.includes('/api/')) {
    return;
  }

  // Estrategia Network-First para navegación (HTML principal)
  // Esto evita que se sirva un index.html viejo que apunte a JS/CSS inexistentes (hash viejo)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback a cache solo si el fetch falla y el recurso está cacheado
        return caches.match(event.request);
      })
    );
    return;
  }

  // Estrategia Cache-First para el resto de recursos estáticos (assets, manifest)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
