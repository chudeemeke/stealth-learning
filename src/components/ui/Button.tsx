import React, { ButtonHTMLAttributes, forwardRef, useCallback } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AgeAwareComponentProps } from '@/types';
import { useCardHover, useGameAnimations } from '@/hooks/useAnimations';
import { createGlassStyle, glassPresets } from '@/utils/glassmorphism';

export interface ButtonProps extends
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>,
  Partial<AgeAwareComponentProps> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'glass';
  size?: 'small' | 'medium' | 'large' | 'auto' | 'sm' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
  hapticEnabled?: boolean;
  asChild?: boolean;
  glass?: boolean;
  glassPreset?: keyof typeof glassPresets;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  ageGroup = '6-8',
  variant = 'primary',
  size = 'auto',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  animated = true,
  hapticEnabled = true,
  children,
  onClick,
  disabled = false,
  className,
  asChild = false,
  glass = false,
  glassPreset = 'standard',
  ...props
}, ref) => {
  const { controls, handleHoverStart, handleHoverEnd, handleTap } = useCardHover(ageGroup);
  const { playSuccess } = useGameAnimations();

  // Normalize size aliases for consistency
  const normalizedSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : size;

  // Apple-inspired age-specific size classes
  const sizeClasses = {
    '3-5': {
      auto: 'min-h-[64px] px-6 py-4 text-2xl font-apple rounded-apple-2xl',
      small: 'min-h-[48px] px-4 py-3 text-xl font-apple rounded-apple-xl',
      medium: 'min-h-[64px] px-6 py-4 text-2xl font-apple rounded-apple-2xl',
      large: 'min-h-[80px] px-8 py-5 text-3xl font-apple rounded-apple-3xl',
    },
    '6-8': {
      auto: 'min-h-[48px] px-4 py-2.5 text-lg font-apple rounded-apple-xl',
      small: 'min-h-[40px] px-3 py-2 text-base font-apple rounded-apple-lg',
      medium: 'min-h-[48px] px-4 py-2.5 text-lg font-apple rounded-apple-xl',
      large: 'min-h-[56px] px-5 py-3 text-xl font-apple rounded-apple-xl',
    },
    '9+': {
      auto: 'min-h-[44px] px-4 py-2 text-base font-apple rounded-apple-lg',
      small: 'min-h-[36px] px-3 py-1.5 text-sm font-apple rounded-apple-md',
      medium: 'min-h-[44px] px-4 py-2 text-base font-apple rounded-apple-lg',
      large: 'min-h-[52px] px-5 py-2.5 text-lg font-apple rounded-apple-lg',
    },
  };

  // Apple-inspired variant classes with system colors
  const variantClasses = {
    '3-5': {
      primary: 'bg-system-yellow text-white hover:bg-system-orange shadow-apple-lg transition-all duration-300',
      secondary: 'bg-system-green text-white hover:bg-system-teal shadow-apple-lg transition-all duration-300',
      success: 'bg-system-green text-white hover:bg-system-teal shadow-apple-md transition-all duration-300',
      danger: 'bg-system-red text-white hover:bg-system-pink shadow-apple-md transition-all duration-300',
      ghost: 'text-system-blue hover:bg-apple-gray-100 transition-all duration-200',
      outline: 'border-2 border-system-blue text-system-blue hover:bg-apple-gray-50 transition-all duration-200',
      glass: '',
    },
    '6-8': {
      primary: 'bg-system-blue text-white hover:bg-system-indigo shadow-apple-md transition-all duration-250',
      secondary: 'bg-system-purple text-white hover:bg-system-pink shadow-apple-md transition-all duration-250',
      success: 'bg-system-green text-white hover:bg-system-teal shadow-apple-sm transition-all duration-250',
      danger: 'bg-system-red text-white hover:bg-system-pink shadow-apple-sm transition-all duration-250',
      ghost: 'text-system-blue hover:bg-apple-gray-100 transition-all duration-200',
      outline: 'border-2 border-system-blue text-system-blue hover:bg-apple-gray-50 transition-all duration-200',
      glass: '',
    },
    '9+': {
      primary: 'bg-system-indigo text-white hover:bg-system-blue shadow-apple-sm transition-all duration-200',
      secondary: 'bg-system-teal text-white hover:bg-system-blue shadow-apple-sm transition-all duration-200',
      success: 'bg-system-green text-white hover:bg-system-teal transition-all duration-200',
      danger: 'bg-system-red text-white hover:bg-system-pink transition-all duration-200',
      ghost: 'text-apple-gray-700 hover:bg-apple-gray-100 transition-all duration-200',
      outline: 'border border-apple-gray-400 text-apple-gray-700 hover:bg-apple-gray-50 transition-all duration-200',
      glass: '',
    },
  };

  // Age-specific interaction feedback
  const interactionFeedback = {
    '3-5': {
      scale: 1.1,
      hapticStrength: 'medium' as const,
      soundVolume: 0.8,
    },
    '6-8': {
      scale: 1.05,
      hapticStrength: 'light' as const,
      soundVolume: 0.6,
    },
    '9+': {
      scale: 1.02,
      hapticStrength: 'light' as const,
      soundVolume: 0.4,
    },
  };

  const feedback = interactionFeedback[ageGroup];
  const currentSizeClass = sizeClasses[ageGroup][normalizedSize as keyof typeof sizeClasses['3-5']];
  const currentVariantClass = variantClasses[ageGroup][variant];

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      if (hapticEnabled && 'vibrate' in navigator) {
        navigator.vibrate(feedback.hapticStrength === 'medium' ? 50 : 25);
      }
      playSuccess();
      onClick?.(e);
    }
  }, [disabled, loading, hapticEnabled, onClick, playSuccess, feedback]);

  // Loading spinner icon
  const loadingIcon = loading ? <LoadingSpinner ageGroup={ageGroup} /> : null;

  // Content arrangement based on icon position
  const content = (
    <>
      {loading && loadingIcon}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  // Touch target size classes for accessibility
  const touchTargetClasses = {
    '3-5': 'touch-target-large',
    '6-8': 'touch-target-medium',
    '9+': 'touch-target-normal',
  };

  // Glass effect styles
  const glassStyles = glass || variant === 'glass'
    ? createGlassStyle(glassPresets[glassPreset])
    : {};

  const normalizedAgeGroup = ageGroup;

  const commonClassName = cn(
    'inline-flex items-center justify-center font-medium relative overflow-hidden',
    'focus:outline-none focus:ring-3 focus:ring-system-blue/30 focus:ring-offset-2',
    'active:scale-95 disabled:active:scale-100',
    currentSizeClass,
    !glass && variant !== 'glass' && currentVariantClass,
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-75 cursor-wait',
    glass || variant === 'glass' && 'backdrop-blur-apple border border-white/20',
    className
  );

  const commonStyle = (glass || variant === 'glass') ? { ...glassStyles, ...props.style } : props.style;

  const {
    // Remove any motion-specific props that might conflict with Framer Motion
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onTransitionEnd,
    // Remove drag-related props that might conflict with Framer Motion
    onDrag,
    onDragEnd,
    onDragStart,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDrop,
    ...restProps
  } = props;

  const buttonProps = {
    ref,
    className: commonClassName,
    style: commonStyle,
    onClick: handleClick,
    disabled: disabled || loading,
    onMouseEnter: animated && !disabled ? handleHoverStart : undefined,
    onMouseLeave: animated && !disabled ? handleHoverEnd : undefined,
    onMouseDown: animated && !disabled ? handleTap : undefined,
    ...restProps
  };

  if (animated && !disabled && !loading) {
    return (
      <motion.button
        {...buttonProps}
        animate={controls}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
          mass: 0.8,
        }}
      >
        {glass || variant === 'glass' && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 pointer-events-none" />
        )}
        {content}
      </motion.button>
    );
  }

  return (
    <button {...buttonProps}>
      {glass || variant === 'glass' && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 pointer-events-none" />
      )}
      {content}
    </button>
  );
});

Button.displayName = 'Button';

// Apple-inspired Loading spinner component
const LoadingSpinner: React.FC<{ ageGroup: AgeAwareComponentProps['ageGroup'] }> = ({ ageGroup }) => {
  const normalizedAgeGroup = ageGroup;

  const spinnerSizes = {
    '3-5': 'w-8 h-8',
    '6-8': 'w-6 h-6',
    '9+': 'w-5 h-5',
  };

  return (
    <motion.div
      className={cn('relative', spinnerSizes[normalizedAgeGroup])}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          strokeLinecap="round"
          className="opacity-20"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="31.416"
          strokeDashoffset="15.708"
          strokeLinecap="round"
          className="opacity-75"
        />
      </svg>
    </motion.div>
  );
};

// Default export for backward compatibility
export default Button;