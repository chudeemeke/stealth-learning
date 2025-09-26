/**
 * Security Configuration Wrapper
 * This file wraps the emergency security patch to maintain API compatibility
 * while removing all hardcoded secrets and vulnerable configurations
 */

import { emergencySecurityConfig, isFeatureEnabled, getSafeDefaults } from './security-emergency-patch';

// Generate secure random strings for client-side only operations
// These are NOT real secrets - they're placeholders for client-side operations
// Real authentication must be done server-side
function generateClientSideKey(purpose: string, length: number): string {
  // Use crypto API if available
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    // Convert to base64 for use as key (not real security, just for compatibility)
    return btoa(String.fromCharCode(...array))
      .substring(0, length)
      .replace(/[^a-zA-Z0-9]/g, 'X'); // Replace non-alphanumeric for safety
  }

  // Fallback for environments without crypto
  // This is intentionally weak - real security requires backend
  const warning = `CLIENT_SIDE_PLACEHOLDER_${purpose}_NOT_SECURE`;
  return warning.padEnd(length, '_').substring(0, length);
}

// Create compatibility interface matching original SecurityConfig
interface LegacySecurityConfig {
  API_URL: string;
  API_TIMEOUT: number;
  ENCRYPTION_KEY: string;
  JWT_SECRET: string;
  PEPPER_SECRET: string;
  APP_ENVIRONMENT: 'development' | 'staging' | 'production';
  ENABLE_ANALYTICS: boolean;
  ENABLE_DEBUG_MODE: boolean;
  ENABLE_SOURCE_MAPS: boolean;
  ENABLE_PARENTAL_VERIFICATION: boolean;
  DATA_RETENTION_DAYS: number;
  CSP_ENABLED: boolean;
  SECURE_COOKIES: boolean;
}

/**
 * Create legacy-compatible configuration from emergency patch
 * This maintains API compatibility while removing vulnerabilities
 */
function createCompatibleConfig(): LegacySecurityConfig {
  const emergency = emergencySecurityConfig;
  const defaults = getSafeDefaults();

  // Log security status
  if (emergency.FEATURES.SHOW_SECURITY_WARNING) {
    console.warn('🔒 SECURITY NOTICE:', emergency.SECURITY_STATUS.message);
  }

  return {
    // API Configuration
    API_URL: emergency.API_URL || 'https://api.placeholder.local',
    API_TIMEOUT: emergency.API_TIMEOUT,

    // Client-side only placeholders (NOT real security)
    // These are only used for local storage encryption, not authentication
    ENCRYPTION_KEY: generateClientSideKey('ENCRYPTION', 32),
    JWT_SECRET: generateClientSideKey('JWT', 32),
    PEPPER_SECRET: generateClientSideKey('PEPPER', 64),

    // Environment
    APP_ENVIRONMENT: emergency.APP_ENVIRONMENT,

    // Feature flags
    ENABLE_ANALYTICS: false, // Always false for COPPA compliance
    ENABLE_DEBUG_MODE: emergency.APP_ENVIRONMENT === 'development',
    ENABLE_SOURCE_MAPS: false, // Always false for security
    ENABLE_PARENTAL_VERIFICATION: emergency.FEATURES.ENABLE_PARENT_DASHBOARD,

    // Data policies
    DATA_RETENTION_DAYS: defaults.dataRetentionDays,

    // Security features
    CSP_ENABLED: true,
    SECURE_COOKIES: emergency.IS_SECURE,
  };
}

// Export compatible configuration
export const securityConfig = createCompatibleConfig();

/**
 * Check if we're in a secure environment
 * Now based on emergency config's IS_SECURE flag
 */
export const isSecureEnvironment = (): boolean => {
  return emergencySecurityConfig.IS_SECURE;
};

/**
 * Get Content Security Policy directives
 * Enhanced for better security
 */
export const getCSPDirectives = (): string => {
  if (!securityConfig.CSP_ENABLED) return '';

  // More restrictive CSP for better security
  const basePolicy = [
    "default-src 'self'",
    "script-src 'self'", // Removed 'unsafe-inline' for better security
    "style-src 'self' 'unsafe-inline'", // Still needed for Tailwind
    "img-src 'self' data: https:",
    "font-src 'self' data: https:",
    "connect-src 'self'", // Only allow same-origin connections
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests", // Force HTTPS
    "block-all-mixed-content" // Block HTTP content on HTTPS pages
  ];

  // Add API URL if configured
  if (emergencySecurityConfig.API_URL) {
    const connectSrc = basePolicy.find(p => p.startsWith('connect-src'));
    if (connectSrc) {
      const index = basePolicy.indexOf(connectSrc);
      basePolicy[index] = `connect-src 'self' ${emergencySecurityConfig.API_URL}`;
    }
  }

  return basePolicy.join('; ');
};

/**
 * Export emergency config utilities for components that need them
 */
export { isFeatureEnabled, getSafeDefaults, getSecurityWarningBanner } from './security-emergency-patch';
export { emergencySecurityConfig } from './security-emergency-patch';

// Show critical warning in console
if (emergencySecurityConfig.SECURITY_STATUS.level === 'CRITICAL') {
  console.error(
    '%c⚠️ CRITICAL SECURITY WARNING ⚠️',
    'color: white; background: red; font-size: 20px; padding: 10px;',
    '\n\nThis application is running without proper backend authentication.\n' +
    'DO NOT enter real personal information.\n' +
    'This is for demonstration purposes only.\n\n' +
    'A secure backend service is required for production use.'
  );
}

export default securityConfig;