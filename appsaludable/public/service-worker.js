const CACHE_NAME = 'appsaludable-cache-v3';
const ASSETS_TO_CACHE = [
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Solo cacheamos el manifest y assets críticos, nunca el HTML principal (/)
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
          // Borramos cualquier caché que no sea el actual para evitar conflictos de versiones
          if (name !== CACHE_NAME) {
            console.log('Service Worker: Borrando caché antiguo:', name);
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

  // Estrategia Network-First para navegación (HTML principal / index.html)
  // Esto es CRÍTICO para evitar que se cargue un HTML viejo con hashes de JS inexistentes
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // En navegación, solo intentamos el caché si el fetch falla (offline real)
        return caches.match(event.request);
      })
    );
    return;
  }

  // Para el resto de recursos (imágenes, manifest, assets con hash en el nombre)
  // usamos Cache-First para mejorar la velocidad
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});