import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, AuthResult, SessionData } from '../services/auth/AuthenticationService';
import type { User, ParentProfile, ChildProfile } from '../services/database/schema';

export interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  profile: ParentProfile | ChildProfile | null;
  userType: 'parent' | 'child' | null;
  permissions: string[];
  sessionId: string | null;
  expiresAt: Date | null;

  // Authentication methods
  loginParent: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  loginChild: (profileId: string, avatarPin?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  switchProfile: (profileId: string) => Promise<AuthResult>;
  refreshAuth: () => Promise<boolean>;

  // Permission helpers
  hasPermission: (permission: string) => boolean;
  canAccessDashboard: () => boolean;
  canManageProfiles: () => boolean;
  canPlayGames: () => boolean;
  canViewReports: () => boolean;

  // Session helpers
  getTimeRemaining: () => number;
  isSessionExpiringSoon: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ParentProfile | ChildProfile | null>(null);
  const [userType, setUserType] = useState<'parent' | 'child' | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  // Session refresh interval
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  /**
   * Initialize authentication state on app start
   */
  useEffect(() => {
    initializeAuth();
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  /**
   * Monitor session expiration
   */
  useEffect(() => {
    if (isAuthenticated && expiresAt) {
      startSessionMonitoring();
    } else {
      stopSessionMonitoring();
    }

    return () => stopSessionMonitoring();
  }, [isAuthenticated, expiresAt]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Check if user has valid session
      const isValid = await authService.validateSession();

      if (isValid) {
        await updateAuthState();
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  };

  const updateAuthState = async () => {
    try {
      const session = authService.getCurrentSession();
      const currentUser = authService.getCurrentUser();

      if (!session.isAuthenticated || !currentUser) {
        clearAuthState();
        return;
      }

      // Set session data
      setIsAuthenticated(true);
      setUserType(session.userType);
      setPermissions(session.permissions);
      setSessionId(session.sessionId);
      setExpiresAt(session.expiresAt);

      // Note: In a real implementation, you might want to fetch
      // full user and profile data from the database here
      // For now, we'll set minimal data
      setUser(null); // Would fetch from DB using currentUser.userId
      setProfile(null); // Would fetch from DB using currentUser.profileId

    } catch (error) {
      console.error('Error updating auth state:', error);
      clearAuthState();
    }
  };

  const clearAuthState = () => {
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
    setUserType(null);
    setPermissions([]);
    setSessionId(null);
    setExpiresAt(null);
  };

  const startSessionMonitoring = () => {
    stopSessionMonitoring(); // Clear any existing interval

    const interval = setInterval(async () => {
      if (isSessionExpiringSoon()) {
        console.log('📱 Session expiring soon, attempting refresh...');
        const refreshed = await refreshAuth();

        if (!refreshed) {
          console.warn('⚠️ Session refresh failed, logging out...');
          await logout();
        }
      }
    }, 30000); // Check every 30 seconds

    setRefreshInterval(interval);
  };

  const stopSessionMonitoring = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  };

  // === AUTHENTICATION METHODS ===

  const loginParent = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      const result = await authService.loginParent({
        type: 'parent',
        email,
        password,
        rememberMe
      });

      if (result.success) {
        setUser(result.user || null);
        setProfile(result.profile || null);
        await updateAuthState();
      }

      return result;
    } catch (error) {
      console.error('Parent login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginChild = async (
    profileId: string,
    avatarPin?: string
  ): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      const result = await authService.loginChild({
        type: 'child',
        profileId,
        avatarPin
      });

      if (result.success) {
        setUser(result.user || null);
        setProfile(result.profile || null);
        await updateAuthState();
      }

      return result;
    } catch (error) {
      console.error('Child login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      clearAuthState();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state anyway
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  };

  const switchProfile = async (profileId: string): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      const result = await authService.switchChildProfile(profileId);

      if (result.success) {
        setUser(result.user || null);
        setProfile(result.profile || null);
        await updateAuthState();
      }

      return result;
    } catch (error) {
      console.error('Profile switch error:', error);
      return {
        success: false,
        error: 'Failed to switch profile.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const refreshed = await authService.refreshAuthentication();

      if (refreshed) {
        await updateAuthState();
      } else {
        clearAuthState();
      }

      return refreshed;
    } catch (error) {
      console.error('Auth refresh error:', error);
      clearAuthState();
      return false;
    }
  };

  // === PERMISSION HELPERS ===

  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission);
  };

  const canAccessDashboard = (): boolean => {
    return hasPermission('dashboard:view');
  };

  const canManageProfiles = (): boolean => {
    return hasPermission('profiles:manage');
  };

  const canPlayGames = (): boolean => {
    return hasPermission('games:play');
  };

  const canViewReports = (): boolean => {
    return hasPermission('reports:view');
  };

  // === SESSION HELPERS ===

  const getTimeRemaining = (): number => {
    if (!expiresAt) return 0;

    const now = new Date().getTime();
    const expires = expiresAt.getTime();
    const remaining = Math.max(0, expires - now);

    return Math.floor(remaining / 1000); // Return seconds
  };

  const isSessionExpiringSoon = (): boolean => {
    const timeRemaining = getTimeRemaining();
    return timeRemaining > 0 && timeRemaining <= 300; // 5 minutes
  };

  const contextValue: AuthContextType = {
    // State
    isAuthenticated,
    isLoading,
    user,
    profile,
    userType,
    permissions,
    sessionId,
    expiresAt,

    // Methods
    loginParent,
    loginChild,
    logout,
    switchProfile,
    refreshAuth,

    // Permission helpers
    hasPermission,
    canAccessDashboard,
    canManageProfiles,
    canPlayGames,
    canViewReports,

    // Session helpers
    getTimeRemaining,
    isSessionExpiringSoon
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

/**
 * Hook to require authentication (redirects if not authenticated)
 */
export const useRequireAuth = (redirectTo = '/login') => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // In a real app, you would use React Router to navigate
      console.warn('User not authenticated, should redirect to:', redirectTo);
    }
  }, [auth.isAuthenticated, auth.isLoading, redirectTo]);

  return auth;
};

/**
 * Hook to check specific permissions
 */
export const usePermission = (permission: string) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};

export default AuthContext;