import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Content, AdaptiveResponse, LearningContext, SkillLevel, SpacedRepetitionCard, ReviewSession } from '@/types';

export interface AdaptiveState {
  currentDifficulty: number;
  recommendedContent: Content[];
  learningPath: string[];
  adaptiveMode: 'automatic' | 'manual' | 'guided';
  difficultyRange: {
    min: number;
    max: number;
  };
  performanceThreshold: {
    advance: number; // % accuracy to increase difficulty
    maintain: number; // % accuracy to maintain difficulty
    decrease: number; // % accuracy to decrease difficulty
  };
  recentPerformance: {
    attempts: number;
    successes: number;
    averageResponseTime: number;
    hintsUsed: number;
  };
  contentQueue: Content[];
  masteredSkills: Set<string>;
  strugglingSkills: Set<string>;
  lastAdjustment: {
    timestamp: Date | null;
    direction: 'increase' | 'decrease' | 'maintain';
    reason: string;
  };
  recommendedDifficulty: {
    math: number;
    english: number;
    science: number;
  };
  mathRating?: number;
  englishRating?: number;
  scienceRating?: number;
  // Spaced Repetition state
  spacedRepetitionCards: SpacedRepetitionCard[];
  currentReviewSession: ReviewSession | null;
  reviewsDueToday: number;
  reviewsCompleted: number;
  averageRetention: number;
}

const initialState: AdaptiveState = {
  currentDifficulty: 1200, // Starting Elo rating
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
  masteredSkills: new Set(),
  strugglingSkills: new Set(),
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
  // Spaced Repetition initial state
  spacedRepetitionCards: [],
  currentReviewSession: null,
  reviewsDueToday: 0,
  reviewsCompleted: 0,
  averageRetention: 0.75,
};

const adaptiveSlice = createSlice({
  name: 'adaptive',
  initialState,
  reducers: {
    setDifficulty: (state, action: PayloadAction<number>) => {
      state.currentDifficulty = Math.max(
        state.difficultyRange.min,
        Math.min(state.difficultyRange.max, action.payload)
      );
    },
    
    adjustDifficulty: (state, action: PayloadAction<{
      direction: 'increase' | 'decrease' | 'maintain';
      amount?: number;
      reason: string;
    }>) => {
      const { direction, amount = 50, reason } = action.payload;
      
      switch (direction) {
        case 'increase':
          state.currentDifficulty = Math.min(
            state.difficultyRange.max,
            state.currentDifficulty + amount
          );
          break;
        case 'decrease':
          state.currentDifficulty = Math.max(
            state.difficultyRange.min,
            state.currentDifficulty - amount
          );
          break;
        case 'maintain':
          // No change
          break;
      }
      
      state.lastAdjustment = {
        timestamp: new Date(),
        direction,
        reason,
      };
    },
    
    setRecommendedContent: (state, action: PayloadAction<Content[]>) => {
      state.recommendedContent = action.payload;
    },
    
    addToContentQueue: (state, action: PayloadAction<Content>) => {
      state.contentQueue.push(action.payload);
    },
    
    removeFromContentQueue: (state, action: PayloadAction<string>) => {
      state.contentQueue = state.contentQueue.filter(
        content => content.id !== action.payload
      );
    },
    
    updateLearningPath: (state, action: PayloadAction<string[]>) => {
      state.learningPath = action.payload;
    },
    
    setAdaptiveMode: (state, action: PayloadAction<'automatic' | 'manual' | 'guided'>) => {
      state.adaptiveMode = action.payload;
    },
    
    updatePerformance: (state, action: PayloadAction<{
      success: boolean;
      responseTime: number;
      hintUsed: boolean;
    }>) => {
      const { success, responseTime, hintUsed } = action.payload;
      
      // Update recent performance
      state.recentPerformance.attempts += 1;
      if (success) {
        state.recentPerformance.successes += 1;
      }
      if (hintUsed) {
        state.recentPerformance.hintsUsed += 1;
      }
      
      // Update average response time
      const prevAvg = state.recentPerformance.averageResponseTime;
      const attempts = state.recentPerformance.attempts;
      state.recentPerformance.averageResponseTime = 
        (prevAvg * (attempts - 1) + responseTime) / attempts;
      
      // Auto-adjust difficulty if in automatic mode
      if (state.adaptiveMode === 'automatic' && state.recentPerformance.attempts >= 5) {
        const accuracy = (state.recentPerformance.successes / state.recentPerformance.attempts) * 100;
        
        if (accuracy >= state.performanceThreshold.advance) {
          // Increase difficulty
          state.currentDifficulty = Math.min(
            state.difficultyRange.max,
            state.currentDifficulty + 30
          );
          state.lastAdjustment = {
            timestamp: new Date(),
            direction: 'increase',
            reason: `High accuracy: ${accuracy.toFixed(1)}%`,
          };
        } else if (accuracy <= state.performanceThreshold.decrease) {
          // Decrease difficulty
          state.currentDifficulty = Math.max(
            state.difficultyRange.min,
            state.currentDifficulty - 30
          );
          state.lastAdjustment = {
            timestamp: new Date(),
            direction: 'decrease',
            reason: `Low accuracy: ${accuracy.toFixed(1)}%`,
          };
        }
        
        // Reset performance tracking after adjustment
        if (accuracy >= state.performanceThreshold.advance || accuracy <= state.performanceThreshold.decrease) {
          state.recentPerformance = {
            attempts: 0,
            successes: 0,
            averageResponseTime: 0,
            hintsUsed: 0,
          };
        }
      }
    },
    
    markSkillMastered: (state, action: PayloadAction<string>) => {
      state.masteredSkills.add(action.payload);
      state.strugglingSkills.delete(action.payload);
    },
    
    markSkillStruggling: (state, action: PayloadAction<string>) => {
      state.strugglingSkills.add(action.payload);
      state.masteredSkills.delete(action.payload);
    },
    
    setPerformanceThresholds: (state, action: PayloadAction<{
      advance: number;
      maintain: number;
      decrease: number;
    }>) => {
      state.performanceThreshold = action.payload;
    },
    
    setDifficultyRange: (state, action: PayloadAction<{
      min: number;
      max: number;
    }>) => {
      state.difficultyRange = action.payload;
      
      // Ensure current difficulty is within range
      state.currentDifficulty = Math.max(
        action.payload.min,
        Math.min(action.payload.max, state.currentDifficulty)
      );
    },
    
    resetAdaptive: () => initialState,

    trackPerformance: (state, action: PayloadAction<{
      subject: 'math' | 'english' | 'science';
      difficulty: number;
      correct: boolean;
      responseTime: number;
      hintsUsed: number;
    }>) => {
      const { subject, difficulty, correct, responseTime, hintsUsed } = action.payload;

      // Update recent performance
      state.recentPerformance.attempts += 1;
      if (correct) state.recentPerformance.successes += 1;
      state.recentPerformance.hintsUsed += hintsUsed;

      // Update average response time
      const currentAvg = state.recentPerformance.averageResponseTime;
      const attempts = state.recentPerformance.attempts;
      state.recentPerformance.averageResponseTime =
        (currentAvg * (attempts - 1) + responseTime) / attempts;

      // Adjust recommended difficulty for subject
      const accuracy = (state.recentPerformance.successes / state.recentPerformance.attempts) * 100;

      if (accuracy >= state.performanceThreshold.advance) {
        state.recommendedDifficulty[subject] = Math.min(5, state.recommendedDifficulty[subject] + 0.2);
      } else if (accuracy < state.performanceThreshold.decrease) {
        state.recommendedDifficulty[subject] = Math.max(1, state.recommendedDifficulty[subject] - 0.2);
      }
    },

    updateSkillProgress: (state, action: PayloadAction<{
      subject: 'math' | 'english' | 'science';
      points: number;
      accuracy: number;
    }>) => {
      const { subject, accuracy } = action.payload;

      // Adjust difficulty based on performance
      if (accuracy >= 90) {
        state.recommendedDifficulty[subject] = Math.min(5, state.recommendedDifficulty[subject] + 0.5);
      } else if (accuracy >= 70) {
        state.recommendedDifficulty[subject] = Math.min(5, state.recommendedDifficulty[subject] + 0.2);
      } else if (accuracy < 50) {
        state.recommendedDifficulty[subject] = Math.max(1, state.recommendedDifficulty[subject] - 0.3);
      }
    },

    // Spaced Repetition actions
    addSpacedRepetitionCard: (state, action: PayloadAction<SpacedRepetitionCard>) => {
      state.spacedRepetitionCards.push(action.payload);
    },

    updateSpacedRepetitionCard: (state, action: PayloadAction<SpacedRepetitionCard>) => {
      const index = state.spacedRepetitionCards.findIndex(card => card.id === action.payload.id);
      if (index !== -1) {
        state.spacedRepetitionCards[index] = action.payload;
      }
    },

    removeSpacedRepetitionCard: (state, action: PayloadAction<string>) => {
      state.spacedRepetitionCards = state.spacedRepetitionCards.filter(
        card => card.id !== action.payload
      );
    },

    setCurrentReviewSession: (state, action: PayloadAction<ReviewSession | null>) => {
      state.currentReviewSession = action.payload;
    },

    updateReviewProgress: (state, action: PayloadAction<{ completed: boolean }>) => {
      if (action.payload.completed) {
        state.reviewsCompleted += 1;
      }
    },

    calculateDueReviews: (state) => {
      const now = new Date();
      state.reviewsDueToday = state.spacedRepetitionCards.filter(
        card => card.nextReview <= now
      ).length;
    },

    updateRetentionRate: (state, action: PayloadAction<number>) => {
      state.averageRetention = action.payload;
    },

    resetSpacedRepetition: (state) => {
      state.spacedRepetitionCards = [];
      state.currentReviewSession = null;
      state.reviewsDueToday = 0;
      state.reviewsCompleted = 0;
      state.averageRetention = 0.75;
    },
  },
});

export const {
  setDifficulty,
  adjustDifficulty,
  setRecommendedContent,
  addToContentQueue,
  removeFromContentQueue,
  updateLearningPath,
  setAdaptiveMode,
  updatePerformance,
  markSkillMastered,
  markSkillStruggling,
  setPerformanceThresholds,
  setDifficultyRange,
  resetAdaptive,
  trackPerformance,
  updateSkillProgress,
  // Spaced Repetition actions
  addSpacedRepetitionCard,
  updateSpacedRepetitionCard,
  removeSpacedRepetitionCard,
  setCurrentReviewSession,
  updateReviewProgress,
  calculateDueReviews,
  updateRetentionRate,
  resetSpacedRepetition,
} = adaptiveSlice.actions;

export default adaptiveSlice.reducer;