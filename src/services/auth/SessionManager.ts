import { jwtService } from './JWTService';
import { DatabaseService } from '../database/DatabaseService';

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'tablet' | 'mobile' | 'unknown';
  browser: string;
  os: string;
  lastActive: Date;
  isActive: boolean;
  ipAddress?: string;
  userAgent: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  profileId?: string;
  deviceInfo: DeviceInfo;
  startTime: Date;
  lastActivity: Date;
  isActive: boolean;
  userType: 'parent' | 'child';
  permissions: string[];
  metadata: {
    loginMethod: 'email' | 'pin' | 'auto';
    rememberMe: boolean;
    timeoutWarnings: number;
    extendedCount: number;
  };
}

export interface SessionConfig {
  maxConcurrentSessions: number;
  childSessionTimeout: number; // minutes
  parentSessionTimeout: number; // minutes
  warningThreshold: number; // minutes before timeout warning
  maxSessionExtensions: number;
  requireReauthAfterTimeout: boolean;
  allowMultiDeviceAccess: boolean;
}

class SessionManager {
  private static instance: SessionManager;
  private dbService: DatabaseService;
  private activeSessions: Map<string, SessionInfo> = new Map();
  private timeoutWarnings: Map<string, NodeJS.Timeout> = new Map();
  private sessionTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // Default session configuration
  private readonly config: SessionConfig = {
    maxConcurrentSessions: 3,
    childSessionTimeout: 60, // 1 hour for children
    parentSessionTimeout: 240, // 4 hours for parents
    warningThreshold: 5, // 5 minutes warning
    maxSessionExtensions: 3,
    requireReauthAfterTimeout: true,
    allowMultiDeviceAccess: true
  };

  constructor() {
    this.dbService = DatabaseService.getInstance();
    this.startHeartbeat();
    this.loadActiveSessions();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Create a new session
   */
  async createSession(
    userId: string,
    userType: 'parent' | 'child',
    profileId?: string,
    loginMethod: 'email' | 'pin' | 'auto' = 'email',
    rememberMe: boolean = false
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      // Check concurrent session limits
      const userSessions = this.getUserSessions(userId);

      if (!this.config.allowMultiDeviceAccess && userSessions.length > 0) {
        // End existing sessions if multi-device not allowed
        await this.endUserSessions(userId);
      } else if (userSessions.length >= this.config.maxConcurrentSessions) {
        // End oldest session if at limit
        const oldestSession = userSessions.sort((a, b) =>
          a.lastActivity.getTime() - b.lastActivity.getTime()
        )[0];
        await this.endSession(oldestSession.id, 'session_limit_exceeded');
      }

      // Generate session ID
      const sessionId = this.generateSessionId();

      // Get device info
      const deviceInfo = this.getDeviceInfo();

      // Create session info
      const sessionInfo: SessionInfo = {
        id: sessionId,
        userId,
        profileId,
        deviceInfo,
        startTime: new Date(),
        lastActivity: new Date(),
        isActive: true,
        userType,
        permissions: this.getUserPermissions(userType),
        metadata: {
          loginMethod,
          rememberMe,
          timeoutWarnings: 0,
          extendedCount: 0
        }
      };

      // Store session
      this.activeSessions.set(sessionId, sessionInfo);
      await this.persistSession(sessionInfo);

      // Set up timeout monitoring
      this.setupSessionTimeout(sessionId);

      console.log(`✅ Session created: ${sessionId} for user: ${userId} (${userType})`);

      return { success: true, sessionId };

    } catch (error) {
      console.error('Session creation error:', error);
      return { success: false, error: 'Failed to create session' };
    }
  }

  /**
   * Update session activity
   */
  async updateActivity(sessionId: string): Promise<void> {
    try {
      const session = this.activeSessions.get(sessionId);

      if (session && session.isActive) {
        session.lastActivity = new Date();

        // Update device status
        session.deviceInfo.lastActive = new Date();
        session.deviceInfo.isActive = true;

        // Persist update
        await this.persistSession(session);

        // Reset timeout
        this.resetSessionTimeout(sessionId);
      }
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  }

  /**
   * Extend session timeout
   */
  async extendSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const session = this.activeSessions.get(sessionId);

      if (!session || !session.isActive) {
        return { success: false, error: 'Session not found or inactive' };
      }

      if (session.metadata.extendedCount >= this.config.maxSessionExtensions) {
        return { success: false, error: 'Maximum extensions reached' };
      }

      // Extend session
      session.metadata.extendedCount++;
      session.lastActivity = new Date();

      // Clear existing timeout and warning
      this.clearSessionTimeout(sessionId);
      this.clearTimeoutWarning(sessionId);

      // Set new timeout
      this.setupSessionTimeout(sessionId);

      await this.persistSession(session);

      console.log(`⏰ Session extended: ${sessionId} (${session.metadata.extendedCount}/${this.config.maxSessionExtensions})`);

      return { success: true };

    } catch (error) {
      console.error('Session extension error:', error);
      return { success: false, error: 'Failed to extend session' };
    }
  }

  /**
   * End a session
   */
  async endSession(sessionId: string, reason: string = 'user_logout'): Promise<void> {
    try {
      const session = this.activeSessions.get(sessionId);

      if (session) {
        // Mark as inactive
        session.isActive = false;
        session.deviceInfo.isActive = false;

        // Clear timers
        this.clearSessionTimeout(sessionId);
        this.clearTimeoutWarning(sessionId);

        // Remove from active sessions
        this.activeSessions.delete(sessionId);

        // Update database
        await this.dbService.endGameSession(sessionId);

        console.log(`🚪 Session ended: ${sessionId} (${reason})`);
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  /**
   * End all sessions for a user
   */
  async endUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
    try {
      const userSessions = this.getUserSessions(userId);

      for (const session of userSessions) {
        if (!exceptSessionId || session.id !== exceptSessionId) {
          await this.endSession(session.id, 'user_logout_all');
        }
      }
    } catch (error) {
      console.error('Error ending user sessions:', error);
    }
  }

  /**
   * Get active sessions for a user
   */
  getUserSessions(userId: string): SessionInfo[] {
    return Array.from(this.activeSessions.values())
      .filter(session => session.userId === userId && session.isActive);
  }

  /**
   * Get session info
   */
  getSession(sessionId: string): SessionInfo | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Get all active sessions (admin function)
   */
  getAllActiveSessions(): SessionInfo[] {
    return Array.from(this.activeSessions.values())
      .filter(session => session.isActive);
  }

  /**
   * Check if session is still valid
   */
  isSessionValid(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);

    if (!session || !session.isActive) {
      return false;
    }

    // Check if session has timed out
    const timeoutMinutes = session.userType === 'child'
      ? this.config.childSessionTimeout
      : this.config.parentSessionTimeout;

    const timeSinceActivity = Date.now() - session.lastActivity.getTime();
    const timeoutMs = timeoutMinutes * 60 * 1000;

    return timeSinceActivity < timeoutMs;
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    totalActiveSessions: number;
    parentSessions: number;
    childSessions: number;
    deviceBreakdown: Record<string, number>;
    avgSessionDuration: number;
  } {
    const activeSessions = this.getAllActiveSessions();

    const stats = {
      totalActiveSessions: activeSessions.length,
      parentSessions: activeSessions.filter(s => s.userType === 'parent').length,
      childSessions: activeSessions.filter(s => s.userType === 'child').length,
      deviceBreakdown: {} as Record<string, number>,
      avgSessionDuration: 0
    };

    // Device breakdown
    activeSessions.forEach(session => {
      const deviceType = session.deviceInfo.type;
      stats.deviceBreakdown[deviceType] = (stats.deviceBreakdown[deviceType] || 0) + 1;
    });

    // Average session duration
    if (activeSessions.length > 0) {
      const totalDuration = activeSessions.reduce((sum, session) => {
        return sum + (Date.now() - session.startTime.getTime());
      }, 0);
      stats.avgSessionDuration = totalDuration / activeSessions.length / (1000 * 60); // minutes
    }

    return stats;
  }

  // === PRIVATE METHODS ===

  private setupSessionTimeout(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const timeoutMinutes = session.userType === 'child'
      ? this.config.childSessionTimeout
      : this.config.parentSessionTimeout;

    const warningMs = (timeoutMinutes - this.config.warningThreshold) * 60 * 1000;
    const timeoutMs = timeoutMinutes * 60 * 1000;

    // Set warning timer
    const warningTimer = setTimeout(() => {
      this.triggerTimeoutWarning(sessionId);
    }, warningMs);

    // Set timeout timer
    const timeoutTimer = setTimeout(() => {
      this.handleSessionTimeout(sessionId);
    }, timeoutMs);

    this.timeoutWarnings.set(sessionId, warningTimer);
    this.sessionTimeouts.set(sessionId, timeoutTimer);
  }

  private resetSessionTimeout(sessionId: string): void {
    this.clearSessionTimeout(sessionId);
    this.clearTimeoutWarning(sessionId);
    this.setupSessionTimeout(sessionId);
  }

  private clearSessionTimeout(sessionId: string): void {
    const timer = this.sessionTimeouts.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.sessionTimeouts.delete(sessionId);
    }
  }

  private clearTimeoutWarning(sessionId: string): void {
    const timer = this.timeoutWarnings.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.timeoutWarnings.delete(sessionId);
    }
  }

  private triggerTimeoutWarning(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    session.metadata.timeoutWarnings++;

    // Emit warning event (would integrate with UI notification system)
    this.emitSessionEvent('timeout_warning', {
      sessionId,
      remainingMinutes: this.config.warningThreshold,
      userType: session.userType
    });

    console.log(`⚠️ Session timeout warning: ${sessionId} (${this.config.warningThreshold} minutes remaining)`);
  }

  private async handleSessionTimeout(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    console.log(`⏰ Session timed out: ${sessionId}`);

    // Emit timeout event
    this.emitSessionEvent('session_timeout', {
      sessionId,
      userType: session.userType,
      requiresReauth: this.config.requireReauthAfterTimeout
    });

    await this.endSession(sessionId, 'timeout');
  }

  private emitSessionEvent(eventType: string, data: any): void {
    // This would integrate with an event system (EventEmitter, custom events, etc.)
    // For now, just log
    console.log(`📡 Session Event: ${eventType}`, data);

    // Could dispatch to UI components, analytics, etc.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('session-event', {
        detail: { type: eventType, data }
      }));
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): DeviceInfo {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';

    return {
      id: this.getDeviceId(),
      name: this.getDeviceName(),
      type: this.getDeviceType(),
      browser: this.getBrowserInfo(),
      os: this.getOSInfo(),
      lastActive: new Date(),
      isActive: true,
      userAgent
    };
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('sl_device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sl_device_id', deviceId);
    }
    return deviceId;
  }

  private getDeviceName(): string {
    // Simple device naming based on screen size and user agent
    if (typeof window === 'undefined') return 'Unknown Device';

    const width = window.screen.width;
    const userAgent = navigator.userAgent;

    if (width < 768) return 'Mobile Device';
    if (width < 1024) return 'Tablet Device';
    if (userAgent.includes('Mac')) return 'Mac Computer';
    if (userAgent.includes('Windows')) return 'Windows Computer';
    return 'Desktop Computer';
  }

  private getDeviceType(): DeviceInfo['type'] {
    if (typeof window === 'undefined') return 'unknown';

    const width = window.screen.width;
    const userAgent = navigator.userAgent;

    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return width < 768 ? 'mobile' : 'tablet';
    }

    return 'desktop';
  }

  private getBrowserInfo(): string {
    if (typeof navigator === 'undefined') return 'Unknown';

    const userAgent = navigator.userAgent;

    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';

    return 'Other';
  }

  private getOSInfo(): string {
    if (typeof navigator === 'undefined') return 'Unknown';

    const userAgent = navigator.userAgent;

    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';

    return 'Unknown';
  }

  private getUserPermissions(userType: 'parent' | 'child'): string[] {
    if (userType === 'parent') {
      return [
        'dashboard:view',
        'profiles:manage',
        'progress:view',
        'settings:manage',
        'reports:view',
        'games:manage',
        'child:supervise'
      ];
    } else {
      return [
        'games:play',
        'progress:view-own',
        'achievements:view'
      ];
    }
  }

  private async persistSession(session: SessionInfo): Promise<void> {
    try {
      // Store session data in localStorage for quick access
      const sessionData = {
        ...session,
        lastActivity: session.lastActivity.toISOString(),
        startTime: session.startTime.toISOString()
      };

      localStorage.setItem(`sl_session_${session.id}`, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error persisting session:', error);
    }
  }

  private async loadActiveSessions(): Promise<void> {
    try {
      // Load sessions from localStorage on startup
      const keys = Object.keys(localStorage).filter(key => key.startsWith('sl_session_'));

      for (const key of keys) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key) || '{}');

          if (sessionData.id && sessionData.isActive) {
            const session: SessionInfo = {
              ...sessionData,
              lastActivity: new Date(sessionData.lastActivity),
              startTime: new Date(sessionData.startTime)
            };

            // Check if session is still valid
            if (this.isSessionValid(session.id)) {
              this.activeSessions.set(session.id, session);
              this.setupSessionTimeout(session.id);
            } else {
              // Clean up expired session
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.error('Error loading session:', error);
          localStorage.removeItem(key);
        }
      }

      console.log(`📱 Loaded ${this.activeSessions.size} active sessions`);
    } catch (error) {
      console.error('Error loading active sessions:', error);
    }
  }

  private startHeartbeat(): void {
    // Periodic cleanup and maintenance
    this.heartbeatInterval = setInterval(() => {
      this.performMaintenance();
    }, 60000); // Every minute
  }

  private performMaintenance(): void {
    try {
      // Clean up expired sessions
      const expiredSessions: string[] = [];

      this.activeSessions.forEach((session, sessionId) => {
        if (!this.isSessionValid(sessionId)) {
          expiredSessions.push(sessionId);
        }
      });

      // Remove expired sessions
      expiredSessions.forEach(sessionId => {
        this.endSession(sessionId, 'expired');
      });

      // Clean up localStorage
      this.cleanupLocalStorage();

    } catch (error) {
      console.error('Session maintenance error:', error);
    }
  }

  private cleanupLocalStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('sl_session_'));

      keys.forEach(key => {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key) || '{}');
          const sessionId = sessionData.id;

          if (!sessionId || !this.activeSessions.has(sessionId)) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error cleaning up localStorage:', error);
    }
  }

  /**
   * Cleanup method for shutdown
   */
  destroy(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Clear all timers
    this.timeoutWarnings.forEach(timer => clearTimeout(timer));
    this.sessionTimeouts.forEach(timer => clearTimeout(timer));

    this.timeoutWarnings.clear();
    this.sessionTimeouts.clear();
    this.activeSessions.clear();
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();
export default SessionManager;