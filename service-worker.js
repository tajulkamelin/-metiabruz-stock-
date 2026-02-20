const CACHE_NAME = "metiabruz-v2-stable";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://unpkg.com/@supabase/supabase-js@2",
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap",
  "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css",
  "https://cdn.jsdelivr.net/npm/toastify-js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Network first for API (Supabase), Cache first for static assets
  if (event.request.url.includes('supabase')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  } else {
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
  }
});
