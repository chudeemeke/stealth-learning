import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalyticsData, AnalyticsMetrics, AnalyticsInsights, Subject } from '@/types';

interface AnalyticsState {
  currentMetrics: AnalyticsMetrics;
  insights: AnalyticsInsights | null;
  recentSessions: Array<{
    date: string;
    duration: number;
    subject: Subject;
    accuracy: number;
    skillsMastered: number;
  }>;
  totalStats: {
    totalTimeSpent: number; // minutes
    totalGamesPlayed: number;
    totalSkillsMastered: number;
    totalPointsEarned: number;
    longestStreak: number;
    favoriteSubject: Subject | null;
    gamesPlayed: number;
    totalScore: number;
    averageAccuracy: number;
    currentLoginStreak: number;
    perfectGames: number;
    bestStreak: number;
    morningGames: number;
    eveningGames: number;
    uniqueGamesPlayed: number;
    fastestGameTime?: number;
  };
  weeklyProgress: {
    [key: string]: {
      timeSpent: number;
      gamesPlayed: number;
      accuracy: number;
    };
  };
  skillProgress: Record<string, {
    skill: string;
    startLevel: number;
    currentLevel: number;
    attempts: number;
    lastPracticed: string;
  }>;
  achievements: {
    total: number;
    unlocked: number;
    recent: string[];
  };
}

const initialState: AnalyticsState = {
  currentMetrics: {
    totalTimeSpent: 0,
    sessionsCount: 0,
    gamesCompleted: 0,
    skillsMastered: 0,
    averageAccuracy: 0,
    averageSessionDuration: 0,
    streakDays: 0,
    progressRate: 0,
  },
  insights: null,
  recentSessions: [],
  totalStats: {
    totalTimeSpent: 0,
    totalGamesPlayed: 0,
    totalSkillsMastered: 0,
    totalPointsEarned: 0,
    longestStreak: 0,
    favoriteSubject: null,
    gamesPlayed: 0,
    totalScore: 0,
    averageAccuracy: 0,
    currentLoginStreak: 0,
    perfectGames: 0,
    bestStreak: 0,
    morningGames: 0,
    eveningGames: 0,
    uniqueGamesPlayed: 0,
    fastestGameTime: undefined,
  },
  weeklyProgress: {},
  skillProgress: {},
  achievements: {
    total: 0,
    unlocked: 0,
    recent: [],
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateMetrics: (state, action: PayloadAction<Partial<AnalyticsMetrics>>) => {
      state.currentMetrics = {
        ...state.currentMetrics,
        ...action.payload,
      };
    },
    
    setInsights: (state, action: PayloadAction<AnalyticsInsights>) => {
      state.insights = action.payload;
    },
    
    addSession: (state, action: PayloadAction<{
      date: string;
      duration: number;
      subject: Subject;
      accuracy: number;
      skillsMastered: number;
    }>) => {
      // Add to recent sessions
      state.recentSessions.unshift(action.payload);
      
      // Keep only last 30 sessions
      if (state.recentSessions.length > 30) {
        state.recentSessions = state.recentSessions.slice(0, 30);
      }
      
      // Update total stats
      state.totalStats.totalTimeSpent += action.payload.duration;
      state.totalStats.totalGamesPlayed += 1;
      state.totalStats.totalSkillsMastered += action.payload.skillsMastered;
      
      // Update current metrics
      state.currentMetrics.sessionsCount += 1;
      state.currentMetrics.totalTimeSpent += action.payload.duration;
      state.currentMetrics.skillsMastered += action.payload.skillsMastered;
      
      // Recalculate averages
      const totalSessions = state.currentMetrics.sessionsCount;
      state.currentMetrics.averageSessionDuration = 
        state.currentMetrics.totalTimeSpent / totalSessions;
      
      state.currentMetrics.averageAccuracy = 
        (state.currentMetrics.averageAccuracy * (totalSessions - 1) + action.payload.accuracy) / totalSessions;
    },
    
    updateWeeklyProgress: (state, action: PayloadAction<{
      week: string;
      data: {
        timeSpent: number;
        gamesPlayed: number;
        accuracy: number;
      };
    }>) => {
      state.weeklyProgress[action.payload.week] = action.payload.data;
    },
    
    updateSkillProgress: (state, action: PayloadAction<{
      skill: string;
      level: number;
      attempts: number;
    }>) => {
      const existing = state.skillProgress[action.payload.skill];

      if (existing) {
        state.skillProgress[action.payload.skill] = {
          ...existing,
          currentLevel: action.payload.level,
          attempts: existing.attempts + action.payload.attempts,
          lastPracticed: new Date().toISOString(),
        };
      } else {
        state.skillProgress[action.payload.skill] = {
          skill: action.payload.skill,
          startLevel: action.payload.level,
          currentLevel: action.payload.level,
          attempts: action.payload.attempts,
          lastPracticed: new Date().toISOString(),
        };
      }
    },
    
    incrementStreak: (state) => {
      state.currentMetrics.streakDays += 1;
      
      if (state.currentMetrics.streakDays > state.totalStats.longestStreak) {
        state.totalStats.longestStreak = state.currentMetrics.streakDays;
      }
    },
    
    resetStreak: (state) => {
      state.currentMetrics.streakDays = 0;
    },
    
    updateAchievements: (state, action: PayloadAction<{
      total: number;
      unlocked: number;
      newAchievement?: string;
    }>) => {
      state.achievements.total = action.payload.total;
      state.achievements.unlocked = action.payload.unlocked;
      
      if (action.payload.newAchievement) {
        state.achievements.recent.unshift(action.payload.newAchievement);
        
        // Keep only last 10 recent achievements
        if (state.achievements.recent.length > 10) {
          state.achievements.recent = state.achievements.recent.slice(0, 10);
        }
      }
    },
    
    updateTotalPoints: (state, action: PayloadAction<number>) => {
      state.totalStats.totalPointsEarned += action.payload;
    },
    
    setFavoriteSubject: (state, action: PayloadAction<Subject>) => {
      state.totalStats.favoriteSubject = action.payload;
    },
    
    calculateProgressRate: (state) => {
      // Calculate progress rate based on skill improvements
      let totalProgress = 0;
      let skillCount = 0;

      Object.values(state.skillProgress).forEach(skill => {
        const improvement = skill.currentLevel - skill.startLevel;
        totalProgress += improvement;
        skillCount += 1;
      });
      
      if (skillCount > 0) {
        state.currentMetrics.progressRate = (totalProgress / skillCount) * 10; // Scale to percentage
      }
    },
    
    resetAnalytics: () => initialState,

    trackEvent: (state, action: PayloadAction<{
      category: string;
      action: string;
      label?: string;
      value?: number;
    }>) => {
      // Track custom events for analytics
      // In a real app, this would send to an analytics service
      const { category, action: eventAction, label, value } = action.payload;

      // Update relevant stats based on event
      if (category === 'game') {
        if (eventAction === 'start') {
          state.totalStats.gamesPlayed += 1;
          state.totalStats.totalGamesPlayed += 1;
        } else if (eventAction === 'complete') {
          if (value && value === 100) {
            state.totalStats.perfectGames += 1;
          }
        }
      }

      // Track unique games
      if (category === 'game' && eventAction === 'start' && label) {
        // This would need proper tracking in a real implementation
        state.totalStats.uniqueGamesPlayed = Math.min(
          state.totalStats.uniqueGamesPlayed + 1,
          10
        );
      }

      // Track time-based games
      const hour = new Date().getHours();
      if (category === 'game' && eventAction === 'start') {
        if (hour < 12) {
          state.totalStats.morningGames += 1;
        } else if (hour >= 20) {
          state.totalStats.eveningGames += 1;
        }
      }
    },
  },
});

export const {
  updateMetrics,
  setInsights,
  addSession,
  updateWeeklyProgress,
  updateSkillProgress,
  incrementStreak,
  resetStreak,
  updateAchievements,
  updateTotalPoints,
  setFavoriteSubject,
  calculateProgressRate,
  resetAnalytics,
  trackEvent,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;