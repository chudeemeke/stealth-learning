/**
 * useQuestions Hook - React interface for QuestionService
 *
 * Provides React components with easy access to intelligent question management
 * with built-in loading states, error handling, and performance tracking.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { questionService, QuestionFilter, AdaptiveSelectionParams } from '@/services/QuestionService';
import { Question } from '@/data/expandedQuestions';
import { useAppSelector } from '@/store';

interface UseQuestionsOptions {
  subject?: string;
  autoLoad?: boolean;
  adaptive?: boolean;
  prefetch?: boolean;
}

interface UseQuestionsResult {
  questions: Question[];
  currentQuestion: Question | null;
  isLoading: boolean;
  error: Error | null;
  loadQuestions: (filter?: QuestionFilter) => Promise<void>;
  loadAdaptiveQuestions: (count?: number) => Promise<void>;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitAnswer: (answer: string, timeSpent: number) => Promise<boolean>;
  getProgress: () => { current: number; total: number; percentage: number };
  performance: {
    accuracy: number;
    averageTime: number;
    streak: number;
  };
}

export function useQuestions(options: UseQuestionsOptions = {}): UseQuestionsResult {
  const {
    subject,
    autoLoad = true,
    adaptive = true,
    prefetch = true
  } = options;

  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [performance, setPerformance] = useState({
    accuracy: 0,
    averageTime: 0,
    streak: 0
  });

  // Refs for tracking
  const questionStartTime = useRef<number>(Date.now());
  const answeredQuestions = useRef<Set<string>>(new Set());

  // Redux state
  const { profile } = useAppSelector(state => state.student);
  const { difficulty, subjectMastery } = useAppSelector(state => state.game);

  const userId = profile?.id || 'anonymous';
  const ageGroup = profile ? (
    profile.age <= 5 ? '3-5' :
    profile.age <= 8 ? '6-8' : '9+'
  ) : '6-8';

  /**
   * Load questions with filters
   */
  const loadQuestions = useCallback(async (filter?: QuestionFilter) => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedQuestions = await questionService.getQuestions({
        subject: filter?.subject || subject,
        ageGroup: filter?.ageGroup || ageGroup,
        difficulty: filter?.difficulty || difficulty,
        ...filter
      });

      setQuestions(loadedQuestions);
      setCurrentIndex(0);
      questionStartTime.current = Date.now();

      // Prefetch additional questions in background if enabled
      if (prefetch && subject) {
        const mastery = subjectMastery[subject] || 1;
        questionService.prefetchQuestions(userId, subject, mastery);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load questions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [subject, ageGroup, difficulty, userId, subjectMastery, prefetch]);

  /**
   * Load adaptive questions based on user performance
   */
  const loadAdaptiveQuestions = useCallback(async (count: number = 10) => {
    if (!subject) {
      setError(new Error('Subject is required for adaptive questions'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current performance for this subject
      const subjectPerformance = questionService.getUserSubjectPerformance(userId, subject);

      const params: AdaptiveSelectionParams = {
        userId,
        subject,
        currentMastery: subjectMastery[subject] || 1,
        recentPerformance: subjectPerformance.accuracy || 0.5,
        preferredDifficulty: difficulty,
        count
      };

      const adaptiveQuestions = await questionService.getAdaptiveQuestions(params);
      setQuestions(adaptiveQuestions);
      setCurrentIndex(0);
      questionStartTime.current = Date.now();

      // Update performance display
      setPerformance({
        accuracy: subjectPerformance.accuracy * 100,
        averageTime: subjectPerformance.averageTime,
        streak: subjectPerformance.streak
      });
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load adaptive questions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [subject, userId, subjectMastery, difficulty]);

  /**
   * Navigate to next question
   */
  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      questionStartTime.current = Date.now();
    } else if (adaptive && subject) {
      // Load more adaptive questions when reaching the end
      loadAdaptiveQuestions(10);
    }
  }, [currentIndex, questions.length, adaptive, subject, loadAdaptiveQuestions]);

  /**
   * Navigate to previous question
   */
  const previousQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      questionStartTime.current = Date.now();
    }
  }, [currentIndex]);

  /**
   * Submit answer and get feedback
   */
  const submitAnswer = useCallback(async (
    answer: string,
    timeSpent?: number
  ): Promise<boolean> => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return false;

    // Calculate time spent if not provided
    const actualTimeSpent = timeSpent || (Date.now() - questionStartTime.current) / 1000;

    // Check if answer is correct
    const isCorrect = answer === currentQuestion.correctAnswer;

    // Record answer for analytics
    await questionService.recordAnswer(
      userId,
      currentQuestion.id,
      isCorrect,
      actualTimeSpent,
      0 // hints used - would come from game state
    );

    // Mark as answered
    answeredQuestions.current.add(currentQuestion.id);

    // Update performance if we have subject
    if (subject) {
      const newPerformance = questionService.getUserSubjectPerformance(userId, subject);
      setPerformance({
        accuracy: newPerformance.accuracy * 100,
        averageTime: newPerformance.averageTime,
        streak: newPerformance.streak
      });
    }

    return isCorrect;
  }, [questions, currentIndex, userId, subject]);

  /**
   * Get progress information
   */
  const getProgress = useCallback(() => {
    const total = questions.length;
    const current = currentIndex + 1;
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return {
      current,
      total,
      percentage
    };
  }, [questions.length, currentIndex]);

  /**
   * Auto-load questions on mount if enabled
   */
  useEffect(() => {
    if (autoLoad) {
      if (adaptive && subject) {
        loadAdaptiveQuestions();
      } else {
        loadQuestions();
      }
    }
  }, []); // Only on mount

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      // Could save progress to localStorage or Redux here
      answeredQuestions.current.clear();
    };
  }, []);

  return {
    questions,
    currentQuestion: questions[currentIndex] || null,
    isLoading,
    error,
    loadQuestions,
    loadAdaptiveQuestions,
    nextQuestion,
    previousQuestion,
    submitAnswer,
    getProgress,
    performance
  };
}

/**
 * Hook for managing a single question session
 */
export function useQuestionSession(questionId: string) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    let mounted = true;

    questionService.getQuestion(questionId).then(q => {
      if (mounted) {
        setQuestion(q);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [questionId]);

  const submitAnswer = useCallback(async (answer: string): Promise<boolean> => {
    if (!question) return false;

    const timeSpent = (Date.now() - startTime) / 1000;
    const isCorrect = answer === question.correctAnswer;

    await questionService.recordAnswer(
      'current-user', // Would get from context
      questionId,
      isCorrect,
      timeSpent,
      0
    );

    return isCorrect;
  }, [question, questionId, startTime]);

  return {
    question,
    isLoading,
    submitAnswer,
    timeElapsed: () => (Date.now() - startTime) / 1000
  };
}

/**
 * Hook for question performance analytics
 */
export function useQuestionAnalytics(subject?: string) {
  const [analytics, setAnalytics] = useState<any>(null);
  const { profile } = useAppSelector(state => state.student);

  useEffect(() => {
    if (!profile?.id) return;

    const updateAnalytics = () => {
      if (subject) {
        const performance = questionService.getUserSubjectPerformance(profile.id, subject);
        setAnalytics({
          subject,
          ...performance
        });
      } else {
        // Get overall performance across all subjects
        const subjects = ['mathematics', 'english', 'science', 'geography', 'arts', 'logic'];
        const overallStats = subjects.map(s => ({
          subject: s,
          ...questionService.getUserSubjectPerformance(profile.id, s)
        }));

        setAnalytics({
          overall: overallStats,
          totalQuestions: overallStats.reduce((sum, s) => sum + s.totalQuestions, 0),
          totalCorrect: overallStats.reduce((sum, s) => sum + s.correctAnswers, 0)
        });
      }
    };

    updateAnalytics();

    // Update every 30 seconds if on page
    const interval = setInterval(updateAnalytics, 30000);
    return () => clearInterval(interval);
  }, [profile?.id, subject]);

  return analytics;
}

export default useQuestions;