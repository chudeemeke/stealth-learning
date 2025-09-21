import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { appleEasing, appleDuration, ageAnimationConfig } from '@/utils/animations';

// Micro-interaction types
export type InteractionType = 'hover' | 'tap' | 'focus' | 'success' | 'error' | 'loading';
export type FeedbackType = 'haptic' | 'audio' | 'visual' | 'all';
export type AgeGroup = '3-5' | '6-8' | '9+';

// Micro-interaction configuration
export interface InteractionConfig {
  type: InteractionType;
  feedback?: FeedbackType[];
  intensity?: 'subtle' | 'normal' | 'strong';
  ageGroup?: AgeGroup;
  duration?: number;
  disabled?: boolean;
}

// Ripple effect component
export const RippleEffect: React.FC<{
  trigger: boolean;
  color?: string;
  size?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
}> = ({
  trigger,
  color = 'rgba(255, 255, 255, 0.5)',
  size = 100,
  duration = 600,
  className,
  children,
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x: x - size / 2,
      y: y - size / 2,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, duration);
  }, [size, duration]);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
    >
      {children}

      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: size,
            height: size,
            background: color,
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: duration / 1000,
            ease: appleEasing.easeOut,
          }}
        />
      ))}
    </div>
  );
};

// Magnetic attraction effect
export const MagneticHover: React.FC<{
  children: React.ReactNode;
  strength?: number;
  ageGroup?: AgeGroup;
  className?: string;
}> = ({
  children,
  strength = 0.3,
  ageGroup = '6-8',
  className,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const config = ageAnimationConfig[ageGroup];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{
        type: 'spring',
        stiffness: config.spring.stiffness,
        damping: config.spring.damping,
        mass: config.spring.mass,
      }}
    >
      {children}
    </motion.div>
  );
};

// Tilt effect component
export const TiltEffect: React.FC<{
  children: React.ReactNode;
  maxTilt?: number;
  perspective?: number;
  ageGroup?: AgeGroup;
  glare?: boolean;
  className?: string;
}> = ({
  children,
  maxTilt = 15,
  perspective = 1000,
  ageGroup = '6-8',
  glare = false,
  className,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const config = ageAnimationConfig[ageGroup];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    setTilt({
      x: y * maxTilt,
      y: x * maxTilt,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={cn('relative', className)}
      style={{
        perspective: `${perspective}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{
          type: 'spring',
          stiffness: config.spring.stiffness,
          damping: config.spring.damping,
        }}
        className="relative transform-gpu"
      >
        {children}

        {glare && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
            style={{
              transform: `translate3d(${tilt.y * 2}px, ${tilt.x * 2}px, 0)`,
              opacity: Math.abs(tilt.x) + Math.abs(tilt.y) > 5 ? 0.2 : 0,
            }}
            transition={{ duration: config.duration }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

// Pulse effect component
export const PulseEffect: React.FC<{
  children: React.ReactNode;
  trigger?: boolean;
  intensity?: 'subtle' | 'normal' | 'strong';
  color?: string;
  ageGroup?: AgeGroup;
  className?: string;
}> = ({
  children,
  trigger = false,
  intensity = 'normal',
  color = 'rgba(0, 122, 255, 0.4)',
  ageGroup = '6-8',
  className,
}) => {
  const config = ageAnimationConfig[ageGroup];

  const intensityScale = {
    subtle: 1.02,
    normal: 1.05,
    strong: 1.1,
  };

  const scale = intensityScale[intensity];

  return (
    <motion.div
      className={cn('relative', className)}
      animate={trigger ? {
        scale: [1, scale, 1],
        boxShadow: [
          `0 0 0 0 ${color}`,
          `0 0 0 10px transparent`,
          `0 0 0 0 transparent`,
        ],
      } : {}}
      transition={{
        duration: config.duration * 2,
        ease: appleEasing.easeInOut,
      }}
    >
      {children}
    </motion.div>
  );
};

// Shake effect component
export const ShakeEffect: React.FC<{
  children: React.ReactNode;
  trigger?: boolean;
  intensity?: 'subtle' | 'normal' | 'strong';
  direction?: 'horizontal' | 'vertical' | 'both';
  ageGroup?: AgeGroup;
  className?: string;
}> = ({
  children,
  trigger = false,
  intensity = 'normal',
  direction = 'horizontal',
  ageGroup = '6-8',
  className,
}) => {
  const config = ageAnimationConfig[ageGroup];

  const intensityMap = {
    subtle: 5,
    normal: 10,
    strong: 15,
  };

  const shakeDistance = intensityMap[intensity];

  const getShakeAnimation = () => {
    switch (direction) {
      case 'horizontal':
        return {
          x: [-shakeDistance, shakeDistance, -shakeDistance, shakeDistance, 0],
          y: 0,
        };
      case 'vertical':
        return {
          x: 0,
          y: [-shakeDistance, shakeDistance, -shakeDistance, shakeDistance, 0],
        };
      case 'both':
        return {
          x: [-shakeDistance, shakeDistance, -shakeDistance, shakeDistance, 0],
          y: [-shakeDistance, shakeDistance, -shakeDistance, shakeDistance, 0],
        };
    }
  };

  return (
    <motion.div
      className={className}
      animate={trigger ? getShakeAnimation() : {}}
      transition={{
        duration: config.duration,
        ease: appleEasing.easeOut,
      }}
    >
      {children}
    </motion.div>
  );
};

// Glow effect component
export const GlowEffect: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  color?: string;
  intensity?: 'subtle' | 'normal' | 'strong';
  ageGroup?: AgeGroup;
  className?: string;
}> = ({
  children,
  active = false,
  color = '#007AFF',
  intensity = 'normal',
  ageGroup = '6-8',
  className,
}) => {
  const config = ageAnimationConfig[ageGroup];

  const intensityMap = {
    subtle: { blur: 8, spread: 2, opacity: 0.3 },
    normal: { blur: 15, spread: 5, opacity: 0.5 },
    strong: { blur: 25, spread: 8, opacity: 0.7 },
  };

  const glowSettings = intensityMap[intensity];

  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: active
          ? `0 0 ${glowSettings.blur}px ${glowSettings.spread}px ${color}${Math.round(glowSettings.opacity * 255).toString(16)}`
          : 'none',
      }}
      transition={{
        duration: config.duration,
        ease: appleEasing.easeOut,
      }}
    >
      {children}
    </motion.div>
  );
};

// Morphing button component
export const MorphingButton: React.FC<{
  children: React.ReactNode;
  morphTo?: React.ReactNode;
  trigger?: boolean;
  ageGroup?: AgeGroup;
  className?: string;
  onClick?: () => void;
}> = ({
  children,
  morphTo,
  trigger = false,
  ageGroup = '6-8',
  className,
  onClick,
}) => {
  const config = ageAnimationConfig[ageGroup];

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-apple-lg px-6 py-3',
        'bg-system-blue text-white font-apple font-medium',
        'focus:outline-none focus:ring-3 focus:ring-system-blue/30',
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: config.spring.stiffness,
        damping: config.spring.damping,
      }}
    >
      <motion.div
        animate={{ opacity: trigger ? 0 : 1 }}
        transition={{ duration: config.duration }}
      >
        {children}
      </motion.div>

      {morphTo && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: trigger ? 1 : 0 }}
          transition={{ duration: config.duration }}
        >
          {morphTo}
        </motion.div>
      )}
    </motion.button>
  );
};

// Floating action button with micro-interactions
export const FloatingActionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  ageGroup?: AgeGroup;
  className?: string;
}> = ({
  children,
  onClick,
  position = 'bottom-right',
  ageGroup = '6-8',
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = ageAnimationConfig[ageGroup];

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <motion.button
      className={cn(
        'fixed z-50 rounded-full shadow-apple-lg',
        'bg-system-blue text-white',
        'flex items-center justify-center',
        positionClasses[position],
        className
      )}
      style={{
        width: config.spring.stiffness > 350 ? 56 : 64, // Age-appropriate sizing
        height: config.spring.stiffness > 350 ? 56 : 64,
      }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.1,
        boxShadow: '0 8px 25px rgba(0, 122, 255, 0.3)',
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: isHovered ? -2 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: config.spring.stiffness,
        damping: config.spring.damping,
      }}
    >
      <motion.div
        animate={{ rotate: isHovered ? 180 : 0 }}
        transition={{ duration: config.duration }}
      >
        {children}
      </motion.div>
    </motion.button>
  );
};

// Progress indicator with micro-interactions
export const InteractiveProgress: React.FC<{
  progress: number;
  steps?: number;
  ageGroup?: AgeGroup;
  onStepClick?: (step: number) => void;
  className?: string;
}> = ({
  progress,
  steps = 5,
  ageGroup = '6-8',
  onStepClick,
  className,
}) => {
  const config = ageAnimationConfig[ageGroup];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: steps }, (_, index) => {
        const stepProgress = Math.min(Math.max(progress - index, 0), 1);
        const isCompleted = stepProgress >= 1;
        const isActive = stepProgress > 0 && stepProgress < 1;

        return (
          <motion.button
            key={index}
            className={cn(
              'relative rounded-full transition-colors',
              isCompleted && 'bg-system-green',
              isActive && 'bg-system-blue',
              !isCompleted && !isActive && 'bg-apple-gray-300'
            )}
            style={{
              width: ageGroup === '3-5' ? 16 : ageGroup === '6-8' ? 12 : 8,
              height: ageGroup === '3-5' ? 16 : ageGroup === '6-8' ? 12 : 8,
            }}
            onClick={() => onStepClick?.(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: config.spring.stiffness,
              damping: config.spring.damping,
            }}
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-system-blue rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: stepProgress }}
                transition={{ duration: config.duration }}
              />
            )}

            {isCompleted && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                }}
              >
                <svg
                  width="8"
                  height="6"
                  viewBox="0 0 8 6"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M0.5 3L3 5.5L7.5 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

// Export all micro-interaction components
export default {
  RippleEffect,
  MagneticHover,
  TiltEffect,
  PulseEffect,
  ShakeEffect,
  GlowEffect,
  MorphingButton,
  FloatingActionButton,
  InteractiveProgress,
};