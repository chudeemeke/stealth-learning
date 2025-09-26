/**
 * JWT Authentication Service
 * Secure JWT implementation with refresh tokens, device fingerprinting, and session management
 */

import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';
import { pino } from 'pino';
import { UserModel, IUser, UserType } from '@database/schemas/UserSchema';
import { kmsService } from '@services/KeyManagementService';
import Redis from 'ioredis';

const logger = pino({ name: 'JWTAuthService' });

// Token configuration
const ACCESS_TOKEN_EXPIRE = '15m'; // Short-lived access tokens
const REFRESH_TOKEN_EXPIRE = '7d'; // Longer refresh tokens
const CHILD_SESSION_EXPIRE = '2h'; // Shorter sessions for children
const PARENT_SESSION_EXPIRE = '24h'; // Longer for parents

// JWT Algorithms
const JWT_ALGORITHM = 'RS256'; // RSA with SHA-256

// Token types
export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  PARENT_CONSENT = 'parent_consent',
  DEVICE_VERIFICATION = 'device_verification'
}

// Token payload interfaces
export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  userType: UserType;
  sessionId: string;
  deviceId: string;
  permissions: string[];
  parentId?: string; // For child accounts
  childrenIds?: string[]; // For parent accounts
}

export interface RefreshTokenPayload extends JwtPayload {
  userId: string;
  sessionId: string;
  deviceId: string;
  tokenFamily: string; // For refresh token rotation
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  userType: UserType;
  deviceId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  isActive: boolean;
  refreshTokenFamily: string;
}

// Device fingerprint components
interface DeviceFingerprint {
  userAgent: string;
  acceptLanguage: string;
  acceptEncoding: string;
  screenResolution?: string;
  timezone?: string;
  platform?: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
}

export class JWTAuthService {
  private static instance: JWTAuthService;
  private redis?: Redis;
  private jwtKeyPair?: { publicKey: string; privateKey: string; keyId: string };
  private sessionStore: Map<string, SessionInfo> = new Map();
  private blacklistedTokens: Set<string> = new Set();
  private refreshTokenFamilies: Map<string, string[]> = new Map();

  private constructor() {
    this.initializeService();
  }

  public static getInstance(): JWTAuthService {
    if (!JWTAuthService.instance) {
      JWTAuthService.instance = new JWTAuthService();
    }
    return JWTAuthService.instance;
  }

  /**
   * Initialize the authentication service
   */
  private async initializeService(): Promise<void> {
    try {
      // Initialize Redis for session storage (if available)
      if (process.env.REDIS_URL) {
        this.redis = new Redis(process.env.REDIS_URL);
        logger.info('Redis session store initialized');
      } else {
        logger.warn('Redis not configured, using in-memory session store');
      }

      // Generate or load JWT signing keys
      this.jwtKeyPair = await kmsService.generateJWTKeyPair();
      logger.info('JWT signing keys initialized');

      // Start cleanup intervals
      this.startCleanupIntervals();
    } catch (error) {
      logger.error('Failed to initialize JWT service:', error);
      throw error;
    }
  }

  /**
   * Generate access and refresh tokens for a user
   */
  public async generateTokenPair(
    user: IUser,
    deviceInfo: {
      deviceId: string;
      fingerprint: DeviceFingerprint;
      ipAddress: string;
      userAgent: string;
    }
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    sessionId: string;
  }> {
    // Generate session ID
    const sessionId = crypto.randomUUID();
    const tokenFamily = crypto.randomUUID();

    // Calculate device fingerprint hash
    const deviceFingerprint = this.calculateDeviceFingerprint(deviceInfo.fingerprint);

    // Determine token expiration based on user type
    const isChild = user.userType === UserType.CHILD;
    const accessExpire = isChild ? '5m' : ACCESS_TOKEN_EXPIRE;
    const refreshExpire = isChild ? CHILD_SESSION_EXPIRE : REFRESH_TOKEN_EXPIRE;

    // Create access token payload
    const accessPayload: AccessTokenPayload = {
      userId: user.userId,
      userType: user.userType,
      sessionId,
      deviceId: deviceInfo.deviceId,
      permissions: this.getUserPermissions(user),
      parentId: user.parentId,
      childrenIds: user.childrenIds,
      iss: 'stealth-learning',
      aud: 'stealth-learning-app',
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID()
    };

    // Create refresh token payload
    const refreshPayload: RefreshTokenPayload = {
      userId: user.userId,
      sessionId,
      deviceId: deviceInfo.deviceId,
      tokenFamily,
      iss: 'stealth-learning',
      aud: 'stealth-learning-app',
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID()
    };

    // Sign tokens
    const accessToken = await this.signToken(accessPayload, {
      expiresIn: accessExpire,
      algorithm: JWT_ALGORITHM
    });

    const refreshToken = await this.signToken(refreshPayload, {
      expiresIn: refreshExpire,
      algorithm: JWT_ALGORITHM
    });

    // Create session info
    const sessionInfo: SessionInfo = {
      sessionId,
      userId: user.userId,
      userType: user.userType,
      deviceId: deviceInfo.deviceId,
      deviceFingerprint,
      ipAddress: deviceInfo.ipAddress,
      userAgent: deviceInfo.userAgent,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.parseExpiration(refreshExpire)),
      lastActivity: new Date(),
      isActive: true,
      refreshTokenFamily: tokenFamily
    };

    // Store session
    await this.storeSession(sessionInfo);

    // Store refresh token family
    this.refreshTokenFamilies.set(tokenFamily, [refreshToken]);

    // Update user's trusted devices if new
    await this.updateTrustedDevices(user, deviceInfo);

    // Log authentication event
    await user.logSecurityEvent('login_success', {
      sessionId,
      deviceId: deviceInfo.deviceId,
      ipAddress: deviceInfo.ipAddress
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiration(accessExpire) / 1000,
      sessionId
    };
  }

  /**
   * Verify and decode a token
   */
  public async verifyToken(
    token: string,
    tokenType: TokenType = TokenType.ACCESS
  ): Promise<JwtPayload | null> {
    try {
      // Check if token is blacklisted
      if (await this.isTokenBlacklisted(token)) {
        logger.warn('Attempted use of blacklisted token');
        return null;
      }

      // Verify token signature and expiration
      const decoded = jwt.verify(token, this.jwtKeyPair!.publicKey, {
        algorithms: [JWT_ALGORITHM],
        issuer: 'stealth-learning',
        audience: 'stealth-learning-app'
      }) as JwtPayload;

      // Additional validation based on token type
      if (tokenType === TokenType.ACCESS) {
        const payload = decoded as AccessTokenPayload;

        // Verify session is still active
        const session = await this.getSession(payload.sessionId);
        if (!session || !session.isActive) {
          logger.warn(`Invalid session for token: ${payload.sessionId}`);
          return null;
        }

        // Update last activity
        session.lastActivity = new Date();
        await this.updateSession(session);
      } else if (tokenType === TokenType.REFRESH) {
        const payload = decoded as RefreshTokenPayload;

        // Verify token family for refresh token rotation
        if (!this.isValidRefreshTokenFamily(payload.tokenFamily, token)) {
          logger.warn('Invalid refresh token family - possible token theft');
          await this.revokeTokenFamily(payload.tokenFamily);
          return null;
        }
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.info('Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid token:', error.message);
      } else {
        logger.error('Token verification error:', error);
      }
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  public async refreshAccessToken(
    refreshToken: string,
    deviceFingerprint: DeviceFingerprint
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } | null> {
    // Verify refresh token
    const decoded = await this.verifyToken(refreshToken, TokenType.REFRESH);
    if (!decoded) {
      return null;
    }

    const payload = decoded as RefreshTokenPayload;

    // Get user
    const user = await UserModel.findOne({ userId: payload.userId });
    if (!user) {
      logger.warn(`User not found for refresh token: ${payload.userId}`);
      return null;
    }

    // Verify device fingerprint matches
    const session = await this.getSession(payload.sessionId);
    if (!session) {
      return null;
    }

    const currentFingerprint = this.calculateDeviceFingerprint(deviceFingerprint);
    if (session.deviceFingerprint !== currentFingerprint) {
      logger.warn('Device fingerprint mismatch during token refresh');
      await this.revokeSession(payload.sessionId);
      return null;
    }

    // Generate new token pair (refresh token rotation)
    const newTokenFamily = crypto.randomUUID();

    const newAccessPayload: AccessTokenPayload = {
      userId: user.userId,
      userType: user.userType,
      sessionId: payload.sessionId,
      deviceId: payload.deviceId,
      permissions: this.getUserPermissions(user),
      parentId: user.parentId,
      childrenIds: user.childrenIds,
      iss: 'stealth-learning',
      aud: 'stealth-learning-app',
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID()
    };

    const newRefreshPayload: RefreshTokenPayload = {
      userId: user.userId,
      sessionId: payload.sessionId,
      deviceId: payload.deviceId,
      tokenFamily: newTokenFamily,
      iss: 'stealth-learning',
      aud: 'stealth-learning-app',
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID()
    };

    // Sign new tokens
    const accessExpire = user.userType === UserType.CHILD ? '5m' : ACCESS_TOKEN_EXPIRE;
    const refreshExpire = user.userType === UserType.CHILD ? CHILD_SESSION_EXPIRE : REFRESH_TOKEN_EXPIRE;

    const newAccessToken = await this.signToken(newAccessPayload, {
      expiresIn: accessExpire,
      algorithm: JWT_ALGORITHM
    });

    const newRefreshToken = await this.signToken(newRefreshPayload, {
      expiresIn: refreshExpire,
      algorithm: JWT_ALGORITHM
    });

    // Blacklist old refresh token
    await this.blacklistToken(refreshToken);

    // Update refresh token family
    this.refreshTokenFamilies.set(newTokenFamily, [newRefreshToken]);
    this.refreshTokenFamilies.delete(payload.tokenFamily);

    // Update session
    session.lastActivity = new Date();
    await this.updateSession(session);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: this.parseExpiration(accessExpire) / 1000
    };
  }

  /**
   * Revoke a session and all associated tokens
   */
  public async revokeSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return;
    }

    // Mark session as inactive
    session.isActive = false;
    await this.updateSession(session);

    // Blacklist all tokens for this session
    if (session.refreshTokenFamily) {
      await this.revokeTokenFamily(session.refreshTokenFamily);
    }

    logger.info(`Session revoked: ${sessionId}`);
  }

  /**
   * Revoke all sessions for a user
   */
  public async revokeAllUserSessions(userId: string): Promise<void> {
    // Get all user sessions
    const sessions = await this.getUserSessions(userId);

    // Revoke each session
    for (const session of sessions) {
      await this.revokeSession(session.sessionId);
    }

    logger.info(`All sessions revoked for user: ${userId}`);
  }

  /**
   * Sign a token with the private key
   */
  private async signToken(payload: any, options: SignOptions): Promise<string> {
    if (!this.jwtKeyPair) {
      throw new Error('JWT keys not initialized');
    }

    return jwt.sign(payload, this.jwtKeyPair.privateKey, {
      ...options,
      keyid: this.jwtKeyPair.keyId
    });
  }

  /**
   * Calculate device fingerprint hash
   */
  private calculateDeviceFingerprint(fingerprint: DeviceFingerprint): string {
    const data = JSON.stringify({
      ua: fingerprint.userAgent,
      lang: fingerprint.acceptLanguage,
      enc: fingerprint.acceptEncoding,
      res: fingerprint.screenResolution,
      tz: fingerprint.timezone,
      plat: fingerprint.platform,
      hw: fingerprint.hardwareConcurrency,
      mem: fingerprint.deviceMemory
    });

    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Get user permissions based on role and type
   */
  private getUserPermissions(user: IUser): string[] {
    const permissions: string[] = [];

    // Base permissions by user type
    switch (user.userType) {
      case UserType.CHILD:
        permissions.push('play_games', 'view_progress', 'earn_achievements');
        break;
      case UserType.PARENT:
        permissions.push('view_children', 'manage_children', 'view_reports', 'manage_settings');
        break;
      case UserType.EDUCATOR:
        permissions.push('view_students', 'create_content', 'view_analytics');
        break;
      case UserType.ADMIN:
        permissions.push('manage_users', 'manage_content', 'view_all', 'system_admin');
        break;
    }

    // Add custom permissions
    if (user.permissions.customPermissions) {
      permissions.push(...user.permissions.customPermissions);
    }

    return [...new Set(permissions)]; // Remove duplicates
  }

  /**
   * Store session in Redis or memory
   */
  private async storeSession(session: SessionInfo): Promise<void> {
    if (this.redis) {
      const key = `session:${session.sessionId}`;
      const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
      await this.redis.setex(key, ttl, JSON.stringify(session));
    } else {
      this.sessionStore.set(session.sessionId, session);
    }
  }

  /**
   * Get session from storage
   */
  private async getSession(sessionId: string): Promise<SessionInfo | null> {
    if (this.redis) {
      const data = await this.redis.get(`session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } else {
      return this.sessionStore.get(sessionId) || null;
    }
  }

  /**
   * Update session in storage
   */
  private async updateSession(session: SessionInfo): Promise<void> {
    await this.storeSession(session);
  }

  /**
   * Get all sessions for a user
   */
  private async getUserSessions(userId: string): Promise<SessionInfo[]> {
    const sessions: SessionInfo[] = [];

    if (this.redis) {
      const keys = await this.redis.keys('session:*');
      for (const key of keys) {
        const data = await this.redis.get(key);
        if (data) {
          const session = JSON.parse(data) as SessionInfo;
          if (session.userId === userId) {
            sessions.push(session);
          }
        }
      }
    } else {
      for (const session of this.sessionStore.values()) {
        if (session.userId === userId) {
          sessions.push(session);
        }
      }
    }

    return sessions;
  }

  /**
   * Update user's trusted devices
   */
  private async updateTrustedDevices(
    user: IUser,
    deviceInfo: { deviceId: string; fingerprint: DeviceFingerprint; userAgent: string }
  ): Promise<void> {
    const deviceFingerprint = this.calculateDeviceFingerprint(deviceInfo.fingerprint);

    // Check if device already trusted
    const existingDevice = user.security.trustedDevices?.find(
      d => d.fingerprint === deviceFingerprint
    );

    if (existingDevice) {
      // Update last used
      existingDevice.lastUsed = new Date();
    } else {
      // Add new trusted device
      if (!user.security.trustedDevices) {
        user.security.trustedDevices = [];
      }

      user.security.trustedDevices.push({
        deviceId: deviceInfo.deviceId,
        deviceName: this.parseDeviceName(deviceInfo.userAgent),
        lastUsed: new Date(),
        fingerprint: deviceFingerprint
      });

      // Keep only last 10 devices
      if (user.security.trustedDevices.length > 10) {
        user.security.trustedDevices = user.security.trustedDevices
          .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
          .slice(0, 10);
      }
    }

    await user.save();
  }

  /**
   * Parse device name from user agent
   */
  private parseDeviceName(userAgent: string): string {
    // Simple parsing - can be enhanced
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android Device';
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux PC';
    return 'Unknown Device';
  }

  /**
   * Blacklist a token
   */
  private async blacklistToken(token: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    if (this.redis) {
      // Store in Redis with TTL matching token expiration
      const decoded = jwt.decode(token) as JwtPayload;
      if (decoded?.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await this.redis.setex(`blacklist:${tokenHash}`, ttl, '1');
        }
      }
    } else {
      this.blacklistedTokens.add(tokenHash);
    }
  }

  /**
   * Check if token is blacklisted
   */
  private async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    if (this.redis) {
      const exists = await this.redis.exists(`blacklist:${tokenHash}`);
      return exists === 1;
    } else {
      return this.blacklistedTokens.has(tokenHash);
    }
  }

  /**
   * Check if refresh token family is valid
   */
  private isValidRefreshTokenFamily(tokenFamily: string, token: string): boolean {
    const family = this.refreshTokenFamilies.get(tokenFamily);
    return family ? family.includes(token) : false;
  }

  /**
   * Revoke entire token family (for refresh token theft detection)
   */
  private async revokeTokenFamily(tokenFamily: string): Promise<void> {
    const family = this.refreshTokenFamilies.get(tokenFamily);
    if (family) {
      for (const token of family) {
        await this.blacklistToken(token);
      }
      this.refreshTokenFamilies.delete(tokenFamily);
    }
  }

  /**
   * Parse expiration string to milliseconds
   */
  private parseExpiration(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiration format: ${expiration}`);
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: throw new Error(`Invalid time unit: ${unit}`);
    }
  }

  /**
   * Start cleanup intervals for expired sessions and tokens
   */
  private startCleanupIntervals(): void {
    // Clean up expired sessions every hour
    setInterval(async () => {
      await this.cleanupExpiredSessions();
    }, 3600000);

    // Clean up blacklisted tokens every day
    setInterval(() => {
      this.cleanupBlacklistedTokens();
    }, 86400000);
  }

  /**
   * Clean up expired sessions
   */
  private async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();

    if (this.redis) {
      // Redis handles expiration automatically
      return;
    }

    // Clean in-memory store
    for (const [sessionId, session] of this.sessionStore.entries()) {
      if (session.expiresAt < now) {
        this.sessionStore.delete(sessionId);
      }
    }
  }

  /**
   * Clean up expired blacklisted tokens
   */
  private cleanupBlacklistedTokens(): void {
    if (this.redis) {
      // Redis handles expiration automatically
      return;
    }

    // For in-memory store, we'd need to track expiration times
    // This is simplified - in production, use Redis
    this.blacklistedTokens.clear();
  }
}

// Export singleton instance
export const jwtAuthService = JWTAuthService.getInstance();