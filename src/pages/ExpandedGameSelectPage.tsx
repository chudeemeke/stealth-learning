import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import { subjectConfig, difficultyLevels, QuestionBank } from '@/data/expandedQuestions';
import {
  selectGameForStudent,
  updateGameProgress,
  setCurrentSubject,
  setDifficultyLevel
} from '@/store/slices/gameSlice';

interface SubjectCard {
  id: string;
  subject: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  questionCount: number;
  userProgress: number;
  userLevel: number;
  unlocked: boolean;
  stars: number;
}

const ExpandedGameSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();

  const { profile } = useAppSelector(state => state.student);
  const { soundEnabled } = useAppSelector(state => state.settings.app);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const ageGroup = profile?.age ? (profile.age <= 5 ? '3-5' : profile.age <= 8 ? '6-8' : '9+') : '6-8';

  // Create subject cards from expanded content
  const subjects: SubjectCard[] = Object.entries(subjectConfig).map(([key, config]) => ({
    id: key,
    subject: key,
    name: config.name,
    icon: config.icon,
    color: config.color,
    description: config.description,
    questionCount: QuestionBank.getQuestionsBySubject(key).length,
    userProgress: Math.floor(Math.random() * 100), // TODO: Get from user state
    userLevel: Math.floor(Math.random() * 10) + 1, // TODO: Get from user state
    unlocked: true, // TODO: Implement unlock logic
    stars: Math.floor(Math.random() * 3) // TODO: Get from achievements
  }));


  const handleSelectSubject = (subject: string) => {
    if (soundEnabled) {
      playSound('select');
    }
    triggerHaptic('light');

    dispatch(setCurrentSubject(subject));
    dispatch(setDifficultyLevel(selectedDifficulty));
    navigate(`/games/${subject}`);
  };

  const getDifficultyColor = (level: number) => {
    return difficultyLevels[level as keyof typeof difficultyLevels]?.color || 'from-gray-400 to-gray-500';
  };

  const getDifficultyName = (level: number) => {
    return difficultyLevels[level as keyof typeof difficultyLevels]?.name || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Choose Your Adventure
          </h1>
          <p className="text-gray-600 text-lg">
            Pick a subject and start learning through play
          </p>
        </motion.div>

        {/* Difficulty Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Select Your Challenge Level
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(difficultyLevels).map(([level, config]) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(parseInt(level))}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedDifficulty === parseInt(level)
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="font-medium">{config.name}</span>
                <span className="ml-2 text-sm opacity-75">({level})</span>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{getDifficultyName(selectedDifficulty)}:</span>{' '}
              {difficultyLevels[selectedDifficulty as keyof typeof difficultyLevels]?.description}
            </p>
          </div>
        </motion.div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(subject.id)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`relative h-full cursor-pointer overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 transition-all duration-300 ${
                    !subject.unlocked ? 'opacity-60' : ''
                  }`}
                  onClick={() => {
                    if (subject.unlocked) {
                      handleSelectSubject(subject.subject);
                    }
                  }}
                >
                  {/* Background Pattern */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-10`}
                  />

                  {/* Content */}
                  <div className="relative p-6">
                    {/* Icon and Title */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{
                            rotate: hoveredCard === subject.id ? [0, -10, 10, 0] : 0
                          }}
                          transition={{ duration: 0.5 }}
                          className="text-4xl"
                        >
                          {subject.icon}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {subject.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {subject.questionCount} questions
                          </p>
                        </div>
                      </div>
                      {!subject.unlocked && (
                        <span className="text-2xl">🔒</span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">
                      {subject.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{subject.userProgress}%</span>
                      </div>
                      <ProgressBar
                        value={subject.userProgress}
                        max={100}
                        className="h-2"
                        color="primary"
                      />
                    </div>

                    {/* User Level & Stars */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Level</span>
                        <span
                          className={`px-2 py-1 rounded-lg bg-gradient-to-r ${
                            getDifficultyColor(subject.userLevel)
                          } text-white text-xs font-bold`}
                        >
                          {subject.userLevel}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3].map((star) => (
                          <span
                            key={star}
                            className={`text-xl ${
                              star <= subject.stars ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hover Effect - Play Button */}
                    <AnimatePresence>
                      {hoveredCard === subject.id && subject.unlocked && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent"
                        >
                          <Button
                            variant="primary"
                            size="medium"
                            fullWidth
                            className={`bg-gradient-to-r ${subject.color} text-white shadow-lg hover:shadow-xl transition-shadow`}
                          >
                            Start Playing!
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Daily Challenge Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card variant="glassmorphism" className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  🏆 Daily Challenge
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete today's special challenge across all subjects!
                </p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center space-x-1 px-3 py-1 bg-white/50 rounded-lg"
                    >
                      <span>{subject.icon}</span>
                      <span className="text-sm font-medium">0/3</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="primary"
                size="large"
                className="bg-gradient-to-r from-yellow-400 to-orange-500"
                onClick={() => navigate('/daily-challenge')}
              >
                Start Challenge
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Profile
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpandedGameSelectPage;