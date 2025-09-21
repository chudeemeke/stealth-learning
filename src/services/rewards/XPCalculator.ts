import { Subject, AgeGroup, DifficultyLevel } from '@/types';
import { GameSession } from '../database/schema';

export interface XPCalculationConfig {
  baseXP: number;
  difficultyMultipliers: Record<DifficultyLevel, number>;
  streakBonus: number;
  timeBonus: number;
  accuracyBonus: number;
  completionBonus: number;
  firstTimeBonus: number;
  perfectScoreBonus: number;
  dailyMultiplier: number;
  ageGroupModifier: Record<AgeGroup, number>;
}

export interface XPBreakdown {
  baseXP: number;
  difficultyBonus: number;
  accuracyBonus: number;
  speedBonus: number;
  streakBonus: number;
  completionBonus: number;
  firstTimeBonus: number;
  perfectScoreBonus: number;
  dailyBonus: number;
  totalXP: number;
  multiplier: number;
}

export interface AchievementCondition {
  id: string;
  name: string;
  description: string;
  type: 'xp' | 'streak' | 'accuracy' | 'speed' | 'completion' | 'daily' | 'subject' | 'difficulty';
  condition: (stats: PlayerStats, session?: GameSession) => boolean;
  xpReward: number;
  badgeIcon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: string;
}

export interface PlayerStats {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  totalGamesPlayed: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  longestStreak: number;
  averageAccuracy: number;
  averageSpeed: number;
  subjectStats: Record<Subject, {
    gamesPlayed: number;
    accuracy: number;
    xpEarned: number;
    lastPlayed?: Date;
  }>;
  difficultyStats: Record<DifficultyLevel, {
    gamesPlayed: number;
    accuracy: number;
    xpEarned: number;
  }>;
  dailyStats: {
    currentStreak: number;
    longestStreak: number;
    lastPlayDate?: Date;
    todayXP: number;
    weeklyXP: number;
    monthlyXP: number;
  };
  achievements: string[];
  badges: string[];
}

export class XPCalculator {
  private config: XPCalculationConfig;
  private achievements: AchievementCondition[] = [];

  constructor(config: Partial<XPCalculationConfig> = {}) {
    this.config = {
      baseXP: 10,
      difficultyMultipliers: {
        easy: 1.0,
        medium: 1.2,
        hard: 1.5,
        adaptive: 1.3,
      },
      streakBonus: 2,
      timeBonus: 0.5,
      accuracyBonus: 1.0,
      completionBonus: 5,
      firstTimeBonus: 10,
      perfectScoreBonus: 15,
      dailyMultiplier: 1.1,
      ageGroupModifier: {
        '3-5': 1.2, // Extra encouragement for youngest
        '6-8': 1.0, // Baseline
        '9+': 0.9,  // Slightly less to maintain progression balance
      },
      ...config,
    };

    this.initializeAchievements();
  }

  // === XP CALCULATION ===

  calculateSessionXP(
    session: GameSession,
    playerStats: PlayerStats,
    isFirstTime: boolean = false,
    dailyMultiplierActive: boolean = false
  ): XPBreakdown {
    const { answers, metadata } = session;
    const difficulty = (session as any).difficulty || 'medium';
    const ageGroup = ((metadata as any)?.ageGroup as AgeGroup) || '6-8';

    // Base XP
    const baseXP = this.config.baseXP * answers.length;

    // Difficulty bonus
    const difficultyMultiplier = this.config.difficultyMultipliers[difficulty as DifficultyLevel] || 1.0;
    const difficultyBonus = Math.floor(baseXP * (difficultyMultiplier - 1));

    // Accuracy calculations
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = answers.length > 0 ? correctAnswers / answers.length : 0;
    const accuracyBonus = Math.floor(baseXP * accuracy * this.config.accuracyBonus);

    // Speed bonus (based on average time per question)
    const totalTime = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
    const avgTimePerQuestion = totalTime / answers.length;
    const targetTime = this.getTargetTime(difficulty, ageGroup);
    const speedRatio = Math.max(0, (targetTime - avgTimePerQuestion) / targetTime);
    const speedBonus = Math.floor(baseXP * speedRatio * this.config.timeBonus);

    // Streak bonus
    const maxStreak = this.getMaxStreakFromAnswers(answers);
    const streakBonus = Math.floor(maxStreak * this.config.streakBonus);

    // Completion bonus
    const completionBonus = session.isCompleted ? this.config.completionBonus : 0;

    // Perfect score bonus
    const perfectScoreBonus = accuracy === 1.0 && answers.length >= 5 ? this.config.perfectScoreBonus : 0;

    // First time bonus
    const firstTimeBonus = isFirstTime ? this.config.firstTimeBonus : 0;

    // Daily bonus
    const dailyBonusMultiplier = dailyMultiplierActive ? this.config.dailyMultiplier : 1.0;
    const dailyBonus = dailyMultiplierActive ? Math.floor(baseXP * (dailyBonusMultiplier - 1)) : 0;

    // Age group modifier
    const ageModifier = this.config.ageGroupModifier[ageGroup] || 1.0;

    // Calculate total before age modifier
    const subtotal = baseXP + difficultyBonus + accuracyBonus + speedBonus +
                    streakBonus + completionBonus + perfectScoreBonus + firstTimeBonus + dailyBonus;

    // Apply age modifier
    const totalXP = Math.floor(subtotal * ageModifier);

    return {
      baseXP,
      difficultyBonus,
      accuracyBonus,
      speedBonus,
      streakBonus,
      completionBonus,
      firstTimeBonus,
      perfectScoreBonus,
      dailyBonus,
      totalXP,
      multiplier: ageModifier * dailyBonusMultiplier,
    };
  }

  private getTargetTime(difficulty: DifficultyLevel, ageGroup: AgeGroup): number {
    const baseTimes: Record<AgeGroup, Record<Exclude<DifficultyLevel, 'adaptive'>, number>> = {
      '3-5': { easy: 45000, medium: 60000, hard: 75000 },
      '6-8': { easy: 30000, medium: 45000, hard: 60000 },
      '9+': { easy: 20000, medium: 30000, hard: 45000 },
    };

    // Handle adaptive difficulty by treating it as medium
    const targetDifficulty = difficulty === 'adaptive' ? 'medium' : difficulty;
    return baseTimes[ageGroup]?.[targetDifficulty as Exclude<DifficultyLevel, 'adaptive'>] || 30000;
  }

  private getMaxStreakFromAnswers(answers: any[]): number {
    let maxStreak = 0;
    let currentStreak = 0;

    for (const answer of answers) {
      if (answer.isCorrect) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }

  // === LEVEL SYSTEM ===

  calculateLevel(totalXP: number): { level: number; currentLevelXP: number; nextLevelXP: number } {
    // Progressive XP requirement: level n requires n^2 * 100 XP
    let level = 1;
    let xpRequired = 0;
    let cumulativeXP = 0;

    while (cumulativeXP <= totalXP) {
      xpRequired = Math.floor(Math.pow(level, 1.8) * 100); // Slightly less aggressive than quadratic
      cumulativeXP += xpRequired;

      if (cumulativeXP <= totalXP) {
        level++;
      }
    }

    const previousLevelXP = cumulativeXP - xpRequired;
    const currentLevelXP = totalXP - previousLevelXP;
    const nextLevelXP = xpRequired;

    return {
      level: level,
      currentLevelXP,
      nextLevelXP,
    };
  }

  getXPRequiredForLevel(level: number): number {
    let totalXP = 0;
    for (let i = 1; i < level; i++) {
      totalXP += Math.floor(Math.pow(i, 1.8) * 100);
    }
    return totalXP;
  }

  // === ACHIEVEMENT SYSTEM ===

  private initializeAchievements(): void {
    this.achievements = [
      // XP Milestones
      {
        id: 'first_100_xp',
        name: 'Getting Started',
        description: 'Earn your first 100 XP',
        type: 'xp',
        condition: (stats) => stats.totalXP >= 100,
        xpReward: 50,
        badgeIcon: '🌟',
        rarity: 'common',
        category: 'Progress',
      },
      {
        id: 'xp_1000',
        name: 'Rising Star',
        description: 'Earn 1,000 XP',
        type: 'xp',
        condition: (stats) => stats.totalXP >= 1000,
        xpReward: 100,
        badgeIcon: '⭐',
        rarity: 'uncommon',
        category: 'Progress',
      },
      {
        id: 'xp_5000',
        name: 'Knowledge Seeker',
        description: 'Earn 5,000 XP',
        type: 'xp',
        condition: (stats) => stats.totalXP >= 5000,
        xpReward: 250,
        badgeIcon: '🎓',
        rarity: 'rare',
        category: 'Progress',
      },
      {
        id: 'xp_10000',
        name: 'Scholar',
        description: 'Earn 10,000 XP',
        type: 'xp',
        condition: (stats) => stats.totalXP >= 10000,
        xpReward: 500,
        badgeIcon: '📚',
        rarity: 'epic',
        category: 'Progress',
      },
      {
        id: 'xp_25000',
        name: 'Master Learner',
        description: 'Earn 25,000 XP',
        type: 'xp',
        condition: (stats) => stats.totalXP >= 25000,
        xpReward: 1000,
        badgeIcon: '👑',
        rarity: 'legendary',
        category: 'Progress',
      },

      // Streak Achievements
      {
        id: 'streak_5',
        name: 'On Fire',
        description: 'Get 5 answers in a row correct',
        type: 'streak',
        condition: (stats) => stats.longestStreak >= 5,
        xpReward: 25,
        badgeIcon: '🔥',
        rarity: 'common',
        category: 'Performance',
      },
      {
        id: 'streak_10',
        name: 'Unstoppable',
        description: 'Get 10 answers in a row correct',
        type: 'streak',
        condition: (stats) => stats.longestStreak >= 10,
        xpReward: 75,
        badgeIcon: '🚀',
        rarity: 'uncommon',
        category: 'Performance',
      },
      {
        id: 'streak_20',
        name: 'Perfectionist',
        description: 'Get 20 answers in a row correct',
        type: 'streak',
        condition: (stats) => stats.longestStreak >= 20,
        xpReward: 200,
        badgeIcon: '💎',
        rarity: 'rare',
        category: 'Performance',
      },

      // Accuracy Achievements
      {
        id: 'accuracy_90',
        name: 'Sharp Shooter',
        description: 'Maintain 90% accuracy over 50 questions',
        type: 'accuracy',
        condition: (stats) => stats.averageAccuracy >= 0.9 && stats.totalCorrectAnswers + stats.totalIncorrectAnswers >= 50,
        xpReward: 100,
        badgeIcon: '🎯',
        rarity: 'uncommon',
        category: 'Performance',
      },
      {
        id: 'accuracy_95',
        name: 'Eagle Eye',
        description: 'Maintain 95% accuracy over 100 questions',
        type: 'accuracy',
        condition: (stats) => stats.averageAccuracy >= 0.95 && stats.totalCorrectAnswers + stats.totalIncorrectAnswers >= 100,
        xpReward: 250,
        badgeIcon: '🦅',
        rarity: 'rare',
        category: 'Performance',
      },

      // Daily Achievements
      {
        id: 'daily_streak_3',
        name: 'Consistent Learner',
        description: 'Play for 3 days in a row',
        type: 'daily',
        condition: (stats) => stats.dailyStats.currentStreak >= 3,
        xpReward: 75,
        badgeIcon: '📅',
        rarity: 'common',
        category: 'Consistency',
      },
      {
        id: 'daily_streak_7',
        name: 'Week Warrior',
        description: 'Play for 7 days in a row',
        type: 'daily',
        condition: (stats) => stats.dailyStats.currentStreak >= 7,
        xpReward: 200,
        badgeIcon: '🗓️',
        rarity: 'uncommon',
        category: 'Consistency',
      },
      {
        id: 'daily_streak_30',
        name: 'Month Master',
        description: 'Play for 30 days in a row',
        type: 'daily',
        condition: (stats) => stats.dailyStats.currentStreak >= 30,
        xpReward: 1000,
        badgeIcon: '🏆',
        rarity: 'epic',
        category: 'Consistency',
      },

      // Subject Mastery
      {
        id: 'math_master',
        name: 'Math Wizard',
        description: 'Play 25 math games with 85% accuracy',
        type: 'subject',
        condition: (stats) => stats.subjectStats.mathematics?.gamesPlayed >= 25 && stats.subjectStats.mathematics?.accuracy >= 0.85,
        xpReward: 150,
        badgeIcon: '🔢',
        rarity: 'uncommon',
        category: 'Subject Mastery',
      },
      {
        id: 'english_master',
        name: 'Word Smith',
        description: 'Play 25 English games with 85% accuracy',
        type: 'subject',
        condition: (stats) => stats.subjectStats.english?.gamesPlayed >= 25 && stats.subjectStats.english?.accuracy >= 0.85,
        xpReward: 150,
        badgeIcon: '📝',
        rarity: 'uncommon',
        category: 'Subject Mastery',
      },
      {
        id: 'science_master',
        name: 'Science Explorer',
        description: 'Play 25 science games with 85% accuracy',
        type: 'subject',
        condition: (stats) => stats.subjectStats.science?.gamesPlayed >= 25 && stats.subjectStats.science?.accuracy >= 0.85,
        xpReward: 150,
        badgeIcon: '🔬',
        rarity: 'uncommon',
        category: 'Subject Mastery',
      },

      // Special Achievements
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a game in under 2 minutes with 100% accuracy',
        type: 'speed',
        condition: (stats, session) => {
          if (!session) return false;
          const totalTime = session.answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
          const accuracy = session.answers.filter(a => a.isCorrect).length / session.answers.length;
          return totalTime < 120000 && accuracy === 1.0 && session.answers.length >= 5;
        },
        xpReward: 300,
        badgeIcon: '⚡',
        rarity: 'rare',
        category: 'Performance',
      },
      {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Play a game between 10 PM and 6 AM',
        type: 'completion',
        condition: (stats, session) => {
          if (!session) return false;
          const hour = session.startTime.getHours();
          return hour >= 22 || hour <= 6;
        },
        xpReward: 50,
        badgeIcon: '🦉',
        rarity: 'uncommon',
        category: 'Special',
      },
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Play a game between 5 AM and 8 AM',
        type: 'completion',
        condition: (stats, session) => {
          if (!session) return false;
          const hour = session.startTime.getHours();
          return hour >= 5 && hour <= 8;
        },
        xpReward: 50,
        badgeIcon: '🐦',
        rarity: 'uncommon',
        category: 'Special',
      },
    ];
  }

  checkAchievements(stats: PlayerStats, session?: GameSession): AchievementCondition[] {
    const newAchievements: AchievementCondition[] = [];

    for (const achievement of this.achievements) {
      // Skip if already earned
      if (stats.achievements.includes(achievement.id)) {
        continue;
      }

      // Check condition
      if (achievement.condition(stats, session)) {
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  // === BADGE SYSTEM ===

  getBadgeProgress(stats: PlayerStats): Array<{
    achievement: AchievementCondition;
    progress: number;
    isComplete: boolean;
  }> {
    return this.achievements.map(achievement => {
      const isComplete = stats.achievements.includes(achievement.id);
      let progress = 0;

      if (!isComplete) {
        // Calculate progress based on achievement type
        switch (achievement.type) {
          case 'xp':
            const targetXP = this.extractNumberFromCondition(achievement.id, 'xp_');
            progress = Math.min(1, stats.totalXP / targetXP);
            break;
          case 'streak':
            const targetStreak = this.extractNumberFromCondition(achievement.id, 'streak_');
            progress = Math.min(1, stats.longestStreak / targetStreak);
            break;
          case 'accuracy':
            const targetAccuracy = this.extractNumberFromCondition(achievement.id, 'accuracy_') / 100;
            progress = Math.min(1, stats.averageAccuracy / targetAccuracy);
            break;
          case 'daily':
            const targetDays = this.extractNumberFromCondition(achievement.id, 'daily_streak_');
            progress = Math.min(1, stats.dailyStats.currentStreak / targetDays);
            break;
        }
      } else {
        progress = 1;
      }

      return {
        achievement,
        progress,
        isComplete,
      };
    });
  }

  private extractNumberFromCondition(id: string, prefix: string): number {
    const numberStr = id.replace(prefix, '').replace(/[^0-9]/g, '');
    return parseInt(numberStr) || 0;
  }

  // === STATISTICS UPDATES ===

  updatePlayerStats(stats: PlayerStats, session: GameSession, xpBreakdown: XPBreakdown): PlayerStats {
    const newStats = { ...stats };

    // Update total XP and level
    newStats.totalXP += xpBreakdown.totalXP;
    const levelInfo = this.calculateLevel(newStats.totalXP);
    newStats.level = levelInfo.level;
    newStats.currentLevelXP = levelInfo.currentLevelXP;
    newStats.nextLevelXP = levelInfo.nextLevelXP;

    // Update game counts
    newStats.totalGamesPlayed++;

    // Update answer counts
    const correctAnswers = session.answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = session.answers.length - correctAnswers;
    newStats.totalCorrectAnswers += correctAnswers;
    newStats.totalIncorrectAnswers += incorrectAnswers;

    // Update accuracy
    const totalAnswers = newStats.totalCorrectAnswers + newStats.totalIncorrectAnswers;
    newStats.averageAccuracy = totalAnswers > 0 ? newStats.totalCorrectAnswers / totalAnswers : 0;

    // Update streak
    const sessionStreak = this.getMaxStreakFromAnswers(session.answers);
    newStats.longestStreak = Math.max(newStats.longestStreak, sessionStreak);

    // Update speed
    const avgTime = session.answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / session.answers.length;
    newStats.averageSpeed = (newStats.averageSpeed * (newStats.totalGamesPlayed - 1) + avgTime) / newStats.totalGamesPlayed;

    // Update subject stats
    const subject = this.getSubjectFromGameId(session.gameId);
    if (!newStats.subjectStats[subject]) {
      newStats.subjectStats[subject] = {
        gamesPlayed: 0,
        accuracy: 0,
        xpEarned: 0,
      };
    }

    const subjectStats = newStats.subjectStats[subject];
    const sessionAccuracy = correctAnswers / session.answers.length;
    subjectStats.accuracy = (subjectStats.accuracy * subjectStats.gamesPlayed + sessionAccuracy) / (subjectStats.gamesPlayed + 1);
    subjectStats.gamesPlayed++;
    subjectStats.xpEarned += xpBreakdown.totalXP;
    subjectStats.lastPlayed = new Date();

    // Update difficulty stats
    const sessionDifficulty = ((session as any).difficulty as DifficultyLevel) || 'medium';
    if (!newStats.difficultyStats[sessionDifficulty]) {
      newStats.difficultyStats[sessionDifficulty] = {
        gamesPlayed: 0,
        accuracy: 0,
        xpEarned: 0,
      };
    }

    const diffStats = newStats.difficultyStats[sessionDifficulty];
    diffStats.accuracy = (diffStats.accuracy * diffStats.gamesPlayed + sessionAccuracy) / (diffStats.gamesPlayed + 1);
    diffStats.gamesPlayed++;
    diffStats.xpEarned += xpBreakdown.totalXP;

    // Update daily stats
    const today = new Date();
    const lastPlayDate = newStats.dailyStats.lastPlayDate;

    if (!lastPlayDate || !this.isSameDay(today, lastPlayDate)) {
      // New day
      if (lastPlayDate && this.isConsecutiveDay(today, lastPlayDate)) {
        newStats.dailyStats.currentStreak++;
      } else {
        newStats.dailyStats.currentStreak = 1;
      }

      newStats.dailyStats.longestStreak = Math.max(
        newStats.dailyStats.longestStreak,
        newStats.dailyStats.currentStreak
      );

      newStats.dailyStats.todayXP = xpBreakdown.totalXP;
    } else {
      // Same day
      newStats.dailyStats.todayXP += xpBreakdown.totalXP;
    }

    newStats.dailyStats.lastPlayDate = today;
    newStats.dailyStats.weeklyXP += xpBreakdown.totalXP;
    newStats.dailyStats.monthlyXP += xpBreakdown.totalXP;

    return newStats;
  }

  private getSubjectFromGameId(gameId: string): Subject {
    if (gameId.includes('math')) return 'mathematics';
    if (gameId.includes('english')) return 'english';
    if (gameId.includes('science')) return 'science';
    return 'mathematics'; // default
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private isConsecutiveDay(today: Date, lastDate: Date): boolean {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return this.isSameDay(yesterday, lastDate);
  }

  // === REWARDS AND BONUSES ===

  calculateDailyBonus(stats: PlayerStats): { available: boolean; multiplier: number; xpBonus: number } {
    const today = new Date();
    const lastPlayDate = stats.dailyStats.lastPlayDate;

    // Check if it's a new day
    const isNewDay = !lastPlayDate || !this.isSameDay(today, lastPlayDate);

    if (!isNewDay) {
      return { available: false, multiplier: 1.0, xpBonus: 0 };
    }

    // Calculate bonus based on streak
    const streakBonus = Math.min(stats.dailyStats.currentStreak * 0.1, 0.5); // Max 50% bonus
    const multiplier = 1.0 + streakBonus;
    const xpBonus = Math.floor(stats.totalXP * 0.01 * stats.dailyStats.currentStreak); // 1% per streak day

    return {
      available: true,
      multiplier,
      xpBonus,
    };
  }

  getLeaderboardPosition(playerStats: PlayerStats, allPlayerStats: PlayerStats[]): {
    position: number;
    percentile: number;
    nearbyPlayers: Array<{ position: number; xp: number; level: number }>;
  } {
    const sortedPlayers = allPlayerStats
      .sort((a, b) => b.totalXP - a.totalXP)
      .map((stats, index) => ({
        position: index + 1,
        xp: stats.totalXP,
        level: stats.level,
        isCurrentPlayer: stats === playerStats,
      }));

    const playerPosition = sortedPlayers.findIndex(p => p.isCurrentPlayer) + 1;
    const percentile = ((sortedPlayers.length - playerPosition + 1) / sortedPlayers.length) * 100;

    // Get nearby players (±2 positions)
    const startIndex = Math.max(0, playerPosition - 3);
    const endIndex = Math.min(sortedPlayers.length, playerPosition + 2);
    const nearbyPlayers = sortedPlayers.slice(startIndex, endIndex);

    return {
      position: playerPosition,
      percentile: Math.round(percentile),
      nearbyPlayers,
    };
  }

  // === CONFIGURATION ===

  updateConfig(newConfig: Partial<XPCalculationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): XPCalculationConfig {
    return { ...this.config };
  }

  addAchievement(achievement: AchievementCondition): void {
    this.achievements.push(achievement);
  }

  getAchievements(): AchievementCondition[] {
    return [...this.achievements];
  }

  getAchievementsByCategory(): Record<string, AchievementCondition[]> {
    const categories: Record<string, AchievementCondition[]> = {};

    for (const achievement of this.achievements) {
      if (!categories[achievement.category]) {
        categories[achievement.category] = [];
      }
      categories[achievement.category].push(achievement);
    }

    return categories;
  }
}

export default XPCalculator;