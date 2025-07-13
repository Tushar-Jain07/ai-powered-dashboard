// PWA Service Manager for AI-Dashmind
class PWAService {
  private registration: ServiceWorkerRegistration | null = null;
  private isOnline = navigator.onLine;

  constructor() {
    this.init();
  }

  async init() {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      try {
        await this.registerServiceWorker();
        this.setupEventListeners();
        console.log('PWA Service: Initialized successfully');
      } catch (error) {
        console.error('PWA Service: Initialization failed', error);
      }
    } else {
      console.warn('PWA Service: Service workers not supported');
    }
  }

  private async registerServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('PWA Service: Service worker registered', this.registration);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        }
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('PWA Service: New service worker activated');
        window.location.reload();
      });

    } catch (error) {
      console.error('PWA Service: Service worker registration failed', error);
      throw error;
    }
  }

  private setupEventListeners() {
    // Online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.onOffline();
    });

    // Push notification permission
    if ('Notification' in window) {
      this.requestNotificationPermission();
    }
  }

  private async requestNotificationPermission() {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.log('PWA Service: Notification permission:', permission);
    }
  }

  private onOnline() {
    console.log('PWA Service: App is online');
    this.syncData();
    this.showNotification('Connection restored', 'You are back online');
  }

  private onOffline() {
    console.log('PWA Service: App is offline');
    this.showNotification('Offline mode', 'Working with cached data');
  }

  private async syncData() {
    if (this.registration && 'sync' in this.registration) {
      try {
        await (this.registration.sync as any).register('background-sync');
        console.log('PWA Service: Background sync registered');
      } catch (error) {
        console.error('PWA Service: Background sync failed', error);
      }
    }
  }

  private showUpdateNotification() {
    if (Notification.permission === 'granted') {
      new Notification('AI-Dashmind Update', {
        body: 'A new version is available. Click to update.',
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'update-notification',
        requireInteraction: true
      });
    }
  }

  private showNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/logo192.png',
        badge: '/logo192.png'
      });
    }
  }

  // Public methods
  async sendPushNotification(title: string, body: string, data?: any) {
    if (this.registration && 'pushManager' in this.registration) {
      try {
        const subscription = await this.registration.pushManager.getSubscription();
        if (subscription) {
          // In a real app, you would send this to your server
          console.log('PWA Service: Push notification sent', { title, body, data });
        }
      } catch (error) {
        console.error('PWA Service: Push notification failed', error);
      }
    }
  }

  async checkForUpdates() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  async skipWaiting() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  getInstallPrompt(): any {
    return (window as any).deferredPrompt;
  }

  async installApp(): Promise<boolean> {
    const prompt = this.getInstallPrompt();
    if (prompt) {
      prompt.prompt();
      const result = await prompt.userChoice;
      (window as any).deferredPrompt = null;
      return result.outcome === 'accepted';
    }
    return false;
  }

  getCacheSize(): Promise<number> {
    return new Promise((resolve) => {
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          let totalSize = 0;
          const promises = cacheNames.map((cacheName) =>
            caches.open(cacheName).then((cache) =>
              cache.keys().then((requests) => {
                return Promise.all(
                  requests.map((request) =>
                    cache.match(request).then((response) => {
                      if (response) {
                        return response.blob().then((blob) => blob.size);
                      }
                      return 0;
                    })
                  )
                );
              })
            )
          );

          Promise.all(promises).then((sizes) => {
            totalSize = (sizes as number[][]).flat().reduce((sum, size) => sum + size, 0);
            resolve(totalSize);
          });
        });
      } else {
        resolve(0);
      }
    });
  }

  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      console.log('PWA Service: Cache cleared');
    }
  }

  getNetworkStatus(): { online: boolean; effectiveType: string } {
    const connection = (navigator as any).connection;
    return {
      online: this.isOnline,
      effectiveType: connection?.effectiveType || 'unknown',
    };
  }

  // Background sync for specific data
  async syncDashboardData() {
    if (this.registration && 'sync' in this.registration) {
      try {
        await (this.registration.sync as any).register('dashboard-sync');
        console.log('PWA Service: Dashboard sync registered');
      } catch (error) {
        console.error('PWA Service: Dashboard sync failed', error);
      }
    }
  }

  // Check if app can be installed
  canInstall(): boolean {
    return this.getInstallPrompt() !== null;
  }

  // Get app version
  getVersion(): string {
    return '1.0.0'; // In a real app, this would come from package.json
  }
}

// Create singleton instance
const pwaService = new PWAService();

export default pwaService; 