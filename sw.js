const CACHE = "dimple-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./header-couple.png",
  "./song.mp3",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(res =>
      res || fetch(e.request).then(networkRes => {
        try {
          const copy = networkRes.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        } catch {}
        return networkRes;
      }).catch(()=>res)
    )
  );
});
