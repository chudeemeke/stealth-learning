// Core type definitions for the Stealth Learning Games SPA

// Age groups as defined in research
export type AgeGroup = '3-5' | '6-8' | '9+';

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

// Spaced Repetition types
export interface SpacedRepetitionCard {
  id: string;
  contentId: string;
  contentType: ContentType;
  subject: Subject;
  difficulty: number;
  interval: number; // days until next review
  easeFactor: number; // SM-2 ease factor
  reviewCount: number;
  nextReview: Date;
  createdAt: Date;
  lastReviewed: Date;
  successStreak: number;
  totalAttempts: number;
  totalCorrect: number;
  retentionStrength: number; // 0-1 confidence score
}

export interface ReviewResult {
  correct: boolean;
  responseTime: number;
  hintsUsed: number;
  difficulty: number;
  confidence?: number; // 0-1 self-reported confidence
}

export interface ReviewSession {
  id: string;
  cards: SpacedRepetitionCard[];
  estimatedDuration: number; // minutes
  createdAt: Date;
  ageGroup: AgeGroup;
  targetRetention: number; // 0-1 target retention rate
}

// Web API Types - Export all types from web-api.d.ts
export * from './web-api';

// Component Configuration by Age Group
export const TOUCH_TARGET_SIZES = {
  '3-5': 64,   // Large touch targets for young children
  '6-8': 48,   // Medium touch targets
  '9+': 44,    // Standard touch targets
} as const;

// Animation Speed Configurations by Age Group
export const ANIMATION_SPEEDS = {
  '3-5': {
    duration: 0.8,
    easing: 'ease-out',
    playful: true,
  },
  '6-8': {
    duration: 0.5,
    easing: 'ease-in-out',
    playful: false,
  },
  '9+': {
    duration: 0.3,
    easing: 'ease-in-out',
    playful: false,
  },
} as const;

// Color Schemes by Age Group
export const AGE_COLOR_SCHEMES = {
  '3-5': {
    primary: 'bg-yellow-400 text-yellow-900',
    secondary: 'bg-pink-400 text-pink-900',
    accent: 'bg-green-400 text-green-900',
    background: 'bg-gradient-to-br from-yellow-100 to-pink-100',
  },
  '6-8': {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-purple-500 text-white',
    accent: 'bg-green-500 text-white',
    background: 'bg-gradient-to-br from-blue-50 to-purple-50',
  },
  '9+': {
    primary: 'bg-indigo-600 text-white',
    secondary: 'bg-gray-600 text-white',
    accent: 'bg-emerald-600 text-white',
    background: 'bg-gradient-to-br from-gray-50 to-indigo-50',
  },
} as const;

// Animation Configuration Interface
export interface AnimationConfig {
  type?: 'slide' | 'fade' | 'scale' | 'flip' | 'bounce' | 'pulse';
  delay?: number;
  duration?: number;
  repeat?: boolean;
}

// Effects Configuration Interface
export interface EffectsConfig {
  hover?: boolean;
  parallax?: boolean;
  glow?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// Accessibility Configuration Interface
export interface AccessibilityConfig {
  ariaLabel?: string;
  focusRing?: boolean;
  highContrast?: boolean;
}

// Common utility types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}