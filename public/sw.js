const VERSION = "gye-v2";
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const PRECACHE = ["/he", "/yi", "/en", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Build files carry a hash in their name, so a cached copy is always current.
const isHashed = (url) => url.pathname.startsWith("/_next/static/");
// Images keep their name when replaced: serve the cached copy, refresh it in the background.
const isImage = (url) => url.pathname.startsWith("/images/") || url.pathname.startsWith("/icons/");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Media is streamed with range requests; let the browser handle it directly.
  if (url.pathname.startsWith("/media/")) return;

  if (isHashed(url) || isImage(url)) {
    event.respondWith(
      caches.match(request).then((hit) => {
        const refresh = () =>
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(request, copy));
            }
            return res;
          });
        if (!hit) return refresh();
        if (isImage(url)) event.waitUntil(refresh().catch(() => {}));
        return hit;
      }),
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) caches.open(PAGES).then((c) => c.put(request, res.clone()));
          return res;
        })
        .catch(async () => {
          const hit = await caches.match(request);
          if (hit) return hit;
          const lang = url.pathname.split("/")[1];
          return (await caches.match(`/${["he", "yi", "en"].includes(lang) ? lang : "he"}`)) || Response.error();
        }),
    );
  }
});
