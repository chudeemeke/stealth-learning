import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Ultra-vibrant color palette inspired by top kids apps
export const ULTRA_COLORS = {
  // Primary Rainbow Spectrum
  rainbow: {
    red: '#FF3B3B',
    orange: '#FF8C42',
    yellow: '#FFD23F',
    green: '#4ADE80',
    blue: '#3B82F6',
    purple: '#A855F7',
    pink: '#EC4899'
  },

  // Magical Gradients
  gradients: {
    sunrise: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #ffc94c 75%, #ffdd00 100%)',
    ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #00d2ff 50%, #3a7bd5 100%)',
    candy: 'linear-gradient(135deg, #ff6ec7 0%, #ffc0cb 25%, #ffb6c1 50%, #ff69b4 75%, #ff1493 100%)',
    forest: 'linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #45B649 100%)',
    galaxy: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #000000 50%, #3a7bd5 75%, #00d2ff 100%)',
    unicorn: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #f6d365 75%, #fda085 100%)',
    rainbow: 'linear-gradient(90deg, #ff0000 0%, #ff7f00 14.28%, #ffff00 28.56%, #00ff00 42.84%, #0000ff 57.12%, #4b0082 71.4%, #9400d3 85.68%, #ff0000 100%)'
  },

  // Fun Background Patterns
  patterns: {
    dots: 'radial-gradient(circle, #FFD23F 10%, transparent 10%)',
    stars: 'radial-gradient(circle, #FFD23F 3%, transparent 3%)',
    bubbles: 'radial-gradient(circle at 20% 80%, transparent 50%, rgba(255, 255, 255, 0.3) 50%)'
  }
};

// Animated Characters/Mascots
export const CharacterMascot: React.FC<{
  type: 'owl' | 'robot' | 'dragon' | 'unicorn' | 'panda';
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  size?: 'small' | 'medium' | 'large';
}> = ({ type, mood = 'happy', size = 'medium' }) => {
  const sizeMap = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const mascotEmojis = {
    owl: '🦉',
    robot: '🤖',
    dragon: '🐉',
    unicorn: '🦄',
    panda: '🐼'
  };

  return (
    <motion.div
      className={`${sizeMap[size]} flex items-center justify-center`}
      animate={{
        scale: mood === 'excited' ? [1, 1.2, 1] : 1,
        rotate: mood === 'celebrating' ? [0, 10, -10, 0] : 0,
        y: mood === 'happy' ? [0, -10, 0] : 0
      }}
      transition={{
        duration: mood === 'celebrating' ? 0.5 : 2,
        repeat: Infinity,
        repeatType: 'loop'
      }}
    >
      <div className="text-6xl relative">
        {mascotEmojis[type]}
        {mood === 'thinking' && (
          <motion.div
            className="absolute -top-8 -right-8 text-2xl"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💭
          </motion.div>
        )}
        {mood === 'celebrating' && (
          <>
            <motion.div
              className="absolute -top-4 -left-4 text-xl"
              animate={{ scale: [0, 1, 0], rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⭐
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-4 text-xl"
              animate={{ scale: [0, 1, 0], rotate: -360 }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            >
              🌟
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Ultra-engaging animated button
export const UltraKidsButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'rainbow' | 'bounce' | 'wiggle' | 'pulse' | 'sparkle';
  size?: 'small' | 'medium' | 'large' | 'huge';
  disabled?: boolean;
}> = ({ children, onClick, variant = 'rainbow', size = 'large', disabled = false }) => {
  const [isClicked, setIsClicked] = useState(false);

  const sizeStyles = {
    small: 'px-4 py-2 text-lg',
    medium: 'px-6 py-3 text-xl',
    large: 'px-8 py-4 text-2xl',
    huge: 'px-12 py-6 text-3xl'
  };

  const handleClick = () => {
    if (disabled) return;

    setIsClicked(true);

    // Trigger confetti
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: Object.values(ULTRA_COLORS.rainbow)
    });

    // Play sound effect (would need actual sound implementation)
    onClick?.();

    setTimeout(() => setIsClicked(false), 500);
  };

  const getVariantAnimation = () => {
    switch (variant) {
      case 'bounce':
        return { y: [0, -20, 0] };
      case 'wiggle':
        return { rotate: [0, -5, 5, -5, 5, 0] };
      case 'pulse':
        return { scale: [1, 1.1, 1] };
      case 'sparkle':
        return { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] };
      default:
        return {};
    }
  };

  return (
    <motion.button
      className={`
        ${sizeStyles[size]}
        relative overflow-hidden
        font-bold rounded-3xl
        text-white shadow-2xl
        transform-gpu transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        background: variant === 'rainbow' ? ULTRA_COLORS.gradients.unicorn : ULTRA_COLORS.gradients.candy
      }}
      whileHover={!disabled ? { scale: 1.05, ...getVariantAnimation() } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={isClicked ? { scale: [1, 1.2, 1] } : getVariantAnimation()}
      transition={{
        duration: variant === 'bounce' ? 0.6 : 0.3,
        repeat: variant !== 'rainbow' ? Infinity : 0,
        repeatType: 'reverse'
      }}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        style={{
          backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
          backgroundSize: '200% 200%'
        }}
      />

      {/* Sparkles */}
      {variant === 'sparkle' && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360]
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
    </motion.button>
  );
};

// Animated background with floating elements
export const UltraKidsBackground: React.FC<{
  theme?: 'space' | 'underwater' | 'jungle' | 'candy' | 'clouds';
  children: React.ReactNode;
}> = ({ theme = 'clouds', children }) => {
  const getThemeElements = () => {
    switch (theme) {
      case 'space':
        return ['🌟', '⭐', '🪐', '🚀', '🛸', '☄️'];
      case 'underwater':
        return ['🐠', '🐟', '🐡', '🦈', '🐙', '🫧'];
      case 'jungle':
        return ['🌴', '🦜', '🐵', '🦋', '🌺', '🍃'];
      case 'candy':
        return ['🍭', '🍬', '🧁', '🍩', '🍪', '🌈'];
      case 'clouds':
      default:
        return ['☁️', '⭐', '🌈', '☀️', '🎈', '🦋'];
    }
  };

  const elements = getThemeElements();

  return (
    <div className="relative min-h-screen overflow-hidden"
      style={{
        background: theme === 'space' ? ULTRA_COLORS.gradients.galaxy :
                   theme === 'underwater' ? ULTRA_COLORS.gradients.ocean :
                   theme === 'jungle' ? ULTRA_COLORS.gradients.forest :
                   theme === 'candy' ? ULTRA_COLORS.gradients.candy :
                   ULTRA_COLORS.gradients.sunrise
      }}
    >
      {/* Floating elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100
          }}
          animate={{
            y: -100,
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'linear'
          }}
        >
          {elements[i % elements.length]}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Progress bar with celebrations
export const UltraKidsProgress: React.FC<{
  value: number;
  max: number;
  showCelebration?: boolean;
}> = ({ value, max, showCelebration = true }) => {
  const percentage = (value / max) * 100;

  useEffect(() => {
    if (percentage === 100 && showCelebration) {
      // Epic celebration
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: Object.values(ULTRA_COLORS.rainbow)
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: Object.values(ULTRA_COLORS.rainbow)
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [percentage, showCelebration]);

  return (
    <div className="relative">
      <div className="w-full h-12 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          className="h-full rounded-full flex items-center justify-end pr-4"
          style={{
            background: ULTRA_COLORS.gradients.rainbow
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {percentage > 20 && (
            <motion.div
              className="text-white font-bold text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Math.round(percentage)}%
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Achievement stars */}
      {percentage >= 25 && (
        <motion.div
          className="absolute -top-2 left-1/4 transform -translate-x-1/2"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
        >
          ⭐
        </motion.div>
      )}
      {percentage >= 50 && (
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
        >
          🌟
        </motion.div>
      )}
      {percentage >= 75 && (
        <motion.div
          className="absolute -top-2 left-3/4 transform -translate-x-1/2"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
        >
          ✨
        </motion.div>
      )}
      {percentage >= 100 && (
        <motion.div
          className="absolute -top-2 right-0 transform translate-x-1/2"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          🏆
        </motion.div>
      )}
    </div>
  );
};

// Interactive reward system
export const UltraKidsReward: React.FC<{
  type: 'star' | 'gem' | 'coin' | 'trophy' | 'medal';
  value?: number;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}> = ({ type, value, size = 'medium', animate = true }) => {
  const sizeMap = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  const rewardEmojis = {
    star: '⭐',
    gem: '💎',
    coin: '🪙',
    trophy: '🏆',
    medal: '🥇'
  };

  return (
    <motion.div
      className={`${sizeMap[size]} flex items-center gap-2`}
      animate={animate ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity
      }}
    >
      <span>{rewardEmojis[type]}</span>
      {value !== undefined && (
        <span className="font-bold text-white">
          {value}
        </span>
      )}
    </motion.div>
  );
};