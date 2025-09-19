import { describe, it, expect, beforeEach } from 'vitest';
import gameReducer, {
  startGame,
  pauseGame,
  resumeGame,
  endGame,
  updateScore,
  setScore,
  incrementLevel,
  setLevel,
  loseLife,
  gainLife,
  useHint,
  addHint,
  collectReward,
  completeObjective,
  updateTimeElapsed,
  setDifficulty,
  toggleSound,
  toggleMusic,
  toggleHaptic,
  selectGameForStudent,
  updateGameProgress,
  completeGame,
  submitAnswer,
  skipQuestion,
} from './gameSlice';

describe('gameSlice', () => {
  let initialState: any;

  beforeEach(() => {
    initialState = {
      currentGame: null,
      isPlaying: false,
      isPaused: false,
      currentLevel: 1,
      currentScore: 0,
      lives: 3,
      hints: 3,
      timeElapsed: 0,
      collectedRewards: [],
      completedObjectives: [],
      soundEnabled: true,
      musicEnabled: true,
      hapticEnabled: true,
      difficulty: 'adaptive',
      availableGames: [],
      unlockedGames: ['math-addition-1', 'math-subtraction-1', 'english-letters-1'],
      gameProgress: {},
    };
  });

  describe('Game Control Actions', () => {
    it('should start a new game', () => {
      const state = gameReducer(initialState, startGame({
        gameId: 'math-addition-1',
        studentId: 'student-123',
        level: 2,
      }));

      expect(state.isPlaying).toBe(true);
      expect(state.isPaused).toBe(false);
      expect(state.currentLevel).toBe(2);
      expect(state.currentScore).toBe(0);
      expect(state.lives).toBe(3);
      expect(state.hints).toBe(3);
      expect(state.currentGame).toBeDefined();
      expect(state.currentGame?.gameId).toBe('math-addition-1');
      expect(state.currentGame?.studentId).toBe('student-123');
    });

    it('should pause the game', () => {
      const playingState = {
        ...initialState,
        isPlaying: true,
        currentGame: { id: 'test-game' },
      };

      const state = gameReducer(playingState, pauseGame());

      expect(state.isPaused).toBe(true);
      expect(state.currentGame?.pausedTime).toBeDefined();
    });

    it('should resume the game', () => {
      const pausedState = {
        ...initialState,
        isPlaying: true,
        isPaused: true,
        currentGame: { id: 'test-game', pausedTime: new Date() },
      };

      const state = gameReducer(pausedState, resumeGame());

      expect(state.isPaused).toBe(false);
      expect(state.currentGame?.pausedTime).toBeUndefined();
    });

    it('should end the game', () => {
      const playingState = {
        ...initialState,
        isPlaying: true,
        currentGame: { id: 'test-game' },
        currentScore: 100,
        timeElapsed: 300,
      };

      const state = gameReducer(playingState, endGame());

      expect(state.currentGame).toBeNull();
      expect(state.isPlaying).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.timeElapsed).toBe(0);
    });
  });

  describe('Score and Level Actions', () => {
    it('should update score incrementally', () => {
      const state = gameReducer(initialState, updateScore(50));

      expect(state.currentScore).toBe(50);
    });

    it('should set score absolutely', () => {
      const stateWithScore = { ...initialState, currentScore: 100 };
      const state = gameReducer(stateWithScore, setScore(250));

      expect(state.currentScore).toBe(250);
    });

    it('should increment level', () => {
      const state = gameReducer(initialState, incrementLevel());

      expect(state.currentLevel).toBe(2);
    });

    it('should set level absolutely', () => {
      const state = gameReducer(initialState, setLevel(5));

      expect(state.currentLevel).toBe(5);
    });
  });

  describe('Lives and Hints Actions', () => {
    it('should lose a life', () => {
      const state = gameReducer(initialState, loseLife());

      expect(state.lives).toBe(2);
    });

    it('should not go below 0 lives', () => {
      const noLivesState = { ...initialState, lives: 0 };
      const state = gameReducer(noLivesState, loseLife());

      expect(state.lives).toBe(0);
    });

    it('should gain a life', () => {
      const state = gameReducer(initialState, gainLife());

      expect(state.lives).toBe(4);
    });

    it('should use a hint', () => {
      const state = gameReducer(initialState, useHint());

      expect(state.hints).toBe(2);
    });

    it('should not use hint when none available', () => {
      const noHintsState = { ...initialState, hints: 0 };
      const state = gameReducer(noHintsState, useHint());

      expect(state.hints).toBe(0);
    });

    it('should add hints', () => {
      const state = gameReducer(initialState, addHint(2));

      expect(state.hints).toBe(5);
    });
  });

  describe('Rewards and Objectives', () => {
    it('should collect a reward', () => {
      const reward = {
        id: 'star',
        type: 'points' as const,
        value: 100,
        name: 'Star Reward',
        description: 'Collected a star',
        icon: '⭐',
        rarity: 'common' as const,
        unlockedAt: new Date()
      };
      const state = gameReducer(initialState, collectReward(reward));

      expect(state.collectedRewards).toContainEqual(reward);
    });

    it('should complete an objective', () => {
      const state = gameReducer(initialState, completeObjective('complete-level-1'));

      expect(state.completedObjectives).toContain('complete-level-1');
    });

    it('should not duplicate completed objectives', () => {
      const stateWithObjective = {
        ...initialState,
        completedObjectives: ['complete-level-1'],
      };

      const state = gameReducer(stateWithObjective, completeObjective('complete-level-1'));

      expect(state.completedObjectives).toHaveLength(1);
    });
  });

  describe('Settings Actions', () => {
    it('should toggle sound', () => {
      const state = gameReducer(initialState, toggleSound());
      expect(state.soundEnabled).toBe(false);

      const state2 = gameReducer(state, toggleSound());
      expect(state2.soundEnabled).toBe(true);
    });

    it('should toggle music', () => {
      const state = gameReducer(initialState, toggleMusic());
      expect(state.musicEnabled).toBe(false);
    });

    it('should toggle haptic', () => {
      const state = gameReducer(initialState, toggleHaptic());
      expect(state.hapticEnabled).toBe(false);
    });

    it('should set difficulty', () => {
      const state = gameReducer(initialState, setDifficulty('hard'));
      expect(state.difficulty).toBe('hard');
    });
  });

  describe('Game Selection and Progress', () => {
    it('should select a game for student', () => {
      const state = gameReducer(initialState, selectGameForStudent({ gameId: 'math-addition-1' }));

      expect(state.currentGame).toBeDefined();
      expect(state.currentGame?.gameId).toBe('math-addition-1');
    });

    it('should update game progress', () => {
      const state = gameReducer(initialState, updateGameProgress({
        gameId: 'math-addition-1',
        progress: 75,
      }));

      expect(state.gameProgress['math-addition-1']).toBe(75);
    });

    it('should complete a game', () => {
      const state = gameReducer(initialState, completeGame({
        gameId: 'math-addition-1',
        score: 1000,
        accuracy: 95,
        timeElapsed: 300,
        questionsAnswered: 10,
        correctAnswers: 9,
        hintsUsed: 1,
        avgResponseTime: 30,
      }));

      expect(state.gameProgress['math-addition-1']).toBe(95);
      expect(state.currentScore).toBe(1000);
      expect(state.isPlaying).toBe(false);
    });

    it('should submit correct answer', () => {
      const state = gameReducer(initialState, submitAnswer({
        gameId: 'math-addition-1',
        questionId: 'q1',
        answer: '4',
        isCorrect: true,
        timeSpent: 10,
        hintsUsed: 0,
      }));

      expect(state.currentScore).toBe(10);
    });

    it('should not increase score for incorrect answer', () => {
      const state = gameReducer(initialState, submitAnswer({
        gameId: 'math-addition-1',
        questionId: 'q1',
        answer: '5',
        isCorrect: false,
        timeSpent: 10,
        hintsUsed: 0,
      }));

      expect(state.currentScore).toBe(0);
    });

    it('should skip a question', () => {
      const stateWithGame = {
        ...initialState,
        currentGame: { gameData: {} },
      };

      const state = gameReducer(stateWithGame, skipQuestion({ questionId: 'q1' }));

      expect(state.currentGame?.gameData.skippedQuestions).toContain('q1');
    });
  });

  describe('Time Management', () => {
    it('should update time elapsed', () => {
      const state = gameReducer(initialState, updateTimeElapsed(120));

      expect(state.timeElapsed).toBe(120);
    });
  });
});