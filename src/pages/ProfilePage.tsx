import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import {
  updateStudentProfile,
  updateAvatar,
  updatePreferences
} from '@/store/slices/studentSlice';
import { trackEvent } from '@/store/slices/analyticsSlice';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  requirement: number;
  category: 'games' | 'learning' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Avatar {
  id: string;
  name: string;
  image: string;
  unlocked: boolean;
  requirement?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();

  const { profile, skillLevels, achievements: userAchievements, preferences } = useAppSelector(state => state.student);
  const { totalStats, recentSessions } = useAppSelector(state => state.analytics);
  const { soundEnabled } = useAppSelector(state => state.settings.app);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [editedAge, setEditedAge] = useState(profile?.age?.toString() || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || '');
  const [selectedTheme, setSelectedTheme] = useState(preferences?.theme || 'default');
  const [showAchievements, setShowAchievements] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview');

  const avatars: Avatar[] = [
    { id: 'cat', name: 'Clever Cat', image: '🐱', unlocked: true },
    { id: 'dog', name: 'Determined Dog', image: '🐶', unlocked: true },
    { id: 'rabbit', name: 'Rapid Rabbit', image: '🐰', unlocked: true },
    { id: 'bear', name: 'Brave Bear', image: '🐻', unlocked: true },
    { id: 'panda', name: 'Peaceful Panda', image: '🐼', unlocked: skillLevels?.overall >= 5 },
    { id: 'lion', name: 'Leader Lion', image: '🦁', unlocked: skillLevels?.overall >= 10 },
    { id: 'unicorn', name: 'Unique Unicorn', image: '🦄', unlocked: skillLevels?.overall >= 15 },
    { id: 'dragon', name: 'Daring Dragon', image: '🐲', unlocked: skillLevels?.overall >= 20 },
    { id: 'robot', name: 'Radical Robot', image: '🤖', unlocked: totalStats?.gamesPlayed >= 50 },
    { id: 'alien', name: 'Awesome Alien', image: '👽', unlocked: totalStats?.gamesPlayed >= 100 }
  ];

  const achievements: Achievement[] = [
    {
      id: 'first-game',
      title: 'First Steps',
      description: 'Complete your first game',
      icon: '🎮',
      unlockedAt: totalStats?.gamesPlayed > 0 ? new Date() : undefined,
      progress: Math.min(totalStats?.gamesPlayed || 0, 1),
      requirement: 1,
      category: 'games',
      rarity: 'common'
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score',
      description: 'Get 100% accuracy in a game',
      icon: '💯',
      progress: totalStats?.perfectGames || 0,
      requirement: 1,
      category: 'games',
      rarity: 'rare'
    },
    {
      id: 'streak-5',
      title: 'On Fire!',
      description: 'Get a 5-answer streak',
      icon: '🔥',
      progress: totalStats?.bestStreak || 0,
      requirement: 5,
      category: 'games',
      rarity: 'common'
    },
    {
      id: 'math-master',
      title: 'Math Master',
      description: 'Reach level 10 in Math',
      icon: '🧮',
      progress: skillLevels?.math || 0,
      requirement: 10,
      category: 'learning',
      rarity: 'epic'
    },
    {
      id: 'english-expert',
      title: 'English Expert',
      description: 'Reach level 10 in English',
      icon: '📚',
      progress: skillLevels?.english || 0,
      requirement: 10,
      category: 'learning',
      rarity: 'epic'
    },
    {
      id: 'science-scholar',
      title: 'Science Scholar',
      description: 'Reach level 10 in Science',
      icon: '🔬',
      progress: skillLevels?.science || 0,
      requirement: 10,
      category: 'learning',
      rarity: 'epic'
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Play 5 games before noon',
      icon: '🌅',
      progress: totalStats?.morningGames || 0,
      requirement: 5,
      category: 'special',
      rarity: 'common'
    },
    {
      id: 'night-owl',
      title: 'Night Owl',
      description: 'Play 5 games after 8 PM',
      icon: '🦉',
      progress: totalStats?.eveningGames || 0,
      requirement: 5,
      category: 'special',
      rarity: 'common'
    },
    {
      id: 'dedicated',
      title: 'Dedicated Learner',
      description: 'Play for 7 days in a row',
      icon: '📅',
      progress: totalStats?.currentLoginStreak || 0,
      requirement: 7,
      category: 'special',
      rarity: 'rare'
    },
    {
      id: 'explorer',
      title: 'Game Explorer',
      description: 'Try 10 different games',
      icon: '🗺️',
      progress: totalStats?.uniqueGamesPlayed || 0,
      requirement: 10,
      category: 'games',
      rarity: 'rare'
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete a game in under 5 minutes',
      icon: '⚡',
      unlockedAt: totalStats?.fastestGameTime && totalStats.fastestGameTime < 300 ? new Date() : undefined,
      progress: totalStats?.fastestGameTime ? 1 : 0,
      requirement: 1,
      category: 'games',
      rarity: 'rare'
    },
    {
      id: 'legendary',
      title: 'Legendary Learner',
      description: 'Reach overall level 25',
      icon: '👑',
      progress: skillLevels?.overall || 0,
      requirement: 25,
      category: 'special',
      rarity: 'legendary'
    }
  ];

  const handleSaveProfile = () => {
    if (soundEnabled) {
      playSound('success');
    }
    triggerHaptic('success');

    dispatch(updateStudentProfile({
      name: editedName,
      age: parseInt(editedAge),
      avatar: typeof selectedAvatar === 'string' ? selectedAvatar : undefined
    }));

    dispatch(updatePreferences({
      theme: selectedTheme
    }));

    dispatch(trackEvent({
      category: 'profile',
      action: 'update',
      label: 'profile_edit'
    }));

    setIsEditing(false);
  };

  const handleAvatarSelect = (avatarId: string) => {
    const avatar = avatars.find(a => a.id === avatarId);
    if (avatar?.unlocked) {
      setSelectedAvatar(avatarId);
      if (soundEnabled) {
        playSound('click');
      }
      triggerHaptic('light');
    }
  };

  const getSkillColor = (level: number) => {
    if (level >= 20) return 'bg-purple-500';
    if (level >= 15) return 'bg-blue-500';
    if (level >= 10) return 'bg-green-500';
    if (level >= 5) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      case 'epic': return 'text-purple-500 bg-purple-100 dark:bg-purple-900';
      case 'rare': return 'text-blue-500 bg-blue-100 dark:bg-blue-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getAgeGroup = (age: number) => {
    if (age <= 5) return '3-5 years';
    if (age <= 8) return '6-8 years';
    return '9+ years';
  };

  const calculateNextLevelXP = (currentLevel: number) => {
    return (currentLevel + 1) * 100;
  };

  const calculateCurrentXP = (level: number) => {
    return (level * 100) * 0.7;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'primary' : 'outline'}
            size="sm"
          >
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab('achievements')}
            variant={activeTab === 'achievements' ? 'primary' : 'outline'}
            size="sm"
          >
            Achievements
          </Button>
          <Button
            onClick={() => setActiveTab('settings')}
            variant={activeTab === 'settings' ? 'primary' : 'outline'}
            size="sm"
          >
            Settings
          </Button>
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="text-6xl p-4 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full">
                    {avatars.find(a => a.id === (isEditing ? selectedAvatar : profile?.avatar))?.image || '🐱'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black rounded-full px-2 py-1 text-sm font-bold">
                    Lv {skillLevels?.overall || 1}
                  </div>
                </div>

                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Enter your name"
                        className="text-2xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:text-white"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-gray-600 dark:text-gray-300">Age:</label>
                        <input
                          type="number"
                          value={editedAge}
                          onChange={(e) => setEditedAge(e.target.value)}
                          min="3"
                          max="12"
                          className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <Button onClick={handleSaveProfile} variant="primary">
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profile?.name || 'Guest Player'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {profile?.age ? `${profile.age} years old • ${getAgeGroup(profile.age)}` : 'Age not set'}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Progress</p>
                        <ProgressBar
                          progress={(calculateCurrentXP(skillLevels?.overall || 0) / calculateNextLevelXP(skillLevels?.overall || 0)) * 100}
                          className="h-3"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {Math.floor(calculateCurrentXP(skillLevels?.overall || 0))} / {calculateNextLevelXP(skillLevels?.overall || 0)} XP
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Choose Avatar:</p>
                  <div className="grid grid-cols-5 gap-2">
                    {avatars.map((avatar) => (
                      <motion.button
                        key={avatar.id}
                        whileHover={avatar.unlocked ? { scale: 1.1 } : {}}
                        whileTap={avatar.unlocked ? { scale: 0.9 } : {}}
                        onClick={() => handleAvatarSelect(avatar.id)}
                        className={`p-3 rounded-lg transition-all ${
                          selectedAvatar === avatar.id
                            ? 'bg-blue-500 shadow-lg'
                            : avatar.unlocked
                            ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                            : 'bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                        }`}
                        disabled={!avatar.unlocked}
                      >
                        <div className="text-2xl">{avatar.image}</div>
                        {!avatar.unlocked && (
                          <svg className="w-4 h-4 mx-auto mt-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skill Levels</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-300">🧮 Mathematics</span>
                    <span className="font-bold text-gray-900 dark:text-white">Level {skillLevels?.math || 1}</span>
                  </div>
                  <ProgressBar
                    progress={(calculateCurrentXP(skillLevels?.math || 0) / calculateNextLevelXP(skillLevels?.math || 0)) * 100}
                    className={`h-3 ${getSkillColor(skillLevels?.math || 0)}`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-300">📚 English</span>
                    <span className="font-bold text-gray-900 dark:text-white">Level {skillLevels?.english || 1}</span>
                  </div>
                  <ProgressBar
                    progress={(calculateCurrentXP(skillLevels?.english || 0) / calculateNextLevelXP(skillLevels?.english || 0)) * 100}
                    className={`h-3 ${getSkillColor(skillLevels?.english || 0)}`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-300">🔬 Science</span>
                    <span className="font-bold text-gray-900 dark:text-white">Level {skillLevels?.science || 1}</span>
                  </div>
                  <ProgressBar
                    progress={(calculateCurrentXP(skillLevels?.science || 0) / calculateNextLevelXP(skillLevels?.science || 0)) * 100}
                    className={`h-3 ${getSkillColor(skillLevels?.science || 0)}`}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-500">{totalStats?.gamesPlayed || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Games Played</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">{totalStats?.totalScore || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Points</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-500">
                    {totalStats?.averageAccuracy ? `${Math.round(totalStats.averageAccuracy)}%` : '0%'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-500">{totalStats?.currentLoginStreak || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Day Streak</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {achievements.map((achievement) => {
              const isUnlocked = achievement.unlockedAt || ((achievement.progress || 0) >= achievement.requirement);

              return (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`p-4 ${isUnlocked ? '' : 'opacity-60'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`text-3xl p-2 rounded-lg ${isUnlocked ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {achievement.description}
                        </p>
                        <div className="mt-2">
                          <ProgressBar
                            progress={((achievement.progress || 0) / achievement.requirement) * 100}
                            className="h-2"
                          />
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {achievement.progress || 0} / {achievement.requirement}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="default">Default</option>
                    <option value="ocean">Ocean</option>
                    <option value="forest">Forest</option>
                    <option value="space">Space</option>
                    <option value="candy">Candy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty Preference
                  </label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Easy</Button>
                    <Button variant="primary" size="sm">Adaptive</Button>
                    <Button variant="outline" size="sm">Challenge</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Learning Style
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-gray-700 dark:text-gray-300">Visual Learning</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-gray-700 dark:text-gray-300">Audio Instructions</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">Hands-on Activities</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Privacy & Safety</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Show Profile to Friends</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Share Achievements</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Allow Friend Requests</span>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => navigate('/parent-dashboard')} variant="outline">
                Parent Controls
              </Button>
              <Button onClick={() => window.location.href = '/logout'} variant="outline" className="text-red-500">
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;