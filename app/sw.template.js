// Service worker – généré par build/build.mjs (ne pas modifier dist/sw.js à la main).
// Pré-cache TOUT au premier chargement (pages, contenu FR + EN, icônes, calculateur),
// puis sert tout depuis le cache : l'application fonctionne sans réseau.
// Une nouvelle version se télécharge en arrière-plan ; l'application propose « Actualiser ».
const VERSION = '__VERSION__';
const CACHE = `antidotes-${VERSION}`;
const ASSETS = __ASSETS__;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache: 'reload' → ignore le cache HTTP du navigateur, prend les fichiers frais
    await cache.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('antidotes-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
    for (const c of await self.clients.matchAll({ includeUncontrolled: true })) c.postMessage({ type: 'precached', version: VERSION });
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // liens externes : réseau normal
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (req.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      return await fetch(req);
    } catch (e) {
      const shell = req.mode === 'navigate' ? await cache.match('./index.html') : null;
      return shell || new Response('Hors ligne / Offline', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
