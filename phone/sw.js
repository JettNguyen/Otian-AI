// Service worker for /phone/. It caches nothing, on purpose.
//
// It exists for one reason: Chrome will not fire `beforeinstallprompt`, and so will not offer to
// install the page to a home screen, unless a service worker is registered. That is the whole job.
//
// It deliberately does NOT cache. This site has no build step and no hashed filenames, so a caching
// worker would serve yesterday's styles.css and phone.js until something invalidated them, and
// there is nothing here to do that invalidating. The page is also useless offline (it manages a
// computer over the network), so an offline cache would buy a stale app in exchange for nothing.
//
// If caching is ever wanted here, it needs versioned asset names first.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => event.respondWith(fetch(event.request)));
