import { CSSProperties } from 'react';

// Glassmorphism Configuration Types
export interface GlassmorphismConfig {
  blur?: number;
  saturation?: number;
  brightness?: number;
  backgroundOpacity?: number;
  borderOpacity?: number;
  shadowIntensity?: 'none' | 'light' | 'medium' | 'heavy';
  borderRadius?: number;
  borderWidth?: number;
}

export interface GlassPreset extends GlassmorphismConfig {
  name: string;
  description: string;
  useCases: string[];
}

// Apple-inspired Glass Presets
export const glassPresets: Record<string, GlassPreset> = {
  subtle: {
    name: 'Subtle Glass',
    description: 'Minimal glass effect for secondary UI elements',
    useCases: ['Secondary cards', 'Background overlays', 'Subtle panels'],
    blur: 15,
    saturation: 160,
    brightness: 110,
    backgroundOpacity: 0.15,
    borderOpacity: 0.1,
    shadowIntensity: 'light',
    borderRadius: 12,
    borderWidth: 1,
  },

  standard: {
    name: 'Standard Glass',
    description: 'Balanced glass effect for main UI components',
    useCases: ['Main cards', 'Modals', 'Navigation bars', 'Panels'],
    blur: 20,
    saturation: 180,
    brightness: 115,
    backgroundOpacity: 0.25,
    borderOpacity: 0.18,
    shadowIntensity: 'medium',
    borderRadius: 16,
    borderWidth: 1,
  },

  strong: {
    name: 'Strong Glass',
    description: 'Prominent glass effect for hero elements',
    useCases: ['Hero sections', 'Featured cards', 'Important modals'],
    blur: 25,
    saturation: 200,
    brightness: 120,
    backgroundOpacity: 0.35,
    borderOpacity: 0.25,
    shadowIntensity: 'heavy',
    borderRadius: 20,
    borderWidth: 1.5,
  },

  frosted: {
    name: 'Frosted Glass',
    description: 'Heavy frosted effect for overlays and backgrounds',
    useCases: ['Modal backgrounds', 'Overlay panels', 'Loading screens'],
    blur: 30,
    saturation: 220,
    brightness: 125,
    backgroundOpacity: 0.45,
    borderOpacity: 0.3,
    shadowIntensity: 'heavy',
    borderRadius: 24,
    borderWidth: 2,
  },

  crystal: {
    name: 'Crystal Clear',
    description: 'Minimal blur with high clarity for readability',
    useCases: ['Text containers', 'Input fields', 'Readable panels'],
    blur: 10,
    saturation: 140,
    brightness: 105,
    backgroundOpacity: 0.2,
    borderOpacity: 0.15,
    shadowIntensity: 'light',
    borderRadius: 8,
    borderWidth: 1,
  },

  vibrant: {
    name: 'Vibrant Glass',
    description: 'Enhanced saturation for colorful backgrounds',
    useCases: ['Colorful cards', 'Game elements', 'Interactive components'],
    blur: 18,
    saturation: 250,
    brightness: 130,
    backgroundOpacity: 0.3,
    borderOpacity: 0.2,
    shadowIntensity: 'medium',
    borderRadius: 16,
    borderWidth: 1,
  },
};

// Age-specific Glass Configurations
export const ageGlassConfigs = {
  '3-5': {
    ...glassPresets.vibrant,
    blur: 12,
    backgroundOpacity: 0.4,
    borderRadius: 20,
    shadowIntensity: 'light' as const,
  },
  '6-8': {
    ...glassPresets.standard,
    blur: 16,
    backgroundOpacity: 0.3,
    borderRadius: 16,
    shadowIntensity: 'medium' as const,
  },
  '9+': {
    ...glassPresets.subtle,
    blur: 20,
    backgroundOpacity: 0.25,
    borderRadius: 12,
    shadowIntensity: 'medium' as const,
  },
} as const;

// Shadow Configuration
const shadowConfig = {
  none: 'none',
  light: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
  medium: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  heavy: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',
} as const;

// Core Glassmorphism Style Generator
export const createGlassStyle = (config: GlassmorphismConfig): CSSProperties => {
  const {
    blur = 20,
    saturation = 180,
    brightness = 115,
    backgroundOpacity = 0.25,
    borderOpacity = 0.18,
    shadowIntensity = 'medium',
    borderRadius = 16,
    borderWidth = 1,
  } = config;

  return {
    background: `rgba(255, 255, 255, ${backgroundOpacity})`,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(${brightness}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(${brightness}%)`,
    border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
    borderRadius: `${borderRadius}px`,
    boxShadow: shadowConfig[shadowIntensity],
    // Improve rendering performance
    willChange: 'backdrop-filter',
    isolation: 'isolate',
  };
};

// Dark Mode Glass Style Generator
export const createDarkGlassStyle = (config: GlassmorphismConfig): CSSProperties => {
  const {
    blur = 20,
    saturation = 180,
    brightness = 80,
    backgroundOpacity = 0.25,
    borderOpacity = 0.15,
    shadowIntensity = 'medium',
    borderRadius = 16,
    borderWidth = 1,
  } = config;

  return {
    background: `rgba(28, 28, 30, ${backgroundOpacity})`,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(${brightness}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(${brightness}%)`,
    border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
    borderRadius: `${borderRadius}px`,
    boxShadow: shadowConfig[shadowIntensity],
    willChange: 'backdrop-filter',
    isolation: 'isolate',
  };
};

// Utility Classes Generator
export const generateGlassClasses = (config: GlassmorphismConfig): string => {
  const classes: string[] = ['glass'];

  if (config.shadowIntensity === 'light') classes.push('shadow-apple-sm');
  else if (config.shadowIntensity === 'medium') classes.push('shadow-apple-md');
  else if (config.shadowIntensity === 'heavy') classes.push('shadow-apple-lg');

  if (config.borderRadius && config.borderRadius <= 8) classes.push('rounded-apple-md');
  else if (config.borderRadius && config.borderRadius <= 16) classes.push('rounded-apple-lg');
  else if (config.borderRadius && config.borderRadius > 16) classes.push('rounded-apple-xl');

  return classes.join(' ');
};

// Responsive Glass Styles
export const createResponsiveGlass = (
  mobile: GlassmorphismConfig,
  tablet: GlassmorphismConfig,
  desktop: GlassmorphismConfig
) => ({
  mobile: createGlassStyle(mobile),
  tablet: createGlassStyle(tablet),
  desktop: createGlassStyle(desktop),
});

// Glass Component Props Helper
export interface GlassComponentProps {
  preset?: keyof typeof glassPresets;
  config?: Partial<GlassmorphismConfig>;
  darkMode?: boolean;
  ageGroup?: '3-5' | '6-8' | '9+';
  className?: string;
  style?: CSSProperties;
}

export const resolveGlassProps = (props: GlassComponentProps): CSSProperties => {
  let config: GlassmorphismConfig;

  // Determine configuration source
  if (props.ageGroup) {
    config = ageGlassConfigs[props.ageGroup];
  } else if (props.preset) {
    config = glassPresets[props.preset];
  } else {
    config = glassPresets.standard;
  }

  // Apply custom overrides
  if (props.config) {
    config = { ...config, ...props.config };
  }

  // Generate styles based on theme
  const glassStyles = props.darkMode
    ? createDarkGlassStyle(config)
    : createGlassStyle(config);

  // Merge with custom styles
  return {
    ...glassStyles,
    ...props.style,
  };
};

// Performance Optimization Helpers
export const glassOptimizationStyles: CSSProperties = {
  transform: 'translateZ(0)',
  willChange: 'backdrop-filter',
  isolation: 'isolate',
  contain: 'layout style paint',
};

// Browser Support Detection
export const supportsBackdropFilter = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    'backdropFilter' in document.documentElement.style ||
    'webkitBackdropFilter' in document.documentElement.style
  );
};

// Fallback Styles for Unsupported Browsers
export const createFallbackStyle = (config: GlassmorphismConfig): CSSProperties => {
  const { backgroundOpacity = 0.25, borderOpacity = 0.18, borderRadius = 16 } = config;

  return {
    background: `rgba(255, 255, 255, ${Math.min(backgroundOpacity + 0.2, 0.9)})`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    borderRadius: `${borderRadius}px`,
    boxShadow: shadowConfig.medium,
  };
};

// Advanced Glass Effects
export const advancedGlassEffects = {
  // Gradient glass with color overlay
  coloredGlass: (color: string, opacity: number = 0.1): CSSProperties => ({
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 100%)`,
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  }),

  // Noise texture glass
  texturedGlass: (): CSSProperties => ({
    background: `
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      rgba(255, 255, 255, 0.25)
    `,
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  }),

  // Animated glass shimmer
  shimmerGlass: (): CSSProperties => ({
    background: `
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.25) 0%,
        rgba(255, 255, 255, 0.4) 50%,
        rgba(255, 255, 255, 0.25) 100%
      )
    `,
    backgroundSize: '200% 200%',
    animation: 'shimmer 3s ease-in-out infinite',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  }),
};


export default {
  presets: glassPresets,
  ageConfigs: ageGlassConfigs,
  create: createGlassStyle,
  createDark: createDarkGlassStyle,
  resolve: resolveGlassProps,
  advanced: advancedGlassEffects,
};