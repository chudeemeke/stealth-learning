/**
 * Enterprise Theme Engine
 * Robust theme management system following Strategy Pattern and Factory Pattern
 * Supports multiple themes with no purple defaults
 */

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeConfig {
  name: string;
  id: string;
  colorScheme: ColorScheme;
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  components: {
    button: {
      primary: string;
      secondary: string;
      accent: string;
    };
    card: {
      background: string;
      border: string;
      shadow: string;
    };
    input: {
      background: string;
      border: string;
      focus: string;
      text: string;
    };
  };
}

/**
 * Theme Factory - Creates theme configurations
 */
export class ThemeFactory {
  /**
   * Ocean Blue Theme - Professional blue-based palette
   */
  static createOceanTheme(): ThemeConfig {
    return {
      name: 'Ocean Blue',
      id: 'ocean',
      colorScheme: {
        primary: '#0ea5e9', // sky-500
        secondary: '#06b6d4', // cyan-500
        accent: '#10b981', // emerald-500
        background: '#f8fafc', // slate-50
        surface: '#ffffff',
        text: {
          primary: '#0f172a', // slate-900
          secondary: '#475569', // slate-600
          accent: '#0ea5e9', // sky-500
        },
        success: '#10b981', // emerald-500
        warning: '#f59e0b', // amber-500
        error: '#ef4444', // red-500
        info: '#3b82f6', // blue-500
      },
      gradients: {
        primary: 'from-sky-400 to-blue-600',
        secondary: 'from-cyan-400 to-teal-600',
        accent: 'from-emerald-400 to-green-600',
        background: 'from-blue-50 via-sky-50 to-cyan-50',
      },
      components: {
        button: {
          primary: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
          secondary: 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700',
          accent: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
        },
        card: {
          background: 'bg-white',
          border: 'border-slate-200',
          shadow: 'shadow-lg shadow-slate-200/50',
        },
        input: {
          background: 'bg-white',
          border: 'border-slate-300',
          focus: 'focus:border-sky-500 focus:ring-sky-500',
          text: 'text-slate-900',
        },
      },
    };
  }

  /**
   * Forest Green Theme - Nature-inspired green palette
   */
  static createForestTheme(): ThemeConfig {
    return {
      name: 'Forest Green',
      id: 'forest',
      colorScheme: {
        primary: '#059669', // emerald-600
        secondary: '#0d9488', // teal-600
        accent: '#0891b2', // cyan-600
        background: '#f0fdf4', // green-50
        surface: '#ffffff',
        text: {
          primary: '#0f172a', // slate-900
          secondary: '#475569', // slate-600
          accent: '#059669', // emerald-600
        },
        success: '#10b981', // emerald-500
        warning: '#f59e0b', // amber-500
        error: '#ef4444', // red-500
        info: '#3b82f6', // blue-500
      },
      gradients: {
        primary: 'from-emerald-400 to-green-600',
        secondary: 'from-teal-400 to-emerald-600',
        accent: 'from-cyan-400 to-teal-600',
        background: 'from-green-50 via-emerald-50 to-teal-50',
      },
      components: {
        button: {
          primary: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
          secondary: 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700',
          accent: 'bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700',
        },
        card: {
          background: 'bg-white',
          border: 'border-emerald-200',
          shadow: 'shadow-lg shadow-emerald-200/50',
        },
        input: {
          background: 'bg-white',
          border: 'border-emerald-300',
          focus: 'focus:border-emerald-500 focus:ring-emerald-500',
          text: 'text-slate-900',
        },
      },
    };
  }

  /**
   * Sunset Orange Theme - Warm orange-based palette
   */
  static createSunsetTheme(): ThemeConfig {
    return {
      name: 'Sunset Orange',
      id: 'sunset',
      colorScheme: {
        primary: '#ea580c', // orange-600
        secondary: '#dc2626', // red-600
        accent: '#ca8a04', // yellow-600
        background: '#fffbeb', // amber-50
        surface: '#ffffff',
        text: {
          primary: '#0f172a', // slate-900
          secondary: '#475569', // slate-600
          accent: '#ea580c', // orange-600
        },
        success: '#10b981', // emerald-500
        warning: '#f59e0b', // amber-500
        error: '#ef4444', // red-500
        info: '#3b82f6', // blue-500
      },
      gradients: {
        primary: 'from-orange-400 to-red-600',
        secondary: 'from-red-400 to-orange-600',
        accent: 'from-yellow-400 to-orange-600',
        background: 'from-orange-50 via-amber-50 to-yellow-50',
      },
      components: {
        button: {
          primary: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
          secondary: 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700',
          accent: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700',
        },
        card: {
          background: 'bg-white',
          border: 'border-orange-200',
          shadow: 'shadow-lg shadow-orange-200/50',
        },
        input: {
          background: 'bg-white',
          border: 'border-orange-300',
          focus: 'focus:border-orange-500 focus:ring-orange-500',
          text: 'text-slate-900',
        },
      },
    };
  }
}

/**
 * Theme Manager - Manages current theme and provides theme switching
 */
export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemeConfig;
  private observers: Array<(theme: ThemeConfig) => void> = [];

  private constructor() {
    // Default to Ocean theme (NO PURPLE)
    this.currentTheme = ThemeFactory.createOceanTheme();
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): ThemeConfig {
    return this.currentTheme;
  }

  /**
   * Set theme by ID
   */
  setTheme(themeId: string): void {
    let newTheme: ThemeConfig;

    switch (themeId) {
      case 'ocean':
        newTheme = ThemeFactory.createOceanTheme();
        break;
      case 'forest':
        newTheme = ThemeFactory.createForestTheme();
        break;
      case 'sunset':
        newTheme = ThemeFactory.createSunsetTheme();
        break;
      default:
        newTheme = ThemeFactory.createOceanTheme();
    }

    this.currentTheme = newTheme;
    this.notifyObservers();
    this.persistTheme(themeId);
  }

  /**
   * Subscribe to theme changes
   */
  subscribe(callback: (theme: ThemeConfig) => void): () => void {
    this.observers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  /**
   * Notify all observers of theme change
   */
  private notifyObservers(): void {
    this.observers.forEach(callback => callback(this.currentTheme));
  }

  /**
   * Persist theme to localStorage
   */
  private persistTheme(themeId: string): void {
    try {
      localStorage.setItem('stealth-learning-theme', themeId);
    } catch (error) {
      console.warn('Failed to persist theme:', error);
    }
  }

  /**
   * Load theme from localStorage
   */
  loadPersistedTheme(): void {
    try {
      const persistedThemeId = localStorage.getItem('stealth-learning-theme');
      if (persistedThemeId) {
        this.setTheme(persistedThemeId);
      }
    } catch (error) {
      console.warn('Failed to load persisted theme:', error);
    }
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): Array<{ id: string; name: string }> {
    return [
      { id: 'ocean', name: 'Ocean Blue' },
      { id: 'forest', name: 'Forest Green' },
      { id: 'sunset', name: 'Sunset Orange' },
    ];
  }
}

/**
 * Theme Utility Functions
 */
export class ThemeUtils {
  /**
   * Generate CSS variables from theme
   */
  static generateCSSVariables(theme: ThemeConfig): Record<string, string> {
    return {
      '--color-primary': theme.colorScheme.primary,
      '--color-secondary': theme.colorScheme.secondary,
      '--color-accent': theme.colorScheme.accent,
      '--color-background': theme.colorScheme.background,
      '--color-surface': theme.colorScheme.surface,
      '--color-text-primary': theme.colorScheme.text.primary,
      '--color-text-secondary': theme.colorScheme.text.secondary,
      '--color-text-accent': theme.colorScheme.text.accent,
      '--color-success': theme.colorScheme.success,
      '--color-warning': theme.colorScheme.warning,
      '--color-error': theme.colorScheme.error,
      '--color-info': theme.colorScheme.info,
    };
  }

  /**
   * Apply theme to document root
   */
  static applyThemeToDocument(theme: ThemeConfig): void {
    const root = document.documentElement;
    const cssVariables = this.generateCSSVariables(theme);

    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }
}

// Export singleton instance
export const themeManager = ThemeManager.getInstance();