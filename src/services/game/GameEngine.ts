import { Subject, AgeGroup, DifficultyLevel } from '@/types';
import { GameContent, Question, GameSession } from '../database/schema';
import { contentFactory } from '../content/ContentFactory';
import { databaseService } from '../database/DatabaseService';

export interface GameState {
  sessionId: string;
  gameId: string;
  currentQuestionIndex: number;
  score: number;
  streak: number;
  timeElapsed: number;
  isCompleted: boolean;
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeSpent: number;
    hints: number;
  }>;
  difficulty: DifficultyLevel;
  adaptiveDifficulty: number; // 1-10 scale
}

export interface GameEngineConfig {
  adaptiveDifficulty: boolean;
  antiCheat: boolean;
  timeTracking: boolean;
  hintSystem: boolean;
  maxHints: number;
  sessionTimeout: number;
}

export interface ScoreCalculation {
  baseScore: number;
  timeBonus: number;
  streakBonus: number;
  difficultyBonus: number;
  totalScore: number;
  xpEarned: number;
}

export class GameEngine {
  private static instance: GameEngine;
  private currentGame: GameState | null = null;
  private config: GameEngineConfig;
  private sessionStartTime: number = 0;
  private suspiciousActivity: Array<{ type: string; timestamp: number; details: any }> = [];

  private constructor(config: Partial<GameEngineConfig> = {}) {
    this.config = {
      adaptiveDifficulty: true,
      antiCheat: true,
      timeTracking: true,
      hintSystem: true,
      maxHints: 3,
      sessionTimeout: 300000, // 5 minutes
      ...config,
    };
  }

  static getInstance(config?: Partial<GameEngineConfig>): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine(config);
    }
    return GameEngine.instance;
  }

  // === GAME SESSION MANAGEMENT ===

  async startGame(
    gameId: string,
    userId: string,
    ageGroup: AgeGroup,
    difficulty: DifficultyLevel
  ): Promise<GameState> {
    try {
      console.log(`🎮 Starting game: ${gameId} for user: ${userId}`);

      // Load game content
      const content = await contentFactory.loadGameContent(gameId, ageGroup, difficulty);
      if (!content) {
        throw new Error(`Failed to load content for game: ${gameId}`);
      }

      // Validate content
      const validation = contentFactory.validateContent(content);
      if (!validation.isValid) {
        throw new Error(`Invalid content: ${validation.errors.join(', ')}`);
      }

      // Create game session
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const gameSession: GameSession = {
        id: sessionId,
        userId,
        gameId,
        gameContentId: content.id,
        startTime: new Date(),
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        isCompleted: false,
        status: 'active' as const,
        isPaused: false,
        totalQuestions: content.questions.length,
        correctAnswers: 0,
        hintsUsed: 0,
        timeElapsed: 0,
        metadata: {
          difficulty,
          averageResponseTime: 0,
          streakCount: 0,
          mistakePattern: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await databaseService.createGameSession(gameSession);

      // Initialize game state
      this.currentGame = {
        sessionId,
        gameId,
        currentQuestionIndex: 0,
        score: 0,
        streak: 0,
        timeElapsed: 0,
        isCompleted: false,
        answers: [],
        difficulty,
        adaptiveDifficulty: this.getDifficultyNumeric(difficulty),
      };

      this.sessionStartTime = Date.now();
      this.suspiciousActivity = [];

      console.log(`✅ Game started successfully:`, this.currentGame);
      return this.currentGame;

    } catch (error) {
      console.error('Failed to start game:', error);
      throw error;
    }
  }

  async submitAnswer(
    questionId: string,
    answer: string,
    timeSpent: number,
    hintsUsed: number = 0
  ): Promise<{
    isCorrect: boolean;
    scoreUpdate: ScoreCalculation;
    newDifficulty?: DifficultyLevel;
    gameState: GameState;
  }> {
    if (!this.currentGame) {
      throw new Error('No active game session');
    }

    try {
      // Anti-cheat validation
      if (this.config.antiCheat) {
        this.validateAnswer(timeSpent, hintsUsed);
      }

      // Get current question
      const content = await this.getCurrentContent();
      const currentQuestion = content.questions[this.currentGame.currentQuestionIndex];

      if (currentQuestion.id !== questionId) {
        throw new Error('Question ID mismatch');
      }

      const isCorrect = currentQuestion.correctAnswer === answer;

      // Calculate score
      const scoreCalculation = this.calculateScore(
        currentQuestion,
        isCorrect,
        timeSpent,
        hintsUsed,
        this.currentGame.streak
      );

      // Update streak
      if (isCorrect) {
        this.currentGame.streak++;
      } else {
        this.currentGame.streak = 0;
      }

      // Record answer
      const answerRecord = {
        questionId,
        answer,
        isCorrect,
        timeSpent,
        hints: hintsUsed,
      };

      this.currentGame.answers.push(answerRecord);
      this.currentGame.score += scoreCalculation.totalScore;
      this.currentGame.timeElapsed = Date.now() - this.sessionStartTime;
      this.currentGame.currentQuestionIndex++;

      // Check if game is completed
      if (this.currentGame.currentQuestionIndex >= content.questions.length) {
        await this.completeGame();
      }

      // Adaptive difficulty adjustment
      let newDifficulty: DifficultyLevel | undefined;
      if (this.config.adaptiveDifficulty) {
        newDifficulty = this.adjustDifficulty(isCorrect, timeSpent);
      }

      // Update database
      await this.updateGameSession();

      // Track analytics
      await this.trackGameEvent('answer_submitted', {
        questionId,
        isCorrect,
        timeSpent,
        hintsUsed,
        score: scoreCalculation.totalScore,
      });

      return {
        isCorrect,
        scoreUpdate: scoreCalculation,
        newDifficulty,
        gameState: { ...this.currentGame },
      };

    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  async useHint(questionId: string): Promise<{ hint: string; hintsRemaining: number }> {
    if (!this.currentGame) {
      throw new Error('No active game session');
    }

    const content = await this.getCurrentContent();
    const currentQuestion = content.questions[this.currentGame.currentQuestionIndex];

    if (currentQuestion.id !== questionId) {
      throw new Error('Question ID mismatch');
    }

    const currentAnswer = this.currentGame.answers.find(a => a.questionId === questionId);
    const hintsUsed = currentAnswer?.hints || 0;

    if (hintsUsed >= this.config.maxHints) {
      throw new Error('Maximum hints exceeded');
    }

    await this.trackGameEvent('hint_used', { questionId, hintsUsed: hintsUsed + 1 });

    return {
      hint: currentQuestion.hint || 'No hint available',
      hintsRemaining: this.config.maxHints - hintsUsed - 1,
    };
  }

  async pauseGame(): Promise<void> {
    if (!this.currentGame) return;

    await this.trackGameEvent('game_paused', {
      currentQuestionIndex: this.currentGame.currentQuestionIndex,
      timeElapsed: this.currentGame.timeElapsed,
    });

    await this.updateGameSession();
  }

  async resumeGame(): Promise<GameState | null> {
    if (!this.currentGame) return null;

    await this.trackGameEvent('game_resumed', {
      currentQuestionIndex: this.currentGame.currentQuestionIndex,
    });

    return { ...this.currentGame };
  }

  async endGame(): Promise<{ finalScore: number; analytics: any }> {
    if (!this.currentGame) {
      throw new Error('No active game session');
    }

    const analytics = await this.generateGameAnalytics();
    const finalScore = this.currentGame.score;

    await this.completeGame();
    await this.trackGameEvent('game_ended', { finalScore, analytics });

    const result = { finalScore, analytics };
    this.currentGame = null;

    return result;
  }

  // === ADAPTIVE DIFFICULTY SYSTEM ===

  private adjustDifficulty(isCorrect: boolean, timeSpent: number): DifficultyLevel | undefined {
    if (!this.currentGame) return;

    const targetTime = 30000; // 30 seconds baseline
    const timeRatio = timeSpent / targetTime;

    // Adjust adaptive difficulty score (1-10)
    if (isCorrect) {
      if (timeRatio < 0.5) {
        // Very fast correct answer - increase difficulty
        this.currentGame.adaptiveDifficulty = Math.min(10, this.currentGame.adaptiveDifficulty + 0.5);
      } else if (timeRatio < 1) {
        // Normal speed correct answer - slight increase
        this.currentGame.adaptiveDifficulty = Math.min(10, this.currentGame.adaptiveDifficulty + 0.2);
      }
    } else {
      // Incorrect answer - decrease difficulty
      if (timeRatio > 2) {
        // Very slow incorrect answer - significant decrease
        this.currentGame.adaptiveDifficulty = Math.max(1, this.currentGame.adaptiveDifficulty - 0.8);
      } else {
        // Normal speed incorrect answer - moderate decrease
        this.currentGame.adaptiveDifficulty = Math.max(1, this.currentGame.adaptiveDifficulty - 0.3);
      }
    }

    // Convert numeric difficulty back to level
    const newDifficulty = this.getNumericDifficulty(this.currentGame.adaptiveDifficulty);

    if (newDifficulty !== this.currentGame.difficulty) {
      this.currentGame.difficulty = newDifficulty;
      return newDifficulty;
    }

    return undefined;
  }

  private getDifficultyNumeric(difficulty: DifficultyLevel): number {
    const mapping: Record<DifficultyLevel, number> = { easy: 3, medium: 5, hard: 8, adaptive: 5 };
    return mapping[difficulty] || 5;
  }

  private getNumericDifficulty(score: number): DifficultyLevel {
    if (score <= 4) return 'easy';
    if (score <= 7) return 'medium';
    return 'hard';
  }

  // === ANTI-CHEAT SYSTEM ===

  private validateAnswer(timeSpent: number, hintsUsed: number): void {
    const suspiciousFlags: string[] = [];

    // Check for impossibly fast answers
    if (timeSpent < 1000) {
      suspiciousFlags.push('answer_too_fast');
    }

    // Check for pattern in timing
    if (this.currentGame!.answers.length >= 3) {
      const recentTimes = this.currentGame!.answers.slice(-3).map(a => a.timeSpent);
      const avgTime = recentTimes.reduce((sum, time) => sum + time, 0) / recentTimes.length;
      const variance = recentTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / recentTimes.length;

      if (variance < 100) { // Very consistent timing
        suspiciousFlags.push('consistent_timing_pattern');
      }
    }

    // Check for excessive hint usage
    if (hintsUsed > this.config.maxHints) {
      suspiciousFlags.push('excessive_hints');
    }

    // Log suspicious activity
    if (suspiciousFlags.length > 0) {
      this.suspiciousActivity.push({
        type: 'answer_validation',
        timestamp: Date.now(),
        details: { suspiciousFlags, timeSpent, hintsUsed },
      });

      console.warn('🚨 Suspicious activity detected:', suspiciousFlags);
    }
  }

  // === SCORING SYSTEM ===

  private calculateScore(
    question: Question,
    isCorrect: boolean,
    timeSpent: number,
    hintsUsed: number,
    currentStreak: number
  ): ScoreCalculation {
    if (!isCorrect) {
      return {
        baseScore: 0,
        timeBonus: 0,
        streakBonus: 0,
        difficultyBonus: 0,
        totalScore: 0,
        xpEarned: 1, // Participation XP
      };
    }

    const baseScore = question.points || 10;

    // Time bonus (faster = higher bonus)
    const maxTime = question.timeLimit || 60;
    const timeRatio = Math.max(0, (maxTime - timeSpent) / maxTime);
    const timeBonus = Math.floor(baseScore * 0.5 * timeRatio);

    // Streak bonus
    const streakBonus = Math.min(currentStreak * 2, baseScore * 0.3);

    // Difficulty bonus
    const difficultyMultiplier: Record<DifficultyLevel, number> = { easy: 1, medium: 1.2, hard: 1.5, adaptive: 1.2 };
    const difficultyBonus = Math.floor(baseScore * (difficultyMultiplier[this.currentGame!.difficulty] - 1));

    // Hint penalty
    const hintPenalty = hintsUsed * Math.floor(baseScore * 0.1);

    const totalScore = Math.max(1, baseScore + timeBonus + streakBonus + difficultyBonus - hintPenalty);
    const xpEarned = Math.floor(totalScore * 1.5);

    return {
      baseScore,
      timeBonus,
      streakBonus,
      difficultyBonus,
      totalScore,
      xpEarned,
    };
  }

  // === ANALYTICS SYSTEM ===

  private async generateGameAnalytics() {
    if (!this.currentGame) return {};

    const answers = this.currentGame.answers;
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;

    const avgTimePerQuestion = answers.length > 0
      ? answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length
      : 0;

    const hintsUsed = answers.reduce((sum, a) => sum + a.hints, 0);

    const difficultyProgression = this.trackDifficultyProgression();

    return {
      sessionId: this.currentGame.sessionId,
      gameId: this.currentGame.gameId,
      totalQuestions,
      correctAnswers,
      accuracy: Math.round(accuracy * 100),
      finalScore: this.currentGame.score,
      maxStreak: Math.max(...this.getStreakHistory()),
      avgTimePerQuestion: Math.round(avgTimePerQuestion),
      totalHintsUsed: hintsUsed,
      totalTimeElapsed: this.currentGame.timeElapsed,
      difficultyProgression,
      suspiciousActivity: this.suspiciousActivity.length,
      adaptiveDifficultyRange: {
        start: this.getDifficultyNumeric(this.currentGame.difficulty),
        end: this.currentGame.adaptiveDifficulty,
      },
    };
  }

  private trackDifficultyProgression(): Array<{ questionIndex: number; difficulty: number }> {
    // This would track how difficulty changed throughout the game
    return []; // Simplified for now
  }

  private getStreakHistory(): number[] {
    if (!this.currentGame) return [0];

    const streaks: number[] = [0];
    let currentStreak = 0;

    for (const answer of this.currentGame.answers) {
      if (answer.isCorrect) {
        currentStreak++;
      } else {
        currentStreak = 0;
      }
      streaks.push(currentStreak);
    }

    return streaks;
  }

  private async trackGameEvent(eventType: string, data: any): Promise<void> {
    const event = {
      sessionId: this.currentGame?.sessionId,
      eventType,
      timestamp: new Date(),
      data,
    };

    // Store in analytics (simplified - could be enhanced with proper analytics service)
    console.log('📊 Game event:', event);
  }

  // === UTILITY METHODS ===

  private async getCurrentContent(): Promise<GameContent> {
    if (!this.currentGame) {
      throw new Error('No active game session');
    }

    const session = await databaseService.getGameSession(this.currentGame.sessionId);
    if (!session) {
      throw new Error('Game session not found');
    }

    const content = await databaseService.getGameContent(
      this.currentGame.gameId,
      '6-8' as AgeGroup,
      this.currentGame.difficulty
    );

    if (!content) {
      throw new Error('Game content not found');
    }

    return content;
  }

  private async updateGameSession(): Promise<void> {
    if (!this.currentGame) return;

    const updates = {
      currentQuestionIndex: this.currentGame.currentQuestionIndex,
      score: this.currentGame.score,
      isCompleted: this.currentGame.isCompleted,
      updatedAt: new Date()
    };

    await databaseService.updateGameSession(this.currentGame.sessionId, updates);
  }

  private async completeGame(): Promise<void> {
    if (!this.currentGame) return;

    this.currentGame.isCompleted = true;
    this.currentGame.timeElapsed = Date.now() - this.sessionStartTime;

    const analytics = await this.generateGameAnalytics();

    await databaseService.updateGameSession(this.currentGame.sessionId, {
      isCompleted: true,
      endTime: new Date(),
      score: this.currentGame.score,
      updatedAt: new Date()
    });

    // Track content usage
    contentFactory.trackContentUsage(this.currentGame.gameId, {
      completionRate: this.currentGame.answers.filter(a => a.isCorrect).length / this.currentGame.answers.length,
      averageTime: this.currentGame.timeElapsed / this.currentGame.answers.length,
      difficultyRating: this.currentGame.adaptiveDifficulty,
    });

    await this.trackGameEvent('game_completed', analytics);
  }

  private getDeviceType(): string {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) return 'mobile';
      if (window.innerWidth <= 1024) return 'tablet';
      return 'desktop';
    }
    return 'unknown';
  }

  // === PUBLIC API ===

  getCurrentGameState(): GameState | null {
    return this.currentGame ? { ...this.currentGame } : null;
  }

  getGameConfig(): GameEngineConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<GameEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  async getGameRecommendations(userId: string, subject: Subject, ageGroup: AgeGroup) {
    return contentFactory.getContentRecommendations(userId, subject, ageGroup);
  }

  // Session timeout handling
  isSessionExpired(): boolean {
    if (!this.currentGame || !this.sessionStartTime) return false;
    return (Date.now() - this.sessionStartTime) > this.config.sessionTimeout;
  }

  async handleSessionTimeout(): Promise<void> {
    if (this.currentGame) {
      await this.trackGameEvent('session_timeout', {
        timeElapsed: Date.now() - this.sessionStartTime,
        currentQuestionIndex: this.currentGame.currentQuestionIndex,
      });
      await this.updateGameSession();
      this.currentGame = null;
    }
  }
}

// Export singleton instance
export const gameEngine = GameEngine.getInstance();
export default gameEngine;