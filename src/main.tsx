import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import App from './App';
import { store, persistor } from './store';
import './index.css';
import './styles/accessibility.css';
import './styles/global-design.css';

// Check if we're in development mode
const isDevelopment = (import.meta as any).env?.DEV || false;

// Enable React DevTools in development
if (isDevelopment) {
  // @ts-ignore
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
}

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create React root
const root = ReactDOM.createRoot(rootElement);

// Render app
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// Remove splash screen if it still exists
const removeSplashScreen = () => {
  const splash = document.getElementById('splash-screen');
  if (splash && !splash.classList.contains('fade-out')) {
    splash.classList.add('fade-out');
    document.body.classList.remove('loading');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 500);
  }
};

// Ensure splash screen is removed after app loads
setTimeout(removeSplashScreen, 3000);

// Handle app visibility changes (for pausing games, etc.)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // App is in background
    window.dispatchEvent(new CustomEvent('app:background'));
  } else {
    // App is in foreground
    window.dispatchEvent(new CustomEvent('app:foreground'));
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  window.dispatchEvent(new CustomEvent('app:online'));
  console.log('App is online');
});

window.addEventListener('offline', () => {
  window.dispatchEvent(new CustomEvent('app:offline'));
  console.log('App is offline');
});

// Log app version in development
if (isDevelopment) {
  console.log(
    '%c🎮 Stealth Learning Games - ENHANCED VERSION',
    'font-size: 20px; font-weight: bold; color: #4A90E2;'
  );
  console.log(
    '%cVersion: 0.1.0-dev-enhanced',
    'font-size: 14px; color: #666;'
  );
  console.log(
    '%cEnvironment: Development',
    'font-size: 14px; color: #666;'
  );
  console.log(
    '%c✨ Enhanced Features Active: Immersive Backgrounds, Particle Systems, Interactive Characters, Audio Systems',
    'font-size: 12px; color: #10B981; font-weight: bold;'
  );
}

// Performance monitoring in development
if (isDevelopment && 'PerformanceObserver' in window) {
  // Monitor Largest Contentful Paint
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', (lastEntry as any).renderTime || (lastEntry as any).loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP observer not supported
  }

  // Monitor First Input Delay
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', (entry as any).processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // FID observer not supported
  }
}

// Handle uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // In production, send to error tracking service
  if (!isDevelopment) {
    // TODO: Send to Sentry or similar
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, send to error tracking service
  if (!isDevelopment) {
    // TODO: Send to Sentry or similar
  }
});