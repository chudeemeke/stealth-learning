/**
 * WCAG AAA Contrast Checker Utility
 * Ensures text meets accessibility standards for children
 */

/**
 * Convert hex color to RGB
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Calculate relative luminance
 * @param rgb - RGB color values
 */
const getLuminance = (rgb: { r: number; g: number; b: number }): number => {
  const { r, g, b } = rgb;
  const sRGB = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
};

/**
 * Calculate contrast ratio between two colors
 * @param color1 - Hex color string
 * @param color2 - Hex color string
 * @returns Contrast ratio (1 to 21)
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Check if contrast meets WCAG standards
 * @param ratio - Contrast ratio
 * @param level - WCAG level ('AA' or 'AAA')
 * @param largeText - Whether text is large (18pt+ or 14pt+ bold)
 */
export const meetsWCAG = (
  ratio: number,
  level: 'AA' | 'AAA' = 'AAA',
  largeText: boolean = false
): boolean => {
  if (level === 'AAA') {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  } else {
    return largeText ? ratio >= 3 : ratio >= 4.5;
  }
};

/**
 * Get appropriate text color for a background
 * @param backgroundColor - Hex color string
 * @param options - Text options
 * @returns Best text color (white or black) with optional shadow
 */
export const getAccessibleTextColor = (
  backgroundColor: string,
  options: {
    preferLight?: boolean;
    level?: 'AA' | 'AAA';
    largeText?: boolean;
  } = {}
): {
  color: string;
  className: string;
  shadow?: string;
} => {
  const { preferLight = true, level = 'AAA', largeText = false } = options;

  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');

  const whiteOk = meetsWCAG(whiteContrast, level, largeText);
  const blackOk = meetsWCAG(blackContrast, level, largeText);

  // If neither pure white nor black meets standards, add text shadow
  const needsShadow = !whiteOk && !blackOk;

  if (whiteOk && blackOk) {
    // Both work, use preference
    return preferLight
      ? { color: '#FFFFFF', className: 'text-white' }
      : { color: '#000000', className: 'text-black' };
  } else if (whiteOk) {
    return {
      color: '#FFFFFF',
      className: 'text-white',
      shadow: needsShadow ? '1px 1px 2px rgba(0,0,0,0.5)' : undefined
    };
  } else if (blackOk) {
    return {
      color: '#000000',
      className: 'text-black',
      shadow: needsShadow ? '1px 1px 2px rgba(255,255,255,0.5)' : undefined
    };
  } else {
    // Neither meets standards alone, use white with strong shadow
    return {
      color: '#FFFFFF',
      className: 'text-white',
      shadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)'
    };
  }
};

/**
 * Theme-aware color configurations for child-friendly UI
 */
export const ACCESSIBLE_COLORS = {
  math: {
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    text: getAccessibleTextColor('#3B82F6'),
    bubbleText: getAccessibleTextColor('#1D4ED8')
  },
  english: {
    primary: '#EF4444',
    secondary: '#DC2626',
    text: getAccessibleTextColor('#EF4444'),
    bubbleText: getAccessibleTextColor('#DC2626')
  },
  science: {
    primary: '#10B981',
    secondary: '#059669',
    text: getAccessibleTextColor('#10B981'),
    bubbleText: getAccessibleTextColor('#059669')
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    text: getAccessibleTextColor('#8B5CF6'),
    bubbleText: getAccessibleTextColor('#7C3AED')
  }
};

/**
 * Get dynamic contrast-aware classes
 */
export const getContrastClasses = (
  backgroundColor: string,
  textSize: 'small' | 'medium' | 'large' = 'medium'
): string => {
  const largeText = textSize === 'large';
  const { className, shadow } = getAccessibleTextColor(backgroundColor, {
    level: 'AAA',
    largeText
  });

  const shadowClass = shadow
    ? `[text-shadow:${shadow}]`
    : '';

  return `${className} ${shadowClass}`.trim();
};