import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import { restoreSession } from '@/store/slices/studentSlice';

// Ultra-secure services
import { securityHeaders } from '@/utils/security-headers';
import { coppaService } from '@/services/compliance/COPPAService';

// Import HomePage directly (critical path - no lazy loading)
import HomePage from '@/pages/HomePage';
// Import Ultra Kids Landing Page - handles all login flows inline
import UltraKidsLandingSimple from '@/pages/UltraKidsLandingSimple';

// Lazy load other pages - ENHANCED VERSIONS
const GameSelectPage = React.lazy(() => import('@/pages/ExpandedGameSelectPage'));
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
import SecurityWarningBanner from '@/components/SecurityWarningBanner';

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
    let timeoutId: ReturnType<typeof setTimeout>;

    const initializeApp = async () => {
      console.log('🎮 Initializing Stealth Learning platform...');

      // Set a maximum timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.warn('⚠️ Initialization timeout - proceeding anyway');
        setIsLoading(false);
      }, 3000); // 3 second max timeout

      try {
        // Initialize services in parallel for faster load
        const initPromises = [
          // Security headers - non-critical
          Promise.resolve().then(() => {
            try {
              securityHeaders.setupCSPViolationReporting();
            } catch (err) {
              console.warn('Security headers setup skipped:', err);
            }
          }),

          // COPPA compliance - non-critical
          coppaService.cleanupExpiredData()
            .catch(err => console.warn('COPPA cleanup skipped:', err)),

          // Session restoration - non-critical for first load
          dispatch(restoreSession())
            .catch(() => console.log('No previous session found')),

          // Preload assets - non-critical
          preloadAssets()
            .catch(err => console.warn('Asset preload failed:', err))
        ];

        // Wait for all non-critical services, but don't block on failures
        await Promise.allSettled(initPromises);

        console.log('✅ Platform initialized');
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        // Always set loading to false to show the app
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    // Start initialization immediately
    initializeApp();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
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
      <SecurityWarningBanner />
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