import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Reward } from '@/types';

interface GameSliceState {
  currentGame: GameState | null;
  isPlaying: boolean;
  isPaused: boolean;
  currentLevel: number;
  currentScore: number;
  lives: number;
  hints: number;
  timeElapsed: number; // in seconds
  collectedRewards: Reward[];
  completedObjectives: string[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
}

const initialState: GameSliceState = {
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
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<{
      gameId: string;
      studentId: string;
      level?: number;
    }>) => {
      const now = new Date();
      state.currentGame = {
        id: `game-${Date.now()}`,
        studentId: action.payload.studentId,
        gameId: action.payload.gameId,
        currentLevel: action.payload.level || 1,
        score: 0,
        lives: 3,
        hints: 3,
        startTime: now,
        completedObjectives: [],
        collectedRewards: [],
        gameData: {},
      };
      state.isPlaying = true;
      state.isPaused = false;
      state.currentLevel = action.payload.level || 1;
      state.currentScore = 0;
      state.lives = 3;
      state.hints = 3;
      state.timeElapsed = 0;
      state.collectedRewards = [];
      state.completedObjectives = [];
    },
    
    pauseGame: (state) => {
      if (state.isPlaying && !state.isPaused) {
        state.isPaused = true;
        if (state.currentGame) {
          state.currentGame.pausedTime = new Date();
        }
      }
    },
    
    resumeGame: (state) => {
      if (state.isPlaying && state.isPaused) {
        state.isPaused = false;
        if (state.currentGame) {
          state.currentGame.pausedTime = undefined;
        }
      }
    },
    
    endGame: (state) => {
      state.currentGame = null;
      state.isPlaying = false;
      state.isPaused = false;
      state.timeElapsed = 0;
    },
    
    updateScore: (state, action: PayloadAction<number>) => {
      state.currentScore += action.payload;
      if (state.currentGame) {
        state.currentGame.score = state.currentScore;
      }
    },
    
    setScore: (state, action: PayloadAction<number>) => {
      state.currentScore = action.payload;
      if (state.currentGame) {
        state.currentGame.score = action.payload;
      }
    },
    
    incrementLevel: (state) => {
      state.currentLevel += 1;
      if (state.currentGame) {
        state.currentGame.currentLevel = state.currentLevel;
      }
    },
    
    setLevel: (state, action: PayloadAction<number>) => {
      state.currentLevel = action.payload;
      if (state.currentGame) {
        state.currentGame.currentLevel = action.payload;
      }
    },
    
    loseLife: (state) => {
      if (state.lives > 0) {
        state.lives -= 1;
        if (state.currentGame) {
          state.currentGame.lives = state.lives;
        }
      }
    },
    
    gainLife: (state) => {
      state.lives += 1;
      if (state.currentGame) {
        state.currentGame.lives = state.lives;
      }
    },
    
    useHint: (state) => {
      if (state.hints > 0) {
        state.hints -= 1;
        if (state.currentGame) {
          state.currentGame.hints = state.hints;
        }
      }
    },
    
    addHint: (state, action: PayloadAction<number>) => {
      state.hints += action.payload;
      if (state.currentGame) {
        state.currentGame.hints = state.hints;
      }
    },
    
    collectReward: (state, action: PayloadAction<Reward>) => {
      state.collectedRewards.push(action.payload);
      if (state.currentGame) {
        state.currentGame.collectedRewards.push(action.payload);
      }
    },
    
    completeObjective: (state, action: PayloadAction<string>) => {
      if (!state.completedObjectives.includes(action.payload)) {
        state.completedObjectives.push(action.payload);
        if (state.currentGame) {
          state.currentGame.completedObjectives.push(action.payload);
        }
      }
    },
    
    updateTimeElapsed: (state, action: PayloadAction<number>) => {
      state.timeElapsed = action.payload;
    },
    
    setDifficulty: (state, action: PayloadAction<'easy' | 'medium' | 'hard' | 'adaptive'>) => {
      state.difficulty = action.payload;
    },
    
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    
    toggleMusic: (state) => {
      state.musicEnabled = !state.musicEnabled;
    },
    
    toggleHaptic: (state) => {
      state.hapticEnabled = !state.hapticEnabled;
    },
    
    setGameData: (state, action: PayloadAction<{ key: string; value: any }>) => {
      if (state.currentGame) {
        state.currentGame.gameData[action.payload.key] = action.payload.value;
      }
    },
  },
});

export const {
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
  setGameData,
} = gameSlice.actions;

export default gameSlice.reducer;