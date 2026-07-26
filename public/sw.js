const CACHE_NAME = 'convertverse-v2';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './icons.svg'
];

// Install Event - Pre-cache core shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Dynamic routing and caching strategy
self.addEventListener('fetch', (event) => {
  // Only intercept standard GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip non-http/https protocols (like chrome-extension or devtools)
  if (!url.protocol.startsWith('http')) return;

  // Determine if this is a navigation/document request (HTML page)
  const acceptHeader = event.request.headers.get('accept') || '';
  const isNavigation = event.request.mode === 'navigate' || 
                       acceptHeader.includes('text/html') ||
                       url.pathname === '/' || 
                       url.pathname.endsWith('/') ||
                       url.pathname.endsWith('/index.html') ||
                       url.pathname.toLowerCase().includes('/convertverse');

  if (isNavigation) {
    // Strategy: Network-First for the HTML page to ensure users always get updates when online.
    // We add a cache-buster query parameter to bypass the browser's HTTP cache for the document request.
    const requestUrl = new URL(event.request.url);
    requestUrl.searchParams.set('_cb', Date.now().toString());
    
    // Construct request manually since 'navigate' mode is not constructable via 'new Request'
    const bustedRequest = new Request(requestUrl.toString(), {
      method: event.request.method,
      headers: event.request.headers,
      mode: event.request.mode === 'navigate' ? 'same-origin' : event.request.mode,
      credentials: event.request.credentials,
      redirect: event.request.redirect
    });

    event.respondWith(
      fetch(bustedRequest)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // Cache it under the original request URL, not the cache-busted URL!
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // If '/' didn't match, try matching '/index.html' explicitly
            return caches.match('./index.html');
          });
        })
    );
  } else {
    // Strategy: Cache-First for static assets (JS, CSS, images, CDNs)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Validate response before caching
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Cache Poisoning Prevention:
            // Do not cache HTML fallback responses for JS/CSS or other assets (commonly returned by SPA routers on 404)
            const contentType = networkResponse.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          })
          .catch((err) => {
            console.warn('[SW] Network fetch failed for asset:', url.href, err);
            return new Response('Asset unavailable offline', { 
              status: 503, 
              statusText: 'Service Unavailable' 
            });
          });
      })
    );
  }
});
