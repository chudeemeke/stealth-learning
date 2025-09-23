import React, { useState, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { setStudent } from '@/store/slices/studentSlice';
import { Button } from '@/components/ui/Button';
import { useSound } from '@/hooks/useSound';
// TEMPORARILY DISABLED FOR TESTING
// import { AuthService, type ParentCredentials, type ParentSignupData } from '@/services/auth/AuthService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  
  const [mode, setMode] = useState<'select' | 'parent' | 'parent-signup' | 'child'>('select');
  const [selectedAge, setSelectedAge] = useState<'3-5' | '6-8' | '9+' | null>(null);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentName, setParentName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

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
          ['math', { level: 1, mastery: 0, lastUpdated: new Date() }],
          ['english', { level: 1, mastery: 0, lastUpdated: new Date() }],
          ['science', { level: 1, mastery: 0, lastUpdated: new Date() }]
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Dispatch Redux action and wait for state update
      dispatch(setStudent(childProfile));

      // Use startTransition to prevent Suspense error during navigation
      React.startTransition(() => {
        // Small delay to ensure Redux state is fully updated
        setTimeout(() => {
          navigate('/');
        }, 100);
      });
    }
  };

  const handleParentLogin = async () => {
    setIsLoading(true);
    setAuthError('');

    try {
      // TEMPORARILY DISABLED FOR TESTING
      // const credentials: ParentCredentials = {
      //   email: parentEmail,
      //   password: parentPassword,
      // };

      // const result = await AuthService.signIn(credentials);
      const result = { success: true, user: { id: 'temp', name: 'Temp Parent', email: parentEmail } };

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
          ['math', { level: 1, mastery: 0, lastUpdated: new Date() }],
          ['english', { level: 1, mastery: 0, lastUpdated: new Date() }],
          ['science', { level: 1, mastery: 0, lastUpdated: new Date() }]
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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

  const handleParentSignup = async () => {
    setIsLoading(true);
    setAuthError('');

    try {
      // TEMPORARILY DISABLED FOR TESTING
      // const signupData: ParentSignupData = {
      //   name: parentName,
      //   email: parentEmail,
      //   password: parentPassword,
      //   confirmPassword: confirmPassword,
      // };

      // const result = await AuthService.signUp(signupData);
      const result = { success: true, user: { id: 'temp', name: parentName, email: parentEmail } };

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
          ['math', { level: 1, mastery: 0, lastUpdated: new Date() }],
          ['english', { level: 1, mastery: 0, lastUpdated: new Date() }],
          ['science', { level: 1, mastery: 0, lastUpdated: new Date() }]
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex items-center justify-center p-4">
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
              className="text-4xl font-bold text-center mb-8 text-blue-600"
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
                className="w-full p-6 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-2xl text-2xl font-bold shadow-lg hover:shadow-xl transition-shadow"
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
                className="w-full p-4 text-xl text-gray-800 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
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
                    setMode('parent-signup');
                    setAuthError('');
                  }}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  Sign up
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}

        {mode === 'parent-signup' && (
          <motion.div
            key="parent-signup"
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
                setMode('parent');
                setAuthError('');
              }}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ← Back to Sign In
            </motion.button>

            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-center mb-8 text-gray-800"
            >
              Create Parent Account
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-4">
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
                    setMode('parent');
                    setAuthError('');
                  }}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;