import React, { ButtonHTMLAttributes, forwardRef, useCallback } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AgeAwareComponentProps } from '@/types';
import { useCardHover, useGameAnimations } from '@/hooks/useAnimations';
import { createGlassStyle, glassPresets } from '@/utils/glassmorphism';
import DesignSystem from '@/styles/design-system';

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

  // Airbnb + Duolingo age-specific size classes
  const sizeClasses = {
    '3-5': {
      auto: 'min-h-[64px] px-6 py-4 text-2xl font-bold rounded-2xl',
      small: 'min-h-[48px] px-4 py-3 text-xl font-semibold rounded-xl',
      medium: 'min-h-[64px] px-6 py-4 text-2xl font-bold rounded-2xl',
      large: 'min-h-[80px] px-8 py-5 text-3xl font-black rounded-3xl',
    },
    '6-8': {
      auto: 'min-h-[48px] px-4 py-2.5 text-lg font-semibold rounded-xl',
      small: 'min-h-[40px] px-3 py-2 text-base font-medium rounded-lg',
      medium: 'min-h-[48px] px-4 py-2.5 text-lg font-semibold rounded-xl',
      large: 'min-h-[56px] px-5 py-3 text-xl font-bold rounded-xl',
    },
    '9+': {
      auto: 'min-h-[44px] px-4 py-2 text-base font-medium rounded-lg',
      small: 'min-h-[36px] px-3 py-1.5 text-sm font-medium rounded-md',
      medium: 'min-h-[44px] px-4 py-2 text-base font-medium rounded-lg',
      large: 'min-h-[52px] px-5 py-2.5 text-lg font-semibold rounded-lg',
    },
  };

  // Airbnb + Duolingo variant classes with design system colors
  const getVariantStyle = (variant: string, age: string) => {
    const baseTransition = `transition-all duration-${age === '3-5' ? '300' : age === '6-8' ? '250' : '200'}`;

    switch (variant) {
      case 'primary':
        return `bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg ${baseTransition}`;
      case 'secondary':
        return `bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-lg ${baseTransition}`;
      case 'success':
        return `bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow-md ${baseTransition}`;
      case 'danger':
        return `bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-md ${baseTransition}`;
      case 'ghost':
        return `text-gray-700 hover:bg-gray-100 ${baseTransition}`;
      case 'outline':
        return `border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 ${baseTransition}`;
      default:
        return '';
    }
  };

  const variantClasses = {
    '3-5': {
      primary: getVariantStyle('primary', '3-5'),
      secondary: getVariantStyle('secondary', '3-5'),
      success: getVariantStyle('success', '3-5'),
      danger: getVariantStyle('danger', '3-5'),
      ghost: getVariantStyle('ghost', '3-5'),
      outline: getVariantStyle('outline', '3-5'),
      glass: '',
    },
    '6-8': {
      primary: getVariantStyle('primary', '6-8'),
      secondary: getVariantStyle('secondary', '6-8'),
      success: getVariantStyle('success', '6-8'),
      danger: getVariantStyle('danger', '6-8'),
      ghost: getVariantStyle('ghost', '6-8'),
      outline: getVariantStyle('outline', '6-8'),
      glass: '',
    },
    '9+': {
      primary: getVariantStyle('primary', '9+'),
      secondary: getVariantStyle('secondary', '9+'),
      success: getVariantStyle('success', '9+'),
      danger: getVariantStyle('danger', '9+'),
      ghost: getVariantStyle('ghost', '9+'),
      outline: getVariantStyle('outline', '9+'),
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
    'inline-flex items-center justify-center relative overflow-hidden',
    `font-[${DesignSystem.typography.fonts.heading}]`,
    'focus:outline-none focus:ring-3 focus:ring-green-400/30 focus:ring-offset-2',
    'active:scale-95 disabled:active:scale-100',
    currentSizeClass,
    !glass && variant !== 'glass' && currentVariantClass,
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-75 cursor-wait',
    glass || variant === 'glass' && 'backdrop-blur-md border border-white/20',
    'transform-gpu', // Enable GPU acceleration for smooth animations
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
        whileHover={{ scale: feedback.scale, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          mass: 1,
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
    <div
      className={cn('relative animate-spin', spinnerSizes[normalizedAgeGroup])}
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
    </div>
  );
};

// Default export for backward compatibility
export default Button;