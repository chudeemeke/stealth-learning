/**
 * Theme Context - React Context for theme management
 * Implements Context Pattern and Observer Pattern
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeConfig, themeManager, ThemeUtils } from '@/services/theme/ThemeEngine';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (themeId: string) => void;
  availableThemes: Array<{ id: string; name: string }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(themeManager.getCurrentTheme());

  useEffect(() => {
    // Load persisted theme on mount
    themeManager.loadPersistedTheme();

    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe((newTheme) => {
      setTheme(newTheme);
      ThemeUtils.applyThemeToDocument(newTheme);
    });

    // Apply initial theme
    ThemeUtils.applyThemeToDocument(themeManager.getCurrentTheme());

    return unsubscribe;
  }, []);

  const handleSetTheme = (themeId: string) => {
    themeManager.setTheme(themeId);
  };

  const availableThemes = themeManager.getAvailableThemes();

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};