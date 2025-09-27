import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { useAppSelector, useAppDispatch } from '@/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { updateParentalControls } from '@/store/slices/settingsSlice';
import { trackEvent } from '@/store/slices/analyticsSlice';
import { ToastContainer, useToast } from '@/components/ui/ToastNotification';
import { CelebrationSettings } from '@/components/dashboard/CelebrationSettings';

interface InsightCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
  recommendation?: string;
}

interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'game' | 'achievement' | 'milestone' | 'session';
  description: string;
  subject?: string;
  score?: number;
  duration?: number;
}

const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toasts, showToast, dismissToast } = useToast();

  const { profile, skillLevels, achievements } = useAppSelector(state => state.student);
  const { totalStats, recentSessions, currentMetrics } = useAppSelector(state => state.analytics);
  const { parental } = useAppSelector(state => state.settings);
  const adaptiveData = useAppSelector(state => state.adaptive);

  const [selectedChild, setSelectedChild] = useState('current');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'activity' | 'controls' | 'celebrations'>('overview');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');

  // Mock data for multiple children
  const children = [
    { id: 'current', name: profile?.name || 'Child 1', age: profile?.age || 7, avatar: '🧒' },
  ];

  // Generate weekly learning data
  const weeklyLearningData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      math: Math.floor(Math.random() * 60) + 20,
      english: Math.floor(Math.random() * 60) + 20,
      science: Math.floor(Math.random() * 60) + 20,
      total: Math.floor(Math.random() * 120) + 60,
    }));
  }, [selectedTimeRange]);

  // Subject performance data
  const subjectPerformance = [
    { subject: 'Math', current: 85, previous: 78, target: 90 },
    { subject: 'English', current: 78, previous: 72, target: 85 },
    { subject: 'Science', current: 82, previous: 80, target: 88 },
  ];

  // Time distribution data
  const timeDistribution = [
    { name: 'Morning', value: 35, color: '#FFD700' },
    { name: 'Afternoon', value: 45, color: '#87CEEB' },
    { name: 'Evening', value: 20, color: '#DDA0DD' },
  ];

  // Skills mastery data
  const skillsMastery = useMemo(() => [
    { skill: 'Addition', mastery: 90, attempts: 120 },
    { skill: 'Subtraction', mastery: 85, attempts: 98 },
    { skill: 'Multiplication', mastery: 70, attempts: 67 },
    { skill: 'Division', mastery: 60, attempts: 45 },
    { skill: 'Reading', mastery: 88, attempts: 156 },
    { skill: 'Writing', mastery: 75, attempts: 89 },
    { skill: 'Grammar', mastery: 82, attempts: 102 },
    { skill: 'Biology', mastery: 78, attempts: 76 },
  ], []);

  // Insight cards
  const insights: InsightCard[] = [
    {
      id: 'engagement',
      title: 'Engagement Score',
      value: '92%',
      change: 5,
      icon: '📈',
      color: 'bg-green-500',
      recommendation: 'Great engagement! Keep up the daily practice.',
    },
    {
      id: 'accuracy',
      title: 'Average Accuracy',
      value: `${totalStats?.averageAccuracy || 0}%`,
      change: -2,
      icon: '🎯',
      color: 'bg-blue-500',
      recommendation: 'Consider focusing on problem areas.',
    },
    {
      id: 'time',
      title: 'Weekly Time',
      value: '5.2 hrs',
      change: 10,
      icon: '⏱️',
      color: 'bg-purple-500',
      recommendation: 'On track with recommended learning time.',
    },
    {
      id: 'streak',
      title: 'Current Streak',
      value: `${totalStats?.currentLoginStreak || 0} days`,
      change: 0,
      icon: '🔥',
      color: 'bg-orange-500',
      recommendation: 'Maintain daily practice for best results.',
    },
  ];

  // Activity log
  const activityLog: ActivityLog[] = [
    {
      id: '1',
      timestamp: new Date(),
      type: 'game',
      description: 'Completed Addition Adventure',
      subject: 'math',
      score: 95,
      duration: 12,
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000),
      type: 'achievement',
      description: 'Unlocked "Math Wizard" badge',
      subject: 'math',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000),
      type: 'milestone',
      description: 'Reached Level 5 in Mathematics',
      subject: 'math',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 86400000),
      type: 'session',
      description: 'Practice session completed',
      duration: 25,
    },
  ];

  const handleVerifyPin = () => {
    if (pin === '1234') { // Mock PIN verification
      setShowPinModal(false);
      setPin('');
      // Allow access to controls
      showToast(
        '✅ PIN Verified Successfully!',
        'success',
        {
          duration: 3000,
          className: 'font-bold'
        }
      );
    } else {
      showToast(
        '❌ Oops! That PIN is incorrect',
        'error',
        {
          duration: 4000,
          description: 'Please check your PIN and try again',
          className: 'font-bold'
        }
      );
    }
  };

  const handleUpdateScreenTime = (minutes: number) => {
    dispatch(updateParentalControls({
      sessionDuration: minutes,
    }));

    dispatch(trackEvent({
      category: 'parental',
      action: 'update_screen_time',
      value: minutes,
    }));
  };

  const getRecommendations = () => {
    const recommendations = [];

    if (totalStats?.averageAccuracy && totalStats.averageAccuracy < 70) {
      recommendations.push({
        type: 'warning',
        message: 'Accuracy is below target. Consider adjusting difficulty level.',
        action: 'Review Settings',
      });
    }

    if (adaptiveData.recentPerformance.hintsUsed > adaptiveData.recentPerformance.attempts * 0.5) {
      recommendations.push({
        type: 'info',
        message: 'Frequent hint usage detected. May benefit from additional practice.',
        action: 'Schedule Practice',
      });
    }

    if (totalStats?.currentLoginStreak && totalStats.currentLoginStreak > 7) {
      recommendations.push({
        type: 'success',
        message: 'Excellent consistency! Consider increasing challenge level.',
        action: 'Adjust Difficulty',
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Parent Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor and guide your child's learning journey
              </p>
            </div>
            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
            >
              ⚙️ Settings
            </Button>
          </div>
        </motion.div>

        {/* Child Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <label className="text-gray-700 dark:text-gray-300 font-medium">
              Viewing:
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.avatar} {child.name} (Age {child.age})
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              + Add Child
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'primary' : 'outline'}
            size="sm"
          >
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab('progress')}
            variant={activeTab === 'progress' ? 'primary' : 'outline'}
            size="sm"
          >
            Progress
          </Button>
          <Button
            onClick={() => setActiveTab('activity')}
            variant={activeTab === 'activity' ? 'primary' : 'outline'}
            size="sm"
          >
            Activity
          </Button>
          <Button
            onClick={() => setActiveTab('controls')}
            variant={activeTab === 'controls' ? 'primary' : 'outline'}
            size="sm"
          >
            Controls
          </Button>
          <Button
            onClick={() => setActiveTab('celebrations')}
            variant={activeTab === 'celebrations' ? 'primary' : 'outline'}
            size="sm"
          >
            🎉 Celebrations
          </Button>
        </div>

        {activeTab === 'overview' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {insights.map((insight) => (
                <motion.div key={insight.id} variants={itemVariants}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{insight.icon}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        insight.change > 0 ? 'bg-green-100 text-green-700' :
                        insight.change < 0 ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {insight.change > 0 ? '+' : ''}{insight.change}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {insight.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {insight.title}
                    </p>
                    {insight.recommendation && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        {insight.recommendation}
                      </p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20' :
                          rec.type === 'success' ? 'bg-green-50 border-green-500 dark:bg-green-900/20' :
                          'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700 dark:text-gray-300">
                            {rec.message}
                          </p>
                          <Button variant="outline" size="sm">
                            {rec.action}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Weekly Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Weekly Learning Time
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={weeklyLearningData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="total" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Time of Day Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={timeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {timeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Subject Performance */}
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Subject Performance
                </h3>
                <div className="space-y-4">
                  {subjectPerformance.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {subject.subject}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {subject.previous}%
                          </span>
                          <span className="text-sm">→</span>
                          <span className={`font-bold ${
                            subject.current > subject.previous ? 'text-green-500' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {subject.current}%
                          </span>
                          <span className="text-sm text-gray-500">
                            (Target: {subject.target}%)
                          </span>
                        </div>
                      </div>
                      <ProgressBar
                        progress={subject.current}
                        className="h-3"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Skills Mastery */}
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Skills Mastery
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillsMastery}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mastery" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Learning Pace */}
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Learning Pace Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-500">Fast</p>
                    <p className="text-gray-600 dark:text-gray-400">Mathematics</p>
                    <p className="text-sm text-gray-500">Above expected pace</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">On Track</p>
                    <p className="text-gray-600 dark:text-gray-400">Science</p>
                    <p className="text-sm text-gray-500">Meeting expectations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-500">Needs Support</p>
                    <p className="text-gray-600 dark:text-gray-400">English</p>
                    <p className="text-sm text-gray-500">Additional practice recommended</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Activity
                  </h3>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                    className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="day">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {activityLog.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'game' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                        activity.type === 'milestone' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.type === 'game' ? '🎮' :
                         activity.type === 'achievement' ? '🏆' :
                         activity.type === 'milestone' ? '⭐' : '📚'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.timestamp.toLocaleTimeString()}
                          </span>
                          {activity.subject && (
                            <span className="text-sm px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                              {activity.subject}
                            </span>
                          )}
                          {activity.score && (
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              Score: {activity.score}%
                            </span>
                          )}
                          {activity.duration && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {activity.duration} min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View Full History
                </Button>
              </Card>
            </motion.div>

            {/* Session Summary */}
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Today's Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">45 min</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Time</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">87%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">250</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Points Earned</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'controls' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Parental Controls
                </h3>

                <div className="space-y-6">
                  {/* Screen Time */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                      Daily Screen Time Limit
                    </label>
                    <div className="mt-2 flex items-center gap-4">
                      <input
                        type="range"
                        min="15"
                        max="120"
                        value={parental.sessionDuration}
                        onChange={(e) => handleUpdateScreenTime(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-gray-900 dark:text-white w-20 text-right">
                        {parental.sessionDuration} min
                      </span>
                    </div>
                  </div>

                  {/* Content Restrictions */}
                  <div>
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                      Content Filter Level
                    </label>
                    <select
                      value={parental.contentFilter}
                      onChange={(e) => dispatch(updateParentalControls({ contentFilter: e.target.value as any }))}
                      className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="strict">Strict - Ages 3-5</option>
                      <option value="moderate">Moderate - Ages 6-8</option>
                      <option value="relaxed">Relaxed - Ages 9+</option>
                    </select>
                  </div>

                  {/* Permissions */}
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Age-Appropriate Content Only</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Filter games based on child's age
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={parental.ageRestriction}
                        onChange={(e) => dispatch(updateParentalControls({ ageRestriction: e.target.checked }))}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Require PIN for Settings</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Child cannot change settings without PIN
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={parental.requirePinForSettings}
                        onChange={(e) => dispatch(updateParentalControls({ requirePinForSettings: e.target.checked }))}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Block In-App Purchases</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Prevent any purchases within the app
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Safe Chat Mode</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Pre-approved messages only in multiplayer
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5"
                      />
                    </label>
                  </div>

                  {/* Time Restrictions */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Play Time Schedule
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Weekdays</span>
                        <div className="flex gap-2">
                          <input
                            type="time"
                            defaultValue="15:00"
                            className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            defaultValue="18:00"
                            className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Weekends</span>
                        <div className="flex gap-2">
                          <input
                            type="time"
                            defaultValue="09:00"
                            className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            defaultValue="19:00"
                            className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PIN Management */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Parent PIN
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Used to access parent-only features
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowPinModal(true)}
                        variant="outline"
                      >
                        Change PIN
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Reports */}
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Reports & Exports
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-center">
                    📊 Download Weekly Report
                  </Button>
                  <Button variant="outline" className="justify-center">
                    📈 Export Progress Data
                  </Button>
                  <Button variant="outline" className="justify-center">
                    📧 Email Monthly Summary
                  </Button>
                  <Button variant="outline" className="justify-center">
                    🖨️ Print Report Card
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Celebrations Tab */}
        {activeTab === 'celebrations' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <CelebrationSettings />
          </motion.div>
        )}

        {/* PIN Modal */}
        {showPinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Enter Parent PIN
              </h3>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 mb-4"
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowPinModal(false);
                    setPin('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVerifyPin}
                  variant="primary"
                  className="flex-1"
                >
                  Verify
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        ageGroup="9+"
        position="top-right"
      />
    </div>
  );
};

export default ParentDashboard;