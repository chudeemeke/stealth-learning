import * as React from 'react';
import * as Sentry from '@sentry/react';

// Error types for categorization
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  NETWORK = 'network',
  GAME_ENGINE = 'game_engine',
  ANALYTICS = 'analytics',
  UI_COMPONENT = 'ui_component',
  PERFORMANCE = 'performance',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Performance metric types
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  category: string;
  metadata?: Record<string, any>;
}

// Error context interface
export interface ErrorContext {
  userId?: string;
  ageGroup?: string;
  gameId?: string;
  sessionId?: string;
  route?: string;
  browser?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  isOffline?: boolean;
  timeSpent?: number;
  [key: string]: any;
}

/**
 * Centralized Error Tracking and Performance Monitoring Service
 */
export class ErrorTracker {
  private static instance: ErrorTracker;
  private isInitialized = false;
  private context: ErrorContext = {};
  private performanceMetrics: PerformanceMetric[] = [];

  private constructor() {}

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Initialize error tracking and performance monitoring
   */
  initialize(config: {
    dsn?: string;
    environment?: string;
    release?: string;
    enablePerformanceMonitoring?: boolean;
    enableUserFeedback?: boolean;
  }) {
    if (this.isInitialized) {
      console.warn('ErrorTracker already initialized');
      return;
    }

    const {
      dsn = process.env.VITE_SENTRY_DSN,
      environment = process.env.NODE_ENV || 'development',
      release = process.env.VITE_APP_VERSION || '1.0.0',
      enablePerformanceMonitoring = true,
      enableUserFeedback = false,
    } = config;

    // Only initialize in production or when DSN is provided
    if (!dsn && environment === 'production') {
      console.warn('Sentry DSN not provided for production environment');
      return;
    }

    try {
      Sentry.init({
        dsn,
        environment,
        release,
        integrations: [
          Sentry.browserTracingIntegration({
            // Performance monitoring configuration for v8+
            enableLongTask: true,
            enableInp: true,
          }),
          Sentry.replayIntegration({
            // Session replay settings
            maskAllText: true, // Privacy for children's app
            blockAllMedia: true,
          }),
        ],
        // Performance monitoring
        tracesSampleRate: enablePerformanceMonitoring ? 0.1 : 0,
        // Session replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        // Privacy settings for children's app
        beforeSend: (event, hint) => this.filterSensitiveData(event, hint),
        // Transaction data filtering is handled by beforeSend in v8+
      });

      this.isInitialized = true;
      console.log('Error tracking initialized successfully');

      // Set up global error handlers
      this.setupGlobalErrorHandlers();

      // Set up performance monitoring
      if (enablePerformanceMonitoring) {
        this.setupPerformanceMonitoring();
      }

    } catch (error) {
      console.error('Failed to initialize error tracking:', error);
    }
  }

  /**
   * Set user context for error tracking
   */
  setUserContext(context: ErrorContext) {
    this.context = { ...this.context, ...context };

    if (this.isInitialized) {
      Sentry.setUser({
        id: context.userId,
        // Don't include PII for children
        username: context.userId ? `user_${context.userId.slice(-4)}` : undefined,
      });

      Sentry.setContext('app_context', {
        ageGroup: context.ageGroup,
        deviceType: context.deviceType,
        isOffline: context.isOffline,
      });

      if (context.gameId) {
        Sentry.setTag('game_id', context.gameId);
      }

      if (context.route) {
        Sentry.setTag('route', context.route);
      }
    }
  }

  /**
   * Track an error with categorization and context
   */
  trackError(
    error: Error | string,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    additionalContext?: Record<string, any>
  ) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    // Add category and severity to error
    Sentry.withScope((scope) => {
      scope.setTag('error_category', category);
      scope.setLevel(this.mapSeverityToSentryLevel(severity));

      // Add additional context
      if (additionalContext) {
        scope.setContext('additional_context', additionalContext);
      }

      // Add current app context
      scope.setContext('app_state', this.context);

      // Add performance metrics if available
      if (this.performanceMetrics.length > 0) {
        scope.setContext('performance_metrics', {
          recent_metrics: this.performanceMetrics.slice(-5),
        });
      }

      Sentry.captureException(errorObj);
    });

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${category}] [${severity}]`, errorObj, additionalContext);
    }
  }

  /**
   * Track a performance metric
   */
  trackPerformance(metric: PerformanceMetric) {
    this.performanceMetrics.push(metric);

    // Keep only last 50 metrics
    if (this.performanceMetrics.length > 50) {
      this.performanceMetrics = this.performanceMetrics.slice(-50);
    }

    // Send to Sentry as a transaction
    if (this.isInitialized) {
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `${metric.name}: ${metric.value}`,
        level: 'info',
        data: metric.metadata,
      });

      // Track critical performance issues
      if (metric.category === 'critical' || metric.value > 5000) {
        this.trackError(
          `Performance issue: ${metric.name} took ${metric.value}ms`,
          ErrorCategory.PERFORMANCE,
          ErrorSeverity.HIGH,
          { metric }
        );
      }
    }

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERFORMANCE] ${metric.name}:`, metric);
    }
  }

  /**
   * Track game-specific events
   */
  trackGameEvent(
    event: string,
    gameId: string,
    data?: Record<string, any>
  ) {
    if (this.isInitialized) {
      Sentry.addBreadcrumb({
        category: 'game',
        message: event,
        level: 'info',
        data: {
          gameId,
          ...data,
        },
      });
    }

    // Track game errors specifically
    if (event.includes('error') || event.includes('failed')) {
      this.trackError(
        `Game event: ${event}`,
        ErrorCategory.GAME_ENGINE,
        ErrorSeverity.MEDIUM,
        { gameId, ...data }
      );
    }
  }

  /**
   * Track user interactions for debugging
   */
  trackUserInteraction(
    action: string,
    element: string,
    data?: Record<string, any>
  ) {
    if (this.isInitialized) {
      Sentry.addBreadcrumb({
        category: 'user',
        message: `${action} on ${element}`,
        level: 'info',
        data,
      });
    }
  }

  /**
   * Get error statistics for analytics
   */
  getErrorStatistics(): {
    totalErrors: number;
    errorsByCategory: Record<ErrorCategory, number>;
    recentErrors: any[];
  } {
    // This would typically come from a backend API
    // For now, return placeholder data
    return {
      totalErrors: 0,
      errorsByCategory: {} as Record<ErrorCategory, number>,
      recentErrors: [],
    };
  }

  /**
   * Clear user context (for logout)
   */
  clearUserContext() {
    this.context = {};
    this.performanceMetrics = [];

    if (this.isInitialized) {
      Sentry.getCurrentScope().clear();
    }
  }

  /**
   * Private helper methods
   */

  private mapSeverityToSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'info';
      case ErrorSeverity.MEDIUM:
        return 'warning';
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.CRITICAL:
        return 'fatal';
      default:
        return 'error';
    }
  }

  private filterSensitiveData = (event: Sentry.ErrorEvent, hint?: Sentry.EventHint): Sentry.ErrorEvent | null => {
    // Remove sensitive data for children's privacy
    if (event.user) {
      delete event.user.email;
      delete event.user.username;
      // Keep only anonymized ID
      if (event.user.id) {
        const idStr = String(event.user.id);
        event.user.id = `user_${idStr.slice(-4)}`;
      }
    }

    // Remove sensitive request data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }

    // Filter out sensitive context data
    if (event.contexts) {
      Object.keys(event.contexts).forEach(key => {
        const context = event.contexts![key];
        if (context && typeof context === 'object') {
          delete context.pin;
          delete context.password;
          delete context.token;
          delete context.sessionId;
        }
      });
    }

    return event;
  };


  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        event.reason,
        ErrorCategory.UNKNOWN,
        ErrorSeverity.HIGH,
        { type: 'unhandled_promise_rejection' }
      );
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.trackError(
        event.error || event.message,
        ErrorCategory.UNKNOWN,
        ErrorSeverity.HIGH,
        {
          type: 'global_error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      );
    });

    // Handle React error boundaries
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if this is a React error
      if (args[0] && typeof args[0] === 'string' && args[0].includes('React')) {
        this.trackError(
          args.join(' '),
          ErrorCategory.UI_COMPONENT,
          ErrorSeverity.HIGH,
          { type: 'react_error' }
        );
      }
      originalConsoleError.apply(console, args);
    };
  }

  private setupPerformanceMonitoring() {
    // Monitor key performance metrics
    this.trackNavigationTiming();
    this.trackResourceTiming();
    this.setupLongTaskMonitoring();
  }

  private trackNavigationTiming() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        this.trackPerformance({
          name: 'page_load_time',
          value: navigation.loadEventEnd - navigation.fetchStart,
          timestamp: new Date(),
          category: 'navigation',
          metadata: {
            dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp_connect: navigation.connectEnd - navigation.connectStart,
            server_response: navigation.responseEnd - navigation.requestStart,
            dom_processing: navigation.domComplete - navigation.responseEnd,
          },
        });
      }
    }
  }

  private trackResourceTiming() {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource');

      resources.forEach((resource) => {
        if (resource.duration > 1000) { // Track slow resources (>1s)
          this.trackPerformance({
            name: 'slow_resource',
            value: resource.duration,
            timestamp: new Date(),
            category: 'resource',
            metadata: {
              name: resource.name,
              type: (resource as any).initiatorType,
              size: (resource as any).transferSize,
            },
          });
        }
      });
    }
  }

  private setupLongTaskMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.trackPerformance({
              name: 'long_task',
              value: entry.duration,
              timestamp: new Date(),
              category: 'performance',
              metadata: {
                start_time: entry.startTime,
                entry_type: entry.entryType,
              },
            });
          });
        });

        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // PerformanceObserver not supported
        console.warn('PerformanceObserver not supported');
      }
    }
  }
}

// Create and export singleton instance
export const errorTracker = ErrorTracker.getInstance();

// Error boundary HOC for React components
export const withErrorTracking = <P extends object>(
  Component: React.ComponentType<P>,
  errorCategory: ErrorCategory = ErrorCategory.UI_COMPONENT
) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: ({ error, resetError }) => (
      React.createElement('div', { className: 'error-boundary' },
        React.createElement('h2', null, 'Something went wrong'),
        React.createElement('p', null, 'We\'re sorry, but something unexpected happened.'),
        React.createElement('button', { onClick: resetError }, 'Try again')
      )
    ),
    beforeCapture: (scope) => {
      scope.setTag('error_category', errorCategory);
    },
  });
};

// Performance monitoring hook
export const usePerformanceTracking = (componentName: string) => {
  const trackRender = React.useCallback((renderTime: number) => {
    errorTracker.trackPerformance({
      name: 'component_render_time',
      value: renderTime,
      timestamp: new Date(),
      category: 'component',
      metadata: { component: componentName },
    });
  }, [componentName]);

  const trackInteraction = React.useCallback((action: string, data?: any) => {
    errorTracker.trackUserInteraction(action, componentName, data);
  }, [componentName]);

  return { trackRender, trackInteraction };
};