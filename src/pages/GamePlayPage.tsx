import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAppSelector, useAppDispatch } from '@/store';
import { Button } from '@/components/ui/Button';
import { FeedbackModal } from '@/components/ui/FeedbackModal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import {
  updateGameProgress,
  completeGame,
  pauseGame,
  resumeGame,
  submitAnswer,
  skipQuestion
} from '@/store/slices/gameSlice';
import {
  updateSkillProgress,
  trackPerformance,
  adjustDifficulty
} from '@/store/slices/adaptiveSlice';
import { trackEvent } from '@/store/slices/analyticsSlice';
import { contentFactory } from '@/services/content/ContentFactory';
import { GameContent, Question } from '@/services/database/schema';
import { DifficultyLevel } from '@/types';

interface GameState {
  currentQuestionIndex: number;
  score: number;
  streak: number;
  timeElapsed: number;
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  hintsUsed: number;
  isPaused: boolean;
  isComplete: boolean;
  totalQuestions: number;
}

const GamePlayPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();

  const { profile } = useAppSelector(state => state.student);
  const { currentGame, gameProgress } = useAppSelector(state => state.game);
  const { soundEnabled, visualEffects } = useAppSelector(state => state.settings.app);
  const adaptiveData = useAppSelector(state => state.adaptive);

  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    timeElapsed: 0,
    answers: [],
    hintsUsed: 0,
    isPaused: false,
    isComplete: false,
    totalQuestions: 0
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning'>('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameContent, setGameContent] = useState<GameContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout>();
  const questionTimerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());

  // Dynamic questions loaded from ContentFactory - FIXES THE CRITICAL BUG!
  const questions: Question[] = gameContent?.questions || [];
  const currentQuestion = questions[gameState.currentQuestionIndex];

  // Load game content when component mounts - CRITICAL FIX
  useEffect(() => {
    const loadGameContent = async () => {
      if (!gameId || !profile?.ageGroup) {
        setLoadError('Missing game ID or user profile');
        setIsLoading(false);
        return;
      }

      try {
        console.log(`🎮 Loading game content for: ${gameId}`);
        console.log(`👤 Profile ageGroup: ${profile.ageGroup}`);

        // Get difficulty from adaptive system or default
        // Convert Elo rating to difficulty level
        const convertEloToDifficulty = (elo: number): DifficultyLevel => {
          if (elo < 1000) return 'easy';
          if (elo < 1400) return 'medium';
          if (elo < 1800) return 'hard';
          return 'adaptive';
        };
        const difficulty: DifficultyLevel = convertEloToDifficulty(adaptiveData.currentDifficulty);
        console.log(`⚙️ Using difficulty: ${difficulty}`);

        // Load content using ContentFactory - this fixes the critical bug!
        const content = await contentFactory.loadGameContent(gameId, profile.ageGroup, difficulty);

        if (!content) {
          throw new Error(`No content found for game: ${gameId}`);
        }

        console.log(`✅ Successfully loaded ${content.subject} content:`, content.title);
        console.log(`📝 Questions count: ${content.questions.length}`);

        setGameContent(content);
        setGameState(prev => ({
          ...prev,
          totalQuestions: content.questions.length
        }));

        // Track game start event
        dispatch(trackEvent({
          category: 'game',
          action: 'start',
          label: `${content.subject}-${gameId}`,
          value: content.questions.length
        }));

      } catch (error) {
        console.error('❌ Failed to load game content:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load game content');
      } finally {
        setIsLoading(false);
      }
    };

    loadGameContent();
  }, [gameId, profile?.ageGroup, adaptiveData.currentDifficulty, dispatch]);

  // Timer management
  useEffect(() => {
    if (!gameState.isPaused && !gameState.isComplete && !isLoading) {
      timerRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isPaused, gameState.isComplete, isLoading]);

  // Question timer
  useEffect(() => {
    if (currentQuestion?.timeLimit && !gameState.isPaused && !isLoading) {
      setTimeRemaining(currentQuestion.timeLimit);

      questionTimerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            handleTimeUp();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    }

    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [currentQuestion, gameState.isPaused, gameState.currentQuestionIndex, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, []);

  const handleTimeUp = useCallback(() => {
    if (soundEnabled) playSound('warning');
    triggerHaptic('warning');

    setFeedbackType('warning');
    setFeedbackMessage('Time\'s up! Let\'s try the next question.');
    setShowFeedback(true);

    // Move to next question after a delay
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }, [soundEnabled, playSound, triggerHaptic]);

  const handleAnswerSubmit = useCallback(() => {
    if (!selectedAnswer || !currentQuestion) return;

    const questionStartTime = startTimeRef.current;
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Record answer
    const answerRecord = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      isCorrect,
      timeSpent: Math.round(timeSpent)
    };

    setGameState(prev => ({
      ...prev,
      answers: [...prev.answers, answerRecord],
      score: prev.score + (isCorrect ? currentQuestion.points : 0),
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    // Provide feedback
    if (isCorrect) {
      if (soundEnabled) playSound('success');
      triggerHaptic('success');
      setFeedbackType('success');
      setFeedbackMessage(currentQuestion.explanation || 'Excellent! You got it right!');

      // Trigger confetti for correct answers
      if (visualEffects) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      if (soundEnabled) playSound('error');
      triggerHaptic('error');
      setFeedbackType('error');
      setFeedbackMessage(currentQuestion.explanation || `The correct answer is ${currentQuestion.correctAnswer}`);
    }

    setShowFeedback(true);

    // Track performance
    const subject = gameContent?.subject || 'mathematics';
    const trackingSubject = subject === 'mathematics' ? 'math' : subject;
    dispatch(trackPerformance({
      subject: trackingSubject as 'math' | 'english' | 'science',
      difficulty: currentQuestion.difficulty,
      correct: isCorrect,
      responseTime: timeSpent,
      hintsUsed: gameState.hintsUsed
    }));

    // Move to next question after feedback
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  }, [
    selectedAnswer,
    currentQuestion,
    gameState.hintsUsed,
    soundEnabled,
    visualEffects,
    playSound,
    triggerHaptic,
    dispatch
  ]);

  const nextQuestion = useCallback(() => {
    setShowFeedback(false);
    setSelectedAnswer('');
    setShowHint(false);

    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }

    if (gameState.currentQuestionIndex >= questions.length - 1) {
      // Game complete
      completeGame();
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      startTimeRef.current = Date.now();
    }
  }, [gameState.currentQuestionIndex, questions.length]);

  const completeGame = useCallback(() => {
    const correctAnswers = gameState.answers.filter(a => a.isCorrect).length;
    const accuracy = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;

    setGameState(prev => ({ ...prev, isComplete: true }));

    if (soundEnabled) playSound('levelUp');
    triggerHaptic('success');

    // Celebrate completion
    if (visualEffects) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.4 }
      });
    }

    // Track completion
    dispatch(trackEvent({
      category: 'game',
      action: 'complete',
      label: `${gameContent?.subject}-${gameId}`,
      value: gameState.score
    }));

    // Update adaptive difficulty
    dispatch(adjustDifficulty({
      direction: accuracy > 80 ? 'increase' : accuracy < 60 ? 'decrease' : 'maintain',
      reason: `Game completed with ${accuracy}% accuracy`
    }));
  }, [
    gameState.answers,
    gameState.score,
    gameState.timeElapsed,
    gameState.hintsUsed,
    questions.length,
    gameId,
    gameContent?.subject,
    soundEnabled,
    visualEffects,
    playSound,
    triggerHaptic,
    dispatch
  ]);

  const handlePauseToggle = () => {
    if (gameState.isPaused) {
      dispatch(resumeGame());
    } else {
      dispatch(pauseGame());
    }

    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be saved.')) {
      dispatch(pauseGame());
      navigate('/games');
    }
  };

  const handleHint = () => {
    if (currentQuestion?.hint) {
      setShowHint(true);
      setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));

      if (soundEnabled) playSound('hint');
      triggerHaptic('light');
    }
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart? All progress will be lost.')) {
      setGameState({
        currentQuestionIndex: 0,
        score: 0,
        streak: 0,
        timeElapsed: 0,
        answers: [],
        hintsUsed: 0,
        isPaused: false,
        isComplete: false,
        totalQuestions: questions.length
      });
      setSelectedAnswer('');
      setShowFeedback(false);
      setShowHint(false);
      startTimeRef.current = Date.now();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-600 flex items-center justify-center">
        <motion.div
          className="text-white text-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="text-3xl font-bold mb-4">Loading {gameId}...</div>
          <div className="text-lg opacity-80">Preparing your adventure!</div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (loadError || !gameContent || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-500 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            {loadError || 'Could not load game content. Please try again.'}
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
              variant="primary"
            >
              🔄 Try Again
            </Button>
            <Button
              onClick={() => navigate('/games')}
              className="w-full"
              variant="secondary"
            >
              🏠 Back to Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game complete state
  if (gameState.isComplete) {
    const correctAnswers = gameState.answers.filter(a => a.isCorrect).length;
    const accuracy = (correctAnswers / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-500 to-blue-500 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-2xl p-8 text-center max-w-md w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h2>
          <p className="text-gray-600 mb-6">You completed {gameContent.title}!</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="font-bold">{gameState.score} points</span>
            </div>
            <div className="flex justify-between">
              <span>Accuracy:</span>
              <span className="font-bold">{Math.round(accuracy)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-bold">{Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span>Best Streak:</span>
              <span className="font-bold">{gameState.streak} in a row</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRestart}
              className="w-full"
              variant="primary"
            >
              🔄 Play Again
            </Button>
            <Button
              onClick={() => navigate('/games')}
              className="w-full"
              variant="secondary"
            >
              🏠 Back to Games
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Ensure we have a current question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-500 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Complete!</h2>
          <p className="text-gray-600 mb-6">Congratulations! You've finished all the questions.</p>
          <Button
            onClick={() => navigate('/games')}
            className="w-full"
            variant="primary"
          >
            🏠 Back to Games
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            {gameContent?.title || 'Learning Game'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <span className="text-sm opacity-75">Score: </span>
              <span className="font-bold">{gameState.score}</span>
            </div>
            <div className="text-white">
              <span className="text-sm opacity-75">Time: </span>
              <span className="font-bold">
                {Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar
            current={gameState.currentQuestionIndex + 1}
            total={questions.length}
            className="h-3"
          />
          <p className="text-white text-center mt-2">
            Question {gameState.currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Game Controls */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={handleExit} variant="outline">
            ← Exit
          </Button>
          <Button onClick={handlePauseToggle} variant="outline">
            {gameState.isPaused ? '▶ Resume' : '⏸ Pause'}
          </Button>
        </div>

        {/* Question Timer */}
        {timeRemaining !== null && (
          <div className="mb-4">
            <div className="flex justify-center">
              <div className={`text-2xl font-bold ${timeRemaining <= 10 ? 'text-red-300' : 'text-white'}`}>
                ⏰ {timeRemaining}s
              </div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          className="bg-white rounded-2xl p-8 mb-6 shadow-xl"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Question Media */}
          {currentQuestion.media && (
            <div className="mb-6 text-center">
              {currentQuestion.media.type === 'image' && (
                <div className="inline-block bg-gray-100 rounded-lg p-4">
                  <div className="text-4xl">📷</div>
                  <p className="text-sm text-gray-500 mt-2">{currentQuestion.media.alt}</p>
                </div>
              )}
              {currentQuestion.media.type === 'audio' && (
                <div className="inline-block bg-blue-100 rounded-lg p-4">
                  <div className="text-4xl">🔊</div>
                  <p className="text-sm text-gray-500 mt-2">Audio content</p>
                </div>
              )}
            </div>
          )}

          {/* Question Text */}
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  variant={selectedAnswer === option ? 'primary' : 'outline'}
                  className="p-4 text-lg h-auto"
                  size="large"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {/* Typing Input */}
          {currentQuestion.type === 'typing' && (
            <div className="mb-6">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center"
                placeholder="Type your answer here..."
              />
            </div>
          )}

          {/* Hint */}
          {showHint && currentQuestion.hint && (
            <motion.div
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start space-x-2">
                <span className="text-yellow-500 text-xl">💡</span>
                <p className="text-yellow-800">{currentQuestion.hint}</p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handleHint}
              variant="outline"
              disabled={showHint}
            >
              💡 Get Hint
            </Button>

            <Button
              onClick={handleAnswerSubmit}
              variant="primary"
              disabled={!selectedAnswer || gameState.isPaused}
              className="px-8 py-3 text-lg"
            >
              Submit Answer
            </Button>
          </div>
        </motion.div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{gameState.streak}</div>
            <div className="text-white opacity-75">Streak</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{gameState.hintsUsed}</div>
            <div className="text-white opacity-75">Hints Used</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{gameState.answers.filter(a => a.isCorrect).length}</div>
            <div className="text-white opacity-75">Correct</div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        type={feedbackType}
        message={feedbackMessage}
      />
    </div>
  );
};

export default GamePlayPage;