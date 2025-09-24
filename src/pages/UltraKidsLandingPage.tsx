import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UltraKidsBackground,
  UltraKidsButton,
  CharacterMascot,
  ULTRA_COLORS,
  UltraKidsReward
} from '@/components/ultra-kids/UltraKidsDesignSystem';
import confetti from 'canvas-confetti';

const UltraKidsLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<'kid' | 'parent' | null>(null);
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy');
  const [showWelcome, setShowWelcome] = useState(true);
  const [floatingRewards, setFloatingRewards] = useState<number[]>([]);

  // Create floating rewards animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingRewards(prev => [...prev, Date.now()]);
      setTimeout(() => {
        setFloatingRewards(prev => prev.slice(1));
      }, 5000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Welcome animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMascotMood('excited');
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: Object.values(ULTRA_COLORS.rainbow)
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleKidClick = () => {
    setMascotMood('celebrating');
    setSelectedPath('kid');

    // Epic transition effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      navigate('/kid-login');
    }, 800);
  };

  const handleParentClick = () => {
    setSelectedPath('parent');
    navigate('/parent-login');
  };

  return (
    <UltraKidsBackground theme="clouds">
      <div className="min-h-screen flex items-center justify-center p-8">
        {/* Floating Rewards */}
        {floatingRewards.map((id, index) => (
          <motion.div
            key={id}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              rotate: 0
            }}
            animate={{
              y: -100,
              rotate: 360
            }}
            transition={{
              duration: 8,
              ease: 'linear'
            }}
            style={{ left: `${(index * 20) % 100}%` }}
          >
            <UltraKidsReward
              type={['star', 'gem', 'coin'][index % 3] as any}
              size="small"
              animate={false}
            />
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 1
          }}
          className="relative"
        >
          {/* Main Content Card */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-[3rem] shadow-2xl p-12 max-w-2xl mx-auto relative overflow-hidden"
            animate={{
              boxShadow: [
                '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                '0 25px 70px -12px rgba(168, 85, 247, 0.4)',
                '0 25px 70px -12px rgba(59, 130, 246, 0.4)',
                '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'loop'
            }}
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 text-4xl animate-pulse">🌟</div>
            <div className="absolute top-0 right-0 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute bottom-0 left-0 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute bottom-0 right-0 text-4xl animate-pulse" style={{ animationDelay: '1.5s' }}>🌈</div>

            {/* Welcome Text */}
            <AnimatePresence mode="wait">
              {showWelcome && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="text-center mb-8"
                >
                  <motion.h1
                    className="text-6xl font-extrabold mb-4"
                    style={{
                      background: ULTRA_COLORS.gradients.rainbow,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity
                    }}
                  >
                    Welcome to
                  </motion.h1>
                  <motion.div
                    className="text-5xl font-black flex items-center justify-center gap-4"
                    animate={{
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  >
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                      LearnPlay!
                    </span>
                    <motion.span
                      animate={{ rotate: [0, 20, -20, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎮
                    </motion.span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Character Mascot */}
            <div className="flex justify-center mb-8">
              <CharacterMascot type="owl" mood={mascotMood} size="large" />
            </div>

            {/* Interactive Question */}
            <motion.div
              className="text-center mb-8"
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                Who's playing today?
                <motion.span
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎯
                </motion.span>
              </h2>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-6">
              {/* Kid Button */}
              <div className="relative">
                <UltraKidsButton
                  onClick={handleKidClick}
                  variant="bounce"
                  size="huge"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🦸
                  </motion.span>
                  <span className="text-3xl font-black">I'm a Kid!</span>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    🎮
                  </motion.span>
                </UltraKidsButton>

                {/* Decorative elements around kid button */}
                <motion.div
                  className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-3xl"
                  animate={{ x: [-10, 10, -10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎈
                </motion.div>
                <motion.div
                  className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-3xl"
                  animate={{ x: [10, -10, 10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎨
                </motion.div>
              </div>

              {/* Parent Button */}
              <div className="relative">
                <motion.button
                  className="w-full px-8 py-4 text-2xl font-bold rounded-3xl text-white shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleParentClick}
                >
                  <span className="flex items-center justify-center gap-3">
                    <span>👨‍👩‍👧‍👦</span>
                    <span>I'm a Parent</span>
                    <span>📊</span>
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Fun Facts Ticker */}
            <motion.div
              className="mt-8 p-4 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-2xl"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 10,
                repeat: Infinity
              }}
            >
              <div className="flex items-center justify-center gap-2 text-lg font-semibold text-purple-800">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  💡
                </motion.span>
                <motion.span
                  key={Math.random()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  Did you know? Learning is 300% more fun with games!
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🚀
                </motion.span>
              </div>
            </motion.div>

            {/* Achievement Preview */}
            <div className="mt-6 flex justify-center gap-4">
              {['🏆', '🥇', '🎯', '⭐', '💎'].map((emoji, index) => (
                <motion.div
                  key={emoji}
                  className="text-3xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{
                    scale: 1.3,
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Orbiting Elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0'
              }}
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div
                style={{
                  transform: `translateX(${200 + i * 30}px) translateY(-50%)`
                }}
              >
                {['🌟', '⭐', '✨', '🌈', '🎈', '🎯'][i]}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </UltraKidsBackground>
  );
};

export default UltraKidsLandingPage;