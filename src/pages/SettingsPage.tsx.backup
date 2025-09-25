import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import {
  updatePreferences,
  updateStudentProfile,
} from '@/store/slices/studentSlice';
import {
  updateAppSettings,
  updateAccessibilitySettings,
  updateParentalControls,
  resetSettings,
} from '@/store/slices/settingsSlice';
import { setAdaptiveMode, setDifficultyRange, setPerformanceThresholds } from '@/store/slices/adaptiveSlice';
import { trackEvent } from '@/store/slices/analyticsSlice';

interface SettingSection {
  id: string;
  title: string;
  icon: string;
  description: string;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();

  const { profile, preferences } = useAppSelector(state => state.student);
  const settings = useAppSelector(state => state.settings);
  const adaptiveSettings = useAppSelector(state => state.adaptive);

  const [activeSection, setActiveSection] = useState<string>('general');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Local state for settings
  const [soundEnabled, setSoundEnabled] = useState(settings.app.soundEnabled);
  const [musicEnabled, setMusicEnabled] = useState(settings.app.musicEnabled);
  const [visualEffects, setVisualEffects] = useState(settings.app.visualEffects);
  const [hapticEnabled, setHapticEnabled] = useState(settings.app.hapticEnabled);
  const [theme, setTheme] = useState(settings.app.theme);
  const [fontSize, setFontSize] = useState(settings.accessibility.fontSize);
  const [highContrast, setHighContrast] = useState(settings.accessibility.highContrast);
  const [screenReader, setScreenReader] = useState(settings.accessibility.screenReader);
  const [reducedMotion, setReducedMotion] = useState(settings.accessibility.reducedMotion);
  const [adaptiveMode, setAdaptiveModeLocal] = useState(adaptiveSettings.adaptiveMode);
  const [difficultyMin, setDifficultyMin] = useState(adaptiveSettings.difficultyRange.min);
  const [difficultyMax, setDifficultyMax] = useState(adaptiveSettings.difficultyRange.max);
  const [sessionDuration, setSessionDuration] = useState(settings.parental.sessionDuration);
  const [contentFilter, setContentFilter] = useState(settings.parental.contentFilter);
  const [ageRestriction, setAgeRestriction] = useState(settings.parental.ageRestriction);
  const [requirePinForSettings, setRequirePinForSettings] = useState(settings.parental.requirePinForSettings);

  const sections: SettingSection[] = [
    {
      id: 'general',
      title: 'General',
      icon: '⚙️',
      description: 'Basic app settings and preferences',
    },
    {
      id: 'learning',
      title: 'Learning',
      icon: '🎓',
      description: 'Customize your learning experience',
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      icon: '♿',
      description: 'Make the app easier to use',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: '🔔',
      description: 'Control alerts and reminders',
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: '🔒',
      description: 'Manage your data and privacy',
    },
    {
      id: 'parental',
      title: 'Parental Controls',
      icon: '👨‍👩‍👧‍👦',
      description: 'Family safety settings',
    },
    {
      id: 'about',
      title: 'About',
      icon: 'ℹ️',
      description: 'App information and support',
    },
  ];

  useEffect(() => {
    // Mark as having unsaved changes when any setting changes
    setUnsavedChanges(true);
  }, [
    soundEnabled,
    musicEnabled,
    visualEffects,
    hapticEnabled,
    theme,
    fontSize,
    highContrast,
    screenReader,
    reducedMotion,
    adaptiveMode,
    difficultyMin,
    difficultyMax,
    sessionDuration,
    contentFilter,
    ageRestriction,
    requirePinForSettings,
  ]);

  const handleSaveSettings = () => {
    // Save all settings
    dispatch(updateAppSettings({
      soundEnabled,
      musicEnabled,
      visualEffects,
      hapticEnabled,
      theme,
    }));

    dispatch(updateAccessibilitySettings({
      fontSize,
      highContrast,
      screenReader,
      reducedMotion,
    }));

    dispatch(updateParentalControls({
      sessionDuration,
      contentFilter,
      ageRestriction,
      requirePinForSettings,
    }));

    dispatch(setAdaptiveMode(adaptiveMode));

    dispatch(setDifficultyRange({
      min: difficultyMin,
      max: difficultyMax,
    }));

    dispatch(trackEvent({
      category: 'settings',
      action: 'save',
      label: activeSection,
    }));

    if (soundEnabled) {
      playSound('success');
    }

    triggerHaptic('success');
    setUnsavedChanges(false);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      dispatch(resetSettings());

      // Reset local state
      setSoundEnabled(true);
      setMusicEnabled(true);
      setVisualEffects(true);
      setHapticEnabled(true);
      setTheme('auto');
      setFontSize('medium');
      setHighContrast(false);
      setScreenReader(false);
      setReducedMotion(false);
      setAdaptiveModeLocal('automatic');
      setDifficultyMin(800);
      setDifficultyMax(2000);
      setSessionDuration(30);
      setContentFilter('moderate');
      setAgeRestriction(true);
      setRequirePinForSettings(false);

      if (soundEnabled) {
        playSound('success');
      }

      setUnsavedChanges(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your learning experience
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64"
          >
            <Card className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className={`text-xs ${
                          activeSection === section.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </Card>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            {activeSection === 'general' && (
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    General Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Audio & Haptics
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">Sound Effects</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Play sounds for actions and feedback
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={(e) => setSoundEnabled(e.target.checked)}
                            className="w-5 h-5"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">Background Music</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Ambient music during gameplay
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={musicEnabled}
                            onChange={(e) => setMusicEnabled(e.target.checked)}
                            className="w-5 h-5"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">Haptic Feedback</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Vibration feedback on mobile devices
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={hapticEnabled}
                            onChange={(e) => setHapticEnabled(e.target.checked)}
                            className="w-5 h-5"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Display
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">Visual Effects</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Animations and particle effects
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={visualEffects}
                            onChange={(e) => setVisualEffects(e.target.checked)}
                            className="w-5 h-5"
                          />
                        </label>

                        <div>
                          <label className="text-gray-700 dark:text-gray-300">Theme</label>
                          <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value as any)}
                            className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          >
                            <option value="auto">Auto (System)</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === 'learning' && (
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Learning Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Adaptive Learning
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-700 dark:text-gray-300">Learning Mode</label>
                          <select
                            value={adaptiveMode}
                            onChange={(e) => setAdaptiveModeLocal(e.target.value as any)}
                            className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                          >
                            <option value="automatic">Automatic (Recommended)</option>
                            <option value="manual">Manual</option>
                            <option value="guided">Guided</option>
                          </select>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {adaptiveMode === 'automatic' && 'AI adjusts difficulty based on performance'}
                            {adaptiveMode === 'manual' && 'You control the difficulty level'}
                            {adaptiveMode === 'guided' && 'AI suggests but you decide'}
                          </p>
                        </div>

                        <div>
                          <label className="text-gray-700 dark:text-gray-300">
                            Difficulty Range
                          </label>
                          <div className="mt-2 flex gap-4">
                            <div className="flex-1">
                              <label className="text-sm text-gray-500">Min</label>
                              <input
                                type="number"
                                value={difficultyMin}
                                onChange={(e) => setDifficultyMin(Number(e.target.value))}
                                min="500"
                                max="1500"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-sm text-gray-500">Max</label>
                              <input
                                type="number"
                                value={difficultyMax}
                                onChange={(e) => setDifficultyMax(Number(e.target.value))}
                                min="1500"
                                max="3000"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Learning Preferences
                      </h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">Visual Learning</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Emphasize visual content and diagrams
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">Audio Instructions</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Provide voice guidance and explanations
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">Hands-on Practice</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              More interactive exercises
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === 'accessibility' && (
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Accessibility Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="text-gray-700 dark:text-gray-300">Font Size</label>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value as any)}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="extra-large">Extra Large</option>
                      </select>
                    </div>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">High Contrast</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={highContrast}
                        onChange={(e) => setHighContrast(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Screen Reader Support</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Optimize for screen readers
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={screenReader}
                        onChange={(e) => setScreenReader(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Reduced Motion</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Minimize animations and transitions
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={reducedMotion}
                        onChange={(e) => setReducedMotion(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Color Blind Mode</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Adjust colors for color blindness
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                      />
                    </label>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === 'notifications' && (
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Notification Settings
                  </h2>

                  <div className="space-y-6">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Daily Reminders</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Remind me to practice every day
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Achievement Alerts</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Notify when I unlock achievements
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Progress Updates</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Weekly progress reports
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Friend Activity</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          When friends achieve milestones
                        </p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </label>

                    <div>
                      <label className="text-gray-700 dark:text-gray-300">Reminder Time</label>
                      <input
                        type="time"
                        defaultValue="16:00"
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === 'privacy' && (
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Privacy & Security
                  </h2>

                  <div className="space-y-6">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Data Collection</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow anonymous usage analytics
                        </p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Share Progress</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow friends to see my progress
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Public Profile</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Show profile in leaderboards
                        </p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </label>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Data Management
                      </h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full">
                          Export My Data
                        </Button>
                        <Button variant="outline" className="w-full">
                          Clear Local Cache
                        </Button>
                        <Button variant="outline" className="w-full text-red-500">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === 'parental' && (
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Parental Controls
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="text-gray-700 dark:text-gray-300">
                        Session Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={sessionDuration}
                        onChange={(e) => setSessionDuration(Number(e.target.value))}
                        min="15"
                        max="120"
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="text-gray-700 dark:text-gray-300">Content Filter</label>
                      <select
                        value={contentFilter}
                        onChange={(e) => setContentFilter(e.target.value as any)}
                        className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="strict">Strict</option>
                        <option value="moderate">Moderate</option>
                        <option value="relaxed">Relaxed</option>
                      </select>
                    </div>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Age Restriction</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Show only age-appropriate content
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={ageRestriction}
                        onChange={(e) => setAgeRestriction(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Require PIN</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          PIN required to access settings
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={requirePinForSettings}
                        onChange={(e) => setRequirePinForSettings(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">In-App Purchases</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Disable all in-app purchases
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                    </label>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => navigate('/parent-dashboard')}
                        variant="primary"
                        className="w-full"
                      >
                        Open Parent Dashboard
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === 'about' && (
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    About Stealth Learning
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Version
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">1.0.0</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Mission
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Making learning fun and engaging for children through educational games
                        that adapt to each child's unique learning style and pace.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Support
                      </h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full">
                          📧 Contact Support
                        </Button>
                        <Button variant="outline" className="w-full">
                          📖 User Guide
                        </Button>
                        <Button variant="outline" className="w-full">
                          ❓ FAQ
                        </Button>
                        <Button variant="outline" className="w-full">
                          💬 Community Forum
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Legal
                      </h3>
                      <div className="space-y-2">
                        <a href="#" className="block text-blue-500 hover:underline">
                          Terms of Service
                        </a>
                        <a href="#" className="block text-blue-500 hover:underline">
                          Privacy Policy
                        </a>
                        <a href="#" className="block text-blue-500 hover:underline">
                          COPPA Compliance
                        </a>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        © 2024 Stealth Learning. All rights reserved.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                        Made with ❤️ for young learners everywhere
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Save Bar */}
        {unsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <p className="text-gray-700 dark:text-gray-300">
                You have unsaved changes
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setUnsavedChanges(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResetSettings}
                  variant="outline"
                >
                  Reset All
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  variant="primary"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;