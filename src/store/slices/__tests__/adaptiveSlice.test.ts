import { describe, it, expect } from 'vitest';
import adaptiveReducer, {
  setDifficulty,
  adjustDifficulty,
  updatePerformance,
  markSkillMastered,
  markSkillStruggling,
  trackPerformance,
  updateSkillProgress,
  addSpacedRepetitionCard,
  updateSpacedRepetitionCard,
  setCurrentReviewSession,
  calculateDueReviews,
  updateRetentionRate,
  AdaptiveState,
} from '../adaptiveSlice';

describe('adaptiveSlice', () => {
  const initialState: AdaptiveState = {
    currentDifficulty: 1200,
    recommendedContent: [],
    learningPath: [],
    adaptiveMode: 'automatic',
    difficultyRange: {
      min: 800,
      max: 2000,
    },
    performanceThreshold: {
      advance: 80,
      maintain: 60,
      decrease: 40,
    },
    recentPerformance: {
      attempts: 0,
      successes: 0,
      averageResponseTime: 0,
      hintsUsed: 0,
    },
    contentQueue: [],
    masteredSkills: [],
    strugglingSkills: [],
    lastAdjustment: {
      timestamp: null,
      direction: 'maintain',
      reason: '',
    },
    recommendedDifficulty: {
      math: 2,
      english: 2,
      science: 2,
    },
    spacedRepetitionCards: [],
    currentReviewSession: null,
    reviewsDueToday: 0,
    reviewsCompleted: 0,
    averageRetention: 0.75,
  };

  describe('difficulty management', () => {
    it('should set difficulty within range', () => {
      const state = adaptiveReducer(initialState, setDifficulty(1500));
      expect(state.currentDifficulty).toBe(1500);
    });

    it('should clamp difficulty to minimum', () => {
      const state = adaptiveReducer(initialState, setDifficulty(500));
      expect(state.currentDifficulty).toBe(800); // minimum
    });

    it('should clamp difficulty to maximum', () => {
      const state = adaptiveReducer(initialState, setDifficulty(2500));
      expect(state.currentDifficulty).toBe(2000); // maximum
    });

    it('should increase difficulty', () => {
      const state = adaptiveReducer(
        initialState,
        adjustDifficulty({
          direction: 'increase',
          amount: 100,
          reason: 'High performance',
        })
      );

      expect(state.currentDifficulty).toBe(1300);
      expect(state.lastAdjustment.direction).toBe('increase');
      expect(state.lastAdjustment.reason).toBe('High performance');
      expect(state.lastAdjustment.timestamp).toBeInstanceOf(Date);
    });

    it('should decrease difficulty', () => {
      const state = adaptiveReducer(
        initialState,
        adjustDifficulty({
          direction: 'decrease',
          amount: 200,
          reason: 'Low performance',
        })
      );

      expect(state.currentDifficulty).toBe(1000);
      expect(state.lastAdjustment.direction).toBe('decrease');
    });

    it('should maintain difficulty', () => {
      const state = adaptiveReducer(
        initialState,
        adjustDifficulty({
          direction: 'maintain',
          reason: 'Stable performance',
        })
      );

      expect(state.currentDifficulty).toBe(1200);
      expect(state.lastAdjustment.direction).toBe('maintain');
    });
  });

  describe('performance tracking', () => {
    it('should update performance metrics', () => {
      const state = adaptiveReducer(
        initialState,
        updatePerformance({
          success: true,
          responseTime: 3000,
          hintUsed: false,
        })
      );

      expect(state.recentPerformance.attempts).toBe(1);
      expect(state.recentPerformance.successes).toBe(1);
      expect(state.recentPerformance.averageResponseTime).toBe(3000);
      expect(state.recentPerformance.hintsUsed).toBe(0);
    });

    it('should track hints used', () => {
      const state = adaptiveReducer(
        initialState,
        updatePerformance({
          success: true,
          responseTime: 5000,
          hintUsed: true,
        })
      );

      expect(state.recentPerformance.hintsUsed).toBe(1);
    });

    it('should calculate average response time', () => {
      let state = adaptiveReducer(
        initialState,
        updatePerformance({
          success: true,
          responseTime: 2000,
          hintUsed: false,
        })
      );

      state = adaptiveReducer(
        state,
        updatePerformance({
          success: true,
          responseTime: 4000,
          hintUsed: false,
        })
      );

      expect(state.recentPerformance.averageResponseTime).toBe(3000);
    });

    it('should auto-adjust difficulty in automatic mode', () => {
      let state = initialState;

      // Simulate high performance (5 successes out of 5 attempts = 100%)
      for (let i = 0; i < 5; i++) {
        state = adaptiveReducer(
          state,
          updatePerformance({
            success: true,
            responseTime: 2000,
            hintUsed: false,
          })
        );
      }

      expect(state.currentDifficulty).toBe(1230); // increased
      expect(state.lastAdjustment.direction).toBe('increase');
    });

    it('should decrease difficulty for poor performance', () => {
      let state = initialState;

      // Simulate poor performance (1 success out of 5 attempts = 20%)
      state = adaptiveReducer(
        state,
        updatePerformance({
          success: true,
          responseTime: 3000,
          hintUsed: false,
        })
      );

      for (let i = 0; i < 4; i++) {
        state = adaptiveReducer(
          state,
          updatePerformance({
            success: false,
            responseTime: 8000,
            hintUsed: true,
          })
        );
      }

      expect(state.currentDifficulty).toBe(1170); // decreased
      expect(state.lastAdjustment.direction).toBe('decrease');
    });

    it('should reset performance after adjustment', () => {
      let state = initialState;

      // Build up performance data
      for (let i = 0; i < 5; i++) {
        state = adaptiveReducer(
          state,
          updatePerformance({
            success: true,
            responseTime: 2000,
            hintUsed: false,
          })
        );
      }

      // Performance should be reset after auto-adjustment
      expect(state.recentPerformance.attempts).toBe(0);
      expect(state.recentPerformance.successes).toBe(0);
    });
  });

  describe('skill management', () => {
    it('should mark skill as mastered', () => {
      const state = adaptiveReducer(initialState, markSkillMastered('addition'));

      expect(state.masteredSkills.includes('addition')).toBe(true);
      expect(state.strugglingSkills.includes('addition')).toBe(false);
    });

    it('should mark skill as struggling', () => {
      const state = adaptiveReducer(initialState, markSkillStruggling('division'));

      expect(state.strugglingSkills.includes('division')).toBe(true);
      expect(state.masteredSkills.includes('division')).toBe(false);
    });

    it('should move skill from struggling to mastered', () => {
      let state = adaptiveReducer(initialState, markSkillStruggling('multiplication'));
      state = adaptiveReducer(state, markSkillMastered('multiplication'));

      expect(state.masteredSkills.includes('multiplication')).toBe(true);
      expect(state.strugglingSkills.includes('multiplication')).toBe(false);
    });
  });

  describe('subject-specific tracking', () => {
    it('should track performance by subject', () => {
      const state = adaptiveReducer(
        initialState,
        trackPerformance({
          subject: 'math',
          difficulty: 1200,
          correct: true,
          responseTime: 3000,
          hintsUsed: 1,
        })
      );

      expect(state.recentPerformance.attempts).toBe(1);
      expect(state.recentPerformance.successes).toBe(1);
      expect(state.recentPerformance.hintsUsed).toBe(1);
    });

    it('should adjust recommended difficulty for subject', () => {
      let state = initialState;

      // Simulate high performance to increase difficulty
      for (let i = 0; i < 5; i++) {
        state = adaptiveReducer(
          state,
          trackPerformance({
            subject: 'math',
            difficulty: 1200,
            correct: true,
            responseTime: 2000,
            hintsUsed: 0,
          })
        );
      }

      expect(state.recommendedDifficulty.math).toBeGreaterThan(2);
    });

    it('should update skill progress', () => {
      const state = adaptiveReducer(
        initialState,
        updateSkillProgress({
          subject: 'english',
          points: 50,
          accuracy: 95,
        })
      );

      expect(state.recommendedDifficulty.english).toBeGreaterThan(2);
    });

    it('should decrease difficulty for poor accuracy', () => {
      const state = adaptiveReducer(
        initialState,
        updateSkillProgress({
          subject: 'science',
          points: 10,
          accuracy: 30,
        })
      );

      expect(state.recommendedDifficulty.science).toBeLessThan(2);
    });
  });

  describe('spaced repetition', () => {
    const mockCard = {
      id: 'card_1',
      contentId: 'content_1',
      contentType: 'game' as const,
      subject: 'mathematics' as const,
      difficulty: 1200,
      interval: 1,
      easeFactor: 2.5,
      reviewCount: 0,
      nextReview: new Date(),
      createdAt: new Date(),
      lastReviewed: new Date(),
      successStreak: 0,
      totalAttempts: 0,
      totalCorrect: 0,
      retentionStrength: 0.5,
    };

    it('should add spaced repetition card', () => {
      const state = adaptiveReducer(initialState, addSpacedRepetitionCard(mockCard));

      expect(state.spacedRepetitionCards).toHaveLength(1);
      expect(state.spacedRepetitionCards[0]).toEqual(mockCard);
    });

    it('should update spaced repetition card', () => {
      let state = adaptiveReducer(initialState, addSpacedRepetitionCard(mockCard));

      const updatedCard = { ...mockCard, interval: 3, reviewCount: 1 };
      state = adaptiveReducer(state, updateSpacedRepetitionCard(updatedCard));

      expect(state.spacedRepetitionCards[0].interval).toBe(3);
      expect(state.spacedRepetitionCards[0].reviewCount).toBe(1);
    });

    it('should set current review session', () => {
      const mockSession = {
        id: 'session_1',
        cards: [mockCard],
        estimatedDuration: 15,
        createdAt: new Date(),
        ageGroup: '6-8' as const,
        targetRetention: 0.8,
      };

      const state = adaptiveReducer(initialState, setCurrentReviewSession(mockSession));

      expect(state.currentReviewSession).toEqual(mockSession);
    });

    it('should calculate due reviews', () => {
      const pastDueCard = {
        ...mockCard,
        nextReview: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      };

      let state = adaptiveReducer(initialState, addSpacedRepetitionCard(pastDueCard));
      state = adaptiveReducer(state, calculateDueReviews());

      expect(state.reviewsDueToday).toBe(1);
    });

    it('should update retention rate', () => {
      const state = adaptiveReducer(initialState, updateRetentionRate(0.85));

      expect(state.averageRetention).toBe(0.85);
    });
  });

  describe('edge cases', () => {
    it('should handle empty performance data', () => {
      const state = adaptiveReducer(
        { ...initialState, adaptiveMode: 'automatic' },
        updatePerformance({
          success: true,
          responseTime: 3000,
          hintUsed: false,
        })
      );

      // Should not auto-adjust with insufficient data
      expect(state.currentDifficulty).toBe(1200);
    });

    it('should handle non-automatic mode', () => {
      let state = { ...initialState, adaptiveMode: 'manual' as const };

      // Even with performance data, should not auto-adjust in manual mode
      for (let i = 0; i < 5; i++) {
        state = adaptiveReducer(
          state,
          updatePerformance({
            success: true,
            responseTime: 2000,
            hintUsed: false,
          })
        ) as typeof state;
      }

      expect(state.currentDifficulty).toBe(1200); // unchanged
    });

    it('should handle boundary performance values', () => {
      const state = adaptiveReducer(
        initialState,
        trackPerformance({
          subject: 'math',
          difficulty: 1200,
          correct: true,
          responseTime: 0, // edge case
          hintsUsed: 0,
        })
      );

      expect(state.recentPerformance.attempts).toBe(1);
    });
  });
});