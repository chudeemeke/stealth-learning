/**
 * Authentication Router
 * Handles user registration, login, and session management
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import { UserModel, UserType } from '@database/schemas/UserSchema';
import { jwtAuthService } from '@auth/JWTAuthService';
import { parentVerificationService } from '@services/ParentVerificationService';
import { kmsService } from '@services/KeyManagementService';
import {
  AppError,
  ValidationError,
  AuthenticationError,
  ConflictError,
  COPPAError,
  asyncHandler
} from '@middleware/errorHandler';
import { authMiddleware, optionalAuthMiddleware } from '@middleware/authMiddleware';
import { pino } from 'pino';

const logger = pino({ name: 'AuthRouter' });
const router = Router();

/**
 * POST /api/auth/register/parent
 * Register a new parent account
 */
router.post('/register/parent',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().optional(),
    body('dateOfBirth').isISO8601(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Invalid input data');
    }

    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    // Check if parent is old enough
    const age = Math.floor(
      (Date.now() - new Date(dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    if (age < 18) {
      throw new ValidationError('Must be 18 or older to create a parent account');
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create parent account
    const parent = new UserModel({
      userId: crypto.randomUUID(),
      userType: UserType.PARENT,
      email,
      password,
      username: email.split('@')[0] + '_' + crypto.randomBytes(3).toString('hex'),
      profile: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        preferredLanguage: req.body.preferredLanguage || 'en',
        timezone: req.body.timezone || 'UTC'
      },
      coppa: {
        requiresConsent: false,
        parentVerified: true,
        verificationDate: new Date()
      },
      security: {
        emailVerified: false,
        emailVerificationToken: crypto.randomUUID()
      }
    });

    await parent.save();

    // Send verification email
    // await emailService.sendVerificationEmail(parent.email, parent.security.emailVerificationToken);

    // Generate tokens
    const deviceInfo = {
      deviceId: crypto.randomUUID(),
      fingerprint: {
        userAgent: req.headers['user-agent'] || '',
        acceptLanguage: req.headers['accept-language'] || '',
        acceptEncoding: req.headers['accept-encoding'] || ''
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || ''
    };

    const tokens = await jwtAuthService.generateTokenPair(parent, deviceInfo);

    logger.info(`Parent account created: ${parent.userId}`);

    res.status(201).json({
      success: true,
      message: 'Parent account created successfully',
      data: {
        userId: parent.userId,
        email: parent.email,
        username: parent.username,
        ...tokens
      }
    });
  })
);

/**
 * POST /api/auth/register/child
 * Register a new child account (requires parent authentication)
 */
router.post('/register/child',
  authMiddleware,
  [
    body('firstName').trim().notEmpty(),
    body('age').isInt({ min: 3, max: 18 }),
    body('pin').optional().isLength({ min: 4, max: 6 }).isNumeric(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    // Validate parent
    if (req.user.userType !== UserType.PARENT) {
      throw new AuthenticationError('Only parents can create child accounts');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Invalid input data');
    }

    const { firstName, age, pin, avatar } = req.body;

    // Check if child requires COPPA consent
    const requiresConsent = age < 13;

    // Generate unique username for child
    const username = `${firstName.toLowerCase()}_${crypto.randomBytes(4).toString('hex')}`;

    // Create child account
    const child = new UserModel({
      userId: crypto.randomUUID(),
      userType: UserType.CHILD,
      username,
      pin,
      profile: {
        firstName,
        age,
        avatar: avatar || '🦁',
        preferredLanguage: req.body.preferredLanguage || 'en',
        timezone: req.user.profile.timezone
      },
      parentId: req.user.userId,
      coppa: {
        requiresConsent,
        consentStatus: requiresConsent ? 'granted' : 'not_required',
        consentDate: new Date(),
        parentVerified: true,
        verificationDate: new Date(),
        dataCollectionSettings: {
          allowAnalytics: false,
          allowProgressTracking: true,
          allowAchievements: true,
          allowCommunication: false
        }
      }
    });

    await child.save();

    // Add child to parent's children list
    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $push: { childrenIds: child.userId } }
    );

    logger.info(`Child account created: ${child.userId} for parent: ${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: 'Child account created successfully',
      data: {
        userId: child.userId,
        username: child.username,
        firstName: child.profile.firstName,
        age: child.profile.age
      }
    });
  })
);

/**
 * POST /api/auth/login
 * Login for both parents and children
 */
router.post('/login',
  [
    body('username').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional(),
    body('pin').optional()
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, pin } = req.body;

    let user;

    // Find user by email or username
    if (email) {
      user = await UserModel.findOne({ email });
    } else if (username) {
      user = await UserModel.findOne({ username });
    } else {
      throw new ValidationError('Username or email required');
    }

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked()) {
      throw new AuthenticationError('Account is locked due to too many failed attempts');
    }

    // Verify credentials based on user type
    let isValidCredentials = false;

    if (user.userType === UserType.CHILD) {
      // Children use PIN
      if (!pin) {
        throw new ValidationError('PIN required for child login');
      }
      isValidCredentials = await user.comparePin(pin);
    } else {
      // Parents use password
      if (!password) {
        throw new ValidationError('Password required for parent login');
      }
      isValidCredentials = await user.comparePassword(password);
    }

    if (!isValidCredentials) {
      // Increment failed login attempts
      await user.incrementLoginAttempts();
      throw new AuthenticationError('Invalid credentials');
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.activity.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const deviceInfo = {
      deviceId: req.body.deviceId || crypto.randomUUID(),
      fingerprint: {
        userAgent: req.headers['user-agent'] || '',
        acceptLanguage: req.headers['accept-language'] || '',
        acceptEncoding: req.headers['accept-encoding'] || '',
        screenResolution: req.body.screenResolution,
        timezone: req.body.timezone,
        platform: req.body.platform
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || ''
    };

    const tokens = await jwtAuthService.generateTokenPair(user, deviceInfo);

    // Log successful login
    await user.logSecurityEvent('login_success', {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    logger.info(`User logged in: ${user.userId} (${user.userType})`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.userId,
        userType: user.userType,
        username: user.username,
        profile: {
          firstName: user.profile.firstName,
          avatar: user.profile.avatar
        },
        ...tokens
      }
    });
  })
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token required');
    }

    const deviceFingerprint = {
      userAgent: req.headers['user-agent'] || '',
      acceptLanguage: req.headers['accept-language'] || '',
      acceptEncoding: req.headers['accept-encoding'] || '',
      screenResolution: req.body.screenResolution,
      timezone: req.body.timezone,
      platform: req.body.platform
    };

    const tokens = await jwtAuthService.refreshAccessToken(refreshToken, deviceFingerprint);

    if (!tokens) {
      throw new AuthenticationError('Invalid refresh token');
    }

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    });
  })
);

/**
 * POST /api/auth/logout
 * Logout and revoke session
 */
router.post('/logout',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req;

    if (sessionId) {
      await jwtAuthService.revokeSession(sessionId);
    }

    // Log logout event
    await req.user.logSecurityEvent('logout', {
      sessionId,
      ipAddress: req.ip
    });

    logger.info(`User logged out: ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  })
);

/**
 * POST /api/auth/logout-all
 * Logout from all devices
 */
router.post('/logout-all',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    await jwtAuthService.revokeAllUserSessions(req.user.userId);

    // Log security event
    await req.user.logSecurityEvent('logout_all_devices', {
      ipAddress: req.ip
    });

    logger.info(`All sessions revoked for user: ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  })
);

/**
 * GET /api/auth/verify-email/:token
 * Verify email address
 */
router.get('/verify-email/:token',
  asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;

    const user = await UserModel.findOne({
      'security.emailVerificationToken': token
    });

    if (!user) {
      throw new ValidationError('Invalid verification token');
    }

    user.security.emailVerified = true;
    user.security.emailVerifiedAt = new Date();
    user.security.emailVerificationToken = undefined;
    await user.save();

    logger.info(`Email verified for user: ${user.userId}`);

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  })
);

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password',
  [
    body('email').isEmail().normalizeEmail()
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      // Generate reset token
      const resetToken = user.generatePasswordResetToken();
      await user.save();

      // Send reset email
      // await emailService.sendPasswordResetEmail(email, resetToken);

      logger.info(`Password reset requested for: ${user.userId}`);
    }

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  })
);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const user = await UserModel.findOne({
      'security.passwordResetToken': token,
      'security.passwordResetExpires': { $gt: new Date() }
    });

    if (!user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Check if password was used before
    for (const oldHash of user.security.passwordHistory || []) {
      const isOldPassword = await user.comparePassword(password);
      if (isOldPassword) {
        throw new ValidationError('Password was used recently. Please choose a different password.');
      }
    }

    // Update password
    user.password = password;
    user.security.passwordResetToken = undefined;
    user.security.passwordResetExpires = undefined;
    await user.save();

    // Log security event
    await user.logSecurityEvent('password_reset', {
      ipAddress: req.ip
    });

    logger.info(`Password reset for user: ${user.userId}`);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  })
);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ userId: req.user.userId })
      .select('-password -pin -security.mfaSecret -security.passwordHistory')
      .lean();

    res.json({
      success: true,
      data: user
    });
  })
);

export default router;