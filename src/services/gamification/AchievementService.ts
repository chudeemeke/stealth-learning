/**
 * AAA+ Achievement & Badge System
 * Comprehensive gamification service for motivation and engagement
 * Age-appropriate achievements with visual rewards
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
  points: number;
  requirements: AchievementRequirement[];
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rewards?: Reward[];
  hidden?: boolean;
  ageGroup?: ('3-5' | '6-8' | '9+')[];
  animation?: 'pulse' | 'bounce' | 'rotate' | 'glow' | 'rainbow';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3 | 4 | 5;
  subject?: string;
  icon: string;
  color: string;
  glowColor: string;
  requirements: BadgeRequirement[];
  earned: boolean;
  earnedAt?: Date;
  level: number;
  xp: number;
  nextLevelXP: number;
  special?: boolean;
}

type AchievementCategory =
  | 'learning'
  | 'streak'
  | 'accuracy'
  | 'speed'
  | 'exploration'
  | 'social'
  | 'milestone'
  | 'special'
  | 'seasonal';

interface AchievementRequirement {
  type: 'questions_answered' | 'correct_streak' | 'accuracy_rate' | 'subjects_played' |
        'games_completed' | 'time_played' | 'friends_made' | 'challenges_completed' |
        'perfect_scores' | 'speed_bonus' | 'daily_login' | 'weekly_streak';
  value: number;
  subject?: string;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  comparison?: 'gte' | 'lte' | 'eq';
}

interface BadgeRequirement {
  type: 'achievement_count' | 'subject_mastery' | 'total_xp' | 'level' | 'playtime';
  value: number;
  subject?: string;
}

interface Reward {
  type: 'xp' | 'coins' | 'avatar' | 'theme' | 'title' | 'effect';
  value: number | string;
  description?: string;
}

export class AchievementService {
  private static instance: AchievementService;
  private achievements: Map<string, Achievement> = new Map();
  private badges: Map<string, Badge> = new Map();
  private userStats: UserStats;
  private unlockedQueue: Achievement[] = [];
  private isProcessing: boolean = false;
  private callbacks: Set<(achievement: Achievement) => void> = new Set();
  private badgeCallbacks: Set<(badge: Badge) => void> = new Set();

  private constructor() {
    this.userStats = this.initializeUserStats();
    this.initializeAchievements();
    this.initializeBadges();
    this.loadProgress();
  }

  public static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  private initializeUserStats(): UserStats {
    return {
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      longestStreak: 0,
      subjectsPlayed: new Set(),
      gamesCompleted: 0,
      totalPlayTime: 0,
      dailyLoginStreak: 0,
      weeklyLoginStreak: 0,
      friendsCount: 0,
      challengesCompleted: 0,
      perfectScores: 0,
      speedBonuses: 0,
      totalXP: 0,
      level: 1,
      subjectStats: new Map()
    };
  }

  private initializeAchievements(): void {
    // Learning Achievements
    this.addAchievement({
      id: 'first_steps',
      name: 'First Steps',
      description: 'Answer your first question',
      category: 'learning',
      rarity: 'common',
      icon: '👶',
      color: 'green',
      points: 10,
      requirements: [{ type: 'questions_answered', value: 1, comparison: 'gte' }],
      maxProgress: 1,
      rewards: [{ type: 'xp', value: 50 }]
    });

    this.addAchievement({
      id: 'quick_learner',
      name: 'Quick Learner',
      description: 'Answer 10 questions correctly',
      category: 'learning',
      rarity: 'common',
      icon: '📚',
      color: 'blue',
      points: 25,
      requirements: [{ type: 'questions_answered', value: 10, comparison: 'gte' }],
      maxProgress: 10,
      rewards: [{ type: 'xp', value: 100 }]
    });

    this.addAchievement({
      id: 'knowledge_seeker',
      name: 'Knowledge Seeker',
      description: 'Answer 100 questions',
      category: 'learning',
      rarity: 'rare',
      icon: '🎓',
      color: 'purple',
      points: 100,
      requirements: [{ type: 'questions_answered', value: 100, comparison: 'gte' }],
      maxProgress: 100,
      rewards: [{ type: 'xp', value: 500 }, { type: 'title', value: 'Scholar' }],
      animation: 'glow'
    });

    // Streak Achievements
    this.addAchievement({
      id: 'hot_streak',
      name: 'Hot Streak',
      description: 'Get 5 correct answers in a row',
      category: 'streak',
      rarity: 'common',
      icon: '🔥',
      color: 'orange',
      points: 30,
      requirements: [{ type: 'correct_streak', value: 5, comparison: 'gte' }],
      maxProgress: 5,
      rewards: [{ type: 'xp', value: 150 }],
      animation: 'pulse'
    });

    this.addAchievement({
      id: 'unstoppable',
      name: 'Unstoppable',
      description: 'Get 10 correct answers in a row',
      category: 'streak',
      rarity: 'rare',
      icon: '⚡',
      color: 'yellow',
      points: 75,
      requirements: [{ type: 'correct_streak', value: 10, comparison: 'gte' }],
      maxProgress: 10,
      rewards: [{ type: 'xp', value: 300 }, { type: 'effect', value: 'lightning' }],
      animation: 'bounce'
    });

    this.addAchievement({
      id: 'perfect_storm',
      name: 'Perfect Storm',
      description: 'Get 25 correct answers in a row',
      category: 'streak',
      rarity: 'epic',
      icon: '🌟',
      color: 'gold',
      points: 200,
      requirements: [{ type: 'correct_streak', value: 25, comparison: 'gte' }],
      maxProgress: 25,
      rewards: [{ type: 'xp', value: 1000 }, { type: 'avatar', value: 'golden_star' }],
      animation: 'rotate'
    });

    // Accuracy Achievements
    this.addAchievement({
      id: 'sharpshooter',
      name: 'Sharpshooter',
      description: 'Maintain 80% accuracy over 50 questions',
      category: 'accuracy',
      rarity: 'rare',
      icon: '🎯',
      color: 'red',
      points: 100,
      requirements: [{ type: 'accuracy_rate', value: 80, comparison: 'gte' }],
      maxProgress: 100,
      rewards: [{ type: 'xp', value: 400 }]
    });

    this.addAchievement({
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Get 10 perfect scores in games',
      category: 'accuracy',
      rarity: 'epic',
      icon: '💎',
      color: 'cyan',
      points: 250,
      requirements: [{ type: 'perfect_scores', value: 10, comparison: 'gte' }],
      maxProgress: 10,
      rewards: [{ type: 'xp', value: 1500 }, { type: 'theme', value: 'diamond' }],
      animation: 'rainbow'
    });

    // Speed Achievements
    this.addAchievement({
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Answer 20 questions with speed bonus',
      category: 'speed',
      rarity: 'rare',
      icon: '⚡',
      color: 'lime',
      points: 80,
      requirements: [{ type: 'speed_bonus', value: 20, comparison: 'gte' }],
      maxProgress: 20,
      rewards: [{ type: 'xp', value: 350 }]
    });

    // Exploration Achievements
    this.addAchievement({
      id: 'explorer',
      name: 'Explorer',
      description: 'Play all 6 subjects',
      category: 'exploration',
      rarity: 'rare',
      icon: '🗺️',
      color: 'teal',
      points: 150,
      requirements: [{ type: 'subjects_played', value: 6, comparison: 'gte' }],
      maxProgress: 6,
      rewards: [{ type: 'xp', value: 600 }, { type: 'title', value: 'Explorer' }]
    });

    this.addAchievement({
      id: 'math_master',
      name: 'Math Master',
      description: 'Complete 50 math games',
      category: 'milestone',
      rarity: 'epic',
      icon: '🔢',
      color: 'indigo',
      points: 300,
      requirements: [{ type: 'games_completed', value: 50, subject: 'mathematics', comparison: 'gte' }],
      maxProgress: 50,
      rewards: [{ type: 'xp', value: 2000 }, { type: 'avatar', value: 'math_wizard' }]
    });

    this.addAchievement({
      id: 'english_expert',
      name: 'English Expert',
      description: 'Complete 50 English games',
      category: 'milestone',
      rarity: 'epic',
      icon: '📖',
      color: 'blue',
      points: 300,
      requirements: [{ type: 'games_completed', value: 50, subject: 'english', comparison: 'gte' }],
      maxProgress: 50,
      rewards: [{ type: 'xp', value: 2000 }, { type: 'avatar', value: 'wordsmith' }]
    });

    this.addAchievement({
      id: 'science_genius',
      name: 'Science Genius',
      description: 'Complete 50 science games',
      category: 'milestone',
      rarity: 'epic',
      icon: '🔬',
      color: 'green',
      points: 300,
      requirements: [{ type: 'games_completed', value: 50, subject: 'science', comparison: 'gte' }],
      maxProgress: 50,
      rewards: [{ type: 'xp', value: 2000 }, { type: 'avatar', value: 'scientist' }]
    });

    // Daily/Weekly Achievements
    this.addAchievement({
      id: 'daily_champion',
      name: 'Daily Champion',
      description: 'Login for 7 consecutive days',
      category: 'streak',
      rarity: 'rare',
      icon: '📅',
      color: 'amber',
      points: 100,
      requirements: [{ type: 'daily_login', value: 7, comparison: 'gte' }],
      maxProgress: 7,
      rewards: [{ type: 'xp', value: 500 }, { type: 'coins', value: 100 }]
    });

    this.addAchievement({
      id: 'dedicated_learner',
      name: 'Dedicated Learner',
      description: 'Login for 30 consecutive days',
      category: 'streak',
      rarity: 'legendary',
      icon: '🏆',
      color: 'gold',
      points: 500,
      requirements: [{ type: 'daily_login', value: 30, comparison: 'gte' }],
      maxProgress: 30,
      rewards: [{ type: 'xp', value: 5000 }, { type: 'avatar', value: 'legendary_crown' }],
      animation: 'rainbow'
    });

    // Social Achievements
    this.addAchievement({
      id: 'friendly',
      name: 'Friendly',
      description: 'Make 5 friends',
      category: 'social',
      rarity: 'common',
      icon: '👥',
      color: 'pink',
      points: 50,
      requirements: [{ type: 'friends_made', value: 5, comparison: 'gte' }],
      maxProgress: 5,
      rewards: [{ type: 'xp', value: 200 }]
    });

    // Special Hidden Achievements
    this.addAchievement({
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Play after midnight',
      category: 'special',
      rarity: 'rare',
      icon: '🦉',
      color: 'purple',
      points: 50,
      requirements: [],
      maxProgress: 1,
      hidden: true,
      rewards: [{ type: 'theme', value: 'night_mode' }]
    });

    this.addAchievement({
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Play before 6 AM',
      category: 'special',
      rarity: 'rare',
      icon: '🐦',
      color: 'yellow',
      points: 50,
      requirements: [],
      maxProgress: 1,
      hidden: true,
      rewards: [{ type: 'theme', value: 'sunrise' }]
    });
  }

  private initializeBadges(): void {
    // Subject Mastery Badges
    const subjects = ['mathematics', 'english', 'science', 'logic', 'geography', 'arts'];
    const badgeTiers = [
      { tier: 1, name: 'Beginner', xp: 100, color: 'bronze' },
      { tier: 2, name: 'Intermediate', xp: 500, color: 'silver' },
      { tier: 3, name: 'Advanced', xp: 1000, color: 'gold' },
      { tier: 4, name: 'Expert', xp: 2500, color: 'platinum' },
      { tier: 5, name: 'Master', xp: 5000, color: 'diamond' }
    ];

    subjects.forEach(subject => {
      badgeTiers.forEach(({ tier, name, xp, color }) => {
        this.addBadge({
          id: `${subject}_tier_${tier}`,
          name: `${subject.charAt(0).toUpperCase() + subject.slice(1)} ${name}`,
          description: `Reach ${xp} XP in ${subject}`,
          tier: tier as any,
          subject,
          icon: this.getSubjectIcon(subject),
          color,
          glowColor: this.getGlowColor(color),
          requirements: [{ type: 'subject_mastery', value: xp, subject }],
          level: 1,
          xp: 0,
          nextLevelXP: xp
        });
      });
    });

    // Special Badges
    this.addBadge({
      id: 'completionist',
      name: 'Completionist',
      description: 'Unlock 50 achievements',
      tier: 5,
      icon: '🌟',
      color: 'rainbow',
      glowColor: 'rgba(255, 255, 255, 0.8)',
      requirements: [{ type: 'achievement_count', value: 50 }],
      level: 1,
      xp: 0,
      nextLevelXP: 50,
      special: true
    });

    this.addBadge({
      id: 'legend',
      name: 'Legend',
      description: 'Reach level 100',
      tier: 5,
      icon: '👑',
      color: 'legendary',
      glowColor: 'rgba(255, 215, 0, 0.9)',
      requirements: [{ type: 'level', value: 100 }],
      level: 1,
      xp: 0,
      nextLevelXP: 100,
      special: true
    });
  }

  private getSubjectIcon(subject: string): string {
    const icons: Record<string, string> = {
      mathematics: '🔢',
      english: '📚',
      science: '🔬',
      logic: '🧩',
      geography: '🌍',
      arts: '🎨'
    };
    return icons[subject] || '📖';
  }

  private getGlowColor(color: string): string {
    const colors: Record<string, string> = {
      bronze: 'rgba(205, 127, 50, 0.6)',
      silver: 'rgba(192, 192, 192, 0.6)',
      gold: 'rgba(255, 215, 0, 0.6)',
      platinum: 'rgba(229, 228, 226, 0.8)',
      diamond: 'rgba(185, 242, 255, 0.9)',
      rainbow: 'rgba(255, 255, 255, 0.8)',
      legendary: 'rgba(255, 215, 0, 0.9)'
    };
    return colors[color] || 'rgba(255, 255, 255, 0.5)';
  }

  /**
   * Track user progress
   */
  public trackProgress(event: ProgressEvent): void {
    switch (event.type) {
      case 'question_answered':
        this.userStats.totalQuestionsAnswered++;
        if (event.isCorrect) {
          this.userStats.correctAnswers++;
          this.userStats.currentStreak++;
          if (this.userStats.currentStreak > this.userStats.longestStreak) {
            this.userStats.longestStreak = this.userStats.currentStreak;
          }
        } else {
          this.userStats.currentStreak = 0;
        }
        break;

      case 'game_completed':
        this.userStats.gamesCompleted++;
        if (event.subject) {
          this.userStats.subjectsPlayed.add(event.subject);
          this.updateSubjectStats(event.subject, event);
        }
        if (event.perfectScore) {
          this.userStats.perfectScores++;
        }
        break;

      case 'speed_bonus':
        this.userStats.speedBonuses++;
        break;

      case 'challenge_completed':
        this.userStats.challengesCompleted++;
        break;

      case 'friend_added':
        this.userStats.friendsCount++;
        break;

      case 'daily_login':
        this.userStats.dailyLoginStreak++;
        break;

      case 'xp_earned':
        this.userStats.totalXP += event.value || 0;
        this.userStats.level = Math.floor(this.userStats.totalXP / 1000) + 1;
        break;
    }

    // Check for achievement unlocks
    this.checkAchievements();
    this.checkBadges();

    // Save progress
    this.saveProgress();
  }

  private updateSubjectStats(subject: string, event: ProgressEvent): void {
    let stats = this.userStats.subjectStats.get(subject);
    if (!stats) {
      stats = {
        questionsAnswered: 0,
        correctAnswers: 0,
        gamesPlayed: 0,
        totalXP: 0,
        bestStreak: 0,
        currentStreak: 0
      };
      this.userStats.subjectStats.set(subject, stats);
    }

    if (event.type === 'game_completed') {
      stats.gamesPlayed++;
      stats.totalXP += event.value || 0;
    }
  }

  /**
   * Check for achievement unlocks
   */
  private checkAchievements(): void {
    for (const achievement of this.achievements.values()) {
      if (achievement.unlocked) continue;

      let progress = 0;
      let shouldUnlock = true;

      for (const req of achievement.requirements) {
        const value = this.getStatValue(req);
        const comparison = req.comparison || 'gte';

        if (comparison === 'gte' && value < req.value) {
          shouldUnlock = false;
        } else if (comparison === 'lte' && value > req.value) {
          shouldUnlock = false;
        } else if (comparison === 'eq' && value !== req.value) {
          shouldUnlock = false;
        }

        progress = Math.max(progress, Math.min(value, req.value));
      }

      achievement.progress = progress;

      if (shouldUnlock) {
        this.unlockAchievement(achievement);
      }
    }
  }

  /**
   * Check for badge unlocks
   */
  private checkBadges(): void {
    for (const badge of this.badges.values()) {
      if (badge.earned) continue;

      let shouldEarn = true;

      for (const req of badge.requirements) {
        const value = this.getBadgeStatValue(req);
        if (value < req.value) {
          shouldEarn = false;
          break;
        }
        badge.xp = value;
      }

      if (shouldEarn) {
        this.earnBadge(badge);
      }
    }
  }

  private getStatValue(req: AchievementRequirement): number {
    switch (req.type) {
      case 'questions_answered':
        return this.userStats.totalQuestionsAnswered;
      case 'correct_streak':
        return this.userStats.longestStreak;
      case 'accuracy_rate':
        return this.userStats.totalQuestionsAnswered > 0
          ? (this.userStats.correctAnswers / this.userStats.totalQuestionsAnswered) * 100
          : 0;
      case 'subjects_played':
        return this.userStats.subjectsPlayed.size;
      case 'games_completed':
        if (req.subject) {
          const stats = this.userStats.subjectStats.get(req.subject);
          return stats?.gamesPlayed || 0;
        }
        return this.userStats.gamesCompleted;
      case 'time_played':
        return this.userStats.totalPlayTime;
      case 'friends_made':
        return this.userStats.friendsCount;
      case 'challenges_completed':
        return this.userStats.challengesCompleted;
      case 'perfect_scores':
        return this.userStats.perfectScores;
      case 'speed_bonus':
        return this.userStats.speedBonuses;
      case 'daily_login':
        return this.userStats.dailyLoginStreak;
      case 'weekly_streak':
        return this.userStats.weeklyLoginStreak;
      default:
        return 0;
    }
  }

  private getBadgeStatValue(req: BadgeRequirement): number {
    switch (req.type) {
      case 'achievement_count':
        return Array.from(this.achievements.values()).filter(a => a.unlocked).length;
      case 'subject_mastery':
        if (req.subject) {
          const stats = this.userStats.subjectStats.get(req.subject);
          return stats?.totalXP || 0;
        }
        return 0;
      case 'total_xp':
        return this.userStats.totalXP;
      case 'level':
        return this.userStats.level;
      case 'playtime':
        return this.userStats.totalPlayTime;
      default:
        return 0;
    }
  }

  /**
   * Unlock achievement
   */
  private unlockAchievement(achievement: Achievement): void {
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
    achievement.progress = achievement.maxProgress;

    // Add to unlock queue for animation
    this.unlockedQueue.push(achievement);

    // Apply rewards
    if (achievement.rewards) {
      for (const reward of achievement.rewards) {
        this.applyReward(reward);
      }
    }

    // Notify listeners
    this.callbacks.forEach(callback => callback(achievement));

    // Process unlock queue
    if (!this.isProcessing) {
      this.processUnlockQueue();
    }

    console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
  }

  /**
   * Earn badge
   */
  private earnBadge(badge: Badge): void {
    badge.earned = true;
    badge.earnedAt = new Date();

    // Notify listeners
    this.badgeCallbacks.forEach(callback => callback(badge));

    console.log(`🥇 Badge Earned: ${badge.name}`);
  }

  /**
   * Apply reward
   */
  private applyReward(reward: Reward): void {
    switch (reward.type) {
      case 'xp':
        this.trackProgress({ type: 'xp_earned', value: reward.value as number });
        break;
      case 'coins':
        // Implement coin system
        console.log(`💰 Earned ${reward.value} coins`);
        break;
      case 'avatar':
      case 'theme':
      case 'title':
      case 'effect':
        // Implement unlock system
        console.log(`🎁 Unlocked: ${reward.value}`);
        break;
    }
  }

  /**
   * Process unlock queue with animations
   */
  private async processUnlockQueue(): Promise<void> {
    if (this.unlockedQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const achievement = this.unlockedQueue.shift();

    if (achievement) {
      // Trigger unlock animation
      this.showAchievementNotification(achievement);

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Process next in queue
    this.processUnlockQueue();
  }

  /**
   * Show achievement notification
   */
  private showAchievementNotification(achievement: Achievement): void {
    // This would trigger the UI notification
    // In production, this would use a proper notification system
    const event = new CustomEvent('achievement-unlocked', {
      detail: achievement
    });
    window.dispatchEvent(event);
  }

  /**
   * Add achievement
   */
  private addAchievement(data: Partial<Achievement>): void {
    const achievement: Achievement = {
      id: data.id || '',
      name: data.name || '',
      description: data.description || '',
      category: data.category || 'learning',
      rarity: data.rarity || 'common',
      icon: data.icon || '🏆',
      color: data.color || 'gray',
      points: data.points || 10,
      requirements: data.requirements || [],
      unlocked: false,
      progress: 0,
      maxProgress: data.maxProgress || 1,
      rewards: data.rewards,
      hidden: data.hidden,
      ageGroup: data.ageGroup,
      animation: data.animation
    };

    this.achievements.set(achievement.id, achievement);
  }

  /**
   * Add badge
   */
  private addBadge(data: Partial<Badge>): void {
    const badge: Badge = {
      id: data.id || '',
      name: data.name || '',
      description: data.description || '',
      tier: data.tier || 1,
      subject: data.subject,
      icon: data.icon || '🥇',
      color: data.color || 'bronze',
      glowColor: data.glowColor || 'rgba(255, 255, 255, 0.5)',
      requirements: data.requirements || [],
      earned: false,
      level: data.level || 1,
      xp: data.xp || 0,
      nextLevelXP: data.nextLevelXP || 100,
      special: data.special
    };

    this.badges.set(badge.id, badge);
  }

  /**
   * Save progress to localStorage
   */
  private saveProgress(): void {
    try {
      const data = {
        userStats: {
          ...this.userStats,
          subjectsPlayed: Array.from(this.userStats.subjectsPlayed),
          subjectStats: Array.from(this.userStats.subjectStats.entries())
        },
        achievements: Array.from(this.achievements.values()).map(a => ({
          id: a.id,
          unlocked: a.unlocked,
          unlockedAt: a.unlockedAt,
          progress: a.progress
        })),
        badges: Array.from(this.badges.values()).map(b => ({
          id: b.id,
          earned: b.earned,
          earnedAt: b.earnedAt,
          level: b.level,
          xp: b.xp
        }))
      };

      localStorage.setItem('stealth_achievements', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  }

  /**
   * Load progress from localStorage
   */
  private loadProgress(): void {
    try {
      const stored = localStorage.getItem('stealth_achievements');
      if (!stored) return;

      const data = JSON.parse(stored);

      // Restore user stats
      if (data.userStats) {
        Object.assign(this.userStats, data.userStats);
        this.userStats.subjectsPlayed = new Set(data.userStats.subjectsPlayed);
        this.userStats.subjectStats = new Map(data.userStats.subjectStats);
      }

      // Restore achievements
      if (data.achievements) {
        for (const saved of data.achievements) {
          const achievement = this.achievements.get(saved.id);
          if (achievement) {
            achievement.unlocked = saved.unlocked;
            achievement.unlockedAt = saved.unlockedAt ? new Date(saved.unlockedAt) : undefined;
            achievement.progress = saved.progress;
          }
        }
      }

      // Restore badges
      if (data.badges) {
        for (const saved of data.badges) {
          const badge = this.badges.get(saved.id);
          if (badge) {
            badge.earned = saved.earned;
            badge.earnedAt = saved.earnedAt ? new Date(saved.earnedAt) : undefined;
            badge.level = saved.level;
            badge.xp = saved.xp;
          }
        }
      }

      console.log('📊 Loaded achievement progress');
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  }

  /**
   * Get all achievements
   */
  public getAchievements(filter?: {
    category?: AchievementCategory;
    unlocked?: boolean;
    ageGroup?: '3-5' | '6-8' | '9+';
  }): Achievement[] {
    let achievements = Array.from(this.achievements.values());

    if (filter) {
      if (filter.category) {
        achievements = achievements.filter(a => a.category === filter.category);
      }
      if (filter.unlocked !== undefined) {
        achievements = achievements.filter(a => a.unlocked === filter.unlocked);
      }
      if (filter.ageGroup) {
        achievements = achievements.filter(a =>
          !a.ageGroup || a.ageGroup.includes(filter.ageGroup!)
        );
      }
    }

    return achievements;
  }

  /**
   * Get all badges
   */
  public getBadges(filter?: { earned?: boolean; subject?: string }): Badge[] {
    let badges = Array.from(this.badges.values());

    if (filter) {
      if (filter.earned !== undefined) {
        badges = badges.filter(b => b.earned === filter.earned);
      }
      if (filter.subject) {
        badges = badges.filter(b => b.subject === filter.subject);
      }
    }

    return badges;
  }

  /**
   * Get user stats
   */
  public getUserStats(): UserStats {
    return { ...this.userStats };
  }

  /**
   * Subscribe to achievement unlocks
   */
  public onAchievementUnlock(callback: (achievement: Achievement) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Subscribe to badge earned
   */
  public onBadgeEarned(callback: (badge: Badge) => void): () => void {
    this.badgeCallbacks.add(callback);
    return () => this.badgeCallbacks.delete(callback);
  }

  /**
   * Reset all achievements (for testing)
   */
  public resetAchievements(): void {
    this.userStats = this.initializeUserStats();
    this.achievements.clear();
    this.badges.clear();
    this.initializeAchievements();
    this.initializeBadges();
    this.saveProgress();
  }
}

// Type definitions
interface UserStats {
  totalQuestionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  subjectsPlayed: Set<string>;
  gamesCompleted: number;
  totalPlayTime: number;
  dailyLoginStreak: number;
  weeklyLoginStreak: number;
  friendsCount: number;
  challengesCompleted: number;
  perfectScores: number;
  speedBonuses: number;
  totalXP: number;
  level: number;
  subjectStats: Map<string, SubjectStats>;
}

interface SubjectStats {
  questionsAnswered: number;
  correctAnswers: number;
  gamesPlayed: number;
  totalXP: number;
  bestStreak: number;
  currentStreak: number;
}

export interface ProgressEvent {
  type: 'question_answered' | 'game_completed' | 'speed_bonus' | 'challenge_completed' |
        'friend_added' | 'daily_login' | 'xp_earned';
  isCorrect?: boolean;
  subject?: string;
  value?: number;
  perfectScore?: boolean;
}

// Export singleton instance
export const achievementService = AchievementService.getInstance();