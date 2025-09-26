/**
 * Authentication Middleware
 * Validates JWT tokens and enforces authentication
 */

import { Request, Response, NextFunction } from 'express';
import { jwtAuthService } from '@auth/JWTAuthService';
import { UserModel } from '@database/schemas/UserSchema';
import { pino } from 'pino';

const logger = pino({ name: 'AuthMiddleware' });

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
      sessionId?: string;
      deviceId?: string;
    }
  }
}

/**
 * Main authentication middleware
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No valid authentication token provided'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    req.token = token;

    // Verify token
    const decoded = await jwtAuthService.verifyToken(token);
    if (!decoded) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
      return;
    }

    // Get user from database
    const user = await UserModel.findOne({ userId: decoded.userId })
      .select('-password -pin -security.mfaSecret')
      .lean();

    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
      return;
    }

    // Check if user account is active
    if (user.privacy?.deletionRequested) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Account has been deleted'
      });
      return;
    }

    // Attach user to request
    req.user = user;
    req.sessionId = decoded.sessionId;
    req.deviceId = decoded.deviceId;

    // Log access
    logger.info({
      userId: user.userId,
      userType: user.userType,
      endpoint: req.path,
      method: req.method
    }, 'Authenticated request');

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
}

/**
 * Parent-only authentication middleware
 */
export async function parentAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authMiddleware(req, res, () => {
    if (req.user?.userType !== 'parent') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'This endpoint requires parent authentication'
      });
      return;
    }
    next();
  });
}

/**
 * Child-only authentication middleware
 */
export async function childAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authMiddleware(req, res, () => {
    if (req.user?.userType !== 'child') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'This endpoint requires child authentication'
      });
      return;
    }
    next();
  });
}

/**
 * Admin-only authentication middleware
 */
export async function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  await authMiddleware(req, res, () => {
    if (req.user?.userType !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'This endpoint requires admin authentication'
      });
      return;
    }
    next();
  });
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = await jwtAuthService.verifyToken(token);

    if (decoded) {
      const user = await UserModel.findOne({ userId: decoded.userId })
        .select('-password -pin -security.mfaSecret')
        .lean();

      if (user) {
        req.user = user;
        req.sessionId = decoded.sessionId;
        req.deviceId = decoded.deviceId;
      }
    }

    next();
  } catch (error) {
    // Don't fail on error, just continue without user
    next();
  }
}

/**
 * Permission-based middleware
 */
export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
      return;
    }

    const hasPermission = req.user.permissions?.customPermissions?.includes(permission);

    if (!hasPermission) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Missing required permission: ${permission}`
      });
      return;
    }

    next();
  };
}

/**
 * COPPA compliance middleware - ensures parent verification for children
 */
export async function coppaComplianceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    next();
    return;
  }

  // Check if user is a child
  if (req.user.userType === 'child') {
    // Check if parent verification is required and completed
    if (req.user.coppa?.requiresConsent && !req.user.coppa?.parentVerified) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Parent verification required for this action',
        code: 'COPPA_VERIFICATION_REQUIRED'
      });
      return;
    }

    // Check specific data collection permissions
    const endpoint = req.path.toLowerCase();
    const method = req.method.toUpperCase();

    // Restrict certain actions based on parent consent settings
    const settings = req.user.coppa?.dataCollectionSettings;
    if (settings) {
      if (endpoint.includes('analytics') && !settings.allowAnalytics) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Parent has not consented to analytics data collection'
        });
        return;
      }

      if (endpoint.includes('communication') && !settings.allowCommunication) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Parent has not consented to communication features'
        });
        return;
      }
    }
  }

  next();
}