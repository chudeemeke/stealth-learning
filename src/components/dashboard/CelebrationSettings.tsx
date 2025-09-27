/**
 * Celebration Settings Component
 * Allows parents to customize celebration and feedback styles
 * Provides preview system for testing different options
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  advancedCelebrationService,
  type CelebrationStyle,
  type Subject
} from '@/services/celebrations/AdvancedCelebrationService';
import {
  quickFeedbackEngine,
  type FeedbackStyle
} from '@/services/feedback/QuickFeedbackEngine';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SecureInput } from '@/components/ui/SecureInput';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';

interface CelebrationPreferences {
  celebrationStyle: CelebrationStyle;
  feedbackStyle: FeedbackStyle;
  intensity: 'low' | 'medium' | 'high';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  reducedMotion: boolean;
  autoProgress: boolean;
  companionEnabled: boolean;
}

interface ChildPreferences {
  childId: string;
  childName: string;
  preferences: CelebrationPreferences;
}

export const CelebrationSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();

  const { children } = useAppSelector(state => state.parent);
  const { soundEnabled } = useAppSelector(state => state.settings.app);

  const [selectedChild, setSelectedChild] = useState<string>('');
  const [preferences, setPreferences] = useState<CelebrationPreferences>({
    celebrationStyle: 'cosmic',
    feedbackStyle: 'pulse',
    intensity: 'medium',
    soundEnabled: true,
    hapticEnabled: true,
    reducedMotion: false,
    autoProgress: true,
    companionEnabled: true
  });

  const [previewSubject, setPreviewSubject] = useState<Subject>('math');
  const [previewMode, setPreviewMode] = useState<'correct' | 'incorrect'>('correct');
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  // Load saved preferences
  useEffect(() => {
    if (selectedChild) {
      const saved = localStorage.getItem(`celebration-prefs-${selectedChild}`);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    }
  }, [selectedChild]);

  const handleSavePreferences = () => {
    if (selectedChild) {
      localStorage.setItem(
        `celebration-prefs-${selectedChild}`,
        JSON.stringify(preferences)
      );

      // Apply settings to services
      advancedCelebrationService.setCelebrationStyle(preferences.celebrationStyle);
      quickFeedbackEngine.setFeedbackStyle(preferences.feedbackStyle);

      // Show success message
      showSuccessNotification('Settings saved successfully!');

      if (soundEnabled) {
        playSound('success');
      }
    }
  };

  const handlePreviewCelebration = () => {
    setIsPreviewActive(true);

    if (previewMode === 'correct') {
      // Preview correct answer celebration
      advancedCelebrationService.celebrate({
        subject: previewSubject,
        style: preferences.celebrationStyle,
        intensity: preferences.intensity,
        ageGroup: getChildAgeGroup(selectedChild),
        streakLevel: 5, // Show mid-level celebration
        soundEnabled: preferences.soundEnabled,
        hapticEnabled: preferences.hapticEnabled,
        reducedMotion: preferences.reducedMotion
      });
    } else {
      // Preview incorrect answer feedback
      const feedbackArea = document.querySelector('.preview-area');
      quickFeedbackEngine.provideFeedback({
        style: preferences.feedbackStyle,
        ageGroup: getChildAgeGroup(selectedChild),
        subject: previewSubject,
        soundEnabled: preferences.soundEnabled,
        hapticEnabled: preferences.hapticEnabled,
        proximity: 0.7
      }, feedbackArea as HTMLElement);
    }

    setTimeout(() => setIsPreviewActive(false), 3000);
  };

  const getChildAgeGroup = (childId: string): '3-5' | '6-8' | '9+' => {
    const child = children?.find(c => c.id === childId);
    const age = child?.age || 6;
    return age <= 5 ? '3-5' : age <= 8 ? '6-8' : '9+';
  };

  const showSuccessNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10B981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slide-in 0.3s ease-out;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slide-out 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const celebrationStyles = [
    {
      id: 'cosmic',
      name: 'Cosmic Achievement',
      description: 'Progressive multi-layered celebrations with tiers',
      icon: '🌟'
    },
    {
      id: 'universe',
      name: 'Subject Universe',
      description: 'Immersive subject-themed experiences',
      icon: '🌌'
    },
    {
      id: 'companion',
      name: 'Companion Evolution',
      description: 'Growing celebration partners that evolve',
      icon: '🦄'
    }
  ];

  const feedbackStyles = [
    {
      id: 'pulse',
      name: 'Gentle Pulse',
      description: 'Soft glow with encouraging messages',
      icon: '💫'
    },
    {
      id: 'quantum',
      name: 'Quantum Shift',
      description: 'Time rewind effect with hints',
      icon: '⚡'
    },
    {
      id: 'aurora',
      name: 'Aurora Guidance',
      description: 'Atmospheric feedback with color temperature',
      icon: '🌈'
    }
  ];

  const subjects: Subject[] = ['math', 'english', 'science', 'logic', 'geography', 'arts'];
  const subjectIcons = {
    math: '🔢',
    english: '📚',
    science: '🔬',
    logic: '🧩',
    geography: '🌍',
    arts: '🎨'
  };

  return (
    <div className="celebration-settings max-w-6xl mx-auto p-6">
      <motion.h2
        className="text-3xl font-bold text-gray-900 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎉 Celebration & Feedback Settings
      </motion.h2>

      {/* Child Selector */}
      <Card className="mb-8 p-6">
        <h3 className="text-xl font-semibold mb-4">Select Child</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {children?.map(child => (
            <motion.button
              key={child.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedChild === child.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedChild(child.id)}
            >
              <div className="text-4xl mb-2">{child.avatar || '👤'}</div>
              <div className="font-semibold">{child.name}</div>
              <div className="text-sm text-gray-600">Age {child.age}</div>
            </motion.button>
          ))}
        </div>
      </Card>

      <AnimatePresence>
        {selectedChild && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Celebration Style Selector */}
            <Card className="mb-8 p-6">
              <h3 className="text-xl font-semibold mb-4">Correct Answer Celebration Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {celebrationStyles.map(style => (
                  <motion.div
                    key={style.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      preferences.celebrationStyle === style.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPreferences({
                      ...preferences,
                      celebrationStyle: style.id as CelebrationStyle
                    })}
                  >
                    <div className="text-3xl mb-2">{style.icon}</div>
                    <div className="font-semibold">{style.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{style.description}</div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Feedback Style Selector */}
            <Card className="mb-8 p-6">
              <h3 className="text-xl font-semibold mb-4">Incorrect Answer Feedback Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {feedbackStyles.map(style => (
                  <motion.div
                    key={style.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      preferences.feedbackStyle === style.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPreferences({
                      ...preferences,
                      feedbackStyle: style.id as FeedbackStyle
                    })}
                  >
                    <div className="text-3xl mb-2">{style.icon}</div>
                    <div className="font-semibold">{style.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{style.description}</div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Intensity Settings */}
            <Card className="mb-8 p-6">
              <h3 className="text-xl font-semibold mb-4">Effect Intensity</h3>
              <div className="flex gap-4">
                {(['low', 'medium', 'high'] as const).map(level => (
                  <button
                    key={level}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      preferences.intensity === level
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setPreferences({ ...preferences, intensity: level })}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </Card>

            {/* Additional Settings */}
            <Card className="mb-8 p-6">
              <h3 className="text-xl font-semibold mb-4">Additional Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      soundEnabled: e.target.checked
                    })}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Enable Sound Effects</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.hapticEnabled}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      hapticEnabled: e.target.checked
                    })}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Enable Haptic Feedback (Vibration)</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.reducedMotion}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      reducedMotion: e.target.checked
                    })}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Reduce Motion (Accessibility)</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.companionEnabled}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      companionEnabled: e.target.checked
                    })}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Enable Celebration Companions</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.autoProgress}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      autoProgress: e.target.checked
                    })}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Auto-progress to Next Question</span>
                </label>
              </div>
            </Card>

            {/* Preview System */}
            <Card className="mb-8 p-6 preview-area">
              <h3 className="text-xl font-semibold mb-4">Preview Celebrations</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject
                </label>
                <div className="flex gap-2">
                  {subjects.map(subject => (
                    <button
                      key={subject}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        previewSubject === subject
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setPreviewSubject(subject)}
                    >
                      {subjectIcons[subject]} {subject}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview Type
                </label>
                <div className="flex gap-4">
                  <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      previewMode === 'correct'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setPreviewMode('correct')}
                  >
                    ✅ Correct Answer
                  </button>
                  <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      previewMode === 'incorrect'
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setPreviewMode('incorrect')}
                  >
                    ❌ Incorrect Answer
                  </button>
                </div>
              </div>

              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isPreviewActive ? 1 : 1.05 }}
                whileTap={{ scale: isPreviewActive ? 1 : 0.95 }}
                onClick={handlePreviewCelebration}
                disabled={isPreviewActive}
              >
                {isPreviewActive ? '🎆 Preview Active...' : '🎮 Test Preview'}
              </motion.button>
            </Card>

            {/* Save Button */}
            <motion.div
              className="flex justify-end gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="secondary"
                onClick={() => {
                  // Reset to defaults
                  setPreferences({
                    celebrationStyle: 'cosmic',
                    feedbackStyle: 'pulse',
                    intensity: 'medium',
                    soundEnabled: true,
                    hapticEnabled: true,
                    reducedMotion: false,
                    autoProgress: true,
                    companionEnabled: true
                  });
                }}
              >
                Reset to Defaults
              </Button>

              <Button
                variant="primary"
                onClick={handleSavePreferences}
                className="px-8"
              >
                💾 Save Settings
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CelebrationSettings;