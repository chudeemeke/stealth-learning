import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, ComposedChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { PerformanceMetrics, LearningAnalyticsEngine } from '@/services/analytics/LearningAnalytics';

// Dashboard configuration
interface DashboardConfig {
  userId: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time';
  autoRefresh: boolean;
  refreshInterval: number;
}

// Chart themes for age groups
const chartThemes = {
  '3-5': {
    primary: '#FFCC00',
    secondary: '#FF9500',
    success: '#34C759',
    accent: '#5AC8FA',
    colors: ['#FFCC00', '#FF9500', '#34C759', '#5AC8FA', '#FF2D92'],
  },
  '6-8': {
    primary: '#007AFF',
    secondary: '#AF52DE',
    success: '#34C759',
    accent: '#5AC8FA',
    colors: ['#007AFF', '#AF52DE', '#34C759', '#5AC8FA', '#FF9500'],
  },
  '9+': {
    primary: '#5856D6',
    secondary: '#5AC8FA',
    success: '#34C759',
    accent: '#FF9500',
    colors: ['#5856D6', '#5AC8FA', '#34C759', '#FF9500', '#FF3B30'],
  },
};

// Performance overview card
const PerformanceOverview: React.FC<{
  metrics: PerformanceMetrics;
  ageGroup: '3-5' | '6-8' | '9+';
}> = ({ metrics, ageGroup }) => {
  const theme = chartThemes[ageGroup];

  const overviewData = [
    {
      label: 'Accuracy',
      value: metrics.metrics.accuracy,
      change: '+5.2%',
      trend: 'up',
      color: theme.success,
    },
    {
      label: 'Engagement',
      value: metrics.metrics.engagementScore,
      change: '+12%',
      trend: 'up',
      color: theme.primary,
    },
    {
      label: 'Session Time',
      value: Math.round(metrics.metrics.averageSessionDuration / 60000),
      change: '-2min',
      trend: 'down',
      color: theme.accent,
      suffix: 'min',
    },
    {
      label: 'Streak',
      value: metrics.metrics.currentStreak,
      change: '+3',
      trend: 'up',
      color: theme.secondary,
      suffix: 'days',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassContainer preset="subtle" className="p-4 text-center">
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: item.color }}
            >
              {item.value}{item.suffix || ''}
            </div>
            <div className="text-sm text-apple-gray-600 mb-2">
              {item.label}
            </div>
            <div className={cn(
              'text-xs flex items-center justify-center gap-1',
              item.trend === 'up' ? 'text-system-green' : 'text-system-red'
            )}>
              <span>{item.trend === 'up' ? '↗' : '↘'}</span>
              <span>{item.change}</span>
            </div>
          </GlassContainer>
        </motion.div>
      ))}
    </div>
  );
};

// Progress chart component
const ProgressChart: React.FC<{
  data: any[];
  ageGroup: '3-5' | '6-8' | '9+';
  timeframe: string;
}> = ({ data, ageGroup, timeframe }) => {
  const theme = chartThemes[ageGroup];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <GlassContainer preset="strong" className="p-3 min-w-32">
          <p className="text-sm font-medium text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-white/80">
              <span style={{ color: entry.color }}>●</span> {entry.name}: {entry.value}%
            </p>
          ))}
        </GlassContainer>
      );
    }
    return null;
  };

  return (
    <GlassContainer preset="subtle" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Learning Progress
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={theme.primary} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.secondary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={theme.secondary} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
          />
          <YAxis
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="accuracy"
            stroke={theme.primary}
            fillOpacity={1}
            fill="url(#accuracyGradient)"
            name="Accuracy"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke={theme.secondary}
            fillOpacity={1}
            fill="url(#engagementGradient)"
            name="Engagement"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </GlassContainer>
  );
};

// Subject performance chart
const SubjectPerformance: React.FC<{
  data: any[];
  ageGroup: '3-5' | '6-8' | '9+';
}> = ({ data, ageGroup }) => {
  const theme = chartThemes[ageGroup];

  return (
    <GlassContainer preset="subtle" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Subject Performance
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={data}>
          <RadialBar
            label={{ fill: '#fff', position: 'insideStart' }}
            background
            dataKey="score"
            fill={theme.primary}
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ color: '#fff' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </GlassContainer>
  );
};

// Learning patterns visualization
const LearningPatterns: React.FC<{
  patterns: string[];
  ageGroup: '3-5' | '6-8' | '9+';
}> = ({ patterns, ageGroup }) => {
  const theme = chartThemes[ageGroup];

  const patternData = patterns.map((pattern, index) => ({
    name: pattern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: Math.random() * 100 + 50, // Mock data
    color: theme.colors[index % theme.colors.length],
  }));

  return (
    <GlassContainer preset="subtle" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Learning Patterns
      </h3>
      <div className="space-y-3">
        {patternData.map((pattern, index) => (
          <motion.div
            key={pattern.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-white/80">
              {pattern.name}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: pattern.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, pattern.value)}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                />
              </div>
              <span className="text-xs text-white/60 w-8">
                {Math.round(pattern.value)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassContainer>
  );
};

// Streak calendar
const StreakCalendar: React.FC<{
  streakData: any[];
  ageGroup: '3-5' | '6-8' | '9+';
}> = ({ streakData, ageGroup }) => {
  const theme = chartThemes[ageGroup];

  // Generate last 30 days
  const generateCalendarData = () => {
    const days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayData = streakData.find(d =>
        new Date(d.date).toDateString() === date.toDateString()
      );

      days.push({
        date: date.getDate(),
        active: !!dayData,
        score: dayData?.score || 0,
        dayName: date.toLocaleDateString('en', { weekday: 'short' }),
      });
    }

    return days;
  };

  const calendarData = generateCalendarData();

  return (
    <GlassContainer preset="subtle" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        30-Day Activity
      </h3>
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-xs text-white/60 text-center p-1">
            {day}
          </div>
        ))}
        {calendarData.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            className={cn(
              'aspect-square rounded-sm border text-xs flex items-center justify-center',
              day.active
                ? 'border-transparent text-white'
                : 'border-white/20 text-white/40'
            )}
            style={{
              backgroundColor: day.active
                ? `${theme.primary}${Math.round(255 * (day.score / 100)).toString(16).padStart(2, '0')}`
                : 'transparent'
            }}
          >
            {day.date}
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4 text-xs text-white/60">
        <span>Less</span>
        <div className="flex gap-1">
          {[0.2, 0.4, 0.6, 0.8, 1].map(opacity => (
            <div
              key={opacity}
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: `${theme.primary}${Math.round(255 * opacity).toString(16).padStart(2, '0')}` }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </GlassContainer>
  );
};

// Achievement showcase
const AchievementShowcase: React.FC<{
  achievements: string[];
  recentAchievements: string[];
  ageGroup: '3-5' | '6-8' | '9+';
}> = ({ achievements, recentAchievements, ageGroup }) => {
  const theme = chartThemes[ageGroup];

  const achievementTypes = [
    { id: 'accuracy_master', name: 'Accuracy Master', icon: '🎯', description: '95% accuracy' },
    { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Fast responses' },
    { id: 'persistent_learner', name: 'Persistent', icon: '🏃', description: '7-day streak' },
    { id: 'math_wizard', name: 'Math Wizard', icon: '🧮', description: 'Math mastery' },
    { id: 'word_master', name: 'Word Master', icon: '📖', description: 'Reading expert' },
    { id: 'science_explorer', name: 'Explorer', icon: '🔬', description: 'Science curious' },
  ];

  return (
    <GlassContainer preset="subtle" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Achievements
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {achievementTypes.map((achievement, index) => {
          const isEarned = achievements.includes(achievement.id);
          const isRecent = recentAchievements.includes(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative p-3 rounded-apple-lg border text-center',
                isEarned
                  ? 'border-transparent bg-white/10'
                  : 'border-white/20 bg-white/5'
              )}
            >
              {isRecent && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-system-yellow rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
              <div className={cn(
                'text-2xl mb-2',
                !isEarned && 'opacity-30'
              )}>
                {achievement.icon}
              </div>
              <div className={cn(
                'text-xs font-medium mb-1',
                isEarned ? 'text-white' : 'text-white/40'
              )}>
                {achievement.name}
              </div>
              <div className={cn(
                'text-xs',
                isEarned ? 'text-white/70' : 'text-white/30'
              )}>
                {achievement.description}
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassContainer>
  );
};

// Time analysis chart
const TimeAnalysis: React.FC<{
  timeData: any[];
  ageGroup: '3-5' | '6-8' | '9+';
}> = ({ timeData, ageGroup }) => {
  const theme = chartThemes[ageGroup];

  return (
    <GlassContainer preset="subtle" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Best Learning Times
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={timeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="hour"
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
          />
          <YAxis
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
          />
          <Bar
            dataKey="performance"
            fill={theme.primary}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </GlassContainer>
  );
};

// Main dashboard component
export const ParentDashboard: React.FC<{
  config: DashboardConfig;
  ageGroup: '3-5' | '6-8' | '9+';
}> = ({ config, ageGroup }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(config.timeframe);
  const analytics = useMemo(() => new LearningAnalyticsEngine(), []);

  // Load metrics data
  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const data = await analytics.calculatePerformanceMetrics(
          config.userId,
          selectedTimeframe
        );
        setMetrics(data);
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [config.userId, selectedTimeframe, analytics]);

  // Auto-refresh setup
  useEffect(() => {
    if (!config.autoRefresh) return;

    const interval = setInterval(() => {
      if (metrics) {
        // Reload metrics
        analytics.calculatePerformanceMetrics(config.userId, selectedTimeframe)
          .then(setMetrics)
          .catch(console.error);
      }
    }, config.refreshInterval);

    return () => clearInterval(interval);
  }, [config.autoRefresh, config.refreshInterval, config.userId, selectedTimeframe, analytics, metrics]);

  // Mock data for visualization (replace with real data)
  const progressData = [
    { date: 'Mon', accuracy: 85, engagement: 90 },
    { date: 'Tue', accuracy: 88, engagement: 85 },
    { date: 'Wed', accuracy: 92, engagement: 95 },
    { date: 'Thu', accuracy: 89, engagement: 88 },
    { date: 'Fri', accuracy: 94, engagement: 92 },
    { date: 'Sat', accuracy: 91, engagement: 89 },
    { date: 'Sun', accuracy: 96, engagement: 94 },
  ];

  const subjectData = [
    { subject: 'Math', score: 85, fill: chartThemes[ageGroup].primary },
    { subject: 'English', score: 92, fill: chartThemes[ageGroup].secondary },
    { subject: 'Science', score: 78, fill: chartThemes[ageGroup].success },
  ];

  const timeAnalysisData = [
    { hour: '9AM', performance: 85 },
    { hour: '10AM', performance: 92 },
    { hour: '11AM', performance: 88 },
    { hour: '2PM', performance: 95 },
    { hour: '3PM', performance: 89 },
    { hour: '4PM', performance: 82 },
  ];

  const streakData = [
    { date: '2024-01-01', score: 85 },
    { date: '2024-01-02', score: 92 },
    { date: '2024-01-03', score: 0 },
    { date: '2024-01-04', score: 88 },
    { date: '2024-01-05', score: 95 },
  ];

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-8 h-8 border-4 border-system-blue border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          Learning Dashboard
        </h1>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'monthly', 'all_time'] as const).map(timeframe => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={cn(
                'px-4 py-2 rounded-apple-lg text-sm font-medium transition-all',
                selectedTimeframe === timeframe
                  ? 'bg-system-blue text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              )}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <PerformanceOverview metrics={metrics} ageGroup={ageGroup} />

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart
          data={progressData}
          ageGroup={ageGroup}
          timeframe={selectedTimeframe}
        />
        <SubjectPerformance
          data={subjectData}
          ageGroup={ageGroup}
        />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LearningPatterns
          patterns={['fast_learner', 'highly_engaged', 'prefers_visual', 'works_better_afternoon']}
          ageGroup={ageGroup}
        />
        <StreakCalendar
          streakData={streakData}
          ageGroup={ageGroup}
        />
        <AchievementShowcase
          achievements={['accuracy_master', 'speed_demon', 'persistent_learner']}
          recentAchievements={['math_wizard']}
          ageGroup={ageGroup}
        />
      </div>

      {/* Time Analysis */}
      <TimeAnalysis
        timeData={timeAnalysisData}
        ageGroup={ageGroup}
      />
    </div>
  );
};

export default ParentDashboard;