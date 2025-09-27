import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import {
  selectGameForStudent,
  updateGameProgress
} from '@/store/slices/gameSlice';

interface GameCard {
  id: string;
  title: string;
  subject: 'math' | 'english' | 'science' | 'geography' | 'arts' | 'logic';
  description: string;
  difficulty: number; // 1-10 scale
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

const GameSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();

  const { profile, skillLevels } = useAppSelector(state => state.student);
  const { availableGames, unlockedGames } = useAppSelector(state => state.game);
  const { soundEnabled } = useAppSelector(state => state.settings.app);
  const adaptiveData = useAppSelector(state => state.adaptive);

  const [selectedSubject, setSelectedSubject] = useState<'all' | 'math' | 'english' | 'science' | 'geography' | 'arts' | 'logic'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all'); // Traditional difficulty levels
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const games: GameCard[] = useMemo(() => [
    {
      id: 'math-addition-1',
      title: 'Addition Adventure',
      subject: 'math',
      description: 'Learn addition through fun puzzles',
      difficulty: 1,
      estimatedTime: 10,
      icon: '➕',
      color: 'bg-blue-500',
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
      description: 'Master subtraction with animals',
      difficulty: 2,
      estimatedTime: 12,
      icon: '➖',
      color: 'bg-green-500',
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
      description: 'Discover the magic of multiplication',
      difficulty: 3,
      estimatedTime: 15,
      icon: '✖️',
      color: 'bg-purple-500',
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
      description: 'Solve division mysteries',
      difficulty: 4,
      estimatedTime: 15,
      icon: '➗',
      color: 'bg-red-500',
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
      description: 'Learn letters and sounds',
      difficulty: 1,
      estimatedTime: 8,
      icon: '🔤',
      color: 'bg-yellow-500',
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
      description: 'Build words from letters',
      difficulty: 2,
      estimatedTime: 12,
      icon: '📝',
      color: 'bg-indigo-500',
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
      description: 'Start your reading journey',
      difficulty: 3,
      estimatedTime: 20,
      icon: '📚',
      color: 'bg-pink-500',
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
      description: 'Explore the world of animals',
      difficulty: 1,
      estimatedTime: 10,
      icon: '🦁',
      color: 'bg-orange-500',
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
      description: 'Discover how plants grow',
      difficulty: 2,
      estimatedTime: 12,
      icon: '🌱',
      color: 'bg-green-600',
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
      description: 'Journey through the solar system',
      difficulty: 3,
      estimatedTime: 18,
      icon: '🚀',
      color: 'bg-gray-800',
      unlocked: skillLevels?.science >= 2,
      progress: 10,
      stars: 0,
      recommendedAge: [6, 9],
      skills: ['astronomy', 'exploration'],
      prerequisites: []
    },
    // Geography Games
    {
      id: 'geography-countries-1',
      title: 'World Explorer',
      subject: 'geography',
      description: 'Discover countries and capitals',
      difficulty: 1,
      estimatedTime: 10,
      icon: '🗺️',
      color: 'bg-amber-500',
      unlocked: true,
      progress: 0,
      stars: 0,
      recommendedAge: [5, 9],
      skills: ['geography', 'culture', 'maps'],
      prerequisites: []
    },
    {
      id: 'geography-continents-1',
      title: 'Continent Quest',
      subject: 'geography',
      description: 'Learn about the 7 continents',
      difficulty: 2,
      estimatedTime: 12,
      icon: '🌍',
      color: 'bg-teal-500',
      unlocked: true,
      progress: 0,
      stars: 0,
      recommendedAge: [6, 9],
      skills: ['continents', 'oceans', 'landforms'],
      prerequisites: []
    },
    {
      id: 'geography-landmarks-1',
      title: 'Famous Landmarks',
      subject: 'geography',
      description: 'Visit world famous places',
      difficulty: 3,
      estimatedTime: 15,
      icon: '🗼',
      color: 'bg-cyan-600',
      unlocked: (skillLevels?.geography ?? 0) >= 1,
      progress: 0,
      stars: 0,
      recommendedAge: [7, 9],
      skills: ['landmarks', 'culture', 'history'],
      prerequisites: ['geography-countries-1']
    },
    // Logic Games
    {
      id: 'logic-patterns-1',
      title: 'Pattern Puzzles',
      subject: 'logic',
      description: 'Find and complete patterns',
      difficulty: 1,
      estimatedTime: 8,
      icon: '🧩',
      color: 'bg-violet-500',
      unlocked: true,
      progress: 0,
      stars: 0,
      recommendedAge: [4, 8],
      skills: ['patterns', 'sequences', 'reasoning'],
      prerequisites: []
    },
    {
      id: 'logic-coding-1',
      title: 'Code Crackers',
      subject: 'logic',
      description: 'Learn basic coding concepts',
      difficulty: 2,
      estimatedTime: 15,
      icon: '💻',
      color: 'bg-slate-600',
      unlocked: true,
      progress: 0,
      stars: 0,
      recommendedAge: [6, 9],
      skills: ['coding', 'algorithms', 'problem-solving'],
      prerequisites: []
    },
    {
      id: 'logic-puzzles-1',
      title: 'Brain Teasers',
      subject: 'logic',
      description: 'Solve challenging puzzles',
      difficulty: 3,
      estimatedTime: 20,
      icon: '🎯',
      color: 'bg-rose-600',
      unlocked: (skillLevels?.logic ?? 0) >= 1,
      progress: 0,
      stars: 0,
      recommendedAge: [7, 9],
      skills: ['critical-thinking', 'strategy', 'deduction'],
      prerequisites: ['logic-patterns-1']
    },
    // Arts Games
    {
      id: 'arts-colors-1',
      title: 'Color Magic',
      subject: 'arts',
      description: 'Mix and match colors',
      difficulty: 1,
      estimatedTime: 8,
      icon: '🎨',
      color: 'bg-pink-500',
      unlocked: true,
      progress: 0,
      stars: 0,
      recommendedAge: [3, 7],
      skills: ['colors', 'creativity', 'mixing'],
      prerequisites: []
    },
    {
      id: 'arts-music-1',
      title: 'Music Maker',
      subject: 'arts',
      description: 'Create your own melodies',
      difficulty: 2,
      estimatedTime: 12,
      icon: '🎵',
      color: 'bg-fuchsia-500',
      unlocked: true,
      progress: 0,
      stars: 0,
      recommendedAge: [5, 9],
      skills: ['music', 'rhythm', 'composition'],
      prerequisites: []
    },
    {
      id: 'arts-drawing-1',
      title: 'Drawing Studio',
      subject: 'arts',
      description: 'Learn to draw shapes and animals',
      difficulty: 3,
      estimatedTime: 18,
      icon: '✏️',
      color: 'bg-red-500',
      unlocked: (skillLevels?.arts ?? 0) >= 1,
      progress: 0,
      stars: 0,
      recommendedAge: [6, 9],
      skills: ['drawing', 'shapes', 'creativity'],
      prerequisites: ['arts-colors-1']
    }
  ], [skillLevels]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      if (selectedSubject !== 'all' && game.subject !== selectedSubject) return false;

      if (selectedDifficulty !== 'all') {
        const difficultyMap: Record<'easy' | 'medium' | 'hard', number[]> = {
          easy: [1, 2, 3],
          medium: [4, 5, 6],
          hard: [7, 8, 9, 10]
        };
        if (!difficultyMap[selectedDifficulty as 'easy' | 'medium' | 'hard'].includes(game.difficulty)) return false;
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
        const aScore = (adaptiveData.recommendedDifficulty as any)[a.subject] || 0;
        const bScore = (adaptiveData.recommendedDifficulty as any)[b.subject] || 0;
        return Math.abs(a.difficulty - aScore) - Math.abs(b.difficulty - bScore);
      })
      .slice(0, 3);
  }, [games, profile, adaptiveData]);

  const handleGameSelect = async (gameId: string) => {
    if (soundEnabled) {
      playSound('click');
    }
    triggerHaptic('light');

    setIsLoading(true);

    try {
      dispatch(selectGameForStudent({ gameId }));

      setTimeout(() => {
        navigate(`/games/${gameId}`);
      }, 300);
    } catch (error) {
      console.error('Error selecting game:', error);
      setIsLoading(false);
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty === 3) return 'Medium';
    return 'Hard';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-500';
    if (difficulty === 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Adventure
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Select a game to start learning and having fun!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedSubject('all')}
              variant={selectedSubject === 'all' ? 'primary' : 'outline'}
              className="transition-all"
            >
              All Subjects
            </Button>
            <Button
              onClick={() => setSelectedSubject('math')}
              variant={selectedSubject === 'math' ? 'primary' : 'outline'}
              className="transition-all"
            >
              🧮 Math
            </Button>
            <Button
              onClick={() => setSelectedSubject('english')}
              variant={selectedSubject === 'english' ? 'primary' : 'outline'}
              className="transition-all"
            >
              📖 English
            </Button>
            <Button
              onClick={() => setSelectedSubject('science')}
              variant={selectedSubject === 'science' ? 'primary' : 'outline'}
              className="transition-all"
            >
              🔬 Science
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedDifficulty('all')}
              variant={selectedDifficulty === 'all' ? 'primary' : 'outline'}
              size="sm"
            >
              All Levels
            </Button>
            <Button
              onClick={() => setSelectedDifficulty('easy')}
              variant={selectedDifficulty === 'easy' ? 'primary' : 'outline'}
              size="sm"
            >
              Easy
            </Button>
            <Button
              onClick={() => setSelectedDifficulty('medium')}
              variant={selectedDifficulty === 'medium' ? 'primary' : 'outline'}
              size="sm"
            >
              Medium
            </Button>
            <Button
              onClick={() => setSelectedDifficulty('hard')}
              variant={selectedDifficulty === 'hard' ? 'primary' : 'outline'}
              size="sm"
            >
              Hard
            </Button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {recommendedGames.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedGames.map((game) => (
                <motion.div
                  key={`recommended-${game.id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`${game.color} text-white p-4 cursor-pointer relative overflow-hidden`}
                    onClick={() => handleGameSelect(game.id)}
                  >
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      RECOMMENDED
                    </div>
                    <div className="text-3xl mb-2">{game.icon}</div>
                    <h3 className="text-lg font-bold mb-1">{game.title}</h3>
                    <p className="text-sm opacity-90">{game.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                layout
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`${!game.unlocked ? 'opacity-60' : ''}`}
              >
                <Card
                  className={`h-full cursor-pointer transition-all ${
                    game.unlocked ? 'hover:shadow-xl' : 'cursor-not-allowed'
                  }`}
                  onClick={() => game.unlocked && handleGameSelect(game.id)}
                >
                  <div className={`${game.color} h-32 rounded-t-lg flex items-center justify-center relative`}>
                    {!game.unlocked && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    )}
                    <span className="text-6xl">{game.icon}</span>
                    {game.stars > 0 && (
                      <div className="absolute top-2 right-2">
                        {[...Array(3)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-yellow-400 ${i < game.stars ? '' : 'opacity-30'}`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {game.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {game.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Difficulty</span>
                        <span className={`font-semibold ${getDifficultyColor(game.difficulty)}`}>
                          {getDifficultyLabel(game.difficulty)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Time</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {game.estimatedTime} min
                        </span>
                      </div>

                      {game.progress > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500 dark:text-gray-400">Progress</span>
                            <span className="text-gray-700 dark:text-gray-300">{game.progress}%</span>
                          </div>
                          <ProgressBar progress={game.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mt-2">
                        {game.skills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {game.skills.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                            +{game.skills.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {!game.unlocked && game.prerequisites.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Complete prerequisites to unlock
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredGames.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No games found matching your criteria
            </p>
            <Button
              onClick={() => {
                setSelectedSubject('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">Loading game...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSelectPage;