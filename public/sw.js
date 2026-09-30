// Progressive Web App Service Worker for Dinasti Nasrukhan
const CACHE_NAME = 'dinasti-nasrukhan-v1';
const OFFLINE_URL = '/offline.html';

// Assets to precache immediately
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/icons/icon.svg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event Strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Only handle GET requests from the same origin or allowed CDN (e.g. fonts)
  if (request.method !== 'GET') {
    return;
  }

  // 2. Ignore Chrome extension or non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 3. For navigation (HTML document requests): Network First, fallback to cache, then offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // If response is valid, update the cache for offline reading
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Network failed, try to serve matching cached response
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to offline page
          const offlinePage = await caches.match(OFFLINE_URL);
          return offlinePage || new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // 4. For static assets (images, icons, fonts, css, js)
  const isStaticAsset =
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.startsWith('/build/') ||
    url.pathname.startsWith('/icons/') ||
    url.hostname.includes('fonts.bunny.net');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Return cached version if found, while fetching fresh version in background (Stale-While-Revalidate)
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Ignore background fetch errors for static assets if offline
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 5. Default network-first for other GET requests
  event.respondWith(
    fetch(request).catch(async () => {
      return caches.match(request);
    })
  );
});

// Listen for messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
