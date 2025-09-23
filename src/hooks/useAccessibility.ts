import { useEffect, useState, useCallback } from 'react';

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  colorBlindFriendly: boolean;
  focusIndicators: boolean;
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderMode: false,
    keyboardNavigation: true,
    audioDescriptions: false,
    colorBlindFriendly: false,
    focusIndicators: true
  });

  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accessibilitySettings');
      if (saved) {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }

    // Detect system preferences
    const mediaQueries = {
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      largeText: window.matchMedia('(prefers-reduced-data: reduce)')
    };

    // Set initial values based on system preferences
    setSettings(prev => ({
      ...prev,
      reduceMotion: mediaQueries.reduceMotion.matches,
      highContrast: mediaQueries.highContrast.matches
    }));

    // Listen for changes
    const listeners = Object.entries(mediaQueries).map(([key, mediaQuery]) => {
      const listener = (e: MediaQueryListEvent) => {
        setSettings(prev => ({ ...prev, [key]: e.matches }));
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    });

    return () => listeners.forEach(cleanup => cleanup());
  }, []);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMousedown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleMousedown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleMousedown);
    };
  }, []);

  // Apply CSS custom properties based on settings
  useEffect(() => {
    const root = document.documentElement;

    // Apply accessibility settings to CSS
    if (settings.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (settings.colorBlindFriendly) {
      root.classList.add('colorblind-friendly');
    } else {
      root.classList.remove('colorblind-friendly');
    }

    if (settings.focusIndicators && isKeyboardUser) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }

    // Screen reader specific
    if (settings.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
  }, [settings, isKeyboardUser]);

  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };

      try {
        localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
      } catch (error) {
        console.warn('Failed to save accessibility settings:', error);
      }

      return newSettings;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaultSettings: AccessibilitySettings = {
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      largeText: false,
      screenReaderMode: false,
      keyboardNavigation: true,
      audioDescriptions: false,
      colorBlindFriendly: false,
      focusIndicators: true
    };

    setSettings(defaultSettings);

    try {
      localStorage.setItem('accessibilitySettings', JSON.stringify(defaultSettings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }, []);

  // Announce to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Focus management
  const focusElement = useCallback((selector: string | HTMLElement) => {
    const element = typeof selector === 'string'
      ? document.querySelector(selector) as HTMLElement
      : selector;

    if (element) {
      element.focus();
      if (settings.screenReaderMode) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [settings.screenReaderMode]);

  // Skip link functionality
  const addSkipLinks = useCallback(() => {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#game-area" class="skip-link">Skip to game</a>
    `;

    document.body.insertBefore(skipLinks, document.body.firstChild);
  }, []);

  // Generate ARIA labels for interactive elements
  const getAriaLabel = useCallback((
    element: string,
    state?: string,
    description?: string
  ): string => {
    let label = element;
    if (state) label += `, ${state}`;
    if (description) label += `. ${description}`;
    return label;
  }, []);

  // Keyboard event helpers
  const handleKeyboardInteraction = useCallback((
    event: React.KeyboardEvent,
    callback: () => void,
    keys: string[] = ['Enter', ' ']
  ) => {
    if (keys.includes(event.key)) {
      event.preventDefault();
      callback();
    }
  }, []);

  return {
    settings,
    isKeyboardUser,
    updateSetting,
    resetToDefaults,
    announce,
    focusElement,
    addSkipLinks,
    getAriaLabel,
    handleKeyboardInteraction
  };
};

export default useAccessibility;