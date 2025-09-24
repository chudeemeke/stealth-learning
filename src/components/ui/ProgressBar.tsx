import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AgeAwareComponentProps } from '@/types';
import { createGlassStyle, glassPresets } from '@/utils/glassmorphism';

export interface ProgressBarProps extends Partial<AgeAwareComponentProps> {
  current?: number;
  total?: number;
  progress?: number; // Alternative to current/total - direct percentage
  value?: number; // Alias for current
  max?: number; // Alias for total
  label?: string;
  showPercentage?: boolean;
  showStars?: boolean;
  animated?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  variant?: 'linear' | 'circular' | 'stepped' | 'glass';
  glass?: boolean;
  glassPreset?: keyof typeof glassPresets;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  ageGroup = '6-8',
  current,
  total,
  value,
  max,
  progress,
  label,
  showPercentage = false,
  showStars = false,
  animated = true,
  color = 'primary',
  size = 'medium',
  variant = 'linear',
  glass = false,
  glassPreset = 'subtle',
  className,
}) => {
  // Normalize aliases and use progress prop if provided
  const finalCurrent = current ?? value ?? 0;
  const finalTotal = total ?? max ?? 100;
  const percentage = progress !== undefined ? progress : Math.min(100, Math.max(0, (finalCurrent / finalTotal) * 100));
  const [displayPercentage, setDisplayPercentage] = useState(animated ? 0 : percentage);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayPercentage(percentage);
    }
  }, [percentage, animated]);

  const normalizedAgeGroup = ageGroup;

  // Apple-inspired age-specific configurations
  const sizeClasses = {
    '3-5': {
      small: 'h-6 rounded-apple-lg',
      medium: 'h-8 rounded-apple-xl',
      large: 'h-12 rounded-apple-2xl',
    },
    '6-8': {
      small: 'h-4 rounded-apple-md',
      medium: 'h-6 rounded-apple-lg',
      large: 'h-8 rounded-apple-xl',
    },
    '9+': {
      small: 'h-3 rounded-apple-sm',
      medium: 'h-4 rounded-apple-md',
      large: 'h-6 rounded-apple-lg',
    },
  };

  // Apple system color gradients
  const colorClasses = {
    '3-5': {
      primary: 'from-system-yellow to-system-orange',
      secondary: 'from-system-green to-system-teal',
      success: 'from-system-green to-system-teal',
      warning: 'from-system-orange to-system-yellow',
      danger: 'from-system-red to-system-pink',
    },
    '6-8': {
      primary: 'from-system-blue to-system-indigo',
      secondary: 'from-system-purple to-system-pink',
      success: 'from-system-green to-system-teal',
      warning: 'from-system-orange to-system-yellow',
      danger: 'from-system-red to-system-pink',
    },
    '9+': {
      primary: 'from-system-indigo to-system-blue',
      secondary: 'from-system-teal to-system-blue',
      success: 'from-system-green to-system-teal',
      warning: 'from-system-orange to-system-yellow',
      danger: 'from-system-red to-system-pink',
    },
  };

  if (variant === 'stepped' && ageGroup === '3-5') {
    return <SteppedProgress current={finalCurrent} total={finalTotal} animated={animated} />;
  }

  if (variant === 'circular') {
    return (
      <CircularProgress
        percentage={displayPercentage}
        ageGroup={normalizedAgeGroup}
        color={color}
        size={size}
        label={label}
        showPercentage={showPercentage}
        glass={glass}
        glassPreset={glassPreset}
      />
    );
  }

  if (variant === 'glass' || glass) {
    return (
      <GlassProgress
        percentage={displayPercentage}
        ageGroup={normalizedAgeGroup}
        color={color}
        size={size}
        label={label}
        showPercentage={showPercentage}
        glassPreset={glassPreset}
        animated={animated}
        className={className}
      />
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <span className={cn(
            'font-medium',
            ageGroup === '3-5' && 'text-xl font-young',
            ageGroup === '6-8' && 'text-lg font-mid',
            ageGroup === '9+' && 'text-base font-old'
          )}>
            {label}
          </span>
          {showPercentage && ageGroup !== '3-5' && (
            <span className="text-sm font-medium">
              {Math.round(displayPercentage)}%
            </span>
          )}
        </div>
      )}

      <div className={cn(
        'relative w-full bg-apple-gray-200 overflow-hidden shadow-apple-xs',
        sizeClasses[normalizedAgeGroup][size]
      )}>
        <motion.div
          className={cn(
            'h-full bg-gradient-to-r relative overflow-hidden',
            sizeClasses[normalizedAgeGroup][size].replace('h-', ''),
            colorClasses[normalizedAgeGroup][color]
          )}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{
            duration: animated ? 1.2 : 0,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {ageGroup === '3-5' && (
            <motion.div
              className="h-full flex items-center justify-end pr-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {displayPercentage >= 20 && <StarIcon filled />}
            </motion.div>
          )}
        </motion.div>

        {/* Animated shimmer effect for young age group */}
        {ageGroup === '3-5' && animated && displayPercentage > 0 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        )}
      </div>

      {/* Stars visualization for youngest age group */}
      {showStars && ageGroup === '3-5' && (
        <div className="flex gap-2 mt-8 mb-6">
          {Array.from({ length: finalTotal }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: i < finalCurrent ? 1 : 0.8,
                rotate: 0,
              }}
              transition={{
                delay: animated ? i * 0.1 : 0,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <StarIcon
                filled={i < finalCurrent}
                className={cn(
                  'w-8 h-8 transition-colors',
                  i < finalCurrent ? 'text-yellow-400' : 'text-gray-300'
                )}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Stepped progress for youngest children
const SteppedProgress: React.FC<{
  current: number;
  total: number;
  animated?: boolean;
}> = ({ current, total, animated }) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className={cn(
            'flex-1 h-12 rounded-lg',
            i < current
              ? 'bg-gradient-to-r from-green-400 to-green-500'
              : 'bg-gray-200'
          )}
          initial={animated ? { scale: 0.8, opacity: 0 } : {}}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: animated ? i * 0.1 : 0,
            type: 'spring',
            stiffness: 300,
          }}
        >
          {i < current && (
            <motion.div
              className="w-full h-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: animated ? i * 0.1 + 0.2 : 0 }}
            >
              <CheckIcon className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Glass progress variant
const GlassProgress: React.FC<{
  percentage: number;
  ageGroup: AgeAwareComponentProps['ageGroup'];
  color: string;
  size: string;
  label?: string;
  showPercentage?: boolean;
  glassPreset: keyof typeof glassPresets;
  animated?: boolean;
  className?: string;
}> = ({ percentage, ageGroup, color, size, label, showPercentage, glassPreset, animated, className }) => {
  const glassStyles = createGlassStyle(glassPresets[glassPreset]);

  const sizeClasses = {
    small: 'h-4 rounded-apple-md',
    medium: 'h-6 rounded-apple-lg',
    large: 'h-8 rounded-apple-xl',
  };

  const colorClasses = {
    primary: 'from-system-blue to-system-indigo',
    secondary: 'from-system-purple to-system-pink',
    success: 'from-system-green to-system-teal',
    warning: 'from-system-orange to-system-yellow',
    danger: 'from-system-red to-system-pink',
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <span className="font-apple font-medium text-white">
            {label}
          </span>
          {showPercentage && (
            <span className="font-apple text-sm font-medium text-white/80">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'relative w-full overflow-hidden backdrop-blur-apple',
          sizeClasses[size as keyof typeof sizeClasses]
        )}
        style={glassStyles}
      >
        <motion.div
          className={cn(
            'h-full bg-gradient-to-r relative overflow-hidden',
            colorClasses[color as keyof typeof colorClasses]
          )}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </motion.div>

        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 pointer-events-none" />
      </div>
    </div>
  );
};

// Circular progress variant
const CircularProgress: React.FC<{
  percentage: number;
  ageGroup: AgeAwareComponentProps['ageGroup'];
  color: string;
  size: string;
  label?: string;
  showPercentage?: boolean;
  glass?: boolean;
  glassPreset?: keyof typeof glassPresets;
}> = ({ percentage, ageGroup, color, size, label, showPercentage, glass, glassPreset = 'standard' }) => {
  const sizeMap = {
    small: { width: 60, strokeWidth: 4 },
    medium: { width: 80, strokeWidth: 6 },
    large: { width: 100, strokeWidth: 8 },
  };

  const { width, strokeWidth } = sizeMap[size as keyof typeof sizeMap];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Apple-inspired color gradients
  const gradients = {
    primary: { start: '#007AFF', end: '#5856D6' },
    secondary: { start: '#AF52DE', end: '#FF2D92' },
    success: { start: '#34C759', end: '#5AC8FA' },
    warning: { start: '#FF9500', end: '#FFCC00' },
    danger: { start: '#FF3B30', end: '#FF2D92' },
  };

  const gradient = gradients[color as keyof typeof gradients] || gradients.primary;
  const glassStyles = glass ? createGlassStyle(glassPresets[glassPreset!]) : {};

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={cn(
          'relative rounded-full',
          glass && 'backdrop-blur-apple border border-white/20'
        )}
        style={glass ? { ...glassStyles, padding: '8px' } : undefined}
      >
        <svg width={width} height={width}>
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke={`url(#gradient-${color})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            transform={`rotate(-90 ${width / 2} ${width / 2})`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              strokeDasharray: circumference,
            }}
          />
          {/* Gradient definitions */}
          <defs>
            <linearGradient id={`gradient-${color}`}>
              <stop offset="0%" stopColor={gradient.start} />
              <stop offset="100%" stopColor={gradient.end} />
            </linearGradient>
          </defs>
        </svg>
        
        {showPercentage && ageGroup !== '3-5' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-apple text-lg font-semibold text-white">
              {Math.round(percentage)}%
            </span>
          </div>
        )}

        {ageGroup === '3-5' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <StarIcon filled className="w-8 h-8 text-system-yellow" />
            </motion.div>
          </div>
        )}

        {/* Glass overlay */}
        {glass && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none rounded-full" />
        )}
      </div>

      {label && (
        <span className="text-center font-apple font-medium text-white">
          {label}
        </span>
      )}
    </div>
  );
};

// Star icon component
const StarIcon: React.FC<{
  filled?: boolean;
  className?: string;
}> = ({ filled = false, className }) => (
  <svg
    className={cn('w-6 h-6', className)}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
);

// Check icon component
const CheckIcon: React.FC<{
  className?: string;
}> = ({ className }) => (
  <svg
    className={cn('w-6 h-6', className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// Default export for backward compatibility
export default ProgressBar;