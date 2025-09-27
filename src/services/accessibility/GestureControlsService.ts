/**
 * AAA+ Gesture Controls Service
 * Advanced touch and mouse gesture recognition
 * Optimized for young children with larger touch targets
 */

export interface GestureEvent {
  type: GestureType;
  startPoint: Point;
  endPoint: Point;
  deltaX: number;
  deltaY: number;
  distance: number;
  duration: number;
  velocity: number;
  direction: Direction;
  target: HTMLElement | null;
  touches?: number;
  scale?: number;
  rotation?: number;
  timestamp: number;
}

export interface Point {
  x: number;
  y: number;
}

type GestureType =
  | 'tap'
  | 'double-tap'
  | 'long-press'
  | 'swipe'
  | 'drag'
  | 'pinch'
  | 'rotate'
  | 'pan'
  | 'flick';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export interface GestureRecognizer {
  type: GestureType;
  handler: (event: GestureEvent) => void;
  options?: GestureOptions;
}

interface GestureOptions {
  threshold?: number;
  minDistance?: number;
  maxDuration?: number;
  preventDefaults?: boolean;
  bubbles?: boolean;
  requireTarget?: string; // CSS selector
}

interface TouchState {
  startTime: number;
  startPoint: Point;
  currentPoint: Point;
  previousPoint: Point;
  touchCount: number;
  isPinching: boolean;
  isRotating: boolean;
  initialDistance?: number;
  initialAngle?: number;
}

export class GestureControlsService {
  private static instance: GestureControlsService;
  private recognizers: Map<string, GestureRecognizer[]> = new Map();
  private touchState: TouchState | null = null;
  private mouseState: TouchState | null = null;
  private gestureHistory: GestureEvent[] = [];
  private isEnabled: boolean = true;
  private callbacks: Set<(gesture: GestureEvent) => void> = new Set();
  private animationFrame: number | null = null;
  private tapTimeout: number | null = null;
  private longPressTimeout: number | null = null;

  // Gesture thresholds (adjusted for kids)
  private readonly TAP_THRESHOLD = 200; // ms
  private readonly DOUBLE_TAP_THRESHOLD = 400; // ms
  private readonly LONG_PRESS_THRESHOLD = 500; // ms (shorter for kids)
  private readonly SWIPE_THRESHOLD = 50; // px (larger for small fingers)
  private readonly SWIPE_VELOCITY_THRESHOLD = 0.3; // px/ms
  private readonly PINCH_THRESHOLD = 0.1; // scale factor
  private readonly ROTATE_THRESHOLD = 15; // degrees

  // Age-based adjustments
  private ageAdjustments = {
    '3-5': {
      tapArea: 64, // px
      swipeThreshold: 30,
      longPressTime: 400
    },
    '6-8': {
      tapArea: 48,
      swipeThreshold: 40,
      longPressTime: 500
    },
    '9+': {
      tapArea: 32,
      swipeThreshold: 50,
      longPressTime: 600
    }
  };

  private currentAgeGroup: '3-5' | '6-8' | '9+' = '6-8';

  private constructor() {
    this.initializeGestures();
    this.setupEventListeners();
  }

  public static getInstance(): GestureControlsService {
    if (!GestureControlsService.instance) {
      GestureControlsService.instance = new GestureControlsService();
    }
    return GestureControlsService.instance;
  }

  /**
   * Initialize default gestures
   */
  private initializeGestures(): void {
    // Navigation gestures
    this.addGestureRecognizer({
      type: 'swipe',
      handler: (event) => {
        if (event.direction === 'left') {
          this.dispatchNavigation('next');
        } else if (event.direction === 'right') {
          this.dispatchNavigation('previous');
        }
      },
      options: {
        minDistance: this.SWIPE_THRESHOLD
      }
    });

    // Selection gestures
    this.addGestureRecognizer({
      type: 'tap',
      handler: (event) => {
        if (event.target) {
          this.dispatchSelection(event.target);
        }
      }
    });

    this.addGestureRecognizer({
      type: 'double-tap',
      handler: (event) => {
        if (event.target) {
          this.dispatchAction('activate', event.target);
        }
      }
    });

    // Help gesture
    this.addGestureRecognizer({
      type: 'long-press',
      handler: (event) => {
        this.dispatchAction('help', event.target);
        this.provideHapticFeedback('heavy');
      }
    });

    // Fun interactions
    this.addGestureRecognizer({
      type: 'pinch',
      handler: (event) => {
        if (event.scale && event.scale > 1.2) {
          this.dispatchAction('zoom-in');
        } else if (event.scale && event.scale < 0.8) {
          this.dispatchAction('zoom-out');
        }
      }
    });

    // Drag for drawing/tracing activities
    this.addGestureRecognizer({
      type: 'drag',
      handler: (event) => {
        this.dispatchDrawing(event);
      },
      options: {
        preventDefaults: true
      }
    });
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Touch events
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    document.addEventListener('touchcancel', this.handleTouchCancel.bind(this));

    // Mouse events (for desktop testing)
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));

    // Pointer events (unified)
    if (window.PointerEvent) {
      document.addEventListener('pointerdown', this.handlePointerDown.bind(this));
      document.addEventListener('pointermove', this.handlePointerMove.bind(this));
      document.addEventListener('pointerup', this.handlePointerUp.bind(this));
    }

    // Prevent default gestures on game area
    document.addEventListener('gesturestart', (e) => e.preventDefault());
  }

  /**
   * Handle touch start
   */
  private handleTouchStart(event: TouchEvent): void {
    if (!this.isEnabled) return;

    const touches = event.touches;
    const touch = touches[0];

    // Clear any existing timeouts
    this.clearTimeouts();

    // Initialize touch state
    this.touchState = {
      startTime: Date.now(),
      startPoint: { x: touch.clientX, y: touch.clientY },
      currentPoint: { x: touch.clientX, y: touch.clientY },
      previousPoint: { x: touch.clientX, y: touch.clientY },
      touchCount: touches.length,
      isPinching: false,
      isRotating: false
    };

    // Handle multi-touch
    if (touches.length === 2) {
      this.initializeMultiTouch(touches);
    }

    // Start long press detection
    this.longPressTimeout = window.setTimeout(() => {
      this.detectLongPress(event);
    }, this.ageAdjustments[this.currentAgeGroup].longPressTime);

    // Visual feedback
    this.showTouchFeedback(touch.clientX, touch.clientY);
  }

  /**
   * Handle touch move
   */
  private handleTouchMove(event: TouchEvent): void {
    if (!this.isEnabled || !this.touchState) return;

    const touches = event.touches;
    const touch = touches[0];

    // Update state
    this.touchState.previousPoint = { ...this.touchState.currentPoint };
    this.touchState.currentPoint = { x: touch.clientX, y: touch.clientY };

    // Cancel long press if moved too much
    const moveDistance = this.calculateDistance(
      this.touchState.startPoint,
      this.touchState.currentPoint
    );

    if (moveDistance > 10 && this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

    // Handle multi-touch gestures
    if (touches.length === 2) {
      this.handleMultiTouchMove(touches);
    } else if (touches.length === 1) {
      // Check for drag/pan
      if (moveDistance > this.ageAdjustments[this.currentAgeGroup].swipeThreshold) {
        this.detectDrag();
      }
    }

    // Prevent scrolling during gesture
    if (this.isGestureInProgress()) {
      event.preventDefault();
    }
  }

  /**
   * Handle touch end
   */
  private handleTouchEnd(event: TouchEvent): void {
    if (!this.isEnabled || !this.touchState) return;

    const duration = Date.now() - this.touchState.startTime;
    const distance = this.calculateDistance(
      this.touchState.startPoint,
      this.touchState.currentPoint
    );

    // Clear timeouts
    this.clearTimeouts();

    // Detect gesture type
    if (distance < 10 && duration < this.TAP_THRESHOLD) {
      this.detectTap(event);
    } else if (distance > this.ageAdjustments[this.currentAgeGroup].swipeThreshold) {
      const velocity = distance / duration;
      if (velocity > this.SWIPE_VELOCITY_THRESHOLD) {
        this.detectSwipe();
      }
    }

    // Reset state
    this.touchState = null;
  }

  /**
   * Handle touch cancel
   */
  private handleTouchCancel(event: TouchEvent): void {
    this.clearTimeouts();
    this.touchState = null;
  }

  /**
   * Initialize multi-touch tracking
   */
  private initializeMultiTouch(touches: TouchList): void {
    if (!this.touchState || touches.length < 2) return;

    const touch1 = touches[0];
    const touch2 = touches[1];

    // Calculate initial distance for pinch
    this.touchState.initialDistance = this.calculateDistance(
      { x: touch1.clientX, y: touch1.clientY },
      { x: touch2.clientX, y: touch2.clientY }
    );

    // Calculate initial angle for rotation
    this.touchState.initialAngle = Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    ) * (180 / Math.PI);

    this.touchState.isPinching = true;
  }

  /**
   * Handle multi-touch move
   */
  private handleMultiTouchMove(touches: TouchList): void {
    if (!this.touchState || touches.length < 2) return;

    const touch1 = touches[0];
    const touch2 = touches[1];

    // Calculate current distance
    const currentDistance = this.calculateDistance(
      { x: touch1.clientX, y: touch1.clientY },
      { x: touch2.clientX, y: touch2.clientY }
    );

    // Calculate current angle
    const currentAngle = Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    ) * (180 / Math.PI);

    // Detect pinch
    if (this.touchState.initialDistance) {
      const scale = currentDistance / this.touchState.initialDistance;
      if (Math.abs(scale - 1) > this.PINCH_THRESHOLD) {
        this.detectPinch(scale);
      }
    }

    // Detect rotation
    if (this.touchState.initialAngle !== undefined) {
      const rotation = currentAngle - this.touchState.initialAngle;
      if (Math.abs(rotation) > this.ROTATE_THRESHOLD) {
        this.detectRotation(rotation);
      }
    }
  }

  /**
   * Mouse event handlers (for desktop)
   */
  private handleMouseDown(event: MouseEvent): void {
    if (!this.isEnabled) return;

    this.mouseState = {
      startTime: Date.now(),
      startPoint: { x: event.clientX, y: event.clientY },
      currentPoint: { x: event.clientX, y: event.clientY },
      previousPoint: { x: event.clientX, y: event.clientY },
      touchCount: 1,
      isPinching: false,
      isRotating: false
    };
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.mouseState) return;

    this.mouseState.previousPoint = { ...this.mouseState.currentPoint };
    this.mouseState.currentPoint = { x: event.clientX, y: event.clientY };

    const distance = this.calculateDistance(
      this.mouseState.startPoint,
      this.mouseState.currentPoint
    );

    if (distance > this.ageAdjustments[this.currentAgeGroup].swipeThreshold) {
      this.detectDrag();
    }
  }

  private handleMouseUp(event: MouseEvent): void {
    if (!this.mouseState) return;

    const duration = Date.now() - this.mouseState.startTime;
    const distance = this.calculateDistance(
      this.mouseState.startPoint,
      this.mouseState.currentPoint
    );

    if (distance < 10 && duration < this.TAP_THRESHOLD) {
      this.detectTap(event as any);
    }

    this.mouseState = null;
  }

  /**
   * Pointer event handlers (unified)
   */
  private handlePointerDown(event: PointerEvent): void {
    // Handle based on pointer type
    if (event.pointerType === 'touch') {
      // Handled by touch events
    } else if (event.pointerType === 'mouse') {
      // Handled by mouse events
    } else if (event.pointerType === 'pen') {
      // Special handling for stylus
      this.handlePenInput(event);
    }
  }

  private handlePointerMove(event: PointerEvent): void {
    // Handle pointer move
  }

  private handlePointerUp(event: PointerEvent): void {
    // Handle pointer up
  }

  /**
   * Handle pen/stylus input
   */
  private handlePenInput(event: PointerEvent): void {
    // Enhanced precision for drawing activities
    const pressure = event.pressure || 1;
    const tiltX = (event as any).tiltX || 0;
    const tiltY = (event as any).tiltY || 0;

    this.dispatchAction('pen-input', event.target as HTMLElement, {
      pressure,
      tiltX,
      tiltY
    });
  }

  /**
   * Detect tap gesture
   */
  private detectTap(event: TouchEvent | MouseEvent): void {
    const target = event.target as HTMLElement;
    const now = Date.now();

    // Check for double tap
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
      this.tapTimeout = null;

      const gesture: GestureEvent = {
        type: 'double-tap',
        startPoint: this.touchState?.startPoint || this.mouseState!.startPoint,
        endPoint: this.touchState?.currentPoint || this.mouseState!.currentPoint,
        deltaX: 0,
        deltaY: 0,
        distance: 0,
        duration: 0,
        velocity: 0,
        direction: 'none',
        target,
        timestamp: now
      };

      this.emitGesture(gesture);
    } else {
      // Single tap
      this.tapTimeout = window.setTimeout(() => {
        const gesture: GestureEvent = {
          type: 'tap',
          startPoint: this.touchState?.startPoint || this.mouseState?.startPoint || { x: 0, y: 0 },
          endPoint: this.touchState?.currentPoint || this.mouseState?.currentPoint || { x: 0, y: 0 },
          deltaX: 0,
          deltaY: 0,
          distance: 0,
          duration: 0,
          velocity: 0,
          direction: 'none',
          target,
          timestamp: now
        };

        this.emitGesture(gesture);
        this.tapTimeout = null;
      }, this.DOUBLE_TAP_THRESHOLD);
    }

    // Visual feedback
    this.showTapFeedback(target);
  }

  /**
   * Detect long press
   */
  private detectLongPress(event: TouchEvent): void {
    if (!this.touchState) return;

    const target = event.target as HTMLElement;

    const gesture: GestureEvent = {
      type: 'long-press',
      startPoint: this.touchState.startPoint,
      endPoint: this.touchState.currentPoint,
      deltaX: 0,
      deltaY: 0,
      distance: 0,
      duration: this.ageAdjustments[this.currentAgeGroup].longPressTime,
      velocity: 0,
      direction: 'none',
      target,
      timestamp: Date.now()
    };

    this.emitGesture(gesture);

    // Haptic feedback
    this.provideHapticFeedback('medium');
  }

  /**
   * Detect swipe gesture
   */
  private detectSwipe(): void {
    if (!this.touchState && !this.mouseState) return;

    const state = this.touchState || this.mouseState!;
    const deltaX = state.currentPoint.x - state.startPoint.x;
    const deltaY = state.currentPoint.y - state.startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - state.startTime;
    const velocity = distance / duration;

    // Determine direction
    let direction: Direction = 'none';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    const gesture: GestureEvent = {
      type: 'swipe',
      startPoint: state.startPoint,
      endPoint: state.currentPoint,
      deltaX,
      deltaY,
      distance,
      duration,
      velocity,
      direction,
      target: document.elementFromPoint(state.currentPoint.x, state.currentPoint.y) as HTMLElement,
      timestamp: Date.now()
    };

    this.emitGesture(gesture);
  }

  /**
   * Detect drag gesture
   */
  private detectDrag(): void {
    if (!this.touchState && !this.mouseState) return;

    const state = this.touchState || this.mouseState!;
    const deltaX = state.currentPoint.x - state.previousPoint.x;
    const deltaY = state.currentPoint.y - state.previousPoint.y;

    const gesture: GestureEvent = {
      type: 'drag',
      startPoint: state.startPoint,
      endPoint: state.currentPoint,
      deltaX,
      deltaY,
      distance: this.calculateDistance(state.startPoint, state.currentPoint),
      duration: Date.now() - state.startTime,
      velocity: 0,
      direction: 'none',
      target: document.elementFromPoint(state.currentPoint.x, state.currentPoint.y) as HTMLElement,
      timestamp: Date.now()
    };

    this.emitGesture(gesture);
  }

  /**
   * Detect pinch gesture
   */
  private detectPinch(scale: number): void {
    if (!this.touchState) return;

    const gesture: GestureEvent = {
      type: 'pinch',
      startPoint: this.touchState.startPoint,
      endPoint: this.touchState.currentPoint,
      deltaX: 0,
      deltaY: 0,
      distance: 0,
      duration: Date.now() - this.touchState.startTime,
      velocity: 0,
      direction: 'none',
      target: null,
      scale,
      timestamp: Date.now()
    };

    this.emitGesture(gesture);
  }

  /**
   * Detect rotation gesture
   */
  private detectRotation(rotation: number): void {
    if (!this.touchState) return;

    const gesture: GestureEvent = {
      type: 'rotate',
      startPoint: this.touchState.startPoint,
      endPoint: this.touchState.currentPoint,
      deltaX: 0,
      deltaY: 0,
      distance: 0,
      duration: Date.now() - this.touchState.startTime,
      velocity: 0,
      direction: 'none',
      target: null,
      rotation,
      timestamp: Date.now()
    };

    this.emitGesture(gesture);
  }

  /**
   * Calculate distance between points
   */
  private calculateDistance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check if gesture is in progress
   */
  private isGestureInProgress(): boolean {
    return !!(this.touchState || this.mouseState);
  }

  /**
   * Clear all timeouts
   */
  private clearTimeouts(): void {
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
      this.tapTimeout = null;
    }
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }
  }

  /**
   * Emit gesture event
   */
  private emitGesture(gesture: GestureEvent): void {
    // Add to history
    this.gestureHistory.push(gesture);
    if (this.gestureHistory.length > 20) {
      this.gestureHistory.shift();
    }

    // Notify listeners
    this.callbacks.forEach(callback => callback(gesture));

    // Process recognizers
    const recognizers = this.recognizers.get(gesture.type) || [];
    recognizers.forEach(recognizer => {
      if (this.matchesOptions(gesture, recognizer.options)) {
        recognizer.handler(gesture);
      }
    });

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('gesture', { detail: gesture }));

    console.log(`👆 Gesture detected: ${gesture.type} ${gesture.direction}`);
  }

  /**
   * Check if gesture matches options
   */
  private matchesOptions(gesture: GestureEvent, options?: GestureOptions): boolean {
    if (!options) return true;

    if (options.minDistance && gesture.distance < options.minDistance) {
      return false;
    }

    if (options.maxDuration && gesture.duration > options.maxDuration) {
      return false;
    }

    if (options.requireTarget && gesture.target) {
      if (!gesture.target.matches(options.requireTarget)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Dispatch navigation event
   */
  private dispatchNavigation(direction: string): void {
    window.dispatchEvent(new CustomEvent('gesture-navigation', {
      detail: { direction }
    }));
  }

  /**
   * Dispatch selection event
   */
  private dispatchSelection(target: HTMLElement): void {
    window.dispatchEvent(new CustomEvent('gesture-selection', {
      detail: { target }
    }));
  }

  /**
   * Dispatch action event
   */
  private dispatchAction(action: string, target?: HTMLElement | null, data?: any): void {
    window.dispatchEvent(new CustomEvent('gesture-action', {
      detail: { action, target, data }
    }));
  }

  /**
   * Dispatch drawing event
   */
  private dispatchDrawing(gesture: GestureEvent): void {
    window.dispatchEvent(new CustomEvent('gesture-drawing', {
      detail: gesture
    }));
  }

  /**
   * Show touch feedback
   */
  private showTouchFeedback(x: number, y: number): void {
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      animation: ripple 0.5s ease-out;
      pointer-events: none;
      z-index: 10000;
    `;

    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  }

  /**
   * Show tap feedback
   */
  private showTapFeedback(target: HTMLElement): void {
    target.style.transition = 'transform 0.1s';
    target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      target.style.transform = '';
    }, 100);
  }

  /**
   * Provide haptic feedback
   */
  private provideHapticFeedback(style: 'light' | 'medium' | 'heavy'): void {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[style]);
    }
  }

  /**
   * Add gesture recognizer
   */
  public addGestureRecognizer(recognizer: GestureRecognizer): void {
    const recognizers = this.recognizers.get(recognizer.type) || [];
    recognizers.push(recognizer);
    this.recognizers.set(recognizer.type, recognizers);
  }

  /**
   * Remove gesture recognizer
   */
  public removeGestureRecognizer(type: GestureType, handler: (event: GestureEvent) => void): void {
    const recognizers = this.recognizers.get(type);
    if (recognizers) {
      const index = recognizers.findIndex(r => r.handler === handler);
      if (index >= 0) {
        recognizers.splice(index, 1);
      }
    }
  }

  /**
   * Set age group for adjustments
   */
  public setAgeGroup(ageGroup: '3-5' | '6-8' | '9+'): void {
    this.currentAgeGroup = ageGroup;
    console.log(`👶 Gesture controls adjusted for age group: ${ageGroup}`);
  }

  /**
   * Enable/disable gesture controls
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`👆 Gesture controls ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Subscribe to gesture events
   */
  public onGesture(callback: (gesture: GestureEvent) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Get gesture history
   */
  public getHistory(): GestureEvent[] {
    return [...this.gestureHistory];
  }

  /**
   * Clear gesture history
   */
  public clearHistory(): void {
    this.gestureHistory = [];
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    this.clearTimeouts();
    this.recognizers.clear();
    this.callbacks.clear();
    this.gestureHistory = [];
  }
}

// Add ripple animation to document
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      width: 100px;
      height: 100px;
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Export singleton instance
export const gestureControls = GestureControlsService.getInstance();