import Dexie, { Table } from 'dexie';
import { AgeGroup, Subject, DifficultyLevel } from '@/types';

// Database schema interfaces
export interface User {
  id: string;
  type: 'parent' | 'child';
  email?: string; // For parents
  username?: string; // For children
  passwordHash?: string; // For parents
  parentId?: string; // For children
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  timezone: string;
  preferences: {
    emailNotifications: boolean;
    weeklyReports: boolean;
    achievementAlerts: boolean;
  };
  subscriptionTier: 'free' | 'premium' | 'family';
  children: string[]; // Child user IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface ChildProfile {
  id: string;
  userId: string;
  name: string;
  ageGroup: AgeGroup;
  grade?: string;
  avatar: {
    id: string;
    emoji: string;
    name: string;
    colorScheme: string;
    unlocked: boolean;
  };
  preferences: {
    soundEnabled: boolean;
    musicVolume: number;
    effectsVolume: number;
    subtitlesEnabled: boolean;
    colorMode: 'bright' | 'calm' | 'high-contrast';
    fontSize: 'small' | 'medium' | 'large';
    animationSpeed: 'slow' | 'normal' | 'fast';
  };
  parentalControls: {
    dailyTimeLimit: number; // minutes
    allowedSubjects: Subject[];
    maxDifficultyLevel: DifficultyLevel;
    requireAdultForSettings: boolean;
  };
  avatarPin?: string; // Optional PIN for child login
  createdAt: Date;
  updatedAt: Date;
}

export interface GameContent {
  id: string;
  gameId: string;
  subject: Subject;
  ageGroup: AgeGroup;
  difficulty: DifficultyLevel;
  title: string;
  description: string;
  questions: Question[];
  assets: {
    images: string[];
    audio: string[];
    video?: string;
  };
  metadata: {
    estimatedDuration: number; // minutes
    skillTags: string[];
    prerequisites: string[];
    learningObjectives: string[];
  };
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'drag-drop' | 'typing' | 'drawing' | 'sorting' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  hint?: string;
  explanation?: string;
  media?: {
    type: 'image' | 'audio' | 'video';
    url: string;
    alt?: string;
  };
  difficulty: number; // 1-10 scale
  points: number;
  timeLimit?: number; // seconds
  tags: string[];
}

export interface GameSession {
  id: string;
  userId: string;
  profileId?: string; // Child profile ID for child sessions
  gameId: string;
  gameContentId: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  hintsUsed: number;
  timeElapsed: number; // seconds
  answers: GameAnswer[];
  isCompleted: boolean;
  isPaused: boolean;
  pausedAt?: Date;
  resumedAt?: Date;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  settings?: any; // Additional session settings
  metadata: {
    difficulty: DifficultyLevel;
    averageResponseTime: number;
    streakCount: number;
    mistakePattern: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GameAnswer {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number; // seconds
  hintsUsed: number;
  attempts: number;
  timestamp: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  subject: Subject;
  skillArea: string;
  currentLevel: number;
  xp: number;
  mastery: number; // 0-100 percentage
  streakCount: number;
  lastPlayed: Date;
  totalTimeSpent: number; // minutes
  gamesCompleted: number;
  averageAccuracy: number;
  milestones: Milestone[];
  nextRecommendation?: {
    gameId: string;
    reason: string;
    confidence: number;
  };
}

export interface Milestone {
  id: string;
  type: 'xp' | 'streak' | 'mastery' | 'time' | 'games';
  title: string;
  description: string;
  threshold: number;
  achieved: boolean;
  achievedAt?: Date;
  reward?: {
    type: 'avatar' | 'badge' | 'theme' | 'game';
    item: string;
  };
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'learning' | 'engagement' | 'streak' | 'mastery' | 'exploration';
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  requirement: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  reward?: {
    type: 'xp' | 'avatar' | 'badge' | 'theme';
    value: number | string;
  };
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventData: Record<string, any>;
  sessionId?: string;
  timestamp: Date;
  metadata: {
    userAgent: string;
    viewport: { width: number; height: number };
    pathname: string;
  };
}

export interface LearningMetrics {
  id: string;
  userId: string;
  date: Date; // Daily aggregation
  totalTimeSpent: number; // minutes
  gamesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  subjectBreakdown: Record<Subject, {
    timeSpent: number;
    accuracy: number;
    gamesPlayed: number;
  }>;
  difficultyProgression: Record<DifficultyLevel, number>;
  engagementScore: number; // 1-100
}

export interface Settings {
  id: string;
  userId: string;
  category: 'app' | 'privacy' | 'parental' | 'accessibility';
  key: string;
  value: any;
  updatedAt: Date;
}

export interface SyncQueue {
  id: string;
  operation: 'create' | 'update' | 'delete';
  table: string;
  recordId: string;
  data: any;
  timestamp: Date;
  synced: boolean;
  syncedAt?: Date;
  retryCount: number;
  error?: string;
}

// Dexie Database Class
export class StealthLearningDB extends Dexie {
  // Tables
  users!: Table<User, string>;
  parentProfiles!: Table<ParentProfile, string>;
  childProfiles!: Table<ChildProfile, string>;
  gameContent!: Table<GameContent, string>;
  gameSessions!: Table<GameSession, string>;
  gameAnswers!: Table<GameAnswer, string>;
  userProgress!: Table<UserProgress, string>;
  achievements!: Table<Achievement, string>;
  analyticsEvents!: Table<AnalyticsEvent, string>;
  learningMetrics!: Table<LearningMetrics, string>;
  settings!: Table<Settings, string>;
  syncQueue!: Table<SyncQueue, string>;

  constructor() {
    super('StealthLearningDB');

    this.version(1).stores({
      users: 'id, type, email, parentId, createdAt',
      parentProfiles: 'id, userId, firstName, lastName, subscriptionTier',
      childProfiles: 'id, userId, name, ageGroup, createdAt',
      gameContent: 'id, gameId, subject, ageGroup, difficulty, version',
      gameSessions: 'id, userId, gameId, startTime, endTime, isCompleted',
      gameAnswers: 'id, questionId, timestamp',
      userProgress: 'id, userId, subject, skillArea, currentLevel, lastPlayed',
      achievements: 'id, userId, type, isUnlocked, unlockedAt',
      analyticsEvents: 'id, userId, eventType, timestamp, sessionId',
      learningMetrics: 'id, userId, date, totalTimeSpent',
      settings: 'id, userId, category, key, updatedAt',
      syncQueue: 'id, table, timestamp, synced, retryCount'
    });

    // Hooks for automatic timestamps
    this.users.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.users.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any).updatedAt = new Date();
    });

    // Similar hooks for other tables that need timestamps
    [this.parentProfiles, this.childProfiles, this.gameContent].forEach(table => {
      table.hook('creating', (primKey, obj, trans) => {
        obj.createdAt = new Date();
        obj.updatedAt = new Date();
      });

      table.hook('updating', (modifications, primKey, obj, trans) => {
        (modifications as any).updatedAt = new Date();
      });
    });
  }
}

// Database instance
export const db = new StealthLearningDB();

// Database initialization and seeding
export const initializeDatabase = async (): Promise<void> => {
  try {
    await db.open();
    console.log('✅ Database opened successfully');

    // Check if we need to seed initial data
    const gameContentCount = await db.gameContent.count();
    if (gameContentCount === 0) {
      await seedInitialGameContent();
      console.log('✅ Initial game content seeded');
    }

  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

// Seed function for initial game content
const seedInitialGameContent = async (): Promise<void> => {
  const initialContent: Omit<GameContent, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // Math games for age 3-5
    {
      gameId: 'math-counting-1',
      subject: 'mathematics',
      ageGroup: '3-5',
      difficulty: 'easy',
      title: 'Counting Safari',
      description: 'Count the animals in the safari!',
      questions: [
        {
          id: 'count-1',
          type: 'multiple-choice',
          question: 'How many lions do you see?',
          options: ['1', '2', '3', '4'],
          correctAnswer: '2',
          hint: 'Count each lion carefully!',
          explanation: 'There are 2 lions in the picture.',
          media: { type: 'image', url: '/images/math/lions-2.png', alt: '2 lions' },
          difficulty: 1,
          points: 10,
          timeLimit: 30,
          tags: ['counting', 'numbers', 'animals']
        }
      ],
      assets: { images: ['/images/math/lions-2.png'], audio: ['/audio/success.mp3'] },
      metadata: {
        estimatedDuration: 5,
        skillTags: ['counting', 'number-recognition'],
        prerequisites: [],
        learningObjectives: ['Count objects 1-5', 'Recognize numbers 1-5']
      },
      version: '1.0.0'
    },
    // English games for age 3-5
    {
      gameId: 'english-letters-1',
      subject: 'english',
      ageGroup: '3-5',
      difficulty: 'easy',
      title: 'Letter Adventure',
      description: 'Learn the alphabet with fun characters!',
      questions: [
        {
          id: 'letter-a-1',
          type: 'multiple-choice',
          question: 'Which letter does Apple start with?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          hint: 'Listen to the sound: Aaa-pple',
          explanation: 'Apple starts with the letter A!',
          media: { type: 'image', url: '/images/english/apple.png', alt: 'Red apple' },
          difficulty: 1,
          points: 10,
          timeLimit: 30,
          tags: ['letters', 'phonics', 'vocabulary']
        }
      ],
      assets: { images: ['/images/english/apple.png'], audio: ['/audio/letter-a.mp3'] },
      metadata: {
        estimatedDuration: 5,
        skillTags: ['letter-recognition', 'phonics'],
        prerequisites: [],
        learningObjectives: ['Recognize letter A', 'Associate letters with sounds']
      },
      version: '1.0.0'
    },
    // Science games for age 3-5
    {
      gameId: 'science-plants-1',
      subject: 'science',
      ageGroup: '3-5',
      difficulty: 'easy',
      title: 'Plant Growth Garden',
      description: 'Learn how plants grow!',
      questions: [
        {
          id: 'plant-growth-1',
          type: 'sorting',
          question: 'Put the plant growth stages in order',
          options: ['Seed', 'Sprout', 'Small Plant', 'Big Plant'],
          correctAnswer: ['Seed', 'Sprout', 'Small Plant', 'Big Plant'],
          hint: 'Start with the smallest and work your way up!',
          explanation: 'Plants grow from seeds into sprouts, then into bigger plants!',
          media: { type: 'image', url: '/images/science/plant-stages.png', alt: 'Plant growth stages' },
          difficulty: 2,
          points: 15,
          timeLimit: 45,
          tags: ['plants', 'growth', 'nature']
        }
      ],
      assets: { images: ['/images/science/plant-stages.png'], audio: ['/audio/nature.mp3'] },
      metadata: {
        estimatedDuration: 7,
        skillTags: ['life-cycles', 'observation'],
        prerequisites: [],
        learningObjectives: ['Understand plant growth', 'Sequence events']
      },
      version: '1.0.0'
    }
  ];

  // Add IDs and insert into database
  for (const content of initialContent) {
    await db.gameContent.add({
      ...content,
      id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
};

// Export database utilities
export { Dexie };
export default db;