import { z } from 'zod';

// Analytics event types
export const AnalyticsEventType = z.enum([
  'session_start',
  'session_end',
  'game_start',
  'game_complete',
  'question_attempt',
  'question_correct',
  'question_incorrect',
  'hint_used',
  'level_up',
  'achievement_earned',
  'error_occurred',
  'performance_issue',
  'engagement_low',
  'streak_broken',
  'streak_achieved',
  'difficulty_adjusted',
  'content_skipped',
  'help_requested',
  'navigation_event',
  'feature_used',
]);

export type AnalyticsEventType = z.infer<typeof AnalyticsEventType>;

// Learning patterns
export const LearningPattern = z.enum([
  'fast_learner',
  'steady_progress',
  'needs_repetition',
  'struggles_with_concept',
  'easily_distracted',
  'highly_engaged',
  'prefers_visual',
  'prefers_audio',
  'prefers_kinesthetic',
  'works_better_morning',
  'works_better_afternoon',
  'works_better_evening',
]);

export type LearningPattern = z.infer<typeof LearningPattern>;

// Error pattern types
export const ErrorPattern = z.enum([
  'calculation_error',
  'reading_comprehension',
  'attention_to_detail',
  'pattern_recognition',
  'logical_reasoning',
  'memory_recall',
  'following_instructions',
  'time_management',
  'impulse_control',
  'conceptual_understanding',
]);

export type ErrorPattern = z.infer<typeof ErrorPattern>;

// Analytics event schema
export const AnalyticsEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  timestamp: z.number(),
  type: AnalyticsEventType,
  data: z.record(z.any()),
  metadata: z.object({
    ageGroup: z.enum(['3-5', '6-8', '9+']),
    subject: z.enum(['mathematics', 'english', 'science']).optional(),
    gameId: z.string().optional(),
    questionId: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional(),
    browserInfo: z.string().optional(),
    location: z.string().optional(),
  }),
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

// Learning session schema
export const LearningSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  startTime: z.number(),
  endTime: z.number().optional(),
  duration: z.number().optional(),
  subject: z.enum(['mathematics', 'english', 'science']),
  ageGroup: z.enum(['3-5', '6-8', '9+']),
  gamesPlayed: z.array(z.string()),
  questionsAttempted: z.number(),
  correctAnswers: z.number(),
  incorrectAnswers: z.number(),
  hintsUsed: z.number(),
  achievements: z.array(z.string()),
  xpEarned: z.number(),
  averageResponseTime: z.number(),
  engagementScore: z.number().min(0).max(100),
  difficultyProgression: z.array(z.enum(['easy', 'medium', 'hard'])),
  errorPatterns: z.array(ErrorPattern),
  learningPatterns: z.array(LearningPattern),
});

export type LearningSession = z.infer<typeof LearningSessionSchema>;

// Performance metrics schema
export const PerformanceMetricsSchema = z.object({
  userId: z.string(),
  timeframe: z.enum(['daily', 'weekly', 'monthly', 'all_time']),
  subject: z.enum(['mathematics', 'english', 'science']).optional(),
  metrics: z.object({
    totalSessions: z.number(),
    totalPlayTime: z.number(),
    averageSessionDuration: z.number(),
    questionsAttempted: z.number(),
    correctAnswers: z.number(),
    accuracy: z.number().min(0).max(100),
    averageResponseTime: z.number(),
    hintsUsed: z.number(),
    achievementsEarned: z.number(),
    xpEarned: z.number(),
    currentStreak: z.number(),
    longestStreak: z.number(),
    engagementScore: z.number().min(0).max(100),
    progressRate: z.number(),
    difficultyDistribution: z.record(z.number()),
    preferredPlayTime: z.string(),
    strongSubjects: z.array(z.string()),
    improvementAreas: z.array(z.string()),
  }),
  trends: z.object({
    accuracyTrend: z.enum(['improving', 'stable', 'declining']),
    engagementTrend: z.enum(['increasing', 'stable', 'decreasing']),
    speedTrend: z.enum(['faster', 'stable', 'slower']),
    difficultyTrend: z.enum(['advancing', 'stable', 'struggling']),
  }),
  predictions: z.object({
    nextLevelTime: z.number().optional(),
    masteryProbability: z.record(z.number()),
    recommendedFocus: z.array(z.string()),
    riskFactors: z.array(z.string()),
  }),
});

export type PerformanceMetrics = z.infer<typeof PerformanceMetricsSchema>;

// Learning analytics engine
export class LearningAnalyticsEngine {
  private events: AnalyticsEvent[] = [];
  private sessions: LearningSession[] = [];
  private eventQueue: AnalyticsEvent[] = [];
  private isProcessing = false;

  constructor() {
    this.initializeAnalytics();
  }

  private initializeAnalytics() {
    // Load existing data from storage
    this.loadFromStorage();

    // Start processing queue
    this.startEventProcessing();

    // Setup error tracking
    this.setupErrorTracking();
  }

  // Event tracking methods
  trackEvent(type: AnalyticsEventType, data: any, metadata: any): void {
    const event: AnalyticsEvent = {
      id: this.generateId(),
      userId: metadata.userId || 'anonymous',
      sessionId: metadata.sessionId || this.getCurrentSessionId(),
      timestamp: Date.now(),
      type,
      data,
      metadata: {
        ageGroup: metadata.ageGroup || '6-8',
        subject: metadata.subject,
        gameId: metadata.gameId,
        questionId: metadata.questionId,
        difficulty: metadata.difficulty,
        deviceType: this.getDeviceType(),
        browserInfo: this.getBrowserInfo(),
        location: window.location.pathname,
      },
    };

    this.eventQueue.push(event);
    this.processEventQueue();
  }

  trackSessionStart(userId: string, ageGroup: '3-5' | '6-8' | '9+', subject: string): string {
    const sessionId = this.generateId();

    this.trackEvent('session_start', {
      userId,
      ageGroup,
      subject,
    }, {
      userId,
      ageGroup,
      subject,
      sessionId,
    });

    return sessionId;
  }

  trackQuestionAttempt(
    questionId: string,
    answer: any,
    isCorrect: boolean,
    timeSpent: number,
    hintsUsed: number,
    metadata: any
  ): void {
    const eventType = isCorrect ? 'question_correct' : 'question_incorrect';

    this.trackEvent(eventType, {
      questionId,
      answer,
      isCorrect,
      timeSpent,
      hintsUsed,
      responseSpeed: this.categorizeResponseSpeed(timeSpent),
    }, metadata);

    // Track specific error patterns if incorrect
    if (!isCorrect) {
      this.analyzeErrorPattern(questionId, answer, metadata);
    }
  }

  trackGameComplete(gameId: string, results: any, metadata: any): void {
    this.trackEvent('game_complete', {
      gameId,
      score: results.score,
      accuracy: results.accuracy,
      totalTime: results.totalTime,
      questionsAttempted: results.questionsAttempted,
      hintsUsed: results.hintsUsed,
      achievements: results.achievements || [],
    }, metadata);

    // Analyze learning patterns
    this.analyzeLearningPatterns(gameId, results, metadata);
  }

  // Error pattern analysis
  private analyzeErrorPattern(questionId: string, answer: any, metadata: any): void {
    const errorPatterns: ErrorPattern[] = [];

    // Analyze based on question type and answer
    const questionType = metadata.questionType;

    switch (questionType) {
      case 'calculation':
        if (this.isCalculationError(answer, metadata.correctAnswer)) {
          errorPatterns.push('calculation_error');
        }
        break;

      case 'reading':
        if (this.isComprehensionError(answer, metadata.correctAnswer)) {
          errorPatterns.push('reading_comprehension');
        }
        break;

      case 'pattern':
        if (this.isPatternError(answer, metadata.correctAnswer)) {
          errorPatterns.push('pattern_recognition');
        }
        break;
    }

    // Track response time patterns
    if (metadata.timeSpent < 2000) {
      errorPatterns.push('impulse_control');
    } else if (metadata.timeSpent > 30000) {
      errorPatterns.push('attention_to_detail');
    }

    this.trackEvent('error_occurred', {
      questionId,
      errorPatterns,
      answer,
      timeSpent: metadata.timeSpent,
    }, metadata);
  }

  // Learning pattern analysis
  private analyzeLearningPatterns(gameId: string, results: any, metadata: any): void {
    const patterns: LearningPattern[] = [];

    // Analyze performance patterns
    if (results.accuracy > 90) {
      patterns.push('fast_learner');
    } else if (results.accuracy > 70) {
      patterns.push('steady_progress');
    } else if (results.accuracy < 50) {
      patterns.push('needs_repetition');
    }

    // Analyze engagement patterns
    const averageTime = results.totalTime / results.questionsAttempted;
    if (averageTime < 5000 && results.accuracy > 80) {
      patterns.push('highly_engaged');
    } else if (averageTime > 20000) {
      patterns.push('easily_distracted');
    }

    // Analyze time of day patterns
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      patterns.push('works_better_morning');
    } else if (hour >= 12 && hour < 18) {
      patterns.push('works_better_afternoon');
    } else {
      patterns.push('works_better_evening');
    }

    this.trackEvent('performance_issue', {
      gameId,
      patterns,
      results,
    }, metadata);
  }

  // Performance metrics calculation
  async calculatePerformanceMetrics(
    userId: string,
    timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time',
    subject?: 'mathematics' | 'english' | 'science'
  ): Promise<PerformanceMetrics> {
    const userEvents = this.getEventsForUser(userId, timeframe, subject);
    const userSessions = this.getSessionsForUser(userId, timeframe, subject);

    const metrics = {
      totalSessions: userSessions.length,
      totalPlayTime: userSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      averageSessionDuration: this.calculateAverageSessionDuration(userSessions),
      questionsAttempted: userSessions.reduce((sum, s) => sum + s.questionsAttempted, 0),
      correctAnswers: userSessions.reduce((sum, s) => sum + s.correctAnswers, 0),
      accuracy: this.calculateAccuracy(userSessions),
      averageResponseTime: this.calculateAverageResponseTime(userEvents),
      hintsUsed: userSessions.reduce((sum, s) => sum + s.hintsUsed, 0),
      achievementsEarned: this.countUniqueAchievements(userSessions),
      xpEarned: userSessions.reduce((sum, s) => sum + s.xpEarned, 0),
      currentStreak: this.calculateCurrentStreak(userId),
      longestStreak: this.calculateLongestStreak(userId),
      engagementScore: this.calculateEngagementScore(userEvents, userSessions),
      progressRate: this.calculateProgressRate(userSessions),
      difficultyDistribution: this.calculateDifficultyDistribution(userSessions),
      preferredPlayTime: this.calculatePreferredPlayTime(userEvents),
      strongSubjects: this.identifyStrongSubjects(userSessions),
      improvementAreas: this.identifyImprovementAreas(userSessions, userEvents),
    };

    const trends = this.calculateTrends(userId, timeframe);
    const predictions = this.generatePredictions(userId, metrics, trends);

    return {
      userId,
      timeframe,
      subject,
      metrics,
      trends,
      predictions,
    };
  }

  // Trend analysis
  private calculateTrends(userId: string, timeframe: string) {
    const recentSessions = this.getRecentSessions(userId, timeframe);
    const olderSessions = this.getOlderSessions(userId, timeframe);

    return {
      accuracyTrend: this.compareTrend(
        this.calculateAccuracy(recentSessions),
        this.calculateAccuracy(olderSessions)
      ),
      engagementTrend: this.compareEngagementTrend(
        this.calculateAverageEngagement(recentSessions),
        this.calculateAverageEngagement(olderSessions)
      ),
      speedTrend: this.compareSpeedTrend(
        this.calculateAverageSpeed(recentSessions),
        this.calculateAverageSpeed(olderSessions)
      ),
      difficultyTrend: this.compareDifficultyTrend(recentSessions, olderSessions),
    };
  }

  // Predictive analytics
  private generatePredictions(userId: string, metrics: any, trends: any) {
    return {
      nextLevelTime: this.predictNextLevelTime(userId, metrics, trends),
      masteryProbability: this.calculateMasteryProbability(userId, metrics),
      recommendedFocus: this.generateRecommendations(userId, metrics, trends),
      riskFactors: this.identifyRiskFactors(userId, metrics, trends),
    };
  }

  // Data processing and storage
  private async processEventQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return;

    this.isProcessing = true;
    let batch: any[] = [];

    try {
      batch = this.eventQueue.splice(0, 50); // Process in batches

      // Add to main events array
      this.events.push(...batch);

      // Update sessions based on events
      this.updateSessionsFromEvents(batch);

      // Save to storage
      await this.saveToStorage();

      // Send to server if online
      if (navigator.onLine) {
        await this.syncWithServer(batch);
      }

    } catch (error) {
      console.error('Error processing analytics events:', error);
      // Re-queue failed events
      if (batch.length > 0) {
        this.eventQueue.unshift(...batch);
      }
    } finally {
      this.isProcessing = false;
    }

    // Process remaining events
    if (this.eventQueue.length > 0) {
      setTimeout(() => this.processEventQueue(), 1000);
    }
  }

  private startEventProcessing(): void {
    setInterval(() => {
      this.processEventQueue();
    }, 5000); // Process every 5 seconds
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentSessionId(): string {
    // Get or create current session ID
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getBrowserInfo(): string {
    return navigator.userAgent;
  }

  private categorizeResponseSpeed(timeMs: number): string {
    if (timeMs < 2000) return 'very_fast';
    if (timeMs < 5000) return 'fast';
    if (timeMs < 10000) return 'normal';
    if (timeMs < 20000) return 'slow';
    return 'very_slow';
  }

  // Error detection helpers
  private isCalculationError(answer: any, correct: any): boolean {
    // Check if it's a mathematical calculation error
    if (typeof answer === 'number' && typeof correct === 'number') {
      const diff = Math.abs(answer - correct);
      return diff > 0 && diff <= 10; // Close but wrong
    }
    return false;
  }

  private isComprehensionError(answer: any, correct: any): boolean {
    // Check for reading comprehension issues
    if (typeof answer === 'string' && typeof correct === 'string') {
      return answer.toLowerCase() !== correct.toLowerCase();
    }
    return false;
  }

  private isPatternError(answer: any, correct: any): boolean {
    // Check for pattern recognition issues
    return answer !== correct;
  }

  // Storage methods
  private async loadFromStorage(): Promise<void> {
    try {
      const eventsData = localStorage.getItem('learning_analytics_events');
      const sessionsData = localStorage.getItem('learning_analytics_sessions');

      if (eventsData) {
        this.events = JSON.parse(eventsData);
      }

      if (sessionsData) {
        this.sessions = JSON.parse(sessionsData);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      localStorage.setItem('learning_analytics_events', JSON.stringify(this.events));
      localStorage.setItem('learning_analytics_sessions', JSON.stringify(this.sessions));
    } catch (error) {
      console.error('Error saving analytics data:', error);
    }
  }

  private async syncWithServer(events: AnalyticsEvent[]): Promise<void> {
    try {
      // Send to analytics server
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(events),
      });
    } catch (error) {
      console.error('Error syncing with server:', error);
    }
  }

  // Helper calculation methods
  private getEventsForUser(userId: string, timeframe: string, subject?: string): AnalyticsEvent[] {
    const now = Date.now();
    const timeframeDuration = this.getTimeframeDuration(timeframe);
    const cutoff = now - timeframeDuration;

    return this.events.filter(event =>
      event.userId === userId &&
      event.timestamp >= cutoff &&
      (!subject || event.metadata.subject === subject)
    );
  }

  private getSessionsForUser(userId: string, timeframe: string, subject?: string): LearningSession[] {
    const now = Date.now();
    const timeframeDuration = this.getTimeframeDuration(timeframe);
    const cutoff = now - timeframeDuration;

    return this.sessions.filter(session =>
      session.userId === userId &&
      session.startTime >= cutoff &&
      (!subject || session.subject === subject)
    );
  }

  private getTimeframeDuration(timeframe: string): number {
    switch (timeframe) {
      case 'daily': return 24 * 60 * 60 * 1000;
      case 'weekly': return 7 * 24 * 60 * 60 * 1000;
      case 'monthly': return 30 * 24 * 60 * 60 * 1000;
      default: return Infinity;
    }
  }

  private calculateAccuracy(sessions: LearningSession[]): number {
    const total = sessions.reduce((sum, s) => sum + s.questionsAttempted, 0);
    const correct = sessions.reduce((sum, s) => sum + s.correctAnswers, 0);
    return total > 0 ? (correct / total) * 100 : 0;
  }

  private calculateAverageSessionDuration(sessions: LearningSession[]): number {
    const durations = sessions.filter(s => s.duration).map(s => s.duration!);
    return durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;
  }

  private calculateAverageResponseTime(events: AnalyticsEvent[]): number {
    const attempts = events.filter(e => e.type === 'question_attempt' && e.data.timeSpent);
    const times = attempts.map(e => e.data.timeSpent);
    return times.length > 0 ? times.reduce((sum, t) => sum + t, 0) / times.length : 0;
  }

  private calculateEngagementScore(events: AnalyticsEvent[], sessions: LearningSession[]): number {
    // Complex engagement calculation based on multiple factors
    let score = 50; // Base score

    // Factor in session duration
    const avgDuration = this.calculateAverageSessionDuration(sessions);
    if (avgDuration > 15 * 60 * 1000) score += 20; // 15+ minutes
    else if (avgDuration > 10 * 60 * 1000) score += 10; // 10+ minutes

    // Factor in accuracy
    const accuracy = this.calculateAccuracy(sessions);
    score += Math.min(30, accuracy * 0.3);

    // Factor in streak
    const currentStreak = this.calculateCurrentStreak(sessions[0]?.userId || '');
    score += Math.min(20, currentStreak * 2);

    return Math.min(100, Math.max(0, score));
  }

  private calculateCurrentStreak(userId: string): number {
    // Implementation for calculating current streak
    return 0; // Placeholder
  }

  private calculateLongestStreak(userId: string): number {
    // Implementation for calculating longest streak
    return 0; // Placeholder
  }

  private calculateProgressRate(sessions: LearningSession[]): number {
    // Implementation for calculating progress rate
    return 0; // Placeholder
  }

  private calculateDifficultyDistribution(sessions: LearningSession[]): Record<string, number> {
    // Implementation for calculating difficulty distribution
    return {}; // Placeholder
  }

  private calculatePreferredPlayTime(events: AnalyticsEvent[]): string {
    // Implementation for calculating preferred play time
    return 'afternoon'; // Placeholder
  }

  private identifyStrongSubjects(sessions: LearningSession[]): string[] {
    // Implementation for identifying strong subjects
    return []; // Placeholder
  }

  private identifyImprovementAreas(sessions: LearningSession[], events: AnalyticsEvent[]): string[] {
    // Implementation for identifying improvement areas
    return []; // Placeholder
  }

  private updateSessionsFromEvents(events: AnalyticsEvent[]): void {
    // Implementation for updating sessions from events
  }

  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackEvent('error_occurred', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      }, {});
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('error_occurred', {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
      }, {});
    });
  }

  // Additional helper methods for trend calculation
  private getRecentSessions(userId: string, timeframe: string): LearningSession[] {
    // Get more recent half of sessions
    const sessions = this.getSessionsForUser(userId, timeframe);
    const midpoint = Math.floor(sessions.length / 2);
    return sessions.slice(midpoint);
  }

  private getOlderSessions(userId: string, timeframe: string): LearningSession[] {
    // Get older half of sessions
    const sessions = this.getSessionsForUser(userId, timeframe);
    const midpoint = Math.floor(sessions.length / 2);
    return sessions.slice(0, midpoint);
  }

  private compareTrend(recent: number, older: number): 'improving' | 'stable' | 'declining' {
    const threshold = 5; // 5% threshold
    const diff = recent - older;
    const percentChange = older > 0 ? (diff / older) * 100 : 0;

    if (percentChange > threshold) return 'improving';
    if (percentChange < -threshold) return 'declining';
    return 'stable';
  }

  private compareEngagementTrend(recent: number, older: number): 'increasing' | 'stable' | 'decreasing' {
    const threshold = 5; // 5% threshold
    const diff = recent - older;
    const percentChange = older > 0 ? (diff / older) * 100 : 0;

    if (percentChange > threshold) return 'increasing';
    if (percentChange < -threshold) return 'decreasing';
    return 'stable';
  }

  private compareSpeedTrend(recent: number, older: number): 'faster' | 'stable' | 'slower' {
    const threshold = 1000; // 1 second threshold
    const diff = recent - older;

    if (diff < -threshold) return 'faster';
    if (diff > threshold) return 'slower';
    return 'stable';
  }

  private compareDifficultyTrend(recent: LearningSession[], older: LearningSession[]): 'advancing' | 'stable' | 'struggling' {
    // Implementation for comparing difficulty trends
    return 'stable'; // Placeholder
  }

  private calculateAverageEngagement(sessions: LearningSession[]): number {
    const scores = sessions.map(s => s.engagementScore);
    return scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
  }

  private calculateAverageSpeed(sessions: LearningSession[]): number {
    const speeds = sessions.map(s => s.averageResponseTime);
    return speeds.length > 0 ? speeds.reduce((sum, s) => sum + s, 0) / speeds.length : 0;
  }

  private countUniqueAchievements(sessions: LearningSession[]): number {
    const allAchievements = sessions.flatMap(s => s.achievements);
    return new Set(allAchievements).size;
  }

  private predictNextLevelTime(userId: string, metrics: any, trends: any): number | undefined {
    // Implementation for predicting next level time
    return undefined; // Placeholder
  }

  private calculateMasteryProbability(userId: string, metrics: any): Record<string, number> {
    // Implementation for calculating mastery probability
    return {}; // Placeholder
  }

  private generateRecommendations(userId: string, metrics: any, trends: any): string[] {
    // Implementation for generating recommendations
    return []; // Placeholder
  }

  private identifyRiskFactors(userId: string, metrics: any, trends: any): string[] {
    // Implementation for identifying risk factors
    return []; // Placeholder
  }
}

export default LearningAnalyticsEngine;