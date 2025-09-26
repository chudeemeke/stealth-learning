import React, { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAppDispatch } from '@/store';
import { setStudent } from '@/store/slices/studentSlice';
import type { Subject, MasteryLevel } from '@/types';
import { Button } from '@/components/ui/Button';
import { useSound } from '@/hooks/useSound';
// Authentication service for parent login/signup
import { AuthService, type ParentCredentials, type ParentSignupData } from '@/services/auth/AuthService';

// Type for view modes - now handles everything inline!
type ViewMode = 'select' | 'child-age' | 'child-profile' | 'parent' | 'parent-signup';

const UltraKidsLandingSimple: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();

  // View mode state - controls what form to show
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited'>('happy');

  // Child login states
  const [selectedAge, setSelectedAge] = useState<'3-5' | '6-8' | '9+' | null>(null);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  // Parent login/signup states
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Avatar options
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

  // Handle kid button click - now shows inline form instead of navigating
  const handleKidClick = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
    playSound('click');
    setViewMode('child-age');
  };

  // Handle parent button click - now shows inline form instead of navigating
  const handleParentClick = () => {
    playSound('click');
    setViewMode('parent');
  };

  // Handle child login submission
  const handleChildLogin = async () => {
    if (username && selectedAge) {
      playSound('success');

      // Create child profile for Redux
      const childProfile = {
        id: `child-${Date.now()}`,
        username,
        name: username,
        ageGroup: selectedAge,
        avatar: {
          id: selectedAvatar.toString(),
          type: 'character' as const,
          colorScheme: avatars[selectedAvatar].color,
          accessories: [],
          unlocked: true,
        },
        learningStyle: 'visual' as const,
        skillLevels: new Map([
          ['math', { skill: 'basic-math', subject: 'mathematics' as Subject, currentRating: 1000, confidence: 0.5, lastAssessed: new Date(), masteryLevel: 'novice' as MasteryLevel, totalAttempts: 0, successfulAttempts: 0 }],
          ['english', { skill: 'basic-english', subject: 'english' as Subject, currentRating: 1000, confidence: 0.5, lastAssessed: new Date(), masteryLevel: 'novice' as MasteryLevel, totalAttempts: 0, successfulAttempts: 0 }],
          ['science', { skill: 'basic-science', subject: 'science' as Subject, currentRating: 1000, confidence: 0.5, lastAssessed: new Date(), masteryLevel: 'novice' as MasteryLevel, totalAttempts: 0, successfulAttempts: 0 }]
        ]),
        performanceHistory: [],
        currentZPD: {
          lowerBound: selectedAge === '3-5' ? 1 : selectedAge === '6-8' ? 2 : 3,
          upperBound: selectedAge === '3-5' ? 3 : selectedAge === '6-8' ? 5 : 7,
          optimalDifficulty: selectedAge === '3-5' ? 2 : selectedAge === '6-8' ? 3 : 4,
          recommendedSkills: [],
        },
        preferences: {
          soundEnabled: true,
          musicVolume: 0.5,
          effectsVolume: 0.7,
          subtitlesEnabled: false,
          colorMode: 'bright' as const,
          fontSize: 'medium' as const,
          animationSpeed: 'normal' as const,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Dispatch Redux action and wait for state update
      dispatch(setStudent(childProfile));

      // Use startTransition to prevent Suspense error during navigation
      startTransition(() => {
        // Small delay to ensure Redux state is fully updated
        setTimeout(() => {
          navigate('/');
        }, 100);
      });
    }
  };

  // Handle parent login submission
  const handleParentLogin = async () => {
    setIsLoading(true);
    setAuthError('');

    try {
      // Create credentials object
      const credentials: ParentCredentials = {
        email: parentEmail,
        password: parentPassword,
      };

      // Use proper authentication service
      const result = await AuthService.signIn(credentials);

      if (result.success && result.user) {
        playSound('success');

        // Create parent profile with authenticated user data
        const parentProfile = {
          id: result.user.id,
          username: result.user.email,
          name: result.user.name,
          ageGroup: '9+' as const,
          avatar: {
            id: '0',
            type: 'character' as const,
            colorScheme: 'from-blue-400 to-purple-500',
            accessories: [],
            unlocked: true,
          },
          learningStyle: 'visual' as const,
          skillLevels: new Map([
            ['math', { skill: 'basic-math', subject: 'mathematics' as Subject, currentRating: 1000, confidence: 0.5, lastAssessed: new Date(), masteryLevel: 'novice' as MasteryLevel, totalAttempts: 0, successfulAttempts: 0 }],
            ['english', { skill: 'basic-english', subject: 'english' as Subject, currentRating: 1000, confidence: 0.5, lastAssessed: new Date(), masteryLevel: 'novice' as MasteryLevel, totalAttempts: 0, successfulAttempts: 0 }],
            ['science', { skill: 'basic-science', subject: 'science' as Subject, currentRating: 1000, confidence: 0.5, lastAssessed: new Date(), masteryLevel: 'novice' as MasteryLevel, totalAttempts: 0, successfulAttempts: 0 }]
          ]),
          performanceHistory: [],
          currentZPD: {
            lowerBound: 1,
            upperBound: 5,
            optimalDifficulty: 3,
            recommendedSkills: [],
          },
          preferences: {
            soundEnabled: true,
            musicVolume: 0.5,
            effectsVolume: 0.7,
            subtitlesEnabled: false,
            colorMode: 'bright' as const,
            fontSize: 'medium' as const,
            animationSpeed: 'normal' as const,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        dispatch(setStudent(parentProfile));
        navigate('/parent-dashboard');
      } else {
        setAuthError(result.message);
        playSound('error');
      }
    } catch (error) {
      console.error('Parent login failed:', error);
      setAuthError('Login failed. Please try again.');
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle parent signup submission
  const handleParentSignup = async () => {
    setIsLoading(true);
    setAuthError('');

    try {
      // Create signup data object
      const signupData: ParentSignupData = {
        name: parentName,
        email: parentEmail,
        password: parentPassword,
        confirmPassword: confirmPassword,
      };

      // Use proper authentication service for signup
      const result = await AuthService.signUp(signupData);

      if (result.success && result.user) {
        playSound('success');

        // Auto-login after successful signup
        const parentProfile = {
          id: result.user.id,
          username: result.user.email,
          name: result.user.name,
          ageGroup: '9+' as const,
          avatar: {
            id: '0',
            type: 'character' as const,
            colorScheme: 'from-green-400 to-blue-500',
            accessories: [],
            unlocked: true,
          },
          learningStyle: 'visual' as const,
          skillLevels: new Map([
            ['math', { skill: 'basic-math', subject: 'mathematics' as Subject, currentRating: 1000, confidence: 0.5, lastAssessed: new Date(), masteryLevel: 'novice' as MasteryLevel, totalAttempts: 0, successfulAttempts: 0 }],
            ['english', { skill: 'basic-english', subject: 'english' as Subject, currentRating: 1000, confidence: 0.5, lastAssessed: new Date(), masteryLevel: 'novice' as MasteryLevel, totalAttempts: 0, successfulAttempts: 0 }],
            ['science', { skill: 'basic-science', subject: 'science' as Subject, currentRating: 1000, confidence: 0.5, lastAssessed: new Date(), masteryLevel: 'novice' as MasteryLevel, totalAttempts: 0, successfulAttempts: 0 }]
          ]),
          performanceHistory: [],
          currentZPD: {
            lowerBound: 1,
            upperBound: 5,
            optimalDifficulty: 3,
            recommendedSkills: [],
          },
          preferences: {
            soundEnabled: true,
            musicVolume: 0.5,
            effectsVolume: 0.7,
            subtitlesEnabled: false,
            colorMode: 'bright' as const,
            fontSize: 'medium' as const,
            animationSpeed: 'normal' as const,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        dispatch(setStudent(parentProfile));
        navigate('/parent-dashboard');
      } else {
        setAuthError(result.message);
        playSound('error');
      }
    } catch (error) {
      console.error('Parent signup failed:', error);
      setAuthError('Signup failed. Please try again.');
      playSound('error');
    } finally {
      setIsLoading(false);
    }
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

      <AnimatePresence mode="wait">
        {/* SELECTION VIEW - Initial landing page */}
        {viewMode === 'select' && (
          <motion.div
            key="select"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
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
                <div className="text-8xl relative">
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
        )}

        {/* CHILD AGE SELECTION VIEW */}
        {viewMode === 'child-age' && (
          <motion.div
            key="child-age"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-8 max-w-lg w-full relative z-10"
          >
            <motion.button
              onClick={() => {
                playSound('click');
                setViewMode('select');
              }}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Back
            </motion.button>

            <motion.h2
              className="text-3xl font-bold text-center mb-8 text-gray-800"
            >
              How old are you? 🎂
            </motion.h2>

            <div className="grid grid-cols-1 gap-4">
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
                    setViewMode('child-profile');
                  }}
                  className={`p-6 bg-gradient-to-r ${item.color} text-white rounded-2xl text-xl font-bold shadow-lg hover:shadow-xl transition-all`}
                >
                  <span className="text-3xl mr-3">{item.emoji}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* CHILD PROFILE CREATION VIEW */}
        {viewMode === 'child-profile' && selectedAge && (
          <motion.div
            key="child-profile"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-8 max-w-2xl w-full relative z-10"
          >
            <motion.button
              onClick={() => {
                playSound('click');
                setViewMode('child-age');
              }}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Back
            </motion.button>

            <motion.h2
              className="text-3xl font-bold text-center mb-8 text-gray-800"
            >
              Create Your Profile! ✨
            </motion.h2>

            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                What's your name?
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 text-xl text-gray-800 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                placeholder="Enter your name..."
                maxLength={20}
              />
            </div>

            <div className="mb-8">
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
            </div>

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
        )}

        {/* PARENT LOGIN VIEW */}
        {viewMode === 'parent' && (
          <motion.div
            key="parent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-8 max-w-md w-full relative z-10"
          >
            <motion.button
              onClick={() => {
                playSound('click');
                setViewMode('select');
                setAuthError('');
              }}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Back
            </motion.button>

            <motion.h2
              className="text-3xl font-bold text-center mb-8 text-gray-800"
            >
              Parent Dashboard
            </motion.h2>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full p-4 text-gray-800 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={parentPassword}
                onChange={(e) => setParentPassword(e.target.value)}
                className="w-full p-4 text-gray-800 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
              />

              <button
                onClick={handleParentLogin}
                disabled={!parentEmail || !parentPassword || isLoading}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              {authError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {authError}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm mb-4">
                <strong>Demo Credentials:</strong><br/>
                Email: parent@demo.com<br/>
                Password: demo123
              </div>

              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    playSound('click');
                    setViewMode('parent-signup');
                    setAuthError('');
                  }}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  Sign up
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* PARENT SIGNUP VIEW */}
        {viewMode === 'parent-signup' && (
          <motion.div
            key="parent-signup"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl p-8 max-w-md w-full relative z-10"
          >
            <motion.button
              onClick={() => {
                playSound('click');
                setViewMode('parent');
                setAuthError('');
              }}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Back to Sign In
            </motion.button>

            <motion.h2
              className="text-3xl font-bold text-center mb-8 text-gray-800"
            >
              Create Parent Account
            </motion.h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full p-4 text-gray-800 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full p-4 text-gray-800 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={parentPassword}
                onChange={(e) => setParentPassword(e.target.value)}
                className="w-full p-4 text-gray-800 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 text-gray-800 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
              />

              <button
                onClick={handleParentSignup}
                disabled={!parentName || !parentEmail || !parentPassword || !confirmPassword || isLoading}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              {authError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {authError}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
                <strong>Demo Credentials:</strong><br/>
                Email: parent@demo.com<br/>
                Password: demo123
              </div>

              <p className="text-center text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    playSound('click');
                    setViewMode('parent');
                    setAuthError('');
                  }}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UltraKidsLandingSimple;