import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useAppSelector } from '@/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ProgressData {
  date: string;
  math: number;
  english: number;
  science: number;
  total: number;
}

interface SkillData {
  skill: string;
  level: number;
  maxLevel: number;
  progress: number;
}

const ProgressPage: React.FC = () => {
  const navigate = useNavigate();

  const { profile, skillLevels } = useAppSelector(state => state.student);
  const { totalStats, recentSessions, weeklyProgress } = useAppSelector(state => state.analytics);
  const adaptiveData = useAppSelector(state => state.adaptive);

  const [selectedView, setSelectedView] = useState<'overview' | 'subjects' | 'skills' | 'timeline'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'math' | 'english' | 'science'>('all');

  // Generate progress data for charts
  const progressData: ProgressData[] = useMemo(() => {
    const data: ProgressData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });

      data.push({
        date: dateStr,
        math: Math.floor(Math.random() * 30) + 70,
        english: Math.floor(Math.random() * 30) + 65,
        science: Math.floor(Math.random() * 30) + 75,
        total: Math.floor(Math.random() * 30) + 70,
      });
    }

    return data;
  }, [selectedTimeRange]);

  // Subject distribution data for pie chart
  const subjectDistribution = useMemo(() => [
    { name: 'Mathematics', value: totalStats?.gamesPlayed ? Math.floor(totalStats.gamesPlayed * 0.4) : 12, color: '#3B82F6' },
    { name: 'English', value: totalStats?.gamesPlayed ? Math.floor(totalStats.gamesPlayed * 0.35) : 10, color: '#10B981' },
    { name: 'Science', value: totalStats?.gamesPlayed ? Math.floor(totalStats.gamesPlayed * 0.25) : 8, color: '#F59E0B' },
  ], [totalStats]);

  // Skill radar chart data
  const skillRadarData = useMemo(() => [
    {
      skill: 'Problem Solving',
      value: skillLevels?.math ? (skillLevels.math / 25) * 100 : 40,
      fullMark: 100,
    },
    {
      skill: 'Critical Thinking',
      value: 65,
      fullMark: 100,
    },
    {
      skill: 'Creativity',
      value: 75,
      fullMark: 100,
    },
    {
      skill: 'Communication',
      value: skillLevels?.english ? (skillLevels.english / 25) * 100 : 50,
      fullMark: 100,
    },
    {
      skill: 'Scientific Method',
      value: skillLevels?.science ? (skillLevels.science / 25) * 100 : 55,
      fullMark: 100,
    },
    {
      skill: 'Digital Literacy',
      value: 70,
      fullMark: 100,
    },
  ], [skillLevels]);

  // Individual skills progress
  const skillsProgress: SkillData[] = [
    { skill: 'Addition', level: 8, maxLevel: 10, progress: 80 },
    { skill: 'Subtraction', level: 7, maxLevel: 10, progress: 70 },
    { skill: 'Multiplication', level: 5, maxLevel: 10, progress: 50 },
    { skill: 'Division', level: 3, maxLevel: 10, progress: 30 },
    { skill: 'Reading', level: 9, maxLevel: 10, progress: 90 },
    { skill: 'Writing', level: 6, maxLevel: 10, progress: 60 },
    { skill: 'Grammar', level: 7, maxLevel: 10, progress: 70 },
    { skill: 'Biology', level: 5, maxLevel: 10, progress: 50 },
    { skill: 'Physics', level: 4, maxLevel: 10, progress: 40 },
    { skill: 'Chemistry', level: 3, maxLevel: 10, progress: 30 },
  ];

  const getMilestoneProgress = () => {
    const totalPoints = totalStats?.totalScore || 0;
    const milestones = [
      { points: 100, title: 'Beginner', reward: '🌱' },
      { points: 500, title: 'Learner', reward: '📚' },
      { points: 1000, title: 'Scholar', reward: '🎓' },
      { points: 2500, title: 'Expert', reward: '⭐' },
      { points: 5000, title: 'Master', reward: '👑' },
      { points: 10000, title: 'Legend', reward: '🏆' },
    ];

    const currentMilestone = milestones.findIndex(m => totalPoints < m.points);
    if (currentMilestone === -1) return milestones[milestones.length - 1];
    if (currentMilestone === 0) return { current: 0, next: milestones[0], progress: (totalPoints / milestones[0].points) * 100 };

    return {
      current: milestones[currentMilestone - 1],
      next: milestones[currentMilestone],
      progress: ((totalPoints - milestones[currentMilestone - 1].points) /
                (milestones[currentMilestone].points - milestones[currentMilestone - 1].points)) * 100
    };
  };

  const milestone = getMilestoneProgress();

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
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Learning Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your journey and celebrate your achievements!
          </p>
        </motion.div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            onClick={() => setSelectedView('overview')}
            variant={selectedView === 'overview' ? 'primary' : 'outline'}
            size="sm"
          >
            Overview
          </Button>
          <Button
            onClick={() => setSelectedView('subjects')}
            variant={selectedView === 'subjects' ? 'primary' : 'outline'}
            size="sm"
          >
            Subjects
          </Button>
          <Button
            onClick={() => setSelectedView('skills')}
            variant={selectedView === 'skills' ? 'primary' : 'outline'}
            size="sm"
          >
            Skills
          </Button>
          <Button
            onClick={() => setSelectedView('timeline')}
            variant={selectedView === 'timeline' ? 'primary' : 'outline'}
            size="sm"
          >
            Timeline
          </Button>
        </div>

        {selectedView === 'overview' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div variants={itemVariants}>
                <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <div className="text-3xl mb-2">🎮</div>
                  <p className="text-2xl font-bold">{totalStats?.gamesPlayed || 0}</p>
                  <p className="text-sm opacity-90">Games Played</p>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-2xl font-bold">{totalStats?.totalScore || 0}</p>
                  <p className="text-sm opacity-90">Total Points</p>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-2xl font-bold">{totalStats?.averageAccuracy || 0}%</p>
                  <p className="text-sm opacity-90">Average Accuracy</p>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <div className="text-3xl mb-2">🔥</div>
                  <p className="text-2xl font-bold">{totalStats?.currentLoginStreak || 0}</p>
                  <p className="text-sm opacity-90">Day Streak</p>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Weekly Performance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="math" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="english" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="science" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Subject Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Milestone Progress
                  </h3>
                  <div className="space-y-4">
                    {'next' in milestone && milestone.next && (
                      <>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {('current' in milestone && typeof milestone.current === 'object' ? milestone.current?.title : 'Newbie')} {('current' in milestone && typeof milestone.current === 'object' ? milestone.current?.reward : '🌟')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Next</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {milestone.next.title} {milestone.next.reward}
                            </p>
                          </div>
                        </div>
                        <div>
                          <ProgressBar progress={'progress' in milestone ? milestone.progress : 0} className="h-4" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {totalStats?.totalScore || 0} / {milestone.next.points} points
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {selectedView === 'subjects' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mathematics</h3>
                    <span className="text-3xl">🧮</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                      <p className="text-2xl font-bold text-blue-500">{skillLevels?.math || 1}</p>
                    </div>
                    <ProgressBar progress={(skillLevels?.math || 1) * 4} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                      <span className="font-bold text-gray-900 dark:text-white">85%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Games Played</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {Math.floor((totalStats?.gamesPlayed || 0) * 0.4)}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">English</h3>
                    <span className="text-3xl">📚</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                      <p className="text-2xl font-bold text-green-500">{skillLevels?.english || 1}</p>
                    </div>
                    <ProgressBar progress={(skillLevels?.english || 1) * 4} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                      <span className="font-bold text-gray-900 dark:text-white">78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Games Played</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {Math.floor((totalStats?.gamesPlayed || 0) * 0.35)}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Science</h3>
                    <span className="text-3xl">🔬</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                      <p className="text-2xl font-bold text-yellow-500">{skillLevels?.science || 1}</p>
                    </div>
                    <ProgressBar progress={(skillLevels?.science || 1) * 4} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                      <span className="font-bold text-gray-900 dark:text-white">82%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Games Played</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {Math.floor((totalStats?.gamesPlayed || 0) * 0.25)}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Skill Development Radar
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={skillRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Skills" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {selectedView === 'skills' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Individual Skills Progress
              </h3>
              <div className="space-y-4">
                {skillsProgress.map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    variants={itemVariants}
                    className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {skill.skill}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Level {skill.level}/{skill.maxLevel}
                      </span>
                    </div>
                    <ProgressBar progress={skill.progress} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <span className="text-3xl">🏅</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Math Wizard</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Solved 100 problems</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <span className="text-3xl">📖</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Bookworm</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Read 50 stories</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <span className="text-3xl">🌟</span>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Science Explorer</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Completed all experiments</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {selectedView === 'timeline' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Learning Timeline
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedTimeRange('week')}
                    variant={selectedTimeRange === 'week' ? 'primary' : 'outline'}
                    size="sm"
                  >
                    Week
                  </Button>
                  <Button
                    onClick={() => setSelectedTimeRange('month')}
                    variant={selectedTimeRange === 'month' ? 'primary' : 'outline'}
                    size="sm"
                  >
                    Month
                  </Button>
                  <Button
                    onClick={() => setSelectedTimeRange('all')}
                    variant={selectedTimeRange === 'all' ? 'primary' : 'outline'}
                    size="sm"
                  >
                    All Time
                  </Button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="math" fill="#3B82F6" />
                  <Bar dataKey="english" fill="#10B981" />
                  <Bar dataKey="science" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentSessions.slice(0, 5).map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        session.accuracy >= 80 ? 'bg-green-500' :
                        session.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {session.subject.charAt(0).toUpperCase() + session.subject.slice(1)} Session
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {session.date} • {session.duration} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {session.accuracy}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Accuracy
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;