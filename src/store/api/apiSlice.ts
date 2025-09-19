import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  StudentModel,
  Content,
  LearningSession,
  AnalyticsData,
  Achievement,
  Subject,
  AgeGroup,
} from '@/types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Student', 'Content', 'Session', 'Analytics', 'Achievement'],
  endpoints: (builder) => ({
    // Student endpoints
    loginStudent: builder.mutation<
      { student: StudentModel; token: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Student'],
    }),
    
    registerStudent: builder.mutation<
      { student: StudentModel; token: string },
      { username: string; ageGroup: AgeGroup; parentEmail: string }
    >({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Student'],
    }),
    
    getStudent: builder.query<StudentModel, string>({
      query: (id) => `/students/${id}`,
      providesTags: ['Student'],
    }),
    
    updateStudent: builder.mutation<StudentModel, Partial<StudentModel>>({
      query: ({ id, ...data }) => ({
        url: `/students/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Student'],
    }),
    
    // Content endpoints
    getContent: builder.query<Content[], {
      subject?: Subject;
      ageGroup?: AgeGroup;
      difficulty?: { min: number; max: number };
    }>({
      query: (params) => ({
        url: '/content',
        params,
      }),
      providesTags: ['Content'],
    }),
    
    getContentById: builder.query<Content, string>({
      query: (id) => `/content/${id}`,
      providesTags: ['Content'],
    }),
    
    getRecommendedContent: builder.query<Content[], {
      studentId: string;
      subject?: Subject;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/content/recommended',
        params,
      }),
      providesTags: ['Content'],
    }),
    
    // Session endpoints
    createSession: builder.mutation<LearningSession, {
      studentId: string;
      subject: Subject;
    }>({
      query: (data) => ({
        url: '/sessions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Session'],
    }),
    
    updateSession: builder.mutation<LearningSession, {
      id: string;
      data: Partial<LearningSession>;
    }>({
      query: ({ id, data }) => ({
        url: `/sessions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Session', 'Analytics'],
    }),
    
    endSession: builder.mutation<LearningSession, {
      id: string;
      performanceSummary: any;
    }>({
      query: ({ id, performanceSummary }) => ({
        url: `/sessions/${id}/end`,
        method: 'POST',
        body: { performanceSummary },
      }),
      invalidatesTags: ['Session', 'Analytics'],
    }),
    
    getSessions: builder.query<LearningSession[], {
      studentId: string;
      limit?: number;
      offset?: number;
    }>({
      query: (params) => ({
        url: '/sessions',
        params,
      }),
      providesTags: ['Session'],
    }),
    
    // Analytics endpoints
    getAnalytics: builder.query<AnalyticsData, {
      studentId: string;
      startDate: string;
      endDate: string;
    }>({
      query: (params) => ({
        url: '/analytics',
        params,
      }),
      providesTags: ['Analytics'],
    }),
    
    getInsights: builder.query<any, string>({
      query: (studentId) => `/analytics/insights/${studentId}`,
      providesTags: ['Analytics'],
    }),
    
    getMilestones: builder.query<any[], string>({
      query: (studentId) => `/analytics/milestones/${studentId}`,
      providesTags: ['Analytics'],
    }),
    
    // Achievement endpoints
    getAchievements: builder.query<Achievement[], string>({
      query: (studentId) => `/achievements/${studentId}`,
      providesTags: ['Achievement'],
    }),
    
    unlockAchievement: builder.mutation<Achievement, {
      studentId: string;
      achievementId: string;
    }>({
      query: (data) => ({
        url: '/achievements/unlock',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Achievement'],
    }),
    
    // Progress tracking
    submitProgress: builder.mutation<void, {
      studentId: string;
      skill: string;
      performance: any;
    }>({
      query: (data) => ({
        url: '/progress',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Student', 'Analytics'],
    }),
    
    // Leaderboard
    getLeaderboard: builder.query<any[], {
      period: 'daily' | 'weekly' | 'monthly' | 'all-time';
      subject?: Subject;
      ageGroup?: AgeGroup;
    }>({
      query: (params) => ({
        url: '/leaderboard',
        params,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginStudentMutation,
  useRegisterStudentMutation,
  useGetStudentQuery,
  useUpdateStudentMutation,
  useGetContentQuery,
  useGetContentByIdQuery,
  useGetRecommendedContentQuery,
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useEndSessionMutation,
  useGetSessionsQuery,
  useGetAnalyticsQuery,
  useGetInsightsQuery,
  useGetMilestonesQuery,
  useGetAchievementsQuery,
  useUnlockAchievementMutation,
  useSubmitProgressMutation,
  useGetLeaderboardQuery,
} = apiSlice;