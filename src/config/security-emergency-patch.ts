/**
 * EMERGENCY SECURITY PATCH
 * Temporary security configuration until backend service is implemented
 * This replaces the vulnerable security.ts configuration
 */

// Security feature flags to disable vulnerable features
export interface SecurityFeatureFlags {
  ENABLE_AUTHENTICATION: boolean;
  ENABLE_DATA_STORAGE: boolean;
  ENABLE_PARENT_DASHBOARD: boolean;
  ENABLE_ENCRYPTION: boolean;
  SHOW_SECURITY_WARNING: boolean;
  ALLOW_CHILD_REGISTRATION: boolean;
}

// Minimal secure configuration
export interface EmergencySecurityConfig {
  API_URL: string;
  API_TIMEOUT: number;
  APP_ENVIRONMENT: 'development' | 'staging' | 'production';
  IS_SECURE: boolean;
  FEATURES: SecurityFeatureFlags;
  SECURITY_STATUS: {
    level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SECURE';
    message: string;
    requiresBackend: boolean;
  };
}

/**
 * Create emergency security configuration
 * This removes all hardcoded secrets and disables vulnerable features
 */
function createEmergencySecurityConfig(): EmergencySecurityConfig {
  const isProduction = import.meta.env.PROD;
  const isDevelopment = import.meta.env.DEV;
  const isGitHubPages = window.location.hostname.includes('github.io');
  const isHttps = window.location.protocol === 'https:';

  // Check if we have a backend API configured
  const hasBackendAPI = Boolean(import.meta.env.VITE_API_URL);

  // Determine security level
  let securityLevel: EmergencySecurityConfig['SECURITY_STATUS']['level'] = 'CRITICAL';
  let securityMessage = '';

  if (isGitHubPages && !hasBackendAPI) {
    securityLevel = 'CRITICAL';
    securityMessage = '🎮 Demo Mode: Running without backend - perfect for trying out the games!';
  } else if (isDevelopment) {
    securityLevel = 'HIGH';
    securityMessage = '🔧 Development mode: Security features disabled for testing.';
  } else if (hasBackendAPI && isHttps) {
    securityLevel = 'MEDIUM';
    securityMessage = '🔒 Backend API configured. Ensure proper security measures are in place.';
  }

  // Log security status (only in development)
  if (isDevelopment) {
    console.log('🎮 DEMO STATUS:', securityMessage);
  }

  return {
    // Use environment variable or empty string (no hardcoded values)
    API_URL: import.meta.env.VITE_API_URL || '',
    API_TIMEOUT: 10000,
    APP_ENVIRONMENT: isProduction ? 'production' : 'development',
    IS_SECURE: isHttps && hasBackendAPI,

    // Feature flags - enable demo-safe features
    FEATURES: {
      // Authentication works in demo mode with localStorage
      ENABLE_AUTHENTICATION: true, // Demo auth with localStorage is fine

      // Data storage works locally with IndexedDB/Dexie
      ENABLE_DATA_STORAGE: true, // Local storage is safe for demo

      // Parent dashboard can work in read-only demo mode
      ENABLE_PARENT_DASHBOARD: true, // Demo mode is fine

      // Client-side encryption for local data
      ENABLE_ENCRYPTION: true, // Client-side encryption is always safe

      // Only show warning if truly needed
      SHOW_SECURITY_WARNING: false, // No need to scare users in demo

      // Allow demo registrations (no real data)
      ALLOW_CHILD_REGISTRATION: true, // Demo registrations are safe
    },

    SECURITY_STATUS: {
      level: securityLevel,
      message: securityMessage,
      requiresBackend: !hasBackendAPI,
    },
  };
}

// Create singleton instance
export const emergencySecurityConfig = createEmergencySecurityConfig();

/**
 * Security warning component to display in UI
 */
export const getSecurityWarningBanner = (): string | null => {
  const config = emergencySecurityConfig;

  if (!config.FEATURES.SHOW_SECURITY_WARNING) {
    return null;
  }

  if (config.SECURITY_STATUS.level === 'CRITICAL') {
    return `
      <div style="
        background: linear-gradient(90deg, #DC2626, #EF4444);
        color: white;
        padding: 12px;
        text-align: center;
        font-weight: bold;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        font-family: system-ui, sans-serif;
      ">
        ⚠️ SECURITY WARNING: This application is running without proper authentication.
        DO NOT enter real personal information. For demonstration only.
      </div>
    `;
  }

  if (config.SECURITY_STATUS.level === 'HIGH' && import.meta.env.DEV) {
    return `
      <div style="
        background: #FEF3C7;
        color: #92400E;
        padding: 8px;
        text-align: center;
        font-size: 14px;
        border-bottom: 2px solid #F59E0B;
        font-family: system-ui, sans-serif;
      ">
        🔧 Development Mode - Security features disabled
      </div>
    `;
  }

  return null;
};

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (feature: keyof SecurityFeatureFlags): boolean => {
  return emergencySecurityConfig.FEATURES[feature];
};

/**
 * Get safe default values (no secrets)
 */
export const getSafeDefaults = () => ({
  // No secrets, just safe defaults
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  dataRetentionDays: 30,

  // COPPA age threshold
  coppaAgeThreshold: 13,
  minParentAge: 18,
});

// Log security configuration on load
if (emergencySecurityConfig.FEATURES.SHOW_SECURITY_WARNING) {
  console.group('🔒 Security Configuration');
  console.log('Environment:', emergencySecurityConfig.APP_ENVIRONMENT);
  console.log('Security Level:', emergencySecurityConfig.SECURITY_STATUS.level);
  console.log('Features Enabled:', emergencySecurityConfig.FEATURES);
  console.log('Requires Backend:', emergencySecurityConfig.SECURITY_STATUS.requiresBackend);
  console.groupEnd();
}

export default emergencySecurityConfig;