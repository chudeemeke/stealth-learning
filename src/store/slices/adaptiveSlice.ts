import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Content, AdaptiveResponse, LearningContext, SkillLevel } from '@/types';

interface AdaptiveState {
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
} = adaptiveSlice.actions;

export default adaptiveSlice.reducer;