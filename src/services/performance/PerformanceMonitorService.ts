/**
 * AAA+ Performance Monitoring Service
 * Real-time performance tracking and optimization system
 * Provides comprehensive metrics for maintaining 60 FPS gameplay
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  memoryLimit: number;
  renderTime: number;
  scriptTime: number;
  layoutTime: number;
  networkLatency: number;
  loadTime: number;
  interactionDelay: number;
  smoothness: number;
  jank: number;
  cpuUsage: number;
  gpuUsage?: number;
}

interface PerformanceThresholds {
  minFPS: number;
  maxFrameTime: number;
  maxMemoryUsage: number;
  maxNetworkLatency: number;
  maxInteractionDelay: number;
  maxJankScore: number;
}

interface ComponentMetrics {
  name: string;
  renderCount: number;
  avgRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  lastRenderTime: number;
  memoryFootprint: number;
  errorCount: number;
  warningCount: number;
}

interface UserActionMetrics {
  action: string;
  timestamp: number;
  duration: number;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

interface NetworkMetrics {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  size: number;
  cached: boolean;
  timestamp: number;
}

export class PerformanceMonitorService {
  private static instance: PerformanceMonitorService;
  private metrics: PerformanceMetrics;
  private componentMetrics: Map<string, ComponentMetrics>;
  private userActions: UserActionMetrics[];
  private networkRequests: NetworkMetrics[];
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private fpsHistory: number[] = [];
  private performanceObserver: PerformanceObserver | null = null;
  private rafHandle: number | null = null;
  private monitoring: boolean = false;
  private callbacks: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private optimizationMode: 'off' | 'auto' | 'aggressive' = 'auto';

  private thresholds: PerformanceThresholds = {
    minFPS: 30,
    maxFrameTime: 33.33, // 30 FPS threshold
    maxMemoryUsage: 500 * 1024 * 1024, // 500MB
    maxNetworkLatency: 500, // 500ms
    maxInteractionDelay: 100, // 100ms
    maxJankScore: 5
  };

  private ageGroupThresholds = {
    '3-5': { minFPS: 24, maxInteractionDelay: 150 },
    '6-8': { minFPS: 30, maxInteractionDelay: 100 },
    '9+': { minFPS: 45, maxInteractionDelay: 50 }
  };

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.componentMetrics = new Map();
    this.userActions = [];
    this.networkRequests = [];
    this.setupPerformanceObservers();
    this.interceptNetworkRequests();
  }

  public static getInstance(): PerformanceMonitorService {
    if (!PerformanceMonitorService.instance) {
      PerformanceMonitorService.instance = new PerformanceMonitorService();
    }
    return PerformanceMonitorService.instance;
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      memoryLimit: 0,
      renderTime: 0,
      scriptTime: 0,
      layoutTime: 0,
      networkLatency: 0,
      loadTime: 0,
      interactionDelay: 0,
      smoothness: 100,
      jank: 0,
      cpuUsage: 0
    };
  }

  /**
   * Start monitoring performance
   */
  public startMonitoring(ageGroup?: '3-5' | '6-8' | '9+'): void {
    if (this.monitoring) return;

    console.log('🎯 Starting AAA+ Performance Monitoring');
    this.monitoring = true;

    // Adjust thresholds for age group
    if (ageGroup && this.ageGroupThresholds[ageGroup]) {
      Object.assign(this.thresholds, this.ageGroupThresholds[ageGroup]);
    }

    // Start FPS monitoring
    this.startFPSMonitoring();

    // Monitor memory
    this.startMemoryMonitoring();

    // Monitor long tasks
    this.monitorLongTasks();

    // Monitor paint timing
    this.monitorPaintTiming();

    // Start optimization engine
    if (this.optimizationMode !== 'off') {
      this.startOptimizationEngine();
    }
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    console.log('🛑 Stopping Performance Monitoring');
    this.monitoring = false;

    if (this.rafHandle) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }

  /**
   * FPS Monitoring with advanced smoothing
   */
  private startFPSMonitoring(): void {
    let lastTime = performance.now();
    let frames = 0;
    let fpsUpdateInterval = 1000;
    let lastFPSUpdate = lastTime;

    const measureFPS = (currentTime: number) => {
      if (!this.monitoring) return;

      frames++;
      const deltaTime = currentTime - lastTime;

      // Calculate instantaneous frame time
      this.metrics.frameTime = deltaTime;

      // Update FPS every second
      if (currentTime - lastFPSUpdate >= fpsUpdateInterval) {
        this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastFPSUpdate));

        // Track FPS history for smoothness calculation
        this.fpsHistory.push(this.metrics.fps);
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift();
        }

        // Calculate smoothness and jank
        this.calculateSmoothness();
        this.detectJank();

        // Reset counters
        frames = 0;
        lastFPSUpdate = currentTime;

        // Notify listeners
        this.notifyListeners();

        // Trigger optimization if needed
        this.checkPerformanceThresholds();
      }

      lastTime = currentTime;
      this.rafHandle = requestAnimationFrame(measureFPS);
    };

    this.rafHandle = requestAnimationFrame(measureFPS);
  }

  /**
   * Memory monitoring
   */
  private startMemoryMonitoring(): void {
    if (!('memory' in performance)) return;

    setInterval(() => {
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        this.metrics.memoryLimit = memory.jsHeapSizeLimit;

        // Trigger GC optimization if memory usage is high
        if (this.metrics.memoryUsage > this.thresholds.maxMemoryUsage) {
          this.optimizeMemory();
        }
      }
    }, 5000);
  }

  /**
   * Monitor long tasks that block the main thread
   */
  private monitorLongTasks(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Task longer than 50ms
            console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
            this.metrics.jank++;
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.log('Long task monitoring not supported');
    }
  }

  /**
   * Monitor paint timing
   */
  private monitorPaintTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.loadTime = entry.startTime;
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.log('Paint timing monitoring not supported');
    }
  }

  /**
   * Setup performance observers for various metrics
   */
  private setupPerformanceObservers(): void {
    if (!('PerformanceObserver' in window)) return;

    // Observe layout shifts
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Track cumulative layout shift
          console.log('Layout shift detected:', (entry as any).value);
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.log('Layout shift monitoring not supported');
    }

    // Observe largest contentful paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.renderTime = (lastEntry as any).renderTime || lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.log('LCP monitoring not supported');
    }

    // Observe first input delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.interactionDelay = (entry as any).processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.log('FID monitoring not supported');
    }
  }

  /**
   * Intercept and monitor network requests
   */
  private interceptNetworkRequests(): void {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = performance.now();
      const [url, options] = args;

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();

        this.networkRequests.push({
          endpoint: url.toString(),
          method: options?.method || 'GET',
          duration: endTime - startTime,
          status: response.status,
          size: parseInt(response.headers.get('content-length') || '0'),
          cached: response.headers.get('x-cache') === 'HIT',
          timestamp: Date.now()
        });

        // Update average network latency
        this.updateNetworkLatency();

        return response;
      } catch (error) {
        const endTime = performance.now();

        this.networkRequests.push({
          endpoint: url.toString(),
          method: options?.method || 'GET',
          duration: endTime - startTime,
          status: 0,
          size: 0,
          cached: false,
          timestamp: Date.now()
        });

        throw error;
      }
    };
  }

  /**
   * Calculate smoothness score based on FPS variance
   */
  private calculateSmoothness(): void {
    if (this.fpsHistory.length < 5) return;

    const recent = this.fpsHistory.slice(-10);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const variance = recent.reduce((sum, fps) => sum + Math.pow(fps - avg, 2), 0) / recent.length;

    // Lower variance = smoother performance
    this.metrics.smoothness = Math.max(0, 100 - (variance / 100) * 50);
  }

  /**
   * Detect jank (sudden frame drops)
   */
  private detectJank(): void {
    if (this.fpsHistory.length < 2) return;

    const current = this.fpsHistory[this.fpsHistory.length - 1];
    const previous = this.fpsHistory[this.fpsHistory.length - 2];

    // Jank detected if FPS drops by more than 20
    if (previous - current > 20) {
      this.metrics.jank++;
      console.warn(`🎯 Jank detected: FPS dropped from ${previous} to ${current}`);
    }
  }

  /**
   * Update average network latency
   */
  private updateNetworkLatency(): void {
    const recentRequests = this.networkRequests.slice(-10);
    if (recentRequests.length === 0) return;

    const avgLatency = recentRequests.reduce((sum, req) => sum + req.duration, 0) / recentRequests.length;
    this.metrics.networkLatency = avgLatency;
  }

  /**
   * Check performance thresholds and trigger optimizations
   */
  private checkPerformanceThresholds(): void {
    if (this.optimizationMode === 'off') return;

    const violations = [];

    if (this.metrics.fps < this.thresholds.minFPS) {
      violations.push(`FPS below threshold: ${this.metrics.fps}`);
    }

    if (this.metrics.frameTime > this.thresholds.maxFrameTime) {
      violations.push(`Frame time high: ${this.metrics.frameTime.toFixed(2)}ms`);
    }

    if (this.metrics.memoryUsage > this.thresholds.maxMemoryUsage) {
      violations.push(`Memory usage high: ${(this.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }

    if (this.metrics.jank > this.thresholds.maxJankScore) {
      violations.push(`Jank score high: ${this.metrics.jank}`);
    }

    if (violations.length > 0) {
      console.warn('⚠️ Performance violations:', violations);
      this.triggerOptimizations();
    }
  }

  /**
   * Automatic optimization engine
   */
  private startOptimizationEngine(): void {
    setInterval(() => {
      if (!this.monitoring) return;

      // Auto-optimize based on current metrics
      if (this.optimizationMode === 'aggressive' ||
          (this.optimizationMode === 'auto' && this.metrics.fps < 45)) {
        this.applyOptimizations();
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Trigger performance optimizations
   */
  private triggerOptimizations(): void {
    console.log('🚀 Triggering performance optimizations');

    // Reduce quality settings
    this.dispatchOptimizationEvent('reduce-quality');

    // Throttle animations
    if (this.metrics.fps < 30) {
      this.dispatchOptimizationEvent('throttle-animations');
    }

    // Clear caches if memory is high
    if (this.metrics.memoryUsage > this.thresholds.maxMemoryUsage * 0.8) {
      this.optimizeMemory();
    }

    // Defer non-critical tasks
    this.dispatchOptimizationEvent('defer-tasks');
  }

  /**
   * Apply automatic optimizations
   */
  private applyOptimizations(): void {
    // Throttle requestAnimationFrame for non-critical animations
    this.throttleAnimations();

    // Reduce particle effects
    this.reduceVisualEffects();

    // Enable GPU acceleration hints
    this.enableGPUAcceleration();

    // Optimize image loading
    this.optimizeImageLoading();

    // Defer non-critical network requests
    this.deferNetworkRequests();
  }

  /**
   * Throttle animations to improve performance
   */
  private throttleAnimations(): void {
    const style = document.createElement('style');
    style.id = 'perf-optimization-animations';
    style.innerHTML = `
      * {
        animation-duration: 0.5s !important;
        transition-duration: 0.2s !important;
      }
    `;

    // Remove existing optimization style
    const existing = document.getElementById('perf-optimization-animations');
    if (existing) existing.remove();

    // Add if FPS is low
    if (this.metrics.fps < 30) {
      document.head.appendChild(style);
    }
  }

  /**
   * Reduce visual effects for better performance
   */
  private reduceVisualEffects(): void {
    this.dispatchOptimizationEvent('reduce-effects', {
      disableParticles: this.metrics.fps < 30,
      disableShadows: this.metrics.fps < 40,
      disableBlur: this.metrics.fps < 50,
      reduceQuality: this.metrics.fps < 45
    });
  }

  /**
   * Enable GPU acceleration for supported elements
   */
  private enableGPUAcceleration(): void {
    const style = document.createElement('style');
    style.id = 'perf-gpu-acceleration';
    style.innerHTML = `
      .gpu-accelerated {
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
      }
    `;

    const existing = document.getElementById('perf-gpu-acceleration');
    if (!existing) {
      document.head.appendChild(style);
    }
  }

  /**
   * Optimize image loading
   */
  private optimizeImageLoading(): void {
    // Set loading="lazy" on all images not in viewport
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  /**
   * Defer non-critical network requests
   */
  private deferNetworkRequests(): void {
    this.dispatchOptimizationEvent('defer-requests', {
      priority: 'critical-only',
      maxConcurrent: 2
    });
  }

  /**
   * Optimize memory usage
   */
  private optimizeMemory(): void {
    console.log('🧹 Optimizing memory usage');

    // Clear component metrics older than 5 minutes
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    this.userActions = this.userActions.filter(a => a.timestamp > fiveMinutesAgo);
    this.networkRequests = this.networkRequests.filter(r => r.timestamp > fiveMinutesAgo);

    // Clear FPS history
    this.fpsHistory = this.fpsHistory.slice(-30);

    // Dispatch memory optimization event
    this.dispatchOptimizationEvent('clear-cache');

    // Force garbage collection if available (Chrome DevTools)
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  /**
   * Dispatch optimization events
   */
  private dispatchOptimizationEvent(type: string, data?: any): void {
    window.dispatchEvent(new CustomEvent('performance-optimization', {
      detail: { type, data }
    }));
  }

  /**
   * Track component performance
   */
  public trackComponentRender(name: string, renderTime: number, memory?: number): void {
    let metrics = this.componentMetrics.get(name);

    if (!metrics) {
      metrics = {
        name,
        renderCount: 0,
        avgRenderTime: 0,
        maxRenderTime: 0,
        minRenderTime: Infinity,
        lastRenderTime: 0,
        memoryFootprint: 0,
        errorCount: 0,
        warningCount: 0
      };
      this.componentMetrics.set(name, metrics);
    }

    metrics.renderCount++;
    metrics.lastRenderTime = renderTime;
    metrics.maxRenderTime = Math.max(metrics.maxRenderTime, renderTime);
    metrics.minRenderTime = Math.min(metrics.minRenderTime, renderTime);
    metrics.avgRenderTime = (metrics.avgRenderTime * (metrics.renderCount - 1) + renderTime) / metrics.renderCount;

    if (memory) {
      metrics.memoryFootprint = memory;
    }

    // Warn if component is slow
    if (renderTime > 16.67) {
      console.warn(`⚠️ Slow component render: ${name} took ${renderTime.toFixed(2)}ms`);
    }
  }

  /**
   * Track user actions
   */
  public trackUserAction(action: string, duration: number, success: boolean, metadata?: Record<string, any>): void {
    this.userActions.push({
      action,
      timestamp: Date.now(),
      duration,
      success,
      metadata
    });

    // Keep only last 100 actions
    if (this.userActions.length > 100) {
      this.userActions.shift();
    }

    // Warn if action is slow
    if (duration > this.thresholds.maxInteractionDelay) {
      console.warn(`⚠️ Slow user action: ${action} took ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Get current metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get component metrics
   */
  public getComponentMetrics(): ComponentMetrics[] {
    return Array.from(this.componentMetrics.values());
  }

  /**
   * Get recent user actions
   */
  public getUserActions(limit: number = 20): UserActionMetrics[] {
    return this.userActions.slice(-limit);
  }

  /**
   * Get network metrics
   */
  public getNetworkMetrics(limit: number = 20): NetworkMetrics[] {
    return this.networkRequests.slice(-limit);
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): {
    overall: 'excellent' | 'good' | 'needs-improvement' | 'poor';
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // FPS check
    if (this.metrics.fps < 60) {
      score -= (60 - this.metrics.fps) * 0.5;
      if (this.metrics.fps < 30) {
        issues.push('Critical: FPS below 30');
        recommendations.push('Reduce visual effects and animations');
      } else if (this.metrics.fps < 45) {
        issues.push('Warning: FPS below 45');
        recommendations.push('Consider reducing quality settings');
      }
    }

    // Memory check
    const memoryPercent = (this.metrics.memoryUsage / this.metrics.memoryLimit) * 100;
    if (memoryPercent > 80) {
      score -= 20;
      issues.push('Critical: High memory usage');
      recommendations.push('Clear caches and reduce asset quality');
    } else if (memoryPercent > 60) {
      score -= 10;
      issues.push('Warning: Moderate memory usage');
      recommendations.push('Monitor memory consumption');
    }

    // Network latency check
    if (this.metrics.networkLatency > 1000) {
      score -= 15;
      issues.push('Critical: High network latency');
      recommendations.push('Implement better caching strategies');
    } else if (this.metrics.networkLatency > 500) {
      score -= 5;
      issues.push('Warning: Moderate network latency');
      recommendations.push('Consider data prefetching');
    }

    // Jank check
    if (this.metrics.jank > 10) {
      score -= 20;
      issues.push('Critical: Frequent jank detected');
      recommendations.push('Optimize render-blocking operations');
    } else if (this.metrics.jank > 5) {
      score -= 10;
      issues.push('Warning: Occasional jank detected');
      recommendations.push('Review animation performance');
    }

    // Determine overall rating
    let overall: 'excellent' | 'good' | 'needs-improvement' | 'poor';
    if (score >= 90) overall = 'excellent';
    else if (score >= 70) overall = 'good';
    else if (score >= 50) overall = 'needs-improvement';
    else overall = 'poor';

    return {
      overall,
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }

  /**
   * Register metrics callback
   */
  public onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Notify listeners of metrics update
   */
  private notifyListeners(): void {
    this.callbacks.forEach(callback => callback(this.getMetrics()));
  }

  /**
   * Set optimization mode
   */
  public setOptimizationMode(mode: 'off' | 'auto' | 'aggressive'): void {
    this.optimizationMode = mode;
    console.log(`🎯 Optimization mode set to: ${mode}`);
  }

  /**
   * Export performance report
   */
  public exportReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      componentMetrics: Array.from(this.componentMetrics.values()),
      recentActions: this.userActions.slice(-50),
      recentRequests: this.networkRequests.slice(-50),
      summary: this.getPerformanceSummary()
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Reset all metrics
   */
  public resetMetrics(): void {
    this.metrics = this.initializeMetrics();
    this.componentMetrics.clear();
    this.userActions = [];
    this.networkRequests = [];
    this.fpsHistory = [];
    this.frameCount = 0;
    this.metrics.jank = 0;
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitorService.getInstance();