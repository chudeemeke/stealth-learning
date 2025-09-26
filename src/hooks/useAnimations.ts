import { useCallback, useEffect, useState, useRef } from 'react';
import { useAnimation, AnimationControls } from 'framer-motion';
import { useInView } from 'framer-motion';
import { animationPresets, ageAnimationConfig, appleEasing, appleDuration } from '@/utils/animations';

// Custom hook for managing animations
export const useAnimations = () => {
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = useCallback(async (animationKey: string, options?: any) => {
    setIsAnimating(true);
    try {
      await controls.start(animationKey, options);
    } finally {
      setIsAnimating(false);
    }
  }, [controls]);

  return {
    controls,
    animate,
    isAnimating,
  };
};

// Hook for scroll-triggered animations
export const useScrollAnimation = (threshold: number = 0.1, triggerOnce: boolean = true) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    amount: threshold,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isInView, controls]);

  return {
    ref,
    controls,
    isInView,
  };
};

// Hook for stagger animations
export const useStaggerAnimation = (
  itemCount: number,
  staggerDelay: number = 0.1,
  startDelay: number = 0
) => {
  const controls = useAnimation();
  const [isComplete, setIsComplete] = useState(false);

  const startStagger = useCallback(async () => {
    setIsComplete(false);

    // Create staggered sequence
    const sequence = Array.from({ length: itemCount }, (_, index) => [
      `item-${index}`,
      { opacity: 1, y: 0 },
      { delay: startDelay + (index * staggerDelay) }
    ]);

    await controls.start(sequence as any);
    setIsComplete(true);
  }, [controls, itemCount, staggerDelay, startDelay]);

  const resetStagger = useCallback(() => {
    controls.set({ opacity: 0, y: 20 });
    setIsComplete(false);
  }, [controls]);

  return {
    controls,
    startStagger,
    resetStagger,
    isComplete,
  };
};

// Hook for age-appropriate animations
export const useAgeAnimation = (ageGroup: '3-5' | '6-8' | '9+') => {
  const config = ageAnimationConfig[ageGroup];
  const controls = useAnimation();

  const animateForAge = useCallback(async (animationType: 'hover' | 'tap' | 'focus') => {
    const animationConfig = config[animationType];
    await controls.start(animationConfig);
  }, [controls, config]);

  const resetAnimation = useCallback(() => {
    controls.start({
      scale: 1,
      // Removed rotate: 0 to prevent rotation transitions
      transition: { duration: config.duration }
    });
  }, [controls, config]);

  return {
    controls,
    animateForAge,
    resetAnimation,
    config,
  };
};

// Hook for game-specific animations
export const useGameAnimations = () => {
  const controls = useAnimation();
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

  const playSuccess = useCallback(async () => {
    setCurrentAnimation('success');
    await controls.start(animationPresets.game.successBounce);
    setCurrentAnimation(null);
  }, [controls]);

  const playError = useCallback(async () => {
    setCurrentAnimation('error');
    await controls.start(animationPresets.game.errorShake);
    setCurrentAnimation(null);
  }, [controls]);

  const playCelebration = useCallback(async () => {
    setCurrentAnimation('celebration');
    await controls.start(animationPresets.game.celebrate);
    setCurrentAnimation(null);
  }, [controls]);

  const playHint = useCallback(async () => {
    setCurrentAnimation('hint');
    await controls.start(animationPresets.game.wiggle);
    setCurrentAnimation(null);
  }, [controls]);

  const playGlow = useCallback(() => {
    setCurrentAnimation('glow');
    controls.start(animationPresets.game.glow);
  }, [controls]);

  const stopGlow = useCallback(() => {
    controls.stop();
    controls.set({ boxShadow: 'none' });
    setCurrentAnimation(null);
  }, [controls]);

  return {
    controls,
    currentAnimation,
    playSuccess,
    playError,
    playCelebration,
    playHint,
    playGlow,
    stopGlow,
  };
};

// Hook for page transitions
export const usePageTransition = (direction: 'left' | 'right' | 'up' | 'down' = 'left') => {
  const controls = useAnimation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback(async () => {
    setIsTransitioning(true);
    await controls.start('hidden');
  }, [controls]);

  const completeTransition = useCallback(async () => {
    await controls.start('visible');
    setIsTransitioning(false);
  }, [controls]);

  const getVariants = useCallback(() => {
    switch (direction) {
      case 'left':
        return animationPresets.page.slideLeft;
      case 'right':
        return animationPresets.page.slideRight;
      case 'up':
        return animationPresets.page.slideUp;
      default:
        return animationPresets.page.slideLeft;
    }
  }, [direction]);

  return {
    controls,
    isTransitioning,
    startTransition,
    completeTransition,
    variants: getVariants(),
  };
};

// Hook for card hover animations
export const useCardHover = (ageGroup?: '3-5' | '6-8' | '9+') => {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  const config = ageGroup ? ageAnimationConfig[ageGroup] : null;

  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
    const hoverConfig = config?.hover || animationPresets.card.hover;
    controls.start(hoverConfig);
  }, [controls, config]);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
    controls.start({
      scale: 1,
      y: 0,
      // Removed rotate: 0 to prevent rotation transitions
      transition: { duration: appleDuration.fast, ease: appleEasing.easeOut }
    });
  }, [controls]);

  const handleTap = useCallback(() => {
    const tapConfig = config?.tap || animationPresets.card.tap;
    controls.start(tapConfig);
  }, [controls, config]);

  return {
    controls,
    isHovered,
    handleHoverStart,
    handleHoverEnd,
    handleTap,
  };
};

// Hook for loading animations
export const useLoadingAnimation = (type: 'pulse' | 'spin' | 'bounce' = 'pulse') => {
  const controls = useAnimation();
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);

    switch (type) {
      case 'pulse':
        controls.start(animationPresets.scale.pulse);
        break;
      case 'spin':
        controls.start({
          rotate: [0, 360],
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }
        });
        break;
      case 'bounce':
        controls.start({
          y: [0, -10, 0],
          transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: appleEasing.easeInOut
          }
        });
        break;
    }
  }, [controls, type]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    controls.stop();
    controls.set({
      scale: 1,
      rotate: 0,
      y: 0
    });
  }, [controls]);

  return {
    controls,
    isLoading,
    startLoading,
    stopLoading,
  };
};

// Hook for reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Hook for sequence animations
export const useSequenceAnimation = (steps: Array<{ target: string; animation: any; delay?: number }>) => {
  const controls = useAnimation();
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const playSequence = useCallback(async () => {
    setIsComplete(false);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      const step = steps[i];

      if (step.delay) {
        await new Promise(resolve => setTimeout(resolve, step.delay! * 1000));
      }

      await controls.start(step.target, step.animation);
    }

    setCurrentStep(-1);
    setIsComplete(true);
  }, [controls, steps]);

  const resetSequence = useCallback(() => {
    controls.stop();
    setCurrentStep(-1);
    setIsComplete(false);
  }, [controls]);

  return {
    controls,
    currentStep,
    isComplete,
    playSequence,
    resetSequence,
  };
};

// Hook for intersection observer animations
export const useIntersectionAnimation = (
  threshold: number = 0.1,
  rootMargin: string = '0px'
) => {
  const ref = useRef<HTMLElement>(null);
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          controls.start('visible');
          setHasAnimated(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [controls, threshold, rootMargin, hasAnimated]);

  const resetAnimation = useCallback(() => {
    setHasAnimated(false);
    controls.set('hidden');
  }, [controls]);

  return {
    ref,
    controls,
    hasAnimated,
    resetAnimation,
  };
};

export default {
  useAnimations,
  useScrollAnimation,
  useStaggerAnimation,
  useAgeAnimation,
  useGameAnimations,
  usePageTransition,
  useCardHover,
  useLoadingAnimation,
  useReducedMotion,
  useSequenceAnimation,
  useIntersectionAnimation,
};