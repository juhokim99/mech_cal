const CACHE_NAME = 'mechstudio-cache-v1';

// 설치 즉시 대기 없이 활성화
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// 이전 버전 캐시 정리
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// 네트워크 우선 호출 후 오프라인 시 캐시 fallback
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
