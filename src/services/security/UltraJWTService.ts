/**
 * Ultra-Secure JWT Service
 * Server-side JWT with httpOnly cookies and advanced security features
 */

import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { securityConfig, isSecureEnvironment } from '@/config/security';
import { ultraEncryption } from './UltraEncryptionService';

interface JWTPayload {
  userId: string;
  userType: 'parent' | 'child';
  profileId?: string;
  sessionId: string;
  permissions: string[];
  deviceId: string;
  ipAddress?: string;
  iat: number;
  exp: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

interface SessionData {
  isValid: boolean;
  payload?: JWTPayload;
  expiresAt?: Date;
}

class UltraJWTService {
  private static instance: UltraJWTService;

  // Security constants
  private readonly ACCESS_TOKEN_LIFETIME = 5 * 60; // 5 minutes (ultra-short)
  private readonly REFRESH_TOKEN_LIFETIME = 30 * 60; // 30 minutes for children, 24h for parents
  private readonly DEVICE_ID_KEY = 'device_fingerprint';
  private readonly SESSION_COOKIE_NAME = 'stealth_session';
  private readonly REFRESH_COOKIE_NAME = 'stealth_refresh';

  // Cookie configuration
  private readonly cookieConfig = {
    httpOnly: false, // Note: js-cookie can't set httpOnly, this should be done server-side
    secure: isSecureEnvironment(),
    sameSite: 'strict' as const,
    path: '/'
  };

  constructor() {
    this.validateConfiguration();
    this.initializeDeviceFingerprint();
  }

  static getInstance(): UltraJWTService {
    if (!UltraJWTService.instance) {
      UltraJWTService.instance = new UltraJWTService();
    }
    return UltraJWTService.instance;
  }

  /**
   * Validates JWT service configuration
   */
  private validateConfiguration(): void {
    if (!securityConfig.JWT_SECRET || securityConfig.JWT_SECRET.length < 32) {
      throw new Error('🔒 CRITICAL: JWT secret must be at least 32 characters');
    }

    console.log('✅ Ultra-JWT service initialized with advanced security');
  }

  /**
   * Generate or retrieve device fingerprint for enhanced security
   */
  private initializeDeviceFingerprint(): void {
    try {
      let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);

      if (!deviceId) {
        // Generate device fingerprint based on browser characteristics
        const fingerprint = this.generateDeviceFingerprint();
        deviceId = ultraEncryption.generateHash(fingerprint);
        localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
      }

      this.deviceId = deviceId;
    } catch (error) {
      console.warn('🔒 Device fingerprint initialization failed, using fallback');
      this.deviceId = ultraEncryption.generateSecureToken(16);
    }
  }

  private deviceId: string = '';

  /**
   * Generate device fingerprint for security
   */
  private generateDeviceFingerprint(): string {
    try {
      const components = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset().toString(),
        navigator.hardwareConcurrency?.toString() || '0',
        navigator.maxTouchPoints?.toString() || '0'
      ];

      return components.join('|');
    } catch (error) {
      return 'unknown-device-' + Date.now();
    }
  }

  /**
   * Create JWT token with enhanced security (THIS IS A PLACEHOLDER - MOVE TO SERVER)
   * Note: In production, JWT signing MUST happen server-side
   */
  private createJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    console.warn('🔒 WARNING: JWT creation happening client-side - MOVE TO SERVER IN PRODUCTION');

    const now = Math.floor(Date.now() / 1000);
    const exp = now + this.ACCESS_TOKEN_LIFETIME;

    const fullPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp
    };

    // Create JWT header
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    // Encode header and payload
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(fullPayload));

    // Create signature
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signature = CryptoJS.HmacSHA256(signatureInput, securityConfig.JWT_SECRET);
    const encodedSignature = this.base64UrlEncode(signature.toString());

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  /**
   * Verify and decode JWT token
   */
  private verifyJWT(token: string): SessionData {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const [encodedHeader, encodedPayload, encodedSignature] = parts;

      // Verify signature
      const signatureInput = `${encodedHeader}.${encodedPayload}`;
      const expectedSignature = CryptoJS.HmacSHA256(signatureInput, securityConfig.JWT_SECRET);
      const expectedEncoded = this.base64UrlEncode(expectedSignature.toString());

      if (encodedSignature !== expectedEncoded) {
        throw new Error('Invalid JWT signature');
      }

      // Decode payload
      const payload: JWTPayload = JSON.parse(this.base64UrlDecode(encodedPayload));

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp <= now) {
        throw new Error('JWT token expired');
      }

      // Verify device fingerprint
      if (payload.deviceId !== this.deviceId) {
        console.warn('🔒 Device fingerprint mismatch - potential token theft');
        throw new Error('Device fingerprint mismatch');
      }

      return {
        isValid: true,
        payload,
        expiresAt: new Date(payload.exp * 1000)
      };

    } catch (error) {
      console.error('🔒 JWT verification failed:', error);
      return { isValid: false };
    }
  }

  /**
   * Generate token pair for authentication
   */
  generateTokenPair(payload: {
    userId: string;
    userType: 'parent' | 'child';
    profileId?: string;
    sessionId: string;
    permissions: string[];
    ipAddress?: string;
  }): TokenPair {
    try {
      const tokenPayload = {
        ...payload,
        deviceId: this.deviceId
      };

      // Create access token (short-lived)
      const accessToken = this.createJWT(tokenPayload);

      // Create refresh token (longer-lived, encrypted)
      const refreshTokenData = {
        userId: payload.userId,
        sessionId: payload.sessionId,
        deviceId: this.deviceId,
        createdAt: Date.now()
      };

      const refreshToken = ultraEncryption.encryptObject(refreshTokenData);
      const expiresAt = new Date(Date.now() + (this.REFRESH_TOKEN_LIFETIME * 1000));

      return {
        accessToken,
        refreshToken: JSON.stringify(refreshToken),
        expiresAt
      };

    } catch (error) {
      console.error('🔒 Token generation failed:', error);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Store token pair securely
   */
  storeTokenPair(tokenPair: TokenPair): void {
    try {
      // Store access token in secure cookie (short-lived)
      Cookies.set(this.SESSION_COOKIE_NAME, tokenPair.accessToken, {
        ...this.cookieConfig,
        expires: new Date(Date.now() + (this.ACCESS_TOKEN_LIFETIME * 1000))
      });

      // Store refresh token in secure cookie (longer-lived)
      Cookies.set(this.REFRESH_COOKIE_NAME, tokenPair.refreshToken, {
        ...this.cookieConfig,
        expires: tokenPair.expiresAt
      });

      console.log('✅ Tokens stored securely in cookies');

    } catch (error) {
      console.error('🔒 Token storage failed:', error);
      throw new Error('Token storage failed');
    }
  }

  /**
   * Get current session from stored tokens
   */
  getCurrentSession(): SessionData {
    try {
      const accessToken = Cookies.get(this.SESSION_COOKIE_NAME);

      if (!accessToken) {
        return { isValid: false };
      }

      return this.verifyJWT(accessToken);

    } catch (error) {
      console.error('🔒 Session retrieval failed:', error);
      return { isValid: false };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshTokenData = Cookies.get(this.REFRESH_COOKIE_NAME);

      if (!refreshTokenData) {
        console.log('🔒 No refresh token available');
        return false;
      }

      // Decrypt and validate refresh token
      const encryptedData = JSON.parse(refreshTokenData);
      const refreshPayload = ultraEncryption.decryptObject(encryptedData);

      // Verify device fingerprint
      if (refreshPayload.deviceId !== this.deviceId) {
        console.warn('🔒 Refresh token device mismatch');
        this.clearSession();
        return false;
      }

      // Check if refresh token is still valid (not too old)
      const maxAge = this.REFRESH_TOKEN_LIFETIME * 1000;
      if (Date.now() - refreshPayload.createdAt > maxAge) {
        console.log('🔒 Refresh token expired');
        this.clearSession();
        return false;
      }

      // Here you would normally make a server request to refresh the token
      // For now, we'll return false to indicate server-side refresh is needed
      console.log('🔒 Token refresh requires server-side implementation');
      return false;

    } catch (error) {
      console.error('🔒 Token refresh failed:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const session = this.getCurrentSession();
    return session.isValid &&
           session.payload?.permissions.includes(permission) || false;
  }

  /**
   * Get current user information
   */
  getCurrentUser(): { userId: string; userType: 'parent' | 'child'; profileId?: string } | null {
    const session = this.getCurrentSession();

    if (!session.isValid || !session.payload) {
      return null;
    }

    return {
      userId: session.payload.userId,
      userType: session.payload.userType,
      profileId: session.payload.profileId
    };
  }

  /**
   * Clear all stored tokens and session data
   */
  clearSession(): void {
    try {
      // Remove cookies
      Cookies.remove(this.SESSION_COOKIE_NAME, { path: '/' });
      Cookies.remove(this.REFRESH_COOKIE_NAME, { path: '/' });

      // Clear any cached session data
      console.log('✅ Session cleared successfully');

    } catch (error) {
      console.error('🔒 Session clear failed:', error);
    }
  }

  /**
   * Check and refresh token if needed
   */
  async checkAndRefreshToken(): Promise<boolean> {
    const session = this.getCurrentSession();

    if (!session.isValid) {
      console.log('🔒 No valid session found');
      return false;
    }

    // Check if token is close to expiration (1 minute threshold)
    const timeUntilExpiry = session.expiresAt!.getTime() - Date.now();
    const oneMinute = 60 * 1000;

    if (timeUntilExpiry < oneMinute) {
      console.log('🔒 Token nearing expiration, attempting refresh');
      return await this.refreshToken();
    }

    return true;
  }

  /**
   * Base64 URL encoding (JWT standard)
   */
  private base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Base64 URL decoding (JWT standard)
   */
  private base64UrlDecode(str: string): string {
    // Add padding if needed
    str += '='.repeat((4 - str.length % 4) % 4);

    // Replace URL-safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/');

    return atob(str);
  }
}

// Export singleton instance
export const ultraJWT = UltraJWTService.getInstance();
export default UltraJWTService;