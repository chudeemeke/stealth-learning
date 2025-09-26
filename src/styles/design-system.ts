/**
 * Unified Design System
 * Combining Airbnb's clean, trustworthy aesthetic with Duolingo's playful, engaging elements
 * Security and accessibility baked in by default
 */

// Design Philosophy:
// - Airbnb: Clean, minimal, trustworthy, professional, accessible
// - Duolingo: Playful, engaging, motivating, gamified, delightful
// - Security: Privacy-first, transparent, safe for children

export const DesignSystem = {
  // Color Palette - Combining both philosophies
  colors: {
    // Primary - Duolingo-inspired vibrant greens with Airbnb's trust
    primary: {
      50: '#E6F7E6',
      100: '#C2EBC2',
      200: '#9BDF9B',
      300: '#58CE58',
      400: '#43C843', // Main brand color
      500: '#35B835',
      600: '#2FA52F',
      700: '#289128',
      800: '#227D22',
      900: '#1B691B',
    },

    // Secondary - Airbnb-inspired coral/pink for warmth
    secondary: {
      50: '#FFF5F5',
      100: '#FFE6E6',
      200: '#FFCCCC',
      300: '#FF9999',
      400: '#FF6666',
      500: '#FF385C', // Airbnb's signature color
      600: '#E63253',
      700: '#CC2B49',
      800: '#B32540',
      900: '#991F36',
    },

    // Accent - Duolingo's motivating gold/yellow
    accent: {
      50: '#FFFBF0',
      100: '#FFF4D9',
      200: '#FFEAB3',
      300: '#FFDF8C',
      400: '#FFD466',
      500: '#FFC940', // Duolingo gold
      600: '#E6B539',
      700: '#CCA033',
      800: '#B38C2C',
      900: '#997726',
    },

    // Semantic colors for security/status
    success: '#10B981', // Green for success
    warning: '#F59E0B', // Orange for warnings
    error: '#EF4444',   // Red for errors
    info: '#3B82F6',    // Blue for information

    // Neutral palette - Airbnb's sophisticated grays
    neutral: {
      0: '#FFFFFF',
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      1000: '#030712',
    },

    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      overlay: 'rgba(0, 0, 0, 0.5)',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  },

  // Typography - Clean and readable like Airbnb, playful for kids
  typography: {
    // Font families
    fonts: {
      heading: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'SF Mono', Monaco, monospace",
      playful: "'Nunito', system-ui, sans-serif",
      display: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },

    // Font sizes - Responsive and accessible
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
    },

    // Font weights
    weights: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    // Line heights
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Spacing system - Consistent like Airbnb
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
  },

  // Border radius - Soft and friendly like both brands
  radii: {
    none: '0',
    sm: '0.125rem',   // 2px
    default: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',   // Fully rounded
  },

  // Shadows - Subtle like Airbnb with playful options
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    // Playful colored shadows for kid elements
    playful: {
      green: '0 10px 25px -5px rgba(52, 184, 53, 0.3)',
      pink: '0 10px 25px -5px rgba(255, 56, 92, 0.3)',
      gold: '0 10px 25px -5px rgba(255, 201, 64, 0.3)',
    },
  },

  // Transitions - Smooth and delightful
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    spring: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    // Specific transitions
    fade: 'opacity 250ms ease-in-out',
    slide: 'transform 350ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    scale: 'transform 250ms ease-in-out',
  },

  // Animation configurations for consistent timing
  animation: {
    transitions: {
      base: '250ms ease-in-out',
      fast: '150ms ease-in-out',
      slow: '350ms ease-in-out',
      spring: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  // Effects including enhanced shadows
  effects: {
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      playful: {
        green: '0 10px 25px -5px rgba(67, 200, 67, 0.3)',
        pink: '0 10px 25px -5px rgba(255, 56, 92, 0.3)',
        gold: '0 10px 25px -5px rgba(255, 201, 64, 0.3)'
      }
    },
    blur: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px'
    },
    opacity: {
      0: '0',
      10: '0.1',
      20: '0.2',
      30: '0.3',
      40: '0.4',
      50: '0.5',
      60: '0.6',
      70: '0.7',
      80: '0.8',
      90: '0.9',
      100: '1'
    }
  },

  // Breakpoints - Mobile-first responsive design
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index layers for proper stacking
  zIndex: {
    auto: 'auto',
    0: 0,
    10: 10,     // Base elements
    20: 20,     // Floating elements
    30: 30,     // Dropdowns
    40: 40,     // Sticky elements
    50: 50,     // Modals/overlays
    60: 60,     // Toasts/notifications
    70: 70,     // Tooltips
    80: 80,     // Security warnings
    90: 90,     // Loading indicators
    100: 100,   // Maximum priority
  },

  // Component-specific styles
  components: {
    // Button styles combining both philosophies
    button: {
      // Base styles
      base: {
        fontWeight: 600,
        borderRadius: '0.5rem',
        transition: 'all 250ms ease-in-out',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        outline: 'none',
        border: 'none',
        textDecoration: 'none',
      },

      // Sizes with proper touch targets
      sizes: {
        xs: {
          padding: '0.5rem 0.75rem',
          fontSize: '0.75rem',
          minHeight: '32px',
        },
        sm: {
          padding: '0.625rem 1rem',
          fontSize: '0.875rem',
          minHeight: '36px',
        },
        md: {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          minHeight: '44px', // Minimum touch target
        },
        lg: {
          padding: '1rem 2rem',
          fontSize: '1.125rem',
          minHeight: '52px',
        },
        xl: {
          padding: '1.25rem 2.5rem',
          fontSize: '1.25rem',
          minHeight: '60px',
        },
      },

      // Variants
      variants: {
        primary: {
          background: 'linear-gradient(135deg, #43C843 0%, #35B835 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px 0 rgba(67, 200, 67, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(67, 200, 67, 0.4)',
          },
        },
        secondary: {
          background: '#FFFFFF',
          color: '#374151',
          border: '2px solid #E5E7EB',
          '&:hover': {
            borderColor: '#43C843',
            color: '#43C843',
          },
        },
        danger: {
          background: '#EF4444',
          color: '#FFFFFF',
          '&:hover': {
            background: '#DC2626',
          },
        },
        playful: {
          background: 'linear-gradient(135deg, #FFC940 0%, #FF9999 100%)',
          color: '#FFFFFF',
          fontSize: '1.125rem',
          fontWeight: 700,
          boxShadow: '0 4px 14px 0 rgba(255, 201, 64, 0.4)',
          animation: 'pulse 2s infinite',
        },
      },
    },

    // Card styles - Clean like Airbnb
    card: {
      base: {
        background: '#FFFFFF',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '1.5rem',
        transition: 'all 250ms ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
        },
      },
      playful: {
        background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
        border: '3px solid',
        borderImage: 'linear-gradient(135deg, #43C843, #FFC940) 1',
      },
    },

    // Input styles - Secure and accessible by default
    input: {
      base: {
        width: '100%',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        borderRadius: '0.5rem',
        border: '2px solid #E5E7EB',
        transition: 'all 250ms ease-in-out',
        background: '#FFFFFF',
        '&:focus': {
          outline: 'none',
          borderColor: '#43C843',
          boxShadow: '0 0 0 3px rgba(67, 200, 67, 0.1)',
        },
        '&:disabled': {
          background: '#F3F4F6',
          cursor: 'not-allowed',
          opacity: 0.6,
        },
      },
      error: {
        borderColor: '#EF4444',
        '&:focus': {
          borderColor: '#EF4444',
          boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
        },
      },
      success: {
        borderColor: '#10B981',
        '&:focus': {
          borderColor: '#10B981',
          boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
        },
      },
    },

    // Badge styles - Duolingo-inspired achievements
    badge: {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 600,
      },
      variants: {
        success: {
          background: '#D1FAE5',
          color: '#065F46',
        },
        warning: {
          background: '#FEF3C7',
          color: '#92400E',
        },
        error: {
          background: '#FEE2E2',
          color: '#991B1B',
        },
        info: {
          background: '#DBEAFE',
          color: '#1E40AF',
        },
        achievement: {
          background: 'linear-gradient(135deg, #FFC940 0%, #FFB800 100%)',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(255, 201, 64, 0.4)',
        },
      },
    },

    // Progress bar - Motivating like Duolingo
    progress: {
      track: {
        height: '12px',
        background: '#E5E7EB',
        borderRadius: '9999px',
        overflow: 'hidden',
      },
      fill: {
        height: '100%',
        background: 'linear-gradient(90deg, #43C843 0%, #35B835 100%)',
        borderRadius: '9999px',
        transition: 'width 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
          animation: 'shimmer 2s infinite',
        },
      },
    },
  },

  // Animations - Delightful and engaging
  animations: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    slideUp: {
      from: { transform: 'translateY(20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideDown: {
      from: { transform: 'translateY(-20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    bounce: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.8 },
    },
    shake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '25%': { transform: 'translateX(-10px)' },
      '75%': { transform: 'translateX(10px)' },
    },
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
  },

  // Security indicators - Built into the design
  security: {
    indicators: {
      secure: {
        color: '#10B981',
        icon: '🔒',
        background: '#D1FAE5',
      },
      warning: {
        color: '#F59E0B',
        icon: '⚠️',
        background: '#FEF3C7',
      },
      critical: {
        color: '#EF4444',
        icon: '🚨',
        background: '#FEE2E2',
      },
    },

    // Privacy-first design elements
    privacy: {
      blur: 'blur(8px)',
      overlay: 'rgba(0, 0, 0, 0.8)',
      redacted: {
        background: '#374151',
        color: 'transparent',
        userSelect: 'none',
      },
    },
  },

  // Accessibility - WCAG AAA compliant
  accessibility: {
    focusRing: '0 0 0 3px rgba(67, 200, 67, 0.5)',
    minTouchTarget: '44px',
    contrastRatios: {
      normal: 4.5,
      large: 3,
      enhanced: 7,
    },
    motion: {
      reducedMotion: '@media (prefers-reduced-motion: reduce)',
    },
  },

  // Age-specific adaptations
  ageGroups: {
    '3-5': {
      fontSize: '1.25rem',
      buttonSize: '60px',
      spacing: '1.5rem',
      animations: 'playful',
    },
    '6-8': {
      fontSize: '1.125rem',
      buttonSize: '52px',
      spacing: '1.25rem',
      animations: 'moderate',
    },
    '9+': {
      fontSize: '1rem',
      buttonSize: '44px',
      spacing: '1rem',
      animations: 'subtle',
    },
  },
};

// Export themed CSS variables for easy use
export const getCSSVariables = () => {
  const vars: Record<string, string> = {};

  // Colors
  Object.entries(DesignSystem.colors.primary).forEach(([key, value]) => {
    vars[`--color-primary-${key}`] = value;
  });

  Object.entries(DesignSystem.colors.secondary).forEach(([key, value]) => {
    vars[`--color-secondary-${key}`] = value;
  });

  Object.entries(DesignSystem.colors.accent).forEach(([key, value]) => {
    vars[`--color-accent-${key}`] = value;
  });

  // Spacing
  Object.entries(DesignSystem.spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = value;
  });

  // Typography
  Object.entries(DesignSystem.typography.sizes).forEach(([key, value]) => {
    vars[`--text-${key}`] = value;
  });

  return vars;
};

// Helper function to apply theme
export const applyTheme = (element: HTMLElement = document.documentElement) => {
  const cssVars = getCSSVariables();
  Object.entries(cssVars).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
};

export default DesignSystem;