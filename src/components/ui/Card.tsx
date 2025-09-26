import React, { ReactNode, forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { cn } from '@/utils/cn';
import { AgeAwareComponentProps } from '@/types';

// Polymorphic card interface that can transform into different component types
export interface BaseCardProps extends Partial<AgeAwareComponentProps> {
  title?: string;
  description?: string;
  icon?: ReactNode;
  image?: string;
  footer?: ReactNode;
  children?: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'interactive' | 'glassmorphism' | '3d-transform';
  interactive?: boolean;
  onClick?: () => void;
  badge?: {
    text: string;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  };
  size?: 'small' | 'medium' | 'large' | 'xl';
  animation?: {
    type?: 'slide' | 'fade' | 'scale' | 'flip' | 'bounce' | 'pulse';
    delay?: number;
    duration?: number;
    repeat?: boolean;
  };
  effects?: {
    hover?: boolean;
    parallax?: boolean;
    glow?: boolean;
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  };
  accessibility?: {
    ariaLabel?: string;
    focusRing?: boolean;
    highContrast?: boolean;
  };
}

export interface CardHandle {
  focus: () => void;
  blur: () => void;
  animate: (animation: string) => void;
  getElement: () => HTMLElement | null;
}

// Forward declarations for specialized card interfaces
export interface GameCardProps extends BaseCardProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  progress?: number;
  locked?: boolean;
  gameType?: 'math' | 'english' | 'science';
  estimatedTime?: number;
  rewards?: {
    xp: number;
    badges?: string[];
  };
}

export interface QuestionCardProps extends BaseCardProps {
  questionType?: 'multiple-choice' | 'drag-drop' | 'drawing' | 'voice';
  options?: string[];
  correctAnswer?: string;
  onAnswer?: (answer: string) => void;
  showFeedback?: boolean;
  timeLimit?: number;
  hint?: string;
}

export interface MetricCardProps extends BaseCardProps {
  value: number | string;
  label: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export interface AchievementCardProps extends BaseCardProps {
  achievementType: 'badge' | 'trophy' | 'certificate' | 'streak';
  isUnlocked: boolean;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// Discriminated union for polymorphic CardProps
export type CardProps =
  | (BaseCardProps & { cardType?: 'base' })
  | (GameCardProps & { cardType: 'game' })
  | (QuestionCardProps & { cardType: 'question' })
  | (MetricCardProps & { cardType: 'metric' })
  | (AchievementCardProps & { cardType: 'achievement' });

export const BaseCard = forwardRef<CardHandle, BaseCardProps>((
  {
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
    animation,
    effects = {},
    accessibility = {},
  },
  ref
) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => cardRef.current?.focus(),
    blur: () => cardRef.current?.blur(),
    animate: (animationType: string) => {
      controls.start(animationType);
    },
    getElement: () => cardRef.current,
  }));

  useEffect(() => {
    if (isInView && animation) {
      controls.start('visible');
    }
  }, [isInView, controls, animation]);
  // Enhanced age-specific styling configurations with new variants
  const variantClasses = {
    '3-5': {
      default: 'bg-white border-4 border-young-primary shadow-lg',
      elevated: 'bg-white shadow-2xl',
      outlined: 'bg-transparent border-4 border-young-primary',
      gradient: 'bg-gradient-to-br from-yellow-300 to-orange-400 text-white',
      interactive: 'bg-white border-4 border-young-primary shadow-lg hover:shadow-xl transition-all duration-300',
      glassmorphism: 'bg-white/80 backdrop-blur-xl border-4 border-white/30 shadow-2xl',
      '3d-transform': 'bg-white border-4 border-young-primary shadow-lg transform-gpu transition-transform duration-300',
    },
    '6-8': {
      default: 'bg-white border-2 border-gray-200 shadow-md',
      elevated: 'bg-white shadow-xl',
      outlined: 'bg-transparent border-2 border-mid-primary',
      gradient: 'bg-gradient-to-br from-purple-400 to-pink-500 text-white',
      interactive: 'bg-white border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300',
      glassmorphism: 'bg-white/70 backdrop-blur-lg border-2 border-white/20 shadow-xl',
      '3d-transform': 'bg-white border-2 border-gray-200 shadow-md transform-gpu transition-transform duration-300',
    },
    '9+': {
      default: 'bg-white border border-gray-200 shadow',
      elevated: 'bg-white shadow-lg',
      outlined: 'bg-transparent border border-old-primary',
      gradient: 'bg-gradient-to-br from-blue-600 to-teal-600 text-white',
      interactive: 'bg-white border border-gray-200 shadow hover:shadow-md transition-all duration-300',
      glassmorphism: 'bg-white/60 backdrop-blur-md border border-white/10 shadow-lg',
      '3d-transform': 'bg-white border border-gray-200 shadow transform-gpu transition-transform duration-300',
    },
  };

  const sizeClasses = {
    '3-5': {
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8',
      xl: 'p-10',
    },
    '6-8': {
      small: 'p-3',
      medium: 'p-5',
      large: 'p-7',
      xl: 'p-9',
    },
    '9+': {
      small: 'p-2',
      medium: 'p-4',
      large: 'p-6',
      xl: 'p-8',
    },
  };

  const radiusClasses = {
    '3-5': 'rounded-3xl',
    '6-8': 'rounded-2xl',
    '9+': 'rounded-xl',
  };

  const fontClasses = {
    '3-5': {
      title: 'text-3xl font-black tracking-wide',
      description: 'text-xl font-bold',
    },
    '6-8': {
      title: 'text-2xl font-bold tracking-normal',
      description: 'text-lg font-semibold',
    },
    '9+': {
      title: 'text-xl font-semibold tracking-tight',
      description: 'text-base font-medium',
    },
  };

  // Animation variants
  const animationVariants = {
    hidden: {
      opacity: 0,
      y: animation?.type === 'slide' ? 50 : 0,
      scale: animation?.type === 'scale' ? 0.8 : 1,
      rotateY: animation?.type === 'flip' ? -90 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: animation?.duration || 0.6,
        delay: animation?.delay || 0,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: variant === '3d-transform' ? 1.05 : 1.02,
      rotateX: variant === '3d-transform' ? 5 : 0,
      rotateY: variant === '3d-transform' ? 5 : 0,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: animation?.repeat ? Infinity : 0,
        ease: 'easeInOut',
      },
    },
  };

  // Shadow effects
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  // Glow effects
  const glowEffect = effects.glow ? {
    boxShadow: isHovered ? '0 0 30px rgba(59, 130, 246, 0.3)' : '0 0 15px rgba(59, 130, 246, 0.1)',
  } : {};

  const Component = motion.div;
  const componentProps = {
    ref: cardRef,
    initial: animation ? 'hidden' : undefined,
    animate: controls,
    variants: animationVariants,
    whileHover: interactive || effects.hover ? 'hover' : undefined,
    whileTap: interactive ? 'tap' : undefined,
    onClick,
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    role: interactive ? 'button' : undefined,
    tabIndex: interactive ? 0 : undefined,
    'aria-label': accessibility.ariaLabel || title,
    style: {
      perspective: variant === '3d-transform' ? '1000px' : undefined,
      transformStyle: variant === '3d-transform' ? ('preserve-3d' as const) : undefined,
      borderColor: getBorderColor(),
      transition: DesignSystem.animation?.transitions?.base || '250ms ease-in-out',
      ...glowEffect,
    },
  };

  return (
    <Component
      className={cn(
        'relative overflow-hidden',
        radiusClasses[ageGroup],
        variantClasses[ageGroup][variant],
        sizeClasses[ageGroup][size],
        effects.shadow && shadowClasses[effects.shadow],
        interactive && 'cursor-pointer',
        accessibility.focusRing && isFocused && 'ring-4 ring-blue-300 ring-opacity-50',
        accessibility.highContrast && 'high-contrast',
        'transition-all duration-300 ease-out',
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
                ageGroup === '9+' && 'text-2xl'
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
          ageGroup !== '9+' && 'border-t-2',
          ageGroup === '9+' && 'border-t',
          variant === 'gradient' ? 'border-white/20' : 'border-gray-200'
        )}>
          {footer}
        </div>
      )}

      {/* Enhanced decorative elements */}
      {ageGroup === '3-5' && (variant === 'default' || variant === 'interactive') && (
        <>
          <motion.div
            className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-300 rounded-full opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-300 rounded-full opacity-50"
            animate={{
              scale: [1, 0.8, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </>
      )}

      {/* Glassmorphism overlay */}
      {variant === 'glassmorphism' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-inherit" />
      )}

      {/* Parallax background for 3D effect */}
      {effects.parallax && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-inherit"
          style={{
            transform: isHovered ? 'translateZ(-10px) scale(1.1)' : 'translateZ(-10px)',
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Component>
  );
});

BaseCard.displayName = 'BaseCard';
// Polymorphic Card component that can transform into different specialized cards
export const Card: React.FC<CardProps> = (props) => {
  const { cardType = 'base', ...restProps } = props;

  switch (cardType) {
    case 'game':
      return <GameCard {...(restProps as GameCardProps)} />;
    case 'question':
      return <QuestionCard {...(restProps as QuestionCardProps)} />;
    case 'metric':
      return <MetricCard {...(restProps as MetricCardProps)} />;
    case 'achievement':
      return <AchievementCard {...(restProps as AchievementCardProps)} />;
    default:
      return <BaseCard {...(restProps as BaseCardProps)} />;
  }
};

// Specialized Card Components

export const GameCard: React.FC<GameCardProps> = ({
  difficulty,
  progress,
  locked = false,
  gameType = 'math',
  estimatedTime,
  rewards,
  ageGroup = '6-8',
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

  const gameTypeIcons = {
    math: '🔢',
    english: '📚',
    science: '🔬',
  };

  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    if (locked) {
      setIsUnlocking(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsUnlocking(false);
    }
  };

  return (
    <BaseCard
      {...props}
      ageGroup={ageGroup}
      variant={locked ? 'outlined' : '3d-transform'}
      interactive={!locked}
      effects={{
        hover: !locked,
        glow: !locked && progress === 100,
        shadow: locked ? 'sm' : 'lg',
      }}
      animation={{
        type: locked ? 'pulse' : 'slide',
        delay: 0.1,
        duration: 0.6,
      }}
      className={cn(
        props.className,
        locked && 'opacity-60',
        'group relative overflow-hidden'
      )}
      onClick={locked ? handleUnlock : props.onClick}
      icon={gameTypeIcons[gameType]}
    >
      {locked && (
        <motion.div
          className="absolute inset-0 bg-gray-900/20 rounded-inherit z-10 flex items-center justify-center"
          animate={isUnlocking ? { opacity: [0.2, 0.5, 0.2] } : {}}
          transition={{ duration: 0.5, repeat: isUnlocking ? Infinity : 0 }}
        >
          {isUnlocking && (
            <motion.div
              className="text-4xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              🔓
            </motion.div>
          )}
        </motion.div>
      )}
    </BaseCard>
  );
};

// QuestionCard implementation

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionType = 'multiple-choice',
  options = [],
  correctAnswer,
  onAnswer,
  showFeedback = false,
  timeLimit,
  hint,
  ageGroup = '6-8',
  ...props
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer?.(answer);
  };

  const isCorrect = showFeedback && selectedAnswer === correctAnswer;

  return (
    <BaseCard
      {...props}
      ageGroup={ageGroup}
      variant={showFeedback ? (isCorrect ? 'gradient' : 'elevated') : 'interactive'}
      effects={{ glow: isCorrect, shadow: 'lg' }}
      animation={{ type: 'slide', delay: 0.2 }}
    >
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => !showFeedback && handleAnswerSelect(option)}
            disabled={showFeedback}
            className={cn(
              'w-full p-4 text-left rounded-xl border-2 transition-all',
              selectedAnswer === option && 'border-blue-500 bg-blue-50',
              'hover:border-blue-300'
            )}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </BaseCard>
  );
};

// MetricCard implementation

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  unit,
  trend,
  colorScheme = 'blue',
  ageGroup = '6-8',
  ...props
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef);

  useEffect(() => {
    if (isInView) {
      const numericValue = typeof value === 'number' ? value : parseInt(value.toString()) || 0;
      let currentValue = 0;
      const increment = numericValue / 30;
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
          currentValue = numericValue;
          clearInterval(timer);
        }
        setAnimatedValue(Math.floor(currentValue));
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <BaseCard
      {...props}
      ageGroup={ageGroup}
      variant="elevated"
      effects={{ hover: true, shadow: 'lg' }}
      animation={{ type: 'scale', delay: 0.1 }}
    >
      <div className="text-center space-y-2">
        <motion.div
          className="text-3xl font-bold text-blue-600"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {typeof value === 'number' ? animatedValue : value}
          {unit && <span className="text-lg opacity-75">{unit}</span>}
        </motion.div>
        <div className="font-semibold text-gray-600">{label}</div>
      </div>
    </BaseCard>
  );
};

// AchievementCard implementation

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievementType,
  isUnlocked,
  rarity = 'common',
  ageGroup = '6-8',
  ...props
}) => {
  const achievementIcons = {
    badge: '🏅',
    trophy: '🏆',
    certificate: '📜',
    streak: '🔥',
  };

  return (
    <BaseCard
      {...props}
      ageGroup={ageGroup}
      variant={isUnlocked ? 'gradient' : 'outlined'}
      interactive={isUnlocked}
      effects={{ glow: isUnlocked, shadow: isUnlocked ? '2xl' : 'md' }}
      animation={{ type: isUnlocked ? 'bounce' : 'pulse', delay: 0.2, repeat: !isUnlocked }}
      className={cn(
        props.className,
        !isUnlocked && 'opacity-60 grayscale'
      )}
    >
      <div className="text-center space-y-4">
        <motion.div
          className="text-6xl"
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 1 }}
        >
          {achievementIcons[achievementType]}
        </motion.div>
        {isUnlocked && (
          <motion.div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white bg-yellow-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            ✨ {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </motion.div>
        )}
      </div>
    </BaseCard>
  );
};

// Default export for backward compatibility
export default Card;