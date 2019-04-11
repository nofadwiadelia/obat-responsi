if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker.register("serviceworker.js").then(function(registration) {
        // Registration was successful
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
      }, function(err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      });
    });
  }

var CACHE_NAME = "try-pwa-v1";
var urlsToCache = [
  "/",
  "/css/main.css",
  "/images/ugm.png",
  "/bootstrap/css/bootstrap-grid.css",
  "/bootstrap/css/bootstrap-grid.css.map",
  "/bootstrap/css/bootstrap-grid.min.css",
  "/bootstrap/css/bootstrap-grid.min.css.map",
  "/bootstrap/css/bootstrap-reboot.css",
  "/bootstrap/css/bootstrap-reboot.css.map",
  "/bootstrap/css/bootstrap-reboot.min.css",
  "/bootstrap/css/bootstrap-reboot.min.css.map",
  "/bootstrap/css/bootstrap.css",
  "/bootstrap/css/bootstrap.css.map",
  "/bootstrap/css/bootstrap.min.css",
  "/bootstrap/css/bootstrap.min.css.map",
  "/bootstrap/js/bootstrap.bundle.js",
  "/bootstrap/js/bootstrap.bundle.js.map",
  "/bootstrap/js/bootstrap.bundle.min.js",
  "/bootstrap/js/bootstrap.bundle.min.js.map",
  "/bootstrap/js/bootstrap.js",
  "/bootstrap/js/bootstrap.js.map",
  "/bootstrap/js/bootstrap.min.js",
  "/bootstrap/js/bootstrap.min.js.map",
  "/images/icons/icon-72x72.png",
  "/images/icons/icon-96x96.png",
  "/images/icons/icon-128x128.png",
  "/images/icons/icon-144x144.png",
  "/images/icons/icon-152x152.png",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-384x384.png",
  "/images/icons/icon-512x512.png",
  "/images/centang.png",
  "/images/times.png",
  "/js/jquery.min.js",
  "/js/main.js",
  "/index.html",
  "/serviceworker.js",
  "/manifest.json"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){
        console.log("open cache");
        return cache.addAll(urlsToCache);
      })
  )
});
  
  self.addEventListener("fetch", function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== "basic") {
                return response;
              }
  
              
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });