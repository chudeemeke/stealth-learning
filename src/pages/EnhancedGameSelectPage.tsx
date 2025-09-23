import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useHaptic } from '@/hooks/useHaptic';

// Enhanced components
import { ImmersiveBackground } from '@/components/enhanced/ImmersiveBackground';
import { ParticleSystem } from '@/components/enhanced/ParticleSystem';
import { GameCharacter } from '@/components/enhanced/GameCharacter';
import { EnhancedButton } from '@/components/enhanced/EnhancedButton';
import { audioService } from '@/services/audio/AudioService';

import {
  selectGameForStudent,
  updateGameProgress
} from '@/store/slices/gameSlice';

interface GameCard {
  id: string;
  title: string;
  subject: 'math' | 'english' | 'science';
  description: string;
  difficulty: number;
  estimatedTime: number;
  icon: string;
  color: string;
  unlocked: boolean;
  progress: number;
  stars: number;
  recommendedAge: [number, number];
  skills: string[];
  prerequisites: string[];
}

const EnhancedGameSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { triggerHaptic } = useHaptic();

  const { profile, skillLevels } = useAppSelector(state => state.student);
  const { availableGames, unlockedGames } = useAppSelector(state => state.game);
  const { soundEnabled } = useAppSelector(state => state.settings.app);
  const adaptiveData = useAppSelector(state => state.adaptive);

  const [selectedSubject, setSelectedSubject] = useState<'all' | 'math' | 'english' | 'science'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [characterMessage, setCharacterMessage] = useState<string>('');
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);

  // Initialize background music
  useEffect(() => {
    audioService.playMusic('menuMusic', 2000);
    return () => audioService.stopMusic(1000);
  }, []);

  const games: GameCard[] = useMemo(() => [
    {
      id: 'math-addition-1',
      title: 'Addition Adventure',
      subject: 'math',
      description: 'Learn addition through fun puzzles and magical number worlds',
      difficulty: 1,
      estimatedTime: 10,
      icon: '➕',
      color: 'from-blue-500 to-blue-600',
      unlocked: true,
      progress: 75,
      stars: 2,
      recommendedAge: [3, 6],
      skills: ['addition', 'counting', 'number recognition'],
      prerequisites: []
    },
    {
      id: 'math-subtraction-1',
      title: 'Subtraction Safari',
      subject: 'math',
      description: 'Master subtraction with friendly animals in the jungle',
      difficulty: 2,
      estimatedTime: 12,
      icon: '➖',
      color: 'from-green-500 to-green-600',
      unlocked: true,
      progress: 45,
      stars: 1,
      recommendedAge: [4, 7],
      skills: ['subtraction', 'problem-solving'],
      prerequisites: ['math-addition-1']
    },
    {
      id: 'math-multiplication-1',
      title: 'Multiplication Magic',
      subject: 'math',
      description: 'Discover the magic of multiplication with enchanted spells',
      difficulty: 3,
      estimatedTime: 15,
      icon: '✖️',
      color: 'from-purple-500 to-purple-600',
      unlocked: skillLevels?.math >= 3,
      progress: 20,
      stars: 0,
      recommendedAge: [6, 9],
      skills: ['multiplication', 'times tables'],
      prerequisites: ['math-addition-1', 'math-subtraction-1']
    },
    {
      id: 'math-division-1',
      title: 'Division Detective',
      subject: 'math',
      description: 'Solve division mysteries and unlock hidden treasures',
      difficulty: 4,
      estimatedTime: 15,
      icon: '➗',
      color: 'from-red-500 to-red-600',
      unlocked: skillLevels?.math >= 4,
      progress: 0,
      stars: 0,
      recommendedAge: [7, 9],
      skills: ['division', 'problem-solving'],
      prerequisites: ['math-multiplication-1']
    },
    {
      id: 'english-letters-1',
      title: 'Letter Land',
      subject: 'english',
      description: 'Explore the magical kingdom where letters come to life',
      difficulty: 1,
      estimatedTime: 8,
      icon: '🔤',
      color: 'from-yellow-500 to-orange-500',
      unlocked: true,
      progress: 90,
      stars: 3,
      recommendedAge: [3, 5],
      skills: ['letter recognition', 'phonics'],
      prerequisites: []
    },
    {
      id: 'english-words-1',
      title: 'Word Builder',
      subject: 'english',
      description: 'Build amazing words and unlock new vocabulary treasures',
      difficulty: 2,
      estimatedTime: 12,
      icon: '📝',
      color: 'from-indigo-500 to-indigo-600',
      unlocked: true,
      progress: 60,
      stars: 2,
      recommendedAge: [4, 7],
      skills: ['spelling', 'vocabulary'],
      prerequisites: ['english-letters-1']
    },
    {
      id: 'english-reading-1',
      title: 'Reading Rainbow',
      subject: 'english',
      description: 'Journey through colorful stories and reading adventures',
      difficulty: 3,
      estimatedTime: 20,
      icon: '📚',
      color: 'from-pink-500 to-pink-600',
      unlocked: skillLevels?.english >= 3,
      progress: 30,
      stars: 1,
      recommendedAge: [5, 8],
      skills: ['reading comprehension', 'vocabulary'],
      prerequisites: ['english-words-1']
    },
    {
      id: 'science-animals-1',
      title: 'Animal Kingdom',
      subject: 'science',
      description: 'Discover amazing animals and their incredible abilities',
      difficulty: 1,
      estimatedTime: 10,
      icon: '🦁',
      color: 'from-orange-500 to-red-500',
      unlocked: true,
      progress: 80,
      stars: 2,
      recommendedAge: [3, 7],
      skills: ['classification', 'observation'],
      prerequisites: []
    },
    {
      id: 'science-plants-1',
      title: 'Plant Explorer',
      subject: 'science',
      description: 'Explore the secret life of plants and how they grow',
      difficulty: 2,
      estimatedTime: 12,
      icon: '🌱',
      color: 'from-green-500 to-teal-500',
      unlocked: true,
      progress: 40,
      stars: 1,
      recommendedAge: [4, 8],
      skills: ['life cycles', 'observation'],
      prerequisites: []
    },
    {
      id: 'science-space-1',
      title: 'Space Adventure',
      subject: 'science',
      description: 'Blast off on an incredible journey through the cosmos',
      difficulty: 3,
      estimatedTime: 18,
      icon: '🚀',
      color: 'from-gray-700 to-gray-900',
      unlocked: skillLevels?.science >= 2,
      progress: 10,
      stars: 0,
      recommendedAge: [6, 9],
      skills: ['astronomy', 'exploration'],
      prerequisites: []
    }
  ], [skillLevels]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      if (selectedSubject !== 'all' && game.subject !== selectedSubject) return false;

      if (selectedDifficulty !== 'all') {
        const difficultyMap = { easy: [1, 2], medium: [3], hard: [4, 5] };
        if (!difficultyMap[selectedDifficulty].includes(game.difficulty)) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          game.title.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          game.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [games, selectedSubject, selectedDifficulty, searchQuery]);

  const recommendedGames = useMemo(() => {
    if (!profile || !adaptiveData) return [];

    return games
      .filter(game => {
        const [minAge, maxAge] = game.recommendedAge;
        const age = profile.age || 6;
        return age >= minAge && age <= maxAge && game.unlocked;
      })
      .sort((a, b) => {
        const aScore = adaptiveData.recommendedDifficulty[a.subject] || 0;
        const bScore = adaptiveData.recommendedDifficulty[b.subject] || 0;
        return Math.abs(a.difficulty - aScore) - Math.abs(b.difficulty - bScore);
      })
      .slice(0, 3);
  }, [games, profile, adaptiveData]);

  const handleGameSelect = async (gameId: string) => {
    audioService.playSound('select');
    triggerHaptic('light');

    setIsLoading(true);

    try {
      dispatch(selectGameForStudent({ gameId }));

      // Trigger celebration effect
      setCelebrationTrigger(true);
      setTimeout(() => setCelebrationTrigger(false), 1000);

      setTimeout(() => {
        navigate(`/games/${gameId}`);
      }, 800);
    } catch (error) {
      console.error('Error selecting game:', error);
      setIsLoading(false);
    }
  };

  const handleSubjectFilter = (subject: 'all' | 'math' | 'english' | 'science') => {
    setSelectedSubject(subject);
    audioService.playSound('click');

    // Update character message based on subject
    const messages = {
      all: "Exploring all subjects! What adventure will you choose?",
      math: "Mathematical wonders await! Let's solve some puzzles!",
      english: "Words and stories are calling! Ready to read and write?",
      science: "Scientific discoveries ahead! Let's explore the universe!"
    };
    setCharacterMessage(messages[subject]);
  };

  const handleGameHover = (gameId: string | null) => {
    setHoveredGame(gameId);
    if (gameId) {
      audioService.playSound('hover');
      const game = games.find(g => g.id === gameId);
      if (game) {
        setCharacterMessage(`${game.title}: ${game.description}`);
      }
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty === 3) return 'Medium';
    return 'Hard';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-400';
    if (difficulty === 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <ImmersiveBackground subject={selectedSubject === 'all' ? 'general' : selectedSubject} intensity="medium">
      {/* Particle Effects */}
      <ParticleSystem
        subject={selectedSubject === 'all' ? 'general' : selectedSubject}
        intensity="medium"
        celebration={celebrationTrigger}
      />

      {/* Game Character Guide */}
      <GameCharacter
        subject={selectedSubject === 'all' ? 'math' : selectedSubject}
        emotion={celebrationTrigger ? 'celebrating' : hoveredGame ? 'excited' : 'happy'}
        size="large"
        position="bottom-right"
        message={characterMessage}
        onInteraction={() => {
          audioService.playSound('achievement');
          setCharacterMessage("Hi there! I'm here to help you choose the perfect game!");
        }}
      />

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold text-white mb-6"
              style={{
                background: 'linear-gradient(45deg, #fff, #ffd700, #fff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
              }}
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.5)',
                  '0 0 40px rgba(255, 215, 0, 0.8)',
                  '0 0 20px rgba(255, 255, 255, 0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Choose Your Adventure
            </motion.h1>
            <motion.p
              className="text-2xl text-white/90 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Epic learning adventures await! Select your quest and become a master learner!
            </motion.p>
          </motion.div>

          {/* Enhanced Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              {/* Subject Filters */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <EnhancedButton
                  onClick={() => handleSubjectFilter('all')}
                  variant={selectedSubject === 'all' ? 'magic' : 'secondary'}
                  effect="glow"
                  ageGroup={profile?.ageGroup}
                  className="transition-all duration-300"
                >
                  🌟 All Subjects
                </EnhancedButton>
                <EnhancedButton
                  onClick={() => handleSubjectFilter('math')}
                  variant={selectedSubject === 'math' ? 'primary' : 'secondary'}
                  effect="sparkle"
                  ageGroup={profile?.ageGroup}
                >
                  🧮 Math Magic
                </EnhancedButton>
                <EnhancedButton
                  onClick={() => handleSubjectFilter('english')}
                  variant={selectedSubject === 'english' ? 'warning' : 'secondary'}
                  effect="shimmer"
                  ageGroup={profile?.ageGroup}
                >
                  📖 Word Wonders
                </EnhancedButton>
                <EnhancedButton
                  onClick={() => handleSubjectFilter('science')}
                  variant={selectedSubject === 'science' ? 'success' : 'secondary'}
                  effect="pulse"
                  ageGroup={profile?.ageGroup}
                >
                  🔬 Science Secrets
                </EnhancedButton>
              </div>

              {/* Difficulty Filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                  <EnhancedButton
                    key={difficulty}
                    onClick={() => {
                      setSelectedDifficulty(difficulty as any);
                      audioService.playSound('click');
                    }}
                    variant={selectedDifficulty === difficulty ? 'primary' : 'secondary'}
                    size="sm"
                    effect="bounce"
                  >
                    {difficulty === 'all' ? '🎯 All Levels' :
                     difficulty === 'easy' ? '🟢 Easy' :
                     difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                  </EnhancedButton>
                ))}
              </div>

              {/* Enhanced Search */}
              <div className="relative max-w-md mx-auto">
                <motion.input
                  type="text"
                  placeholder="Search for adventure..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-white/20 backdrop-blur-sm border-2 border-white/30
                           rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-white/60
                           transition-all duration-300 text-lg"
                  whileFocus={{ scale: 1.05 }}
                />
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  animate={{ rotate: searchQuery ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Recommended Games Section */}
          {recommendedGames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-8 text-center">
                ⭐ Perfect for You ⭐
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedGames.map((game, index) => (
                  <motion.div
                    key={`recommended-${game.id}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    onHoverStart={() => handleGameHover(game.id)}
                    onHoverEnd={() => handleGameHover(null)}
                  >
                    <Card
                      className={`bg-gradient-to-br ${game.color} text-white p-6 cursor-pointer relative overflow-hidden
                                border-4 border-yellow-400 shadow-2xl`}
                      onClick={() => handleGameSelect(game.id)}
                    >
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                        RECOMMENDED
                      </div>
                      <div className="text-6xl mb-4 text-center">{game.icon}</div>
                      <h3 className="text-2xl font-bold mb-2 text-center">{game.title}</h3>
                      <p className="text-sm opacity-90 text-center">{game.description}</p>

                      {/* Sparkle effects for recommended games */}
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-yellow-300 text-xl"
                          style={{
                            top: `${20 + i * 20}%`,
                            left: `${10 + i * 25}%`
                          }}
                          animate={{
                            scale: [1, 1.5, 1],
                            rotate: [0, 180, 360],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                        >
                          ✨
                        </motion.div>
                      ))}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Games Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{
                    scale: 1.08,
                    rotateY: 10,
                    z: 50
                  }}
                  className={`${!game.unlocked ? 'opacity-60' : ''} perspective-1000`}
                  onHoverStart={() => handleGameHover(game.id)}
                  onHoverEnd={() => handleGameHover(null)}
                >
                  <Card
                    className={`h-full cursor-pointer transition-all duration-500 transform-gpu
                              ${game.unlocked ? 'hover:shadow-2xl' : 'cursor-not-allowed'}
                              bg-white/10 backdrop-blur-md border border-white/20
                              hover:bg-white/20 hover:border-white/40`}
                    onClick={() => game.unlocked && handleGameSelect(game.id)}
                  >
                    {/* Game Icon Area */}
                    <div className={`bg-gradient-to-br ${game.color} h-40 rounded-t-lg flex items-center
                                   justify-center relative overflow-hidden`}>
                      {!game.unlocked && (
                        <motion.div
                          className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center"
                          animate={{
                            background: ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <motion.svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </motion.svg>
                        </motion.div>
                      )}

                      <motion.span
                        className="text-8xl z-10 relative"
                        animate={hoveredGame === game.id ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {game.icon}
                      </motion.span>

                      {/* Star Rating */}
                      {game.stars > 0 && (
                        <div className="absolute top-2 right-2 flex">
                          {[...Array(3)].map((_, i) => (
                            <motion.span
                              key={i}
                              className={`text-2xl ${i < game.stars ? 'text-yellow-400' : 'text-gray-400/50'}`}
                              animate={i < game.stars ? {
                                scale: [1, 1.3, 1],
                                rotate: [0, 360, 0]
                              } : {}}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            >
                              ⭐
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Game Info */}
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold mb-3">
                        {game.title}
                      </h3>
                      <p className="text-sm text-white/80 mb-4 line-clamp-2">
                        {game.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Difficulty</span>
                          <span className={`font-semibold ${getDifficultyColor(game.difficulty)}`}>
                            {getDifficultyLabel(game.difficulty)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Time</span>
                          <span className="text-white/90">
                            {game.estimatedTime} min
                          </span>
                        </div>

                        {game.progress > 0 && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-white/70">Progress</span>
                              <span className="text-white/90">{game.progress}%</span>
                            </div>
                            <ProgressBar progress={game.progress} className="h-2" />
                          </div>
                        )}

                        {/* Skills Tags */}
                        <div className="flex flex-wrap gap-1">
                          {game.skills.slice(0, 2).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {game.skills.length > 2 && (
                            <span className="text-xs text-white/60 px-2 py-1">
                              +{game.skills.length - 2} more
                            </span>
                          )}
                        </div>

                        {/* Prerequisites Info */}
                        {!game.unlocked && game.prerequisites.length > 0 && (
                          <div className="pt-3 border-t border-white/20">
                            <p className="text-xs text-white/60">
                              Complete prerequisites to unlock
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results State */}
          {filteredGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                No adventures found!
              </h3>
              <p className="text-xl text-white/80 mb-8">
                Try adjusting your filters to discover new learning quests
              </p>
              <EnhancedButton
                onClick={() => {
                  setSelectedSubject('all');
                  setSelectedDifficulty('all');
                  setSearchQuery('');
                  audioService.playSound('success');
                }}
                variant="magic"
                effect="sparkle"
                size="lg"
              >
                🌟 Show All Adventures
              </EnhancedButton>
            </motion.div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white/20 backdrop-blur-md rounded-3xl p-12 text-center border border-white/30"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <h3 className="text-2xl font-bold text-white mb-2">Preparing Your Adventure</h3>
            <p className="text-white/80">Loading magical learning experience...</p>
          </motion.div>
        </motion.div>
      )}
    </ImmersiveBackground>
  );
};

export default EnhancedGameSelectPage;