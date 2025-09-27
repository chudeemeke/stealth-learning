/**
 * AAA+ Real-time Analytics Service
 * Comprehensive analytics tracking for learning patterns and user behavior
 * Privacy-first design with COPPA compliance
 */

interface AnalyticsEvent {
  id: string;
  type: EventType;
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

type EventType =
  | 'page_view'
  | 'game_start'
  | 'game_complete'
  | 'question_answered'
  | 'achievement_unlocked'
  | 'streak_milestone'
  | 'learning_progress'
  | 'error'
  | 'performance'
  | 'interaction';

type EventCategory =
  | 'navigation'
  | 'gameplay'
  | 'learning'
  | 'achievement'
  | 'social'
  | 'system'
  | 'performance';

export interface LearningMetrics {
  subject: string;
  accuracy: number;
  speed: number;
  difficulty: number;
  engagement: number;
  retention: number;
  mastery: number;
  streakLength: number;
  totalQuestions: number;
  correctAnswers: number;
  avgResponseTime: number;
  improvementRate: number;
}

export interface SessionMetrics {
  sessionId: string;
  startTime: number;
  duration: number;
  pageViews: number;
  interactions: number;
  gamesPlayed: number;
  questionsAnswered: number;
  accuracyRate: number;
  engagementScore: number;
  completionRate: number;
}

export interface SubjectProgress {
  subject: string;
  level: number;
  xp: number;
  totalTime: number;
  questionsAnswered: number;
  accuracy: number;
  lastPlayed: Date;
  achievements: string[];
  strengths: string[];
  weaknesses: string[];
  recommendedFocus: string[];
}

interface EngagementMetrics {
  dailyActiveTime: number;
  weeklyActiveTime: number;
  monthlyActiveTime: number;
  sessionFrequency: number;
  avgSessionDuration: number;
  favoriteSubjects: string[];
  favoriteGameModes: string[];
  peakPlayTimes: { hour: number; count: number }[];
  consistency: number;
  retention30Day: number;
}

interface AdaptiveLearningInsights {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  pacePreference: 'fast' | 'moderate' | 'slow';
  challengePreference: 'easy' | 'balanced' | 'challenging';
  optimalSessionLength: number;
  bestTimeToLearn: { start: number; end: number };
  motivators: string[];
  frustrationPoints: string[];
  masteredConcepts: string[];
  strugglingConcepts: string[];
  recommendedPath: string[];
}

export class RealTimeAnalyticsService {
  private static instance: RealTimeAnalyticsService;
  private events: AnalyticsEvent[] = [];
  private sessionMetrics: SessionMetrics;
  private learningMetrics: Map<string, LearningMetrics> = new Map();
  private subjectProgress: Map<string, SubjectProgress> = new Map();
  private engagementMetrics: EngagementMetrics;
  private insights: AdaptiveLearningInsights;
  private sessionId: string;
  private userId: string | null = null;
  private isTracking: boolean = false;
  private eventBuffer: AnalyticsEvent[] = [];
  private flushInterval: number | null = null;
  private privacyMode: boolean = true; // COPPA compliance

  private readonly MAX_EVENTS = 1000;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionMetrics = this.initializeSessionMetrics();
    this.engagementMetrics = this.initializeEngagementMetrics();
    this.insights = this.initializeInsights();
    this.setupEventListeners();
    this.startSession();
  }

  public static getInstance(): RealTimeAnalyticsService {
    if (!RealTimeAnalyticsService.instance) {
      RealTimeAnalyticsService.instance = new RealTimeAnalyticsService();
    }
    return RealTimeAnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSessionMetrics(): SessionMetrics {
    return {
      sessionId: this.sessionId,
      startTime: Date.now(),
      duration: 0,
      pageViews: 0,
      interactions: 0,
      gamesPlayed: 0,
      questionsAnswered: 0,
      accuracyRate: 0,
      engagementScore: 0,
      completionRate: 0
    };
  }

  private initializeEngagementMetrics(): EngagementMetrics {
    return {
      dailyActiveTime: 0,
      weeklyActiveTime: 0,
      monthlyActiveTime: 0,
      sessionFrequency: 0,
      avgSessionDuration: 0,
      favoriteSubjects: [],
      favoriteGameModes: [],
      peakPlayTimes: [],
      consistency: 0,
      retention30Day: 0
    };
  }

  private initializeInsights(): AdaptiveLearningInsights {
    return {
      learningStyle: 'mixed',
      pacePreference: 'moderate',
      challengePreference: 'balanced',
      optimalSessionLength: 20,
      bestTimeToLearn: { start: 15, end: 17 },
      motivators: [],
      frustrationPoints: [],
      masteredConcepts: [],
      strugglingConcepts: [],
      recommendedPath: []
    };
  }

  /**
   * Start analytics session
   */
  public startSession(userId?: string): void {
    console.log('📊 Starting Real-time Analytics Session');
    this.isTracking = true;

    if (userId) {
      this.userId = this.anonymizeUserId(userId);
    }

    // Start flush interval
    this.flushInterval = window.setInterval(() => {
      this.flushEvents();
    }, this.FLUSH_INTERVAL);

    // Track session start
    this.track('page_view', 'navigation', 'session_start');

    // Load previous metrics if available
    this.loadStoredMetrics();
  }

  /**
   * Stop analytics session
   */
  public stopSession(): void {
    console.log('📊 Stopping Analytics Session');
    this.isTracking = false;

    // Calculate final session metrics
    this.sessionMetrics.duration = Date.now() - this.sessionMetrics.startTime;

    // Save metrics
    this.saveMetrics();

    // Flush remaining events
    this.flushEvents();

    // Clear interval
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_view', 'navigation', 'page_hidden');
      } else {
        this.track('page_view', 'navigation', 'page_visible');
      }
    });

    // Error tracking
    window.addEventListener('error', (event) => {
      this.trackError(event.error);
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason);
    });

    // Performance optimization events
    window.addEventListener('performance-optimization', (event: any) => {
      this.track('performance', 'system', event.detail.type, undefined, undefined, event.detail.data);
    });
  }

  /**
   * Track event
   */
  public track(
    type: EventType,
    category: EventCategory,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.isTracking) return;

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      metadata: this.sanitizeMetadata(metadata)
    };

    // Add to buffer
    this.eventBuffer.push(event);

    // Process immediately for real-time metrics
    this.processEvent(event);

    // Flush if buffer is full
    if (this.eventBuffer.length >= 50) {
      this.flushEvents();
    }

    // Update session metrics
    this.updateSessionMetrics(event);
  }

  /**
   * Track learning event
   */
  public trackLearning(
    subject: string,
    questionId: string,
    isCorrect: boolean,
    responseTime: number,
    difficulty: number,
    metadata?: Record<string, any>
  ): void {
    // Track the event
    this.track(
      'question_answered',
      'learning',
      isCorrect ? 'correct' : 'incorrect',
      subject,
      responseTime,
      { questionId, difficulty, ...metadata }
    );

    // Update learning metrics
    this.updateLearningMetrics(subject, isCorrect, responseTime, difficulty);

    // Update adaptive insights
    this.updateAdaptiveInsights(subject, isCorrect, responseTime, difficulty);

    // Check for achievements
    this.checkAchievements(subject, isCorrect);
  }

  /**
   * Track game event
   */
  public trackGame(
    action: 'start' | 'complete' | 'quit' | 'pause' | 'resume',
    subject: string,
    score?: number,
    duration?: number,
    metadata?: Record<string, any>
  ): void {
    this.track(
      action === 'start' ? 'game_start' : 'game_complete',
      'gameplay',
      action,
      subject,
      score,
      { duration, ...metadata }
    );

    if (action === 'start') {
      this.sessionMetrics.gamesPlayed++;
    }

    if (action === 'complete' && score !== undefined) {
      this.updateSubjectProgress(subject, score, duration || 0);
    }
  }

  /**
   * Track interaction
   */
  public trackInteraction(
    element: string,
    action: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    this.track(
      'interaction',
      'navigation',
      action,
      element,
      value,
      metadata
    );

    this.sessionMetrics.interactions++;
  }

  /**
   * Track error
   */
  public trackError(error: any): void {
    if (!this.isTracking) return;

    this.track(
      'error',
      'system',
      'error_occurred',
      error?.message || 'Unknown error',
      undefined,
      {
        stack: error?.stack,
        type: error?.name,
        url: window.location.href
      }
    );
  }

  /**
   * Process event for real-time metrics
   */
  private processEvent(event: AnalyticsEvent): void {
    // Add to events history
    this.events.push(event);

    // Maintain max events limit
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Process based on event type
    switch (event.type) {
      case 'page_view':
        this.sessionMetrics.pageViews++;
        break;
      case 'question_answered':
        this.sessionMetrics.questionsAnswered++;
        break;
      case 'achievement_unlocked':
        this.updateEngagementScore(10);
        break;
      case 'streak_milestone':
        this.updateEngagementScore(5);
        break;
    }
  }

  /**
   * Update session metrics
   */
  private updateSessionMetrics(event: AnalyticsEvent): void {
    // Update duration
    this.sessionMetrics.duration = Date.now() - this.sessionMetrics.startTime;

    // Update engagement score
    this.sessionMetrics.engagementScore = this.calculateEngagementScore();

    // Update accuracy rate
    if (event.type === 'question_answered') {
      const correct = this.events.filter(e =>
        e.type === 'question_answered' && e.action === 'correct'
      ).length;
      const total = this.events.filter(e => e.type === 'question_answered').length;
      this.sessionMetrics.accuracyRate = total > 0 ? (correct / total) * 100 : 0;
    }
  }

  /**
   * Update learning metrics
   */
  private updateLearningMetrics(
    subject: string,
    isCorrect: boolean,
    responseTime: number,
    difficulty: number
  ): void {
    let metrics = this.learningMetrics.get(subject);

    if (!metrics) {
      metrics = {
        subject,
        accuracy: 0,
        speed: 0,
        difficulty: difficulty,
        engagement: 0,
        retention: 0,
        mastery: 0,
        streakLength: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        avgResponseTime: 0,
        improvementRate: 0
      };
      this.learningMetrics.set(subject, metrics);
    }

    // Update metrics
    metrics.totalQuestions++;
    if (isCorrect) {
      metrics.correctAnswers++;
      metrics.streakLength++;
    } else {
      metrics.streakLength = 0;
    }

    // Calculate accuracy
    metrics.accuracy = (metrics.correctAnswers / metrics.totalQuestions) * 100;

    // Update average response time
    metrics.avgResponseTime = (
      (metrics.avgResponseTime * (metrics.totalQuestions - 1) + responseTime) /
      metrics.totalQuestions
    );

    // Update speed score (inverse of response time)
    metrics.speed = Math.max(0, 100 - (metrics.avgResponseTime / 100));

    // Update difficulty
    metrics.difficulty = (metrics.difficulty + difficulty) / 2;

    // Calculate engagement based on streak and consistency
    metrics.engagement = Math.min(100,
      (metrics.streakLength * 10) +
      (metrics.accuracy > 70 ? 20 : 0) +
      (metrics.totalQuestions > 10 ? 20 : metrics.totalQuestions * 2)
    );

    // Estimate mastery
    metrics.mastery = this.calculateMastery(metrics);

    // Calculate improvement rate
    metrics.improvementRate = this.calculateImprovementRate(subject);
  }

  /**
   * Update subject progress
   */
  private updateSubjectProgress(subject: string, score: number, duration: number): void {
    let progress = this.subjectProgress.get(subject);

    if (!progress) {
      progress = {
        subject,
        level: 1,
        xp: 0,
        totalTime: 0,
        questionsAnswered: 0,
        accuracy: 0,
        lastPlayed: new Date(),
        achievements: [],
        strengths: [],
        weaknesses: [],
        recommendedFocus: []
      };
      this.subjectProgress.set(subject, progress);
    }

    // Update progress
    progress.xp += score;
    progress.totalTime += duration;
    progress.lastPlayed = new Date();

    // Calculate level (every 1000 XP)
    progress.level = Math.floor(progress.xp / 1000) + 1;

    // Update accuracy from learning metrics
    const learningMetrics = this.learningMetrics.get(subject);
    if (learningMetrics) {
      progress.accuracy = learningMetrics.accuracy;
      progress.questionsAnswered = learningMetrics.totalQuestions;
    }

    // Analyze strengths and weaknesses
    this.analyzeStrengthsWeaknesses(progress);
  }

  /**
   * Update adaptive insights
   */
  private updateAdaptiveInsights(
    subject: string,
    isCorrect: boolean,
    responseTime: number,
    difficulty: number
  ): void {
    // Detect learning style based on performance patterns
    this.detectLearningStyle();

    // Detect pace preference
    if (responseTime < 3000) {
      this.adjustPreference('pacePreference', 'fast');
    } else if (responseTime > 10000) {
      this.adjustPreference('pacePreference', 'slow');
    }

    // Detect challenge preference
    if (isCorrect && difficulty > 0.7) {
      this.adjustPreference('challengePreference', 'challenging');
    } else if (!isCorrect && difficulty < 0.3) {
      this.adjustPreference('challengePreference', 'easy');
    }

    // Track concept mastery
    if (isCorrect && difficulty > 0.6) {
      if (!this.insights.masteredConcepts.includes(subject)) {
        this.insights.masteredConcepts.push(subject);
      }
    } else if (!isCorrect && difficulty < 0.4) {
      if (!this.insights.strugglingConcepts.includes(subject)) {
        this.insights.strugglingConcepts.push(subject);
      }
    }

    // Update recommended path
    this.updateRecommendedPath();
  }

  /**
   * Calculate mastery level
   */
  private calculateMastery(metrics: LearningMetrics): number {
    const accuracyWeight = 0.4;
    const speedWeight = 0.2;
    const consistencyWeight = 0.2;
    const difficultyWeight = 0.2;

    const consistency = Math.min(100, metrics.streakLength * 5);

    return (
      metrics.accuracy * accuracyWeight +
      metrics.speed * speedWeight +
      consistency * consistencyWeight +
      (metrics.difficulty * 100) * difficultyWeight
    );
  }

  /**
   * Calculate improvement rate
   */
  private calculateImprovementRate(subject: string): number {
    const recentEvents = this.events
      .filter(e => e.label === subject && e.type === 'question_answered')
      .slice(-20);

    if (recentEvents.length < 10) return 0;

    const firstHalf = recentEvents.slice(0, 10);
    const secondHalf = recentEvents.slice(10);

    const firstAccuracy = firstHalf.filter(e => e.action === 'correct').length / 10;
    const secondAccuracy = secondHalf.filter(e => e.action === 'correct').length / secondHalf.length;

    return ((secondAccuracy - firstAccuracy) / firstAccuracy) * 100;
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(): number {
    const timeWeight = 0.3;
    const interactionWeight = 0.2;
    const accuracyWeight = 0.3;
    const completionWeight = 0.2;

    const timeScore = Math.min(100, (this.sessionMetrics.duration / 600000) * 100); // 10 min = 100
    const interactionScore = Math.min(100, this.sessionMetrics.interactions * 2);
    const accuracyScore = this.sessionMetrics.accuracyRate;
    const completionScore = this.sessionMetrics.gamesPlayed > 0 ? 50 : 0;

    return (
      timeScore * timeWeight +
      interactionScore * interactionWeight +
      accuracyScore * accuracyWeight +
      completionScore * completionWeight
    );
  }

  /**
   * Update engagement score
   */
  private updateEngagementScore(points: number): void {
    this.sessionMetrics.engagementScore = Math.min(100,
      this.sessionMetrics.engagementScore + points
    );
  }

  /**
   * Detect learning style
   */
  private detectLearningStyle(): void {
    // Analyze interaction patterns to detect learning style
    const visualInteractions = this.events.filter(e =>
      e.metadata?.interactionType === 'visual'
    ).length;
    const audioInteractions = this.events.filter(e =>
      e.metadata?.interactionType === 'audio'
    ).length;
    const kinestheticInteractions = this.events.filter(e =>
      e.metadata?.interactionType === 'kinesthetic'
    ).length;

    const total = visualInteractions + audioInteractions + kinestheticInteractions;
    if (total === 0) return;

    const visualRatio = visualInteractions / total;
    const audioRatio = audioInteractions / total;
    const kinestheticRatio = kinestheticInteractions / total;

    if (visualRatio > 0.5) {
      this.insights.learningStyle = 'visual';
    } else if (audioRatio > 0.5) {
      this.insights.learningStyle = 'auditory';
    } else if (kinestheticRatio > 0.5) {
      this.insights.learningStyle = 'kinesthetic';
    } else {
      this.insights.learningStyle = 'mixed';
    }
  }

  /**
   * Adjust preference based on patterns
   */
  private adjustPreference(
    key: 'pacePreference' | 'challengePreference',
    value: 'fast' | 'moderate' | 'slow' | 'easy' | 'balanced' | 'challenging'
  ): void {
    // Simple moving average adjustment
    if (key === 'pacePreference' && (value === 'fast' || value === 'moderate' || value === 'slow')) {
      if (this.insights[key] !== value) {
        this.insights[key] = value;
      }
    } else if (key === 'challengePreference' && (value === 'easy' || value === 'balanced' || value === 'challenging')) {
      if (this.insights[key] !== value) {
        this.insights[key] = value;
      }
    }
  }

  /**
   * Update recommended learning path
   */
  private updateRecommendedPath(): void {
    const recommendations = [];

    // Based on struggling concepts
    for (const concept of this.insights.strugglingConcepts) {
      recommendations.push(`Practice ${concept} fundamentals`);
    }

    // Based on mastered concepts
    for (const concept of this.insights.masteredConcepts) {
      recommendations.push(`Advanced ${concept} challenges`);
    }

    // Based on engagement metrics
    if (this.engagementMetrics.avgSessionDuration < 600000) { // Less than 10 minutes
      recommendations.push('Try shorter, focused sessions');
    }

    // Update recommendations
    this.insights.recommendedPath = recommendations.slice(0, 5);
  }

  /**
   * Analyze strengths and weaknesses
   */
  private analyzeStrengthsWeaknesses(progress: SubjectProgress): void {
    const metrics = this.learningMetrics.get(progress.subject);
    if (!metrics) return;

    progress.strengths = [];
    progress.weaknesses = [];

    // Identify strengths
    if (metrics.accuracy > 80) {
      progress.strengths.push('High accuracy');
    }
    if (metrics.speed > 70) {
      progress.strengths.push('Quick responses');
    }
    if (metrics.streakLength > 5) {
      progress.strengths.push('Consistent performance');
    }

    // Identify weaknesses
    if (metrics.accuracy < 60) {
      progress.weaknesses.push('Needs accuracy improvement');
    }
    if (metrics.speed < 40) {
      progress.weaknesses.push('Response time can be improved');
    }
    if (metrics.engagement < 50) {
      progress.weaknesses.push('Low engagement');
    }

    // Recommendations
    progress.recommendedFocus = [];
    if (progress.weaknesses.length > 0) {
      progress.recommendedFocus.push('Review basic concepts');
    }
    if (progress.strengths.includes('High accuracy')) {
      progress.recommendedFocus.push('Try harder difficulties');
    }
  }

  /**
   * Check for achievements
   */
  private checkAchievements(subject: string, isCorrect: boolean): void {
    const metrics = this.learningMetrics.get(subject);
    if (!metrics) return;

    // Streak achievements
    if (metrics.streakLength === 5) {
      this.track('achievement_unlocked', 'achievement', 'streak_5', subject);
    } else if (metrics.streakLength === 10) {
      this.track('achievement_unlocked', 'achievement', 'streak_10', subject);
    } else if (metrics.streakLength === 25) {
      this.track('achievement_unlocked', 'achievement', 'streak_25', subject);
    }

    // Accuracy achievements
    if (metrics.accuracy >= 90 && metrics.totalQuestions >= 20) {
      this.track('achievement_unlocked', 'achievement', 'accuracy_master', subject);
    }

    // Speed achievements
    if (metrics.avgResponseTime < 2000 && metrics.totalQuestions >= 10) {
      this.track('achievement_unlocked', 'achievement', 'speed_demon', subject);
    }
  }

  /**
   * Anonymize user ID for privacy
   */
  private anonymizeUserId(userId: string): string {
    // Hash the user ID for privacy (COPPA compliance)
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `user_${Math.abs(hash)}`;
  }

  /**
   * Sanitize metadata to remove PII
   */
  private sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) return undefined;

    const sanitized: Record<string, any> = {};
    const restrictedKeys = ['email', 'name', 'phone', 'address', 'ssn', 'password'];

    for (const [key, value] of Object.entries(metadata)) {
      if (!restrictedKeys.some(restricted => key.toLowerCase().includes(restricted))) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Flush events (in production, this would send to server)
   */
  private flushEvents(): void {
    if (this.eventBuffer.length === 0) return;

    console.log(`📤 Flushing ${this.eventBuffer.length} analytics events`);

    // In production, this would send events to analytics server
    // For now, we'll just clear the buffer
    this.eventBuffer = [];
  }

  /**
   * Save metrics to local storage
   */
  private saveMetrics(): void {
    try {
      const metricsData = {
        session: this.sessionMetrics,
        learning: Array.from(this.learningMetrics.entries()),
        progress: Array.from(this.subjectProgress.entries()),
        engagement: this.engagementMetrics,
        insights: this.insights
      };

      localStorage.setItem('stealth_analytics_metrics', JSON.stringify(metricsData));
    } catch (error) {
      console.error('Failed to save analytics metrics:', error);
    }
  }

  /**
   * Load stored metrics
   */
  private loadStoredMetrics(): void {
    try {
      const stored = localStorage.getItem('stealth_analytics_metrics');
      if (!stored) return;

      const metricsData = JSON.parse(stored);

      // Restore engagement metrics
      if (metricsData.engagement) {
        Object.assign(this.engagementMetrics, metricsData.engagement);
      }

      // Restore insights
      if (metricsData.insights) {
        Object.assign(this.insights, metricsData.insights);
      }

      console.log('📊 Loaded stored analytics metrics');
    } catch (error) {
      console.error('Failed to load analytics metrics:', error);
    }
  }

  /**
   * Get current metrics
   */
  public getMetrics(): {
    session: SessionMetrics;
    learning: LearningMetrics[];
    progress: SubjectProgress[];
    engagement: EngagementMetrics;
    insights: AdaptiveLearningInsights;
  } {
    return {
      session: { ...this.sessionMetrics },
      learning: Array.from(this.learningMetrics.values()),
      progress: Array.from(this.subjectProgress.values()),
      engagement: { ...this.engagementMetrics },
      insights: { ...this.insights }
    };
  }

  /**
   * Get learning analytics for subject
   */
  public getLearningAnalytics(subject: string): LearningMetrics | undefined {
    return this.learningMetrics.get(subject);
  }

  /**
   * Get subject progress
   */
  public getSubjectProgress(subject: string): SubjectProgress | undefined {
    return this.subjectProgress.get(subject);
  }

  /**
   * Get recent events
   */
  public getRecentEvents(limit: number = 50): AnalyticsEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Get analytics summary
   */
  public getAnalyticsSummary(): {
    totalEvents: number;
    sessionDuration: string;
    topSubjects: string[];
    learningProgress: number;
    engagementLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  } {
    const topSubjects = Array.from(this.learningMetrics.values())
      .sort((a, b) => b.totalQuestions - a.totalQuestions)
      .slice(0, 3)
      .map(m => m.subject);

    const avgProgress = Array.from(this.learningMetrics.values())
      .reduce((sum, m) => sum + m.mastery, 0) / Math.max(1, this.learningMetrics.size);

    const engagementLevel =
      this.sessionMetrics.engagementScore > 70 ? 'high' :
      this.sessionMetrics.engagementScore > 40 ? 'medium' : 'low';

    return {
      totalEvents: this.events.length,
      sessionDuration: this.formatDuration(this.sessionMetrics.duration),
      topSubjects,
      learningProgress: avgProgress,
      engagementLevel,
      recommendations: this.insights.recommendedPath
    };
  }

  /**
   * Format duration for display
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Export analytics data
   */
  public exportAnalytics(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      metrics: this.getMetrics(),
      events: this.events.slice(-100),
      summary: this.getAnalyticsSummary()
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Reset analytics
   */
  public resetAnalytics(): void {
    this.events = [];
    this.eventBuffer = [];
    this.learningMetrics.clear();
    this.subjectProgress.clear();
    this.sessionMetrics = this.initializeSessionMetrics();
    this.engagementMetrics = this.initializeEngagementMetrics();
    this.insights = this.initializeInsights();
    this.sessionId = this.generateSessionId();
  }
}

// Export singleton instance
export const realTimeAnalytics = RealTimeAnalyticsService.getInstance();