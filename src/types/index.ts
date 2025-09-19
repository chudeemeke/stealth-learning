// Core type definitions for the Stealth Learning Games SPA

// Age groups as defined in research
export type AgeGroup = '3-5' | '6-8' | '9';

// Learning subjects
export type Subject = 'mathematics' | 'english' | 'science';

// Difficulty levels
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'adaptive';

// Mastery levels for adaptive learning
export type MasteryLevel = 'novice' | 'developing' | 'proficient' | 'advanced';

// Learning style types
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'mixed';

// Base component props that all age-aware components should extend
export interface AgeAwareComponentProps {
  ageGroup: AgeGroup;
  className?: string;
}

// Student model for adaptive learning
export interface StudentModel {
  id: string;
  username: string;
  name?: string;
  age?: number;
  ageGroup: AgeGroup;
  avatar?: Avatar;
  level?: number;
  xp?: number;
  totalStars?: number;
  streakCount?: number;
  learningStyle: LearningStyle;
  skillLevels: Map<string, SkillLevel>;
  performanceHistory: PerformanceRecord[];
  currentZPD: ZoneOfProximalDevelopment;
  preferences: StudentPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// Skill level tracking
export interface SkillLevel {
  skill: string;
  subject: Subject;
  currentRating: number; // Elo rating
  confidence: number; // 0-1
  lastAssessed: Date;
  masteryLevel: MasteryLevel;
  totalAttempts: number;
  successfulAttempts: number;
}

// Zone of Proximal Development
export interface ZoneOfProximalDevelopment {
  lowerBound: number;
  upperBound: number;
  optimalDifficulty: number;
  recommendedSkills: string[];
}

// Performance tracking
export interface PerformanceRecord {
  id: string;
  timestamp: Date;
  skill: string;
  subject: Subject;
  correct: boolean;
  responseTime: number; // milliseconds
  hintsUsed: number;
  contentDifficulty: number;
  score: number;
  feedback?: string;
  contentType?: ContentType;
  accuracy?: number;
  difficulty?: DifficultyLevel;
}

// Avatar configuration
export interface Avatar {
  id: string;
  type: 'animal' | 'character' | 'custom';
  colorScheme: string;
  accessories: string[];
  unlocked: boolean;
}

// Student preferences
export interface StudentPreferences {
  soundEnabled: boolean;
  musicVolume: number;
  effectsVolume: number;
  subtitlesEnabled: boolean;
  colorMode: 'bright' | 'soft' | 'high-contrast';
  fontSize: 'small' | 'medium' | 'large';
  animationSpeed: 'slow' | 'normal' | 'fast';
  theme?: string;
}

// Learning content
export interface Content {
  id: string;
  type: ContentType;
  subject: Subject;
  title: string;
  description: string;
  difficulty: number;
  ageGroup: AgeGroup;
  prerequisites: string[];
  learningObjectives: LearningObjective[];
  estimatedDuration: number; // minutes
  tags: string[];
  metadata: ContentMetadata;
}

export type ContentType = 'game' | 'lesson' | 'quiz' | 'challenge' | 'story';

export interface LearningObjective {
  id: string;
  description: string;
  skill: string;
  assessmentCriteria: string[];
  completed: boolean;
}

export interface ContentMetadata {
  author: string;
  version: string;
  releaseDate: Date;
  lastUpdated: Date;
  playCount: number;
  averageRating: number;
  difficulty: {
    cognitive: number;
    motor: number;
    reading: number;
  };
  visualElements?: string[];
  hasAudio?: boolean;
  hasNarration?: boolean;
  interactive?: boolean;
}

// Game-specific types
export interface GameState {
  id: string;
  studentId: string;
  gameId: string;
  currentLevel: number;
  score: number;
  lives: number;
  hints: number;
  startTime: Date;
  pausedTime?: Date;
  completedObjectives: string[];
  collectedRewards: Reward[];
  gameData: Record<string, any>;
}

export interface Reward {
  id: string;
  type: 'points' | 'badge' | 'unlock' | 'powerup';
  value: number | string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

// Learning session
export interface LearningSession {
  id: string;
  studentId: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  subject: Subject;
  gamesPlayed: GameAttempt[];
  skillsPracticed: string[];
  performanceSummary?: PerformanceSummary;
  engagementScore: number;
  streakCount?: number;
  progress?: number;
}

export interface GameAttempt {
  id: string;
  gameId: string;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  maxScore: number;
  accuracy: number;
  hintsUsed: number;
  responseTimes: number[];
  learningObjectivesMet: string[];
}

export interface PerformanceSummary {
  totalScore: number;
  accuracy: number;
  averageResponseTime: number;
  skillsImproved: string[];
  skillsToReview: string[];
  engagementLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

// Analytics types
export interface AnalyticsData {
  studentId: string;
  dateRange: DateRange;
  metrics: AnalyticsMetrics;
  insights: AnalyticsInsights;
  recommendations: string[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface AnalyticsMetrics {
  totalTimeSpent: number; // minutes
  sessionsCount: number;
  gamesCompleted: number;
  skillsMastered: number;
  averageAccuracy: number;
  averageSessionDuration: number;
  streakDays: number;
  progressRate: number; // percentage
}

export interface AnalyticsInsights {
  strongestSubject: Subject;
  weakestSubject: Subject;
  fastestLearningSkill: string;
  slowestLearningSkill: string;
  peakPerformanceTime: string; // time of day
  optimalSessionLength: number; // minutes
  learningStyleMatch: number; // percentage
}

// Parent/Educator types
export interface ParentUser {
  id: string;
  email: string;
  name: string;
  children: string[]; // student IDs
  role: 'parent' | 'educator';
  notifications: NotificationPreferences;
  subscription?: Subscription;
}

export interface NotificationPreferences {
  weeklyReports: boolean;
  achievementAlerts: boolean;
  concernAlerts: boolean;
  sessionSummaries: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
}

export interface Subscription {
  type: 'free' | 'basic' | 'premium';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  features: string[];
}

// Achievement system
export interface Achievement {
  id: string;
  name: string;
  title?: string;
  description: string;
  icon: string;
  category: 'academic' | 'engagement' | 'social' | 'special';
  points: number;
  unlockedAt?: Date;
  progress?: number; // 0-100
  criteria: AchievementCriteria;
}

export interface AchievementCriteria {
  type: 'score' | 'streak' | 'completion' | 'mastery' | 'time';
  target: number;
  current: number;
  subject?: Subject;
  skill?: string;
}

// Adaptive algorithm types
export interface AdaptiveResponse {
  recommendedContent: Content;
  difficulty: number;
  estimatedSuccessProbability: number;
  reasoning: string;
  alternativeOptions: Content[];
}

export interface LearningContext {
  subject: Subject;
  timeOfDay: string;
  sessionDuration: number;
  recentPerformance: PerformanceRecord[];
  mood?: 'excited' | 'neutral' | 'frustrated';
  environment?: 'quiet' | 'noisy';
}