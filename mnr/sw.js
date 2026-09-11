/*
 * M&R Fashion — static asset caching service worker
 *
 * Strategy: stale-while-revalidate, and ONLY for same-origin GET requests
 * for static assets (css/js/fonts/images/videos).
 *
 * Explicitly, deliberately, does NOT touch:
 *   - the HTML document itself (always fetched fresh — no stale homepage,
 *     prices, or stock info)
 *   - any non-GET request (POST/PUT/etc. are never intercepted)
 *   - any cross-origin request (Razorpay, Google Apps Script backend,
 *     mr-backend-lr9l.onrender.com, GA4, Meta Pixel, Cloudflare, pincode
 *     lookup API, etc.)
 *
 * If a request doesn't clearly match "same-origin GET static asset", the
 * fetch handler returns early WITHOUT calling event.respondWith(), which
 * means the browser just handles it completely normally, as if this
 * service worker didn't exist. That's the safety net.
 */

const CACHE_NAME = 'mnr-static-v1';
const CACHEABLE_DESTINATIONS = new Set(['style', 'script', 'font', 'image', 'video']);

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only GET — never intercept POST/PUT/DELETE (orders, payments, stock).
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }

  // Only same-origin — never touch the backend, Razorpay, GA4, Meta, etc.
  if (url.origin !== self.location.origin) return;

  // Never touch page navigations / the HTML document itself.
  if (req.mode === 'navigate' || req.destination === 'document' || req.destination === '') return;

  // Only cache genuinely static asset types.
  if (!CACHEABLE_DESTINATIONS.has(req.destination)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(req).then((cached) => {
        const networkFetch = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(req, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cached);

        // Serve cached copy instantly if we have one, refresh in the
        // background either way. If nothing cached yet, wait on network.
        return cached || networkFetch;
      })
    )
  );
});
