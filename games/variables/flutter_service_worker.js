'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"main.dart.js": "590cca46e78fbfc790daa7544935cf18",
"assets/AssetManifest.bin": "cd42f865e48f26c9eab1f4c7d4df8a7a",
"assets/fonts/MaterialIcons-Regular.otf": "32fce58e2acb9c420eab0fe7b828b761",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/assets/draw-3.png": "71ddc129ee5f241e8e593f485b2bbff7",
"assets/assets/%25E7%25AD%2586%25E5%2588%25B74.png": "46ca5093b7041b4a7af78e46161a8d84",
"assets/assets/skip_button.jpg": "987c5cf7222cdd47d173bd62a1593387",
"assets/assets/%25E5%2588%25B7%25E5%25AD%2590.png": "b38c3ea987d6d97552f50161591c2dc1",
"assets/assets/draw-1.png": "b0497dbb30c33955be9a38975fc4dafd",
"assets/assets/background_music.MP3": "ee1bf2c6d0ec0cd155e42ee75ca6a64e",
"assets/assets/%25E7%25AD%2586%25E5%2588%25B7%25E7%2584%25A1%25E8%2589%25B2.png": "591429e3165e634c569d30108fc621b0",
"assets/assets/%25E7%25AD%2586%25E5%2588%25B72.png": "421a63c0c8eb9e3645ad169282794871",
"assets/assets/background.png": "13a0bf1b55868242df89d8b17b7aa751",
"assets/assets/win.png": "b496f29f6e7af0de0aa3502f70871a6f",
"assets/assets/draw-empty.png": "71c6e70ebb609721cd3f7b194dbe54c9",
"assets/assets/start_button.jpg": "947e50f25d01bc7a04a138ddb1b412e6",
"assets/assets/%25E7%25AD%2586%25E5%2588%25B71.png": "fd31e75bcd1d9b3598fbd9cabdedce51",
"assets/assets/%25E5%25AE%258C%25E6%2588%2590%25E9%2588%25B4%25E9%2590%25BA%25E9%259F%25B3%25E6%2595%2588.MP3": "7e7ac1b2a62b5690c8f697044ee819fc",
"assets/assets/draw-2.png": "7282263ae2947cc8048aee01e3a2697f",
"assets/assets/draw-4.png": "af293aeadd81c8290353dd8b76848d78",
"assets/assets/draw-full.png": "19d71ebb62f5fa65bf8d873b0dc19fd8",
"assets/assets/%25E7%25AD%2586%25E5%2588%25B73.png": "36a4bb6b92a77664d2176237bdaae6b4",
"assets/assets/%25E6%2581%25AD%25E5%2596%259C%25E5%25AE%258C%25E6%2588%2590%25E9%259F%25B3%25E6%25A8%2582.MP3": "532085ac20b7813cc4f8f360653f42c3",
"assets/NOTICES": "f78451f00229b9d44d977cfbffb408ac",
"assets/AssetManifest.bin.json": "fc7196bcaf798fd540e89a210b7d0b83",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/AssetManifest.json": "c0d65c932fcabfd60b879d34d8f45658",
"version.json": "726230d27044b720748fbf20ae967672",
"manifest.json": "3d6c7058f15b1eb33f94a490500c9449",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"index.html": "76f5663d55b56bd5507fe9239faf7075",
"/": "76f5663d55b56bd5507fe9239faf7075",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
