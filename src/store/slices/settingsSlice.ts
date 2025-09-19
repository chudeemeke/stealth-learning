import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  app: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    fontSize: 'small' | 'medium' | 'large';
    animationSpeed: 'slow' | 'normal' | 'fast';
    colorMode: 'bright' | 'soft' | 'high-contrast';
    autoSave: boolean;
    soundEnabled: boolean;
    musicEnabled: boolean;
    visualEffects: boolean;
    hapticEnabled: boolean;
  };
  audio: {
    masterVolume: number;
    musicVolume: number;
    effectsVolume: number;
    voiceVolume: number;
    soundEnabled: boolean;
    musicEnabled: boolean;
    hapticEnabled: boolean;
  };
  accessibility: {
    screenReaderEnabled: boolean;
    keyboardNavigationEnabled: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    subtitles: boolean;
    largeText: boolean;
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    screenReader: boolean;
  };
  privacy: {
    analyticsEnabled: boolean;
    crashReportingEnabled: boolean;
    personalizedAdsEnabled: boolean;
  };
  parental: {
    parentalControlsEnabled: boolean;
    timeLimit: number; // minutes per day
    contentFilter: 'all' | 'age-appropriate' | 'curated' | 'strict' | 'moderate' | 'relaxed';
    requirePinForSettings: boolean;
    requirePinForPurchases: boolean;
    sessionDuration: number;
    ageRestriction: boolean;
  };
}

const initialState: SettingsState = {
  app: {
    theme: 'auto',
    language: 'en',
    fontSize: 'medium',
    animationSpeed: 'normal',
    colorMode: 'bright',
    autoSave: true,
    soundEnabled: true,
    musicEnabled: true,
    visualEffects: true,
    hapticEnabled: true,
  },
  audio: {
    masterVolume: 0.7,
    musicVolume: 0.5,
    effectsVolume: 0.7,
    voiceVolume: 0.8,
    soundEnabled: true,
    musicEnabled: true,
    hapticEnabled: true,
  },
  accessibility: {
    screenReaderEnabled: false,
    keyboardNavigationEnabled: false,
    reducedMotion: false,
    highContrast: false,
    subtitles: false,
    largeText: false,
    colorBlindMode: 'none',
    fontSize: 'medium',
    screenReader: false,
  },
  privacy: {
    analyticsEnabled: true,
    crashReportingEnabled: true,
    personalizedAdsEnabled: false,
  },
  parental: {
    parentalControlsEnabled: false,
    timeLimit: 0, // 0 = unlimited
    contentFilter: 'moderate',
    requirePinForSettings: false,
    requirePinForPurchases: true,
    sessionDuration: 30,
    ageRestriction: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // App settings
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.app.theme = action.payload;
    },
    
    setLanguage: (state, action: PayloadAction<string>) => {
      state.app.language = action.payload;
    },
    
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.app.fontSize = action.payload;
      // Also update accessibility large text setting
      state.accessibility.largeText = action.payload === 'large';
    },
    
    setAnimationSpeed: (state, action: PayloadAction<'slow' | 'normal' | 'fast'>) => {
      state.app.animationSpeed = action.payload;
    },
    
    setColorMode: (state, action: PayloadAction<'bright' | 'soft' | 'high-contrast'>) => {
      state.app.colorMode = action.payload;
      state.accessibility.highContrast = action.payload === 'high-contrast';
    },
    
    toggleAutoSave: (state) => {
      state.app.autoSave = !state.app.autoSave;
    },
    
    // Audio settings
    setMasterVolume: (state, action: PayloadAction<number>) => {
      state.audio.masterVolume = Math.max(0, Math.min(1, action.payload));
    },
    
    setMusicVolume: (state, action: PayloadAction<number>) => {
      state.audio.musicVolume = Math.max(0, Math.min(1, action.payload));
    },
    
    setEffectsVolume: (state, action: PayloadAction<number>) => {
      state.audio.effectsVolume = Math.max(0, Math.min(1, action.payload));
    },
    
    setVoiceVolume: (state, action: PayloadAction<number>) => {
      state.audio.voiceVolume = Math.max(0, Math.min(1, action.payload));
    },
    
    toggleSoundEnabled: (state) => {
      state.audio.soundEnabled = !state.audio.soundEnabled;
    },
    
    toggleMusicEnabled: (state) => {
      state.audio.musicEnabled = !state.audio.musicEnabled;
    },
    
    toggleHapticEnabled: (state) => {
      state.audio.hapticEnabled = !state.audio.hapticEnabled;
    },
    
    // Accessibility settings
    toggleScreenReader: (state) => {
      state.accessibility.screenReaderEnabled = !state.accessibility.screenReaderEnabled;
    },
    
    toggleKeyboardNavigation: (state) => {
      state.accessibility.keyboardNavigationEnabled = !state.accessibility.keyboardNavigationEnabled;
    },
    
    toggleReducedMotion: (state) => {
      state.accessibility.reducedMotion = !state.accessibility.reducedMotion;
      // If reduced motion is enabled, set animation speed to slow
      if (state.accessibility.reducedMotion) {
        state.app.animationSpeed = 'slow';
      }
    },
    
    toggleHighContrast: (state) => {
      state.accessibility.highContrast = !state.accessibility.highContrast;
      state.app.colorMode = state.accessibility.highContrast ? 'high-contrast' : 'bright';
    },
    
    toggleSubtitles: (state) => {
      state.accessibility.subtitles = !state.accessibility.subtitles;
    },
    
    setColorBlindMode: (state, action: PayloadAction<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>) => {
      state.accessibility.colorBlindMode = action.payload;
    },
    
    // Privacy settings
    toggleAnalytics: (state) => {
      state.privacy.analyticsEnabled = !state.privacy.analyticsEnabled;
    },
    
    toggleCrashReporting: (state) => {
      state.privacy.crashReportingEnabled = !state.privacy.crashReportingEnabled;
    },
    
    togglePersonalizedAds: (state) => {
      state.privacy.personalizedAdsEnabled = !state.privacy.personalizedAdsEnabled;
    },
    
    // Parental settings
    toggleParentalControls: (state) => {
      state.parental.parentalControlsEnabled = !state.parental.parentalControlsEnabled;
    },
    
    setTimeLimit: (state, action: PayloadAction<number>) => {
      state.parental.timeLimit = Math.max(0, action.payload);
    },
    
    setContentFilter: (state, action: PayloadAction<'all' | 'age-appropriate' | 'curated'>) => {
      state.parental.contentFilter = action.payload;
    },
    
    toggleRequirePinForSettings: (state) => {
      state.parental.requirePinForSettings = !state.parental.requirePinForSettings;
    },
    
    toggleRequirePinForPurchases: (state) => {
      state.parental.requirePinForPurchases = !state.parental.requirePinForPurchases;
    },
    
    // Bulk update settings
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },

    updateAppSettings: (state, action: PayloadAction<Partial<SettingsState['app']>>) => {
      state.app = { ...state.app, ...action.payload };
    },

    updateAccessibilitySettings: (state, action: PayloadAction<Partial<SettingsState['accessibility']>>) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
    },

    updateParentalControls: (state, action: PayloadAction<Partial<SettingsState['parental']>>) => {
      state.parental = { ...state.parental, ...action.payload };
    },

    // Reset settings to defaults
    resetSettings: () => initialState,
  },
});

export const {
  setTheme,
  setLanguage,
  setFontSize,
  setAnimationSpeed,
  setColorMode,
  toggleAutoSave,
  setMasterVolume,
  setMusicVolume,
  setEffectsVolume,
  setVoiceVolume,
  toggleSoundEnabled,
  toggleMusicEnabled,
  toggleHapticEnabled,
  toggleScreenReader,
  toggleKeyboardNavigation,
  toggleReducedMotion,
  toggleHighContrast,
  toggleSubtitles,
  setColorBlindMode,
  toggleAnalytics,
  toggleCrashReporting,
  togglePersonalizedAds,
  toggleParentalControls,
  setTimeLimit,
  setContentFilter,
  toggleRequirePinForSettings,
  toggleRequirePinForPurchases,
  updateSettings,
  updateAppSettings,
  updateAccessibilitySettings,
  updateParentalControls,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;