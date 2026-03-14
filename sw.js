/* ═══════════════════════════════════════════════════════════
   MANMIN Fire Calc — Service Worker  v2.0
   Engineer Kim Manmin · portal
═══════════════════════════════════════════════════════════ */

const CACHE_NAME   = 'manmin-portal-v2';
const OFFLINE_URL  = './';

/* 캐시할 파일 목록 */
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  /* Pretendard CDN (중요 폰트만) */
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css',
];

/* ── Install ── */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE.map(function(url) {
        return new Request(url, { mode: 'no-cors' });
      })).catch(function(err) {
        console.warn('[SW] precache partial fail:', err);
      });
    }).then(function() {
      console.log('[SW] install complete — cache:', CACHE_NAME);
      return self.skipWaiting();
    })
  );
});

/* ── Activate ── */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) {
              console.log('[SW] deleting old cache:', k);
              return caches.delete(k);
            })
      );
    }).then(function() {
      console.log('[SW] activate complete');
      return self.clients.claim();
    })
  );
});

/* ── Fetch — Network First, Cache Fallback ── */
self.addEventListener('fetch', function(event) {
  /* POST 등 캐시 불필요한 요청은 그냥 통과 */
  if (event.request.method !== 'GET') return;

  /* Chrome extension 등 무시 */
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        /* 정상 응답이면 캐시에도 저장 */
        if (response && response.status === 200 && response.type !== 'opaque') {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function() {
        /* 오프라인 — 캐시에서 꺼내기 */
        return caches.match(event.request).then(function(cached) {
          if (cached) return cached;
          /* HTML 페이지 요청이면 포털 홈 반환 */
          if (event.request.headers.get('accept') &&
              event.request.headers.get('accept').includes('text/html')) {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});
