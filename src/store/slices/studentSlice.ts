import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  StudentModel, 
  SkillLevel, 
  Achievement, 
  StudentPreferences,
  AgeGroup,
  LearningStyle,
  Avatar 
} from '@/types';

interface StudentState {
  profile: StudentModel | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  achievements: Achievement[];
  unlockedContent: string[];
  totalPoints: number;
  currentStreak: number;
}

const initialState: StudentState = {
  profile: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  achievements: [],
  unlockedContent: [],
  totalPoints: 0,
  currentStreak: 0,
};

// Async thunks
export const loadStudent = createAsyncThunk(
  'student/load',
  async (studentId: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/students/${studentId}`);
    const data = await response.json();
    return data;
  }
);

export const updateSkillLevel = createAsyncThunk(
  'student/updateSkill',
  async ({ studentId, skill, update }: {
    studentId: string;
    skill: string;
    update: Partial<SkillLevel>;
  }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/students/${studentId}/skills/${skill}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    const data = await response.json();
    return data;
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudent: (state, action: PayloadAction<StudentModel>) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    clearStudent: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      state.achievements = [];
      state.unlockedContent = [];
      state.totalPoints = 0;
      state.currentStreak = 0;
    },
    
    updatePreferences: (state, action: PayloadAction<Partial<StudentPreferences>>) => {
      if (state.profile) {
        state.profile.preferences = {
          ...state.profile.preferences,
          ...action.payload,
        };
      }
    },
    
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      state.achievements.push(action.payload);
      // Award points for achievement
      state.totalPoints += action.payload.points;
    },
    
    updateAchievementProgress: (state, action: PayloadAction<{
      achievementId: string;
      progress: number;
    }>) => {
      const achievement = state.achievements.find(a => a.id === action.payload.achievementId);
      if (achievement) {
        achievement.progress = action.payload.progress;
      }
    },
    
    unlockContent: (state, action: PayloadAction<string>) => {
      if (!state.unlockedContent.includes(action.payload)) {
        state.unlockedContent.push(action.payload);
      }
    },
    
    addPoints: (state, action: PayloadAction<number>) => {
      state.totalPoints += action.payload;
    },
    
    updateStreak: (state, action: PayloadAction<number>) => {
      state.currentStreak = action.payload;
    },
    
    incrementStreak: (state) => {
      state.currentStreak += 1;
    },
    
    resetStreak: (state) => {
      state.currentStreak = 0;
    },
    
    updateAvatar: (state, action: PayloadAction<Avatar>) => {
      if (state.profile) {
        state.profile.avatar = action.payload;
      }
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load student
      .addCase(loadStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadStudent.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
        state.achievements = action.payload.achievements;
        state.unlockedContent = action.payload.unlockedContent;
        state.totalPoints = action.payload.totalPoints;
        state.currentStreak = action.payload.currentStreak;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loadStudent.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load student profile';
        state.isLoading = false;
      })
      
      // Update skill level
      .addCase(updateSkillLevel.fulfilled, (state, action) => {
        if (state.profile) {
          const { skill, update } = action.meta.arg;
          const skillLevel = state.profile.skillLevels.get(skill);
          if (skillLevel) {
            state.profile.skillLevels.set(skill, {
              ...skillLevel,
              ...update,
            });
          }
        }
      });
  },
});

export const {
  setStudent,
  clearStudent,
  updatePreferences,
  addAchievement,
  updateAchievementProgress,
  unlockContent,
  addPoints,
  updateStreak,
  incrementStreak,
  resetStreak,
  updateAvatar,
  setError,
  clearError,
} = studentSlice.actions;

export default studentSlice.reducer;