/*
	Cache Service Worker template v20250109
    by mrc 2019

	mostly based on:
	https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js
	https://github.com/chriscoyier/Simple-Offline-Site/blob/master/js/service-worker.js
	https://gist.github.com/kosamari/7c5d1e8449b2fbc97d372675f16b566e	
	
	Note for GitHub Pages:
	there can be an unexpected behaviour (cache not updating) when site is accessed from
	https://user.github.io/repo/ (without index.html) in some browsers (Firefox)
	use absolute paths if hosted in GitHub Pages in order to avoid it
	also invoke sw with an absolute path:
	navigator.serviceWorker.register('/repo/_cache_service_worker.js', {scope: '/repo/'})
*/

const PRECACHE_ID = 'zelda-botw-editor';
const PRECACHE_VERSION = 'v6';
const PRECACHE_NAME = `precache-${PRECACHE_ID}-${PRECACHE_VERSION}`;
const PRECACHE_URLS = [
    '/savegame-editors/zelda-botw/',
    '/savegame-editors/zelda-botw/index.html',
    '/savegame-editors/zelda-botw/zelda-botw.css',
    '/savegame-editors/zelda-botw/zelda-botw.js',
    '/savegame-editors/zelda-botw/zelda-botw.data.js',
    '/savegame-editors/zelda-botw/zelda-botw.icons.js',
    '/savegame-editors/zelda-botw/zelda-botw.locations.js',
    '/savegame-editors/zelda-botw/zelda-botw.score.js',
    '/savegame-editors/zelda-botw/zelda-botw.master.js',
    '/savegame-editors/zelda-botw/favicon.png',
    '/savegame-editors/zelda-botw/assets/_blank.png',
    '/savegame-editors/zelda-botw/assets/logo.png',
    '/savegame-editors/zelda-botw/assets/tabs.png',
    '/savegame-editors/zelda-botw/assets/bg_black.jpg',
    '/savegame-editors/zelda-botw/assets/bg_white.jpg',
    '/savegame-editors/savegame-editor.js'
];

/* Install event: opens a new cache */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

/* Activate event: cleans up old caches */
self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            const cachesToDelete = cacheNames.filter(cacheName => {
                return (cacheName.startsWith('precache-') && cacheName !== PRECACHE_NAME) ||
                    cacheName === 'runtime' ||
                    /^v?\d+\w?$/.test(cacheName);
            });
            await Promise.all(cachesToDelete.map(cacheToDelete => {
                console.log(`Deleting old cache: ${cacheToDelete}`);
                return caches.delete(cacheToDelete);
            }));
            return self.clients.claim();
        })()
    );
});

/* Fetch event: returns cached resource when available */
self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) { // Skip cross-origin requests
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    return cachedResponse || fetch(event.request);
                })
        );
    }
});
