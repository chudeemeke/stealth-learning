import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/utils/cn';
import { AgeAwareComponentProps, Reward } from '@/types';
import { Button } from './Button';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';

export interface FeedbackModalProps extends AgeAwareComponentProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'info' | 'levelComplete' | 'achievement';
  title?: string;
  message: string;
  points?: number;
  rewards?: Reward[];
  stars?: number;
  nextAction?: {
    label: string;
    onClick: () => void;
  };
  retryAction?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  ageGroup,
  isOpen,
  type,
  title,
  message,
  points,
  rewards,
  stars,
  nextAction,
  retryAction,
  onClose,
}) => {
  const { playSound } = useSound();
  const { notification, triggerHaptic } = useHaptic();
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (isOpen && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      
      // Play appropriate sound
      switch (type) {
        case 'success':
          playSound('success');
          notification('success');
          break;
        case 'error':
          playSound('error');
          notification('error');
          break;
        case 'levelComplete':
          playSound('levelUp');
          triggerHaptic('success');
          // Trigger confetti for level completion
          if (ageGroup !== '9') {
            triggerConfetti();
          }
          break;
        case 'achievement':
          playSound('unlock');
          notification('success');
          if (ageGroup === '3-5') {
            triggerBigConfetti();
          }
          break;
        default:
          playSound('ding');
          triggerHaptic('selection');
      }
    }
    
    if (!isOpen) {
      hasPlayedSound.current = false;
    }
  }, [isOpen, type, ageGroup, playSound, notification, triggerHaptic]);

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const triggerBigConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#FFD700', '#4A90E2', '#7ED321', '#FF6B6B'];

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        colors,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
        zIndex: 9999,
      });
    }, 250);
  };

  // Age-specific modal configurations
  const modalSizes = {
    '3-5': 'max-w-lg',
    '6-8': 'max-w-md',
    '9': 'max-w-sm',
  };

  const iconSizes = {
    '3-5': 'w-24 h-24',
    '6-8': 'w-20 h-20',
    '9': 'w-16 h-16',
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <SuccessIcon className={iconSizes[ageGroup]} />;
      case 'error':
        return <ErrorIcon className={iconSizes[ageGroup]} />;
      case 'levelComplete':
        return <TrophyIcon className={iconSizes[ageGroup]} />;
      case 'achievement':
        return <BadgeIcon className={iconSizes[ageGroup]} />;
      default:
        return <InfoIcon className={iconSizes[ageGroup]} />;
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={type === 'info' ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              'relative bg-white rounded-2xl shadow-2xl overflow-hidden',
              modalSizes[ageGroup],
              ageGroup === '3-5' && 'border-4 border-young-primary',
              ageGroup === '6-8' && 'border-2 border-mid-primary',
              'w-full'
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Decorative header background */}
            {ageGroup !== '9' && (
              <div className={cn(
                'absolute top-0 left-0 right-0 h-32 opacity-20',
                type === 'success' && 'bg-gradient-to-b from-green-400',
                type === 'error' && 'bg-gradient-to-b from-red-400',
                type === 'levelComplete' && 'bg-gradient-to-b from-yellow-400',
                type === 'achievement' && 'bg-gradient-to-b from-purple-400',
                type === 'info' && 'bg-gradient-to-b from-blue-400'
              )} />
            )}

            <div className={cn(
              'relative p-6',
              ageGroup === '3-5' && 'p-8'
            )}>
              {/* Icon */}
              <motion.div
                className="flex justify-center mb-4"
                animate={ageGroup === '3-5' ? {
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: type === 'success' || type === 'levelComplete' ? Infinity : 0,
                }}
              >
                {getIcon()}
              </motion.div>

              {/* Stars display for achievements */}
              {stars && stars > 0 && (
                <div className="flex justify-center gap-2 mb-4">
                  {Array.from({ length: 3 }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{
                        scale: i < stars ? 1 : 0.7,
                        rotate: 0,
                        opacity: i < stars ? 1 : 0.3,
                      }}
                      transition={{
                        delay: i * 0.2,
                        type: 'spring',
                        stiffness: 200,
                      }}
                    >
                      <StarIcon
                        className={cn(
                          'text-yellow-400',
                          ageGroup === '3-5' && 'w-12 h-12',
                          ageGroup === '6-8' && 'w-10 h-10',
                          ageGroup === '9' && 'w-8 h-8'
                        )}
                        filled={i < stars}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Title */}
              {title && (
                <h2 className={cn(
                  'text-center font-bold mb-2',
                  ageGroup === '3-5' && 'text-3xl font-young',
                  ageGroup === '6-8' && 'text-2xl font-mid',
                  ageGroup === '9' && 'text-xl font-old'
                )}>
                  {title}
                </h2>
              )}

              {/* Message */}
              <p className={cn(
                'text-center text-gray-700 mb-4',
                ageGroup === '3-5' && 'text-xl font-young',
                ageGroup === '6-8' && 'text-lg font-mid',
                ageGroup === '9' && 'text-base font-old'
              )}>
                {message}
              </p>

              {/* Points display */}
              {points && points > 0 && (
                <motion.div
                  className="flex justify-center items-center gap-2 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <CoinIcon className="w-8 h-8 text-yellow-500" />
                  <span className={cn(
                    'font-bold text-yellow-600',
                    ageGroup === '3-5' && 'text-2xl',
                    ageGroup === '6-8' && 'text-xl',
                    ageGroup === '9' && 'text-lg'
                  )}>
                    +{points}
                  </span>
                </motion.div>
              )}

              {/* Rewards display */}
              {rewards && rewards.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {rewards.map((reward, index) => (
                    <motion.div
                      key={reward.id}
                      className="flex flex-col items-center"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.4 + index * 0.1,
                        type: 'spring',
                        stiffness: 200,
                      }}
                    >
                      <div className={cn(
                        'p-3 rounded-lg bg-gradient-to-br',
                        reward.rarity === 'legendary' && 'from-yellow-400 to-orange-500',
                        reward.rarity === 'epic' && 'from-purple-400 to-pink-500',
                        reward.rarity === 'rare' && 'from-blue-400 to-cyan-500',
                        reward.rarity === 'common' && 'from-gray-300 to-gray-400'
                      )}>
                        <span className="text-2xl">{reward.icon}</span>
                      </div>
                      <span className="text-xs font-medium mt-1">
                        {reward.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className={cn(
                'flex gap-3',
                retryAction && nextAction ? 'justify-between' : 'justify-center'
              )}>
                {retryAction && (
                  <Button
                    ageGroup={ageGroup}
                    variant={type === 'error' ? 'danger' : 'secondary'}
                    onClick={retryAction.onClick}
                    fullWidth={!nextAction}
                  >
                    {retryAction.label}
                  </Button>
                )}
                
                {nextAction && (
                  <Button
                    ageGroup={ageGroup}
                    variant="primary"
                    onClick={nextAction.onClick}
                    fullWidth={!retryAction}
                  >
                    {nextAction.label}
                  </Button>
                )}
                
                {!retryAction && !nextAction && (
                  <Button
                    ageGroup={ageGroup}
                    variant="primary"
                    onClick={onClose}
                    fullWidth
                  >
                    {ageGroup === '3-5' ? 'Yay! 🎉' : 'Continue'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Icon components
const SuccessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn('text-green-500', className)} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn('text-red-500', className)} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn('text-yellow-500', className)} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
  </svg>
);

const BadgeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn('text-purple-500', className)} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l2.09 6.26L21 9l-5 4.87 1.18 6.88L12 17.25l-6.18 3.5L7 14.14 2 9l6.91-1.01L12 2z" />
  </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn('text-blue-500', className)} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
  <svg
    className={className}
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

const CoinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
  </svg>
);