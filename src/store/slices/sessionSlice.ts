import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LearningSession, GameAttempt, PerformanceSummary, Subject } from '@/types';

interface SessionState {
  currentSession: LearningSession | null;
  sessionHistory: LearningSession[];
  previousSessions?: LearningSession[];
  isActive: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pausedTime: Date | null;
  currentSubject: Subject | null;
  gamesCompleted: number;
  skillsPracticed: Set<string>;
  sessionDuration: number; // in seconds
  lastSessionDate?: Date;
  lastGamePlayed?: string;
  todayPlayTime?: number;
  performanceMetrics: {
    accuracy: number;
    averageResponseTime: number;
    hintsUsed: number;
    correctAnswers: number;
    totalQuestions: number;
  };
}

const initialState: SessionState = {
  currentSession: null,
  sessionHistory: [],
  isActive: false,
  isPaused: false,
  startTime: null,
  pausedTime: null,
  currentSubject: null,
  gamesCompleted: 0,
  skillsPracticed: new Set(),
  sessionDuration: 0,
  performanceMetrics: {
    accuracy: 0,
    averageResponseTime: 0,
    hintsUsed: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  },
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{
      studentId: string;
      subject: Subject;
    }>) => {
      const now = new Date();
      state.currentSession = {
        id: `session-${Date.now()}`,
        studentId: action.payload.studentId,
        startedAt: now,
        subject: action.payload.subject,
        gamesPlayed: [],
        skillsPracticed: [],
        engagementScore: 0,
      };
      state.isActive = true;
      state.isPaused = false;
      state.startTime = now;
      state.currentSubject = action.payload.subject;
      state.gamesCompleted = 0;
      state.skillsPracticed.clear();
      state.sessionDuration = 0;
      state.performanceMetrics = {
        accuracy: 0,
        averageResponseTime: 0,
        hintsUsed: 0,
        correctAnswers: 0,
        totalQuestions: 0,
      };
    },
    
    pauseSession: (state) => {
      if (state.isActive && !state.isPaused) {
        state.isPaused = true;
        state.pausedTime = new Date();
      }
    },
    
    resumeSession: (state) => {
      if (state.isActive && state.isPaused) {
        state.isPaused = false;
        // Add paused duration to session duration
        if (state.pausedTime && state.startTime) {
          const pausedDuration = new Date().getTime() - state.pausedTime.getTime();
          state.sessionDuration += Math.floor(pausedDuration / 1000);
        }
        state.pausedTime = null;
      }
    },
    
    endSession: (state) => {
      if (state.currentSession && state.startTime) {
        const endTime = new Date();
        const totalDuration = Math.floor((endTime.getTime() - state.startTime.getTime()) / 1000);
        
        // Calculate performance summary
        const performanceSummary: PerformanceSummary = {
          totalScore: state.currentSession.gamesPlayed.reduce((sum, game) => sum + game.score, 0),
          accuracy: state.performanceMetrics.accuracy,
          averageResponseTime: state.performanceMetrics.averageResponseTime,
          skillsImproved: Array.from(state.skillsPracticed),
          skillsToReview: [], // TODO: Calculate based on performance
          engagementLevel: state.sessionDuration > 900 ? 'high' : state.sessionDuration > 300 ? 'medium' : 'low',
          recommendations: [], // TODO: Generate based on performance
        };
        
        state.currentSession.endedAt = endTime;
        state.currentSession.performanceSummary = performanceSummary;
        state.currentSession.skillsPracticed = Array.from(state.skillsPracticed);
        
        // Add to history
        state.sessionHistory.unshift(state.currentSession);
        
        // Keep only last 50 sessions in history
        if (state.sessionHistory.length > 50) {
          state.sessionHistory = state.sessionHistory.slice(0, 50);
        }
        
        // Reset session state
        state.currentSession = null;
        state.isActive = false;
        state.isPaused = false;
        state.startTime = null;
        state.pausedTime = null;
        state.currentSubject = null;
      }
    },
    
    addGameAttempt: (state, action: PayloadAction<GameAttempt>) => {
      if (state.currentSession) {
        state.currentSession.gamesPlayed.push(action.payload);
        state.gamesCompleted += 1;
        
        // Update performance metrics
        const { accuracy, hintsUsed, responseTimes } = action.payload;
        const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        
        // Update rolling averages
        state.performanceMetrics.accuracy = 
          (state.performanceMetrics.accuracy * (state.gamesCompleted - 1) + accuracy) / state.gamesCompleted;
        
        state.performanceMetrics.averageResponseTime = 
          (state.performanceMetrics.averageResponseTime * (state.gamesCompleted - 1) + avgResponseTime) / state.gamesCompleted;
        
        state.performanceMetrics.hintsUsed += hintsUsed;
      }
    },
    
    addSkillPracticed: (state, action: PayloadAction<string>) => {
      state.skillsPracticed.add(action.payload);
    },
    
    updatePerformanceMetrics: (state, action: PayloadAction<{
      correct: boolean;
      responseTime: number;
      hintUsed: boolean;
    }>) => {
      const { correct, responseTime, hintUsed } = action.payload;
      
      state.performanceMetrics.totalQuestions += 1;
      if (correct) {
        state.performanceMetrics.correctAnswers += 1;
      }
      if (hintUsed) {
        state.performanceMetrics.hintsUsed += 1;
      }
      
      // Update accuracy
      state.performanceMetrics.accuracy = 
        (state.performanceMetrics.correctAnswers / state.performanceMetrics.totalQuestions) * 100;
      
      // Update average response time
      const currentTotal = state.performanceMetrics.averageResponseTime * (state.performanceMetrics.totalQuestions - 1);
      state.performanceMetrics.averageResponseTime = 
        (currentTotal + responseTime) / state.performanceMetrics.totalQuestions;
    },
    
    updateSessionDuration: (state) => {
      if (state.isActive && !state.isPaused && state.startTime) {
        const now = new Date();
        state.sessionDuration = Math.floor((now.getTime() - state.startTime.getTime()) / 1000);
      }
    },
    
    clearSessionHistory: (state) => {
      state.sessionHistory = [];
    },
  },
});

export const {
  startSession,
  pauseSession,
  resumeSession,
  endSession,
  addGameAttempt,
  addSkillPracticed,
  updatePerformanceMetrics,
  updateSessionDuration,
  clearSessionHistory,
} = sessionSlice.actions;

// Additional exports for compatibility
export const updateSessionTime = updateSessionDuration;
export const completeSession = endSession;
export const updateStreakCount = () => ({ type: 'session/updateStreakCount' });

export default sessionSlice.reducer;