import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { AgeAwareComponentProps } from '@/types';

export interface CardProps extends Partial<AgeAwareComponentProps> {
  title?: string;
  description?: string;
  icon?: ReactNode;
  image?: string;
  footer?: ReactNode;
  children?: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'interactive';
  interactive?: boolean;
  onClick?: () => void;
  badge?: {
    text: string;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  };
  size?: 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  ageGroup = '6-8',
  title,
  description,
  icon,
  image,
  footer,
  children,
  variant = 'default',
  interactive = false,
  onClick,
  badge,
  size = 'medium',
  className,
}) => {
  // Age-specific styling configurations
  const variantClasses = {
    '3-5': {
      default: 'bg-white border-4 border-young-primary shadow-lg',
      elevated: 'bg-white shadow-2xl',
      outlined: 'bg-transparent border-4 border-young-primary',
      gradient: 'bg-gradient-to-br from-yellow-300 to-orange-400 text-white',
      interactive: 'bg-white border-4 border-young-primary shadow-lg hover:shadow-xl transition-shadow',
    },
    '6-8': {
      default: 'bg-white border-2 border-gray-200 shadow-md',
      elevated: 'bg-white shadow-xl',
      outlined: 'bg-transparent border-2 border-mid-primary',
      gradient: 'bg-gradient-to-br from-purple-400 to-pink-500 text-white',
      interactive: 'bg-white border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow',
    },
    '9': {
      default: 'bg-white border border-gray-200 shadow',
      elevated: 'bg-white shadow-lg',
      outlined: 'bg-transparent border border-old-primary',
      gradient: 'bg-gradient-to-br from-blue-600 to-teal-600 text-white',
      interactive: 'bg-white border border-gray-200 shadow hover:shadow-md transition-shadow',
    },
  };

  const sizeClasses = {
    '3-5': {
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8',
    },
    '6-8': {
      small: 'p-3',
      medium: 'p-5',
      large: 'p-7',
    },
    '9': {
      small: 'p-2',
      medium: 'p-4',
      large: 'p-6',
    },
  };

  const radiusClasses = {
    '3-5': 'rounded-2xl',
    '6-8': 'rounded-xl',
    '9': 'rounded-lg',
  };

  const fontClasses = {
    '3-5': {
      title: 'text-2xl font-young font-bold',
      description: 'text-lg font-young',
    },
    '6-8': {
      title: 'text-xl font-mid font-semibold',
      description: 'text-base font-mid',
    },
    '9': {
      title: 'text-lg font-old font-medium',
      description: 'text-sm font-old',
    },
  };

  const Component = interactive ? motion.div : 'div';
  const componentProps = interactive
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick,
        role: 'button',
        tabIndex: 0,
      }
    : { onClick };

  return (
    <Component
      className={cn(
        'relative overflow-hidden transition-all',
        radiusClasses[ageGroup],
        variantClasses[ageGroup][variant],
        sizeClasses[ageGroup][size],
        interactive && 'cursor-pointer',
        className
      )}
      {...componentProps}
    >
      {/* Badge */}
      {badge && (
        <div
          className={cn(
            'absolute top-2 right-2 z-10 px-3 py-1 rounded-full text-xs font-bold',
            badge.color === 'primary' && 'bg-young-primary text-white',
            badge.color === 'secondary' && 'bg-young-secondary text-white',
            badge.color === 'success' && 'bg-green-500 text-white',
            badge.color === 'warning' && 'bg-yellow-500 text-black',
            badge.color === 'danger' && 'bg-red-500 text-white',
            ageGroup === '3-5' && 'text-base px-4 py-2'
          )}
        >
          {badge.text}
        </div>
      )}

      {/* Image */}
      {image && (
        <div className={cn(
          'relative w-full overflow-hidden',
          size === 'small' ? 'h-32' : size === 'medium' ? 'h-48' : 'h-64',
          ageGroup === '3-5' ? '-m-6 mb-4' : ageGroup === '6-8' ? '-m-5 mb-3' : '-m-4 mb-2'
        )}>
          <img
            src={image}
            alt={title || ''}
            className="w-full h-full object-cover"
          />
          {ageGroup === '3-5' && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          )}
        </div>
      )}

      {/* Header with icon and title */}
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <motion.div
              className={cn(
                'flex-shrink-0',
                ageGroup === '3-5' && 'text-4xl',
                ageGroup === '6-8' && 'text-3xl',
                ageGroup === '9' && 'text-2xl'
              )}
              animate={ageGroup === '3-5' ? {
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              {icon}
            </motion.div>
          )}
          {title && (
            <h3 className={cn(
              fontClasses[ageGroup].title,
              variant === 'gradient' && 'text-white'
            )}>
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className={cn(
          fontClasses[ageGroup].description,
          variant === 'gradient' ? 'text-white/90' : 'text-gray-600',
          'mb-4'
        )}>
          {description}
        </p>
      )}

      {/* Children content */}
      {children && (
        <div className="mb-4">
          {children}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className={cn(
          'pt-4 mt-auto',
          ageGroup !== '9' && 'border-t-2',
          ageGroup === '9' && 'border-t',
          variant === 'gradient' ? 'border-white/20' : 'border-gray-200'
        )}>
          {footer}
        </div>
      )}

      {/* Fun decorative elements for youngest age group */}
      {ageGroup === '3-5' && variant === 'default' && (
        <>
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-300 rounded-full opacity-50" />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-300 rounded-full opacity-50" />
        </>
      )}
    </Component>
  );
};

// Game card variant with special styling
export const GameCard: React.FC<CardProps & {
  difficulty?: 'easy' | 'medium' | 'hard';
  progress?: number;
  locked?: boolean;
}> = ({
  difficulty,
  progress,
  locked = false,
  ...props
}) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    hard: 'bg-red-100 text-red-800 border-red-300',
  };

  const difficultyIcons = {
    easy: '⭐',
    medium: '⭐⭐',
    hard: '⭐⭐⭐',
  };

  return (
    <Card
      {...props}
      className={cn(
        props.className,
        locked && 'opacity-60 cursor-not-allowed'
      )}
      footer={
        <div className="space-y-2">
          {difficulty && (
            <div className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-sm border',
              difficultyColors[difficulty]
            )}>
              <span className="mr-1">{difficultyIcons[difficulty]}</span>
              <span className="capitalize">{difficulty}</span>
            </div>
          )}
          
          {progress !== undefined && progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          )}
          
          {locked && (
            <div className="flex items-center justify-center text-gray-500">
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Locked</span>
            </div>
          )}
        </div>
      }
    >
      {locked && (
        <div className="absolute inset-0 bg-gray-900/20 rounded-inherit z-10" />
      )}
    </Card>
  );
};

// Default export for backward compatibility
export default Card;