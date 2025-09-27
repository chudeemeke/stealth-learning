/**
 * AAA+ Daily Challenges Service
 * Dynamic daily and weekly challenges for engagement
 * Personalized challenges based on learning patterns
 */

import { achievementService } from './AchievementService';
import { realTimeAnalytics } from '../analytics/RealTimeAnalyticsService';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  progress: number;
  targetProgress: number;
  completed: boolean;
  active: boolean;
  startTime: Date;
  endTime: Date;
  icon: string;
  color: string;
  animation?: string;
  streak?: number;
  personalChallenge?: boolean;
  ageGroup?: ('3-5' | '6-8' | '9+')[];
  subject?: string;
}

type ChallengeType =
  | 'daily'
  | 'weekly'
  | 'weekend'
  | 'special'
  | 'seasonal'
  | 'personal';

type ChallengeCategory =
  | 'accuracy'
  | 'speed'
  | 'streak'
  | 'exploration'
  | 'mastery'
  | 'social'
  | 'time';

interface ChallengeRequirement {
  type: RequirementType;
  value: number;
  subject?: string;
  timeLimit?: number;
  condition?: 'minimum' | 'exact' | 'consecutive';
}

type RequirementType =
  | 'questions_correct'
  | 'games_played'
  | 'streak_maintain'
  | 'accuracy_percent'
  | 'speed_answers'
  | 'subjects_played'
  | 'friends_challenged'
  | 'time_played'
  | 'perfect_games';

interface ChallengeReward {
  type: 'xp' | 'coins' | 'badge' | 'achievement' | 'powerup' | 'theme';
  value: number | string;
  bonus?: boolean;
}

interface ChallengeTemplate {
  id: string;
  name: string;
  descriptionTemplate: string;
  category: ChallengeCategory;
  baseRequirements: Partial<ChallengeRequirement>[];
  baseRewards: ChallengeReward[];
  icon: string;
  color: string;
  weight: number; // Probability weight for selection
}

export class DailyChallengesService {
  private static instance: DailyChallengesService;
  private challenges: Map<string, Challenge> = new Map();
  private templates: Map<string, ChallengeTemplate> = new Map();
  private activeDaily: Challenge[] = [];
  private activeWeekly: Challenge[] = [];
  private personalChallenges: Challenge[] = [];
  private completedToday: Set<string> = new Set();
  private lastGeneratedDate: Date | null = null;
  private userProfile: any = null;
  private callbacks: Set<(challenge: Challenge) => void> = new Set();

  private readonly MAX_DAILY_CHALLENGES = 3;
  private readonly MAX_WEEKLY_CHALLENGES = 2;
  private readonly MAX_PERSONAL_CHALLENGES = 2;

  private constructor() {
    this.initializeChallengeTemplates();
    this.loadChallenges();
    this.checkAndGenerateChallenges();
    this.startChallengeTimer();
  }

  public static getInstance(): DailyChallengesService {
    if (!DailyChallengesService.instance) {
      DailyChallengesService.instance = new DailyChallengesService();
    }
    return DailyChallengesService.instance;
  }

  private initializeChallengeTemplates(): void {
    // Accuracy Challenges
    this.addTemplate({
      id: 'accuracy_champion',
      name: 'Accuracy Champion',
      descriptionTemplate: 'Answer {value} questions with 80% accuracy',
      category: 'accuracy',
      baseRequirements: [{ type: 'questions_correct', condition: 'minimum' }],
      baseRewards: [{ type: 'xp', value: 200 }],
      icon: '🎯',
      color: 'green',
      weight: 10
    });

    this.addTemplate({
      id: 'perfect_precision',
      name: 'Perfect Precision',
      descriptionTemplate: 'Complete {value} games with perfect scores',
      category: 'accuracy',
      baseRequirements: [{ type: 'perfect_games' }],
      baseRewards: [{ type: 'xp', value: 500 }, { type: 'coins', value: 50 }],
      icon: '💎',
      color: 'blue',
      weight: 5
    });

    // Speed Challenges
    this.addTemplate({
      id: 'speed_runner',
      name: 'Speed Runner',
      descriptionTemplate: 'Answer {value} questions in under 3 seconds each',
      category: 'speed',
      baseRequirements: [{ type: 'speed_answers', timeLimit: 3000 }],
      baseRewards: [{ type: 'xp', value: 300 }],
      icon: '⚡',
      color: 'yellow',
      weight: 8
    });

    this.addTemplate({
      id: 'quick_thinker',
      name: 'Quick Thinker',
      descriptionTemplate: 'Complete {value} games in under 5 minutes each',
      category: 'speed',
      baseRequirements: [{ type: 'games_played', timeLimit: 300000 }],
      baseRewards: [{ type: 'xp', value: 250 }, { type: 'powerup', value: 'time_freeze' }],
      icon: '🚀',
      color: 'orange',
      weight: 7
    });

    // Streak Challenges
    this.addTemplate({
      id: 'streak_master',
      name: 'Streak Master',
      descriptionTemplate: 'Maintain a {value} answer streak',
      category: 'streak',
      baseRequirements: [{ type: 'streak_maintain' }],
      baseRewards: [{ type: 'xp', value: 400 }],
      icon: '🔥',
      color: 'red',
      weight: 9
    });

    this.addTemplate({
      id: 'consistency_king',
      name: 'Consistency King',
      descriptionTemplate: 'Play {value} games in a row without quitting',
      category: 'streak',
      baseRequirements: [{ type: 'games_played', condition: 'consecutive' }],
      baseRewards: [{ type: 'xp', value: 350 }, { type: 'badge', value: 'consistent' }],
      icon: '👑',
      color: 'purple',
      weight: 6
    });

    // Exploration Challenges
    this.addTemplate({
      id: 'subject_explorer',
      name: 'Subject Explorer',
      descriptionTemplate: 'Play at least {value} different subjects today',
      category: 'exploration',
      baseRequirements: [{ type: 'subjects_played' }],
      baseRewards: [{ type: 'xp', value: 300 }],
      icon: '🗺️',
      color: 'teal',
      weight: 8
    });

    this.addTemplate({
      id: 'variety_seeker',
      name: 'Variety Seeker',
      descriptionTemplate: 'Complete one game in each of {value} subjects',
      category: 'exploration',
      baseRequirements: [{ type: 'subjects_played', condition: 'exact' }],
      baseRewards: [{ type: 'xp', value: 450 }, { type: 'theme', value: 'explorer' }],
      icon: '🌈',
      color: 'rainbow',
      weight: 5
    });

    // Mastery Challenges
    this.addTemplate({
      id: 'math_marathon',
      name: 'Math Marathon',
      descriptionTemplate: 'Complete {value} mathematics games',
      category: 'mastery',
      baseRequirements: [{ type: 'games_played', subject: 'mathematics' }],
      baseRewards: [{ type: 'xp', value: 350 }],
      icon: '🔢',
      color: 'indigo',
      weight: 7
    });

    this.addTemplate({
      id: 'english_excellence',
      name: 'English Excellence',
      descriptionTemplate: 'Answer {value} English questions correctly',
      category: 'mastery',
      baseRequirements: [{ type: 'questions_correct', subject: 'english' }],
      baseRewards: [{ type: 'xp', value: 350 }],
      icon: '📚',
      color: 'blue',
      weight: 7
    });

    this.addTemplate({
      id: 'science_specialist',
      name: 'Science Specialist',
      descriptionTemplate: 'Achieve 85% accuracy in {value} science games',
      category: 'mastery',
      baseRequirements: [{ type: 'accuracy_percent', value: 85, subject: 'science' }],
      baseRewards: [{ type: 'xp', value: 400 }],
      icon: '🔬',
      color: 'green',
      weight: 6
    });

    // Time Challenges
    this.addTemplate({
      id: 'dedicated_learner',
      name: 'Dedicated Learner',
      descriptionTemplate: 'Play for {value} minutes today',
      category: 'time',
      baseRequirements: [{ type: 'time_played' }],
      baseRewards: [{ type: 'xp', value: 200 }],
      icon: '⏰',
      color: 'gray',
      weight: 10
    });

    this.addTemplate({
      id: 'marathon_player',
      name: 'Marathon Player',
      descriptionTemplate: 'Play for {value} minutes without a break',
      category: 'time',
      baseRequirements: [{ type: 'time_played', condition: 'consecutive' }],
      baseRewards: [{ type: 'xp', value: 500 }, { type: 'achievement', value: 'endurance' }],
      icon: '🏃',
      color: 'amber',
      weight: 4
    });

    // Social Challenges
    this.addTemplate({
      id: 'friend_challenger',
      name: 'Friend Challenger',
      descriptionTemplate: 'Challenge {value} friends to beat your score',
      category: 'social',
      baseRequirements: [{ type: 'friends_challenged' }],
      baseRewards: [{ type: 'xp', value: 300 }, { type: 'coins', value: 30 }],
      icon: '👥',
      color: 'pink',
      weight: 6
    });

    // Weekend Special Challenges
    this.addTemplate({
      id: 'weekend_warrior',
      name: 'Weekend Warrior',
      descriptionTemplate: 'Complete {value} games over the weekend',
      category: 'time',
      baseRequirements: [{ type: 'games_played' }],
      baseRewards: [{ type: 'xp', value: 600 }, { type: 'badge', value: 'weekend_warrior' }],
      icon: '⚔️',
      color: 'gold',
      weight: 0 // Only on weekends
    });
  }

  private addTemplate(template: Partial<ChallengeTemplate>): void {
    const fullTemplate: ChallengeTemplate = {
      id: template.id || '',
      name: template.name || '',
      descriptionTemplate: template.descriptionTemplate || '',
      category: template.category || 'accuracy',
      baseRequirements: template.baseRequirements || [],
      baseRewards: template.baseRewards || [],
      icon: template.icon || '🎯',
      color: template.color || 'blue',
      weight: template.weight || 5
    };

    this.templates.set(fullTemplate.id, fullTemplate);
  }

  /**
   * Generate daily challenges
   */
  private generateDailyChallenges(): void {
    console.log('🎯 Generating daily challenges');

    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Clear existing daily challenges
    this.activeDaily = [];

    // Get user's learning profile for personalization
    const analytics = realTimeAnalytics.getMetrics();
    const userProfile = this.analyzeUserProfile(analytics);

    // Select challenge templates based on user profile
    const selectedTemplates = this.selectChallengeTemplates(userProfile, 'daily');

    // Generate challenges from templates
    selectedTemplates.forEach((template, index) => {
      const challenge = this.createChallengeFromTemplate(
        template,
        'daily',
        now,
        endOfDay,
        userProfile
      );

      this.challenges.set(challenge.id, challenge);
      this.activeDaily.push(challenge);
    });

    // Generate personal challenges
    this.generatePersonalChallenges(userProfile);

    // Save challenges
    this.saveChallenges();

    console.log(`✨ Generated ${this.activeDaily.length} daily challenges`);
  }

  /**
   * Generate weekly challenges
   */
  private generateWeeklyChallenges(): void {
    console.log('📅 Generating weekly challenges');

    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    // Clear existing weekly challenges
    this.activeWeekly = [];

    // Get user profile
    const analytics = realTimeAnalytics.getMetrics();
    const userProfile = this.analyzeUserProfile(analytics);

    // Select challenge templates
    const selectedTemplates = this.selectChallengeTemplates(userProfile, 'weekly');

    // Generate challenges
    selectedTemplates.forEach(template => {
      const challenge = this.createChallengeFromTemplate(
        template,
        'weekly',
        now,
        endOfWeek,
        userProfile,
        3 // Multiply requirements for weekly
      );

      this.challenges.set(challenge.id, challenge);
      this.activeWeekly.push(challenge);
    });

    // Save challenges
    this.saveChallenges();

    console.log(`✨ Generated ${this.activeWeekly.length} weekly challenges`);
  }

  /**
   * Generate personal challenges based on user weaknesses
   */
  private generatePersonalChallenges(userProfile: any): void {
    this.personalChallenges = [];

    // Challenge for struggling subjects
    if (userProfile.weakSubjects.length > 0) {
      const subject = userProfile.weakSubjects[0];
      const challenge: Challenge = {
        id: `personal_${Date.now()}_1`,
        title: `Master ${subject}`,
        description: `Practice ${subject} and improve your accuracy`,
        type: 'personal',
        category: 'mastery',
        difficulty: 'adaptive',
        requirements: [{
          type: 'accuracy_percent',
          value: 70,
          subject,
          condition: 'minimum'
        }],
        rewards: [
          { type: 'xp', value: 500, bonus: true },
          { type: 'badge', value: `${subject}_improver` }
        ],
        progress: 0,
        targetProgress: 70,
        completed: false,
        active: true,
        startTime: new Date(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        icon: '🎯',
        color: 'purple',
        personalChallenge: true
      };

      this.challenges.set(challenge.id, challenge);
      this.personalChallenges.push(challenge);
    }

    // Challenge for improving speed
    if (userProfile.avgResponseTime > 5000) {
      const challenge: Challenge = {
        id: `personal_${Date.now()}_2`,
        title: 'Speed Improvement',
        description: 'Improve your response time',
        type: 'personal',
        category: 'speed',
        difficulty: 'adaptive',
        requirements: [{
          type: 'speed_answers',
          value: 10,
          timeLimit: 4000
        }],
        rewards: [
          { type: 'xp', value: 400, bonus: true },
          { type: 'powerup', value: 'speed_boost' }
        ],
        progress: 0,
        targetProgress: 10,
        completed: false,
        active: true,
        startTime: new Date(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        icon: '⚡',
        color: 'yellow',
        personalChallenge: true
      };

      this.challenges.set(challenge.id, challenge);
      this.personalChallenges.push(challenge);
    }
  }

  /**
   * Analyze user profile for challenge personalization
   */
  private analyzeUserProfile(analytics: any): any {
    const profile = {
      level: 1,
      preferredSubjects: [],
      weakSubjects: [],
      avgAccuracy: 0,
      avgResponseTime: 0,
      playStyle: 'balanced',
      ageGroup: '6-8'
    };

    // Analyze learning metrics
    if (analytics.learning && analytics.learning.length > 0) {
      const totalAccuracy = analytics.learning.reduce((sum: number, m: any) => sum + m.accuracy, 0);
      profile.avgAccuracy = totalAccuracy / analytics.learning.length;

      const totalResponseTime = analytics.learning.reduce((sum: number, m: any) => sum + m.avgResponseTime, 0);
      profile.avgResponseTime = totalResponseTime / analytics.learning.length;

      // Find strong and weak subjects
      analytics.learning.forEach((metric: any) => {
        if (metric.accuracy > 80) {
          profile.preferredSubjects.push(metric.subject);
        } else if (metric.accuracy < 60) {
          profile.weakSubjects.push(metric.subject);
        }
      });
    }

    // Determine play style
    if (profile.avgResponseTime < 3000) {
      profile.playStyle = 'speed';
    } else if (profile.avgAccuracy > 85) {
      profile.playStyle = 'accuracy';
    }

    return profile;
  }

  /**
   * Select challenge templates based on user profile
   */
  private selectChallengeTemplates(
    userProfile: any,
    type: 'daily' | 'weekly'
  ): ChallengeTemplate[] {
    const templates = Array.from(this.templates.values());
    const selected: ChallengeTemplate[] = [];
    const maxChallenges = type === 'daily' ? this.MAX_DAILY_CHALLENGES : this.MAX_WEEKLY_CHALLENGES;

    // Filter templates by day of week
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    let availableTemplates = templates.filter(t => {
      if (t.id === 'weekend_warrior') {
        return isWeekend && type === 'daily';
      }
      return t.weight > 0;
    });

    // Weighted random selection
    for (let i = 0; i < maxChallenges && availableTemplates.length > 0; i++) {
      const totalWeight = availableTemplates.reduce((sum, t) => sum + t.weight, 0);
      let random = Math.random() * totalWeight;

      for (const template of availableTemplates) {
        random -= template.weight;
        if (random <= 0) {
          selected.push(template);
          // Remove selected template from available
          availableTemplates = availableTemplates.filter(t => t.id !== template.id);
          break;
        }
      }
    }

    return selected;
  }

  /**
   * Create challenge from template
   */
  private createChallengeFromTemplate(
    template: ChallengeTemplate,
    type: ChallengeType,
    startTime: Date,
    endTime: Date,
    userProfile: any,
    multiplier: number = 1
  ): Challenge {
    // Determine difficulty based on user level
    const difficulty = this.calculateDifficulty(userProfile.level);

    // Scale requirements based on difficulty and type
    const requirements: ChallengeRequirement[] = template.baseRequirements.map(req => {
      const baseValue = this.calculateRequirementValue(req.type!, userProfile.level, difficulty);
      return {
        ...req,
        type: req.type!,
        value: Math.ceil(baseValue * multiplier)
      };
    });

    // Scale rewards
    const rewards: ChallengeReward[] = template.baseRewards.map(reward => {
      if (reward.type === 'xp' && typeof reward.value === 'number') {
        return {
          ...reward,
          value: Math.ceil(reward.value * (1 + userProfile.level * 0.1) * multiplier)
        };
      }
      return reward;
    });

    // Create description
    const description = template.descriptionTemplate.replace(
      '{value}',
      requirements[0].value.toString()
    );

    const challenge: Challenge = {
      id: `${type}_${template.id}_${Date.now()}`,
      title: template.name,
      description,
      type,
      category: template.category,
      difficulty,
      requirements,
      rewards,
      progress: 0,
      targetProgress: requirements[0].value,
      completed: false,
      active: true,
      startTime,
      endTime,
      icon: template.icon,
      color: template.color,
      ageGroup: userProfile.ageGroup ? [userProfile.ageGroup] : undefined
    };

    return challenge;
  }

  /**
   * Calculate difficulty based on user level
   */
  private calculateDifficulty(level: number): 'easy' | 'medium' | 'hard' {
    if (level < 10) return 'easy';
    if (level < 25) return 'medium';
    return 'hard';
  }

  /**
   * Calculate requirement value based on type and level
   */
  private calculateRequirementValue(
    type: RequirementType,
    level: number,
    difficulty: 'easy' | 'medium' | 'hard'
  ): number {
    const difficultyMultiplier = {
      easy: 0.8,
      medium: 1.0,
      hard: 1.3
    };

    const baseValues: Record<RequirementType, number> = {
      questions_correct: 10,
      games_played: 3,
      streak_maintain: 5,
      accuracy_percent: 70,
      speed_answers: 5,
      subjects_played: 2,
      friends_challenged: 2,
      time_played: 15,
      perfect_games: 1
    };

    const base = baseValues[type] || 10;
    const levelBonus = Math.floor(level / 5);

    return Math.ceil(base * difficultyMultiplier[difficulty] * (1 + levelBonus * 0.2));
  }

  /**
   * Update challenge progress
   */
  public updateProgress(event: ChallengeProgressEvent): void {
    const activeChallenges = [
      ...this.activeDaily,
      ...this.activeWeekly,
      ...this.personalChallenges
    ];

    for (const challenge of activeChallenges) {
      if (challenge.completed || !challenge.active) continue;

      for (const requirement of challenge.requirements) {
        if (this.matchesRequirement(requirement, event)) {
          challenge.progress++;

          // Check if completed
          if (challenge.progress >= challenge.targetProgress) {
            this.completeChallenge(challenge);
          }

          // Save progress
          this.saveChallenges();
          break;
        }
      }
    }
  }

  /**
   * Check if event matches requirement
   */
  private matchesRequirement(
    requirement: ChallengeRequirement,
    event: ChallengeProgressEvent
  ): boolean {
    // Check requirement type
    if (requirement.type !== event.type) return false;

    // Check subject if specified
    if (requirement.subject && requirement.subject !== event.subject) return false;

    // Check time limit if specified
    if (requirement.timeLimit && event.responseTime && event.responseTime > requirement.timeLimit) {
      return false;
    }

    // Check condition
    if (requirement.condition === 'minimum' && event.value && event.value < requirement.value) {
      return false;
    }

    return true;
  }

  /**
   * Complete challenge
   */
  private completeChallenge(challenge: Challenge): void {
    challenge.completed = true;
    challenge.active = false;

    console.log(`🎉 Challenge completed: ${challenge.title}`);

    // Apply rewards
    for (const reward of challenge.rewards) {
      this.applyReward(reward);
    }

    // Track achievement progress
    achievementService.trackProgress({
      type: 'challenge_completed'
    });

    // Notify listeners
    this.callbacks.forEach(callback => callback(challenge));

    // Add to completed today
    this.completedToday.add(challenge.id);
  }

  /**
   * Apply challenge reward
   */
  private applyReward(reward: ChallengeReward): void {
    switch (reward.type) {
      case 'xp':
        achievementService.trackProgress({
          type: 'xp_earned',
          value: reward.value as number
        });
        break;
      case 'coins':
        console.log(`💰 Earned ${reward.value} coins`);
        break;
      case 'badge':
      case 'achievement':
      case 'powerup':
      case 'theme':
        console.log(`🎁 Unlocked: ${reward.value}`);
        break;
    }
  }

  /**
   * Check and generate new challenges if needed
   */
  private checkAndGenerateChallenges(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if we need to generate new daily challenges
    if (!this.lastGeneratedDate || this.lastGeneratedDate < today) {
      this.generateDailyChallenges();
      this.lastGeneratedDate = today;
    }

    // Check if we need to generate new weekly challenges
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 1 && this.activeWeekly.length === 0) { // Monday
      this.generateWeeklyChallenges();
    }

    // Clean up expired challenges
    this.cleanupExpiredChallenges();
  }

  /**
   * Clean up expired challenges
   */
  private cleanupExpiredChallenges(): void {
    const now = new Date();

    // Remove expired challenges
    for (const [id, challenge] of this.challenges.entries()) {
      if (challenge.endTime < now && !challenge.completed) {
        challenge.active = false;
        this.challenges.delete(id);
      }
    }

    // Update active lists
    this.activeDaily = this.activeDaily.filter(c => c.active && c.endTime >= now);
    this.activeWeekly = this.activeWeekly.filter(c => c.active && c.endTime >= now);
    this.personalChallenges = this.personalChallenges.filter(c => c.active && c.endTime >= now);
  }

  /**
   * Start challenge timer
   */
  private startChallengeTimer(): void {
    // Check challenges every minute
    setInterval(() => {
      this.checkAndGenerateChallenges();
    }, 60000);
  }

  /**
   * Save challenges to localStorage
   */
  private saveChallenges(): void {
    try {
      const data = {
        challenges: Array.from(this.challenges.values()),
        completedToday: Array.from(this.completedToday),
        lastGeneratedDate: this.lastGeneratedDate
      };

      localStorage.setItem('stealth_challenges', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save challenges:', error);
    }
  }

  /**
   * Load challenges from localStorage
   */
  private loadChallenges(): void {
    try {
      const stored = localStorage.getItem('stealth_challenges');
      if (!stored) return;

      const data = JSON.parse(stored);

      // Restore challenges
      if (data.challenges) {
        data.challenges.forEach((challenge: Challenge) => {
          challenge.startTime = new Date(challenge.startTime);
          challenge.endTime = new Date(challenge.endTime);
          this.challenges.set(challenge.id, challenge);

          // Categorize challenges
          if (challenge.active) {
            if (challenge.type === 'daily') {
              this.activeDaily.push(challenge);
            } else if (challenge.type === 'weekly') {
              this.activeWeekly.push(challenge);
            } else if (challenge.type === 'personal') {
              this.personalChallenges.push(challenge);
            }
          }
        });
      }

      // Restore completed today
      if (data.completedToday) {
        this.completedToday = new Set(data.completedToday);
      }

      // Restore last generated date
      if (data.lastGeneratedDate) {
        this.lastGeneratedDate = new Date(data.lastGeneratedDate);
      }

      console.log('📊 Loaded challenges');
    } catch (error) {
      console.error('Failed to load challenges:', error);
    }
  }

  /**
   * Get active challenges
   */
  public getActiveChallenges(): {
    daily: Challenge[];
    weekly: Challenge[];
    personal: Challenge[];
  } {
    return {
      daily: [...this.activeDaily],
      weekly: [...this.activeWeekly],
      personal: [...this.personalChallenges]
    };
  }

  /**
   * Get challenge by ID
   */
  public getChallenge(id: string): Challenge | undefined {
    return this.challenges.get(id);
  }

  /**
   * Subscribe to challenge completion
   */
  public onChallengeComplete(callback: (challenge: Challenge) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Reset challenges (for testing)
   */
  public resetChallenges(): void {
    this.challenges.clear();
    this.activeDaily = [];
    this.activeWeekly = [];
    this.personalChallenges = [];
    this.completedToday.clear();
    this.lastGeneratedDate = null;
    this.saveChallenges();
  }
}

// Type definitions
export interface ChallengeProgressEvent {
  type: RequirementType;
  subject?: string;
  value?: number;
  responseTime?: number;
}

// Export singleton instance
export const dailyChallenges = DailyChallengesService.getInstance();