import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { pinService } from '../../services/auth/PINService';
import { avatarService, type Avatar } from '../../services/auth/AvatarService';
import type { ChildProfile } from '../../services/database/schema';

export interface ChildLoginProps {
  profile: ChildProfile;
  onLoginSuccess: () => void;
  onBack: () => void;
}

const ChildLoginComponent: React.FC<ChildLoginProps> = ({
  profile,
  onLoginSuccess,
  onBack
}) => {
  const { loginChild } = useAuth();
  const [currentAvatar, setCurrentAvatar] = useState<Avatar | null>(null);
  const [pin, setPin] = useState('');
  const [pinStatus, setPinStatus] = useState<any>(null);
  const [showPinInput, setShowPinInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const avatarVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.3,
        type: 'spring'
      }
    },
    tap: { scale: 0.95 }
  };

  const pinButtonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    hover: {
      scale: 1.05,
      backgroundColor: '#EBF8FF',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  useEffect(() => {
    loadProfileData();
  }, [profile.id]);

  const loadProfileData = async () => {
    try {
      // Load current avatar
      const avatar = await avatarService.getCurrentAvatar(profile.id);
      setCurrentAvatar(avatar);

      // Check PIN status
      const status = await pinService.getPINStatus(profile.id);
      setPinStatus(status);

      // Determine if PIN input should be shown
      setShowPinInput(status.hasPIN && !status.isLockedOut);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load profile information');
    }
  };

  const handleAvatarClick = async () => {
    if (pinStatus?.isLockedOut) {
      setError(`Account is temporarily locked. Try again later.`);
      return;
    }

    if (!pinStatus?.hasPIN) {
      // No PIN required, proceed with login
      await handleLogin();
    } else {
      // Show PIN input
      setShowPinInput(true);
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);

      // Auto-submit when PIN reaches required length
      if (newPin.length >= 4) {
        setTimeout(() => handlePinSubmit(newPin), 100);
      }
    }
  };

  const handlePinSubmit = async (submitPin: string = pin) => {
    if (submitPin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validate PIN
      const validation = await pinService.validatePIN(profile.id, submitPin);

      if (validation.isValid) {
        await handleLogin(submitPin);
      } else {
        setError(validation.error || 'Invalid PIN');
        setAttempts(prev => prev + 1);
        setPin('');

        if (validation.isLockedOut) {
          setShowPinInput(false);
        }

        // Shake animation on error
        const container = document.getElementById('pin-container');
        if (container) {
          container.classList.add('animate-shake');
          setTimeout(() => container.classList.remove('animate-shake'), 500);
        }
      }
    } catch (error) {
      console.error('PIN validation error:', error);
      setError('PIN validation failed');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (validPin?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginChild(profile.id, validPin);

      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Login failed');
        setPin('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const clearPin = () => {
    setPin('');
    setError(null);
  };

  const deletePinDigit = () => {
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  // Age-appropriate styling
  const getAgeAppropriateStyles = () => {
    const age = profile.ageGroup;

    if (age === '3-5') {
      return {
        avatarSize: 'w-32 h-32 text-6xl',
        nameSize: 'text-3xl',
        buttonSize: 'w-20 h-20 text-2xl',
        spacing: 'gap-8'
      };
    } else if (age === '6-8') {
      return {
        avatarSize: 'w-28 h-28 text-5xl',
        nameSize: 'text-2xl',
        buttonSize: 'w-16 h-16 text-xl',
        spacing: 'gap-6'
      };
    } else {
      return {
        avatarSize: 'w-24 h-24 text-4xl',
        nameSize: 'text-xl',
        buttonSize: 'w-14 h-14 text-lg',
        spacing: 'gap-4'
      };
    }
  };

  const styles = getAgeAppropriateStyles();

  if (pinStatus?.isLockedOut) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Account Locked</h2>
          <p className="text-gray-600 mb-6">
            Too many incorrect PIN attempts. Please try again later.
          </p>
          {pinStatus.lockoutExpiresAt && (
            <p className="text-sm text-gray-500 mb-6">
              Unlock at: {pinStatus.lockoutExpiresAt.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Profile Selection
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Profile Header */}
        <div className="text-center mb-8">
          {/* Avatar */}
          {currentAvatar && (
            <motion.div
              variants={avatarVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleAvatarClick}
              className={`${styles.avatarSize} mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center cursor-pointer border-4 border-blue-200 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <span className={styles.avatarSize.split(' ')[2]}>
                {currentAvatar.emoji}
              </span>
            </motion.div>
          )}

          {/* Name */}
          <motion.h2
            variants={avatarVariants}
            className={`${styles.nameSize} font-bold text-gray-800 mb-2`}
          >
            Hi, {profile.name}! 👋
          </motion.h2>

          {!showPinInput && (
            <motion.p
              variants={avatarVariants}
              className="text-gray-600"
            >
              {pinStatus?.hasPIN ? 'Tap your avatar to continue' : 'Tap your avatar to start learning!'}
            </motion.p>
          )}
        </div>

        {/* PIN Input Section */}
        <AnimatePresence>
          {showPinInput && (
            <motion.div
              id="pin-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              {/* PIN Display */}
              <div className="flex justify-center mb-6">
                <div className={`flex ${styles.spacing} mb-4`}>
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className={`${styles.buttonSize.split(' ')[0]} ${styles.buttonSize.split(' ')[1]} border-2 border-gray-300 rounded-full flex items-center justify-center ${
                        index < pin.length ? 'bg-blue-500 border-blue-500' : 'bg-gray-50'
                      }`}
                    >
                      {index < pin.length && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PIN Keypad */}
              <div className={`grid grid-cols-3 ${styles.spacing} max-w-xs mx-auto`}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <motion.button
                    key={digit}
                    variants={pinButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handlePinInput(digit.toString())}
                    disabled={isLoading || pin.length >= 6}
                    className={`${styles.buttonSize} bg-white border-2 border-gray-200 rounded-full font-bold text-gray-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50`}
                  >
                    {digit}
                  </motion.button>
                ))}

                {/* Clear Button */}
                <motion.button
                  variants={pinButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={clearPin}
                  disabled={isLoading}
                  className={`${styles.buttonSize} bg-red-50 border-2 border-red-200 rounded-full font-bold text-red-600 shadow-md hover:shadow-lg transition-all duration-200`}
                >
                  ✗
                </motion.button>

                {/* Zero Button */}
                <motion.button
                  variants={pinButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handlePinInput('0')}
                  disabled={isLoading || pin.length >= 6}
                  className={`${styles.buttonSize} bg-white border-2 border-gray-200 rounded-full font-bold text-gray-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50`}
                >
                  0
                </motion.button>

                {/* Delete Button */}
                <motion.button
                  variants={pinButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={deletePinDigit}
                  disabled={isLoading || pin.length === 0}
                  className={`${styles.buttonSize} bg-yellow-50 border-2 border-yellow-200 rounded-full font-bold text-yellow-600 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50`}
                >
                  ⌫
                </motion.button>
              </div>

              {/* Remaining Attempts */}
              {pinStatus?.remainingAttempts !== undefined && pinStatus.remainingAttempts < 5 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-orange-600">
                    {pinStatus.remainingAttempts} attempts remaining
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center"
            >
              <p className="text-red-600 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-4"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600 font-medium">Logging in...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Text */}
        {showPinInput && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Enter your PIN to continue
            </p>
          </div>
        )}
      </div>

      {/* Custom CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </motion.div>
  );
};

export default ChildLoginComponent;