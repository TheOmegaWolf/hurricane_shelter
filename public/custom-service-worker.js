// custom-service-worker.js

const CACHE_NAME = 'my-app-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/logo192.png',
  '/logo512.png',
  '/images/logo.svg'
  // Add other assets you want to cache
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Function to save state to cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_STATE') {
    const { key, data } = event.data;
    caches.open(CACHE_NAME).then((cache) => {
      const request = new Request(key);
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
      cache.put(request, response);
    });
  }
});