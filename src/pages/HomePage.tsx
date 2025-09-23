import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';

const HomePage: React.FC = () => {
  const { profile } = useAppSelector(state => state.student);
  const { theme } = useTheme();
  const ageGroup = profile?.ageGroup || '6-8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ color: theme.colorScheme.primary }}
        >
          🎉 SUCCESS! 🎉
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-semibold mb-2"
          style={{ color: theme.colorScheme.text.primary }}
        >
          Welcome back, {profile?.name || profile?.username}!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-600 mb-6"
        >
          Kid flow authentication successful! 🚀
        </motion.p>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mb-8"
        style={{
          backgroundColor: theme.colorScheme.background,
          border: `2px solid ${theme.colorScheme.primary}20`
        }}
      >
        <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: theme.colorScheme.primary }}>
          Welcome to Stealth Learning! 🎮
        </h3>
        <p className="text-center text-lg mb-6" style={{ color: theme.colorScheme.text.primary }}>
          Ready to play and learn? Your adventure awaits!
        </p>

        {/* Age-specific content */}
        {ageGroup === '3-5' && (
          <div className="text-center">
            <p className="text-xl mb-4">🌟 Let's have fun learning together!</p>
            <Button ageGroup="3-5" variant="primary" size="large">
              🎈 Start Playing!
            </Button>
          </div>
        )}

        {ageGroup === '6-8' && (
          <div className="text-center">
            <p className="text-xl mb-4">🚀 Time for exciting learning adventures!</p>
            <Button ageGroup="6-8" variant="primary" size="large">
              🎯 Begin Your Quest!
            </Button>
          </div>
        )}

        {ageGroup === '9+' && (
          <div className="text-center">
            <p className="text-xl mb-4">💡 Ready to master new skills?</p>
            <Button ageGroup="9+" variant="primary" size="large">
              🎓 Start Learning!
            </Button>
          </div>
        )}
      </motion.div>

      {/* Stats Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl mb-2">💎</div>
          <div className="text-2xl font-bold" style={{ color: theme.colorScheme.primary }}>
            {profile?.xp || 0}
          </div>
          <div className="text-sm text-gray-600">XP Points</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold" style={{ color: theme.colorScheme.secondary }}>
            {profile?.totalStars || 0}
          </div>
          <div className="text-sm text-gray-600">Stars</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl mb-2">🎮</div>
          <div className="text-2xl font-bold" style={{ color: theme.colorScheme.accent }}>
            {profile?.gamesPlayed || 0}
          </div>
          <div className="text-sm text-gray-600">Games</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold" style={{ color: theme.colorScheme.success }}>
            {profile?.achievements?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Achievements</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;