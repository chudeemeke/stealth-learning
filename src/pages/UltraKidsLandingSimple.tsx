import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const UltraKidsLandingSimple: React.FC = () => {
  const navigate = useNavigate();
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited'>('happy');

  // Welcome confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setMascotMood('excited');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF3B3B', '#FF8C42', '#FFD23F', '#4ADE80', '#3B82F6', '#A855F7', '#EC4899']
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleKidClick = () => {
    // Epic celebration
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      navigate('/kid-login');
    }, 800);
  };

  const handleParentClick = () => {
    navigate('/parent-login');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #ffc94c 75%, #ffdd00 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }}
    >
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .floating { animation: float 3s ease-in-out infinite; }
        .sparkle { animation: sparkle 2s ease-in-out infinite; }
        .bounce { animation: bounce 2s ease-in-out infinite; }
      `}</style>

      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl floating">🌟</div>
        <div className="absolute top-20 right-20 text-5xl floating" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute bottom-20 left-20 text-6xl floating" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-10 right-10 text-5xl floating" style={{ animationDelay: '1.5s' }}>🌈</div>
        <div className="absolute top-1/2 left-10 text-5xl floating" style={{ animationDelay: '2s' }}>🎈</div>
        <div className="absolute top-1/2 right-10 text-5xl floating" style={{ animationDelay: '2.5s' }}>🎮</div>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 1
        }}
        className="relative z-10"
      >
        {/* Main Content Card */}
        <div
          className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-12 max-w-2xl mx-auto relative overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 100px rgba(168, 85, 247, 0.3)'
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 text-4xl sparkle">🌟</div>
          <div className="absolute top-0 right-0 text-4xl sparkle" style={{ animationDelay: '0.5s' }}>⭐</div>
          <div className="absolute bottom-0 left-0 text-4xl sparkle" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute bottom-0 right-0 text-4xl sparkle" style={{ animationDelay: '1.5s' }}>🌈</div>

          {/* Welcome Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h1
              className="text-6xl font-extrabold mb-4"
              style={{
                background: 'linear-gradient(90deg, #FF3B3B, #FF8C42, #FFD23F, #4ADE80, #3B82F6, #A855F7, #EC4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                backgroundSize: '200% 100%',
                animation: 'gradient 3s ease infinite'
              }}
            >
              Welcome to
            </h1>
            <div className="text-5xl font-black flex items-center justify-center gap-4 bounce">
              <span style={{
                background: 'linear-gradient(45deg, #A855F7, #EC4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                LearnPlay!
              </span>
              <span className="text-5xl">🎮</span>
            </div>
          </motion.div>

          {/* Mascot */}
          <motion.div
            className="flex justify-center mb-8"
            animate={{
              scale: mascotMood === 'excited' ? [1, 1.1, 1] : 1,
              rotate: mascotMood === 'excited' ? [0, 5, -5, 0] : 0
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            <div className="text-8xl">
              🦉
              <motion.div
                className="text-3xl absolute -top-2 -right-2"
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💡
              </motion.div>
            </div>
          </motion.div>

          {/* Question */}
          <motion.h2
            className="text-3xl font-bold text-center mb-8 text-gray-800"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Who's playing today? 🎯
          </motion.h2>

          {/* Action Buttons */}
          <div className="space-y-6">
            {/* Kid Button - Ultra Colorful */}
            <motion.button
              className="w-full px-8 py-6 text-3xl font-black rounded-3xl text-white shadow-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FF3B3B, #FF8C42, #FFD23F, #4ADE80, #3B82F6)',
                backgroundSize: '200% 200%',
                animation: 'gradient 3s ease infinite'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleKidClick}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-4xl">🦸</span>
                <span>I'm a Kid!</span>
                <span className="text-4xl">🎮</span>
              </span>

              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                  backgroundSize: '200% 200%'
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '200% 200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />

              {/* Floating decorations around button */}
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-3xl bounce">🎈</div>
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-3xl bounce" style={{ animationDelay: '1s' }}>🎨</div>
            </motion.button>

            {/* Parent Button - Professional but fun */}
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

          {/* Fun Fact */}
          <motion.div
            className="mt-8 p-4 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-2xl"
            animate={{
              boxShadow: [
                '0 4px 6px rgba(0,0,0,0.1)',
                '0 10px 20px rgba(255,182,193,0.3)',
                '0 4px 6px rgba(0,0,0,0.1)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-purple-800">
              <span className="text-2xl">💡</span>
              <span>Did you know? Learning is 300% more fun with games!</span>
              <span className="text-2xl">🚀</span>
            </div>
          </motion.div>

          {/* Achievement Preview */}
          <div className="mt-6 flex justify-center gap-4">
            {['🏆', '🥇', '🎯', '⭐', '💎'].map((emoji, index) => (
              <motion.div
                key={emoji}
                className="text-3xl cursor-pointer"
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
        </div>
      </motion.div>
    </div>
  );
};

export default UltraKidsLandingSimple;