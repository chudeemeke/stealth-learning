import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';

// Import all slices
import gameSlice from '@/store/slices/gameSlice';
import studentSlice from '@/store/slices/studentSlice';
import adaptiveSlice from '@/store/slices/adaptiveSlice';
import sessionSlice from '@/store/slices/sessionSlice';
import settingsSlice from '@/store/slices/settingsSlice';
import analyticsSlice from '@/store/slices/analyticsSlice';

// Mock implementations for services
export const mockDatabaseService = {
  // Initialization and lifecycle
  init: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  clearAllData: vi.fn().mockResolvedValue(undefined),
  destroy: vi.fn(),

  // User management
  createParent: vi.fn().mockResolvedValue('parent-123'),
  createChild: vi.fn().mockResolvedValue('child-123'),
  authenticateParent: vi.fn().mockResolvedValue(null),
  authenticateChild: vi.fn().mockResolvedValue(null),
  authenticateUser: vi.fn().mockResolvedValue({ success: false, error: 'User not found' }),
  getUser: vi.fn().mockResolvedValue(null),
  getParentProfile: vi.fn().mockResolvedValue(null),
  getChildProfile: vi.fn().mockResolvedValue(null),
  updateChildProfile: vi.fn().mockResolvedValue(undefined),
  verifyChildPin: vi.fn().mockResolvedValue(false),

  // Game content management
  getGameContent: vi.fn().mockResolvedValue(null),
  getGamesBySubject: vi.fn().mockResolvedValue([]),
  searchGameContent: vi.fn().mockResolvedValue([]),

  // Game session management
  startGameSession: vi.fn().mockResolvedValue('session-123'),
  updateGameSession: vi.fn().mockResolvedValue(undefined),
  completeGameSession: vi.fn().mockResolvedValue(undefined),
  createGameSession: vi.fn().mockResolvedValue('session-123'),
  endGameSession: vi.fn().mockResolvedValue(undefined),
  getDailyUsage: vi.fn().mockResolvedValue(0),

  // Analytics and tracking
  trackEvent: vi.fn().mockResolvedValue(undefined),
  getDailyMetrics: vi.fn().mockResolvedValue(null),

  // Student model compatibility (for adaptive engine)
  saveStudent: vi.fn().mockResolvedValue('student-123'),
  getStudent: vi.fn().mockResolvedValue(null),
  updateStudent: vi.fn().mockResolvedValue('student-123'),
  getAllStudents: vi.fn().mockResolvedValue([]),

  // Performance tracking
  savePerformanceRecord: vi.fn().mockResolvedValue('performance-123'),
  getPerformanceHistory: vi.fn().mockResolvedValue([]),
  getPerformanceAnalytics: vi.fn().mockResolvedValue({
    totalGames: 0,
    averageScore: 0,
    totalTime: 0,
    subjectBreakdown: {}
  }),

  // Game state management
  saveGameState: vi.fn().mockResolvedValue('gamestate-123'),
  getGameState: vi.fn().mockResolvedValue(null),
  deleteGameState: vi.fn().mockResolvedValue(undefined),

  // Achievement management
  updateAchievement: vi.fn().mockResolvedValue('achievement-123'),
  getStudentAchievements: vi.fn().mockResolvedValue([]),

  // Singleton access (for testing singleton pattern)
  getInstance: vi.fn().mockReturnValue(this as any)
};

// Create a factory function for creating test instances
export const createMockDatabaseService = () => ({
  ...mockDatabaseService,
  // Reset all mocks when creating new instance
  ...Object.fromEntries(
    Object.entries(mockDatabaseService).map(([key, value]) => [
      key,
      typeof value === 'function' ? vi.fn().mockImplementation(value.getMockImplementation?.() || value) : value
    ])
  )
});

export const mockEncryptionService = {
  encrypt: vi.fn().mockImplementation((data: string) => Promise.resolve(`encrypted_${data}`)),
  decrypt: vi.fn().mockImplementation((data: string) => Promise.resolve(data.replace('encrypted_', ''))),
  hash: vi.fn().mockImplementation((data: string) => Promise.resolve(`hashed_${data}`)),
  generateSalt: vi.fn().mockReturnValue('mock_salt'),
};

export const mockAuthService = {
  login: vi.fn().mockResolvedValue({ token: 'mock_token', user: { id: '1', role: 'parent' } }),
  logout: vi.fn().mockResolvedValue(undefined),
  verifyToken: vi.fn().mockResolvedValue(true),
  refreshToken: vi.fn().mockResolvedValue('new_mock_token'),
  getCurrentUser: vi.fn().mockReturnValue({ id: '1', role: 'parent' }),
  isAuthenticated: vi.fn().mockReturnValue(true),
};

export const mockGameEngine = {
  initializeGame: vi.fn().mockResolvedValue({
    id: 'test_game',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    lives: 3,
  }),
  submitAnswer: vi.fn().mockResolvedValue({
    correct: true,
    score: 10,
    feedback: 'Correct!',
  }),
  getNextQuestion: vi.fn().mockResolvedValue({
    id: 'question_1',
    type: 'multiple_choice',
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
  }),
  calculateFinalScore: vi.fn().mockReturnValue({
    totalScore: 100,
    accuracy: 0.8,
    timeBonus: 20,
  }),
};

export const mockAnalyticsEngine = {
  trackEvent: vi.fn(),
  trackPerformance: vi.fn(),
  calculateMetrics: vi.fn().mockResolvedValue({
    totalTimeSpent: 30,
    accuracy: 0.85,
    gamesCompleted: 5,
  }),
  generateInsights: vi.fn().mockResolvedValue({
    strongestSubject: 'mathematics',
    weakestSubject: 'science',
    recommendedNextSteps: ['practice division'],
  }),
};

// Test store factory
export function createTestStore(preloadedState?: any) {
  return configureStore({
    reducer: {
      session: sessionSlice,
      game: gameSlice,
      settings: settingsSlice,
      analytics: analyticsSlice,
      adaptive: adaptiveSlice,
      student: studentSlice,
    } as any,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
  routerProps?: {
    initialEntries?: string[];
    initialIndex?: number;
  };
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    routerProps = {},
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter {...routerProps}>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Mock student data for testing (compatible with database schema)
export const mockStudent = {
  id: 'student_1',
  username: 'testchild',
  name: 'Test Child',
  ageGroup: '6-8' as const,
  learningStyle: 'visual' as const,
  skillLevels: new Map(),
  performanceHistory: [],
  currentZPD: {
    lowerBound: 1000,
    upperBound: 1400,
    optimalDifficulty: 1200,
    recommendedSkills: ['addition', 'subtraction'],
  },
  preferences: {
    soundEnabled: true,
    musicVolume: 0.7,
    effectsVolume: 0.8,
    subtitlesEnabled: false,
    colorMode: 'bright' as const,
    fontSize: 'medium' as const,
    animationSpeed: 'normal' as const,
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

// Mock child profile for database schema compatibility
export const mockChildProfile = {
  id: 'profile_1',
  userId: 'student_1',
  name: 'Test Child',
  ageGroup: '6-8' as const,
  avatar: {
    id: 'avatar_1',
    emoji: '🐻',
    name: 'Bear',
    colorScheme: 'blue',
    unlocked: true,
  },
  preferences: {
    soundEnabled: true,
    musicVolume: 0.7,
    effectsVolume: 0.8,
    subtitlesEnabled: false,
    colorMode: 'bright' as const,
    fontSize: 'medium' as const,
    animationSpeed: 'normal' as const,
  },
  parentalControls: {
    dailyTimeLimit: 60,
    allowedSubjects: ['mathematics' as const, 'english' as const],
    maxDifficultyLevel: 'medium' as const,
    requireAdultForSettings: true,
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

// Mock game state for testing
export const mockGameState = {
  id: 'game_state_1',
  studentId: 'student_1',
  gameId: 'math_game_1',
  currentLevel: 2,
  score: 80,
  lives: 2,
  hints: 3,
  startTime: new Date(),
  completedObjectives: ['objective_1'],
  collectedRewards: [],
  gameData: {
    questionsAnswered: 8,
    correctAnswers: 6,
    currentStreak: 3,
  },
};

// Mock performance record for testing
export const mockPerformanceRecord = {
  id: 'performance_1',
  timestamp: new Date(),
  skill: 'addition',
  subject: 'mathematics' as const,
  correct: true,
  responseTime: 3000,
  hintsUsed: 1,
  contentDifficulty: 1200,
  score: 10,
  feedback: 'Great job!',
  contentType: 'game' as const,
  accuracy: 0.8,
  difficulty: 'medium' as const,
};

// Mock content for testing
export const mockContent = {
  id: 'content_1',
  type: 'game' as const,
  subject: 'mathematics' as const,
  title: 'Addition Adventure',
  description: 'Learn addition through fun games',
  difficulty: 1200,
  ageGroup: '6-8' as const,
  prerequisites: [],
  learningObjectives: [
    {
      id: 'obj_1',
      description: 'Add single digit numbers',
      skill: 'addition',
      assessmentCriteria: ['accuracy > 0.8'],
      completed: false,
    },
  ],
  estimatedDuration: 10,
  tags: ['math', 'addition', 'basic'],
  metadata: {
    author: 'Test Author',
    version: '1.0.0',
    releaseDate: new Date('2024-01-01'),
    lastUpdated: new Date('2024-01-01'),
    playCount: 100,
    averageRating: 4.5,
    difficulty: {
      cognitive: 3,
      motor: 2,
      reading: 1,
    },
    visualElements: ['animations', 'colorful_graphics'],
    hasAudio: true,
    hasNarration: true,
    interactive: true,
  },
};

// Mock achievement for testing (database schema compatible)
export const mockAchievement = {
  id: 'achievement_1',
  userId: 'student_1',
  type: 'learning' as const,
  title: 'Math Master',
  description: 'Complete 10 addition games',
  icon: '🎯',
  rarity: 'common' as const,
  progress: 70,
  requirement: 100,
  isUnlocked: false,
  unlockedAt: undefined,
  reward: {
    type: 'xp' as const,
    value: 50
  }
};

// Mock achievement for external API compatibility
export const mockAchievementExternal = {
  id: 'achievement_1',
  name: 'Math Master',
  title: 'Addition Expert',
  description: 'Complete 10 addition games',
  icon: '🎯',
  category: 'academic' as const,
  points: 50,
  progress: 70,
  criteria: {
    type: 'completion' as const,
    target: 10,
    current: 7,
    subject: 'mathematics' as const,
    skill: 'addition',
  },
};

// Utility functions for test setup
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve(undefined);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
};

// Mock user event helpers
export const mockUserEvent = {
  click: vi.fn(),
  type: vi.fn(),
  clear: vi.fn(),
  selectOptions: vi.fn(),
  hover: vi.fn(),
  unhover: vi.fn(),
  tab: vi.fn(),
  keyboard: vi.fn(),
};

// Mock framer motion components for testing
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    img: 'img',
    section: 'section',
    article: 'article',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useMotionValue: (initial: any) => ({
    get: () => initial,
    set: vi.fn(),
  }),
  useTransform: () => 0,
  useSpring: () => 0,
}));

// Export commonly used testing utilities
export * from '@testing-library/react';
export { vi, expect } from 'vitest';