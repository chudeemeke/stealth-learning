import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface AuthGuardConfig {
  requireAuth?: boolean;
  requiredPermissions?: string[];
  requiredUserType?: 'parent' | 'child';
  redirectTo?: string;
  onUnauthorized?: () => void;
  showLoading?: boolean;
}

export interface AuthGuardResult {
  isAllowed: boolean;
  isLoading: boolean;
  reason?: string;
  missingPermissions?: string[];
}

/**
 * Hook to guard routes and components based on authentication and permissions
 */
export const useAuthGuard = (config: AuthGuardConfig = {}): AuthGuardResult => {
  const {
    requireAuth = true,
    requiredPermissions = [],
    requiredUserType,
    redirectTo = '/login',
    onUnauthorized,
    showLoading = true
  } = config;

  const auth = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  const result = {
    isAllowed: false,
    isLoading: showLoading && (auth.isLoading || !hasChecked),
    reason: undefined as string | undefined,
    missingPermissions: undefined as string[] | undefined
  };

  useEffect(() => {
    if (!auth.isLoading) {
      setHasChecked(true);
    }
  }, [auth.isLoading]);

  // If still loading, return loading state
  if (result.isLoading) {
    return result;
  }

  // Check authentication requirement
  if (requireAuth && !auth.isAuthenticated) {
    result.reason = 'Authentication required';

    if (onUnauthorized) {
      onUnauthorized();
    }

    return result;
  }

  // Check user type requirement
  if (requiredUserType && auth.userType !== requiredUserType) {
    result.reason = `${requiredUserType} access required`;

    if (onUnauthorized) {
      onUnauthorized();
    }

    return result;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(
      permission => !auth.hasPermission(permission)
    );

    if (missingPermissions.length > 0) {
      result.reason = 'Insufficient permissions';
      result.missingPermissions = missingPermissions;

      if (onUnauthorized) {
        onUnauthorized();
      }

      return result;
    }
  }

  // All checks passed
  result.isAllowed = true;
  return result;
};

/**
 * Hook to protect parent-only routes
 */
export const useParentGuard = (permissions: string[] = []): AuthGuardResult => {
  return useAuthGuard({
    requireAuth: true,
    requiredUserType: 'parent',
    requiredPermissions: permissions
  });
};

/**
 * Hook to protect child-only routes
 */
export const useChildGuard = (permissions: string[] = []): AuthGuardResult => {
  return useAuthGuard({
    requireAuth: true,
    requiredUserType: 'child',
    requiredPermissions: permissions
  });
};

/**
 * Hook to check if user can access dashboard
 */
export const useDashboardGuard = (): AuthGuardResult => {
  return useAuthGuard({
    requireAuth: true,
    requiredUserType: 'parent',
    requiredPermissions: ['dashboard:view']
  });
};

/**
 * Hook to check if user can manage profiles
 */
export const useProfileManagementGuard = (): AuthGuardResult => {
  return useAuthGuard({
    requireAuth: true,
    requiredUserType: 'parent',
    requiredPermissions: ['profiles:manage']
  });
};

/**
 * Hook to check if user can play games
 */
export const useGameplayGuard = (): AuthGuardResult => {
  return useAuthGuard({
    requireAuth: true,
    requiredPermissions: ['games:play']
  });
};

/**
 * Hook to check if user can view reports
 */
export const useReportsGuard = (): AuthGuardResult => {
  return useAuthGuard({
    requireAuth: true,
    requiredUserType: 'parent',
    requiredPermissions: ['reports:view']
  });
};

/**
 * Hook to require specific permission with optional redirect
 */
export const useRequirePermission = (
  permission: string,
  redirectTo?: string
): boolean => {
  const auth = useAuth();
  const hasPermission = auth.hasPermission(permission);

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated && !hasPermission && redirectTo) {
      console.warn(`Missing permission: ${permission}, should redirect to:`, redirectTo);
      // In a real app, you would use React Router to navigate
    }
  }, [auth.isLoading, auth.isAuthenticated, hasPermission, permission, redirectTo]);

  return hasPermission;
};

/**
 * Hook to show different content based on user type
 */
export const useUserTypeContent = <T>(content: {
  parent?: T;
  child?: T;
  guest?: T;
}): T | undefined => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return content.guest;
  }

  return content[auth.userType || 'guest'];
};

/**
 * Hook to track session expiration and show warnings
 */
export const useSessionExpiration = (
  warningThreshold = 300 // 5 minutes
) => {
  const auth = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setShowWarning(false);
      setTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = auth.getTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining <= warningThreshold && remaining > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }

      // Auto-logout when session expires
      if (remaining <= 0) {
        auth.logout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auth, warningThreshold]);

  const extendSession = async () => {
    const extended = await auth.refreshAuth();
    if (extended) {
      setShowWarning(false);
    }
    return extended;
  };

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    showWarning,
    timeRemaining,
    formatTimeRemaining,
    extendSession,
    isExpiringSoon: auth.isSessionExpiringSoon()
  };
};

export default useAuthGuard;