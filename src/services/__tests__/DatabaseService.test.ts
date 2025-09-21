import { describe, it, expect, beforeEach, afterEach, vi, beforeAll, afterAll } from 'vitest';
import { DatabaseService, databaseService } from '../database/DatabaseService';
import { createTestDatabaseService, DatabaseServiceTestFactory } from './DatabaseServiceTestFactory';
import { db } from '../database/schema';
import type { User, ParentProfile, ChildProfile, GameSession } from '../database/schema';

// Mock the database tables for testing
const mockTable = {
  add: vi.fn(),
  put: vi.fn(),
  get: vi.fn(),
  where: vi.fn().mockReturnThis(),
  equals: vi.fn().mockReturnThis(),
  and: vi.fn().mockReturnThis(),
  first: vi.fn(),
  toArray: vi.fn(),
  delete: vi.fn(),
  clear: vi.fn(),
  count: vi.fn(),
  orderBy: vi.fn().mockReturnThis(),
  reverse: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  update: vi.fn(),
  filter: vi.fn().mockReturnThis()
};

// Mock the entire database schema
vi.mock('../database/schema', () => ({
  db: {
    users: mockTable,
    parentProfiles: mockTable,
    childProfiles: mockTable,
    gameContent: mockTable,
    gameSessions: mockTable,
    userProgress: mockTable,
    achievements: mockTable,
    analyticsEvents: mockTable,
    learningMetrics: mockTable,
    settings: mockTable,
    syncQueue: mockTable,
    open: vi.fn().mockResolvedValue(undefined),
    close: vi.fn(),
    delete: vi.fn().mockResolvedValue(undefined)
  }
}));

// Mock crypto-js for encryption testing
vi.mock('crypto-js', () => ({
  AES: {
    encrypt: vi.fn().mockReturnValue({ toString: () => 'encrypted-data' }),
    decrypt: vi.fn().mockReturnValue({ toString: () => 'decrypted-data' })
  },
  SHA256: vi.fn().mockReturnValue({ toString: () => 'hashed-data' }),
  PBKDF2: vi.fn().mockReturnValue({ toString: () => 'pbkdf2-hash' }),
  lib: {
    WordArray: {
      random: vi.fn().mockReturnValue({ toString: () => 'random-salt' })
    }
  },
  enc: {
    Utf8: 'utf8'
  },
  default: {
    AES: {
      encrypt: vi.fn().mockReturnValue({ toString: () => 'encrypted-data' }),
      decrypt: vi.fn().mockReturnValue({ toString: () => 'decrypted-data' })
    }
  }
}));

describe('DatabaseService', () => {
  let dbService: DatabaseService;

  beforeAll(() => {
    // Use the test factory to get a properly instantiated service
    // This respects the singleton pattern while enabling test isolation
    dbService = createTestDatabaseService();
  });

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });

  afterAll(() => {
    // Reset test factory for clean isolation
    DatabaseServiceTestFactory.resetTestInstance();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = DatabaseService.getInstance();
      const instance2 = DatabaseService.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBe(dbService);
    });
  });

  describe('user management', () => {
    const mockParentProfile = {
      firstName: 'John',
      lastName: 'Doe',
      timezone: 'America/New_York',
      preferences: {
        emailNotifications: true,
        weeklyReports: true,
        achievementAlerts: true
      },
      subscriptionTier: 'free' as const,
      children: []
    };

    const mockChildProfile = {
      name: 'Test Child',
      ageGroup: '6-8' as const,
      avatar: {
        id: 'avatar-1',
        emoji: '🐻',
        name: 'Bear',
        colorScheme: 'blue',
        unlocked: true
      },
      preferences: {
        soundEnabled: true,
        musicVolume: 0.7,
        effectsVolume: 0.8,
        subtitlesEnabled: false,
        colorMode: 'bright' as const,
        fontSize: 'medium' as const,
        animationSpeed: 'normal' as const
      },
      parentalControls: {
        dailyTimeLimit: 60,
        allowedSubjects: ['mathematics' as const],
        maxDifficultyLevel: 'medium' as const,
        requireAdultForSettings: true
      }
    };

    it('should create a parent successfully', async () => {
      mockTable.add.mockResolvedValue('parent-123');

      const result = await dbService.createParent('test@example.com', 'password123', mockParentProfile);

      expect(mockTable.add).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        type: 'parent',
        passwordHash: expect.any(String)
      }));
      expect(result).toMatch(/^parent-/);
    });

    it('should authenticate a parent', async () => {
      const mockUser: User = {
        id: 'parent-123',
        type: 'parent',
        email: 'test@example.com',
        passwordHash: 'hashed-data',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockTable.first.mockResolvedValue(mockUser);
      mockTable.where.mockReturnValue({ equals: vi.fn().mockReturnValue({ and: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue(mockUser) }) }) });

      const result = await dbService.authenticateParent('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
    });

    it('should create a child profile', async () => {
      const mockParent: ParentProfile = {
        id: 'profile-123',
        userId: 'parent-123',
        firstName: 'John',
        lastName: 'Doe',
        children: [],
        timezone: 'America/New_York',
        preferences: {
          emailNotifications: true,
          weeklyReports: true,
          achievementAlerts: true
        },
        subscriptionTier: 'free',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockTable.add.mockResolvedValue('child-123');
      mockTable.first.mockResolvedValue(mockParent);
      mockTable.update.mockResolvedValue(1);

      const result = await dbService.createChild('parent-123', mockChildProfile);

      expect(mockTable.add).toHaveBeenCalledWith(expect.objectContaining({
        type: 'child',
        parentId: 'parent-123'
      }));
      expect(result).toMatch(/^child-/);
    });

    it('should get user by ID', async () => {
      const mockUser: User = {
        id: 'user-123',
        type: 'parent',
        email: 'test@example.com',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockTable.get.mockResolvedValue(mockUser);

      const result = await dbService.getUser('user-123');

      expect(mockTable.get).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockUser);
    });
  });

  describe('game content management', () => {
    it('should get game content by ID and age group', async () => {
      const mockGameContent = {
        id: 'content-123',
        gameId: 'math-addition',
        ageGroup: '6-8',
        difficulty: 'easy',
        title: 'Addition Practice',
        description: 'Learn basic addition'
      };

      mockTable.first.mockResolvedValue(mockGameContent);
      mockTable.where.mockReturnValue({ equals: vi.fn().mockReturnValue({ and: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue(mockGameContent) }) }) });

      const result = await dbService.getGameContent('math-addition', '6-8', 'easy');

      expect(result).toEqual(mockGameContent);
    });

    it('should get games by subject and age group', async () => {
      const mockGames = [
        {
          id: 'content-1',
          subject: 'mathematics',
          ageGroup: '6-8',
          title: 'Math Game 1'
        },
        {
          id: 'content-2',
          subject: 'mathematics',
          ageGroup: '6-8',
          title: 'Math Game 2'
        }
      ];

      mockTable.toArray.mockResolvedValue(mockGames);
      mockTable.where.mockReturnValue({ equals: vi.fn().mockReturnValue({ and: vi.fn().mockReturnValue({ toArray: vi.fn().mockResolvedValue(mockGames) }) }) });

      const result = await dbService.getGamesBySubject('mathematics', '6-8');

      expect(result).toEqual(mockGames);
      expect(result).toHaveLength(2);
    });

    it('should search game content', async () => {
      const mockSearchResults = [
        {
          id: 'content-1',
          ageGroup: '6-8',
          title: 'Addition Adventure',
          description: 'Learn addition through games',
          metadata: { skillTags: ['addition', 'math'] }
        }
      ];

      mockTable.toArray.mockResolvedValue(mockSearchResults);
      mockTable.filter.mockReturnValue({ toArray: vi.fn().mockResolvedValue(mockSearchResults) });

      const result = await dbService.searchGameContent('addition', '6-8');

      expect(result).toEqual(mockSearchResults);
    });
  });

  describe('game session management', () => {
    it('should start a game session', async () => {
      mockTable.add.mockResolvedValue('session-123');

      const result = await dbService.startGameSession('user-123', 'math-game', 'content-123');

      expect(mockTable.add).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user-123',
        gameId: 'math-game',
        gameContentId: 'content-123',
        status: 'active',
        isCompleted: false
      }));
      expect(result).toMatch(/^session-/);
    });

    it('should update a game session', async () => {
      mockTable.update.mockResolvedValue(1);

      const updates = { score: 100, currentQuestionIndex: 5 };
      await dbService.updateGameSession('session-123', updates);

      expect(mockTable.update).toHaveBeenCalledWith('session-123', updates);
    });

    it('should complete a game session', async () => {
      const mockSession: GameSession = {
        id: 'session-123',
        userId: 'user-123',
        gameId: 'math-game',
        gameContentId: 'content-123',
        startTime: new Date(),
        currentQuestionIndex: 10,
        score: 80,
        totalQuestions: 10,
        correctAnswers: 8,
        hintsUsed: 1,
        timeElapsed: 300,
        answers: [],
        isCompleted: false,
        isPaused: false,
        status: 'active',
        metadata: {
          difficulty: 'medium',
          averageResponseTime: 30,
          streakCount: 3,
          mistakePattern: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockTable.get.mockResolvedValue(mockSession);
      mockTable.update.mockResolvedValue(1);
      mockTable.first.mockResolvedValue(null); // No existing progress

      await dbService.completeGameSession('session-123', 100, 0.8);

      expect(mockTable.update).toHaveBeenCalledWith('session-123', expect.objectContaining({
        endTime: expect.any(Date),
        isCompleted: true,
        score: 100
      }));
    });

    it('should create game session with custom data', async () => {
      const sessionData = {
        id: 'session-456',
        userId: 'user-123',
        gameId: 'english-game',
        gameContentId: 'content-456',
        startTime: new Date(),
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: 5,
        correctAnswers: 0,
        hintsUsed: 0,
        timeElapsed: 0,
        answers: [],
        isCompleted: false,
        isPaused: false,
        status: 'active' as const,
        metadata: {
          difficulty: 'easy' as const,
          averageResponseTime: 0,
          streakCount: 0,
          mistakePattern: []
        }
      };

      mockTable.add.mockResolvedValue('session-456');

      const result = await dbService.createGameSession(sessionData);

      expect(mockTable.add).toHaveBeenCalledWith(expect.objectContaining({
        ...sessionData,
        status: 'active',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      }));
      expect(result).toBe('session-456');
    });
  });

  describe('analytics and tracking', () => {
    it('should track an event', async () => {
      mockTable.add.mockResolvedValue('event-123');

      await dbService.trackEvent('user-123', 'game_completed', { score: 100, time: 300 }, 'session-123');

      expect(mockTable.add).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user-123',
        eventType: 'game_completed',
        eventData: { score: 100, time: 300 },
        sessionId: 'session-123',
        timestamp: expect.any(Date)
      }));
    });

    it('should get daily metrics', async () => {
      const mockMetrics = {
        id: 'metrics-123',
        userId: 'user-123',
        date: new Date(),
        timeSpent: 1800,
        gamesPlayed: 5,
        averageScore: 85
      };

      mockTable.first.mockResolvedValue(mockMetrics);
      mockTable.where.mockReturnValue({ equals: vi.fn().mockReturnValue({ and: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue(mockMetrics) }) }) });

      const result = await dbService.getDailyMetrics('user-123', new Date());

      expect(result).toEqual(mockMetrics);
    });

    it('should get daily usage for a child', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          profileId: 'profile-123',
          startTime: new Date(),
          endTime: new Date(Date.now() + 1800000), // 30 minutes
          status: 'completed'
        },
        {
          id: 'session-2',
          profileId: 'profile-123',
          startTime: new Date(),
          endTime: new Date(Date.now() + 1200000), // 20 minutes
          status: 'completed'
        }
      ];

      mockTable.toArray.mockResolvedValue(mockSessions);
      mockTable.where.mockReturnValue({ equals: vi.fn().mockReturnValue({ and: vi.fn().mockReturnValue({ toArray: vi.fn().mockResolvedValue(mockSessions) }) }) });

      const result = await dbService.getDailyUsage('profile-123');

      expect(result).toBeGreaterThan(0); // Should return some usage time
    });
  });

  describe('authentication methods', () => {
    it('should authenticate user with email and password', async () => {
      const mockUser: User = {
        id: 'user-123',
        type: 'parent',
        email: 'test@example.com',
        passwordHash: 'random-salt:pbkdf2-hash',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockTable.first.mockResolvedValue(mockUser);
      mockTable.where.mockReturnValue({ equals: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue(mockUser) }) });

      const result = await dbService.authenticateUser('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('should return error for non-existent user', async () => {
      mockTable.first.mockResolvedValue(undefined);
      mockTable.where.mockReturnValue({ equals: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue(undefined) }) });

      const result = await dbService.authenticateUser('nonexistent@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });

    it('should verify child PIN', async () => {
      const mockChild: ChildProfile = {
        id: 'profile-123',
        userId: 'child-123',
        name: 'Test Child',
        ageGroup: '6-8',
        avatar: {
          id: 'avatar-1',
          emoji: '🐻',
          name: 'Bear',
          colorScheme: 'blue',
          unlocked: true
        },
        avatarPin: 'random-salt:pbkdf2-hash',
        preferences: {
          soundEnabled: true,
          musicVolume: 0.7,
          effectsVolume: 0.8,
          subtitlesEnabled: false,
          colorMode: 'bright',
          fontSize: 'medium',
          animationSpeed: 'normal'
        },
        parentalControls: {
          dailyTimeLimit: 60,
          allowedSubjects: ['mathematics'],
          maxDifficultyLevel: 'medium',
          requireAdultForSettings: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockTable.get.mockResolvedValue(mockChild);

      const result = await dbService.verifyChildPin('profile-123', '1234');

      expect(mockTable.get).toHaveBeenCalledWith('profile-123');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('profile management', () => {
    it('should get parent profile by user ID', async () => {
      const mockProfile: ParentProfile = {
        id: 'profile-123',
        userId: 'parent-123',
        firstName: 'John',
        lastName: 'Doe',
        children: ['child-1', 'child-2'],
        timezone: 'America/New_York',
        preferences: {
          emailNotifications: true,
          weeklyReports: true,
          achievementAlerts: true
        },
        subscriptionTier: 'free',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockTable.first.mockResolvedValue(mockProfile);
      mockTable.where.mockReturnValue({ equals: vi.fn().mockReturnValue({ first: vi.fn().mockResolvedValue(mockProfile) }) });

      const result = await dbService.getParentProfile('parent-123');

      expect(result).toEqual(mockProfile);
    });

    it('should get child profile by ID', async () => {
      const mockProfile: ChildProfile = {
        id: 'profile-123',
        userId: 'child-123',
        name: 'Test Child',
        ageGroup: '6-8',
        avatar: {
          id: 'avatar-1',
          emoji: '🐻',
          name: 'Bear',
          colorScheme: 'blue',
          unlocked: true
        },
        preferences: {
          soundEnabled: true,
          musicVolume: 0.7,
          effectsVolume: 0.8,
          subtitlesEnabled: false,
          colorMode: 'bright',
          fontSize: 'medium',
          animationSpeed: 'normal'
        },
        parentalControls: {
          dailyTimeLimit: 60,
          allowedSubjects: ['mathematics'],
          maxDifficultyLevel: 'medium',
          requireAdultForSettings: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockTable.get.mockResolvedValue(mockProfile);

      const result = await dbService.getChildProfile('profile-123');

      expect(result).toEqual(mockProfile);
    });

    it('should update child profile', async () => {
      mockTable.update.mockResolvedValue(1);

      const updates = {
        name: 'Updated Child Name',
        avatar: {
          id: 'avatar-2',
          emoji: '🐱',
          name: 'Cat',
          colorScheme: 'orange',
          unlocked: true
        }
      };

      await dbService.updateChildProfile('profile-123', updates);

      expect(mockTable.update).toHaveBeenCalledWith('profile-123', expect.objectContaining({
        ...updates,
        updatedAt: expect.any(Date)
      }));
    });
  });

  describe('service lifecycle', () => {
    it('should destroy service and clean up resources', () => {
      // The destroy method clears intervals
      expect(() => dbService.destroy()).not.toThrow();
    });

    it('should handle service instantiation correctly', () => {
      // Test that the singleton behaves correctly
      const instance = DatabaseService.getInstance();
      expect(instance).toBe(dbService);
      expect(instance).toBeInstanceOf(DatabaseService);
    });
  });

  describe('error handling', () => {
    it('should handle database operation errors gracefully', async () => {
      const error = new Error('Database operation failed');
      mockTable.get.mockRejectedValue(error);

      const result = await dbService.getUser('invalid-id');

      expect(result).toBeNull();
    });

    it('should handle authentication errors', async () => {
      mockTable.first.mockRejectedValue(new Error('Database error'));
      mockTable.where.mockReturnValue({ equals: vi.fn().mockReturnValue({ first: vi.fn().mockRejectedValue(new Error('Database error')) }) });

      const result = await dbService.authenticateUser('test@example.com', 'password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication failed');
    });
  });
});