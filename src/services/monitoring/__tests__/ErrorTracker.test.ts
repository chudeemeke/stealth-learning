import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as Sentry from '@sentry/react';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '../ErrorTracker';

// Mock Sentry
vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  setUser: vi.fn(),
  setContext: vi.fn(),
  setTag: vi.fn(),
  withScope: vi.fn((callback) => callback({
    setTag: vi.fn(),
    setLevel: vi.fn(),
    setContext: vi.fn(),
  })),
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
  getCurrentScope: vi.fn(() => ({
    clear: vi.fn(),
  })),
  browserTracingIntegration: vi.fn(),
  replayIntegration: vi.fn(),
  withErrorBoundary: vi.fn(),
}));

describe('ErrorTracker', () => {
  let errorTracker: ErrorTracker;

  beforeEach(() => {
    vi.clearAllMocks();
    errorTracker = ErrorTracker.getInstance();
    // Reset initialization state
    (errorTracker as any).isInitialized = false;
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorTracker.getInstance();
      const instance2 = ErrorTracker.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Initialization', () => {
    it('should initialize Sentry with correct configuration', () => {
      const config = {
        dsn: 'test-dsn',
        environment: 'test',
        release: '1.0.0',
        enablePerformanceMonitoring: true,
      };

      errorTracker.initialize(config);

      expect(Sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          dsn: 'test-dsn',
          environment: 'test',
          release: '1.0.0',
          integrations: expect.arrayContaining([
            expect.any(Object), // browserTracingIntegration
            expect.any(Object), // replayIntegration
          ]),
          tracesSampleRate: 0.1,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
        })
      );
    });

    it('should not initialize twice', () => {
      const config = { dsn: 'test-dsn' };

      errorTracker.initialize(config);
      errorTracker.initialize(config);

      expect(Sentry.init).toHaveBeenCalledTimes(1);
    });

    it('should warn when DSN not provided for production', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      errorTracker.initialize({ environment: 'production' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Sentry DSN not provided for production environment'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('User Context', () => {
    beforeEach(() => {
      errorTracker.initialize({ dsn: 'test-dsn' });
    });

    it('should set user context correctly', () => {
      const context = {
        userId: 'user123',
        ageGroup: '6-8',
        deviceType: 'tablet' as const,
        isOffline: false,
      };

      errorTracker.setUserContext(context);

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: 'user123',
        username: 'user_u123',
      });

      expect(Sentry.setContext).toHaveBeenCalledWith('app_context', {
        ageGroup: '6-8',
        deviceType: 'tablet',
        isOffline: false,
      });
    });

    it('should set tags for gameId and route', () => {
      const context = {
        gameId: 'math-addition',
        route: '/games/math-addition',
      };

      errorTracker.setUserContext(context);

      expect(Sentry.setTag).toHaveBeenCalledWith('game_id', 'math-addition');
      expect(Sentry.setTag).toHaveBeenCalledWith('route', '/games/math-addition');
    });
  });

  describe('Error Tracking', () => {
    beforeEach(() => {
      errorTracker.initialize({ dsn: 'test-dsn' });
    });

    it('should track error with proper categorization', () => {
      const error = new Error('Test error');
      const additionalContext = { component: 'GameComponent' };

      errorTracker.trackError(
        error,
        ErrorCategory.GAME_ENGINE,
        ErrorSeverity.HIGH,
        additionalContext
      );

      expect(Sentry.withScope).toHaveBeenCalled();
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it('should track string errors by converting to Error objects', () => {
      const errorMessage = 'Test string error';

      errorTracker.trackError(errorMessage);

      expect(Sentry.captureException).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test string error',
        })
      );
    });

    it('should log errors in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const error = new Error('Dev error');
      errorTracker.trackError(error, ErrorCategory.UI_COMPONENT);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ui_component] [medium]',
        error,
        undefined
      );

      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Performance Tracking', () => {
    beforeEach(() => {
      errorTracker.initialize({ dsn: 'test-dsn' });
    });

    it('should track performance metrics', () => {
      const metric = {
        name: 'component_render',
        value: 100,
        timestamp: new Date(),
        category: 'performance',
        metadata: { component: 'TestComponent' },
      };

      errorTracker.trackPerformance(metric);

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'performance',
        message: 'component_render: 100',
        level: 'info',
        data: { component: 'TestComponent' },
      });
    });

    it('should track critical performance issues as errors', () => {
      const metric = {
        name: 'slow_operation',
        value: 6000, // > 5000ms threshold
        timestamp: new Date(),
        category: 'performance',
      };

      errorTracker.trackPerformance(metric);

      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });

  describe('Privacy Filters', () => {
    it('should filter sensitive data from events', () => {
      const mockEvent = {
        user: {
          id: 'user123456',
          email: 'child@example.com',
          username: 'childuser',
        },
        request: {
          cookies: 'sensitive=data',
          headers: { authorization: 'Bearer token' },
        },
        contexts: {
          app: {
            pin: '1234',
            password: 'secret',
            token: 'jwt-token',
            sessionId: 'session123',
          },
        },
      };

      const filtered = (errorTracker as any).filterSensitiveData(mockEvent);

      expect(filtered.user.id).toBe('user_3456');
      expect(filtered.user.email).toBeUndefined();
      expect(filtered.user.username).toBeUndefined();
      expect(filtered.request.cookies).toBeUndefined();
      expect(filtered.request.headers).toBeUndefined();
      expect(filtered.contexts.app.pin).toBeUndefined();
      expect(filtered.contexts.app.password).toBeUndefined();
      expect(filtered.contexts.app.token).toBeUndefined();
      expect(filtered.contexts.app.sessionId).toBeUndefined();
    });
  });

  describe('Game Event Tracking', () => {
    beforeEach(() => {
      errorTracker.initialize({ dsn: 'test-dsn' });
    });

    it('should track game events as breadcrumbs', () => {
      errorTracker.trackGameEvent('level_completed', 'math-addition', {
        level: 1,
        score: 100,
      });

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'game',
        message: 'level_completed',
        level: 'info',
        data: {
          gameId: 'math-addition',
          level: 1,
          score: 100,
        },
      });
    });

    it('should track game errors as exceptions', () => {
      errorTracker.trackGameEvent('game_error_occurred', 'math-addition', {
        error: 'Failed to load level',
      });

      expect(Sentry.captureException).toHaveBeenCalled();
    });
  });

  describe('User Interaction Tracking', () => {
    beforeEach(() => {
      errorTracker.initialize({ dsn: 'test-dsn' });
    });

    it('should track user interactions as breadcrumbs', () => {
      errorTracker.trackUserInteraction('click', 'start_button', {
        gameId: 'math-addition',
      });

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: 'user',
        message: 'click on start_button',
        level: 'info',
        data: { gameId: 'math-addition' },
      });
    });
  });

  describe('Context Management', () => {
    beforeEach(() => {
      errorTracker.initialize({ dsn: 'test-dsn' });
    });

    it('should clear user context', () => {
      errorTracker.setUserContext({ userId: 'user123' });
      errorTracker.clearUserContext();

      expect(Sentry.getCurrentScope().clear).toHaveBeenCalled();
    });
  });
});