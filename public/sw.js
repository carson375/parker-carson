// Service worker for parker-carson.com — same policy as StridePulse and
// Home Base: live content is never served stale, only the shell and
// static assets are cached.
// - Navigations: network-first, fall back to the cached shell when the
//   server is unreachable.
// - /api/*: network only, never cached.
// - /_next/static/*, /fonts/*, /static/*: cache-first (immutable assets).
// - Everything else (including Cloudinary images): straight to network.
// GET requests only; bump CACHE_VERSION to invalidate old caches.
const CACHE_VERSION = 'parker-carson-v1'
const SHELL = ['/', '/static/favicons/android-chrome-192x192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (url.pathname.startsWith('/api/')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put('/', copy))
          return response
        })
        .catch(() => caches.match('/'))
    )
    return
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/static/')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone()
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
            return response
          })
      )
    )
  }
})
