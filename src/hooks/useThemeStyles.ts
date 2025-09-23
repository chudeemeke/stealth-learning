/**
 * Theme Styles Hook
 * Provides commonly used themed styles for components
 */

import { useTheme } from '@/contexts/ThemeContext';

export const useThemeStyles = () => {
  const { theme } = useTheme();

  return {
    // Background styles
    backgrounds: {
      primary: `bg-gradient-to-br ${theme.gradients.primary}`,
      secondary: `bg-gradient-to-br ${theme.gradients.secondary}`,
      accent: `bg-gradient-to-br ${theme.gradients.accent}`,
      page: `bg-gradient-to-br ${theme.gradients.background}`,
      surface: theme.components.card.background,
    },

    // Button styles
    buttons: {
      primary: `${theme.components.button.primary} text-white font-bold`,
      secondary: `${theme.components.button.secondary} text-white font-bold`,
      accent: `${theme.components.button.accent} text-white font-bold`,
    },

    // Card styles
    cards: {
      default: `${theme.components.card.background} ${theme.components.card.border} ${theme.components.card.shadow} rounded-lg`,
      elevated: `${theme.components.card.background} ${theme.components.card.shadow} rounded-xl shadow-xl`,
    },

    // Input styles
    inputs: {
      default: `${theme.components.input.background} ${theme.components.input.text} ${theme.components.input.border} border-2 ${theme.components.input.focus} focus:outline-none`,
    },

    // Text styles
    text: {
      primary: { color: theme.colorScheme.text.primary },
      secondary: { color: theme.colorScheme.text.secondary },
      accent: { color: theme.colorScheme.text.accent },
      success: { color: theme.colorScheme.success },
      warning: { color: theme.colorScheme.warning },
      error: { color: theme.colorScheme.error },
      info: { color: theme.colorScheme.info },
    },

    // Border styles
    borders: {
      primary: { borderColor: theme.colorScheme.primary },
      secondary: { borderColor: theme.colorScheme.secondary },
      accent: { borderColor: theme.colorScheme.accent },
    },

    // Age group specific button styles (replacing purple defaults)
    ageGroupButtons: {
      '3-5': `${theme.components.button.primary} text-white`,
      '6-8': `${theme.components.button.secondary} text-white`,
      '9+': `${theme.components.button.accent} text-white`,
    },

    // Subject specific colors (no purple)
    subjects: {
      math: `${theme.components.button.primary} text-white`,
      english: `${theme.components.button.secondary} text-white`,
      science: `${theme.components.button.accent} text-white`,
      art: `bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white`,
      social: `bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white`,
    },

    // Game difficulty colors
    difficulty: {
      easy: `bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white`,
      medium: `${theme.components.button.secondary} text-white`,
      hard: `bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white`,
    },

    // Navigation styles
    navigation: {
      primary: `${theme.components.button.primary} text-white`,
      back: `${theme.components.button.secondary} text-white`,
    },
  };
};