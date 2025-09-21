import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { avatarService, type Avatar } from '../../services/auth/AvatarService';

export interface AvatarSelectionProps {
  profileId: string;
  currentAvatarId?: string;
  onAvatarSelect: (avatar: Avatar) => void;
  onClose: () => void;
  showUnlockedOnly?: boolean;
}

const AvatarSelectionComponent: React.FC<AvatarSelectionProps> = ({
  profileId,
  currentAvatarId,
  onAvatarSelect,
  onClose,
  showUnlockedOnly = true
}) => {
  const [allAvatars, setAllAvatars] = useState<Avatar[]>([]);
  const [unlockedAvatars, setUnlockedAvatars] = useState<Avatar[]>([]);
  const [favoriteAvatars, setFavoriteAvatars] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Avatar['category'] | 'all' | 'favorites'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [avatarStats, setAvatarStats] = useState<any>(null);

  const categories: { id: Avatar['category'] | 'all' | 'favorites'; name: string; emoji: string }[] = [
    { id: 'all', name: 'All', emoji: '🌟' },
    { id: 'favorites', name: 'Favorites', emoji: '💖' },
    { id: 'animals', name: 'Animals', emoji: '🐾' },
    { id: 'characters', name: 'Characters', emoji: '🦸' },
    { id: 'nature', name: 'Nature', emoji: '🌱' },
    { id: 'space', name: 'Space', emoji: '🚀' },
    { id: 'fantasy', name: 'Fantasy', emoji: '🦄' },
    { id: 'objects', name: 'Objects', emoji: '📚' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: 50 }
  };

  const avatarVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  const categoryVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    loadAvatarData();
  }, [profileId]);

  const loadAvatarData = async () => {
    try {
      setIsLoading(true);

      // Load all avatars
      const all = avatarService.getAllAvatars();
      setAllAvatars(all);

      // Load unlocked avatars
      const unlocked = await avatarService.getUnlockedAvatars(profileId);
      setUnlockedAvatars(unlocked);

      // Load avatar collection to get favorites
      const collection = await (avatarService as any).getAvatarCollection(profileId);
      setFavoriteAvatars(collection.favoriteAvatars || []);

      // Load avatar stats
      const stats = await avatarService.getAvatarStats(profileId);
      setAvatarStats(stats);

    } catch (error) {
      console.error('Error loading avatar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayAvatars = (): Avatar[] => {
    let avatarsToShow = showUnlockedOnly ? unlockedAvatars : allAvatars;

    if (selectedCategory === 'favorites') {
      return avatarsToShow.filter(avatar => favoriteAvatars.includes(avatar.id));
    } else if (selectedCategory !== 'all') {
      return avatarsToShow.filter(avatar => avatar.category === selectedCategory);
    }

    return avatarsToShow;
  };

  const handleAvatarClick = async (avatar: Avatar) => {
    // Check if avatar is unlocked
    if (showUnlockedOnly && !unlockedAvatars.some(a => a.id === avatar.id)) {
      return;
    }

    try {
      // Set as current avatar
      const result = await avatarService.setCurrentAvatar(profileId, avatar.id);

      if (result.success) {
        onAvatarSelect(avatar);
      }
    } catch (error) {
      console.error('Error selecting avatar:', error);
    }
  };

  const toggleFavorite = async (avatarId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (favoriteAvatars.includes(avatarId)) {
        await avatarService.removeFromFavorites(profileId, avatarId);
        setFavoriteAvatars(prev => prev.filter(id => id !== avatarId));
      } else {
        await avatarService.addToFavorites(profileId, avatarId);
        setFavoriteAvatars(prev => [...prev, avatarId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getRarityColor = (rarity: Avatar['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityGlow = (rarity: Avatar['rarity']) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-200';
      case 'epic': return 'shadow-purple-200';
      case 'legendary': return 'shadow-yellow-300';
      default: return 'shadow-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading avatars...</span>
          </div>
        </div>
      </div>
    );
  }

  const displayAvatars = getDisplayAvatars();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Avatar</h2>
              {avatarStats && (
                <p className="text-blue-100">
                  {avatarStats.unlockedCount} of {avatarStats.totalAvatars} unlocked
                  ({avatarStats.completionPercentage}%)
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Category Sidebar */}
          <div className="w-48 bg-gray-50 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  variants={categoryVariants}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'hover:bg-white border-2 border-transparent'
                  }`}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                  {category.id === 'favorites' && (
                    <span className="ml-auto text-sm text-gray-500">
                      ({favoriteAvatars.length})
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Collection Stats */}
            {avatarStats && (
              <div className="mt-6 p-3 bg-white rounded-xl">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Collection</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Common:</span>
                    <span>{avatarStats.unlockedCount - avatarStats.rareAvatarsUnlocked - avatarStats.epicAvatarsUnlocked - avatarStats.legendaryAvatarsUnlocked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Rare:</span>
                    <span>{avatarStats.rareAvatarsUnlocked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600">Epic:</span>
                    <span>{avatarStats.epicAvatarsUnlocked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Legendary:</span>
                    <span>{avatarStats.legendaryAvatarsUnlocked}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Avatar Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {displayAvatars.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {selectedCategory === 'favorites' ? 'No Favorites Yet' : 'No Avatars Unlocked'}
                </h3>
                <p className="text-gray-500">
                  {selectedCategory === 'favorites'
                    ? 'Add avatars to your favorites by clicking the heart icon'
                    : 'Keep playing to unlock more avatars!'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                <AnimatePresence>
                  {displayAvatars.map((avatar) => {
                    const isSelected = avatar.id === currentAvatarId;
                    const isUnlocked = unlockedAvatars.some(a => a.id === avatar.id);
                    const isFavorite = favoriteAvatars.includes(avatar.id);

                    return (
                      <motion.div
                        key={avatar.id}
                        variants={avatarVariants}
                        whileHover={isUnlocked ? "hover" : undefined}
                        whileTap={isUnlocked ? "tap" : undefined}
                        onClick={() => isUnlocked && handleAvatarClick(avatar)}
                        className={`relative group cursor-pointer ${
                          isUnlocked ? '' : 'cursor-not-allowed'
                        }`}
                      >
                        {/* Avatar Circle */}
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl border-3 shadow-lg transition-all duration-300 ${
                            isSelected
                              ? 'border-green-400 bg-green-50 shadow-green-200'
                              : isUnlocked
                                ? `${getRarityColor(avatar.rarity)} ${getRarityGlow(avatar.rarity)}`
                                : 'border-gray-200 bg-gray-100 opacity-50'
                          }`}
                        >
                          {isUnlocked ? (
                            avatar.emoji
                          ) : (
                            <span className="text-gray-400">🔒</span>
                          )}

                          {/* Selection Indicator */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}

                          {/* Favorite Button */}
                          {isUnlocked && (
                            <button
                              onClick={(e) => toggleFavorite(avatar.id, e)}
                              className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <span className={`text-sm ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
                                {isFavorite ? '❤️' : '🤍'}
                              </span>
                            </button>
                          )}

                          {/* Rarity Indicator */}
                          {avatar.rarity !== 'common' && isUnlocked && (
                            <div className="absolute -top-2 -left-2">
                              {avatar.rarity === 'rare' && <span className="text-blue-500">💎</span>}
                              {avatar.rarity === 'epic' && <span className="text-purple-500">⭐</span>}
                              {avatar.rarity === 'legendary' && <span className="text-yellow-500">👑</span>}
                            </div>
                          )}
                        </div>

                        {/* Avatar Name */}
                        <div className="text-center mt-2">
                          <p className={`text-xs font-medium ${
                            isUnlocked ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {avatar.name}
                          </p>
                          {!isUnlocked && avatar.unlockCondition && (
                            <p className="text-xs text-gray-400 mt-1">
                              {avatar.unlockCondition.type === 'level'
                                ? `Level ${avatar.unlockCondition.requirement}`
                                : 'Special unlock'
                              }
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AvatarSelectionComponent;