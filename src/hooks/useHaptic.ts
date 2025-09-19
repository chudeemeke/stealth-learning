import { useCallback, useRef } from 'react';

// Haptic feedback types
export type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

// Haptic pattern configurations
const hapticPatterns: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  selection: 5,
  success: [10, 100, 20],
  warning: [20, 50, 20],
  error: [50, 100, 50],
};

// Check if haptic feedback is supported
const isHapticSupported = () => {
  return 'vibrate' in navigator;
};

// Check if we're on iOS with haptic engine
const hasIOSHapticEngine = () => {
  // Check for iOS devices with Taptic Engine
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  
  // iPhone 7 and later have Taptic Engine
  if (isIOS && window.navigator.maxTouchPoints > 0) {
    // Try to detect if device supports haptic feedback
    // This is a rough approximation as there's no direct API
    const deviceModel = navigator.userAgent.match(/iPhone\s?(\d+)/);
    if (deviceModel && parseInt(deviceModel[1]) >= 7) {
      return true;
    }
  }
  
  return false;
};

export const useHaptic = () => {
  const enabledRef = useRef(true);
  const intensityRef = useRef(1.0); // 0.0 to 1.0

  // Trigger haptic feedback
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    if (!enabledRef.current || !isHapticSupported()) {
      return false;
    }

    try {
      const pattern = hapticPatterns[type];
      
      // Apply intensity modifier
      const adjustedPattern = Array.isArray(pattern)
        ? pattern.map(duration => Math.round(duration * intensityRef.current))
        : Math.round(pattern * intensityRef.current);

      // Use Web Vibration API
      navigator.vibrate(adjustedPattern);
      
      return true;
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error);
      return false;
    }
  }, []);

  // Create custom haptic pattern
  const customHaptic = useCallback((pattern: number | number[]) => {
    if (!enabledRef.current || !isHapticSupported()) {
      return false;
    }

    try {
      // Apply intensity modifier
      const adjustedPattern = Array.isArray(pattern)
        ? pattern.map(duration => Math.round(duration * intensityRef.current))
        : Math.round(pattern * intensityRef.current);

      navigator.vibrate(adjustedPattern);
      return true;
    } catch (error) {
      console.error('Failed to trigger custom haptic:', error);
      return false;
    }
  }, []);

  // Play impact haptic (for button presses, etc.)
  const impact = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    return triggerHaptic(style);
  }, [triggerHaptic]);

  // Play notification haptic (for alerts, achievements, etc.)
  const notification = useCallback((type: 'success' | 'warning' | 'error' = 'success') => {
    return triggerHaptic(type);
  }, [triggerHaptic]);

  // Play selection haptic (for toggles, selections, etc.)
  const selection = useCallback(() => {
    return triggerHaptic('selection');
  }, [triggerHaptic]);

  // Continuous haptic for drag operations
  const startContinuous = useCallback((intensity: number = 20, interval: number = 100) => {
    if (!enabledRef.current || !isHapticSupported()) {
      return null;
    }

    const adjustedIntensity = Math.round(intensity * intensityRef.current);
    
    const intervalId = setInterval(() => {
      navigator.vibrate(adjustedIntensity);
    }, interval);

    return {
      stop: () => clearInterval(intervalId),
      updateIntensity: (newIntensity: number) => {
        navigator.vibrate(Math.round(newIntensity * intensityRef.current));
      },
    };
  }, []);

  // Set haptic intensity
  const setIntensity = useCallback((intensity: number) => {
    intensityRef.current = Math.max(0, Math.min(1, intensity));
  }, []);

  // Toggle haptic on/off
  const toggleHaptic = useCallback((enabled?: boolean) => {
    if (enabled === undefined) {
      enabledRef.current = !enabledRef.current;
    } else {
      enabledRef.current = enabled;
    }
    return enabledRef.current;
  }, []);

  // Check support
  const checkSupport = useCallback(() => {
    return {
      basic: isHapticSupported(),
      ios: hasIOSHapticEngine(),
    };
  }, []);

  // Stop all haptic feedback
  const stop = useCallback(() => {
    if (isHapticSupported()) {
      navigator.vibrate(0);
    }
  }, []);

  return {
    triggerHaptic,
    customHaptic,
    impact,
    notification,
    selection,
    startContinuous,
    setIntensity,
    toggleHaptic,
    checkSupport,
    stop,
  };
};

// Haptic feedback hook for game events
export const useGameHaptics = () => {
  const haptic = useHaptic();

  const gameEvents = {
    // Player actions
    jump: () => haptic.impact('light'),
    land: () => haptic.impact('medium'),
    collect: () => haptic.customHaptic([5, 10, 5]),
    shoot: () => haptic.impact('medium'),
    hit: () => haptic.impact('heavy'),
    
    // Game states
    levelComplete: () => haptic.customHaptic([50, 100, 50, 100, 50]),
    gameOver: () => haptic.notification('error'),
    achievement: () => haptic.notification('success'),
    powerUp: () => haptic.customHaptic([10, 20, 10, 20, 10, 20]),
    
    // UI interactions
    menuSelect: () => haptic.selection(),
    dialogOpen: () => haptic.impact('light'),
    dialogClose: () => haptic.customHaptic([5, 5]),
    swipe: () => haptic.customHaptic([3, 10, 3]),
    
    // Feedback
    correct: () => haptic.notification('success'),
    incorrect: () => haptic.notification('warning'),
    hint: () => haptic.customHaptic([5, 5, 5]),
  };

  return {
    ...haptic,
    gameEvents,
  };
};

export default useHaptic;