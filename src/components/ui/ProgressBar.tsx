import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { AgeAwareComponentProps } from '@/types';

export interface ProgressBarProps extends AgeAwareComponentProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  showStars?: boolean;
  animated?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  variant?: 'linear' | 'circular' | 'stepped';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  ageGroup,
  current,
  total,
  label,
  showPercentage = false,
  showStars = false,
  animated = true,
  color = 'primary',
  size = 'medium',
  variant = 'linear',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
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

  // Age-specific configurations
  const sizeClasses = {
    '3-5': {
      small: 'h-6',
      medium: 'h-8',
      large: 'h-12',
    },
    '6-8': {
      small: 'h-4',
      medium: 'h-6',
      large: 'h-8',
    },
    '9': {
      small: 'h-2',
      medium: 'h-3',
      large: 'h-4',
    },
  };

  const colorClasses = {
    '3-5': {
      primary: 'from-yellow-400 to-yellow-500',
      secondary: 'from-blue-400 to-blue-500',
      success: 'from-green-400 to-green-500',
      warning: 'from-orange-400 to-orange-500',
      danger: 'from-red-400 to-red-500',
    },
    '6-8': {
      primary: 'from-purple-400 to-purple-600',
      secondary: 'from-pink-400 to-red-500',
      success: 'from-green-400 to-green-600',
      warning: 'from-yellow-400 to-orange-500',
      danger: 'from-red-400 to-red-600',
    },
    '9': {
      primary: 'from-blue-600 to-blue-800',
      secondary: 'from-red-500 to-red-700',
      success: 'from-teal-500 to-teal-700',
      warning: 'from-orange-500 to-orange-700',
      danger: 'from-red-600 to-red-800',
    },
  };

  if (variant === 'stepped' && ageGroup === '3-5') {
    return <SteppedProgress current={current} total={total} animated={animated} />;
  }

  if (variant === 'circular') {
    return (
      <CircularProgress
        percentage={displayPercentage}
        ageGroup={ageGroup}
        color={color}
        size={size}
        label={label}
        showPercentage={showPercentage}
      />
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className={cn(
            'font-medium',
            ageGroup === '3-5' && 'text-xl font-young',
            ageGroup === '6-8' && 'text-lg font-mid',
            ageGroup === '9' && 'text-base font-old'
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
        'relative w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[ageGroup][size]
      )}>
        <motion.div
          className={cn(
            'h-full bg-gradient-to-r rounded-full',
            colorClasses[ageGroup][color]
          )}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: 'easeOut',
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
        <div className="flex gap-2 mt-3">
          {Array.from({ length: total }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: i < current ? 1 : 0.8,
                rotate: 0,
              }}
              transition={{
                delay: animated ? i * 0.1 : 0,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <StarIcon
                filled={i < current}
                className={cn(
                  'w-8 h-8 transition-colors',
                  i < current ? 'text-yellow-400' : 'text-gray-300'
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

// Circular progress variant
const CircularProgress: React.FC<{
  percentage: number;
  ageGroup: AgeAwareComponentProps['ageGroup'];
  color: string;
  size: string;
  label?: string;
  showPercentage?: boolean;
}> = ({ percentage, ageGroup, color, size, label, showPercentage }) => {
  const sizeMap = {
    small: { width: 60, strokeWidth: 4 },
    medium: { width: 80, strokeWidth: 6 },
    large: { width: 100, strokeWidth: 8 },
  };

  const { width, strokeWidth } = sizeMap[size as keyof typeof sizeMap];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={width} height={width}>
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            transform={`rotate(-90 ${width / 2} ${width / 2})`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
        
        {showPercentage && ageGroup !== '3-5' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{Math.round(percentage)}%</span>
          </div>
        )}
        
        {ageGroup === '3-5' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <StarIcon filled className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
        )}
      </div>
      
      {label && (
        <span className="text-center font-medium">{label}</span>
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