/**
 * Z-Index Management System for AAA+ Accessibility
 * Ensures proper layering hierarchy throughout the application
 *
 * WCAG AAA Compliant - Ensures helper elements remain visible
 */

export const Z_INDEX = {
  // Base level elements (0-10)
  BACKGROUND: 1,
  BACKGROUND_DECORATION: 2,
  BACKGROUND_PARTICLES: 5,

  // Content level (20-50)
  CONTENT_BASE: 20,
  GAME_CARDS: 30,
  GAME_CONTENT: 40,
  PROGRESS_BARS: 45,

  // Interactive elements (100-500)
  BUTTONS: 100,
  DROPDOWN_MENU: 200,
  TOOLTIP: 300,
  POPOVER: 400,

  // Helper/Assistant elements (1000) - Always visible
  HELPER_CHARACTER: 1000,
  HELPER_BUBBLE: 1001,
  HELPER_HINTS: 1002,

  // Overlay elements (2000-5000)
  MODAL_BACKDROP: 2000,
  MODAL_CONTENT: 2001,
  TOAST_NOTIFICATION: 3000,
  DRAWER: 4000,

  // Critical/System level (9000+)
  SYSTEM_ALERT: 9000,
  EMERGENCY_NOTICE: 9999,
} as const;

/**
 * Tailwind utility classes for z-index
 * Use these for consistent z-index application
 */
export const Z_INDEX_CLASSES = {
  BACKGROUND: 'z-[1]',
  BACKGROUND_DECORATION: 'z-[2]',
  BACKGROUND_PARTICLES: 'z-[5]',

  CONTENT_BASE: 'z-20',
  GAME_CARDS: 'z-30',
  GAME_CONTENT: 'z-40',
  PROGRESS_BARS: 'z-[45]',

  BUTTONS: 'z-[100]',
  DROPDOWN_MENU: 'z-[200]',
  TOOLTIP: 'z-[300]',
  POPOVER: 'z-[400]',

  // Helper elements - highest priority for visibility
  HELPER_CHARACTER: 'z-[1000]',
  HELPER_BUBBLE: 'z-[1001]',
  HELPER_HINTS: 'z-[1002]',

  MODAL_BACKDROP: 'z-[2000]',
  MODAL_CONTENT: 'z-[2001]',
  TOAST_NOTIFICATION: 'z-[3000]',
  DRAWER: 'z-[4000]',

  SYSTEM_ALERT: 'z-[9000]',
  EMERGENCY_NOTICE: 'z-[9999]',
} as const;

/**
 * Helper function to get z-index value
 */
export const getZIndex = (layer: keyof typeof Z_INDEX): number => {
  return Z_INDEX[layer];
};

/**
 * Helper function to get Tailwind z-index class
 */
export const getZIndexClass = (layer: keyof typeof Z_INDEX_CLASSES): string => {
  return Z_INDEX_CLASSES[layer];
};