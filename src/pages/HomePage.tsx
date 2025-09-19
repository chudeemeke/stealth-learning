import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateStreakCount } from '@/store/slices/sessionSlice';
import { addXP } from '@/store/slices/studentSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();
  
  const student = useAppSelector(state => state.student);
  const session = useAppSelector(state => state.session);
  const adaptive = useAppSelector(state => state.adaptive);
  const analytics = useAppSelector(state => state.analytics);
  
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [dailyTip, setDailyTip] = useState('');
  
  const ageGroup = student.profile?.ageGroup || 
    (student.profile?.age 
      ? student.profile.age <= 5 ? '3-5' 
      : student.profile.age <= 8 ? '6-8' 
      : '9+' 
      : '6-8');

  // Time-based greeting
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      const name = student.profile?.username || 'Friend';
      
      if (hour < 12) {
        setTimeOfDay('morning');
        setGreeting(ageGroup === '3-5' ? `Good morning, ${name}! ☀️` : `Good morning, ${name}!`);
      } else if (hour < 17) {
        setTimeOfDay('afternoon');
        setGreeting(ageGroup === '3-5' ? `Hello, ${name}! 🌈` : `Good afternoon, ${name}!`);
      } else if (hour < 20) {
        setTimeOfDay('evening');
        setGreeting(ageGroup === '3-5' ? `Hi, ${name}! 🌟` : `Good evening, ${name}!`);
      } else {
        setTimeOfDay('night');
        setGreeting(ageGroup === '3-5' ? `Hello, ${name}! 🌙` : `Good evening, ${name}!`);
      }
    };
    
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [student.profile?.username, ageGroup]);

  // Daily learning tip
  useEffect(() => {
    const tips = {
      '3-5': [
        'Try counting objects around you! 🔢',
        'Can you find something blue? 💙',
        'Let\'s learn a new word today! 📖',
        'Practice writing your name! ✏️',
        'What shape is the sun? ☀️'
      ],
      '6-8': [
        'Challenge yourself with a harder level today!',
        'Complete 3 games to earn bonus stars!',
        'Try a subject you haven\'t played recently.',
        'Can you beat your best score?',
        'Team up with a friend for more fun!'
      ],
      '9+': [
        'Focus on your weakest subject for maximum improvement.',
        'Consistency beats intensity - play a little every day.',
        'Review your mistakes to learn faster.',
        'Challenge mode unlocks special achievements.',
        'Track your progress in the analytics dashboard.'
      ]
    };
    
    const ageTips = tips[ageGroup as keyof typeof tips] || tips['6-8'];
    const randomTip = ageTips[Math.floor(Math.random() * ageTips.length)];
    setDailyTip(randomTip);
  }, [ageGroup]);

  // Hide welcome animation after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Check and update streak
  useEffect(() => {
    const lastPlayDate = session.lastSessionDate;
    if (lastPlayDate) {
      const lastPlay = new Date(lastPlayDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastPlay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Played yesterday, continue streak
        dispatch(updateStreakCount());
      } else if (daysDiff > 1) {
        // Missed days, reset streak
        dispatch(updateStreakCount());
      }
    }
  }, [dispatch, session]);

  const handleQuickPlay = () => {
    playSound('select');
    triggerHaptic('medium');
    navigate('/games');
  };

  const handleContinueLearning = () => {
    if (session.lastGamePlayed) {
      playSound('select');
      navigate(`/games/${session.lastGamePlayed}`);
    } else {
      handleQuickPlay();
    }
  };

  // Get recent achievements
  const recentAchievements = student.achievements?.slice(-3) || [];
  
  // Calculate today's progress
  const todayProgress = session.todayPlayTime
    ? Math.min(100, (session.todayPlayTime / 1200) * 100) // Default daily goal: 20 minutes
    : 0;

  // Render age-appropriate content
  const renderContent = () => {
    if (ageGroup === '3-5') {
      return (
        <>
          {/* Fun character welcome */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              🎈
            </motion.div>
            <h1 className="text-3xl font-bold text-purple-600 mb-2">{greeting}</h1>
            <p className="text-lg text-gray-600">Ready to play and learn?</p>
          </motion.div>

          {/* Big play button */}
          <motion.div
            className="mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleQuickPlay}
              variant="primary"
              size="large"
              className="w-full py-8 text-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl"
            >
              <span className="mr-3">🎮</span>
              Let's Play!
            </Button>
          </motion.div>

          {/* Today's stars */}
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
            <h3 className="text-xl font-bold mb-3">Today's Stars</h3>
            <div className="flex justify-center gap-2 text-4xl">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: i < Math.floor(todayProgress / 20) ? 1 : 0.3,
                    scale: 1
                  }}
                  transition={{ delay: i * 0.1 }}
                >
                  ⭐
                </motion.span>
              ))}
            </div>
            <p className="text-center mt-3 text-gray-600">
              Collect all 5 stars today!
            </p>
          </Card>
        </>
      );
    } else if (ageGroup === '6-8') {
      return (
        <>
          {/* Personalized welcome */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{greeting}</h1>
            <p className="text-lg text-gray-600">
              {session.currentSession?.streakCount 
                ? `Amazing ${session.currentSession.streakCount} day streak! 🔥`
                : dailyTip}
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                variant="interactive"
                className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white cursor-pointer"
                onClick={handleContinueLearning}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Continue Learning</h3>
                    <p className="text-white/80">
                      {session.lastGamePlayed 
                        ? 'Jump back into your last game'
                        : 'Start today\'s adventure'}
                    </p>
                  </div>
                  <span className="text-5xl">🚀</span>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                variant="interactive"
                className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white cursor-pointer"
                onClick={() => navigate('/progress')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Your Progress</h3>
                    <p className="text-white/80">See how much you've learned!</p>
                  </div>
                  <span className="text-5xl">📊</span>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Daily progress */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-bold mb-3">Today's Goal</h3>
            <ProgressBar
              value={todayProgress}
              max={100}
              label={`${Math.round(todayProgress)}% Complete`}
              showStars={true}
              className="mb-2"
            />
            {todayProgress >= 100 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 font-bold text-center mt-2"
              >
                Goal achieved! Great job! 🎉
              </motion.p>
            )}
          </Card>

          {/* Recent achievements */}
          {recentAchievements.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-3">Recent Achievements</h3>
              <div className="space-y-2">
                {recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </>
      );
    } else {
      // Age 9+ - More sophisticated dashboard
      return (
        <>
          {/* Header with stats */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{greeting}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Level {student.profile?.level || 1}</span>
              <span>•</span>
              <span>{student.profile?.xp || 0} XP</span>
              <span>•</span>
              <span>{session.currentSession?.streakCount || 0} day streak</span>
              <span>•</span>
              <span>{student.achievements?.length || 0} achievements</span>
            </div>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Math Rating</p>
                  <p className="text-2xl font-bold">{Math.round(adaptive.mathRating || 1000)}</p>
                </div>
                <span className="text-3xl">🔢</span>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">English Rating</p>
                  <p className="text-2xl font-bold">{Math.round(adaptive.englishRating || 1000)}</p>
                </div>
                <span className="text-3xl">📚</span>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Science Rating</p>
                  <p className="text-2xl font-bold">{Math.round(adaptive.scienceRating || 1000)}</p>
                </div>
                <span className="text-3xl">🔬</span>
              </div>
            </Card>
          </div>

          {/* Action cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card
              variant="interactive"
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={handleContinueLearning}
            >
              <h3 className="text-lg font-bold mb-2">Continue Learning</h3>
              <p className="text-gray-600 mb-4">
                {session.lastGamePlayed 
                  ? `Resume: ${session.lastGamePlayed}`
                  : 'Start with recommended challenges'}
              </p>
              <Button variant="primary" size="small">
                Start →
              </Button>
            </Card>

            <Card
              variant="interactive"
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/progress')}
            >
              <h3 className="text-lg font-bold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Track your learning patterns and growth
              </p>
              <Button variant="secondary" size="small">
                View Analytics →
              </Button>
            </Card>
          </div>

          {/* Learning tip */}
          <Card className="p-4 bg-blue-50 border-l-4 border-blue-500">
            <p className="text-sm">
              <span className="font-bold">Pro Tip:</span> {dailyTip}
            </p>
          </Card>
        </>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {showWelcomeAnimation && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-purple-400 to-pink-400 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-white text-center"
            >
              <div className="text-8xl mb-4">🎮</div>
              <h1 className="text-4xl font-bold">Welcome Back!</h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: showWelcomeAnimation ? 0.5 : 0 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default HomePage;
