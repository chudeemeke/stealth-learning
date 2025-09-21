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
  skillLevels: {
    overall: number;
    math: number;
    english: number;
    science: number;
  };
  preferences: {
    theme: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
    soundEnabled: boolean;
    visualEffects: boolean;
  };
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
  skillLevels: {
    overall: 1,
    math: 1,
    english: 1,
    science: 1,
  },
  preferences: {
    theme: 'default',
    difficulty: 'adaptive',
    soundEnabled: true,
    visualEffects: true,
  },
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

export const restoreSession = createAsyncThunk(
  'student/restoreSession',
  async () => {
    const { authService } = await import('@/services/auth/AuthenticationService');

    // Check if we have a valid session
    const sessionData = authService.getCurrentSession();

    if (!sessionData.isAuthenticated) {
      throw new Error('No valid session found');
    }

    // Validate and refresh session if needed
    const isValid = await authService.validateSession();
    if (!isValid) {
      throw new Error('Session validation failed');
    }

    // Get current user information
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No current user found');
    }

    // Get user profile from database
    const { DatabaseService } = await import('@/services/database/DatabaseService');
    const dbService = DatabaseService.getInstance();

    if (currentUser.userType === 'child' && currentUser.profileId) {
      const childProfile = await dbService.getChildProfile(currentUser.profileId);
      if (!childProfile) {
        throw new Error('Child profile not found');
      }

      // Convert child profile to student model format
      const studentProfile: StudentModel = {
        id: childProfile.id,
        username: childProfile.name, // Use name as username
        name: childProfile.name,
        ageGroup: childProfile.ageGroup,
        avatar: {
          id: childProfile.avatar.id,
          type: 'character',
          colorScheme: childProfile.avatar.colorScheme,
          accessories: [],
          unlocked: childProfile.avatar.unlocked
        },
        preferences: {
          soundEnabled: childProfile.preferences.soundEnabled,
          colorMode: childProfile.preferences.colorMode === 'calm' ? 'soft' : childProfile.preferences.colorMode,
          fontSize: childProfile.preferences.fontSize,
          animationSpeed: childProfile.preferences.animationSpeed,
          musicVolume: childProfile.preferences.musicVolume,
          effectsVolume: childProfile.preferences.effectsVolume,
          subtitlesEnabled: childProfile.preferences.subtitlesEnabled
        },
        skillLevels: new Map(), // Initialize empty Map - will be populated from user progress
        learningStyle: 'visual', // Default value
        performanceHistory: [],
        currentZPD: {
          lowerBound: 1,
          upperBound: 3,
          optimalDifficulty: 2,
          recommendedSkills: []
        },
        createdAt: childProfile.createdAt,
        updatedAt: childProfile.updatedAt
      };

      return {
        profile: studentProfile,
        userType: currentUser.userType,
        sessionData
      };
    } else if (currentUser.userType === 'parent') {
      // For parent sessions, we don't need to convert to StudentModel
      // The state should handle both student and parent profiles
      const parentProfile = await dbService.getParentProfile(currentUser.userId);
      if (!parentProfile) {
        throw new Error('Parent profile not found');
      }

      // Get the parent user record to access email
      const parentUser = await dbService.getUser(currentUser.userId);
      if (!parentUser) {
        throw new Error('Parent user record not found');
      }

      // Return a minimal StudentModel for parent to prevent errors
      const parentStudentModel: StudentModel = {
        id: parentProfile.id,
        username: parentUser.email || parentProfile.firstName,
        name: `${parentProfile.firstName} ${parentProfile.lastName}`,
        ageGroup: '9+' as AgeGroup,
        skillLevels: new Map(),
        learningStyle: 'visual',
        performanceHistory: [],
        currentZPD: {
          lowerBound: 1,
          upperBound: 5,
          optimalDifficulty: 3,
          recommendedSkills: []
        },
        preferences: {
          soundEnabled: true,
          colorMode: 'bright',
          fontSize: 'medium',
          animationSpeed: 'normal',
          musicVolume: 0.7,
          effectsVolume: 0.8,
          subtitlesEnabled: false
        },
        createdAt: parentProfile.createdAt,
        updatedAt: parentProfile.updatedAt
      };

      return {
        profile: parentStudentModel,
        userType: currentUser.userType,
        sessionData
      };
    }

    throw new Error('Invalid user type');
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
    
    updateAvatar: (state, action: PayloadAction<Avatar | string>) => {
      if (state.profile) {
        state.profile.avatar = typeof action.payload === 'string' ? undefined : action.payload;
      }
    },

    updateStudentProfile: (state, action: PayloadAction<{
      name?: string;
      age?: number;
      avatar?: string;
    }>) => {
      if (state.profile) {
        if (action.payload.name) (state.profile as any).name = action.payload.name;
        if (action.payload.age) (state.profile as any).age = action.payload.age;
        if (action.payload.avatar) (state.profile as any).avatar = action.payload.avatar;
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

      // Restore session
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.profile = null;
        state.error = action.error.message || 'Failed to restore session';
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
  updateStudentProfile,
  setError,
  clearError,
} = studentSlice.actions;

// Selectors
export const selectStudent = (state: { student: StudentState }) => state.student.profile;
export const selectIsLoggedIn = (state: { student: StudentState }) => state.student.isAuthenticated;
export const selectStudentAchievements = (state: { student: StudentState }) => state.student.achievements;
export const logout = clearStudent;
export const addXP = addPoints;

export default studentSlice.reducer;