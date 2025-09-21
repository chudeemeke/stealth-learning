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

interface Question {
  id: string;
  type: 'multiple-choice' | 'drag-drop' | 'typing' | 'drawing';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  hint?: string;
  explanation?: string;
  media?: {
    type: 'image' | 'audio' | 'video';
    url: string;
  };
  difficulty: number;
  points: number;
  timeLimit?: number;
}

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
    isComplete: false
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning'>('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const timerRef = useRef<NodeJS.Timeout>();
  const questionTimerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());

  const questions: Question[] = [
    {
      id: '1',
      type: 'multiple-choice',
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      hint: 'Count on your fingers!',
      explanation: '2 + 2 equals 4. You can count: 1, 2, then add 2 more: 3, 4!',
      difficulty: 1,
      points: 10,
      timeLimit: 30
    },
    {
      id: '2',
      type: 'multiple-choice',
      question: 'What is 5 + 3?',
      options: ['7', '8', '9', '10'],
      correctAnswer: '8',
      hint: 'Start with 5 and count up 3 more',
      explanation: '5 + 3 equals 8. Count: 5... 6, 7, 8!',
      difficulty: 1,
      points: 10,
      timeLimit: 30
    },
    {
      id: '3',
      type: 'multiple-choice',
      question: 'What is 10 - 4?',
      options: ['4', '5', '6', '7'],
      correctAnswer: '6',
      hint: 'Start with 10 and take away 4',
      explanation: '10 - 4 equals 6. If you have 10 items and remove 4, you have 6 left!',
      difficulty: 2,
      points: 15,
      timeLimit: 30
    },
    {
      id: '4',
      type: 'typing',
      question: 'Type the answer: 7 + 5 = ?',
      correctAnswer: '12',
      hint: '7 + 5 is the same as 10 + 2',
      explanation: '7 + 5 equals 12. You can think of it as 7 + 3 = 10, then 10 + 2 = 12!',
      difficulty: 2,
      points: 20,
      timeLimit: 45
    },
    {
      id: '5',
      type: 'multiple-choice',
      question: 'What is 3 × 4?',
      options: ['10', '11', '12', '13'],
      correctAnswer: '12',
      hint: '3 × 4 means 3 groups of 4',
      explanation: '3 × 4 equals 12. It means 4 + 4 + 4 = 12!',
      difficulty: 3,
      points: 25,
      timeLimit: 45
    }
  ];

  const currentQuestion = questions[gameState.currentQuestionIndex];

  useEffect(() => {
    loadGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!gameState.isPaused && !gameState.isComplete) {
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
  }, [gameState.isPaused, gameState.isComplete]);

  useEffect(() => {
    if (currentQuestion?.timeLimit && !gameState.isPaused) {
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
    }

    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [gameState.currentQuestionIndex, gameState.isPaused]);

  const loadGame = async () => {
    setIsLoading(true);
    try {
      dispatch(trackEvent({
        category: 'game',
        action: 'start',
        label: gameId,
        value: 1
      }));

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading game:', error);
      navigate('/games');
    }
  };

  const handleAnswerSubmit = useCallback(() => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    if (soundEnabled) {
      playSound(isCorrect ? 'success' : 'error');
    }

    triggerHaptic(isCorrect ? 'success' : 'error');

    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + currentQuestion.points : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      answers: [...prev.answers, {
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        isCorrect,
        timeSpent
      }]
    }));

    dispatch(submitAnswer({
      gameId: gameId!,
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      isCorrect,
      timeSpent,
      hintsUsed: showHint ? 1 : 0
    }));

    dispatch(trackPerformance({
      subject: 'math',
      difficulty: currentQuestion.difficulty,
      correct: isCorrect,
      responseTime: timeSpent,
      hintsUsed: showHint ? 1 : 0
    }));

    setFeedbackType(isCorrect ? 'success' : 'error');
    setFeedbackMessage(
      isCorrect
        ? getSuccessMessage()
        : `Not quite! ${currentQuestion.explanation || 'Try again next time!'}`
    );
    setShowFeedback(true);

    if (isCorrect && visualEffects) {
      triggerConfetti();
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 3000);
  }, [selectedAnswer, currentQuestion, showHint, gameId, soundEnabled, visualEffects]);

  const moveToNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer('');
    setShowHint(false);
    startTimeRef.current = Date.now();

    if (gameState.currentQuestionIndex < questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      completeGameSession();
    }
  };

  const completeGameSession = () => {
    const totalScore = gameState.score;
    const accuracy = (gameState.answers.filter(a => a.isCorrect).length / questions.length) * 100;
    const avgResponseTime = gameState.answers.reduce((sum, a) => sum + a.timeSpent, 0) / gameState.answers.length;

    dispatch(completeGame({
      gameId: gameId!,
      score: totalScore,
      accuracy,
      timeElapsed: gameState.timeElapsed,
      questionsAnswered: questions.length,
      correctAnswers: gameState.answers.filter(a => a.isCorrect).length,
      hintsUsed: gameState.hintsUsed,
      avgResponseTime
    }));

    dispatch(updateSkillProgress({
      subject: 'math',
      points: totalScore,
      accuracy
    }));

    dispatch(adjustDifficulty({
      direction: accuracy > 80 ? 'increase' : accuracy < 60 ? 'decrease' : 'maintain',
      reason: `Game completed with ${accuracy}% accuracy`
    }));

    setGameState(prev => ({ ...prev, isComplete: true }));

    if (soundEnabled) {
      playSound('complete');
    }

    if (visualEffects) {
      celebrateCompletion();
    }
  };

  const handleTimeUp = () => {
    if (soundEnabled) {
      playSound('warning');
    }

    setFeedbackType('warning');
    setFeedbackMessage("Time's up! Moving to the next question.");
    setShowFeedback(true);

    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const handleHintRequest = () => {
    if (currentQuestion.hint) {
      setShowHint(true);
      setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));

      if (soundEnabled) {
        playSound('hint');
      }

      dispatch(trackEvent({
        category: 'game',
        action: 'hint_used',
        label: currentQuestion.id,
        value: 1
      }));
    }
  };

  const handlePauseResume = () => {
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

  const getSuccessMessage = () => {
    const messages = [
      'Excellent work! 🌟',
      'You\'re amazing! 🎉',
      'Great job! 🏆',
      'Fantastic! 🚀',
      'You did it! 🎊',
      'Brilliant! ⭐',
      'Awesome! 🌈',
      'Perfect! 💯'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const celebrateCompletion = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options?.map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAnswer(option)}
                className={`p-6 rounded-xl text-2xl font-bold transition-all ${
                  selectedAnswer === option
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md hover:shadow-lg'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );

      case 'typing':
        return (
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">Loading game...</p>
        </div>
      </div>
    );
  }

  if (gameState.isComplete) {
    const accuracy = (gameState.answers.filter(a => a.isCorrect).length / questions.length) * 100;
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Game Complete! 🎉
          </h1>

          <div className="flex justify-center mb-6">
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: i < stars ? 1.2 : 0.8 }}
                transition={{ delay: i * 0.2 }}
                className={`text-5xl ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ⭐
              </motion.span>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Final Score</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{gameState.score}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{accuracy.toFixed(0)}%</p>
              </div>

              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">Best Streak</p>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
                {gameState.streak} in a row!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Play Again
            </Button>

            <Button
              onClick={() => navigate('/games')}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Back to Games
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleExit}
                variant="outline"
                size="sm"
              >
                ← Exit
              </Button>

              <Button
                onClick={handlePauseResume}
                variant="outline"
                size="sm"
              >
                {gameState.isPaused ? '▶ Resume' : '⏸ Pause'}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gameState.score}</p>
              </div>

              {gameState.streak > 0 && (
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
                  <p className="text-2xl font-bold text-orange-500">🔥 {gameState.streak}</p>
                </div>
              )}

              {timeRemaining !== null && (
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                  <p className={`text-2xl font-bold ${timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
                    {timeRemaining}s
                  </p>
                </div>
              )}
            </div>
          </div>

          <ProgressBar
            progress={(gameState.currentQuestionIndex / questions.length) * 100}
            className="h-3"
          />

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Question {gameState.currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {gameState.isPaused ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Game Paused</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Take a break! Your progress is saved.
            </p>
            <Button onClick={handlePauseResume} size="lg" variant="primary">
              Resume Game
            </Button>
          </div>
        ) : (
          <motion.div
            key={gameState.currentQuestionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              {currentQuestion.question}
            </h2>

            {currentQuestion.media && (
              <div className="mb-6 flex justify-center">
                {currentQuestion.media.type === 'image' && (
                  <img
                    src={currentQuestion.media.url}
                    alt="Question"
                    className="max-w-full h-auto rounded-lg"
                  />
                )}
              </div>
            )}

            {showHint && currentQuestion.hint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mb-6"
              >
                <p className="text-yellow-800 dark:text-yellow-200">
                  💡 Hint: {currentQuestion.hint}
                </p>
              </motion.div>
            )}

            <div className="mb-8">
              {renderQuestion()}
            </div>

            <div className="flex justify-center gap-4">
              {!showHint && currentQuestion.hint && (
                <Button
                  onClick={handleHintRequest}
                  variant="outline"
                >
                  💡 Get Hint
                </Button>
              )}

              <Button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                variant="primary"
                size="lg"
              >
                Submit Answer
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackModal
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            type={feedbackType}
            message={feedbackMessage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamePlayPage;