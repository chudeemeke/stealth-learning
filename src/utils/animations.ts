import { Variants, Transition } from 'framer-motion';

// Apple-inspired Timing Functions
export const appleEasing = {
  easeOut: [0.25, 0.46, 0.45, 0.94] as number[],
  easeIn: [0.55, 0.055, 0.675, 0.19] as number[],
  easeInOut: [0.645, 0.045, 0.355, 1] as number[],
  spring: [0.175, 0.885, 0.32, 1.275] as number[],
  gentle: [0.25, 0.46, 0.45, 0.94] as number[],
  sharp: [0.4, 0, 0.2, 1] as number[],
  bounce: [0.68, -0.55, 0.265, 1.55] as number[],
} as const;

// Apple-inspired Duration Constants
export const appleDuration = {
  instant: 0,
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  slower: 0.5,
  gentle: 0.8,
} as const;

// Base Transition Presets
export const transitions: Record<string, Transition> = {
  // Apple's default spring transition
  spring: {
    type: 'spring',
    stiffness: 380,
    damping: 30,
    mass: 0.8,
  },

  // Gentle spring for cards and modals
  gentleSpring: {
    type: 'spring',
    stiffness: 300,
    damping: 35,
    mass: 1,
  },

  // Bouncy spring for interactive elements
  bouncySpring: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
    mass: 0.6,
  },

  // Tween transitions
  fastEaseOut: {
    duration: appleDuration.fast,
    ease: appleEasing.easeOut,
  },

  normalEaseOut: {
    duration: appleDuration.normal,
    ease: appleEasing.easeOut,
  },

  slowEaseOut: {
    duration: appleDuration.slow,
    ease: appleEasing.easeOut,
  },

  // Sharp transitions for UI state changes
  sharp: {
    duration: appleDuration.fast,
    ease: appleEasing.sharp,
  },

  // Gentle transitions for page elements
  gentle: {
    duration: appleDuration.gentle,
    ease: appleEasing.gentle,
  },
};

// Common Animation Variants
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.normalEaseOut,
  },
  exit: {
    opacity: 0,
    transition: transitions.fastEaseOut,
  },
};

export const slideVariants = {
  slideInUp: {
    hidden: {
      y: 30,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: transitions.gentleSpring,
    },
    exit: {
      y: -30,
      opacity: 0,
      transition: transitions.fastEaseOut,
    },
  },

  slideInDown: {
    hidden: {
      y: -30,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: transitions.gentleSpring,
    },
    exit: {
      y: 30,
      opacity: 0,
      transition: transitions.fastEaseOut,
    },
  },

  slideInLeft: {
    hidden: {
      x: -30,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: transitions.gentleSpring,
    },
    exit: {
      x: 30,
      opacity: 0,
      transition: transitions.fastEaseOut,
    },
  },

  slideInRight: {
    hidden: {
      x: 30,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: transitions.gentleSpring,
    },
    exit: {
      x: -30,
      opacity: 0,
      transition: transitions.fastEaseOut,
    },
  },
} as Variants;

export const scaleVariants = {
  scaleIn: {
    hidden: {
      scale: 0.85,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: transitions.bouncySpring,
    },
    exit: {
      scale: 0.85,
      opacity: 0,
      transition: transitions.fastEaseOut,
    },
  },

  scaleUp: {
    hidden: {
      scale: 1.15,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: transitions.gentleSpring,
    },
    exit: {
      scale: 1.15,
      opacity: 0,
      transition: transitions.fastEaseOut,
    },
  },

  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: appleEasing.easeInOut,
    },
  },
} as Variants;

// Card Animation Variants
export const cardVariants = {
  // Standard card entrance
  enter: {
    hidden: {
      y: 20,
      scale: 0.95,
      opacity: 0,
    },
    visible: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: transitions.gentleSpring,
    },
  },

  // Hover states
  hover: {
    scale: 1.02,
    y: -2,
    transition: transitions.fastEaseOut,
  },

  // Tap/click states
  tap: {
    scale: 0.98,
    transition: transitions.sharp,
  },

  // 3D flip effect
  flip: {
    rotateY: [0, 180],
    transition: {
      duration: 0.6,
      ease: appleEasing.easeInOut,
    },
  },

  // Floating animation
  float: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: appleEasing.easeInOut,
    },
  },
} as Variants;

// Page Transition Variants
export const pageVariants = {
  // Standard page transitions
  slideLeft: {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: transitions.gentleSpring,
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: transitions.normalEaseOut,
    },
  },

  slideRight: {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: transitions.gentleSpring,
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: transitions.normalEaseOut,
    },
  },

  slideUp: {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: transitions.gentleSpring,
    },
    exit: {
      y: '-100%',
      opacity: 0,
      transition: transitions.normalEaseOut,
    },
  },

  // Modal transitions
  modal: {
    hidden: {
      scale: 0.8,
      opacity: 0,
      y: 50,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: transitions.bouncySpring,
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: 50,
      transition: transitions.fastEaseOut,
    },
  },

  // Drawer transitions
  drawer: {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: transitions.gentleSpring,
    },
    exit: {
      x: '100%',
      transition: transitions.normalEaseOut,
    },
  },
} as Variants;

// Game-specific Animation Variants
export const gameVariants = {
  // Success animations
  successBounce: {
    scale: [1, 1.3, 0.9, 1.1, 1],
    rotate: [0, -10, 10, -5, 0],
    transition: {
      duration: 0.6,
      ease: appleEasing.bounce,
    },
  },

  // Error animations
  errorShake: {
    x: [-10, 10, -8, 8, -6, 6, -4, 4, 0],
    transition: {
      duration: 0.5,
      ease: appleEasing.easeOut,
    },
  },

  // Celebration animation
  celebrate: {
    scale: [1, 1.2, 1],
    rotate: [0, 360],
    transition: {
      duration: 0.8,
      ease: appleEasing.easeInOut,
    },
  },

  // Wiggle animation for hints
  wiggle: {
    rotate: [-3, 3, -3, 3, 0],
    transition: {
      duration: 0.5,
      repeat: 3,
      ease: appleEasing.easeInOut,
    },
  },

  // Glow animation for important elements
  glow: {
    boxShadow: [
      '0 0 5px rgba(0, 122, 255, 0.5)',
      '0 0 20px rgba(0, 122, 255, 0.8)',
      '0 0 5px rgba(0, 122, 255, 0.5)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: appleEasing.easeInOut,
    },
  },
} as Variants;

// Age-specific Animation Configurations
export const ageAnimationConfig = {
  '3-5': {
    duration: appleDuration.slower,
    spring: {
      stiffness: 250,
      damping: 40,
      mass: 1.2,
    },
    hover: {
      scale: 1.1,
      rotate: 5,
    },
    tap: {
      scale: 0.9,
    },
    focus: {
      scale: 1.05,
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
    },
  },
  '6-8': {
    duration: appleDuration.normal,
    spring: {
      stiffness: 300,
      damping: 35,
      mass: 1,
    },
    hover: {
      scale: 1.05,
      rotate: 2,
    },
    tap: {
      scale: 0.95,
    },
    focus: {
      scale: 1.02,
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
    },
  },
  '9+': {
    duration: appleDuration.fast,
    spring: {
      stiffness: 380,
      damping: 30,
      mass: 0.8,
    },
    hover: {
      scale: 1.02,
    },
    tap: {
      scale: 0.98,
    },
    focus: {
      scale: 1.01,
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
  },
} as const;

// Stagger Animation Helper
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as Variants;

export const staggerItem = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.gentleSpring,
  },
} as Variants;

// Utility Functions
export const createCustomTransition = (
  duration: number,
  easing: number[] = appleEasing.easeOut as number[],
  delay: number = 0
): Transition => ({
  duration,
  ease: easing,
  delay,
});

export const createSpringTransition = (
  stiffness: number = 380,
  damping: number = 30,
  mass: number = 0.8
): Transition => ({
  type: 'spring',
  stiffness,
  damping,
  mass,
});

// Animation Composition Helpers
export const combineVariants = (...variants: Variants[]): Variants => {
  return variants.reduce((combined, variant) => ({
    ...combined,
    ...variant,
  }), {});
};

export const createSequence = (animations: Array<{ [key: string]: any }>, totalDuration: number = 1) => {
  const stepDuration = totalDuration / animations.length;
  return animations.map((animation, index) => ({
    ...animation,
    transition: {
      ...animation.transition,
      delay: index * stepDuration,
    },
  }));
};

// Accessibility-aware animation configuration
export const getAccessibleAnimation = (prefersReducedMotion: boolean, baseVariant: Variants): Variants => {
  if (prefersReducedMotion) {
    return Object.keys(baseVariant).reduce((acc, key) => {
      acc[key] = {
        ...baseVariant[key],
        transition: {
          duration: 0.01,
        },
      };
      return acc;
    }, {} as Variants);
  }
  return baseVariant;
};

// Export all animation presets
export const animationPresets = {
  fade: fadeVariants,
  slide: slideVariants,
  scale: scaleVariants,
  card: cardVariants,
  page: pageVariants,
  game: gameVariants,
  stagger: { container: staggerContainer, item: staggerItem },
};

export default animationPresets;