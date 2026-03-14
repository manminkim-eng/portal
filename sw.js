/* ═══════════════════════════════════════════════════
   MANMIN NFTC Portal — Service Worker v2.1
   manminkim-eng.github.io/portal/
   ═══════════════════════════════════════════════════ */
const CACHE    = 'manmin-portal-v2.1';
const RT_CACHE = 'manmin-rt-v2.1';

const PRECACHE = [
  './', './index.html', './manifest.json', './favicon.ico',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];
const CDN = ['cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','unpkg.com'];

self.addEventListener('install', e =>
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
);
self.addEventListener('activate', e =>
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k!==CACHE && k!==RT_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
);
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === self.location.origin)      { e.respondWith(cacheFirst(e.request));    return; }
  if (url.hostname.endsWith('github.io'))       { e.respondWith(networkFirst(e.request));  return; }
  if (CDN.some(h => url.hostname.includes(h))) { e.respondWith(staleRevalidate(e.request)); return; }
  e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
});

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  try {
    const r = await fetch(req);
    if (r.ok) { const c = await caches.open(CACHE); c.put(req, r.clone()); }
    return r;
  } catch { return caches.match('./index.html'); }
}
async function networkFirst(req) {
  const c = await caches.open(RT_CACHE);
  try { const r = await fetch(req); if (r.ok) c.put(req, r.clone()); return r; }
  catch { return (await c.match(req)) || caches.match('./index.html'); }
}
async function staleRevalidate(req) {
  const c = await caches.open(RT_CACHE);
  const hit = await c.match(req);
  const fp = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
  return hit || fp;
}
