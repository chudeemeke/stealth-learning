import * as React from 'react';
import { errorTracker, ErrorCategory, ErrorSeverity } from './ErrorTracker';

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals
  LCP: 2500,  // Largest Contentful Paint
  INP: 200,   // Interaction to Next Paint
  CLS: 0.1,   // Cumulative Layout Shift
  TTFB: 600,  // Time to First Byte
  FCP: 1800,  // First Contentful Paint

  // Custom thresholds
  COMPONENT_RENDER: 16,    // 60fps = 16ms per frame
  API_RESPONSE: 1000,      // API calls should be under 1s
  GAME_FRAME: 16,          // Game frames should be 60fps
  PAGE_LOAD: 3000,         // Page loads under 3s
  MEMORY_USAGE: 100,       // Memory usage in MB
} as const;

// Performance metric types
export interface WebVital {
  name: 'LCP' | 'INP' | 'CLS' | 'TTFB' | 'FCP';
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

export interface CustomMetric {
  name: string;
  value: number;
  category: 'render' | 'network' | 'memory' | 'game' | 'user';
  startTime?: number;
  endTime?: number;
  metadata?: Record<string, any>;
}

/**
 * Performance Monitoring Service
 * Tracks Core Web Vitals and custom performance metrics
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private isInitialized = false;
  private metrics: CustomMetric[] = [];
  private webVitals: WebVital[] = [];
  private observers: PerformanceObserver[] = [];

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initialize performance monitoring
   */
  initialize() {
    if (this.isInitialized) {
      console.warn('PerformanceMonitor already initialized');
      return;
    }

    this.setupWebVitalsMonitoring();
    this.setupResourceTimingMonitoring();
    this.setupMemoryMonitoring();
    this.setupNetworkMonitoring();

    this.isInitialized = true;
    console.log('Performance monitoring initialized');
  }

  /**
   * Track a custom performance metric
   */
  trackMetric(metric: CustomMetric) {
    const timestamp = Date.now();
    const trackedMetric = {
      ...metric,
      endTime: metric.endTime || timestamp,
    };

    this.metrics.push(trackedMetric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Check if metric exceeds threshold
    this.checkThreshold(trackedMetric);

    // Track with error tracker
    errorTracker.trackPerformance({
      name: metric.name,
      value: metric.value,
      timestamp: new Date(),
      category: metric.category,
      metadata: metric.metadata,
    });

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERFORMANCE] ${metric.name}: ${metric.value}ms`, metric);
    }
  }

  /**
   * Start timing a performance metric
   */
  startTiming(name: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.trackMetric({
        name,
        value: duration,
        category: 'render',
        startTime,
        endTime,
      });
    };
  }

  /**
   * Track component render performance
   */
  trackComponentRender(componentName: string, renderTime: number) {
    this.trackMetric({
      name: 'component_render',
      value: renderTime,
      category: 'render',
      metadata: { component: componentName },
    });
  }

  /**
   * Track API call performance
   */
  trackApiCall(endpoint: string, duration: number, status: number) {
    this.trackMetric({
      name: 'api_call',
      value: duration,
      category: 'network',
      metadata: {
        endpoint,
        status,
        success: status >= 200 && status < 300,
      },
    });
  }

  /**
   * Track game frame performance
   */
  trackGameFrame(frameTime: number, gameId: string) {
    this.trackMetric({
      name: 'game_frame',
      value: frameTime,
      category: 'game',
      metadata: { gameId },
    });
  }

  /**
   * Track user interaction performance
   */
  trackUserInteraction(action: string, duration: number) {
    this.trackMetric({
      name: 'user_interaction',
      value: duration,
      category: 'user',
      metadata: { action },
    });
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    webVitals: WebVital[];
    customMetrics: CustomMetric[];
    averages: Record<string, number>;
    issues: Array<{ metric: string; value: number; threshold: number }>;
  } {
    const averages: Record<string, number> = {};
    const issues: Array<{ metric: string; value: number; threshold: number }> = [];

    // Calculate averages for custom metrics
    const metricsByName = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(metricsByName).forEach(([name, values]) => {
      averages[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    // Check for performance issues
    this.webVitals.forEach(vital => {
      const threshold = PERFORMANCE_THRESHOLDS[vital.name];
      if (threshold && vital.value > threshold) {
        issues.push({
          metric: vital.name,
          value: vital.value,
          threshold,
        });
      }
    });

    return {
      webVitals: this.webVitals.slice(-10), // Last 10 measurements
      customMetrics: this.metrics.slice(-20), // Last 20 measurements
      averages,
      issues,
    };
  }

  /**
   * Clear performance data
   */
  clear() {
    this.metrics = [];
    this.webVitals = [];
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }

  /**
   * Private helper methods
   */

  private setupWebVitalsMonitoring() {
    // Import web-vitals dynamically to avoid blocking
    import('web-vitals').then(({ onLCP, onINP, onCLS, onTTFB, onFCP }) => {
      onLCP(this.handleWebVital.bind(this));
      onINP(this.handleWebVital.bind(this));
      onCLS(this.handleWebVital.bind(this));
      onTTFB(this.handleWebVital.bind(this));
      onFCP(this.handleWebVital.bind(this));
    }).catch(() => {
      // Fallback if web-vitals is not available
      console.warn('web-vitals library not available, using fallback monitoring');
      this.setupFallbackWebVitals();
    });
  }

  private handleWebVital(vital: WebVital) {
    this.webVitals.push(vital);

    // Keep only last 20 measurements
    if (this.webVitals.length > 20) {
      this.webVitals = this.webVitals.slice(-20);
    }

    // Check threshold and report issues
    const threshold = PERFORMANCE_THRESHOLDS[vital.name];
    if (threshold && vital.value > threshold) {
      errorTracker.trackError(
        `Poor ${vital.name}: ${vital.value} (threshold: ${threshold})`,
        ErrorCategory.PERFORMANCE,
        ErrorSeverity.MEDIUM,
        { vital }
      );
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[WEB VITAL] ${vital.name}: ${vital.value}`, vital);
    }
  }

  private setupFallbackWebVitals() {
    // Basic performance timing fallback
    if ('performance' in window && 'getEntriesByType' in performance) {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          // Simulate LCP (approximate)
          const lcp = navigation.loadEventEnd - navigation.fetchStart;
          this.handleWebVital({
            name: 'LCP',
            value: lcp,
            delta: lcp,
            id: 'fallback-lcp',
            navigationType: 'navigate',
          });
        }
      }, 1000);
    }
  }

  private setupResourceTimingMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;

              // Track slow resources
              if (resourceEntry.duration > 1000) {
                this.trackMetric({
                  name: 'slow_resource',
                  value: resourceEntry.duration,
                  category: 'network',
                  metadata: {
                    name: resourceEntry.name,
                    type: resourceEntry.initiatorType,
                    size: resourceEntry.transferSize,
                  },
                });
              }
            }
          });
        });

        observer.observe({ entryTypes: ['resource'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('Resource timing monitoring not supported');
      }
    }
  }

  private setupMemoryMonitoring() {
    // Monitor memory usage
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;

        this.trackMetric({
          name: 'memory_usage',
          value: usedMB,
          category: 'memory',
          metadata: {
            total: memory.totalJSHeapSize / 1024 / 1024,
            limit: memory.jsHeapSizeLimit / 1024 / 1024,
          },
        });

        // Check memory threshold
        if (usedMB > PERFORMANCE_THRESHOLDS.MEMORY_USAGE) {
          errorTracker.trackError(
            `High memory usage: ${usedMB.toFixed(2)}MB`,
            ErrorCategory.PERFORMANCE,
            ErrorSeverity.HIGH,
            { memory }
          );
        }
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);

    // Initial check
    setTimeout(checkMemory, 5000);
  }

  private setupNetworkMonitoring() {
    // Monitor network connection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;

      const trackConnection = () => {
        this.trackMetric({
          name: 'network_info',
          value: connection.downlink || 0,
          category: 'network',
          metadata: {
            effectiveType: connection.effectiveType,
            rtt: connection.rtt,
            saveData: connection.saveData,
          },
        });
      };

      // Track initial connection
      trackConnection();

      // Track connection changes
      connection.addEventListener('change', trackConnection);
    }

    // Monitor online/offline status
    const handleOnline = () => {
      this.trackMetric({
        name: 'network_status',
        value: 1,
        category: 'network',
        metadata: { status: 'online' },
      });
    };

    const handleOffline = () => {
      this.trackMetric({
        name: 'network_status',
        value: 0,
        category: 'network',
        metadata: { status: 'offline' },
      });

      errorTracker.trackError(
        'Network went offline',
        ErrorCategory.NETWORK,
        ErrorSeverity.MEDIUM
      );
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  private checkThreshold(metric: CustomMetric) {
    let threshold: number | undefined;

    switch (metric.name) {
      case 'component_render':
        threshold = PERFORMANCE_THRESHOLDS.COMPONENT_RENDER;
        break;
      case 'api_call':
        threshold = PERFORMANCE_THRESHOLDS.API_RESPONSE;
        break;
      case 'game_frame':
        threshold = PERFORMANCE_THRESHOLDS.GAME_FRAME;
        break;
      case 'page_load':
        threshold = PERFORMANCE_THRESHOLDS.PAGE_LOAD;
        break;
    }

    if (threshold && metric.value > threshold) {
      errorTracker.trackError(
        `Performance threshold exceeded: ${metric.name} = ${metric.value}ms (threshold: ${threshold}ms)`,
        ErrorCategory.PERFORMANCE,
        ErrorSeverity.MEDIUM,
        { metric, threshold }
      );
    }
  }
}

// Create and export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for component performance tracking
export const usePerformanceTracking = (componentName: string) => {
  const [renderStartTime, setRenderStartTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (renderStartTime) {
      const renderTime = performance.now() - renderStartTime;
      performanceMonitor.trackComponentRender(componentName, renderTime);
      setRenderStartTime(null);
    }
  });

  const startRenderTracking = React.useCallback(() => {
    setRenderStartTime(performance.now());
  }, []);

  const trackInteraction = React.useCallback((action: string) => {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      performanceMonitor.trackUserInteraction(`${componentName}_${action}`, duration);
    };
  }, [componentName]);

  return {
    startRenderTracking,
    trackInteraction,
  };
};

// HOC for automatic performance tracking
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const name = componentName || Component.displayName || Component.name || 'Unknown';

  return React.memo((props: P) => {
    const renderStart = performance.now();

    React.useEffect(() => {
      const renderTime = performance.now() - renderStart;
      performanceMonitor.trackComponentRender(name, renderTime);
    }, []);

    return <Component {...props} />;
  });
};