import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionManager, type SessionInfo, type DeviceInfo } from '../../services/auth/SessionManager';
import { useAuth } from '../../contexts/AuthContext';

export interface MultiDeviceManagerProps {
  isVisible: boolean;
  onClose: () => void;
}

const MultiDeviceManager: React.FC<MultiDeviceManagerProps> = ({
  isVisible,
  onClose
}) => {
  const { user } = useAuth();
  const [activeSessions, setActiveSessions] = useState<SessionInfo[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isVisible && user) {
      loadSessionData();
    }
  }, [isVisible, user]);

  const loadSessionData = async () => {
    try {
      setIsLoading(true);

      if (!user) return;

      // Get user sessions
      const sessions = sessionManager.getUserSessions(user.id);
      setActiveSessions(sessions);

      // Get current session ID from JWT or storage
      const currentSession = sessions.find(s => s.deviceInfo.id === getCurrentDeviceId());
      setCurrentSessionId(currentSession?.id || null);

    } catch (error) {
      console.error('Error loading session data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDeviceId = (): string => {
    return localStorage.getItem('sl_device_id') || '';
  };

  const endSession = async (sessionId: string) => {
    try {
      await sessionManager.endSession(sessionId, 'user_terminated');

      // Reload session data
      await loadSessionData();

      // If ending current session, logout
      if (sessionId === currentSessionId) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const endAllOtherSessions = async () => {
    try {
      if (!user || !currentSessionId) return;

      await sessionManager.endUserSessions(user.id, currentSessionId);
      await loadSessionData();
    } catch (error) {
      console.error('Error ending other sessions:', error);
    }
  };

  const getDeviceIcon = (deviceType: DeviceInfo['type']) => {
    switch (deviceType) {
      case 'mobile': return '📱';
      case 'tablet': return '📋';
      case 'desktop': return '💻';
      default: return '🖥️';
    }
  };

  const getSessionStatus = (session: SessionInfo) => {
    const timeSinceActivity = Date.now() - session.lastActivity.getTime();
    const minutesAgo = Math.floor(timeSinceActivity / (1000 * 60));

    if (minutesAgo < 1) return { text: 'Active now', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (minutesAgo < 5) return { text: `${minutesAgo}m ago`, color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (minutesAgo < 30) return { text: `${minutesAgo}m ago`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { text: `${minutesAgo}m ago`, color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading devices...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Active Sessions</h2>
                  <p className="text-blue-100">Manage your logged-in devices</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeSessions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Sessions</h3>
                  <p className="text-gray-500">All sessions have been ended</p>
                </div>
              ) : (
                <>
                  {/* Current Session Info */}
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <h3 className="font-semibold text-green-800">Current Session</h3>
                        <p className="text-sm text-green-600">This device</p>
                      </div>
                    </div>
                  </div>

                  {/* Sessions List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activeSessions.map((session) => {
                      const isCurrentSession = session.id === currentSessionId;
                      const status = getSessionStatus(session);

                      return (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 border rounded-xl ${
                            isCurrentSession
                              ? 'border-green-300 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } transition-colors`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {/* Device Icon */}
                              <div className="text-2xl mt-1">
                                {getDeviceIcon(session.deviceInfo.type)}
                              </div>

                              {/* Device Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-800 truncate">
                                    {session.deviceInfo.name}
                                  </h4>
                                  {isCurrentSession && (
                                    <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">
                                      Current
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>{session.deviceInfo.browser} on {session.deviceInfo.os}</p>
                                  <p>Started: {formatDate(session.startTime)}</p>
                                  <p>User: {session.userType === 'child' ? '👶 Child' : '👨‍👩‍👧‍👦 Parent'}</p>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                                    <div className={`w-2 h-2 rounded-full mr-1 ${status.color.replace('text-', 'bg-')}`}></div>
                                    {status.text}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            {!isCurrentSession && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => endSession(session.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="End session"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3">
                    {activeSessions.length > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={endAllOtherSessions}
                        className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                      >
                        End All Other Sessions
                      </motion.button>
                    )}

                    <button
                      onClick={onClose}
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>

                  {/* Security Info */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-lg">🛡️</span>
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Security Tip</h4>
                        <p className="text-sm text-blue-700">
                          If you don't recognize a device, end its session immediately.
                          Only keep sessions active on devices you trust.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MultiDeviceManager;