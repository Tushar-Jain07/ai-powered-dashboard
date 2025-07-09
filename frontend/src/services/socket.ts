import { io, Socket } from 'socket.io-client';

// Socket.io server URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://127.0.0.1:5000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, ((...args: any[]) => void)[]> = new Map();

  // Initialize socket connection
  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Set up listeners for events that were registered before connection
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback);
      });
    });
  }

  // Disconnect socket
  disconnect() {
    if (!this.socket) return;
    
    this.socket.disconnect();
    this.socket = null;
  }

  // Subscribe to dashboard updates
  subscribeToDashboard(dashboardId: string) {
    if (!this.socket) {
      this.connect();
    }
    
    this.socket?.emit('subscribe-to-dashboard', dashboardId);
  }

  // Unsubscribe from dashboard updates
  unsubscribeFromDashboard(dashboardId: string) {
    this.socket?.emit('unsubscribe-from-dashboard', dashboardId);
  }

  // Listen for dashboard updates
  onDashboardUpdated(callback: (dashboard: any) => void) {
    this.addListener('dashboard-updated', callback);
  }

  // Listen for widget updates
  onWidgetUpdated(callback: (data: { dashboardId: string, widgetId: string, widget: any }) => void) {
    this.addListener('widget-updated', callback);
  }

  // Listen for widget added
  onWidgetAdded(callback: (data: { dashboardId: string, widget: any }) => void) {
    this.addListener('widget-added', callback);
  }

  // Listen for widget deleted
  onWidgetDeleted(callback: (data: { dashboardId: string, widgetId: string }) => void) {
    this.addListener('widget-deleted', callback);
  }

  // Listen for data source updates
  onDataSourceUpdated(dataSourceId: string, callback: (data: any) => void) {
    this.addListener(`data-source-${dataSourceId}-updated`, callback);
  }

  // Listen for model training completion
  onModelTrained(modelId: string, callback: (model: any) => void) {
    this.addListener(`model-${modelId}-trained`, callback);
  }

  // Add a listener to the socket and store it
  private addListener(event: string, callback: (...args: any[]) => void) {
    // Store the callback
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
    
    // Add to socket if already connected
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove a listener
  removeListener(event: string, callback: (...args: any[]) => void) {
    // Remove from socket
    if (this.socket) {
      this.socket.off(event, callback);
    }
    
    // Remove from stored listeners
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.listeners.delete(event);
      }
    }
  }
}

// Create and export a singleton instance
const socketService = new SocketService();
export default socketService; 