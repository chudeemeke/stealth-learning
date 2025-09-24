import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAppSelector, useAppDispatch } from '@/store';
import { FeedbackModal } from '@/components/ui/FeedbackModal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useHaptic } from '@/hooks/useHaptic';
import { useToast, ToastContainer } from '@/components/ui/ToastNotification';
import { Z_INDEX_CLASSES } from '@/styles/z-index';

// Enhanced components
import { ImmersiveBackground } from '@/components/enhanced/ImmersiveBackground';
import { ParticleSystem } from '@/components/enhanced/ParticleSystem';
import { GameCharacter } from '@/components/enhanced/GameCharacter';
import { EnhancedButton } from '@/components/enhanced/EnhancedButton';
import { audioService } from '@/services/audio/AudioService';

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
  combo: number;
  maxCombo: number;
}

const EnhancedGamePlayPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { triggerHaptic } = useHaptic();
  const { toasts, showToast, showConfirmToast, dismissToast } = useToast();

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
    totalQuestions: 0,
    combo: 0,
    maxCombo: 0
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
  const [characterEmotion, setCharacterEmotion] = useState<'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging'>('happy');
  const [characterMessage, setCharacterMessage] = useState<string>('');
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  const [comboEffect, setComboEffect] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();
  const questionTimerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());

  // Dynamic questions loaded from ContentFactory
  const questions: Question[] = gameContent?.questions || [];
  const currentQuestion = questions[gameState.currentQuestionIndex];

  // Load game content when component mounts
  useEffect(() => {
    const loadGameContent = async () => {
      if (!gameId || !profile?.ageGroup) {
        setLoadError('Missing game ID or user profile');
        setIsLoading(false);
        return;
      }

      try {
        console.log(`🎮 Loading enhanced game content for: ${gameId}`);

        // Get difficulty from adaptive system
        const convertEloToDifficulty = (elo: number): DifficultyLevel => {
          if (elo < 1000) return 'easy';
          if (elo < 1400) return 'medium';
          if (elo < 1800) return 'hard';
          return 'adaptive';
        };
        const difficulty: DifficultyLevel = convertEloToDifficulty(adaptiveData.currentDifficulty);

        // Load content using ContentFactory
        const content = await contentFactory.loadGameContent(gameId, profile.ageGroup, difficulty);

        if (!content) {
          throw new Error(`No content found for game: ${gameId}`);
        }

        setGameContent(content);
        setGameState(prev => ({
          ...prev,
          totalQuestions: content.questions.length
        }));

        // Start background music for the subject
        const musicMap = {
          mathematics: 'mathMusic',
          english: 'englishMusic',
          science: 'scienceMusic'
        };
        const musicId = musicMap[content.subject as keyof typeof musicMap] || 'mathMusic';
        audioService.playMusic(musicId, 2000);

        // Set initial character message
        setCharacterMessage(`Welcome to ${content.title}! Let's start this amazing adventure!`);
        setCharacterEmotion('excited');

        // Track game start
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

    // Cleanup audio on unmount
    return () => {
      audioService.stopMusic(1000);
    };
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

  const handleTimeUp = useCallback(() => {
    audioService.playSound('timeWarning');
    triggerHaptic('warning');

    setFeedbackType('warning');
    setFeedbackMessage('Time\'s up! Don\'t worry, let\'s try the next question!');
    setShowFeedback(true);
    setCharacterEmotion('encouraging');
    setCharacterMessage('No worries! Time management is a skill we learn together!');

    // Reset combo
    setGameState(prev => ({ ...prev, combo: 0 }));

    setTimeout(() => {
      nextQuestion();
    }, 2500);
  }, [triggerHaptic]);

  const handleAnswerSubmit = useCallback(() => {
    if (!selectedAnswer || !currentQuestion) return;

    const questionStartTime = startTimeRef.current;
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Calculate points with combo bonus
    const basePoints = currentQuestion.points;
    const comboBonus = gameState.combo > 0 ? Math.floor(basePoints * (gameState.combo * 0.1)) : 0;
    const totalPoints = basePoints + comboBonus;

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
      score: prev.score + (isCorrect ? totalPoints : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
      combo: isCorrect ? prev.combo + 1 : 0,
      maxCombo: isCorrect ? Math.max(prev.maxCombo, prev.combo + 1) : prev.maxCombo
    }));

    // Enhanced feedback based on correctness
    if (isCorrect) {
      // Play subject-specific success sound
      const subject = gameContent?.subject || 'mathematics';
      const successSounds = {
        mathematics: 'mathCorrect',
        english: 'englishCorrect',
        science: 'scienceCorrect'
      };
      audioService.playSound(successSounds[subject as keyof typeof successSounds] || 'correct');

      triggerHaptic('success');
      setFeedbackType('success');

      // Dynamic success messages based on combo
      let message = currentQuestion.explanation || 'Excellent! You got it right!';
      if (gameState.combo >= 5) {
        message = `🔥 AMAZING ${gameState.combo + 1} STREAK! You're on fire! ${message}`;
        setComboEffect(true);
        setTimeout(() => setComboEffect(false), 1000);
      } else if (gameState.combo >= 3) {
        message = `⚡ COMBO x${gameState.combo + 1}! Keep it up! ${message}`;
      }

      setFeedbackMessage(message);
      setCharacterEmotion('celebrating');
      setCharacterMessage('Fantastic work! You are becoming a real expert!');

      // Enhanced confetti based on streak
      if (visualEffects) {
        const confettiOptions = {
          particleCount: 50 + (gameState.combo * 10),
          spread: 60 + (gameState.combo * 5),
          origin: { y: 0.6 },
          colors: gameContent?.subject === 'mathematics' ? ['#3B82F6', '#1D4ED8'] :
                  gameContent?.subject === 'english' ? ['#EF4444', '#DC2626'] :
                  ['#10B981', '#059669']
        };

        if (gameState.combo >= 5) {
          // Epic celebration for long streaks
          confetti({
            ...confettiOptions,
            particleCount: 200,
            spread: 120,
            startVelocity: 50
          });
          setCelebrationTrigger(true);
          setTimeout(() => setCelebrationTrigger(false), 2000);
        } else {
          confetti(confettiOptions);
        }
      }

    } else {
      audioService.playSound('incorrect');
      triggerHaptic('error');
      setFeedbackType('error');
      setFeedbackMessage(
        currentQuestion.explanation ||
        `The correct answer is ${currentQuestion.correctAnswer}. Don't give up!`
      );
      setCharacterEmotion('encouraging');
      setCharacterMessage('Learning from mistakes makes us stronger! Let\'s keep going!');
    }

    setShowFeedback(true);

    // Track performance for adaptive learning
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
    }, isCorrect && gameState.combo >= 3 ? 4000 : 3000); // Longer celebration for combos
  }, [
    selectedAnswer,
    currentQuestion,
    gameState.combo,
    gameState.hintsUsed,
    gameContent?.subject,
    visualEffects,
    triggerHaptic,
    dispatch
  ]);

  const nextQuestion = useCallback(() => {
    setShowFeedback(false);
    setSelectedAnswer('');
    setShowHint(false);
    setCharacterEmotion('thinking');

    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }

    if (gameState.currentQuestionIndex >= questions.length - 1) {
      completeGameHandler();
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      startTimeRef.current = Date.now();

      // Set encouraging message for next question
      const encouragements = [
        "Ready for the next challenge?",
        "Let's see what you can do!",
        "You've got this!",
        "Another adventure awaits!",
        "Show me your skills!"
      ];
      setCharacterMessage(encouragements[Math.floor(Math.random() * encouragements.length)]);
    }
  }, [gameState.currentQuestionIndex, questions.length]);

  const completeGameHandler = useCallback(() => {
    const correctAnswers = gameState.answers.filter(a => a.isCorrect).length;
    const accuracy = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;

    setGameState(prev => ({ ...prev, isComplete: true }));

    // Play victory music
    audioService.playMusic('victoryMusic');
    audioService.playSound('achievement');
    triggerHaptic('success');

    // Epic celebration effects
    if (visualEffects) {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.4 },
        colors: ['#FFD700', '#FFA500', '#FF6347']
      });

      // Multiple bursts for completion
      setTimeout(() => confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.2, y: 0.6 }
      }), 300);

      setTimeout(() => confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.8, y: 0.6 }
      }), 600);
    }

    setCelebrationTrigger(true);
    setCharacterEmotion('celebrating');
    setCharacterMessage(`🎉 Incredible! You completed ${gameContent?.title || 'the game'}! You're amazing!`);

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
    questions.length,
    gameId,
    gameContent?.subject,
    gameContent?.title,
    visualEffects,
    triggerHaptic,
    dispatch
  ]);

  const handlePauseToggle = () => {
    const newPausedState = !gameState.isPaused;

    if (newPausedState) {
      dispatch(pauseGame());
      audioService.playSound('pause');
      audioService.pauseMusic();
      setCharacterMessage('Taking a break? That\'s smart! I\'ll wait here for you.');
    } else {
      dispatch(resumeGame());
      audioService.playSound('resume');
      audioService.resumeMusic();
      setCharacterMessage('Welcome back! Ready to continue our adventure?');
    }

    setGameState(prev => ({ ...prev, isPaused: newPausedState }));
  };

  const handleExit = () => {
    showConfirmToast(
      'Are you sure you want to exit? Your progress will be saved.',
      () => {
        dispatch(pauseGame());
        audioService.stopMusic(500);
        showToast('Progress saved! See you soon!', 'success', { duration: 2000 });
        setTimeout(() => navigate('/games'), 500);
      },
      () => {
        showToast('Keep playing! You\'re doing great!', 'info', { duration: 2000 });
      }
    );
  };

  const handleHint = () => {
    if (currentQuestion?.hint) {
      setShowHint(true);
      setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
      audioService.playSound('hint');
      triggerHaptic('light');
      setCharacterEmotion('thinking');
      setCharacterMessage('Here\'s a little help! Sometimes hints make learning even more fun!');
    }
  };

  // Loading state with enhanced visuals
  if (isLoading) {
    return (
      <ImmersiveBackground subject="general" intensity="subtle">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            className="text-white text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="text-8xl mb-8"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              🎮
            </motion.div>
            <motion.h2
              className="text-4xl font-bold mb-4"
              animate={{
                color: ['#ffffff', '#ffd700', '#ffffff']
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              Loading {gameId}...
            </motion.h2>
            <motion.p
              className="text-xl opacity-80"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Preparing your magical learning adventure!
            </motion.p>
          </motion.div>
        </div>
      </ImmersiveBackground>
    );
  }

  // Error state
  if (loadError || !gameContent || questions.length === 0) {
    return (
      <ImmersiveBackground subject="general" intensity="subtle">
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-12 text-center max-w-lg border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-8xl mb-6">😞</div>
            <h2 className="text-3xl font-bold text-white mb-6">Oops! Something went wrong</h2>
            <p className="text-white/80 mb-8 text-lg">
              {loadError || 'Could not load game content. Please try again.'}
            </p>
            <div className="space-y-4">
              <EnhancedButton
                onClick={() => window.location.reload()}
                variant="primary"
                effect="glow"
                size="lg"
                className="w-full"
              >
                🔄 Try Again
              </EnhancedButton>
              <EnhancedButton
                onClick={() => navigate('/games')}
                variant="secondary"
                effect="bounce"
                size="lg"
                className="w-full"
              >
                🏠 Back to Games
              </EnhancedButton>
            </div>
          </motion.div>
        </div>
      </ImmersiveBackground>
    );
  }

  // Game complete state
  if (gameState.isComplete) {
    const correctAnswers = gameState.answers.filter(a => a.isCorrect).length;
    const accuracy = (correctAnswers / questions.length) * 100;

    return (
      <ImmersiveBackground subject={gameContent.subject as any} intensity="dynamic">
        <ParticleSystem
          subject={gameContent.subject as any}
          intensity="high"
          celebration={true}
        />

        <GameCharacter
          subject={gameContent.subject as any}
          emotion="celebrating"
          size="large"
          position="bottom-right"
          message={characterMessage}
        />

        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-12 text-center max-w-2xl w-full border border-white/20"
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 360, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              🎉
            </motion.div>

            <motion.h2
              className="text-5xl font-bold text-white mb-6"
              style={{
                background: 'linear-gradient(45deg, #fff, #ffd700, #fff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              CONGRATULATIONS!
            </motion.h2>

            <p className="text-2xl text-white mb-8">
              You completed {gameContent.title}!
            </p>

            <div className="bg-white/20 rounded-2xl p-6 mb-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{gameState.score}</div>
                  <div className="text-white/80">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{Math.round(accuracy)}%</div>
                  <div className="text-white/80">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-white/80">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{gameState.maxCombo}</div>
                  <div className="text-white/80">Best Combo</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <EnhancedButton
                onClick={() => window.location.reload()}
                variant="magic"
                effect="sparkle"
                size="xl"
                className="w-full"
              >
                🔄 Play Again
              </EnhancedButton>
              <EnhancedButton
                onClick={() => navigate('/games')}
                variant="primary"
                effect="glow"
                size="xl"
                className="w-full"
              >
                🏠 Choose New Adventure
              </EnhancedButton>
            </div>
          </motion.div>
        </div>
      </ImmersiveBackground>
    );
  }

  // Main game interface
  const subject = gameContent?.subject === 'mathematics' ? 'math' :
                  gameContent?.subject === 'english' ? 'english' :
                  gameContent?.subject === 'science' ? 'science' : 'math';

  return (
    <ImmersiveBackground subject={subject} intensity="medium">
      <ParticleSystem
        subject={subject}
        intensity="medium"
        celebration={celebrationTrigger}
      />

      {/* Combo Effect Overlay */}
      {comboEffect && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <motion.div
            className="text-8xl font-bold text-yellow-400"
            style={{
              textShadow: '0 0 30px rgba(255, 215, 0, 0.8)',
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))'
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 360, 0]
            }}
            transition={{ duration: 1 }}
          >
            🔥 COMBO! 🔥
          </motion.div>
        </motion.div>
      )}

      <GameCharacter
        subject={subject}
        emotion={characterEmotion}
        size="large"
        position="bottom-right"
        message={characterMessage}
        onInteraction={() => {
          audioService.playSound('pop');
          const encouragements = [
            "You're doing amazing!",
            "Keep up the great work!",
            "I believe in you!",
            "Learning is an adventure!",
            "You're getting stronger with every question!"
          ];
          setCharacterMessage(encouragements[Math.floor(Math.random() * encouragements.length)]);
        }}
      />

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-bold text-white">
                {gameContent?.title || 'Learning Game'}
              </h1>
              {gameState.combo > 0 && (
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 10px rgba(255, 215, 0, 0.5)',
                      '0 0 20px rgba(255, 215, 0, 0.8)',
                      '0 0 10px rgba(255, 215, 0, 0.5)'
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="text-white font-bold">🔥 COMBO x{gameState.combo}</span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">{gameState.score}</div>
                <div className="text-sm opacity-75">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm opacity-75">Time</div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Progress Bar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <ProgressBar
                current={gameState.currentQuestionIndex + 1}
                total={questions.length}
                className="h-4"
              />
              <p className="text-white text-center mt-3 text-lg font-medium">
                Question {gameState.currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </motion.div>

          {/* Game Controls */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <EnhancedButton
              onClick={handleExit}
              variant="secondary"
              effect="bounce"
              size="lg"
            >
              ← Exit Game
            </EnhancedButton>

            <EnhancedButton
              onClick={handlePauseToggle}
              variant="warning"
              effect="pulse"
              size="lg"
            >
              {gameState.isPaused ? '▶ Resume' : '⏸ Pause'}
            </EnhancedButton>
          </motion.div>

          {/* Question Timer */}
          {timeRemaining !== null && (
            <motion.div
              className="mb-6 text-center"
              animate={{
                scale: timeRemaining <= 10 ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: timeRemaining <= 10 ? Infinity : 0 }}
            >
              <div className={`text-4xl font-bold ${
                timeRemaining <= 10 ? 'text-red-300' :
                timeRemaining <= 30 ? 'text-yellow-300' : 'text-white'
              }`}>
                ⏰ {timeRemaining}s
              </div>
            </motion.div>
          )}

          {/* Enhanced Question Card */}
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl"
              initial={{ x: 300, opacity: 0, rotateY: 90 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              {/* Question Media */}
              {currentQuestion.media && (
                <motion.div
                  className="mb-8 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentQuestion.media.type === 'image' && (
                    <div className="inline-block bg-white/20 rounded-2xl p-6 border border-white/30">
                      <div className="text-6xl mb-2">📷</div>
                      <p className="text-white/80">{currentQuestion.media.alt}</p>
                    </div>
                  )}
                  {currentQuestion.media.type === 'audio' && (
                    <div className="inline-block bg-blue-500/20 rounded-2xl p-6 border border-blue-400/30">
                      <div className="text-6xl mb-2">🔊</div>
                      <p className="text-white/80">Audio content</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Enhanced Question Text */}
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-center mb-8 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                {currentQuestion.question}
              </motion.h2>

              {/* Enhanced Answer Options */}
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentQuestion.options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <EnhancedButton
                        onClick={() => {
                          setSelectedAnswer(option);
                          audioService.playSound('select');
                        }}
                        variant={selectedAnswer === option ? 'success' : 'secondary'}
                        effect={selectedAnswer === option ? 'glow' : 'bounce'}
                        size="xl"
                        ageGroup={profile?.ageGroup}
                        className="w-full p-6 text-xl min-h-[80px] whitespace-normal"
                      >
                        {option}
                      </EnhancedButton>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Enhanced Typing Input */}
              {currentQuestion.type === 'typing' && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="w-full p-6 text-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30
                             rounded-2xl text-white placeholder-white/60 focus:border-white/60
                             focus:outline-none focus:ring-4 focus:ring-white/20 text-center
                             transition-all duration-300"
                    placeholder="Type your answer here..."
                    autoFocus
                  />
                </motion.div>
              )}

              {/* Enhanced Hint Display */}
              <AnimatePresence>
                {showHint && currentQuestion.hint && (
                  <motion.div
                    className="bg-yellow-400/20 border border-yellow-400/40 rounded-2xl p-6 mb-8 backdrop-blur-sm"
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: 'spring' }}
                  >
                    <div className="flex items-start space-x-4">
                      <motion.span
                        className="text-3xl"
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      >
                        💡
                      </motion.span>
                      <p className="text-yellow-100 text-lg font-medium">{currentQuestion.hint}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Action Buttons */}
              <div className="flex justify-between items-center">
                <EnhancedButton
                  onClick={handleHint}
                  variant="warning"
                  effect="shimmer"
                  disabled={showHint}
                  size="lg"
                >
                  💡 Get Hint
                </EnhancedButton>

                <EnhancedButton
                  onClick={handleAnswerSubmit}
                  variant="magic"
                  effect="sparkle"
                  disabled={!selectedAnswer || gameState.isPaused}
                  size="xl"
                  className="px-12 py-4 text-xl"
                >
                  Submit Answer ✨
                </EnhancedButton>
              </div>
            </motion.div>
          )}

          {/* Enhanced Game Stats */}
          <motion.div
            className="grid grid-cols-4 gap-4 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <motion.div
                className="text-3xl font-bold text-white mb-1"
                animate={{ scale: gameState.streak > 0 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5, repeat: gameState.streak > 0 ? Infinity : 0 }}
              >
                {gameState.streak}
              </motion.div>
              <div className="text-white/75 text-sm">Streak</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-white mb-1">{gameState.hintsUsed}</div>
              <div className="text-white/75 text-sm">Hints Used</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <motion.div
                className="text-3xl font-bold text-green-400 mb-1"
                animate={{
                  color: ['#34D399', '#10B981', '#34D399']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {gameState.answers.filter(a => a.isCorrect).length}
              </motion.div>
              <div className="text-white/75 text-sm">Correct</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <motion.div
                className="text-3xl font-bold text-yellow-400 mb-1"
                animate={gameState.combo > 0 ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 0.8, repeat: gameState.combo > 0 ? Infinity : 0 }}
              >
                {gameState.combo}
              </motion.div>
              <div className="text-white/75 text-sm">Combo</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        type={feedbackType}
        message={feedbackMessage}
      />

      {/* Pause Overlay */}
      {gameState.isPaused && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-12 text-center border border-white/20"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="text-8xl mb-6">⏸️</div>
            <h3 className="text-3xl font-bold text-white mb-4">Game Paused</h3>
            <p className="text-white/80 mb-8">Take your time! Resume when you're ready.</p>
            <EnhancedButton
              onClick={handlePauseToggle}
              variant="primary"
              effect="glow"
              size="xl"
            >
              ▶ Resume Game
            </EnhancedButton>
          </motion.div>
        </motion.div>
      )}

      {/* Toast Notification System - AAA+ Standard */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        ageGroup={profile?.ageGroup || '6-8'}
        position="top-center"
      />
    </ImmersiveBackground>
  );
};

export default EnhancedGamePlayPage;