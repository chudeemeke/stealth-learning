import CryptoJS from 'crypto-js';

export interface JWTPayload {
  userId: string;
  userType: 'parent' | 'child';
  profileId?: string;
  sessionId: string;
  iat: number; // Issued at
  exp: number; // Expiration
  iss: string; // Issuer
  aud: string; // Audience
  permissions: string[];
  deviceId: string;
  ipAddress?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  refreshExpiresAt: Date;
}

export interface SessionInfo {
  isValid: boolean;
  payload: JWTPayload | null;
  expiresIn: number; // Seconds until expiration
  needsRefresh: boolean;
}

class JWTTokenService {
  private static instance: JWTTokenService;
  private readonly SECRET_KEY: string;
  private readonly REFRESH_SECRET_KEY: string;
  private readonly ISSUER = 'stealth-learning-app';
  private readonly AUDIENCE = 'stealth-learning-users';

  // Token lifespans
  private readonly ACCESS_TOKEN_LIFETIME = 15 * 60; // 15 minutes
  private readonly REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days
  private readonly REFRESH_THRESHOLD = 5 * 60; // Refresh when 5 minutes left

  // Storage keys
  private readonly ACCESS_TOKEN_KEY = 'sl_access_token';
  private readonly REFRESH_TOKEN_KEY = 'sl_refresh_token';
  private readonly SESSION_INFO_KEY = 'sl_session_info';

  constructor() {
    // Generate or retrieve secret keys (in production, these should be from environment)
    this.SECRET_KEY = this.getOrGenerateSecret('sl_jwt_secret');
    this.REFRESH_SECRET_KEY = this.getOrGenerateSecret('sl_refresh_secret');
  }

  static getInstance(): JWTTokenService {
    if (!JWTTokenService.instance) {
      JWTTokenService.instance = new JWTTokenService();
    }
    return JWTTokenService.instance;
  }

  /**
   * Generate a JWT token pair (access + refresh tokens)
   */
  generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'aud'>): TokenPair {
    const now = Math.floor(Date.now() / 1000);
    const deviceId = this.getOrGenerateDeviceId();

    // Create access token payload
    const accessPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + this.ACCESS_TOKEN_LIFETIME,
      iss: this.ISSUER,
      aud: this.AUDIENCE,
      deviceId
    };

    // Create refresh token payload
    const refreshPayload = {
      userId: payload.userId,
      sessionId: payload.sessionId,
      deviceId,
      type: 'refresh',
      iat: now,
      exp: now + this.REFRESH_TOKEN_LIFETIME,
      iss: this.ISSUER,
      aud: this.AUDIENCE
    };

    const accessToken = this.createToken(accessPayload, this.SECRET_KEY);
    const refreshToken = this.createToken(refreshPayload, this.REFRESH_SECRET_KEY);

    return {
      accessToken,
      refreshToken,
      expiresAt: new Date((now + this.ACCESS_TOKEN_LIFETIME) * 1000),
      refreshExpiresAt: new Date((now + this.REFRESH_TOKEN_LIFETIME) * 1000)
    };
  }

  /**
   * Validate and decode a JWT token
   */
  validateToken(token: string): { isValid: boolean; payload: JWTPayload | null } {
    try {
      const payload = this.verifyToken(token, this.SECRET_KEY);

      if (!payload || typeof payload !== 'object') {
        return { isValid: false, payload: null };
      }

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return { isValid: false, payload: null };
      }

      // Validate issuer and audience
      if (payload.iss !== this.ISSUER || payload.aud !== this.AUDIENCE) {
        return { isValid: false, payload: null };
      }

      return { isValid: true, payload: payload as JWTPayload };
    } catch (error) {
      console.error('Token validation failed:', error);
      return { isValid: false, payload: null };
    }
  }

  /**
   * Refresh an access token using a refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
    try {
      const refreshPayload = this.verifyToken(refreshToken, this.REFRESH_SECRET_KEY);

      if (!refreshPayload || refreshPayload.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      // Check refresh token expiration
      const now = Math.floor(Date.now() / 1000);
      if (refreshPayload.exp && refreshPayload.exp < now) {
        throw new Error('Refresh token expired');
      }

      // Get current user session info
      const currentSession = this.getCurrentSession();
      if (!currentSession.isValid || !currentSession.payload) {
        throw new Error('No valid session found');
      }

      // Generate new token pair with existing payload
      const newTokenPair = this.generateTokenPair({
        userId: currentSession.payload.userId,
        userType: currentSession.payload.userType,
        profileId: currentSession.payload.profileId,
        sessionId: currentSession.payload.sessionId,
        permissions: currentSession.payload.permissions,
        deviceId: currentSession.payload.deviceId,
        ipAddress: currentSession.payload.ipAddress
      });

      // Store new tokens
      this.storeTokenPair(newTokenPair);

      return newTokenPair;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Get current session information
   */
  getCurrentSession(): SessionInfo {
    const accessToken = this.getStoredAccessToken();

    if (!accessToken) {
      return {
        isValid: false,
        payload: null,
        expiresIn: 0,
        needsRefresh: false
      };
    }

    const validation = this.validateToken(accessToken);

    if (!validation.isValid || !validation.payload) {
      return {
        isValid: false,
        payload: null,
        expiresIn: 0,
        needsRefresh: true
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = validation.payload.exp - now;
    const needsRefresh = expiresIn <= this.REFRESH_THRESHOLD;

    return {
      isValid: true,
      payload: validation.payload,
      expiresIn,
      needsRefresh
    };
  }

  /**
   * Store token pair securely
   */
  storeTokenPair(tokenPair: TokenPair): void {
    try {
      const encryptedAccessToken = this.encryptData(tokenPair.accessToken);
      const encryptedRefreshToken = this.encryptData(tokenPair.refreshToken);

      localStorage.setItem(this.ACCESS_TOKEN_KEY, encryptedAccessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, encryptedRefreshToken);

      // Store session metadata
      const sessionInfo = {
        expiresAt: tokenPair.expiresAt.toISOString(),
        refreshExpiresAt: tokenPair.refreshExpiresAt.toISOString(),
        storedAt: new Date().toISOString()
      };

      localStorage.setItem(this.SESSION_INFO_KEY, JSON.stringify(sessionInfo));
    } catch (error) {
      console.error('Failed to store token pair:', error);
      throw new Error('Token storage failed');
    }
  }

  /**
   * Get stored access token
   */
  getStoredAccessToken(): string | null {
    try {
      const encryptedToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!encryptedToken) return null;

      return this.decryptData(encryptedToken);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  getStoredRefreshToken(): string | null {
    try {
      const encryptedToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      if (!encryptedToken) return null;

      return this.decryptData(encryptedToken);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  /**
   * Clear all session data
   */
  clearSession(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.SESSION_INFO_KEY);
  }

  /**
   * Check if auto-refresh is needed and perform it
   */
  async checkAndRefreshToken(): Promise<boolean> {
    const session = this.getCurrentSession();

    if (!session.needsRefresh) {
      return session.isValid;
    }

    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      this.clearSession();
      return false;
    }

    const newTokenPair = await this.refreshAccessToken(refreshToken);
    return newTokenPair !== null;
  }

  /**
   * Generate authentication headers for API calls
   */
  getAuthHeaders(): Record<string, string> {
    const accessToken = this.getStoredAccessToken();

    if (!accessToken) {
      return {};
    }

    return {
      'Authorization': `Bearer ${accessToken}`,
      'X-Device-ID': this.getOrGenerateDeviceId()
    };
  }

  /**
   * Validate user permissions
   */
  hasPermission(permission: string): boolean {
    const session = this.getCurrentSession();

    if (!session.isValid || !session.payload) {
      return false;
    }

    return session.payload.permissions.includes(permission) ||
           session.payload.permissions.includes('*'); // Admin permission
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

  // === PRIVATE METHODS ===

  private createToken(payload: any, secret: string): string {
    // Simple JWT implementation using base64 encoding and HMAC signature
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));

    const signature = CryptoJS.HmacSHA256(
      `${encodedHeader}.${encodedPayload}`,
      secret
    ).toString(CryptoJS.enc.Base64url);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private verifyToken(token: string, secret: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [header, payload, signature] = parts;

    // Verify signature
    const expectedSignature = CryptoJS.HmacSHA256(
      `${header}.${payload}`,
      secret
    ).toString(CryptoJS.enc.Base64url);

    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }

    // Decode payload
    return JSON.parse(this.base64UrlDecode(payload));
  }

  private base64UrlEncode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    str += new Array(5 - str.length % 4).join('=');
    return atob(str.replace(/\-/g, '+').replace(/_/g, '/'));
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
  }

  private decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private getOrGenerateSecret(key: string): string {
    let secret = localStorage.getItem(key);
    if (!secret) {
      secret = CryptoJS.lib.WordArray.random(256/8).toString();
      localStorage.setItem(key, secret);
    }
    return secret;
  }

  private getOrGenerateDeviceId(): string {
    let deviceId = localStorage.getItem('sl_device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sl_device_id', deviceId);
    }
    return deviceId;
  }
}

// Export singleton instance
export const jwtService = JWTTokenService.getInstance();
export default JWTTokenService;