/**
 * QuestionService - Intelligent Question Management System
 *
 * This service provides an abstraction layer for question management,
 * preparing for future API-based delivery while working with current static data.
 * Features intelligent caching, lazy loading, and adaptive selection.
 */

import { Question, QuestionBank, allQuestions } from '@/data/expandedQuestions';

// Types for future API compatibility
export interface QuestionFilter {
  subject?: string;
  ageGroup?: '3-5' | '6-8' | '9+';
  difficulty?: number | [number, number]; // Single value or range
  type?: string;
  tags?: string[];
  excludeIds?: string[];
  limit?: number;
}

export interface QuestionPerformance {
  questionId: string;
  timesPresented: number;
  timesCorrect: number;
  averageTime: number;
  lastPresented?: Date;
}

export interface UserQuestionHistory {
  userId: string;
  questionId: string;
  answeredAt: Date;
  wasCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
}

export interface AdaptiveSelectionParams {
  userId: string;
  subject: string;
  currentMastery: number;
  recentPerformance: number; // 0-1 scale
  preferredDifficulty?: number;
  count?: number;
}

class QuestionService {
  // Memory cache for frequently accessed questions
  private cache: Map<string, Question> = new Map();
  private subjectCache: Map<string, Question[]> = new Map();

  // Performance tracking (in-memory for now, will move to database)
  private performanceData: Map<string, QuestionPerformance> = new Map();
  private userHistory: UserQuestionHistory[] = [];

  // Configuration
  private readonly CACHE_SIZE = 500;
  private readonly OPTIMAL_SUCCESS_RATE = 0.7;
  private readonly REVIEW_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    // Initialize with lazy loading preparation
    this.initializeLazyLoading();
  }

  /**
   * Prepare for lazy loading by organizing questions by subject
   * In production, this would be replaced by API calls
   */
  private initializeLazyLoading() {
    // Pre-organize questions by subject for faster access
    const subjects = ['mathematics', 'english', 'science', 'geography', 'arts', 'logic'];

    subjects.forEach(subject => {
      const subjectQuestions = allQuestions.filter(q => q.subject === subject);
      this.subjectCache.set(subject, subjectQuestions);
    });
  }

  /**
   * Get questions with intelligent filtering and caching
   */
  async getQuestions(filter: QuestionFilter): Promise<Question[]> {
    // Simulate async API call (will be real in production)
    return new Promise((resolve) => {
      setTimeout(() => {
        let questions = this.getQuestionsFromCache(filter.subject);

        // Apply filters
        questions = this.applyFilters(questions, filter);

        // Limit results
        if (filter.limit) {
          questions = questions.slice(0, filter.limit);
        }

        // Cache individual questions
        questions.forEach(q => {
          if (this.cache.size < this.CACHE_SIZE) {
            this.cache.set(q.id, q);
          }
        });

        resolve(questions);
      }, 10); // Small delay to simulate network
    });
  }

  /**
   * Get single question by ID with caching
   */
  async getQuestion(id: string): Promise<Question | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    // Find in static data (will be API call in production)
    const question = allQuestions.find(q => q.id === id);

    if (question) {
      // Add to cache
      if (this.cache.size >= this.CACHE_SIZE) {
        // Remove oldest entry (simple FIFO for now)
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(id, question);
    }

    return question || null;
  }

  /**
   * Adaptive question selection based on user performance
   */
  async getAdaptiveQuestions(params: AdaptiveSelectionParams): Promise<Question[]> {
    const {
      userId,
      subject,
      currentMastery,
      recentPerformance,
      preferredDifficulty,
      count = 10
    } = params;

    // Calculate target difficulty based on performance
    const targetDifficulty = this.calculateTargetDifficulty(
      currentMastery,
      recentPerformance,
      preferredDifficulty
    );

    // Get user history for this subject
    const userSubjectHistory = this.userHistory.filter(
      h => h.userId === userId && this.getQuestionSubject(h.questionId) === subject
    );

    // Get questions due for review (spaced repetition)
    const dueForReview = await this.getQuestionsForReview(userId, subject);

    // Mix review and new questions
    const reviewCount = Math.min(Math.floor(count * 0.3), dueForReview.length);
    const newCount = count - reviewCount;

    // Get new questions
    const recentQuestionIds = userSubjectHistory
      .slice(-50)
      .map(h => h.questionId);

    const newQuestions = await this.getQuestions({
      subject,
      difficulty: [Math.max(1, targetDifficulty - 1), Math.min(10, targetDifficulty + 1)],
      excludeIds: recentQuestionIds,
      limit: newCount
    });

    // Combine and shuffle
    const selectedQuestions = [
      ...dueForReview.slice(0, reviewCount),
      ...newQuestions
    ].sort(() => Math.random() - 0.5);

    return selectedQuestions;
  }

  /**
   * Calculate optimal difficulty based on performance
   */
  private calculateTargetDifficulty(
    currentMastery: number,
    recentPerformance: number,
    preferredDifficulty?: number
  ): number {
    let targetDifficulty = currentMastery;

    // Adjust based on recent performance
    if (recentPerformance > 0.85) {
      // Too easy, increase difficulty
      targetDifficulty = Math.min(10, currentMastery + 1);
    } else if (recentPerformance < 0.5) {
      // Too hard, decrease difficulty
      targetDifficulty = Math.max(1, currentMastery - 1);
    } else {
      // In optimal zone, slight increase for growth
      targetDifficulty = Math.min(10, currentMastery + 0.5);
    }

    // Consider user preference if provided
    if (preferredDifficulty) {
      // Blend preference with calculated difficulty
      targetDifficulty = (targetDifficulty + preferredDifficulty) / 2;
    }

    return Math.round(targetDifficulty);
  }

  /**
   * Get questions due for spaced repetition review
   */
  private async getQuestionsForReview(
    userId: string,
    subject: string
  ): Promise<Question[]> {
    const now = Date.now();
    const reviewQuestions: Question[] = [];

    // Find questions that were answered correctly but are due for review
    const correctAnswers = this.userHistory.filter(
      h => h.userId === userId &&
           h.wasCorrect &&
           this.getQuestionSubject(h.questionId) === subject
    );

    for (const answer of correctAnswers) {
      const timeSinceAnswer = now - answer.answeredAt.getTime();

      // Simple spaced repetition: review after 1 day, 3 days, 7 days, 14 days, 30 days
      const reviewIntervals = [1, 3, 7, 14, 30].map(days => days * 24 * 60 * 60 * 1000);
      const timesAnswered = correctAnswers.filter(a => a.questionId === answer.questionId).length;

      if (timesAnswered <= reviewIntervals.length) {
        const nextReviewTime = reviewIntervals[timesAnswered - 1];

        if (timeSinceAnswer >= nextReviewTime) {
          const question = await this.getQuestion(answer.questionId);
          if (question) {
            reviewQuestions.push(question);
          }
        }
      }
    }

    return reviewQuestions;
  }

  /**
   * Record user's answer for analytics and adaptation
   */
  async recordAnswer(
    userId: string,
    questionId: string,
    wasCorrect: boolean,
    timeSpent: number,
    hintsUsed: number = 0
  ): Promise<void> {
    // Add to history
    this.userHistory.push({
      userId,
      questionId,
      answeredAt: new Date(),
      wasCorrect,
      timeSpent,
      hintsUsed
    });

    // Update performance data
    const perfKey = questionId;
    const existing = this.performanceData.get(perfKey) || {
      questionId,
      timesPresented: 0,
      timesCorrect: 0,
      averageTime: 0
    };

    existing.timesPresented++;
    if (wasCorrect) existing.timesCorrect++;
    existing.averageTime = (existing.averageTime * (existing.timesPresented - 1) + timeSpent) / existing.timesPresented;
    existing.lastPresented = new Date();

    this.performanceData.set(perfKey, existing);

    // In production, this would also send to API
    // await this.api.recordAnswer({ userId, questionId, wasCorrect, timeSpent, hintsUsed });
  }

  /**
   * Get performance statistics for a question
   */
  getQuestionPerformance(questionId: string): QuestionPerformance | null {
    return this.performanceData.get(questionId) || null;
  }

  /**
   * Get user's performance for a subject
   */
  getUserSubjectPerformance(userId: string, subject: string): {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageTime: number;
    streak: number;
  } {
    const subjectHistory = this.userHistory.filter(
      h => h.userId === userId && this.getQuestionSubject(h.questionId) === subject
    );

    if (subjectHistory.length === 0) {
      return {
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageTime: 0,
        streak: 0
      };
    }

    const correctAnswers = subjectHistory.filter(h => h.wasCorrect).length;
    const totalTime = subjectHistory.reduce((sum, h) => sum + h.timeSpent, 0);

    // Calculate current streak
    let streak = 0;
    for (let i = subjectHistory.length - 1; i >= 0; i--) {
      if (subjectHistory[i].wasCorrect) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalQuestions: subjectHistory.length,
      correctAnswers,
      accuracy: correctAnswers / subjectHistory.length,
      averageTime: totalTime / subjectHistory.length,
      streak
    };
  }

  /**
   * Prefetch questions for better performance
   */
  async prefetchQuestions(
    userId: string,
    subject: string,
    mastery: number
  ): Promise<void> {
    // Prefetch likely next questions in background
    const likelyDifficulties = [
      Math.max(1, mastery - 1),
      mastery,
      Math.min(10, mastery + 1)
    ];

    for (const difficulty of likelyDifficulties) {
      // Don't await, let it run in background
      this.getQuestions({
        subject,
        difficulty,
        limit: 10
      }).catch(console.error);
    }
  }

  /**
   * Clear cache (useful for memory management)
   */
  clearCache(): void {
    this.cache.clear();
    // Keep subject cache as it's organized once
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    cacheSize: number;
    hitRate: number;
    memoryUsage: number;
  } {
    // Rough estimate of memory usage
    const avgQuestionSize = 500; // bytes
    const memoryUsage = this.cache.size * avgQuestionSize;

    return {
      cacheSize: this.cache.size,
      hitRate: 0.75, // Placeholder - would track in production
      memoryUsage
    };
  }

  // Helper methods
  private getQuestionsFromCache(subject?: string): Question[] {
    if (!subject) return allQuestions;
    return this.subjectCache.get(subject) || [];
  }

  private applyFilters(questions: Question[], filter: QuestionFilter): Question[] {
    let filtered = [...questions];

    if (filter.ageGroup) {
      filtered = filtered.filter(q => q.ageGroup === filter.ageGroup);
    }

    if (filter.difficulty) {
      if (Array.isArray(filter.difficulty)) {
        const [min, max] = filter.difficulty;
        filtered = filtered.filter(q => q.difficulty >= min && q.difficulty <= max);
      } else {
        filtered = filtered.filter(q => q.difficulty === filter.difficulty);
      }
    }

    if (filter.type) {
      filtered = filtered.filter(q => q.type === filter.type);
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(q =>
        filter.tags!.some(tag => q.tags.includes(tag))
      );
    }

    if (filter.excludeIds && filter.excludeIds.length > 0) {
      filtered = filtered.filter(q => !filter.excludeIds!.includes(q.id));
    }

    return filtered;
  }

  private getQuestionSubject(questionId: string): string {
    const question = this.cache.get(questionId) ||
                    allQuestions.find(q => q.id === questionId);
    return question?.subject || '';
  }
}

// Export singleton instance
export const questionService = new QuestionService();

// Export for testing
export default QuestionService;