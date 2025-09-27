/**
 * AAA+ Leaderboard System
 * Real-time competitive rankings and social competition
 * COPPA compliant with privacy-first design
 */

import { achievementService } from './AchievementService';
import { realTimeAnalytics } from '../analytics/RealTimeAnalyticsService';

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  avatar: string;
  score: number;
  rank: number;
  level: number;
  achievements: number;
  streak: number;
  timestamp: Date;
  isCurrentUser?: boolean;
  change?: 'up' | 'down' | 'same';
  changeValue?: number;
  country?: string;
  ageGroup?: '3-5' | '6-8' | '9+';
}

export interface Leaderboard {
  id: string;
  name: string;
  type: LeaderboardType;
  scope: LeaderboardScope;
  subject?: string;
  timeframe: LeaderboardTimeframe;
  entries: LeaderboardEntry[];
  lastUpdated: Date;
  totalPlayers: number;
  userRank?: number;
  userEntry?: LeaderboardEntry;
  rewards?: LeaderboardReward[];
}

type LeaderboardType =
  | 'overall'
  | 'subject'
  | 'weekly_challenge'
  | 'achievement'
  | 'streak'
  | 'speed'
  | 'accuracy';

type LeaderboardScope =
  | 'global'
  | 'country'
  | 'age_group'
  | 'friends'
  | 'school'
  | 'classroom';

type LeaderboardTimeframe =
  | 'all_time'
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'hourly';

interface LeaderboardReward {
  rank: number;
  reward: {
    type: 'xp' | 'coins' | 'badge' | 'title' | 'avatar';
    value: number | string;
  };
}

interface LeaderboardFilter {
  type?: LeaderboardType;
  scope?: LeaderboardScope;
  subject?: string;
  timeframe?: LeaderboardTimeframe;
  ageGroup?: '3-5' | '6-8' | '9+';
}

export class LeaderboardService {
  private static instance: LeaderboardService;
  private leaderboards: Map<string, Leaderboard> = new Map();
  private userEntries: Map<string, LeaderboardEntry> = new Map();
  private updateInterval: number | null = null;
  private currentUserId: string | null = null;
  private callbacks: Set<(leaderboard: Leaderboard) => void> = new Set();
  private rankChangeCallbacks: Set<(change: RankChange) => void> = new Set();

  private readonly UPDATE_FREQUENCY = 60000; // 1 minute
  private readonly MAX_ENTRIES_PER_BOARD = 100;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.initializeLeaderboards();
    this.loadLeaderboards();
    this.startAutoUpdate();
  }

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  private initializeLeaderboards(): void {
    // Create default leaderboards
    const defaultBoards: Partial<Leaderboard>[] = [
      {
        id: 'global_overall',
        name: 'Global Rankings',
        type: 'overall',
        scope: 'global',
        timeframe: 'all_time',
        rewards: [
          { rank: 1, reward: { type: 'xp', value: 5000 } },
          { rank: 2, reward: { type: 'xp', value: 3000 } },
          { rank: 3, reward: { type: 'xp', value: 1500 } },
          { rank: 10, reward: { type: 'badge', value: 'top_10' } },
          { rank: 100, reward: { type: 'title', value: 'Competitor' } }
        ]
      },
      {
        id: 'weekly_overall',
        name: 'Weekly Champions',
        type: 'overall',
        scope: 'global',
        timeframe: 'weekly',
        rewards: [
          { rank: 1, reward: { type: 'badge', value: 'weekly_champion' } },
          { rank: 3, reward: { type: 'xp', value: 1000 } },
          { rank: 10, reward: { type: 'coins', value: 100 } }
        ]
      },
      {
        id: 'daily_streak',
        name: 'Daily Streak Leaders',
        type: 'streak',
        scope: 'global',
        timeframe: 'daily',
        rewards: [
          { rank: 1, reward: { type: 'title', value: 'Streak Master' } }
        ]
      }
    ];

    // Create subject-specific leaderboards
    const subjects = ['mathematics', 'english', 'science', 'logic', 'geography', 'arts'];
    subjects.forEach(subject => {
      defaultBoards.push({
        id: `subject_${subject}`,
        name: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Masters`,
        type: 'subject',
        scope: 'global',
        subject,
        timeframe: 'all_time',
        rewards: [
          { rank: 1, reward: { type: 'avatar', value: `${subject}_champion` } }
        ]
      });
    });

    // Initialize leaderboards
    defaultBoards.forEach(board => {
      const leaderboard: Leaderboard = {
        id: board.id!,
        name: board.name!,
        type: board.type!,
        scope: board.scope!,
        subject: board.subject,
        timeframe: board.timeframe!,
        entries: [],
        lastUpdated: new Date(),
        totalPlayers: 0,
        rewards: board.rewards
      };
      this.leaderboards.set(leaderboard.id, leaderboard);
    });
  }

  /**
   * Update leaderboard with new score
   */
  public submitScore(
    userId: string,
    score: number,
    type: LeaderboardType,
    subject?: string,
    metadata?: {
      displayName?: string;
      avatar?: string;
      ageGroup?: '3-5' | '6-8' | '9+';
      country?: string;
    }
  ): void {
    // Find relevant leaderboards
    const relevantBoards = this.getRelevantLeaderboards(type, subject);

    relevantBoards.forEach(leaderboard => {
      // Create or update entry
      const entry: LeaderboardEntry = {
        id: userId,
        displayName: metadata?.displayName || this.anonymizeUsername(userId),
        avatar: metadata?.avatar || this.getDefaultAvatar(),
        score,
        rank: 0, // Will be calculated
        level: this.calculateLevel(score),
        achievements: this.getAchievementCount(userId),
        streak: this.getCurrentStreak(userId),
        timestamp: new Date(),
        isCurrentUser: userId === this.currentUserId,
        ageGroup: metadata?.ageGroup,
        country: metadata?.country
      };

      // Add or update entry in leaderboard
      this.updateLeaderboardEntry(leaderboard, entry);

      // Recalculate ranks
      this.recalculateRanks(leaderboard);

      // Check for rank changes
      this.checkRankChanges(leaderboard, entry);

      // Save leaderboard
      this.saveLeaderboards();
    });
  }

  /**
   * Get relevant leaderboards for score submission
   */
  private getRelevantLeaderboards(
    type: LeaderboardType,
    subject?: string
  ): Leaderboard[] {
    const relevant: Leaderboard[] = [];

    this.leaderboards.forEach(leaderboard => {
      // Match type
      if (type === 'overall' || leaderboard.type === type) {
        // Match subject if specified
        if (!subject || !leaderboard.subject || leaderboard.subject === subject) {
          relevant.push(leaderboard);
        }
      }
    });

    return relevant;
  }

  /**
   * Update leaderboard entry
   */
  private updateLeaderboardEntry(leaderboard: Leaderboard, entry: LeaderboardEntry): void {
    const existingIndex = leaderboard.entries.findIndex(e => e.id === entry.id);

    if (existingIndex >= 0) {
      // Update existing entry if score is higher
      if (entry.score > leaderboard.entries[existingIndex].score) {
        const oldRank = leaderboard.entries[existingIndex].rank;
        leaderboard.entries[existingIndex] = {
          ...entry,
          change: oldRank > 0 ? 'up' : 'same',
          changeValue: oldRank - entry.rank
        };
      }
    } else {
      // Add new entry
      leaderboard.entries.push(entry);
      leaderboard.totalPlayers++;
    }

    // Keep only top entries
    if (leaderboard.entries.length > this.MAX_ENTRIES_PER_BOARD) {
      leaderboard.entries.sort((a, b) => b.score - a.score);
      leaderboard.entries = leaderboard.entries.slice(0, this.MAX_ENTRIES_PER_BOARD);
    }

    leaderboard.lastUpdated = new Date();
  }

  /**
   * Recalculate ranks
   */
  private recalculateRanks(leaderboard: Leaderboard): void {
    // Sort by score
    leaderboard.entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-breaker: earlier timestamp wins
      return a.timestamp.getTime() - b.timestamp.getTime();
    });

    // Assign ranks
    let currentRank = 1;
    let previousScore = -1;
    let sameRankCount = 0;

    leaderboard.entries.forEach((entry, index) => {
      if (entry.score === previousScore) {
        sameRankCount++;
      } else {
        currentRank = index + 1;
        sameRankCount = 0;
      }
      entry.rank = currentRank;
      previousScore = entry.score;

      // Update user rank if current user
      if (entry.isCurrentUser || entry.id === this.currentUserId) {
        leaderboard.userRank = entry.rank;
        leaderboard.userEntry = entry;
      }
    });
  }

  /**
   * Check for rank changes
   */
  private checkRankChanges(leaderboard: Leaderboard, entry: LeaderboardEntry): void {
    const previousEntry = this.userEntries.get(`${leaderboard.id}_${entry.id}`);

    if (previousEntry && previousEntry.rank !== entry.rank) {
      const change: RankChange = {
        leaderboardId: leaderboard.id,
        leaderboardName: leaderboard.name,
        previousRank: previousEntry.rank,
        newRank: entry.rank,
        improvement: previousEntry.rank - entry.rank,
        timestamp: new Date()
      };

      // Notify listeners
      this.rankChangeCallbacks.forEach(callback => callback(change));

      // Achievement for rank improvements
      if (change.improvement > 0) {
        if (entry.rank === 1) {
          console.log('🥇 First Place Achieved!');
        } else if (entry.rank <= 3) {
          console.log('🏆 Top 3 Achieved!');
        } else if (entry.rank <= 10) {
          console.log('⭐ Top 10 Achieved!');
        }
      }
    }

    // Store current entry for future comparisons
    this.userEntries.set(`${leaderboard.id}_${entry.id}`, { ...entry });
  }

  /**
   * Get leaderboards with filters
   */
  public getLeaderboards(filter?: LeaderboardFilter): Leaderboard[] {
    let boards = Array.from(this.leaderboards.values());

    if (filter) {
      if (filter.type) {
        boards = boards.filter(b => b.type === filter.type);
      }
      if (filter.scope) {
        boards = boards.filter(b => b.scope === filter.scope);
      }
      if (filter.subject) {
        boards = boards.filter(b => b.subject === filter.subject);
      }
      if (filter.timeframe) {
        boards = boards.filter(b => b.timeframe === filter.timeframe);
      }
    }

    return boards;
  }

  /**
   * Get specific leaderboard
   */
  public getLeaderboard(id: string): Leaderboard | undefined {
    return this.leaderboards.get(id);
  }

  /**
   * Get user's position across all leaderboards
   */
  public getUserPositions(userId: string): UserPosition[] {
    const positions: UserPosition[] = [];

    this.leaderboards.forEach(leaderboard => {
      const entry = leaderboard.entries.find(e => e.id === userId);
      if (entry) {
        positions.push({
          leaderboardId: leaderboard.id,
          leaderboardName: leaderboard.name,
          rank: entry.rank,
          score: entry.score,
          totalPlayers: leaderboard.totalPlayers,
          percentile: this.calculatePercentile(entry.rank, leaderboard.totalPlayers)
        });
      }
    });

    return positions;
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(rank: number, totalPlayers: number): number {
    if (totalPlayers === 0) return 0;
    return Math.round(((totalPlayers - rank + 1) / totalPlayers) * 100);
  }

  /**
   * Get nearby competitors
   */
  public getNearbyCompetitors(
    leaderboardId: string,
    userId: string,
    range: number = 5
  ): LeaderboardEntry[] {
    const leaderboard = this.leaderboards.get(leaderboardId);
    if (!leaderboard) return [];

    const userIndex = leaderboard.entries.findIndex(e => e.id === userId);
    if (userIndex === -1) return [];

    const start = Math.max(0, userIndex - range);
    const end = Math.min(leaderboard.entries.length, userIndex + range + 1);

    return leaderboard.entries.slice(start, end);
  }

  /**
   * Generate mock data for testing
   */
  private generateMockData(): void {
    const names = [
      'Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan',
      'Casey', 'Riley', 'Avery', 'Quinn', 'Reese'
    ];

    const avatars = ['🦊', '🐼', '🦁', '🐯', '🐨', '🦝', '🐺', '🦄', '🐸', '🦋'];

    this.leaderboards.forEach(leaderboard => {
      const numEntries = Math.floor(Math.random() * 50) + 20;

      for (let i = 0; i < numEntries; i++) {
        const entry: LeaderboardEntry = {
          id: `mock_user_${i}`,
          displayName: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
          avatar: avatars[Math.floor(Math.random() * avatars.length)],
          score: Math.floor(Math.random() * 10000) + 100,
          rank: 0,
          level: Math.floor(Math.random() * 50) + 1,
          achievements: Math.floor(Math.random() * 30),
          streak: Math.floor(Math.random() * 20),
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        };

        leaderboard.entries.push(entry);
      }

      this.recalculateRanks(leaderboard);
      leaderboard.totalPlayers = leaderboard.entries.length;
    });
  }

  /**
   * Anonymize username for privacy
   */
  private anonymizeUsername(userId: string): string {
    const adjectives = ['Happy', 'Clever', 'Brave', 'Swift', 'Bright'];
    const nouns = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Fox'];

    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const adj = adjectives[hash % adjectives.length];
    const noun = nouns[(hash * 7) % nouns.length];
    const number = (hash % 100).toString().padStart(2, '0');

    return `${adj}${noun}${number}`;
  }

  /**
   * Get default avatar
   */
  private getDefaultAvatar(): string {
    const avatars = ['🦊', '🐼', '🦁', '🐯', '🐨'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  /**
   * Calculate level from score
   */
  private calculateLevel(score: number): number {
    return Math.floor(Math.sqrt(score / 100)) + 1;
  }

  /**
   * Get achievement count for user
   */
  private getAchievementCount(userId: string): number {
    const achievements = achievementService.getAchievements({ unlocked: true });
    return achievements.length;
  }

  /**
   * Get current streak for user
   */
  private getCurrentStreak(userId: string): number {
    const stats = achievementService.getUserStats();
    return stats.currentStreak;
  }

  /**
   * Start auto update timer
   */
  private startAutoUpdate(): void {
    this.updateInterval = window.setInterval(() => {
      this.refreshLeaderboards();
    }, this.UPDATE_FREQUENCY);

    // Generate initial mock data for demonstration
    this.generateMockData();
  }

  /**
   * Refresh leaderboards
   */
  private refreshLeaderboards(): void {
    // In production, this would fetch from server
    // For now, we'll just update timestamps
    this.leaderboards.forEach(leaderboard => {
      // Simulate score changes
      if (Math.random() > 0.7) {
        const randomEntry = leaderboard.entries[Math.floor(Math.random() * leaderboard.entries.length)];
        if (randomEntry) {
          randomEntry.score += Math.floor(Math.random() * 100);
          this.recalculateRanks(leaderboard);
        }
      }

      leaderboard.lastUpdated = new Date();
    });

    // Notify listeners
    this.leaderboards.forEach(leaderboard => {
      this.callbacks.forEach(callback => callback(leaderboard));
    });
  }

  /**
   * Save leaderboards to localStorage
   */
  private saveLeaderboards(): void {
    try {
      const data = {
        leaderboards: Array.from(this.leaderboards.values()).map(lb => ({
          ...lb,
          entries: lb.entries.slice(0, 20) // Save only top 20 for space
        })),
        userEntries: Array.from(this.userEntries.entries())
      };

      localStorage.setItem('stealth_leaderboards', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save leaderboards:', error);
    }
  }

  /**
   * Load leaderboards from localStorage
   */
  private loadLeaderboards(): void {
    try {
      const stored = localStorage.getItem('stealth_leaderboards');
      if (!stored) return;

      const data = JSON.parse(stored);

      // Restore leaderboards
      if (data.leaderboards) {
        data.leaderboards.forEach((lb: any) => {
          lb.lastUpdated = new Date(lb.lastUpdated);
          lb.entries.forEach((entry: any) => {
            entry.timestamp = new Date(entry.timestamp);
          });
          this.leaderboards.set(lb.id, lb);
        });
      }

      // Restore user entries
      if (data.userEntries) {
        data.userEntries.forEach(([key, value]: [string, any]) => {
          value.timestamp = new Date(value.timestamp);
          this.userEntries.set(key, value);
        });
      }

      console.log('📊 Loaded leaderboards');
    } catch (error) {
      console.error('Failed to load leaderboards:', error);
    }
  }

  /**
   * Set current user
   */
  public setCurrentUser(userId: string): void {
    this.currentUserId = userId;

    // Mark user entries
    this.leaderboards.forEach(leaderboard => {
      leaderboard.entries.forEach(entry => {
        entry.isCurrentUser = entry.id === userId;
      });
    });
  }

  /**
   * Subscribe to leaderboard updates
   */
  public onLeaderboardUpdate(callback: (leaderboard: Leaderboard) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Subscribe to rank changes
   */
  public onRankChange(callback: (change: RankChange) => void): () => void {
    this.rankChangeCallbacks.add(callback);
    return () => this.rankChangeCallbacks.delete(callback);
  }

  /**
   * Reset leaderboards (for testing)
   */
  public resetLeaderboards(): void {
    this.leaderboards.clear();
    this.userEntries.clear();
    this.initializeLeaderboards();
    this.saveLeaderboards();
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Type definitions
interface RankChange {
  leaderboardId: string;
  leaderboardName: string;
  previousRank: number;
  newRank: number;
  improvement: number;
  timestamp: Date;
}

interface UserPosition {
  leaderboardId: string;
  leaderboardName: string;
  rank: number;
  score: number;
  totalPlayers: number;
  percentile: number;
}

// Export singleton instance
export const leaderboardService = LeaderboardService.getInstance();