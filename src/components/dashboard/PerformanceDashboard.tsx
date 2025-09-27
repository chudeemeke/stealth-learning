/**
 * AAA+ Performance Dashboard Component
 * Real-time performance monitoring and analytics visualization
 * Parent/Teacher view for comprehensive insights
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  performanceMonitor,
  type PerformanceMetrics
} from '@/services/performance/PerformanceMonitorService';
import {
  realTimeAnalytics,
  type LearningMetrics,
  type SubjectProgress
} from '@/services/analytics/RealTimeAnalyticsService';

interface DashboardProps {
  userId?: string;
  ageGroup?: '3-5' | '6-8' | '9+';
}

const PerformanceDashboard: React.FC<DashboardProps> = ({ userId, ageGroup }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'performance' | 'learning' | 'analytics'>('performance');
  const [optimizationMode, setOptimizationMode] = useState<'off' | 'auto' | 'aggressive'>('auto');
  const [showDetails, setShowDetails] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsChartRef = useRef<any[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Start monitoring
    performanceMonitor.startMonitoring(ageGroup);
    realTimeAnalytics.startSession(userId);

    // Subscribe to metrics updates
    const unsubscribe = performanceMonitor.onMetricsUpdate((newMetrics) => {
      setMetrics(newMetrics);
      updateFPSChart(newMetrics.fps);
    });

    // Update analytics data periodically
    const analyticsInterval = setInterval(() => {
      setAnalyticsData(realTimeAnalytics.getMetrics());
    }, 5000);

    // Cleanup
    return () => {
      unsubscribe();
      clearInterval(analyticsInterval);
      performanceMonitor.stopMonitoring();
      realTimeAnalytics.stopSession();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [userId, ageGroup]);

  const updateFPSChart = useCallback((fps: number) => {
    fpsChartRef.current.push(fps);
    if (fpsChartRef.current.length > 60) {
      fpsChartRef.current.shift();
    }
    drawFPSChart();
  }, []);

  const drawFPSChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
    gradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.8)');
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0.8)');

    // Draw FPS line chart
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const width = canvas.width;
    const height = canvas.height;
    const step = width / 60;

    fpsChartRef.current.forEach((fps, index) => {
      const x = index * step;
      const y = height - (fps / 60) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw 30 FPS and 60 FPS lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // 30 FPS line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // 60 FPS line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.stroke();

    ctx.setLineDash([]);
  }, []);

  const getFPSColor = (fps: number): string => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMemoryPercentage = (): number => {
    if (!metrics) return 0;
    return (metrics.memoryUsage / metrics.memoryLimit) * 100;
  };

  const getPerformanceScore = (): number => {
    const summary = performanceMonitor.getPerformanceSummary();
    return summary.score;
  };

  const handleOptimizationModeChange = (mode: 'off' | 'auto' | 'aggressive') => {
    setOptimizationMode(mode);
    performanceMonitor.setOptimizationMode(mode);
  };

  const handleExportReport = () => {
    const performanceReport = performanceMonitor.exportReport();
    const analyticsReport = realTimeAnalytics.exportAnalytics();

    const fullReport = {
      performance: JSON.parse(performanceReport),
      analytics: JSON.parse(analyticsReport),
      timestamp: new Date().toISOString()
    };

    // Download as JSON file
    const blob = new Blob([JSON.stringify(fullReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">
          Loading Performance Metrics...
        </div>
      </div>
    );
  }

  const summary = performanceMonitor.getPerformanceSummary();
  const analyticsSummary = realTimeAnalytics.getAnalyticsSummary();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6 rounded-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AAA+ Performance Dashboard
        </h2>
        <p className="text-gray-300">Real-time monitoring and analytics</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {(['performance', 'learning', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* FPS Monitor */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Frame Rate Monitor</h3>
                <div className={`text-3xl font-mono ${getFPSColor(metrics.fps)}`}>
                  {metrics.fps} FPS
                </div>
              </div>
              <canvas
                ref={canvasRef}
                width={600}
                height={150}
                className="w-full h-32 bg-gray-900/50 rounded"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>60 FPS (Optimal)</span>
                <span>30 FPS (Playable)</span>
              </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Frame Time"
                value={`${metrics.frameTime.toFixed(2)}ms`}
                status={metrics.frameTime <= 16.67 ? 'good' : metrics.frameTime <= 33.33 ? 'warning' : 'critical'}
                icon="⏱️"
              />
              <MetricCard
                title="Memory Usage"
                value={`${(metrics.memoryUsage / 1024 / 1024).toFixed(0)}MB`}
                status={getMemoryPercentage() < 60 ? 'good' : getMemoryPercentage() < 80 ? 'warning' : 'critical'}
                icon="💾"
                progress={getMemoryPercentage()}
              />
              <MetricCard
                title="Network Latency"
                value={`${metrics.networkLatency.toFixed(0)}ms`}
                status={metrics.networkLatency < 100 ? 'good' : metrics.networkLatency < 500 ? 'warning' : 'critical'}
                icon="🌐"
              />
              <MetricCard
                title="Jank Score"
                value={metrics.jank.toString()}
                status={metrics.jank < 5 ? 'good' : metrics.jank < 10 ? 'warning' : 'critical'}
                icon="📊"
              />
            </div>

            {/* Performance Summary */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Performance Analysis</h3>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-3xl font-bold mb-1">
                    {summary.score.toFixed(0)}%
                  </div>
                  <div className={`text-lg ${
                    summary.overall === 'excellent' ? 'text-green-400' :
                    summary.overall === 'good' ? 'text-yellow-400' :
                    summary.overall === 'needs-improvement' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {summary.overall.charAt(0).toUpperCase() + summary.overall.slice(1)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-2">Optimization Mode</div>
                  <select
                    value={optimizationMode}
                    onChange={(e) => handleOptimizationModeChange(e.target.value as any)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    <option value="off">Off</option>
                    <option value="auto">Auto</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>

              {summary.issues.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-red-400 mb-2">Issues Detected:</h4>
                  <ul className="space-y-1">
                    {summary.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-gray-300">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-blue-400 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {summary.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-300">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Component Performance */}
            {showDetails && (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4">Component Performance</h3>
                <div className="space-y-2">
                  {performanceMonitor.getComponentMetrics().slice(0, 10).map((comp) => (
                    <div key={comp.name} className="flex justify-between items-center">
                      <span className="text-sm">{comp.name}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-400">
                          {comp.renderCount} renders
                        </span>
                        <span className={`text-sm font-mono ${
                          comp.avgRenderTime < 10 ? 'text-green-400' :
                          comp.avgRenderTime < 20 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {comp.avgRenderTime.toFixed(2)}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'learning' && analyticsData && (
          <motion.div
            key="learning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Learning Progress Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.progress.map((prog: SubjectProgress) => (
                <div key={prog.subject} className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold capitalize">{prog.subject}</h4>
                    <span className="text-2xl">
                      {prog.subject === 'math' ? '🔢' :
                       prog.subject === 'english' ? '📚' :
                       prog.subject === 'science' ? '🔬' :
                       prog.subject === 'logic' ? '🧩' :
                       prog.subject === 'geography' ? '🌍' :
                       '🎨'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Level</span>
                      <span className="font-bold">{prog.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">XP</span>
                      <span className="font-bold">{prog.xp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Accuracy</span>
                      <span className={`font-bold ${
                        prog.accuracy > 80 ? 'text-green-400' :
                        prog.accuracy > 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {prog.accuracy.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(prog.xp % 1000) / 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Metrics */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Learning Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analyticsData.learning.map((metric: LearningMetrics) => (
                  <div key={metric.subject} className="text-center">
                    <div className="text-sm text-gray-400 mb-1 capitalize">{metric.subject}</div>
                    <div className="text-2xl font-bold mb-2">
                      {metric.mastery.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {metric.totalQuestions} questions
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adaptive Insights */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Adaptive Learning Insights</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Learning Style</div>
                  <div className="text-lg font-medium capitalize">
                    {analyticsData.insights.learningStyle}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Pace Preference</div>
                  <div className="text-lg font-medium capitalize">
                    {analyticsData.insights.pacePreference}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Challenge Level</div>
                  <div className="text-lg font-medium capitalize">
                    {analyticsData.insights.challengePreference}
                  </div>
                </div>
              </div>

              {analyticsData.insights.recommendedPath.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-blue-400 mb-2">Recommended Learning Path:</h4>
                  <ul className="space-y-1">
                    {analyticsData.insights.recommendedPath.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-gray-300">
                        {index + 1}. {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Session Analytics */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Session Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Session Duration</div>
                  <div className="text-xl font-bold">{analyticsSummary.sessionDuration}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Total Events</div>
                  <div className="text-xl font-bold">{analyticsSummary.totalEvents}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Learning Progress</div>
                  <div className="text-xl font-bold">{analyticsSummary.learningProgress.toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Engagement</div>
                  <div className={`text-xl font-bold capitalize ${
                    analyticsSummary.engagementLevel === 'high' ? 'text-green-400' :
                    analyticsSummary.engagementLevel === 'medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {analyticsSummary.engagementLevel}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Subjects */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Top Subjects</h3>
              <div className="space-y-2">
                {analyticsSummary.topSubjects.map((subject: string, index: number) => (
                  <div key={subject} className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-gray-600">#{index + 1}</div>
                    <div className="flex-1">
                      <div className="text-lg capitalize">{subject}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {realTimeAnalytics.getRecentEvents(10).map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-sm">{event.action}</span>
                    </div>
                    {event.label && (
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {event.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
        <div className="space-x-3">
          <button
            onClick={() => {
              performanceMonitor.resetMetrics();
              realTimeAnalytics.resetAnalytics();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Reset Metrics
          </button>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  icon: string;
  progress?: number;
}> = ({ title, value, status, icon, progress }) => {
  const statusColors = {
    good: 'border-green-500 bg-green-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10',
    critical: 'border-red-500 bg-red-500/10'
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border ${statusColors[status]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs px-2 py-1 rounded ${
          status === 'good' ? 'bg-green-500/20 text-green-400' :
          status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {status}
        </span>
      </div>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-xl font-bold">{value}</div>
      {progress !== undefined && (
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full ${
              status === 'good' ? 'bg-green-500' :
              status === 'warning' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;