// Performance monitoring utilities

export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  renderTime: number;
  memoryUsage?: number;
  timestamp: string;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Observe navigation timing
    try {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordPageLoadTime(entry as PerformanceNavigationTiming);
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error);
    }

    // Observe resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('/api/')) {
            this.recordApiResponseTime(entry as PerformanceResourceTiming);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.warn('Resource PerformanceObserver not supported:', error);
    }
  }

  private recordPageLoadTime(entry: PerformanceNavigationTiming) {
    const pageLoadTime = entry.loadEventEnd - entry.fetchStart;
    this.addMetric({
      pageLoadTime,
      apiResponseTime: 0,
      renderTime: 0,
      timestamp: new Date().toISOString()
    });
  }

  private recordApiResponseTime(entry: PerformanceResourceTiming) {
    const apiResponseTime = entry.responseEnd - entry.requestStart;
    this.addMetric({
      pageLoadTime: 0,
      apiResponseTime,
      renderTime: 0,
      timestamp: new Date().toISOString()
    });
  }

  public recordRenderTime(componentName: string, renderTime: number) {
    this.addMetric({
      pageLoadTime: 0,
      apiResponseTime: 0,
      renderTime,
      timestamp: new Date().toISOString()
    });
  }

  private addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) {
      return {};
    }

    const totals = this.metrics.reduce(
      (acc, metric) => ({
        pageLoadTime: acc.pageLoadTime + metric.pageLoadTime,
        apiResponseTime: acc.apiResponseTime + metric.apiResponseTime,
        renderTime: acc.renderTime + metric.renderTime
      }),
      { pageLoadTime: 0, apiResponseTime: 0, renderTime: 0 }
    );

    const count = this.metrics.length;
    return {
      pageLoadTime: totals.pageLoadTime / count,
      apiResponseTime: totals.apiResponseTime / count,
      renderTime: totals.renderTime / count
    };
  }

  public getMemoryUsage(): number | undefined {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return undefined;
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  const measureRender = (componentName: string, renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    monitor.recordRenderTime(componentName, end - start);
  };

  const measureAsync = async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const end = performance.now();
      console.log(`${operationName} took ${end - start}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${operationName} failed after ${end - start}ms:`, error);
      throw error;
    }
  };

  return {
    measureRender,
    measureAsync,
    getMetrics: () => monitor.getMetrics(),
    getAverageMetrics: () => monitor.getAverageMetrics(),
    getMemoryUsage: () => monitor.getMemoryUsage()
  };
};

// Lazy loading helper
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  return React.lazy(importFn);
};

// Image lazy loading
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setIsError(true);
    };
    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded, isError };
};

// Debounce hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook
export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastExecuted = React.useRef<number>(Date.now());

  React.useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
};

// Virtual scrolling helper
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

export default PerformanceMonitor;
