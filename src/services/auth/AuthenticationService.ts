import { DatabaseService } from '../database/DatabaseService';
import { jwtService, JWTPayload, TokenPair } from './JWTService';
import { ultraJWT } from '@/services/security/UltraJWTService';
import { inputValidator } from '@/services/security/InputValidationService';
import { coppaService } from '@/services/compliance/COPPAService';
import type { User, ParentProfile, ChildProfile } from '../database/schema';
import type { DifficultyLevel } from '../../types';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ParentLoginCredentials extends LoginCredentials {
  type: 'parent';
}

export interface ChildLoginCredentials {
  type: 'child';
  profileId: string;
  avatarPin?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  profile?: ParentProfile | ChildProfile;
  tokenPair?: TokenPair;
  error?: string;
  requiresSetup?: boolean;
}

export interface SessionData {
  isAuthenticated: boolean;
  user: User | null;
  profile: ParentProfile | ChildProfile | null;
  userType: 'parent' | 'child' | null;
  permissions: string[];
  sessionId: string | null;
  expiresAt: Date | null;
}

class AuthenticationService {
  private static instance: AuthenticationService;
  private dbService: DatabaseService;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private readonly SESSION_CHECK_INTERVAL = 60000; // Check every minute

  constructor() {
    this.dbService = DatabaseService.getInstance();
    this.startSessionMonitoring();
  }

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  /**
   * Authenticate parent user with email and password
   */
  async loginParent(credentials: ParentLoginCredentials): Promise<AuthResult> {
    try {
      console.log(`🔐 Attempting ultra-secure parent login for: ${credentials.email}`);

      // 🔒 ULTRA-SECURE: Validate input before processing
      const emailValidation = inputValidator.validateEmail(credentials.email);
      if (!emailValidation.isValid) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      const authValidation = inputValidator.validateAuthentication({
        email: emailValidation.sanitized!,
        password: credentials.password
      });

      if (!authValidation.isValid) {
        return {
          success: false,
          error: authValidation.errors.join(', ')
        };
      }

      // Authenticate user with ultra-secure database service
      const authResult = await this.dbService.authenticateUser(
        emailValidation.sanitized!,
        credentials.password
      );

      if (!authResult.success || !authResult.user) {
        return {
          success: false,
          error: authResult.error || 'Authentication failed'
        };
      }

      // Get parent profile
      const parentProfile = await this.dbService.getParentProfile(authResult.user.id);
      if (!parentProfile) {
        return {
          success: false,
          error: 'Parent profile not found',
          requiresSetup: true
        };
      }

      // Generate session and tokens
      const sessionId = this.generateSessionId();
      const permissions = this.getParentPermissions(parentProfile);

      const tokenPair = jwtService.generateTokenPair({
        userId: authResult.user.id,
        userType: 'parent',
        sessionId,
        permissions,
        deviceId: '', // Will be set by JWT service
        ipAddress: await this.getClientIP()
      });

      // Store session in database
      await this.dbService.createGameSession({
        id: sessionId,
        userId: authResult.user.id,
        profileId: parentProfile.id,
        gameId: 'parent-dashboard',
        gameContentId: '', // Not applicable for parent sessions
        startTime: new Date(),
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        hintsUsed: 0,
        timeElapsed: 0,
        answers: [],
        isCompleted: false,
        isPaused: false,
        status: 'active',
        settings: {
          sessionType: 'parent-dashboard',
          rememberMe: credentials.rememberMe || false
        },
        metadata: {
          difficulty: 'easy' as DifficultyLevel,
          averageResponseTime: 0,
          streakCount: 0,
          mistakePattern: []
        }
      });

      // Store tokens securely
      jwtService.storeTokenPair(tokenPair);

      console.log(`✅ Parent login successful for: ${credentials.email}`);

      return {
        success: true,
        user: authResult.user,
        profile: parentProfile,
        tokenPair
      };

    } catch (error) {
      console.error('Parent login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Authenticate child user with profile and optional PIN
   */
  async loginChild(credentials: ChildLoginCredentials): Promise<AuthResult> {
    try {
      console.log(`🔐 Attempting child login for profile: ${credentials.profileId}`);

      // Get child profile
      const childProfile = await this.dbService.getChildProfile(credentials.profileId);
      if (!childProfile) {
        return {
          success: false,
          error: 'Child profile not found'
        };
      }

      // Verify PIN if required
      if (childProfile.avatarPin && credentials.avatarPin) {
        const pinValid = await this.dbService.verifyChildPin(
          credentials.profileId,
          credentials.avatarPin
        );

        if (!pinValid) {
          return {
            success: false,
            error: 'Invalid PIN'
          };
        }
      }

      // Get parent user for session context
      const parentUser = await this.dbService.getUser(childProfile.userId);
      if (!parentUser) {
        return {
          success: false,
          error: 'Parent account not found'
        };
      }

      // Check parental controls
      const isAllowed = await this.checkParentalControls(childProfile);
      if (!isAllowed.allowed) {
        return {
          success: false,
          error: isAllowed.reason || 'Access restricted by parental controls'
        };
      }

      // Generate session and tokens
      const sessionId = this.generateSessionId();
      const permissions = this.getChildPermissions(childProfile);

      const tokenPair = jwtService.generateTokenPair({
        userId: parentUser.id,
        userType: 'child',
        profileId: childProfile.id,
        sessionId,
        permissions,
        deviceId: '', // Will be set by JWT service
        ipAddress: await this.getClientIP()
      });

      // Store session in database
      await this.dbService.createGameSession({
        id: sessionId,
        userId: parentUser.id,
        profileId: childProfile.id,
        gameId: 'child-session',
        gameContentId: '', // Will be set when starting a game
        startTime: new Date(),
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        hintsUsed: 0,
        timeElapsed: 0,
        answers: [],
        isCompleted: false,
        isPaused: false,
        status: 'active',
        settings: {
          sessionType: 'child-gameplay',
          ageGroup: childProfile.ageGroup,
          maxDuration: childProfile.parentalControls.dailyTimeLimit
        },
        metadata: {
          difficulty: 'easy' as DifficultyLevel,
          averageResponseTime: 0,
          streakCount: 0,
          mistakePattern: []
        }
      });

      // Store tokens securely
      jwtService.storeTokenPair(tokenPair);

      console.log(`✅ Child login successful for profile: ${childProfile.name}`);

      return {
        success: true,
        user: parentUser,
        profile: childProfile,
        tokenPair
      };

    } catch (error) {
      console.error('Child login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Logout current user and clear session
   */
  async logout(): Promise<void> {
    try {
      const currentSession = this.getCurrentSession();

      if (currentSession.sessionId) {
        // Update session status in database
        await this.dbService.endGameSession(currentSession.sessionId);
      }

      // Clear JWT tokens and session data
      jwtService.clearSession();

      console.log('✅ User logged out successfully');

    } catch (error) {
      console.error('Logout error:', error);
      // Clear tokens anyway
      jwtService.clearSession();
    }
  }

  /**
   * Get current session data
   */
  getCurrentSession(): SessionData {
    const jwtSession = jwtService.getCurrentSession();

    if (!jwtSession.isValid || !jwtSession.payload) {
      return {
        isAuthenticated: false,
        user: null,
        profile: null,
        userType: null,
        permissions: [],
        sessionId: null,
        expiresAt: null
      };
    }

    return {
      isAuthenticated: true,
      user: null, // Will be populated by calling code if needed
      profile: null, // Will be populated by calling code if needed
      userType: jwtSession.payload.userType,
      permissions: jwtSession.payload.permissions,
      sessionId: jwtSession.payload.sessionId,
      expiresAt: new Date(jwtSession.payload.exp * 1000)
    };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentSession().isAuthenticated;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    return jwtService.hasPermission(permission);
  }

  /**
   * Get current user information
   */
  getCurrentUser(): { userId: string; userType: 'parent' | 'child'; profileId?: string } | null {
    return jwtService.getCurrentUser();
  }

  /**
   * Refresh authentication token
   */
  async refreshAuthentication(): Promise<boolean> {
    return await jwtService.checkAndRefreshToken();
  }

  /**
   * Switch child profile (for parent users)
   */
  async switchChildProfile(profileId: string): Promise<AuthResult> {
    const currentSession = this.getCurrentSession();

    if (!currentSession.isAuthenticated || currentSession.userType !== 'parent') {
      return {
        success: false,
        error: 'Must be logged in as parent to switch profiles'
      };
    }

    try {
      // End current session
      if (currentSession.sessionId) {
        await this.dbService.endGameSession(currentSession.sessionId);
      }

      // Start new child session
      return await this.loginChild({
        type: 'child',
        profileId
      });

    } catch (error) {
      console.error('Profile switch error:', error);
      return {
        success: false,
        error: 'Failed to switch profile'
      };
    }
  }

  /**
   * Check session validity and handle automatic refresh
   */
  async validateSession(): Promise<boolean> {
    try {
      const isValid = await jwtService.checkAndRefreshToken();

      if (!isValid) {
        // Session is invalid, logout user
        await this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      await this.logout();
      return false;
    }
  }

  /**
   * Start monitoring session for automatic refresh and expiration
   */
  private startSessionMonitoring(): void {
    this.sessionCheckInterval = setInterval(async () => {
      if (this.isAuthenticated()) {
        await this.validateSession();
      }
    }, this.SESSION_CHECK_INTERVAL);
  }

  /**
   * Stop session monitoring
   */
  stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  // === PRIVATE METHODS ===

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getParentPermissions(profile: ParentProfile): string[] {
    return [
      'dashboard:view',
      'profiles:manage',
      'progress:view',
      'settings:manage',
      'reports:view',
      'games:manage',
      'child:supervise'
    ];
  }

  private getChildPermissions(profile: ChildProfile): string[] {
    const basePermissions = [
      'games:play',
      'progress:view-own',
      'achievements:view'
    ];

    // Add subject-specific permissions based on allowed subjects
    profile.parentalControls.allowedSubjects.forEach(subject => {
      basePermissions.push(`games:play:${subject}`);
    });

    return basePermissions;
  }

  private async checkParentalControls(profile: ChildProfile): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Check daily time limit
      const todayUsage = await this.dbService.getDailyUsage(profile.id);
      const timeLimit = profile.parentalControls.dailyTimeLimit * 60; // Convert to seconds

      if (todayUsage >= timeLimit) {
        return {
          allowed: false,
          reason: 'Daily time limit exceeded'
        };
      }

      // Check if current time is within allowed hours (if implemented)
      const currentHour = new Date().getHours();
      // Add time-based restrictions if needed

      return { allowed: true };

    } catch (error) {
      console.error('Error checking parental controls:', error);
      return {
        allowed: false,
        reason: 'Unable to verify parental controls'
      };
    }
  }

  private async getClientIP(): Promise<string | undefined> {
    try {
      // In a real app, this would get the actual client IP
      // For now, return undefined
      return undefined;
    } catch {
      return undefined;
    }
  }
}

// Export singleton instance
export const authService = AuthenticationService.getInstance();
export default AuthenticationService;