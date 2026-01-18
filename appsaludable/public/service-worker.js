const CACHE_NAME = 'santisystems-cache-v2';
const ASSETS_TO_CACHE = [
  '/manifest.webmanifest'
];

// Instalación: Cachear únicamente el manifiesto y assets estáticos mínimos definidos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación: Eliminar cualquier caché antigua para evitar conflictos de versiones
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepción de peticiones (Fetch)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. No interceptar llamadas a la API para asegurar funcionamiento en tiempo real
  if (url.pathname.includes('/api/')) {
    return;
  }

  // 2. Estrategia Network-First para peticiones de navegación (HTML)
  // No cacheamos "/" ni "/index.html" para asegurar que el usuario nunca vea una versión obsoleta (pantalla gris)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback: si falla la red, intenta cargar el index.html base (solo funcionará si el navegador tiene la ruta base)
        return fetch('/index.html');
      })
    );
    return;
  }

  // 3. Estrategia Cache-First para el resto de assets estáticos (manifiesto, etc.)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});