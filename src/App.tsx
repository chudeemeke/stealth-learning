import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';

// Ultra-secure services
import { securityHeaders } from '@/utils/security-headers';
import { coppaService } from '@/services/compliance/COPPAService';

// Import HomePage directly (critical path - no lazy loading)
import HomePage from '@/pages/HomePage';
// Import Ultra Kids Landing Page - handles all login flows inline
import UltraKidsLandingSimple from '@/pages/UltraKidsLandingSimple';

// Lazy load other pages - ENHANCED VERSIONS
const GameSelectPage = React.lazy(() => import('@/pages/EnhancedGameSelectPage'));
const GamePlayPage = React.lazy(() => import('@/pages/EnhancedGamePlayPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const ProgressPage = React.lazy(() => import('@/pages/ProgressPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const ParentDashboard = React.lazy(() => import('@/pages/ParentDashboard'));

// Components
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { SessionTimer } from '@/components/SessionTimer';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, profile } = useAppSelector(state => state.student);
  const { theme } = useAppSelector(state => state.settings.app);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🔒 Initializing ultra-secure Stealth Learning platform...');

        // Initialize security services first (with error handling)
        try {
          securityHeaders.setupCSPViolationReporting();
          console.log('✅ Security headers initialized');
        } catch (error) {
          console.warn('⚠️ Security headers initialization failed:', error);
        }

        try {
          // Clean up expired data for COPPA compliance
          await coppaService.cleanupExpiredData();
          console.log('✅ COPPA service initialized');
        } catch (error) {
          console.warn('⚠️ COPPA service initialization failed:', error);
        }

        try {
          // Validate page security
          const securityCheck = securityHeaders.validatePageSecurity();
          if (!securityCheck.isSecure) {
            console.warn('🔒 Security violations detected:', securityCheck.violations);
          } else {
            console.log('✅ Page security validated');
          }
        } catch (error) {
          console.warn('⚠️ Security validation failed:', error);
        }

        // Attempt to restore session from persisted state and JWT tokens
        try {
          // Handle session restoration without startTransition since it's async
          const restoreSessionAsync = async () => {
            try {
              const { restoreSession } = await import('@/store/slices/studentSlice');
              await dispatch(restoreSession());
              console.log('✅ Session restored successfully');
            } catch (sessionError) {
              console.log('ℹ️ No valid session to restore:', sessionError);
              // This is expected for new users, don't treat as error
            }
          };

          restoreSessionAsync();
        } catch (sessionError) {
          console.log('ℹ️ Session restoration initialization failed:', sessionError);
        }

        // Preload critical assets
        await preloadAssets();

        console.log('✅ Ultra-secure platform initialized successfully');

      } catch (error) {
        console.error('🔒 CRITICAL: Failed to initialize secure platform:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Preload critical assets
  const preloadAssets = async () => {
    const criticalImages = [
      '/images/logo.png',
      '/images/characters/default-avatar.png',
    ];

    const imagePromises = criticalImages.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    await Promise.all(imagePromises).catch(console.error);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className={`app ${profile?.ageGroup ? `age-${profile.ageGroup}` : ''}`}>
        {!isOnline && <OfflineIndicator />}
        
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Route - Single login entry point */}
            <Route path="/login" element={<UltraKidsLandingSimple />} />
            
            {/* Landing/Home Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Layout>
                    <HomePage />
                  </Layout>
                ) : (
                  <UltraKidsLandingSimple />
                )
              }
            />
            
            <Route
              path="/games"
              element={
                isAuthenticated ? (
                  <Layout>
                    <React.Suspense fallback={<LoadingScreen />}>
                      <GameSelectPage />
                    </React.Suspense>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            <Route
              path="/games/:gameId"
              element={
                isAuthenticated ? (
                  <Layout fullscreen>
                    <React.Suspense fallback={<LoadingScreen />}>
                      <GamePlayPage />
                    </React.Suspense>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <Layout>
                    <React.Suspense fallback={<LoadingScreen />}>
                      <ProfilePage />
                    </React.Suspense>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            <Route
              path="/progress"
              element={
                isAuthenticated ? (
                  <Layout>
                    <React.Suspense fallback={<LoadingScreen />}>
                      <ProgressPage />
                    </React.Suspense>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            <Route
              path="/settings"
              element={
                isAuthenticated ? (
                  <Layout>
                    <React.Suspense fallback={<LoadingScreen />}>
                      <SettingsPage />
                    </React.Suspense>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            <Route
              path="/parent-dashboard"
              element={
                isAuthenticated ? (
                  <Layout>
                    <React.Suspense fallback={<LoadingScreen />}>
                      <ParentDashboard />
                    </React.Suspense>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
        
        {/* Global Components */}
        {isAuthenticated && profile && <SessionTimer />}
      </div>
    </ErrorBoundary>
  );
}

export default App;