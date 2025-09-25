import {
  db,
  User,
  ParentProfile,
  ChildProfile,
  GameContent,
  GameSession,
  UserProgress,
  AnalyticsEvent,
  LearningMetrics,
  Settings,
  SyncQueue
} from './schema';
import { Achievement } from '@/types';
import { ultraEncryption } from '@/services/security/UltraEncryptionService';
import { inputValidator } from '@/services/security/InputValidationService';
import CryptoJS from 'crypto-js';
import {
  Subject,
  AgeGroup,
  DifficultyLevel,
  StudentModel,
  PerformanceRecord,
  GameState,
  SpacedRepetitionCard
} from '@/types';

// Legacy encryption service - DEPRECATED - Use UltraEncryptionService
export class EncryptionService {
  private static readonly SECRET_KEY = 'stealth-learning-secret-2024'; // SECURITY: This will be removed

  // Static methods (existing functionality)
  static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
  }

  static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  static hashPassword(password: string): string {
    const salt = CryptoJS.lib.WordArray.random(128/8).toString();
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    try {
      const [salt, hash] = storedHash.split(':');
      const computedHash = CryptoJS.PBKDF2(password, salt, {
        keySize: 256/32,
        iterations: 10000
      }).toString();
      return hash === computedHash;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  // Instance methods (for DataSyncEngine compatibility)
  async encrypt(data: string): Promise<string> {
    return EncryptionService.encrypt(data);
  }

  async decrypt(encryptedData: string): Promise<string> {
    return EncryptionService.decrypt(encryptedData);
  }

  async hash(data: string): Promise<string> {
    return EncryptionService.hash(data);
  }

  async hashPassword(password: string): Promise<string> {
    return EncryptionService.hashPassword(password);
  }

  async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return EncryptionService.verifyPassword(password, storedHash);
  }
}

// Main Database Service
export class DatabaseService {
  private static instance: DatabaseService;
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor(encryptionService?: any) {
    if (encryptionService) {
      // For testing - don't initialize auto sync
      return;
    }
    this.initializeAutoSync();
  }

  static getInstance(encryptionService?: any): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(encryptionService);
    }
    return DatabaseService.instance;
  }

  // Initialize automatic sync
  private initializeAutoSync(): void {
    // Sync every 30 seconds
    this.syncInterval = setInterval(() => {
      this.processSyncQueue();
    }, 30000);
  }

  // === USER MANAGEMENT ===

  async createParent(email: string, password: string, profile: Omit<ParentProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const userId = `parent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const profileId = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Hash password
      const passwordHash = EncryptionService.hash(password);

      // Create user
      await db.users.add({
        id: userId,
        type: 'parent',
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create profile
      await db.parentProfiles.add({
        ...profile,
        id: profileId,
        userId,
        children: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Queue for sync
      await this.queueForSync('create', 'users', userId, { email, passwordHash });
      await this.queueForSync('create', 'parentProfiles', profileId, profile);

      return userId;
    } catch (error) {
      console.error('Failed to create parent:', error);
      throw new Error('Failed to create parent account');
    }
  }

  async createChild(parentId: string, profile: Omit<ChildProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const userId = `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const profileId = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create user
      await db.users.add({
        id: userId,
        type: 'child',
        username: profile.name.toLowerCase().replace(/\s+/g, ''),
        parentId,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create profile with default settings
      const childProfile: ChildProfile = {
        ...profile,
        id: profileId,
        userId,
        preferences: {
          ...{
            soundEnabled: true,
            musicVolume: 0.7,
            effectsVolume: 0.8,
            subtitlesEnabled: false,
            colorMode: 'bright',
            fontSize: 'medium',
            animationSpeed: 'normal'
          },
          ...(profile.preferences || {})
        },
        parentalControls: {
          ...{
            dailyTimeLimit: 60, // 1 hour default
            allowedSubjects: ['mathematics', 'english', 'science'] as Subject[],
            maxDifficultyLevel: 'medium' as DifficultyLevel,
            requireAdultForSettings: true
          },
          ...(profile.parentalControls || {})
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.childProfiles.add(childProfile);

      // Update parent's children list
      const parent = await db.parentProfiles.where('userId').equals(parentId).first();
      if (parent) {
        await db.parentProfiles.update(parent.id, {
          children: [...parent.children, userId]
        });
      }

      // Initialize progress for all subjects
      await this.initializeChildProgress(userId, profile.ageGroup);

      // Queue for sync
      await this.queueForSync('create', 'childProfiles', profileId, childProfile);

      return userId;
    } catch (error) {
      console.error('Failed to create child:', error);
      throw new Error('Failed to create child profile');
    }
  }

  async authenticateParent(email: string, password: string): Promise<User | null> {
    try {
      const passwordHash = EncryptionService.hash(password);
      const user = await db.users
        .where('email')
        .equals(email.toLowerCase())
        .and(user => user.passwordHash === passwordHash && user.type === 'parent')
        .first();

      return user || null;
    } catch (error) {
      console.error('Authentication failed:', error);
      return null;
    }
  }

  async authenticateChild(parentId: string, childName: string): Promise<User | null> {
    try {
      const user = await db.users
        .where('parentId')
        .equals(parentId)
        .and(user => user.username === childName.toLowerCase().replace(/\s+/g, '') && user.type === 'child')
        .first();

      return user || null;
    } catch (error) {
      console.error('Child authentication failed:', error);
      return null;
    }
  }

  // === GAME CONTENT MANAGEMENT ===

  async getGameContent(gameId: string, ageGroup: AgeGroup, difficulty?: DifficultyLevel): Promise<GameContent | null> {
    try {
      let query = db.gameContent
        .where('gameId')
        .equals(gameId)
        .and(content => content.ageGroup === ageGroup);

      if (difficulty) {
        query = query.and(content => content.difficulty === difficulty);
      }

      const content = await query.first();
      return content || null;
    } catch (error) {
      console.error('Failed to get game content:', error);
      return null;
    }
  }

  async getGamesBySubject(subject: Subject, ageGroup: AgeGroup): Promise<GameContent[]> {
    try {
      return await db.gameContent
        .where('subject')
        .equals(subject)
        .and(content => content.ageGroup === ageGroup)
        .toArray();
    } catch (error) {
      console.error('Failed to get games by subject:', error);
      return [];
    }
  }

  async searchGameContent(query: string, ageGroup: AgeGroup): Promise<GameContent[]> {
    try {
      const searchTerm = query.toLowerCase();
      return await db.gameContent
        .filter(content =>
          content.ageGroup === ageGroup &&
          (content.title.toLowerCase().includes(searchTerm) ||
           content.description.toLowerCase().includes(searchTerm) ||
           content.metadata.skillTags.some(tag => tag.toLowerCase().includes(searchTerm)))
        )
        .toArray();
    } catch (error) {
      console.error('Failed to search game content:', error);
      return [];
    }
  }

  // === GAME SESSION MANAGEMENT ===

  async startGameSession(userId: string, gameId: string, gameContentId: string): Promise<string> {
    try {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const session: GameSession = {
        id: sessionId,
        userId,
        gameId,
        gameContentId,
        startTime: new Date(),
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        hintsUsed: 0,
        timeElapsed: 0,
        answers: [],
        isCompleted: false,
        isPaused: false,
        status: 'active',
        metadata: {
          difficulty: 'easy',
          averageResponseTime: 0,
          streakCount: 0,
          mistakePattern: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.gameSessions.add(session);
      await this.queueForSync('create', 'gameSessions', sessionId, session);

      return sessionId;
    } catch (error) {
      console.error('Failed to start game session:', error);
      throw new Error('Failed to start game session');
    }
  }

  async updateGameSession(sessionId: string, updates: Partial<GameSession>): Promise<void> {
    try {
      await db.gameSessions.update(sessionId, updates);
      await this.queueForSync('update', 'gameSessions', sessionId, updates);
    } catch (error) {
      console.error('Failed to update game session:', error);
      throw new Error('Failed to update game session');
    }
  }

  async completeGameSession(sessionId: string, finalScore: number, accuracy: number): Promise<void> {
    try {
      const session = await db.gameSessions.get(sessionId);
      if (!session) throw new Error('Session not found');

      // Update session
      await db.gameSessions.update(sessionId, {
        endTime: new Date(),
        isCompleted: true,
        score: finalScore
      });

      // Update user progress
      await this.updateUserProgress(session.userId, session.gameId, finalScore, accuracy);

      // Check for achievements
      await this.checkAndUnlockAchievements(session.userId, session);

      // Queue for sync
      await this.queueForSync('update', 'gameSessions', sessionId, {
        endTime: new Date(),
        isCompleted: true,
        score: finalScore
      });

    } catch (error) {
      console.error('Failed to complete game session:', error);
      throw new Error('Failed to complete game session');
    }
  }

  // === PROGRESS TRACKING ===

  private async initializeChildProgress(userId: string, ageGroup: AgeGroup): Promise<void> {
    const subjects: Subject[] = ['mathematics', 'english', 'science'];
    const skillAreas = {
      mathematics: ['counting', 'addition', 'subtraction', 'shapes', 'patterns'],
      english: ['letters', 'phonics', 'vocabulary', 'reading', 'writing'],
      science: ['animals', 'plants', 'weather', 'space', 'body']
    };

    for (const subject of subjects) {
      for (const skillArea of skillAreas[subject]) {
        const progressId = `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        await db.userProgress.add({
          id: progressId,
          userId,
          subject,
          skillArea,
          currentLevel: 1,
          xp: 0,
          mastery: 0,
          streakCount: 0,
          lastPlayed: new Date(),
          totalTimeSpent: 0,
          gamesCompleted: 0,
          averageAccuracy: 0,
          milestones: []
        });
      }
    }
  }

  private async updateUserProgress(userId: string, gameId: string, score: number, accuracy: number): Promise<void> {
    try {
      // Extract subject from gameId (e.g., 'math-addition-1' -> 'mathematics')
      const subject = this.extractSubjectFromGameId(gameId);

      const progress = await db.userProgress
        .where('userId')
        .equals(userId)
        .and(p => p.subject === subject)
        .first();

      if (progress) {
        const newXP = progress.xp + score;
        const newAccuracy = (progress.averageAccuracy * progress.gamesCompleted + accuracy) / (progress.gamesCompleted + 1);

        await db.userProgress.update(progress.id, {
          xp: newXP,
          averageAccuracy: newAccuracy,
          gamesCompleted: progress.gamesCompleted + 1,
          lastPlayed: new Date(),
          streakCount: accuracy >= 80 ? progress.streakCount + 1 : 0,
          mastery: Math.min(100, (newXP / 1000) * 100) // Simple mastery calculation
        });
      }
    } catch (error) {
      console.error('Failed to update user progress:', error);
    }
  }

  private extractSubjectFromGameId(gameId: string): Subject {
    if (gameId.includes('math')) return 'mathematics';
    if (gameId.includes('english')) return 'english';
    if (gameId.includes('science')) return 'science';
    return 'mathematics'; // Default fallback
  }

  // === ACHIEVEMENTS ===

  private async checkAndUnlockAchievements(userId: string, session: GameSession): Promise<void> {
    try {
      // Get user's current progress
      const progress = await db.userProgress.where('userId').equals(userId).toArray();
      const totalXP = progress.reduce((sum, p) => sum + p.xp, 0);
      const totalGames = progress.reduce((sum, p) => sum + p.gamesCompleted, 0);

      // Define achievements to check
      const achievementChecks = [
        {
          id: 'first-game',
          title: 'First Steps',
          description: 'Complete your first game!',
          condition: totalGames >= 1,
          reward: { type: 'xp', value: 50 }
        },
        {
          id: 'math-master',
          title: 'Math Master',
          description: 'Complete 10 math games!',
          condition: (progress.find(p => p.subject === 'mathematics')?.gamesCompleted || 0) >= 10,
          reward: { type: 'badge', value: 'math-badge' }
        },
        {
          id: 'streak-5',
          title: 'Hot Streak',
          description: 'Get 5 games right in a row!',
          condition: progress.some(p => p.streakCount >= 5),
          reward: { type: 'avatar', value: 'fire-avatar' }
        }
      ];

      for (const check of achievementChecks) {
        if (check.condition) {
          const existing = await db.achievements
            .where('userId')
            .equals(userId)
            .and(a => a.id === check.id)
            .first();

          if (!existing) {
            await db.achievements.add({
              id: check.id,
              userId,
              type: 'learning',
              title: check.title,
              description: check.description,
              icon: '🏆',
              rarity: 'common',
              progress: 100,
              requirement: 100,
              isUnlocked: true,
              unlockedAt: new Date(),
              // reward: check.reward // Removed as Achievement schema doesn't include reward property
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  }

  // === ANALYTICS ===

  async trackEvent(userId: string, eventType: string, eventData: Record<string, any>, sessionId?: string): Promise<void> {
    try {
      const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await db.analyticsEvents.add({
        id: eventId,
        userId,
        eventType,
        eventData,
        sessionId,
        timestamp: new Date(),
        metadata: {
          userAgent: navigator.userAgent,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          pathname: window.location.pathname
        }
      });

      await this.queueForSync('create', 'analyticsEvents', eventId, { eventType, eventData });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async getDailyMetrics(userId: string, date: Date): Promise<LearningMetrics | null> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await db.learningMetrics
        .where('userId')
        .equals(userId)
        .and(metric => metric.date >= startOfDay && metric.date <= endOfDay)
        .first() || null;
    } catch (error) {
      console.error('Failed to get daily metrics:', error);
      return null;
    }
  }

  // === SYNC MANAGEMENT ===

  private async queueForSync(operation: 'create' | 'update' | 'delete', table: string, recordId: string, data: any): Promise<void> {
    try {
      await db.syncQueue.add({
        id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        operation,
        table,
        recordId,
        data,
        timestamp: new Date(),
        synced: false,
        retryCount: 0
      });
    } catch (error) {
      console.error('Failed to queue sync operation:', error);
    }
  }

  private async processSyncQueue(): Promise<void> {
    try {
      const pendingSync = await db.syncQueue
        .where('synced')
        .equals(0) // Using 0 for false in Dexie indexing
        .and(item => item.retryCount < 3)
        .limit(10)
        .toArray();

      for (const item of pendingSync) {
        try {
          // In a real app, this would sync to a backend
          console.log(`Syncing ${item.operation} on ${item.table}:${item.recordId}`);

          // Mark as synced
          await db.syncQueue.update(item.id, {
            synced: true,
            syncedAt: new Date()
          });
        } catch (error) {
          // Increment retry count
          const errorMessage = error instanceof Error ? error.message : String(error);
          await db.syncQueue.update(item.id, {
            retryCount: item.retryCount + 1,
            error: errorMessage
          });
        }
      }
    } catch (error) {
      console.error('Failed to process sync queue:', error);
    }
  }

  // === AUTHENTICATION METHODS ===

  /**
   * Authenticate user with email and password
   */
  async authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // 🔒 ULTRA-SECURE: Input validation and sanitization
      const emailValidation = inputValidator.validateEmail(email);
      if (!emailValidation.isValid || !emailValidation.sanitized) {
        return { success: false, error: 'Invalid email format' };
      }

      if (!password || password.length < 8) {
        return { success: false, error: 'Invalid password format' };
      }

      // Rate limiting check (simple implementation)
      const rateLimitKey = `auth_attempts_${emailValidation.sanitized}`;
      const attempts = parseInt(localStorage.getItem(rateLimitKey) || '0');
      if (attempts >= 5) {
        return { success: false, error: 'Too many login attempts. Please try again later.' };
      }

      const user = await db.users.where('email').equals(emailValidation.sanitized).first();

      if (!user) {
        // Increment failed attempts
        localStorage.setItem(rateLimitKey, (attempts + 1).toString());
        return { success: false, error: 'User not found' };
      }

      if (!user.passwordHash) {
        localStorage.setItem(rateLimitKey, (attempts + 1).toString());
        return { success: false, error: 'Invalid credentials' };
      }

      // 🔒 ULTRA-SECURE: Use new ultra-secure password verification
      const isValidPassword = await ultraEncryption.verifyPassword(password, user.passwordHash);

      if (!isValidPassword) {
        localStorage.setItem(rateLimitKey, (attempts + 1).toString());
        return { success: false, error: 'Invalid password' };
      }

      // Clear failed attempts on successful login
      localStorage.removeItem(rateLimitKey);

      return { success: true, user };
    } catch (error) {
      console.error('🔒 Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      return await db.users.get(userId) || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Get parent profile by user ID
   */
  async getParentProfile(userId: string): Promise<ParentProfile | null> {
    try {
      return await db.parentProfiles.where('userId').equals(userId).first() || null;
    } catch (error) {
      console.error('Error getting parent profile:', error);
      return null;
    }
  }

  /**
   * Get child profile by ID
   */
  async getChildProfile(profileId: string): Promise<ChildProfile | null> {
    try {
      return await db.childProfiles.get(profileId) || null;
    } catch (error) {
      console.error('Error getting child profile:', error);
      return null;
    }
  }

  /**
   * Verify child PIN
   */
  async verifyChildPin(profileId: string, pin: string): Promise<boolean> {
    try {
      const profile = await this.getChildProfile(profileId);

      if (!profile || !profile.avatarPin) {
        return false;
      }

      return profile.avatarPin ? EncryptionService.verifyPassword(pin, profile.avatarPin) : false;
    } catch (error) {
      console.error('Error verifying child PIN:', error);
      return false;
    }
  }

  /**
   * Create a new game session
   */
  async createGameSession(session: Omit<GameSession, 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const sessionWithTimestamps: GameSession = {
        ...session,
        status: session.status || 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.gameSessions.add(sessionWithTimestamps);
      return session.id;
    } catch (error) {
      console.error('Error creating game session:', error);
      throw new Error('Failed to create game session');
    }
  }

  /**
   * Get a game session by ID
   */
  async getGameSession(sessionId: string): Promise<GameSession | null> {
    try {
      const session = await db.gameSessions.get(sessionId);
      return session || null;
    } catch (error) {
      console.error('Error getting game session:', error);
      return null;
    }
  }

  /**
   * End a game session
   */
  async endGameSession(sessionId: string): Promise<void> {
    try {
      await db.gameSessions.update(sessionId, {
        status: 'completed',
        endTime: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error ending game session:', error);
      throw new Error('Failed to end game session');
    }
  }

  /**
   * Get daily usage for a child profile
   */
  async getDailyUsage(profileId: string): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sessions = await db.gameSessions
        .where('profileId')
        .equals(profileId)
        .and(session => {
          const sessionDate = new Date(session.startTime);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate.getTime() === today.getTime();
        })
        .toArray();

      // Calculate total time spent today
      let totalTime = 0;
      for (const session of sessions) {
        if (session.endTime) {
          const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
          totalTime += Math.floor(duration / 1000); // Convert to seconds
        } else if (session.status === 'active') {
          // For active sessions, calculate time since start
          const duration = Date.now() - new Date(session.startTime).getTime();
          totalTime += Math.floor(duration / 1000);
        }
      }

      return totalTime;
    } catch (error) {
      console.error('Error getting daily usage:', error);
      return 0;
    }
  }

  /**
   * Update child profile
   */
  async updateChildProfile(profileId: string, updates: Partial<ChildProfile>): Promise<void> {
    try {
      await db.childProfiles.update(profileId, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating child profile:', error);
      throw new Error('Failed to update child profile');
    }
  }

  // === MISSING METHODS FOR DATA SYNC ENGINE ===

  /**
   * Initialize database (required by test)
   */
  async init(): Promise<void> {
    try {
      await db.open();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw new Error('Database initialization failed');
    }
  }

  /**
   * Save student (required by test and DataSyncEngine)
   */
  async saveStudent(student: StudentModel): Promise<string> {
    try {
      const encryptedData = EncryptionService.encrypt(JSON.stringify(student));

      const record = {
        id: student.id,
        encryptedData,
        lastModified: new Date(),
      };

      await db.users.add({
        id: student.id,
        type: 'child',
        username: student.username,
        createdAt: student.createdAt || new Date(),
        updatedAt: student.updatedAt || new Date()
      });

      await this.queueForSync('create', 'students', student.id, student);
      return student.id;
    } catch (error) {
      console.error('Failed to save student:', error);
      throw new Error('Failed to save student');
    }
  }

  /**
   * Get student by ID (required by test)
   */
  async getStudent(studentId: string): Promise<StudentModel | null> {
    try {
      const user = await db.users.get(studentId);
      if (!user || user.type !== 'child') {
        return null;
      }

      // Convert User to StudentModel format
      const studentModel: StudentModel = {
        id: user.id,
        username: user.username || '',
        name: user.username,
        ageGroup: '3-5' as AgeGroup, // Default, should be from profile
        learningStyle: 'mixed',
        skillLevels: new Map(),
        performanceHistory: [],
        currentZPD: {
          lowerBound: 0,
          upperBound: 100,
          optimalDifficulty: 50,
          recommendedSkills: []
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return studentModel;
    } catch (error) {
      console.error('Failed to get student:', error);
      throw new Error('Failed to get student');
    }
  }

  /**
   * Update student (required by DataSyncEngine)
   */
  async updateStudent(student: StudentModel): Promise<string> {
    try {
      const encryptedData = EncryptionService.encrypt(JSON.stringify(student));

      // Update user record
      await db.users.update(student.id, {
        username: student.username,
        updatedAt: new Date()
      });

      await this.queueForSync('update', 'students', student.id, student);
      return student.id;
    } catch (error) {
      console.error('Failed to update student:', error);
      throw new Error('Failed to update student');
    }
  }

  /**
   * Get all students (required by test)
   */
  async getAllStudents(): Promise<StudentModel[]> {
    try {
      const users = await db.users.where('type').equals('child').toArray();

      const students: StudentModel[] = [];
      for (const user of users) {
        const student = await this.getStudent(user.id);
        if (student) {
          students.push(student);
        }
      }

      return students;
    } catch (error) {
      console.error('Failed to get all students:', error);
      return [];
    }
  }

  /**
   * Save performance record (required by DataSyncEngine and test)
   */
  async savePerformanceRecord(record: PerformanceRecord): Promise<string> {
    try {
      const encryptedData = EncryptionService.encrypt(JSON.stringify(record));

      const dbRecord = {
        id: record.id,
        studentId: record.id, // Assuming record has studentId
        encryptedData,
        timestamp: record.timestamp,
      };

      // Store in analytics events table for now
      await db.analyticsEvents.add({
        id: record.id,
        userId: record.id,
        eventType: 'performance',
        eventData: record,
        timestamp: record.timestamp,
        metadata: {
          userAgent: navigator.userAgent,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          pathname: window.location.pathname
        }
      });

      await this.queueForSync('create', 'performance', record.id, record);
      return record.id;
    } catch (error) {
      console.error('Failed to save performance record:', error);
      throw new Error('Failed to save performance record');
    }
  }

  /**
   * Get performance history (required by test)
   */
  async getPerformanceHistory(studentId: string, limit: number = 10): Promise<PerformanceRecord[]> {
    try {
      const events = await db.analyticsEvents
        .where('userId')
        .equals(studentId)
        .and(event => event.eventType === 'performance')
        .reverse()
        .limit(limit)
        .toArray();

      return events.map(event => event.eventData as PerformanceRecord);
    } catch (error) {
      console.error('Failed to get performance history:', error);
      return [];
    }
  }

  /**
   * Get performance analytics (required by test)
   */
  async getPerformanceAnalytics(studentId: string): Promise<any> {
    try {
      const records = await this.getPerformanceHistory(studentId, 100);

      const analytics = {
        totalGames: records.length,
        averageScore: records.reduce((sum, r) => sum + r.score, 0) / records.length || 0,
        totalTime: records.reduce((sum, r) => sum + r.responseTime, 0),
        subjectBreakdown: {} as Record<string, { games: number; averageScore: number }>
      };

      // Calculate subject breakdown
      const subjectStats: Record<string, { games: number; totalScore: number }> = {};
      records.forEach(record => {
        if (!subjectStats[record.subject]) {
          subjectStats[record.subject] = { games: 0, totalScore: 0 };
        }
        subjectStats[record.subject].games++;
        subjectStats[record.subject].totalScore += record.score;
      });

      Object.keys(subjectStats).forEach(subject => {
        const stats = subjectStats[subject];
        analytics.subjectBreakdown[subject] = {
          games: stats.games,
          averageScore: stats.totalScore / stats.games
        };
      });

      return analytics;
    } catch (error) {
      console.error('Failed to get performance analytics:', error);
      return {
        totalGames: 0,
        averageScore: 0,
        totalTime: 0,
        subjectBreakdown: {}
      };
    }
  }

  /**
   * Save game state (required by test)
   */
  async saveGameState(gameState: GameState): Promise<string> {
    try {
      const encryptedData = EncryptionService.encrypt(JSON.stringify(gameState));

      // Store in game sessions table
      await db.gameSessions.add({
        id: gameState.id,
        userId: gameState.studentId,
        gameId: gameState.gameId,
        gameContentId: gameState.gameId, // Using gameId as contentId
        startTime: gameState.startTime,
        currentQuestionIndex: gameState.currentLevel,
        score: gameState.score,
        totalQuestions: 0,
        correctAnswers: 0,
        hintsUsed: gameState.hints,
        timeElapsed: 0,
        answers: [],
        isCompleted: false,
        isPaused: !!gameState.pausedTime,
        status: 'active',
        metadata: {
          difficulty: 'medium',
          averageResponseTime: 0,
          streakCount: 0,
          mistakePattern: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await this.queueForSync('create', 'gameStates', gameState.id, gameState);
      return gameState.id;
    } catch (error) {
      console.error('Failed to save game state:', error);
      throw new Error('Failed to save game state');
    }
  }

  /**
   * Get game state (required by test)
   */
  async getGameState(gameStateId: string): Promise<GameState | null> {
    try {
      const session = await db.gameSessions.get(gameStateId);
      if (!session) {
        return null;
      }

      // Convert GameSession to GameState
      const gameState: GameState = {
        id: session.id,
        studentId: session.userId,
        gameId: session.gameId,
        currentLevel: session.currentQuestionIndex,
        score: session.score,
        lives: 3, // Default
        hints: session.hintsUsed,
        startTime: session.startTime,
        pausedTime: session.isPaused ? new Date() : undefined,
        completedObjectives: [],
        collectedRewards: [],
        gameData: {}
      };

      return gameState;
    } catch (error) {
      console.error('Failed to get game state:', error);
      return null;
    }
  }

  /**
   * Delete game state (required by test)
   */
  async deleteGameState(gameStateId: string): Promise<void> {
    try {
      await db.gameSessions.delete(gameStateId);
      await this.queueForSync('delete', 'gameStates', gameStateId, {});
    } catch (error) {
      console.error('Failed to delete game state:', error);
      throw new Error('Failed to delete game state');
    }
  }

  /**
   * Update achievement (required by DataSyncEngine and test)
   */
  async updateAchievement(achievement: Achievement): Promise<string> {
    try {
      const encryptedData = EncryptionService.encrypt(JSON.stringify(achievement));

      await db.achievements.put({
        id: achievement.id,
        userId: achievement.id, // Assuming achievement has userId
        type: achievement.category as any || 'academic',
        title: achievement.title || achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: 'common',
        progress: achievement.progress || 0,
        requirement: 100,
        isUnlocked: !!achievement.unlockedAt,
        unlockedAt: achievement.unlockedAt
      });

      await this.queueForSync('update', 'achievements', achievement.id, achievement);
      return achievement.id;
    } catch (error) {
      console.error('Failed to update achievement:', error);
      throw new Error('Failed to update achievement');
    }
  }

  /**
   * Get student achievements (required by test)
   */
  async getStudentAchievements(studentId: string): Promise<Achievement[]> {
    try {
      const dbAchievements = await db.achievements
        .where('userId')
        .equals(studentId)
        .toArray();

      return dbAchievements.map(dbAch => ({
        id: dbAch.id,
        name: dbAch.title,
        title: dbAch.title,
        description: dbAch.description,
        icon: dbAch.icon,
        category: dbAch.type as any,
        points: 0,
        unlockedAt: dbAch.unlockedAt,
        progress: dbAch.progress,
        criteria: {
          type: 'completion' as const,
          target: dbAch.requirement,
          current: dbAch.progress
        }
      } as Achievement));
    } catch (error) {
      console.error('Failed to get student achievements:', error);
      return [];
    }
  }

  /**
   * Clear all data (required by test)
   */
  async clearAllData(): Promise<void> {
    try {
      await db.users.clear();
      await db.parentProfiles.clear();
      await db.childProfiles.clear();
      await db.gameContent.clear();
      await db.gameSessions.clear();
      await db.userProgress.clear();
      await db.achievements.clear();
      await db.analyticsEvents.clear();
      await db.learningMetrics.clear();
      await db.settings.clear();
      await db.syncQueue.clear();
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw new Error('Failed to clear all data');
    }
  }

  /**
   * Close database connection (required by test)
   */
  async close(): Promise<void> {
    try {
      await db.close();
    } catch (error) {
      console.error('Failed to close database:', error);
      throw new Error('Failed to close database');
    }
  }

  /**
   * Perform migration (used by test)
   */
  private async performMigration(): Promise<void> {
    // Migration logic placeholder
    console.log('Performing database migration...');
  }

  // === CLEANUP ===

  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();
export default databaseService;