import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/store';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const student = useAppSelector(state => state.student);
  
  const ageGroup = student.profile?.ageGroup || 
    (student.profile?.age 
      ? student.profile.age <= 5 ? '3-5' 
      : student.profile.age <= 8 ? '6-8' 
      : '9+' 
      : '6-8');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Hide reconnected message after 3 seconds
      setTimeout(() => setShowReconnected(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection status periodically
    const interval = setInterval(() => {
      const online = navigator.onLine;
      if (online !== isOnline) {
        if (online) {
          handleOnline();
        } else {
          handleOffline();
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  // Age-appropriate messages
  const getOfflineMessage = () => {
    if (ageGroup === '3-5') {
      return {
        icon: '🌐',
        title: 'No Internet!',
        message: 'But you can still play games!',
        character: '🦖'
      };
    } else if (ageGroup === '6-8') {
      return {
        icon: '📡',
        title: 'Offline Mode',
        message: 'Keep playing! We\'ll save your progress.',
        character: '🚀'
      };
    } else {
      return {
        icon: '⚠️',
        title: 'You\'re Offline',
        message: 'Your progress will sync when reconnected.',
        character: null
      };
    }
  };

  const getReconnectedMessage = () => {
    if (ageGroup === '3-5') {
      return 'Yay! Internet is back! 🎉';
    } else if (ageGroup === '6-8') {
      return 'Connected! Progress saved! ✅';
    } else {
      return 'Connection restored. Syncing...';
    }
  };

  const offlineContent = getOfflineMessage();
  const reconnectedMessage = getReconnectedMessage();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className={`
            fixed top-0 left-0 right-0 z-50 
            ${ageGroup === '3-5' || ageGroup === '6-8' 
              ? 'bg-gradient-to-r from-orange-400 to-red-400' 
              : 'bg-yellow-500'}
            text-white shadow-lg
          `}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              {offlineContent.character && (
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  {offlineContent.character}
                </motion.span>
              )}
              <span className="text-2xl">{offlineContent.icon}</span>
              <div className="text-center">
                <p className="font-bold text-sm">{offlineContent.title}</p>
                <p className="text-xs opacity-90">{offlineContent.message}</p>
              </div>
            </div>
            
            {/* Progress indicator for older kids */}
            {ageGroup === '9+' && (
              <div className="mt-2 flex justify-center">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Reconnection success message */}
      {showReconnected && isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              <motion.span
                className="text-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                ✅
              </motion.span>
              <p className="font-bold text-sm">{reconnectedMessage}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Support both named and default exports
export { OfflineIndicator };
export default OfflineIndicator;
