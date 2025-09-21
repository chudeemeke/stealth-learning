import type { ChildProfile } from '../database/schema';

export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  category: 'animals' | 'characters' | 'objects' | 'nature' | 'space' | 'fantasy';
  colorScheme: string;
  unlocked: boolean;
  unlockCondition?: {
    type: 'level' | 'achievement' | 'purchase' | 'default';
    requirement: string | number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
}

export interface AvatarCustomization {
  backgroundColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'gradient';
  borderColor: string;
  borderWidth: number;
  shadowColor: string;
  shadowBlur: number;
  animation?: 'bounce' | 'pulse' | 'glow' | 'rotate' | 'none';
}

export interface AvatarCollection {
  profileId: string;
  unlockedAvatars: string[];
  favoriteAvatars: string[];
  currentAvatar: Avatar;
  customization: AvatarCustomization;
  lastUpdated: Date;
}

class AvatarService {
  private static instance: AvatarService;

  // Predefined avatar collection
  private readonly AVATAR_COLLECTION: Avatar[] = [
    // Common Animals (Default unlocked)
    {
      id: 'dog-1',
      emoji: '🐕',
      name: 'Friendly Dog',
      category: 'animals',
      colorScheme: 'brown',
      unlocked: true,
      unlockCondition: { type: 'default', requirement: 0 },
      rarity: 'common',
      description: 'A loyal and friendly companion'
    },
    {
      id: 'cat-1',
      emoji: '🐱',
      name: 'Curious Cat',
      category: 'animals',
      colorScheme: 'orange',
      unlocked: true,
      unlockCondition: { type: 'default', requirement: 0 },
      rarity: 'common',
      description: 'Always ready to explore'
    },
    {
      id: 'rabbit-1',
      emoji: '🐰',
      name: 'Bouncy Bunny',
      category: 'animals',
      colorScheme: 'white',
      unlocked: true,
      unlockCondition: { type: 'default', requirement: 0 },
      rarity: 'common',
      description: 'Hops with joy everywhere'
    },
    {
      id: 'bear-1',
      emoji: '🐻',
      name: 'Cuddly Bear',
      category: 'animals',
      colorScheme: 'brown',
      unlocked: true,
      unlockCondition: { type: 'default', requirement: 0 },
      rarity: 'common',
      description: 'Gives the best hugs'
    },

    // Characters (Level unlocks)
    {
      id: 'robot-1',
      emoji: '🤖',
      name: 'Learning Bot',
      category: 'characters',
      colorScheme: 'blue',
      unlocked: false,
      unlockCondition: { type: 'level', requirement: 5 },
      rarity: 'rare',
      description: 'Helps you learn new things'
    },
    {
      id: 'superhero-1',
      emoji: '🦸‍♀️',
      name: 'Super Learner',
      category: 'characters',
      colorScheme: 'red',
      unlocked: false,
      unlockCondition: { type: 'level', requirement: 10 },
      rarity: 'epic',
      description: 'Has the power of knowledge'
    },
    {
      id: 'wizard-1',
      emoji: '🧙‍♂️',
      name: 'Wise Wizard',
      category: 'characters',
      colorScheme: 'purple',
      unlocked: false,
      unlockCondition: { type: 'level', requirement: 15 },
      rarity: 'epic',
      description: 'Masters magical learning spells'
    },

    // Nature (Achievement unlocks)
    {
      id: 'tree-1',
      emoji: '🌳',
      name: 'Wisdom Tree',
      category: 'nature',
      colorScheme: 'green',
      unlocked: false,
      unlockCondition: { type: 'achievement', requirement: 'complete-10-science-games' },
      rarity: 'rare',
      description: 'Grows with your knowledge'
    },
    {
      id: 'flower-1',
      emoji: '🌸',
      name: 'Blooming Flower',
      category: 'nature',
      colorScheme: 'pink',
      unlocked: false,
      unlockCondition: { type: 'achievement', requirement: 'complete-10-english-games' },
      rarity: 'rare',
      description: 'Blooms with every success'
    },
    {
      id: 'rainbow-1',
      emoji: '🌈',
      name: 'Happy Rainbow',
      category: 'nature',
      colorScheme: 'rainbow',
      unlocked: false,
      unlockCondition: { type: 'achievement', requirement: 'perfect-streak-5' },
      rarity: 'epic',
      description: 'Appears after perfect storms'
    },

    // Space (Advanced unlocks)
    {
      id: 'rocket-1',
      emoji: '🚀',
      name: 'Knowledge Rocket',
      category: 'space',
      colorScheme: 'silver',
      unlocked: false,
      unlockCondition: { type: 'level', requirement: 20 },
      rarity: 'epic',
      description: 'Blasts off to new learning heights'
    },
    {
      id: 'planet-1',
      emoji: '🪐',
      name: 'Learning Planet',
      category: 'space',
      colorScheme: 'blue',
      unlocked: false,
      unlockCondition: { type: 'achievement', requirement: 'master-all-subjects' },
      rarity: 'legendary',
      description: 'A whole world of knowledge'
    },
    {
      id: 'alien-1',
      emoji: '👽',
      name: 'Friendly Alien',
      category: 'space',
      colorScheme: 'green',
      unlocked: false,
      unlockCondition: { type: 'level', requirement: 25 },
      rarity: 'rare',
      description: 'Shares wisdom from distant stars'
    },

    // Fantasy (Special unlocks)
    {
      id: 'unicorn-1',
      emoji: '🦄',
      name: 'Magic Unicorn',
      category: 'fantasy',
      colorScheme: 'rainbow',
      unlocked: false,
      unlockCondition: { type: 'achievement', requirement: 'complete-100-games' },
      rarity: 'legendary',
      description: 'Magical and full of wonder'
    },
    {
      id: 'dragon-1',
      emoji: '🐉',
      name: 'Wise Dragon',
      category: 'fantasy',
      colorScheme: 'gold',
      unlocked: false,
      unlockCondition: { type: 'achievement', requirement: 'achieve-grandmaster' },
      rarity: 'legendary',
      description: 'Guardian of ancient knowledge'
    },

    // Objects (Fun unlocks)
    {
      id: 'book-1',
      emoji: '📚',
      name: 'Smart Books',
      category: 'objects',
      colorScheme: 'blue',
      unlocked: false,
      unlockCondition: { type: 'achievement', requirement: 'read-master' },
      rarity: 'rare',
      description: 'Contains all the stories'
    },
    {
      id: 'trophy-1',
      emoji: '🏆',
      name: 'Golden Trophy',
      category: 'objects',
      colorScheme: 'gold',
      unlocked: false,
      unlockCondition: { type: 'achievement', requirement: 'win-10-competitions' },
      rarity: 'epic',
      description: 'Symbol of your achievements'
    }
  ];

  // Color schemes for customization
  private readonly COLOR_SCHEMES = {
    blue: { primary: '#3B82F6', secondary: '#DBEAFE', accent: '#1D4ED8' },
    green: { primary: '#10B981', secondary: '#D1FAE5', accent: '#047857' },
    purple: { primary: '#8B5CF6', secondary: '#EDE9FE', accent: '#5B21B6' },
    pink: { primary: '#EC4899', secondary: '#FCE7F3', accent: '#BE185D' },
    orange: { primary: '#F59E0B', secondary: '#FEF3C7', accent: '#D97706' },
    red: { primary: '#EF4444', secondary: '#FEE2E2', accent: '#DC2626' },
    brown: { primary: '#A3A3A3', secondary: '#F5F5F5', accent: '#525252' },
    white: { primary: '#F9FAFB', secondary: '#F3F4F6', accent: '#6B7280' },
    silver: { primary: '#9CA3AF', secondary: '#F9FAFB', accent: '#4B5563' },
    gold: { primary: '#F59E0B', secondary: '#FFFBEB', accent: '#D97706' },
    rainbow: { primary: '#8B5CF6', secondary: '#EDE9FE', accent: '#EC4899' }
  };

  constructor() {
    // Initialize service
  }

  static getInstance(): AvatarService {
    if (!AvatarService.instance) {
      AvatarService.instance = new AvatarService();
    }
    return AvatarService.instance;
  }

  /**
   * Get all available avatars
   */
  getAllAvatars(): Avatar[] {
    return [...this.AVATAR_COLLECTION];
  }

  /**
   * Get avatars by category
   */
  getAvatarsByCategory(category: Avatar['category']): Avatar[] {
    return this.AVATAR_COLLECTION.filter(avatar => avatar.category === category);
  }

  /**
   * Get unlocked avatars for a profile
   */
  async getUnlockedAvatars(profileId: string): Promise<Avatar[]> {
    try {
      const collection = await this.getAvatarCollection(profileId);

      return this.AVATAR_COLLECTION.filter(avatar => {
        // Always include default unlocked avatars
        if (avatar.unlocked) return true;

        // Check if avatar is in unlocked list
        return collection.unlockedAvatars.includes(avatar.id);
      });
    } catch (error) {
      console.error('Error getting unlocked avatars:', error);
      return this.getDefaultAvatars();
    }
  }

  /**
   * Get default avatars (always unlocked)
   */
  getDefaultAvatars(): Avatar[] {
    return this.AVATAR_COLLECTION.filter(avatar => avatar.unlocked);
  }

  /**
   * Get current avatar for a profile
   */
  async getCurrentAvatar(profileId: string): Promise<Avatar> {
    try {
      const collection = await this.getAvatarCollection(profileId);
      return collection.currentAvatar;
    } catch (error) {
      console.error('Error getting current avatar:', error);
      return this.getDefaultAvatar();
    }
  }

  /**
   * Set current avatar for a profile
   */
  async setCurrentAvatar(profileId: string, avatarId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const avatar = this.AVATAR_COLLECTION.find(a => a.id === avatarId);
      if (!avatar) {
        return { success: false, error: 'Avatar not found' };
      }

      // Check if avatar is unlocked
      const unlockedAvatars = await this.getUnlockedAvatars(profileId);
      const isUnlocked = unlockedAvatars.some(a => a.id === avatarId);

      if (!isUnlocked) {
        return { success: false, error: 'Avatar not unlocked' };
      }

      // Update avatar collection
      const collection = await this.getAvatarCollection(profileId);
      collection.currentAvatar = avatar;
      collection.lastUpdated = new Date();

      await this.saveAvatarCollection(profileId, collection);

      console.log(`✅ Avatar changed to ${avatar.name} for profile: ${profileId}`);
      return { success: true };

    } catch (error) {
      console.error('Error setting current avatar:', error);
      return { success: false, error: 'Failed to set avatar' };
    }
  }

  /**
   * Unlock an avatar for a profile
   */
  async unlockAvatar(profileId: string, avatarId: string, reason: string): Promise<{ success: boolean; error?: string }> {
    try {
      const avatar = this.AVATAR_COLLECTION.find(a => a.id === avatarId);
      if (!avatar) {
        return { success: false, error: 'Avatar not found' };
      }

      const collection = await this.getAvatarCollection(profileId);

      // Check if already unlocked
      if (collection.unlockedAvatars.includes(avatarId)) {
        return { success: true }; // Already unlocked
      }

      // Add to unlocked list
      collection.unlockedAvatars.push(avatarId);
      collection.lastUpdated = new Date();

      await this.saveAvatarCollection(profileId, collection);

      console.log(`🎉 Avatar unlocked: ${avatar.name} for profile: ${profileId} (${reason})`);
      return { success: true };

    } catch (error) {
      console.error('Error unlocking avatar:', error);
      return { success: false, error: 'Failed to unlock avatar' };
    }
  }

  /**
   * Check and unlock avatars based on achievements
   */
  async checkAvatarUnlocks(profileId: string, userLevel: number, achievements: string[]): Promise<Avatar[]> {
    try {
      const newlyUnlocked: Avatar[] = [];
      const collection = await this.getAvatarCollection(profileId);

      for (const avatar of this.AVATAR_COLLECTION) {
        // Skip if already unlocked
        if (avatar.unlocked || collection.unlockedAvatars.includes(avatar.id)) {
          continue;
        }

        let shouldUnlock = false;

        // Check unlock conditions
        if (avatar.unlockCondition) {
          switch (avatar.unlockCondition.type) {
            case 'level':
              shouldUnlock = userLevel >= (avatar.unlockCondition.requirement as number);
              break;
            case 'achievement':
              shouldUnlock = achievements.includes(avatar.unlockCondition.requirement as string);
              break;
            case 'default':
              shouldUnlock = true;
              break;
          }
        }

        if (shouldUnlock) {
          const result = await this.unlockAvatar(profileId, avatar.id, 'achievement_unlock');
          if (result.success) {
            newlyUnlocked.push(avatar);
          }
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error('Error checking avatar unlocks:', error);
      return [];
    }
  }

  /**
   * Add avatar to favorites
   */
  async addToFavorites(profileId: string, avatarId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const collection = await this.getAvatarCollection(profileId);

      if (!collection.favoriteAvatars.includes(avatarId)) {
        collection.favoriteAvatars.push(avatarId);
        collection.lastUpdated = new Date();
        await this.saveAvatarCollection(profileId, collection);
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { success: false, error: 'Failed to add to favorites' };
    }
  }

  /**
   * Remove avatar from favorites
   */
  async removeFromFavorites(profileId: string, avatarId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const collection = await this.getAvatarCollection(profileId);

      const index = collection.favoriteAvatars.indexOf(avatarId);
      if (index > -1) {
        collection.favoriteAvatars.splice(index, 1);
        collection.lastUpdated = new Date();
        await this.saveAvatarCollection(profileId, collection);
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { success: false, error: 'Failed to remove from favorites' };
    }
  }

  /**
   * Update avatar customization
   */
  async updateCustomization(
    profileId: string,
    customization: Partial<AvatarCustomization>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const collection = await this.getAvatarCollection(profileId);

      collection.customization = {
        ...collection.customization,
        ...customization
      };
      collection.lastUpdated = new Date();

      await this.saveAvatarCollection(profileId, collection);

      return { success: true };
    } catch (error) {
      console.error('Error updating customization:', error);
      return { success: false, error: 'Failed to update customization' };
    }
  }

  /**
   * Get avatar collection stats
   */
  async getAvatarStats(profileId: string): Promise<{
    totalAvatars: number;
    unlockedCount: number;
    favoriteCount: number;
    completionPercentage: number;
    rareAvatarsUnlocked: number;
    epicAvatarsUnlocked: number;
    legendaryAvatarsUnlocked: number;
  }> {
    try {
      const collection = await this.getAvatarCollection(profileId);
      const unlockedAvatars = await this.getUnlockedAvatars(profileId);

      const rareCount = unlockedAvatars.filter(a => a.rarity === 'rare').length;
      const epicCount = unlockedAvatars.filter(a => a.rarity === 'epic').length;
      const legendaryCount = unlockedAvatars.filter(a => a.rarity === 'legendary').length;

      return {
        totalAvatars: this.AVATAR_COLLECTION.length,
        unlockedCount: unlockedAvatars.length,
        favoriteCount: collection.favoriteAvatars.length,
        completionPercentage: Math.round((unlockedAvatars.length / this.AVATAR_COLLECTION.length) * 100),
        rareAvatarsUnlocked: rareCount,
        epicAvatarsUnlocked: epicCount,
        legendaryAvatarsUnlocked: legendaryCount
      };
    } catch (error) {
      console.error('Error getting avatar stats:', error);
      return {
        totalAvatars: this.AVATAR_COLLECTION.length,
        unlockedCount: 0,
        favoriteCount: 0,
        completionPercentage: 0,
        rareAvatarsUnlocked: 0,
        epicAvatarsUnlocked: 0,
        legendaryAvatarsUnlocked: 0
      };
    }
  }

  /**
   * Get available color schemes
   */
  getColorSchemes(): Record<string, { primary: string; secondary: string; accent: string }> {
    return { ...this.COLOR_SCHEMES };
  }

  // === PRIVATE METHODS ===

  private async getAvatarCollection(profileId: string): Promise<AvatarCollection> {
    try {
      const stored = localStorage.getItem(`sl_avatar_collection_${profileId}`);

      if (stored) {
        const collection = JSON.parse(stored) as AvatarCollection;
        return {
          ...collection,
          lastUpdated: new Date(collection.lastUpdated)
        };
      }

      // Return default collection
      return this.createDefaultCollection(profileId);
    } catch (error) {
      console.error('Error getting avatar collection:', error);
      return this.createDefaultCollection(profileId);
    }
  }

  private async saveAvatarCollection(profileId: string, collection: AvatarCollection): Promise<void> {
    try {
      localStorage.setItem(`sl_avatar_collection_${profileId}`, JSON.stringify(collection));
    } catch (error) {
      console.error('Error saving avatar collection:', error);
      throw error;
    }
  }

  private createDefaultCollection(profileId: string): AvatarCollection {
    const defaultAvatar = this.getDefaultAvatar();
    const defaultUnlocked = this.getDefaultAvatars().map(a => a.id);

    return {
      profileId,
      unlockedAvatars: defaultUnlocked,
      favoriteAvatars: [defaultAvatar.id],
      currentAvatar: defaultAvatar,
      customization: this.getDefaultCustomization(),
      lastUpdated: new Date()
    };
  }

  private getDefaultAvatar(): Avatar {
    return this.AVATAR_COLLECTION.find(a => a.id === 'dog-1') || this.AVATAR_COLLECTION[0];
  }

  private getDefaultCustomization(): AvatarCustomization {
    return {
      backgroundColor: '#F0F9FF',
      borderStyle: 'solid',
      borderColor: '#3B82F6',
      borderWidth: 2,
      shadowColor: '#3B82F6',
      shadowBlur: 8,
      animation: 'none'
    };
  }
}

// Export singleton instance
export const avatarService = AvatarService.getInstance();
export default AvatarService;