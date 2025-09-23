import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import studentReducer from './slices/studentSlice';
import sessionReducer from './slices/sessionSlice';
import gameReducer from './slices/gameSlice';
import settingsReducer from './slices/settingsSlice';
import analyticsReducer from './slices/analyticsSlice';
import adaptiveReducer from './slices/adaptiveSlice';

// Persist configurations
const studentPersistConfig = {
  key: 'student',
  storage,
  whitelist: ['profile', 'skillLevels', 'achievements', 'preferences'],
};

const settingsPersistConfig = {
  key: 'settings',
  storage,
};

const analyticsPersistConfig = {
  key: 'analytics',
  storage,
  whitelist: ['recentSessions', 'totalStats'],
};

// Create persisted reducers
const persistedStudentReducer = persistReducer(studentPersistConfig, studentReducer);
const persistedSettingsReducer = persistReducer(settingsPersistConfig, settingsReducer);
const persistedAnalyticsReducer = persistReducer(analyticsPersistConfig, analyticsReducer);

// Configure store
export const store = configureStore({
  reducer: {
    student: persistedStudentReducer,
    session: sessionReducer,
    game: gameReducer,
    settings: persistedSettingsReducer,
    analytics: persistedAnalyticsReducer,
    adaptive: adaptiveReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp', 'payload.skillLevels', 'payload.createdAt', 'payload.updatedAt'],
        ignoredPaths: [
          'items.dates',
          'session.startTime',
          'session.pausedTime',
          'session.lastSessionDate',
          'session.skillsPracticed',
          'student.profile.skillLevels',
          'student.profile.createdAt',
          'student.profile.updatedAt',
          'analytics.skillProgress',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;