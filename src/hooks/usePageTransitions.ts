import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnimation } from 'framer-motion';

// Transition direction mapping based on route hierarchy
const routeHierarchy: Record<string, number> = {
  '/': 0,
  '/dashboard': 1,
  '/games': 1,
  '/profile': 1,
  '/settings': 1,
  '/games/math': 2,
  '/games/english': 2,
  '/games/science': 2,
  '/games/play': 3,
  '/profile/achievements': 2,
  '/profile/progress': 2,
  '/settings/account': 2,
  '/settings/preferences': 2,
};

// Page transition configuration
export interface PageTransitionState {
  isTransitioning: boolean;
  direction: 'forward' | 'backward' | 'lateral';
  fromPath: string;
  toPath: string;
  transitionType: 'push' | 'pop' | 'replace';
}

// Custom hook for managing page transitions
export const usePageTransitions = (ageGroup: '3-5' | '6-8' | '9+' = '6-8') => {
  const location = useLocation();
  const navigate = useNavigate();
  const controls = useAnimation();

  const [transitionState, setTransitionState] = useState<PageTransitionState>({
    isTransitioning: false,
    direction: 'forward',
    fromPath: '',
    toPath: '',
    transitionType: 'push',
  });

  const [previousPath, setPreviousPath] = useState<string>('');
  const [navigationStack, setNavigationStack] = useState<string[]>([location.pathname]);

  // Determine transition direction based on route hierarchy
  const getTransitionDirection = useCallback((fromPath: string, toPath: string): 'forward' | 'backward' | 'lateral' => {
    const fromLevel = routeHierarchy[fromPath] ?? 0;
    const toLevel = routeHierarchy[toPath] ?? 0;

    if (toLevel > fromLevel) return 'forward';
    if (toLevel < fromLevel) return 'backward';
    return 'lateral';
  }, []);

  // Navigate with transition
  const navigateWithTransition = useCallback(
    async (
      to: string,
      options?: {
        replace?: boolean;
        state?: any;
        preventTransition?: boolean;
      }
    ) => {
      const { replace = false, state, preventTransition = false } = options || {};

      if (preventTransition) {
        navigate(to, { replace, state });
        return;
      }

      const direction = getTransitionDirection(location.pathname, to);
      const transitionType = replace ? 'replace' : 'push';

      setTransitionState({
        isTransitioning: true,
        direction,
        fromPath: location.pathname,
        toPath: to,
        transitionType,
      });

      // Update navigation stack
      if (!replace) {
        setNavigationStack(prev => [...prev, to]);
      }

      // Start exit animation
      await controls.start('exit');

      // Navigate to new route
      navigate(to, { replace, state });

      // Start enter animation after navigation
      setTimeout(() => {
        controls.start('enter');
        setTransitionState(prev => ({ ...prev, isTransitioning: false }));
      }, 50);
    },
    [location.pathname, navigate, controls, getTransitionDirection]
  );

  // Go back with transition
  const goBackWithTransition = useCallback(async () => {
    if (navigationStack.length <= 1) return;

    const newStack = navigationStack.slice(0, -1);
    const targetPath = newStack[newStack.length - 1];

    setTransitionState({
      isTransitioning: true,
      direction: 'backward',
      fromPath: location.pathname,
      toPath: targetPath,
      transitionType: 'pop',
    });

    setNavigationStack(newStack);

    // Start exit animation
    await controls.start('exit');

    // Navigate back
    navigate(-1);

    // Start enter animation
    setTimeout(() => {
      controls.start('enter');
      setTransitionState(prev => ({ ...prev, isTransitioning: false }));
    }, 50);
  }, [navigationStack, location.pathname, navigate, controls]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const direction = getTransitionDirection(previousPath, location.pathname);

      setTransitionState({
        isTransitioning: true,
        direction,
        fromPath: previousPath,
        toPath: location.pathname,
        transitionType: 'pop',
      });

      controls.start('enter');

      setTimeout(() => {
        setTransitionState(prev => ({ ...prev, isTransitioning: false }));
      }, 300);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [previousPath, location.pathname, controls, getTransitionDirection]);

  // Update previous path
  useEffect(() => {
    setPreviousPath(location.pathname);
  }, [location.pathname]);

  // Age-specific transition configurations
  const getTransitionConfig = useCallback(() => {
    const baseConfig = {
      '3-5': {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        scale: { enter: 0.9, exit: 1.1 },
      },
      '6-8': {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        scale: { enter: 0.95, exit: 1.05 },
      },
      '9+': {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
        scale: { enter: 0.98, exit: 1.02 },
      },
    };

    return baseConfig[ageGroup];
  }, [ageGroup]);

  // Preload routes for smoother transitions
  const preloadRoute = useCallback((path: string) => {
    // Create a link element to trigger route preloading
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);

    // Remove after a short delay
    setTimeout(() => {
      document.head.removeChild(link);
    }, 1000);
  }, []);

  // Check if transition should be skipped for certain routes
  const shouldSkipTransition = useCallback((fromPath: string, toPath: string): boolean => {
    // Skip transitions for modal routes or API routes
    const skipPatterns = ['/modal/', '/api/', '/auth/'];

    return skipPatterns.some(pattern =>
      toPath.includes(pattern) || fromPath.includes(pattern)
    );
  }, []);

  // Get transition variants based on direction and age group
  const getTransitionVariants = useCallback(() => {
    const config = getTransitionConfig();
    const { direction } = transitionState;

    const baseVariants = {
      enter: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        transition: {
          duration: config.duration,
          ease: config.ease,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          duration: config.duration * 0.8,
          ease: config.ease,
        },
      },
    };

    switch (direction) {
      case 'forward':
        return {
          ...baseVariants,
          initial: { opacity: 0, x: 50, scale: config.scale.enter },
          exit: { ...baseVariants.exit, x: -50, scale: config.scale.exit },
        };

      case 'backward':
        return {
          ...baseVariants,
          initial: { opacity: 0, x: -50, scale: config.scale.enter },
          exit: { ...baseVariants.exit, x: 50, scale: config.scale.exit },
        };

      case 'lateral':
        return {
          ...baseVariants,
          initial: { opacity: 0, y: 20, scale: config.scale.enter },
          exit: { ...baseVariants.exit, y: -20, scale: config.scale.exit },
        };

      default:
        return {
          ...baseVariants,
          initial: { opacity: 0, scale: config.scale.enter },
          exit: { ...baseVariants.exit, scale: config.scale.exit },
        };
    }
  }, [transitionState, getTransitionConfig]);

  return {
    // State
    transitionState,
    isTransitioning: transitionState.isTransitioning,
    currentPath: location.pathname,
    previousPath,
    navigationStack,

    // Methods
    navigateWithTransition,
    goBackWithTransition,
    preloadRoute,
    shouldSkipTransition,

    // Animation
    controls,
    transitionVariants: getTransitionVariants(),
    transitionConfig: getTransitionConfig(),

    // Utilities
    canGoBack: navigationStack.length > 1,
    getTransitionDirection,
  };
};

// Hook for route-specific animations
export const useRouteAnimation = (routePath: string, ageGroup: '3-5' | '6-8' | '9+' = '6-8') => {
  const location = useLocation();
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const isCurrentRoute = location.pathname === routePath;

  useEffect(() => {
    if (isCurrentRoute && !hasAnimated) {
      controls.start('visible');
      setHasAnimated(true);
    } else if (!isCurrentRoute) {
      setHasAnimated(false);
    }
  }, [isCurrentRoute, hasAnimated, controls]);

  const getRouteVariants = useCallback(() => {
    const configs = {
      '3-5': { duration: 0.6, stagger: 0.15 },
      '6-8': { duration: 0.4, stagger: 0.1 },
      '9+': { duration: 0.3, stagger: 0.05 },
    };

    const config = configs[ageGroup];

    return {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: config.duration,
          staggerChildren: config.stagger,
          delayChildren: 0.1,
        },
      },
    };
  }, [ageGroup]);

  return {
    controls,
    variants: getRouteVariants(),
    isCurrentRoute,
    hasAnimated,
  };
};

// Hook for scroll-based transitions
export const useScrollTransitions = (threshold: number = 0.1) => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrollingUp(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const getScrollProgress = useCallback((elementRef: React.RefObject<HTMLElement>) => {
    if (!elementRef.current) return 0;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const elementTop = rect.top;
    const elementHeight = rect.height;

    // Calculate progress based on element visibility
    if (elementTop > windowHeight) return 0;
    if (elementTop + elementHeight < 0) return 1;

    const visibleHeight = Math.min(windowHeight - elementTop, elementHeight);
    return Math.max(0, visibleHeight / elementHeight);
  }, []);

  return {
    scrollY,
    isScrollingUp,
    scrollDirection: isScrollingUp ? 'up' : 'down',
    getScrollProgress,
  };
};

export default usePageTransitions;