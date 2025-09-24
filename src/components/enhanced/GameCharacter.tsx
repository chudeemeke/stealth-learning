import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Z_INDEX_CLASSES } from '@/styles/z-index';
import { getAccessibleTextColor, ACCESSIBLE_COLORS } from '@/utils/contrast';

interface GameCharacterProps {
  subject: 'math' | 'english' | 'science';
  emotion?: 'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging';
  size?: 'small' | 'medium' | 'large';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  message?: string;
  onInteraction?: () => void;
  className?: string;
}

const CHARACTER_CONFIGS = {
  math: {
    base: '🧮',
    name: 'Mathly',
    colors: {
      primary: '#3B82F6',
      secondary: '#1D4ED8',
      accent: '#60A5FA'
    },
    expressions: {
      happy: '😊',
      excited: '🤩',
      thinking: '🤔',
      celebrating: '🎉',
      encouraging: '💪'
    },
    accessories: ['🔢', '➕', '✖️', '💎', '🏆']
  },
  english: {
    base: '📚',
    name: 'Wordy',
    colors: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171'
    },
    expressions: {
      happy: '😊',
      excited: '🤩',
      thinking: '🤔',
      celebrating: '🎉',
      encouraging: '💪'
    },
    accessories: ['📝', '✨', '💭', '🏆', '🎯']
  },
  science: {
    base: '🔬',
    name: 'Scientia',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399'
    },
    expressions: {
      happy: '😊',
      excited: '🤩',
      thinking: '🤔',
      celebrating: '🎉',
      encouraging: '💪'
    },
    accessories: ['⚗️', '🧪', '⚛️', '🏆', '💫']
  }
};

const POSITION_CLASSES = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
};

const SIZE_CONFIGS = {
  small: { container: 'w-16 h-16', text: 'text-2xl', bubble: 'text-xs p-2' },
  medium: { container: 'w-24 h-24', text: 'text-4xl', bubble: 'text-sm p-3' },
  large: { container: 'w-32 h-32', text: 'text-6xl', bubble: 'text-base p-4' }
};

export const GameCharacter: React.FC<GameCharacterProps> = ({
  subject,
  emotion = 'happy',
  size = 'medium',
  position = 'bottom-right',
  message,
  onInteraction,
  className = ''
}) => {
  const [currentAccessory, setCurrentAccessory] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const controls = useAnimation();

  const config = CHARACTER_CONFIGS[subject];
  const sizeConfig = SIZE_CONFIGS[size];
  const positionClass = POSITION_CLASSES[position];

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Accessory rotation
  useEffect(() => {
    const accessoryInterval = setInterval(() => {
      setCurrentAccessory(prev => (prev + 1) % config.accessories.length);
    }, 5000);

    return () => clearInterval(accessoryInterval);
  }, [config.accessories.length]);

  // Message display
  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Emotion-based animations
  useEffect(() => {
    switch (emotion) {
      case 'excited':
        controls.start({
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0],
          transition: { duration: 0.6, repeat: 2 }
        });
        break;
      case 'celebrating':
        controls.start({
          y: [0, -10, 0],
          scale: [1, 1.2, 1],
          transition: { duration: 0.8, repeat: 3 }
        });
        break;
      case 'thinking':
        controls.start({
          rotate: [0, 3, -3, 0],
          transition: { duration: 2, repeat: Infinity }
        });
        break;
      case 'encouraging':
        controls.start({
          x: [0, 2, -2, 0],
          transition: { duration: 0.5, repeat: 4 }
        });
        break;
      default:
        controls.start({
          y: [0, -2, 0],
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        });
    }
  }, [emotion, controls]);

  const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  };

  return (
    <div className={`fixed ${positionClass} ${Z_INDEX_CLASSES.HELPER_CHARACTER} ${className}`}>
      {/* Speech Bubble */}
      {(message || showMessage) && (
        <motion.div
          className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                     rounded-2xl shadow-lg border-2 max-w-48
                     ${sizeConfig.bubble} ${Z_INDEX_CLASSES.HELPER_BUBBLE}`}
          style={{
            borderColor: config.colors.primary,
            backgroundColor: config.colors.primary
          }}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
        >
          <div
            className="font-semibold"
            style={{
              color: ACCESSIBLE_COLORS[subject as keyof typeof ACCESSIBLE_COLORS]?.text.color || '#FFFFFF',
              textShadow: ACCESSIBLE_COLORS[subject as keyof typeof ACCESSIBLE_COLORS]?.text.shadow || '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {message}
          </div>
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: `8px solid ${config.colors.primary}`
            }}
          />
        </motion.div>
      )}

      {/* Character Container */}
      <motion.div
        className={`relative ${sizeConfig.container} cursor-pointer select-none`}
        animate={controls}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onInteraction}
      >
        {/* Glow Effect */}
        <motion.div
          className={`absolute inset-0 rounded-full blur-md opacity-30`}
          style={{ backgroundColor: config.colors.primary }}
          animate={pulseAnimation}
        />

        {/* Main Character */}
        <motion.div
          className={`relative z-10 ${sizeConfig.container} flex items-center justify-center
                     bg-white rounded-full border-4 shadow-lg`}
          style={{ borderColor: config.colors.primary }}
          animate={floatingAnimation}
        >
          <div className={`${sizeConfig.text} relative`}>
            {isBlinking ? '😴' : config.expressions[emotion]}
          </div>
        </motion.div>

        {/* Floating Accessories */}
        <motion.div
          className="absolute -top-2 -right-2 text-lg"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          {config.accessories[currentAccessory]}
        </motion.div>

        {/* Success Sparkles */}
        {emotion === 'celebrating' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400 text-sm"
                style={{
                  top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                  left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}

        {/* Subject Badge */}
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2
                     px-2 py-1 rounded-full text-white text-xs font-bold"
          style={{ backgroundColor: config.colors.secondary }}
        >
          {config.name}
        </div>
      </motion.div>

      {/* Interactive Hint */}
      {onInteraction && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2
                     text-xs text-gray-500 opacity-0 hover:opacity-100 transition-opacity"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Click me!
        </motion.div>
      )}
    </div>
  );
};

export default GameCharacter;