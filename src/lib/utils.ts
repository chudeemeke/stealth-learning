import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function for formatting numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Utility function for generating random IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Utility function for debouncing
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Utility function for throttling
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Utility function for deep cloning
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

// Utility function for safe JSON parsing
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// Utility function for formatting time
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Utility function for calculating percentage
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

// Utility function for clamping values
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Utility function for linear interpolation
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// Utility function for normalizing values
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

// Utility function for checking if value is in range
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

// Utility function for age group determination
export function getAgeGroup(age: number): '3-5' | '6-8' | '9+' {
  if (age >= 3 && age <= 5) return '3-5';
  if (age >= 6 && age <= 8) return '6-8';
  return '9+';
}

// Utility function for touch target sizing based on age
export function getTouchTargetSize(ageGroup: '3-5' | '6-8' | '9+'): number {
  switch (ageGroup) {
    case '3-5':
      return 64;
    case '6-8':
      return 48;
    case '9+':
      return 44;
    default:
      return 44;
  }
}

// Utility function for getting appropriate font size
export function getFontSize(ageGroup: '3-5' | '6-8' | '9+'): string {
  switch (ageGroup) {
    case '3-5':
      return 'text-2xl';
    case '6-8':
      return 'text-xl';
    case '9+':
      return 'text-lg';
    default:
      return 'text-base';
  }
}

// Utility function for sleep/delay
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility function for retry logic
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retry(fn, retries - 1, delay);
    }
    throw error;
  }
}

// Utility function for creating stable keys for React lists
export function createStableKey(prefix: string, index: number, id?: string | number): string {
  return id ? `${prefix}-${id}` : `${prefix}-${index}`;
}

// Utility function for checking if an element is in viewport
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Utility function for smooth scrolling to element
export function scrollToElement(
  element: Element,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' }
): void {
  element.scrollIntoView(options);
}

// Utility function for getting contrast color
export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Utility function for converting hex to rgba
export function hexToRgba(hex: string, alpha: number = 1): string {
  const color = hex.replace('#', '');
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Utility function for device detection
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;

  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Utility function for checking if device supports touch
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Utility function for browser detection
export function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';

  const userAgent = window.navigator.userAgent;

  if (userAgent.includes('Chrome')) return 'chrome';
  if (userAgent.includes('Firefox')) return 'firefox';
  if (userAgent.includes('Safari')) return 'safari';
  if (userAgent.includes('Edge')) return 'edge';

  return 'unknown';
}

// Utility function for checking if running in PWA mode
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://');
}

// Export all utilities
export default {
  cn,
  formatNumber,
  generateId,
  debounce,
  throttle,
  deepClone,
  safeJsonParse,
  formatTime,
  calculatePercentage,
  clamp,
  lerp,
  normalize,
  inRange,
  getAgeGroup,
  getTouchTargetSize,
  getFontSize,
  sleep,
  retry,
  createStableKey,
  isInViewport,
  scrollToElement,
  getContrastColor,
  hexToRgba,
  getDeviceType,
  isTouchDevice,
  getBrowser,
  isPWA,
};