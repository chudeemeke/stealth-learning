import React, { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAppDispatch } from '@/store';
import { setStudent } from '@/store/slices/studentSlice';
import type { Subject, MasteryLevel } from '@/types';
import { Button } from '@/components/ui/Button';
import { useSound } from '@/hooks/useSound';
import { AuthService, type ParentCredentials, type ParentSignupData } from '@/services/auth/AuthService';
import DesignSystem from '@/styles/design-system';
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles, Star, Heart, Trophy, Zap, Users, User } from 'lucide-react';
import { SecureInput } from '@/components/ui/SecureInput';

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
      className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${DesignSystem.colors.primary[50]} 0%, ${DesignSystem.colors.accent[100]} 25%, ${DesignSystem.colors.secondary[50]} 50%, ${DesignSystem.colors.primary[100]} 75%, ${DesignSystem.colors.accent[50]} 100%)`,
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        .fade-in { animation: fadeIn 300ms cubic-bezier(0.4, 0, 0.2, 1); }
        .scale-in { animation: scaleIn 400ms cubic-bezier(0.34, 1.56, 0.64, 1); }
        .progress-fill { animation: progressFill 1s cubic-bezier(0.4, 0, 0.2, 1); }

        /* Duolingo's actual timing functions */
        :root {
          --duo-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
          --duo-ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
          --duo-ease-in-out-soft: cubic-bezier(0.42, 0, 0.58, 1);
        }
      `}</style>

      {/* Duolingo-style achievement indicators */}
      <div className="absolute top-8 right-8 flex gap-3 z-20">
        {[Trophy, Star, Zap].map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.1,
              duration: 0.3,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
          >
            <Icon
              size={24}
              color={DesignSystem.colors.accent[500]}
              fill={index === 0 ? DesignSystem.colors.accent[500] : 'none'}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* SELECTION VIEW - Initial landing page */}
        {viewMode === 'select' && (
          <motion.div
            key="select"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 1
            }}
            className="relative z-10"
          >
            {/* Main Content Card - Airbnb clean + Duolingo playful */}
            <div
              className="card-duolingo bg-white/98 backdrop-blur-xl rounded-[2rem] p-12 max-w-2xl mx-auto relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${DesignSystem.colors.neutral[0]} 0%, ${DesignSystem.colors.primary[50]} 100%)`,
                boxShadow: DesignSystem.effects.shadows.playful.green,
                border: `3px solid ${DesignSystem.colors.primary[300]}`,
                transition: DesignSystem.animation.transitions.spring
              }}
            >
              {/* Security badge - top right */}
              <div className="absolute top-4 right-4 security-badge security-badge--secure">
                <Shield size={16} />
                <span>Secure</span>
              </div>

              {/* Achievement stars - Duolingo style */}
              <div className="absolute top-4 left-4 flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  >
                    <Star
                      size={24}
                      fill={i < 2 ? DesignSystem.colors.accent[400] : 'transparent'}
                      color={DesignSystem.colors.accent[400]}
                    />
                  </motion.div>
                ))}
              </div>

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
                    fontFamily: DesignSystem.typography.fonts.heading,
                    background: `linear-gradient(90deg, ${DesignSystem.colors.primary[500]}, ${DesignSystem.colors.accent[500]}, ${DesignSystem.colors.secondary[500]})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    backgroundSize: '200% 100%',
                    animation: 'gradient 3s ease infinite',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Welcome to
                </h1>
                <motion.div
                  className="text-5xl font-black flex items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <span style={{
                    fontFamily: DesignSystem.typography.fonts.display,
                    background: `linear-gradient(45deg, ${DesignSystem.colors.primary[600]}, ${DesignSystem.colors.secondary[500]})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '-0.02em'
                  }}>
                    Stealth Learning
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Trophy size={48} color={DesignSystem.colors.accent[500]} />
                  </motion.div>
                </motion.div>
                <motion.p
                  className="mt-4 text-lg"
                  style={{ color: DesignSystem.colors.neutral[600], fontFamily: DesignSystem.typography.fonts.body }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  Where education meets adventure!
                </motion.p>
              </motion.div>

              {/* Mascot */}
              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
              >
                <div className="text-8xl relative">
                  🦉
                  <motion.div
                    className="text-3xl absolute -top-2 -right-2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.3 }}
                  >
                    💡
                  </motion.div>
                </div>
              </motion.div>

              {/* Question */}
              <motion.h2
                className="text-3xl font-bold text-center mb-8 text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.3 }}
              >
                Who's playing today?
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
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleKidClick}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <User size={32} />
                    <span>I'm a Kid!</span>
                    <Sparkles size={32} />
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

                </motion.button>

                {/* Parent Button - Professional but fun */}
                <motion.button
                  className="w-full px-8 py-4 text-2xl font-bold rounded-3xl text-white shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleParentClick}
                >
                  <span className="flex items-center justify-center gap-3">
                    <Users size={28} />
                    <span>I'm a Parent</span>
                    <Shield size={28} />
                  </span>
                </motion.button>
              </div>

              {/* Fun Fact */}
              <motion.div
                className="mt-8 p-4 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-2xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="flex items-center justify-center gap-2 text-lg font-semibold text-purple-800">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Zap size={24} color={DesignSystem.colors.accent[500]} />
                  </motion.div>
                  <span>Did you know? Learning is 300% more fun with games!</span>
                </div>
              </motion.div>

              {/* Achievement Preview - Duolingo badges style */}
              <div className="mt-6 flex justify-center gap-4">
                {[Trophy, Star, Heart, Zap, Shield].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="cursor-pointer p-3 rounded-full"
                    style={{
                      background: index < 2 ? DesignSystem.colors.accent[100] : DesignSystem.colors.neutral[100],
                      border: `2px solid ${index < 2 ? DesignSystem.colors.accent[400] : DesignSystem.colors.neutral[300]}`
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
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
                    <Icon
                      size={24}
                      color={index < 2 ? DesignSystem.colors.accent[600] : DesignSystem.colors.neutral[400]}
                      fill={index < 2 ? DesignSystem.colors.accent[600] : 'none'}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* CHILD AGE SELECTION VIEW - Duolingo style */}
        {viewMode === 'child-age' && (
          <motion.div
            key="child-age"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="card-duolingo backdrop-blur-xl rounded-[2rem] p-8 max-w-lg w-full relative z-10"
            style={{
              background: `linear-gradient(135deg, ${DesignSystem.colors.neutral[0]} 0%, ${DesignSystem.colors.primary[50]} 100%)`,
              boxShadow: DesignSystem.effects.shadows.playful.green,
              border: `3px solid ${DesignSystem.colors.primary[300]}`
            }}
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
              className="text-3xl font-bold text-center mb-8"
              style={{
                color: DesignSystem.colors.neutral[800],
                fontFamily: DesignSystem.typography.fonts.heading
              }}
            >
              How old are you? 🎂
            </motion.h2>

            <div className="grid grid-cols-1 gap-4">
              {[
                { age: '3-5', icon: Star, label: '3-5 years', color: DesignSystem.colors.accent },
                { age: '6-8', icon: Zap, label: '6-8 years', color: DesignSystem.colors.primary },
                { age: '9+', icon: Trophy, label: '9+ years', color: DesignSystem.colors.secondary },
              ].map((item) => (
                <motion.button
                  key={item.age}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playSound('click');
                    setSelectedAge(item.age as any);
                    setViewMode('child-profile');
                  }}
                  className="p-6 text-white rounded-xl text-xl font-bold transition-all relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${item.color[400]} 0%, ${item.color[500]} 100%)`,
                    boxShadow: DesignSystem.effects.shadows.playful.green,
                    fontFamily: DesignSystem.typography.fonts.heading
                  }}
                >
                  <span className="flex items-center justify-center gap-3">
                    <item.icon size={28} className="text-white" />
                    <span>{item.label}</span>
                    <Sparkles size={24} className="text-yellow-300" />
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* CHILD PROFILE CREATION VIEW - Duolingo style */}
        {viewMode === 'child-profile' && selectedAge && (
          <motion.div
            key="child-profile"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="card-duolingo backdrop-blur-xl rounded-[2rem] p-8 max-w-2xl w-full relative z-10"
            style={{
              background: `linear-gradient(135deg, ${DesignSystem.colors.neutral[0]} 0%, ${DesignSystem.colors.accent[50]} 100%)`,
              boxShadow: DesignSystem.effects.shadows.playful.gold,
              border: `3px solid ${DesignSystem.colors.accent[300]}`
            }}
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
              className="text-3xl font-bold text-center mb-8"
              style={{
                color: DesignSystem.colors.neutral[800],
                fontFamily: DesignSystem.typography.fonts.heading
              }}
            >
              Create Your Profile! ✨
            </motion.h2>

            <div className="mb-6">
              <label className="block text-lg font-semibold mb-2" style={{ color: DesignSystem.colors.neutral[700], fontFamily: DesignSystem.typography.fonts.body }}>
                What's your name?
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-secure w-full p-4 text-xl rounded-xl transition-all"
                style={{
                  borderColor: username ? DesignSystem.colors.primary[400] : DesignSystem.colors.neutral[200],
                  fontFamily: DesignSystem.typography.fonts.body
                }}
                placeholder="Enter your name..."
                maxLength={20}
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-semibold mb-4" style={{ color: DesignSystem.colors.neutral[700], fontFamily: DesignSystem.typography.fonts.body }}>
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

        {/* PARENT LOGIN VIEW - Airbnb clean style */}
        {viewMode === 'parent' && (
          <motion.div
            key="parent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="card-airbnb backdrop-blur-xl rounded-xl p-8 max-w-md w-full relative z-10"
            style={{
              background: DesignSystem.colors.neutral[0],
              boxShadow: DesignSystem.effects.shadows.xl,
              border: `1px solid ${DesignSystem.colors.neutral[200]}`
            }}
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
              <SecureInput
                label="Email Address"
                inputType="email"
                placeholder="parent@example.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                validation="email"
                required
                privacy="pii"
                variant="outlined"
                ageGroup="9+"
                animated
                floatingLabel
              />
              <SecureInput
                label="Password"
                inputType="password"
                placeholder="Enter your password"
                value={parentPassword}
                onChange={(e) => setParentPassword(e.target.value)}
                validation="password"
                required
                privacy="sensitive"
                variant="outlined"
                ageGroup="9+"
                showPasswordToggle
                strengthIndicator
                animated
                floatingLabel
              />

              <motion.button
                onClick={handleParentLogin}
                disabled={!parentEmail || !parentPassword || isLoading}
                className="btn-primary w-full p-4 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${DesignSystem.colors.primary[500]} 0%, ${DesignSystem.colors.primary[600]} 100%)`,
                  boxShadow: DesignSystem.effects?.shadows?.lg,
                  fontFamily: DesignSystem.typography.fonts.heading
                }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield size={20} />
                    Sign In Securely
                  </span>
                )}
              </motion.button>

              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 rounded-lg flex items-center gap-2"
                  style={{
                    background: `${DesignSystem.colors.error}15`,
                    border: `1px solid ${DesignSystem.colors.error}`,
                    color: DesignSystem.colors.error
                  }}
                >
                  <AlertCircle size={20} />
                  {authError}
                </motion.div>
              )}

              <motion.div
                className="px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2"
                style={{
                  background: `linear-gradient(135deg, ${DesignSystem.colors.primary[50]}, ${DesignSystem.colors.accent[50]})`,
                  border: `1px solid ${DesignSystem.colors.primary[200]}`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles size={16} color={DesignSystem.colors.primary[500]} className="mt-1" />
                <div style={{ color: DesignSystem.colors.neutral[700] }}>
                  <strong>Demo Credentials:</strong><br/>
                  Email: parent@demo.com<br/>
                  Password: DemoPass123!
                </div>
              </motion.div>

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