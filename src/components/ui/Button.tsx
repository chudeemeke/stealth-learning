import React, { ButtonHTMLAttributes, forwardRef, useCallback } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import { AgeAwareComponentProps } from '@/types';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';

export interface ButtonProps extends
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>,
  Partial<AgeAwareComponentProps> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large' | 'auto' | 'sm' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  asChild?: boolean;
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
  soundEnabled = true,
  hapticEnabled = true,
  children,
  onClick,
  disabled = false,
  className,
  asChild = false,
  ...props
}, ref) => {
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();

  // Normalize size aliases for consistency
  const normalizedSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : size;

  // Age-specific size classes - comprehensive mapping
  const sizeClasses = {
    '3-5': {
      auto: 'min-h-[64px] px-6 py-4 text-2xl',
      small: 'min-h-[48px] px-4 py-3 text-xl',
      medium: 'min-h-[64px] px-6 py-4 text-2xl',
      large: 'min-h-[80px] px-8 py-5 text-3xl',
    },
    '6-8': {
      auto: 'min-h-[48px] px-4 py-2 text-lg',
      small: 'min-h-[40px] px-3 py-1.5 text-base',
      medium: 'min-h-[48px] px-4 py-2 text-lg',
      large: 'min-h-[56px] px-5 py-3 text-xl',
    },
    '9': {
      auto: 'min-h-[40px] px-3 py-1.5 text-base',
      small: 'min-h-[32px] px-2 py-1 text-sm',
      medium: 'min-h-[40px] px-3 py-1.5 text-base',
      large: 'min-h-[48px] px-4 py-2 text-lg',
    },
  };

  // Age-specific variant classes with comprehensive color system
  const variantClasses = {
    '3-5': {
      primary: 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg',
      secondary: 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg',
      success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg',
      ghost: 'text-blue-500 hover:bg-blue-100',
      outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
    },
    '6-8': {
      primary: 'bg-blue-500 text-white hover:bg-blue-600 shadow-md',
      secondary: 'bg-purple-500 text-white hover:bg-purple-600 shadow-md',
      success: 'bg-green-500 text-white hover:bg-green-600 shadow-md',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md',
      ghost: 'text-blue-400 hover:bg-blue-100',
      outline: 'border-2 border-blue-400 text-blue-400 hover:bg-blue-50',
    },
    '9': {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
      success: 'bg-green-500 text-white hover:bg-green-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      ghost: 'text-gray-600 hover:bg-gray-100',
      outline: 'border-2 border-gray-400 text-gray-600 hover:bg-gray-50',
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
    '9': {
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
      if (soundEnabled) {
        playSound('click', feedback.soundVolume);
      }
      if (hapticEnabled) {
        triggerHaptic(feedback.hapticStrength);
      }
      onClick?.(e);
    }
  }, [disabled, loading, soundEnabled, hapticEnabled, onClick, playSound, triggerHaptic, feedback]);

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
    '9': 'touch-target-normal',
  };

  const buttonProps = {
    ref,
    className: cn(
      'inline-flex items-center justify-center font-semibold transition-all rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      currentSizeClass,
      currentVariantClass,
      fullWidth && 'w-full',
      disabled && 'opacity-50 cursor-not-allowed',
      loading && 'opacity-75 cursor-wait',
      animated && 'transform transition-transform',
      touchTargetClasses[ageGroup],
      className
    ),
    onClick: handleClick,
    disabled: disabled || loading,
    ...props
  };

  if (animated && !disabled && !loading) {
    return (
      <motion.button
        ref={ref}
        className={buttonProps.className}
        onClick={buttonProps.onClick}
        disabled={buttonProps.disabled}
        whileHover={{ scale: feedback.scale }}
        whileTap={{ scale: 0.95 }}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <button {...buttonProps}>
      {content}
    </button>
  );
});

Button.displayName = 'Button';

// Loading spinner component
const LoadingSpinner: React.FC<{ ageGroup: AgeAwareComponentProps['ageGroup'] }> = ({ ageGroup }) => {
  const spinnerSizes = {
    '3-5': 'w-8 h-8',
    '6-8': 'w-6 h-6',
    '9': 'w-5 h-5',
  };

  return (
    <svg
      className={cn('animate-spin', spinnerSizes[ageGroup])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Default export for backward compatibility
export default Button;