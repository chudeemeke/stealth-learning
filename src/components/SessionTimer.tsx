import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateSessionTime, pauseSession, completeSession } from '@/store/slices/sessionSlice';
import { addAchievement } from '@/store/slices/studentSlice';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import FeedbackModal from './ui/FeedbackModal';

const SessionTimer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();
  
  const session = useAppSelector(state => state.session);
  const student = useAppSelector(state => state.student);
  const settings = useAppSelector(state => state.settings);
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  
  const ageGroup = student.profile?.ageGroup || 
    (student.profile?.age 
      ? student.profile.age <= 5 ? '3-5' 
      : student.profile.age <= 8 ? '6-8' 
      : '9+' 
      : '6-8');

  // Age-specific session limits (in minutes)
  const getSessionLimits = () => {
    switch (ageGroup) {
      case '3-5':
        return {
          maxSession: 15,
          breakReminder: 10,
          inactivityTimeout: 60000 // 1 minute
        };
      case '6-8':
        return {
          maxSession: 30,
          breakReminder: 20,
          inactivityTimeout: 120000 // 2 minutes
        };
      case '9+':
        return {
          maxSession: 45,
          breakReminder: 30,
          inactivityTimeout: 180000 // 3 minutes
        };
      default:
        return {
          maxSession: 30,
          breakReminder: 20,
          inactivityTimeout: 120000
        };
    }
  };

  const limits = getSessionLimits();

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (ageGroup === '3-5') {
      // Simple display for youngest
      if (mins === 0) return `${secs} seconds`;
      if (mins === 1) return '1 minute';
      return `${mins} minutes`;
    } else {
      // Standard timer display
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Check for milestones
  const checkMilestones = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    
    // First session milestones
    if (!session.previousSessions || session.previousSessions.length === 0) {
      if (minutes === 1 && !showMilestone) {
        setMilestoneMessage('Great start! Keep going! 🌟');
        setShowMilestone(true);
        playSound('achievement');
        triggerHaptic('success');
        
        dispatch(addAchievement({
          id: 'first-minute',
          title: 'First Minute!',
          description: 'Completed your first minute of learning',
          icon: '⏱️',
          unlockedAt: new Date().toISOString()
        }));
      }
    }
    
    // Regular milestones
    if (minutes === 5 && time % 60 === 0) {
      setMilestoneMessage('5 minutes! You\'re doing great! 🎉');
      setShowMilestone(true);
      playSound('milestone');
      triggerHaptic('success');
    } else if (minutes === 10 && time % 60 === 0) {
      setMilestoneMessage('10 minutes! Fantastic focus! 🌟');
      setShowMilestone(true);
      playSound('milestone');
      triggerHaptic('success');
      
      if (ageGroup === '3-5') {
        // Suggest break for youngest
        setShowBreakReminder(true);
      }
    } else if (minutes === limits.breakReminder && time % 60 === 0) {
      setShowBreakReminder(true);
      playSound('notification');
    }
  }, [dispatch, limits.breakReminder, playSound, session.previousSessions, showMilestone, triggerHaptic, ageGroup]);

  // Detect inactivity
  useEffect(() => {
    const handleActivity = () => {
      setLastActivityTime(Date.now());
      if (isPaused && session.currentSession) {
        setIsPaused(false);
        dispatch(pauseSession());
      }
    };

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    const inactivityCheck = setInterval(() => {
      if (session.currentSession && !isPaused) {
        const inactiveTime = Date.now() - lastActivityTime;
        if (inactiveTime > limits.inactivityTimeout) {
          setIsPaused(true);
          dispatch(pauseSession());
          playSound('pause');
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(inactivityCheck);
    };
  }, [dispatch, isPaused, lastActivityTime, limits.inactivityTimeout, playSound, session.currentSession]);

  // Main timer effect
  useEffect(() => {
    if (!session.currentSession || session.isPaused || isPaused) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        
        // Update session time in store every 10 seconds
        if (newTime % 10 === 0) {
          dispatch(updateSessionTime(10));
        }
        
        // Check milestones
        checkMilestones(newTime);
        
        // Auto-complete session at max time
        if (newTime >= limits.maxSession * 60) {
          dispatch(completeSession());
          playSound('complete');
          triggerHaptic('success');
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    session.currentSession, 
    session.isPaused, 
    isPaused, 
    dispatch, 
    checkMilestones, 
    limits.maxSession, 
    playSound, 
    triggerHaptic
  ]);

  // Reset elapsed time when session changes
  useEffect(() => {
    if (session.currentSession) {
      setElapsedTime(session.currentSession.duration || 0);
    } else {
      setElapsedTime(0);
    }
  }, [session.currentSession]);

  if (!session.currentSession) return null;

  // Different displays based on age group
  if (ageGroup === '3-5') {
    // Fun visual timer for youngest
    return (
      <>
        <div className="fixed top-20 right-4 z-30">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="text-3xl"
              >
                ⏰
              </motion.div>
              <div>
                <p className="font-bold text-lg">{formatTime(elapsedTime)}</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(Math.min(10, Math.floor(elapsedTime / 60)))].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-sm"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
            
            {isPaused && (
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-500">Taking a break? 😴</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Break reminder for youngest */}
        <AnimatePresence>
          {showBreakReminder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-6 max-w-sm text-center">
                <div className="text-6xl mb-4">🧸</div>
                <h2 className="text-xl font-bold mb-2">Time for a break!</h2>
                <p className="text-gray-600 mb-4">
                  Let's stretch and rest our eyes!
                </p>
                <button
                  onClick={() => setShowBreakReminder(false)}
                  className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold text-lg"
                >
                  OK! 👍
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  } else if (ageGroup === '6-8') {
    // Engaging timer for middle group
    return (
      <>
        <div className="fixed bottom-24 right-4 z-30">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-3 border-2 border-purple-200"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#8b5cf6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${(elapsedTime / (limits.maxSession * 60)) * 126} 126`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {Math.floor(elapsedTime / 60)}
                </span>
              </div>
              <div>
                <p className="font-bold">{formatTime(elapsedTime)}</p>
                <p className="text-xs text-gray-500">Keep going!</p>
              </div>
            </div>
            
            {isPaused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-center text-xs text-orange-500 font-medium"
              >
                Paused - Move mouse to continue
              </motion.div>
            )}
          </motion.div>
        </div>

        <FeedbackModal
          isOpen={showBreakReminder}
          onClose={() => setShowBreakReminder(false)}
          title="Break Time! 🎈"
          message="You've been learning for a while. How about a quick break?"
          type="info"
        />
      </>
    );
  } else {
    // Minimal timer for oldest
    return (
      <>
        <div className="fixed bottom-4 right-4 z-30">
          <motion.div
            className={`bg-white/90 backdrop-blur-md rounded-lg shadow-md px-4 py-2 ${
              isPaused ? 'border-2 border-orange-400' : ''
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Session:</span>
              <span className="font-mono font-bold">{formatTime(elapsedTime)}</span>
              {isPaused && (
                <span className="text-xs text-orange-500">PAUSED</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Professional break reminder */}
        <AnimatePresence>
          {showBreakReminder && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-20 right-4 z-30 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-lg max-w-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold text-sm">Break Recommended</p>
                  <p className="text-xs text-gray-600 mt-1">
                    You've been studying for {limits.breakReminder} minutes. 
                    Consider taking a short break.
                  </p>
                  <button
                    onClick={() => setShowBreakReminder(false)}
                    className="mt-2 text-xs text-yellow-700 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
};

// Support both named and default exports
export { SessionTimer };
export default SessionTimer;
