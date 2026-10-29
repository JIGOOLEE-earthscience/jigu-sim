/* 지구시스템과학 시뮬레이션 — 오프라인 저장(서비스 워커)
   새 단원을 올릴 때: ASSETS에 파일을 추가하고 VERSION을 바꾼다. */
const VERSION = '2026-10-29-1';
const CACHE = 'jigu-sim-' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './units/2-05-tide.html',
  './units/3-03-stability-precipitation.html',
  './lib/three.min.js',
  './pwa.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];
const TIMEOUT = 4000; // 인터넷이 느리면 이 시간 뒤 저장본으로 연다(ms)

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('jigu-sim-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;
  e.respondWith(networkFirst(req, e));
});

/* 인터넷이 되면 항상 최신 파일을 받고(저장본도 갱신), 안 되면 저장본으로 연다 */
async function networkFirst(req, e) {
  const cache = await caches.open(CACHE);
  const net = fetch(req, { cache: 'no-cache' }).then(res => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  });
  try {
    return await Promise.race([net, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), TIMEOUT))]);
  } catch (err) {
    const hit = (await cache.match(req, { ignoreSearch: true })) ||
                (req.mode === 'navigate' ? await cache.match('./index.html') : undefined);
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net;
  }
}
