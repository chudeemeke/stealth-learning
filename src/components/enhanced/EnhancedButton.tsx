import React, { useState } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';

interface EnhancedButtonProps extends Omit<MotionProps, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'magic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  effect?: 'glow' | 'bounce' | 'pulse' | 'shimmer' | 'sparkle' | 'none';
  ageGroup?: '3-5' | '6-8' | '9+';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

const VARIANT_STYLES = {
  primary: {
    base: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    hover: 'from-blue-600 to-blue-700',
    shadow: 'shadow-blue-500/25',
    glow: 'shadow-blue-500/50'
  },
  secondary: {
    base: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    hover: 'from-gray-600 to-gray-700',
    shadow: 'shadow-gray-500/25',
    glow: 'shadow-gray-500/50'
  },
  success: {
    base: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    hover: 'from-green-600 to-green-700',
    shadow: 'shadow-green-500/25',
    glow: 'shadow-green-500/50'
  },
  warning: {
    base: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
    hover: 'from-yellow-600 to-orange-600',
    shadow: 'shadow-yellow-500/25',
    glow: 'shadow-yellow-500/50'
  },
  danger: {
    base: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    hover: 'from-red-600 to-red-700',
    shadow: 'shadow-red-500/25',
    glow: 'shadow-red-500/50'
  },
  magic: {
    base: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white',
    hover: 'from-purple-600 via-pink-600 to-purple-700',
    shadow: 'shadow-purple-500/25',
    glow: 'shadow-purple-500/50'
  }
};

const SIZE_CONFIGS = {
  sm: { padding: 'px-3 py-1.5', text: 'text-sm', height: 'h-8', touchTarget: 'min-h-[44px]', rounded: 'rounded-lg' },
  md: { padding: 'px-4 py-2', text: 'text-base', height: 'h-10', touchTarget: 'min-h-[48px]', rounded: 'rounded-lg' },
  lg: { padding: 'px-6 py-3', text: 'text-lg', height: 'h-12', touchTarget: 'min-h-[52px]', rounded: 'rounded-lg' },
  xl: { padding: 'px-8 py-4', text: 'text-xl', height: 'h-14', touchTarget: 'min-h-[56px]', rounded: 'rounded-lg' }
};

const AGE_ADJUSTMENTS = {
  '3-5': {
    size: 'lg',
    padding: 'px-8 py-4',
    text: 'text-2xl',
    rounded: 'rounded-2xl',
    touchTarget: 'min-h-[64px] min-w-[64px]'
  },
  '6-8': {
    size: 'lg',
    padding: 'px-6 py-3',
    text: 'text-xl',
    rounded: 'rounded-xl',
    touchTarget: 'min-h-[52px] min-w-[52px]'
  },
  '9+': {
    size: 'md',
    padding: 'px-4 py-2',
    text: 'text-base',
    rounded: 'rounded-lg',
    touchTarget: 'min-h-[44px] min-w-[44px]'
  }
};

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  effect = 'glow',
  ageGroup,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
  ...motionProps
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();

  const variantStyle = VARIANT_STYLES[variant];
  const sizeConfig = ageGroup ? AGE_ADJUSTMENTS[ageGroup] : SIZE_CONFIGS[size];

  const handleClick = () => {
    if (disabled || loading) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    if (effect === 'sparkle') {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 600);
    }

    playSound('click');
    triggerHaptic('light');
    onClick?.();
  };

  const buttonVariants = {
    idle: {
      scale: 1,
      rotateZ: 0,
      boxShadow: `0 4px 12px ${variantStyle.shadow}`,
    },
    hover: {
      scale: effect === 'bounce' ? 1.05 : 1.02,
      rotateZ: effect === 'bounce' ? [-1, 1, 0] : 0,
      boxShadow: effect === 'glow'
        ? `0 8px 25px ${variantStyle.glow}, 0 0 20px ${variantStyle.glow}`
        : `0 6px 16px ${variantStyle.shadow}`,
      transition: {
        rotateZ: effect === 'bounce' ? {
          duration: 0.2,
          times: [0, 0.5, 1]
        } : { duration: 0.2 }
      }
    },
    pressed: {
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    disabled: {
      scale: 1,
      opacity: 0.6,
      filter: 'grayscale(50%)'
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0%', '-200% 0%'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const getEffectClassName = () => {
    switch (effect) {
      case 'shimmer':
        return 'bg-gradient-to-r bg-[length:200%_100%] animate-shimmer';
      case 'pulse':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden font-semibold transition-all duration-200
        ${sizeConfig.padding} ${sizeConfig.text} ${sizeConfig.rounded}
        ${sizeConfig.touchTarget}
        ${variantStyle.base}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${getEffectClassName()}
        ${className}
      `}
      variants={buttonVariants}
      initial="idle"
      animate={disabled ? 'disabled' : isPressed ? 'pressed' : 'idle'}
      whileHover={!disabled && !loading ? 'hover' : undefined}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {/* Pulse effect overlay */}
      {effect === 'pulse' && !disabled && (
        <motion.div
          className={`absolute inset-0 ${variantStyle.base} rounded-lg opacity-50`}
          variants={pulseVariants}
          animate="animate"
        />
      )}

      {/* Shimmer effect overlay */}
      {effect === 'shimmer' && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmerVariants}
          animate="animate"
        />
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Sparkle effects */}
      {showSparkles && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300 text-sm pointer-events-none"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`
              }}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
                x: (Math.random() - 0.5) * 50,
                y: (Math.random() - 0.5) * 50
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: 'easeOut'
              }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}

      {/* Button content */}
      <div className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>

      {/* Ripple effect on press */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default EnhancedButton;