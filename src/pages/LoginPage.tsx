import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { setStudent } from '@/store/slices/studentSlice';
import { Button } from '@/components/ui/Button';
import { useSound } from '@/hooks/useSound';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  
  const [mode, setMode] = useState<'select' | 'parent' | 'child'>('select');
  const [selectedAge, setSelectedAge] = useState<'3-5' | '6-8' | '9+' | null>(null);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  const avatars = [
    { id: 0, emoji: '🦁', name: 'Lion', color: 'from-yellow-400 to-orange-500' },
    { id: 1, emoji: '🐼', name: 'Panda', color: 'from-gray-300 to-gray-600' },
    { id: 2, emoji: '🦄', name: 'Unicorn', color: 'from-pink-400 to-purple-500' },
    { id: 3, emoji: '🐸', name: 'Frog', color: 'from-green-400 to-green-600' },
    { id: 4, emoji: '🦊', name: 'Fox', color: 'from-orange-400 to-red-500' },
    { id: 5, emoji: '🐧', name: 'Penguin', color: 'from-blue-300 to-blue-600' },
    { id: 6, emoji: '🦋', name: 'Butterfly', color: 'from-purple-400 to-pink-500' },
    { id: 7, emoji: '🐢', name: 'Turtle', color: 'from-green-300 to-teal-500' },
  ];

  const handleChildLogin = () => {
    if (username && selectedAge) {
      playSound('success');
      
      // Create student profile
      dispatch(setStudent({
        id: `student-${Date.now()}`,
        username,
        ageGroup: selectedAge,
        avatar: {
          id: avatars[selectedAvatar].id.toString(),
          type: 'character',
          colorScheme: avatars[selectedAvatar].color,
          accessories: [],
          unlocked: true,
        },
        learningStyle: 'mixed',
        skillLevels: new Map(),
        performanceHistory: [],
        currentZPD: {
          lowerBound: 900,
          upperBound: 1500,
          optimalDifficulty: 1200,
          recommendedSkills: [],
        },
        preferences: {
          soundEnabled: true,
          musicVolume: 0.5,
          effectsVolume: 0.7,
          subtitlesEnabled: false,
          colorMode: 'bright',
          fontSize: 'medium',
          animationSpeed: 'normal',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      navigate('/');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.9 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {mode === 'select' && (
          <motion.div
            key="select"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Welcome to LearnPlay! 🎮
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-center text-gray-600 mb-8 text-lg"
            >
              Who's playing today?
            </motion.p>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playSound('click');
                  setMode('child');
                }}
                className="w-full p-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl text-2xl font-bold shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-4xl mr-3">👦</span>
                I'm a Kid!
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playSound('click');
                  setMode('parent');
                }}
                className="w-full p-6 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-2xl text-2xl font-bold shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-4xl mr-3">👨‍👩‍👧</span>
                I'm a Parent
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {mode === 'child' && !selectedAge && (
          <motion.div
            key="age"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
          >
            <motion.button
              variants={itemVariants}
              onClick={() => {
                playSound('click');
                setMode('select');
              }}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Back
            </motion.button>
            
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-center mb-8 text-gray-800"
            >
              How old are you? 🎂
            </motion.h2>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
              {[
                { age: '3-5', emoji: '🧸', label: '3-5 years', color: 'from-yellow-400 to-orange-500' },
                { age: '6-8', emoji: '🎨', label: '6-8 years', color: 'from-green-400 to-teal-500' },
                { age: '9+', emoji: '🚀', label: '9+ years', color: 'from-blue-400 to-purple-500' },
              ].map((item) => (
                <motion.button
                  key={item.age}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playSound('click');
                    setSelectedAge(item.age as any);
                  }}
                  className={`p-6 bg-gradient-to-r ${item.color} text-white rounded-2xl text-xl font-bold shadow-lg hover:shadow-xl transition-all`}
                >
                  <span className="text-3xl mr-3">{item.emoji}</span>
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {mode === 'child' && selectedAge && (
          <motion.div
            key="profile"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
          >
            <motion.button
              variants={itemVariants}
              onClick={() => {
                playSound('click');
                setSelectedAge(null);
              }}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Back
            </motion.button>
            
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-center mb-8 text-gray-800"
            >
              Create Your Profile! ✨
            </motion.h2>
            
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                What's your name?
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Enter your name..."
                maxLength={20}
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Choose your avatar!
              </label>
              <div className="grid grid-cols-4 gap-4">
                {avatars.map((avatar, index) => (
                  <motion.button
                    key={avatar.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      playSound('pop');
                      setSelectedAvatar(index);
                    }}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${avatar.color} ${
                      selectedAvatar === index
                        ? 'ring-4 ring-purple-500 ring-offset-2'
                        : ''
                    } transition-all`}
                  >
                    <div className="text-5xl">{avatar.emoji}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button
                ageGroup={selectedAge}
                variant="primary"
                onClick={handleChildLogin}
                disabled={!username}
                fullWidth
                size="large"
              >
                <span className="text-2xl">Let's Play! 🎮</span>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {mode === 'parent' && (
          <motion.div
            key="parent"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <motion.button
              variants={itemVariants}
              onClick={() => {
                playSound('click');
                setMode('select');
              }}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Back
            </motion.button>
            
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-center mb-8 text-gray-800"
            >
              Parent Dashboard
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
              />
              
              <button
                onClick={() => navigate('/parent-dashboard')}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
              
              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <a href="#" className="text-purple-600 hover:underline">
                  Sign up
                </a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;