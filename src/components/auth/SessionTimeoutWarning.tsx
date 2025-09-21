import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { sessionManager } from '../../services/auth/SessionManager';

export interface SessionTimeoutWarningProps {
  isVisible: boolean;
  remainingMinutes: number;
  userType: 'parent' | 'child';
  onExtend: () => void;
  onLogout: () => void;
  onDismiss: () => void;
}

const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  isVisible,
  remainingMinutes,
  userType,
  onExtend,
  onLogout,
  onDismiss
}) => {
  const [countdown, setCountdown] = useState(remainingMinutes * 60); // Convert to seconds
  const [canExtend, setCanExtend] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setCountdown(remainingMinutes * 60);

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Auto-logout when countdown reaches 0
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, remainingMinutes, onLogout]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getChildFriendlyMessage = () => {
    if (countdown > 120) {
      return {
        title: "Time for a break soon! 🎮",
        message: "You've been learning for a while. Your session will end in a few minutes.",
        emoji: "⏰"
      };
    } else if (countdown > 60) {
      return {
        title: "Almost time to go! 👋",
        message: "Your learning time is almost up. Save your progress!",
        emoji: "💾"
      };
    } else {
      return {
        title: "Time to say goodbye! 🌟",
        message: "Your session is ending now. Great job learning today!",
        emoji: "⭐"
      };
    }
  };

  const getParentMessage = () => {
    return {
      title: "Session Timeout Warning",
      message: `Your session will expire in ${formatTime(countdown)} due to inactivity.`,
      emoji: "⚠️"
    };
  };

  const message = userType === 'child' ? getChildFriendlyMessage() : getParentMessage();

  // Age-appropriate styling
  const getAgeAppropriateStyles = () => {
    if (userType === 'child') {
      return {
        container: 'bg-gradient-to-br from-orange-100 to-red-100 border-4 border-orange-300',
        title: 'text-2xl font-bold text-orange-800',
        message: 'text-lg text-orange-700',
        buttons: 'text-lg py-3 px-6 rounded-2xl font-bold',
        emoji: 'text-4xl'
      };
    } else {
      return {
        container: 'bg-white border border-yellow-300 shadow-lg',
        title: 'text-xl font-semibold text-gray-800',
        message: 'text-gray-600',
        buttons: 'text-sm py-2 px-4 rounded-lg font-medium',
        emoji: 'text-2xl'
      };
    }
  };

  const styles = getAgeAppropriateStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className={`${styles.container} rounded-3xl p-6 max-w-md w-full text-center`}
          >
            {/* Emoji */}
            <div className={`${styles.emoji} mb-4`}>
              {message.emoji}
            </div>

            {/* Title */}
            <h2 className={`${styles.title} mb-3`}>
              {message.title}
            </h2>

            {/* Message */}
            <p className={`${styles.message} mb-4`}>
              {message.message}
            </p>

            {/* Countdown Display */}
            <div className="mb-6">
              <div className={`inline-block px-4 py-2 rounded-full ${
                userType === 'child'
                  ? 'bg-orange-200 text-orange-800 text-xl font-bold'
                  : 'bg-yellow-100 text-yellow-800 text-lg font-semibold'
              }`}>
                {formatTime(countdown)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {userType === 'parent' && canExtend && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onExtend}
                  className={`${styles.buttons} bg-blue-600 text-white hover:bg-blue-700 transition-colors`}
                >
                  Extend Session (15 minutes)
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLogout}
                className={`${styles.buttons} ${
                  userType === 'child'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-600 text-white hover:bg-red-700'
                } transition-colors`}
              >
                {userType === 'child' ? 'Finish Learning 🌟' : 'Logout Now'}
              </motion.button>

              {userType === 'parent' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDismiss}
                  className={`${styles.buttons} bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors`}
                >
                  Continue Session
                </motion.button>
              )}
            </div>

            {/* Child-specific encouragement */}
            {userType === 'child' && (
              <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-xl">
                <p className="text-sm text-orange-700 font-medium">
                  You did amazing today! 🎉 Come back anytime to learn more!
                </p>
              </div>
            )}

            {/* Extension limit warning for parents */}
            {userType === 'parent' && !canExtend && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-700">
                  Maximum session extensions reached. Please log in again for security.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to manage session timeout warnings
export const useSessionTimeout = () => {
  const { logout, refreshAuth, isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleSessionEvent = (event: CustomEvent) => {
      const { type, data } = event.detail;

      switch (type) {
        case 'timeout_warning':
          setShowWarning(true);
          setRemainingMinutes(data.remainingMinutes);
          setUserType(data.userType);
          break;

        case 'session_timeout':
          setShowWarning(false);
          logout();
          break;

        case 'session_extended':
          setShowWarning(false);
          break;
      }
    };

    // Listen for session events
    window.addEventListener('session-event', handleSessionEvent as EventListener);

    return () => {
      window.removeEventListener('session-event', handleSessionEvent as EventListener);
    };
  }, [isAuthenticated, logout]);

  const extendSession = async () => {
    try {
      // This would integrate with the SessionManager
      const success = await refreshAuth();

      if (success) {
        setShowWarning(false);

        // Emit extension event
        window.dispatchEvent(new CustomEvent('session-event', {
          detail: { type: 'session_extended', data: {} }
        }));
      }
    } catch (error) {
      console.error('Error extending session:', error);
    }
  };

  const handleLogout = async () => {
    setShowWarning(false);
    await logout();
  };

  const dismissWarning = () => {
    setShowWarning(false);
  };

  return {
    showWarning,
    remainingMinutes,
    userType,
    extendSession,
    handleLogout,
    dismissWarning,
    SessionTimeoutWarning: (props: Partial<SessionTimeoutWarningProps>) => (
      <SessionTimeoutWarning
        isVisible={showWarning}
        remainingMinutes={remainingMinutes}
        userType={userType}
        onExtend={extendSession}
        onLogout={handleLogout}
        onDismiss={dismissWarning}
        {...props}
      />
    )
  };
};

export default SessionTimeoutWarning;