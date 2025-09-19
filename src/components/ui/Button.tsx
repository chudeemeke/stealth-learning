import React, { ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import { AgeAwareComponentProps } from '@/types';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';

export interface ButtonProps extends 
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>,
  AgeAwareComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large' | 'auto';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  ageGroup,
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
  ...props
}) => {
  const playSound = useSound();
  const triggerHaptic = useHaptic();

  // Age-specific size classes
  const sizeClasses = {
    '3-5': {
      auto: 'min-h-[64px] px-6 py-4 text-2xl',
      small: 'min-h-[48px] px-4 py-3 text-xl',
      medium: 'min-h-[64px] px-6 py-4 text-2xl',
      large: 'min-h-[80px] px-8 py-5 text-3xl',
    },
    '6-8': {
      auto: 'min-h-[48px] px-5 py-3 text-xl',
      small: 'min-h-[40px] px-4 py-2 text-lg',
      medium: 'min-h-[48px] px-5 py-3 text-xl',
      large: 'min-h-[56px] px-6 py-4 text-2xl',
    },
    '9': {
      auto: 'min-h-[40px] px-4 py-2 text-lg',
      small: 'min-h-[32px] px-3 py-1 text-base',
      medium: 'min-h-[40px] px-4 py-2 text-lg',
      large: 'min-h-[48px] px-5 py-3 text-xl',
    },
  };

  // Age-specific animation classes
  const animationClasses = {
    '3-5': animated ? 'transform transition-all hover:scale-110 active:scale-95' : '',
    '6-8': animated ? 'transform transition-all hover:scale-105 active:scale-95' : '',
    '9': animated ? 'transform transition-all hover:scale-102 active:scale-98' : '',
  };

  // Age-specific variant classes
  const variantClasses = {
    '3-5': {
      primary: 'bg-young-primary text-white hover:bg-yellow-500 shadow-lg',
      secondary: 'bg-young-secondary text-white hover:bg-blue-500 shadow-lg',
      success: 'bg-young-success text-white hover:bg-green-500 shadow-lg',
      danger: 'bg-young-danger text-white hover:bg-red-500 shadow-lg',
      ghost: 'bg-transparent text-young-primary hover:bg-young-primary/10',
    },
    '6-8': {
      primary: 'bg-mid-primary text-white hover:bg-purple-600 shadow-md',
      secondary: 'bg-mid-secondary text-white hover:bg-red-500 shadow-md',
      success: 'bg-mid-success text-white hover:bg-green-600 shadow-md',
      danger: 'bg-mid-danger text-white hover:bg-red-600 shadow-md',
      ghost: 'bg-transparent text-mid-primary hover:bg-mid-primary/10',
    },
    '9': {
      primary: 'bg-old-primary text-white hover:bg-blue-900 shadow',
      secondary: 'bg-old-secondary text-white hover:bg-red-700 shadow',
      success: 'bg-old-success text-white hover:bg-teal-700 shadow',
      danger: 'bg-old-danger text-white hover:bg-red-800 shadow',
      ghost: 'bg-transparent text-old-primary hover:bg-old-primary/10',
    },
  };

  // Age-specific font classes
  const fontClasses = {
    '3-5': 'font-young font-bold',
    '6-8': 'font-mid font-semibold',
    '9': 'font-old font-medium',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Play sound effect
    if (soundEnabled) {
      playSound(variant === 'success' ? 'success' : 'click');
    }

    // Trigger haptic feedback
    if (hapticEnabled) {
      triggerHaptic('light');
    }

    onClick?.(e);
  };

  const buttonClasses = cn(
    'relative rounded-lg font-bold flex items-center justify-center gap-2',
    'focus:outline-none focus:ring-4 focus:ring-opacity-50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[ageGroup][size],
    animationClasses[ageGroup],
    variantClasses[ageGroup][variant],
    fontClasses[ageGroup],
    fullWidth && 'w-full',
    loading && 'cursor-wait',
    className
  );

  const content = (
    <>
      {loading ? (
        <LoadingSpinner ageGroup={ageGroup} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="inline-flex">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="inline-flex">{icon}</span>
          )}
        </>
      )}
    </>
  );

  if (animated && ageGroup === '3-5') {
    // Extra animations for youngest age group
    return (
      <motion.button
        className={buttonClasses}
        onClick={handleClick}
        disabled={disabled || loading}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={
          loading
            ? {
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, duration: 1.5 },
              }
            : {}
        }
        {...props}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

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