import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { appleEasing, appleDuration } from '@/utils/animations';

// Page transition types
export type TransitionDirection = 'left' | 'right' | 'up' | 'down' | 'fade' | 'scale' | 'slide-fade';
export type TransitionDuration = 'fast' | 'normal' | 'slow';
export type AgeGroup = '3-5' | '6-8' | '9+';

// Page transition configuration
export interface PageTransitionConfig {
  direction?: TransitionDirection;
  duration?: TransitionDuration;
  ageGroup?: AgeGroup;
  exitFirst?: boolean;
  overlay?: boolean;
  preserveScrollPosition?: boolean;
  className?: string;
}

// Age-specific transition settings
const ageTransitionConfig = {
  '3-5': {
    duration: appleDuration.slower,
    easing: appleEasing.gentle,
    scale: { enter: 0.9, exit: 1.1 },
    stagger: 0.15,
  },
  '6-8': {
    duration: appleDuration.normal,
    easing: appleEasing.easeOut,
    scale: { enter: 0.95, exit: 1.05 },
    stagger: 0.1,
  },
  '9+': {
    duration: appleDuration.fast,
    easing: appleEasing.sharp,
    scale: { enter: 0.98, exit: 1.02 },
    stagger: 0.05,
  },
};

// Duration mapping
const durationMap = {
  fast: appleDuration.fast,
  normal: appleDuration.normal,
  slow: appleDuration.slow,
};

// Page transition variants
const createTransitionVariants = (
  direction: TransitionDirection,
  duration: number,
  easing: readonly number[] | number[],
  ageGroup: AgeGroup
): Variants => {
  const config = ageTransitionConfig[ageGroup];

  const baseTransition = {
    duration,
    ease: easing,
  };

  switch (direction) {
    case 'left':
      return {
        initial: { x: '100%', opacity: 0 },
        enter: {
          x: 0,
          opacity: 1,
          transition: baseTransition,
        },
        exit: {
          x: '-100%',
          opacity: 0,
          transition: baseTransition,
        },
      };

    case 'right':
      return {
        initial: { x: '-100%', opacity: 0 },
        enter: {
          x: 0,
          opacity: 1,
          transition: baseTransition,
        },
        exit: {
          x: '100%',
          opacity: 0,
          transition: baseTransition,
        },
      };

    case 'up':
      return {
        initial: { y: '100%', opacity: 0 },
        enter: {
          y: 0,
          opacity: 1,
          transition: baseTransition,
        },
        exit: {
          y: '-100%',
          opacity: 0,
          transition: baseTransition,
        },
      };

    case 'down':
      return {
        initial: { y: '-100%', opacity: 0 },
        enter: {
          y: 0,
          opacity: 1,
          transition: baseTransition,
        },
        exit: {
          y: '100%',
          opacity: 0,
          transition: baseTransition,
        },
      };

    case 'scale':
      return {
        initial: {
          scale: config.scale.enter,
          opacity: 0,
        },
        enter: {
          scale: 1,
          opacity: 1,
          transition: {
            ...baseTransition,
            type: 'spring',
            stiffness: 300,
            damping: 30,
          },
        },
        exit: {
          scale: config.scale.exit,
          opacity: 0,
          transition: baseTransition,
        },
      };

    case 'slide-fade':
      return {
        initial: {
          x: 30,
          opacity: 0,
          scale: config.scale.enter,
        },
        enter: {
          x: 0,
          opacity: 1,
          scale: 1,
          transition: {
            ...baseTransition,
            type: 'spring',
            stiffness: 400,
            damping: 25,
          },
        },
        exit: {
          x: -30,
          opacity: 0,
          scale: config.scale.exit,
          transition: baseTransition,
        },
      };

    case 'fade':
    default:
      return {
        initial: { opacity: 0 },
        enter: {
          opacity: 1,
          transition: baseTransition,
        },
        exit: {
          opacity: 0,
          transition: baseTransition,
        },
      };
  }
};

// Page transition wrapper component
export const PageTransition: React.FC<{
  children: React.ReactNode;
  config?: PageTransitionConfig;
}> = ({
  children,
  config = {},
}) => {
  const location = useLocation();
  const [isExiting, setIsExiting] = useState(false);

  const {
    direction = 'slide-fade',
    duration = 'normal',
    ageGroup = '6-8',
    exitFirst = false,
    overlay = false,
    preserveScrollPosition = false,
    className,
  } = config;

  const ageConfig = ageTransitionConfig[ageGroup];
  const transitionDuration = durationMap[duration];
  const variants = createTransitionVariants(
    direction,
    transitionDuration,
    ageConfig.easing as number[],
    ageGroup
  );

  // Scroll position management
  useEffect(() => {
    if (!preserveScrollPosition) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, preserveScrollPosition]);

  const handleExitComplete = () => {
    setIsExiting(false);
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Overlay for smoother transitions */}
      {overlay && (
        <AnimatePresence>
          {isExiting && (
            <motion.div
              className="fixed inset-0 bg-black/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: transitionDuration / 2 }}
            />
          )}
        </AnimatePresence>
      )}

      <AnimatePresence
        mode={exitFirst ? 'wait' : 'sync'}
        onExitComplete={handleExitComplete}
      >
        <motion.div
          key={location.pathname}
          variants={variants}
          initial="initial"
          animate="enter"
          exit="exit"
          onAnimationStart={(definition) => {
            if (typeof definition === 'string' && definition === 'exit') {
              setIsExiting(true);
            }
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Staggered children transition component
export const StaggeredTransition: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  ageGroup?: AgeGroup;
  className?: string;
}> = ({
  children,
  staggerDelay,
  ageGroup = '6-8',
  className,
}) => {
  const config = ageTransitionConfig[ageGroup];
  const delay = staggerDelay || config.stagger;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: config.duration,
        ease: config.easing,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Route-based transition component
export const RouteTransition: React.FC<{
  children: React.ReactNode;
  routes: Record<string, TransitionDirection>;
  ageGroup?: AgeGroup;
  className?: string;
}> = ({
  children,
  routes,
  ageGroup = '6-8',
  className,
}) => {
  const location = useLocation();
  const direction = routes[location.pathname] || 'fade';

  return (
    <PageTransition
      config={{
        direction,
        ageGroup,
        duration: 'normal',
        className,
      }}
    >
      {children}
    </PageTransition>
  );
};

// Modal transition component
export const ModalTransition: React.FC<{
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  ageGroup?: AgeGroup;
  backdrop?: boolean;
  className?: string;
}> = ({
  isOpen,
  onClose,
  children,
  ageGroup = '6-8',
  backdrop = true,
  className,
}) => {
  const config = ageTransitionConfig[ageGroup];

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: config.duration },
    },
  };

  const modalVariants: Variants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      y: 50,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      },
    },
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          {backdrop && (
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleBackdropClick}
            />
          )}

          {/* Modal content */}
          <motion.div
            className={cn('relative z-10', className)}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Drawer transition component
export const DrawerTransition: React.FC<{
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  ageGroup?: AgeGroup;
  overlay?: boolean;
  className?: string;
}> = ({
  isOpen,
  onClose,
  children,
  side = 'right',
  ageGroup = '6-8',
  overlay = true,
  className,
}) => {
  const config = ageTransitionConfig[ageGroup];

  const getDrawerVariants = (): Variants => {
    const baseTransition = {
      type: 'spring' as const,
      stiffness: 400,
      damping: 30,
      mass: 0.8,
    };

    switch (side) {
      case 'left':
        return {
          hidden: { x: '-100%' },
          visible: { x: 0, transition: baseTransition },
        };
      case 'right':
        return {
          hidden: { x: '100%' },
          visible: { x: 0, transition: baseTransition },
        };
      case 'top':
        return {
          hidden: { y: '-100%' },
          visible: { y: 0, transition: baseTransition },
        };
      case 'bottom':
        return {
          hidden: { y: '100%' },
          visible: { y: 0, transition: baseTransition },
        };
    }
  };

  const drawerVariants = getDrawerVariants();

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: config.duration },
    },
  };

  const handleOverlayClick = () => {
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          {overlay && (
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleOverlayClick}
            />
          )}

          {/* Drawer content */}
          <motion.div
            className={cn(
              'absolute bg-white shadow-apple-xl',
              side === 'left' && 'left-0 top-0 h-full',
              side === 'right' && 'right-0 top-0 h-full',
              side === 'top' && 'top-0 left-0 w-full',
              side === 'bottom' && 'bottom-0 left-0 w-full',
              className
            )}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Loading transition component
export const LoadingTransition: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  loader?: React.ReactNode;
  ageGroup?: AgeGroup;
  className?: string;
}> = ({
  isLoading,
  children,
  loader,
  ageGroup = '6-8',
  className,
}) => {
  const config = ageTransitionConfig[ageGroup];

  const contentVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: config.duration,
        ease: config.easing,
      },
    },
  };

  const loaderVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: config.duration },
    },
  };

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            variants={loaderVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex items-center justify-center p-8"
          >
            {loader || (
              <div className="animate-spin h-8 w-8 border-4 border-system-blue border-t-transparent rounded-full" />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export default transition configuration
export const defaultTransitionConfig: PageTransitionConfig = {
  direction: 'slide-fade',
  duration: 'normal',
  ageGroup: '6-8',
  exitFirst: false,
  overlay: false,
  preserveScrollPosition: false,
};

export default PageTransition;