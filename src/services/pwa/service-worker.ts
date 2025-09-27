/**
 * AAA+ Progressive Web App Service Worker
 * Advanced caching strategies with offline-first architecture
 * Smart preloading and background sync
 */

/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'stealth-learning-v1.0.0';
const DYNAMIC_CACHE = 'stealth-learning-dynamic-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/logo.svg',
  '/assets/sounds/success.mp3',
  '/assets/sounds/click.mp3',
  '/assets/sounds/celebration.mp3'
];

// Cache strategies
const CACHE_STRATEGIES = {
  networkFirst: [
    '/api/',
    '/sync/',
    '/multiplayer/'
  ],
  cacheFirst: [
    '/assets/',
    '/images/',
    '/sounds/',
    '/fonts/'
  ],
  staleWhileRevalidate: [
    '/questions/',
    '/achievements/',
    '/leaderboards/'
  ]
};

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('🔧 Service Worker installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('🚀 Service Worker activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('stealth-learning-') && name !== CACHE_NAME && name !== DYNAMIC_CACHE)
            .map(name => {
              console.log('🗑️ Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with strategies
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine caching strategy
  const strategy = getCacheStrategy(url.pathname);

  switch (strategy) {
    case 'networkFirst':
      event.respondWith(networkFirst(request));
      break;
    case 'cacheFirst':
      event.respondWith(cacheFirst(request));
      break;
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request));
      break;
    default:
      event.respondWith(networkFirst(request));
  }
});

// Network First strategy - for API calls
async function networkFirst(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Try cache on network failure
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL) || new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    }

    // Return error for other requests
    return new Response('Network error', {
      status: 408,
      statusText: 'Request Timeout'
    });
  }
}

// Cache First strategy - for static assets
async function cacheFirst(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Update cache in background
    updateCache(request);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache the response
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    // Return placeholder for images
    if (request.destination === 'image') {
      return new Response(
        '<svg width="100" height="100"><rect width="100" height="100" fill="#ddd"/></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }

    return new Response('Resource not available', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then(async (networkResponse) => {
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Update cache in background
async function updateCache(request: Request): Promise<void> {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response);
  } catch (error) {
    // Silently fail - we already returned cached version
  }
}

// Determine cache strategy based on URL
function getCacheStrategy(pathname: string): string {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.includes(pattern))) {
      return strategy;
    }
  }
  return 'networkFirst';
}

// Background sync for offline actions
self.addEventListener('sync', (event: any) => {
  console.log('🔄 Background sync triggered:', event.tag);

  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  } else if (event.tag === 'sync-achievements') {
    event.waitUntil(syncAchievements());
  } else if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

// Sync game data
async function syncGameData(): Promise<void> {
  try {
    // Get pending data from IndexedDB
    const pendingData = await getPendingData('game-data');

    if (pendingData.length > 0) {
      const response = await fetch('/api/sync/game-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingData)
      });

      if (response.ok) {
        await clearPendingData('game-data');
        console.log('✅ Game data synced');
      }
    }
  } catch (error) {
    console.error('Failed to sync game data:', error);
  }
}

// Sync achievements
async function syncAchievements(): Promise<void> {
  try {
    const pendingAchievements = await getPendingData('achievements');

    if (pendingAchievements.length > 0) {
      const response = await fetch('/api/sync/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingAchievements)
      });

      if (response.ok) {
        await clearPendingData('achievements');
        console.log('✅ Achievements synced');
      }
    }
  } catch (error) {
    console.error('Failed to sync achievements:', error);
  }
}

// Sync progress
async function syncProgress(): Promise<void> {
  try {
    const pendingProgress = await getPendingData('progress');

    if (pendingProgress.length > 0) {
      const response = await fetch('/api/sync/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingProgress)
      });

      if (response.ok) {
        await clearPendingData('progress');
        console.log('✅ Progress synced');
      }
    }
  } catch (error) {
    console.error('Failed to sync progress:', error);
  }
}

// Get pending data from IndexedDB (simplified)
async function getPendingData(store: string): Promise<any[]> {
  // In production, this would interface with IndexedDB
  return [];
}

// Clear pending data
async function clearPendingData(store: string): Promise<void> {
  // In production, this would clear IndexedDB store
}

// Push notifications
self.addEventListener('push', (event: PushEvent) => {
  console.log('📬 Push notification received');

  const options: NotificationOptions = {
    body: event.data?.text() || 'New activity in Stealth Learning!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Play Now',
        icon: '/assets/icons/play.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Stealth Learning', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  console.log('🔔 Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message from client
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  console.log('📨 Message from client:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CACHE_URLS') {
    cacheUrls(event.data.urls);
  } else if (event.data.type === 'CLEAR_CACHE') {
    clearAllCaches();
  }
});

// Cache specific URLs
async function cacheUrls(urls: string[]): Promise<void> {
  const cache = await caches.open(DYNAMIC_CACHE);
  await cache.addAll(urls);
}

// Clear all caches
async function clearAllCaches(): Promise<void> {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('🗑️ All caches cleared');
}

// Periodic background sync
self.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Update content in background
async function updateContent(): Promise<void> {
  try {
    // Fetch latest questions
    const questionsResponse = await fetch('/api/questions/latest');
    if (questionsResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put('/api/questions/latest', questionsResponse);
    }

    // Fetch latest achievements
    const achievementsResponse = await fetch('/api/achievements/latest');
    if (achievementsResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put('/api/achievements/latest', achievementsResponse);
    }

    console.log('✅ Content updated in background');
  } catch (error) {
    console.error('Failed to update content:', error);
  }
}

// Export for TypeScript
export default null;