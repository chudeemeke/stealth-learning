import React, { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/studentSlice';
import { pauseSession, resumeSession } from '@/store/slices/sessionSlice';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

interface LayoutProps {
  children: ReactNode;
  fullscreen?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullscreen = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();
  
  const student = useAppSelector(state => state.student);
  const settings = useAppSelector(state => state.settings);
  const session = useAppSelector(state => state.session);
  const adaptive = useAppSelector(state => state.adaptive);
  
  const [showMenu, setShowMenu] = useState(false);
  const [showParentGate, setShowParentGate] = useState(false);
  const [parentGateAnswer, setParentGateAnswer] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('robot');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const ageGroup = student.profile?.ageGroup || 
    (student.profile?.age 
      ? student.profile.age <= 5 ? '3-5' 
      : student.profile.age <= 8 ? '6-8' 
      : '9+' 
      : '6-8');

  // Character companions for younger kids
  const characters = {
    robot: { emoji: '🤖', name: 'Robo', voice: 'electronic', color: 'purple' },
    unicorn: { emoji: '🦄', name: 'Sparkle', voice: 'magical', color: 'pink' },
    dragon: { emoji: '🐉', name: 'Draco', voice: 'powerful', color: 'green' },
    astronaut: { emoji: '👨‍🚀', name: 'Cosmo', voice: 'space', color: 'blue' }
  };

  // Handle scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items based on age group
  const getNavItems = () => {
    const baseItems = [
      { 
        path: '/', 
        label: 'Home', 
        icon: '🏠',
        color: 'bg-purple-500'
      },
      { 
        path: '/games', 
        label: 'Games', 
        icon: '🎮',
        color: 'bg-blue-500'
      },
      { 
        path: '/progress', 
        label: ageGroup === '3-5' ? 'Stars' : 'Progress', 
        icon: '⭐',
        color: 'bg-yellow-500'
      }
    ];

    if (ageGroup === '6-8' || ageGroup === '9+') {
      baseItems.push({
        path: '/profile',
        label: 'Profile',
        icon: '👤',
        color: 'bg-green-500'
      });
    }

    if (ageGroup === '9+') {
      baseItems.push({
        path: '/settings',
        label: 'Settings',
        icon: '⚙️',
        color: 'bg-gray-500'
      });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  // Parent gate for sensitive actions
  const parentGateQuestion = {
    question: "What is 7 + 8?",
    answer: "15"
  };

  const handleNavClick = (path: string) => {
    if (path === '/parent-dashboard' && ageGroup !== '9+') {
      setShowParentGate(true);
      return;
    }
    
    playSound('click');
    triggerHaptic('light');
    navigate(path);
    setShowMenu(false);
  };

  const handleLogout = () => {
    playSound('logout');
    dispatch(logout());
    navigate('/login');
  };

  const handleParentGateSubmit = () => {
    if (parentGateAnswer === parentGateQuestion.answer) {
      playSound('success');
      navigate('/parent-dashboard');
      setShowParentGate(false);
      setParentGateAnswer('');
    } else {
      playSound('error');
      triggerHaptic('error');
      setParentGateAnswer('');
    }
  };

  // If fullscreen mode (for games), render minimal layout
  if (fullscreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 relative">
        {/* Exit button for fullscreen games */}
        <button
          onClick={() => {
            dispatch(pauseSession());
            navigate('/games');
          }}
          className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
        >
          <span className="text-2xl">←</span>
        </button>
        
        {children}
      </div>
    );
  }

  // Age-specific navigation rendering
  const renderNavigation = () => {
    if (ageGroup === '3-5') {
      // Picture-based navigation for youngest
      return (
        <nav className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600 to-purple-500 p-4 rounded-t-3xl shadow-2xl z-40 transition-all ${
          isScrolled ? 'translate-y-0' : ''
        }`}>
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-2xl
                  ${location.pathname === item.path ? item.color : 'bg-white/20'}
                  transform transition-all duration-300
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-4xl">{item.icon}</span>
                <span className="text-white text-sm font-bold">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>
      );
    } else if (ageGroup === '6-8') {
      // Hybrid navigation for middle age group
      return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-purple-200 p-3 z-40">
          <div className="flex justify-around items-center max-w-lg mx-auto">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-xl
                  ${location.pathname === item.path ? 'bg-purple-100 scale-105' : ''}
                  transform transition-all duration-200
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xs font-medium text-gray-700">{item.label}</span>
              </motion.button>
            ))}
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl">📋</span>
              <span className="text-xs font-medium text-gray-700">More</span>
            </motion.button>
          </div>
        </nav>
      );
    } else {
      // Sophisticated navigation for oldest
      return (
        <nav className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4 z-40 transition-all ${
          isScrolled ? 'shadow-lg' : ''
        }`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                StealthLearn
              </Link>
              <div className="hidden md:flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all
                      ${location.pathname === item.path 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Stats display */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💎</span>
                  <span className="font-bold text-lg">{student.profile?.xp || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="font-bold text-lg">{session.currentSession?.streakCount || 0}</span>
                </div>
              </div>
              
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.profile?.username || 'default'}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:block font-medium">
                    {student.profile?.username || 'Student'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowMenu(false)}
                      >
                        <span>👤</span> My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowMenu(false)}
                      >
                        <span>⚙️</span> Settings
                      </Link>
                      <button
                        onClick={() => handleNavClick('/parent-dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-left"
                      >
                        <span>👨‍👩‍👧‍👦</span> Parent Dashboard
                      </button>
                      <hr className="border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-left"
                      >
                        <span>🚪</span> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </nav>
      );
    }
  };

  // Header for younger kids with character guide
  const renderHeader = () => {
    if (ageGroup === '3-5' || ageGroup === '6-8') {
      const character = characters[selectedCharacter as keyof typeof characters];
      
      return (
        <header className={`fixed top-0 left-0 right-0 bg-gradient-to-r from-${character.color}-500 to-${character.color}-600 p-4 z-40 transition-all ${
          isScrolled ? 'shadow-xl' : ''
        }`}>
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            {/* Character guide */}
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <span className="text-4xl">
                  {character.emoji}
                </span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </motion.div>
              <div>
                <p className="text-white font-bold">
                  Hi {student.profile?.username || 'Friend'}!
                </p>
                <p className="text-white/80 text-sm">
                  {session.currentSession?.streakCount 
                    ? `${session.currentSession.streakCount} day streak! 🔥` 
                    : "Let's learn today!"}
                </p>
              </div>
            </div>

            {/* Stats display */}
            <div className="flex items-center gap-4">
              {ageGroup === '6-8' && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                  <span className="text-2xl">💎</span>
                  <span className="text-white font-bold">{student.profile?.xp || 0}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                <span className="text-2xl">⭐</span>
                <span className="text-white font-bold">
                  {student.profile?.totalStars || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Session progress bar */}
          {session.currentSession && (
            <div className="mt-3 max-w-4xl mx-auto">
              <ProgressBar
                value={session.currentSession.progress || 0}
                max={100}
                label="Today's Progress"
                showStars={ageGroup === '3-5'}
                className="bg-white/20"
              />
            </div>
          )}
        </header>
      );
    }
    return null;
  };

  // Calculate content padding based on navigation style
  const contentPadding = ageGroup === '9+' 
    ? 'pt-20 pb-4' 
    : ageGroup === '3-5' || ageGroup === '6-8'
    ? 'pt-32 pb-24'
    : 'pt-4 pb-20';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 relative`}>
      {renderHeader()}
      {renderNavigation()}
      
      <main className={`${contentPadding} px-4`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Parent Gate Modal */}
      <AnimatePresence>
        {showParentGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowParentGate(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Parent Gate 🔒</h2>
              <p className="text-gray-600 mb-4">
                Please solve this problem to continue:
              </p>
              <p className="text-lg font-semibold mb-4">
                {parentGateQuestion.question}
              </p>
              <input
                type="text"
                value={parentGateAnswer}
                onChange={(e) => setParentGateAnswer(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg mb-4 focus:border-purple-500 focus:outline-none"
                placeholder="Enter answer"
                onKeyPress={(e) => e.key === 'Enter' && handleParentGateSubmit()}
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleParentGateSubmit}
                  variant="primary"
                  size="medium"
                  className="flex-1"
                >
                  Submit
                </Button>
                <Button
                  onClick={() => {
                    setShowParentGate(false);
                    setParentGateAnswer('');
                  }}
                  variant="secondary"
                  size="medium"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fun floating elements for younger kids */}
      {(ageGroup === '3-5' || ageGroup === '6-8') && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            className="absolute top-20 left-10 text-6xl opacity-10"
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute top-40 right-20 text-5xl opacity-10"
            animate={{
              y: [0, -20, 0],
              x: [0, -15, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ⭐
          </motion.div>
          <motion.div
            className="absolute bottom-40 left-20 text-6xl opacity-10"
            animate={{
              y: [0, 25, 0],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🌈
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Support both named and default exports
export { Layout };
export default Layout;
