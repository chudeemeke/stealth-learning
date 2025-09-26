/**
 * User Schema - Comprehensive user model with security and COPPA compliance
 */

import mongoose, { Document, Schema } from 'mongoose';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

// User types
export enum UserType {
  PARENT = 'parent',
  CHILD = 'child',
  EDUCATOR = 'educator',
  ADMIN = 'admin'
}

// COPPA consent status
export enum ConsentStatus {
  PENDING = 'pending',
  GRANTED = 'granted',
  DENIED = 'denied',
  REVOKED = 'revoked'
}

// Security event types
export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_LOCKED = 'account_locked',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled'
}

// Parent verification methods
export enum VerificationMethod {
  EMAIL = 'email',
  CREDIT_CARD = 'credit_card',
  GOVERNMENT_ID = 'government_id',
  PHONE_SMS = 'phone_sms',
  VIDEO_CALL = 'video_call'
}

// Interface for TypeScript type safety
export interface IUser extends Document {
  userId: string;
  userType: UserType;
  email?: string; // Optional for children
  username: string;
  password?: string; // Hashed, optional for children who use PIN
  pin?: string; // Hashed PIN for child accounts

  // Profile information
  profile: {
    firstName: string;
    lastName?: string; // Optional for children
    dateOfBirth?: Date;
    age?: number;
    avatar?: string;
    preferredLanguage: string;
    timezone: string;
  };

  // Parent-Child relationships
  parentId?: string; // For child accounts
  childrenIds?: string[]; // For parent accounts

  // COPPA compliance
  coppa: {
    requiresConsent: boolean;
    consentStatus: ConsentStatus;
    consentDate?: Date;
    consentMethod?: VerificationMethod;
    parentVerified: boolean;
    verificationDate?: Date;
    verificationMethod?: VerificationMethod;
    verificationToken?: string;
    dataCollectionSettings: {
      allowAnalytics: boolean;
      allowProgressTracking: boolean;
      allowAchievements: boolean;
      allowCommunication: boolean;
    };
  };

  // Security features
  security: {
    mfaEnabled: boolean;
    mfaSecret?: string;
    backupCodes?: string[];
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    emailVerificationToken?: string;
    emailVerified: boolean;
    emailVerifiedAt?: Date;
    loginAttempts: number;
    lockUntil?: Date;
    lastPasswordChange: Date;
    passwordHistory: string[]; // Store last 5 password hashes
    trustedDevices: Array<{
      deviceId: string;
      deviceName: string;
      lastUsed: Date;
      fingerprint: string;
    }>;
    sessions: Array<{
      sessionId: string;
      deviceId: string;
      ipAddress: string;
      userAgent: string;
      createdAt: Date;
      expiresAt: Date;
      isActive: boolean;
    }>;
  };

  // Permissions and restrictions
  permissions: {
    canCreateContent: boolean;
    canModerateContent: boolean;
    canAccessAnalytics: boolean;
    canManageUsers: boolean;
    customPermissions: string[];
  };

  // Activity tracking
  activity: {
    lastLogin?: Date;
    lastActivity?: Date;
    totalPlayTime: number; // in minutes
    consecutiveDays: number;
    longestStreak: number;
    createdAt: Date;
    updatedAt: Date;
  };

  // Security events log
  securityEvents: Array<{
    eventType: SecurityEventType;
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    details?: string;
  }>;

  // Data retention and privacy
  privacy: {
    dataRetentionConsent: boolean;
    marketingConsent: boolean;
    thirdPartyConsent: boolean;
    deletionRequested: boolean;
    deletionRequestDate?: Date;
    anonymizationDate?: Date;
  };

  // Subscription and billing (for parents)
  subscription?: {
    plan: 'free' | 'basic' | 'premium' | 'family';
    status: 'active' | 'canceled' | 'suspended' | 'expired';
    startDate: Date;
    endDate?: Date;
    autoRenew: boolean;
    paymentMethod?: string; // Encrypted payment method ID
    billingAddress?: {
      country: string;
      state?: string;
      postalCode: string;
    };
  };

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  comparePin(candidatePin: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  generateEmailVerificationToken(): string;
  generateMFABackupCodes(): string[];
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  hasPermission(permission: string): boolean;
  logSecurityEvent(eventType: SecurityEventType, details?: any): Promise<void>;
  anonymizeData(): Promise<void>;
}

// Create the schema
const UserSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
    index: true
  },
  userType: {
    type: String,
    enum: Object.values(UserType),
    required: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allow null for child accounts
    lowercase: true,
    trim: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  password: {
    type: String,
    minlength: 8
  },
  pin: {
    type: String,
    minlength: 4,
    maxlength: 6
  },

  // Profile subdocument
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    dateOfBirth: Date,
    age: Number,
    avatar: String,
    preferredLanguage: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },

  // Parent-Child relationships
  parentId: {
    type: String,
    index: true
  },
  childrenIds: [{
    type: String
  }],

  // COPPA compliance subdocument
  coppa: {
    requiresConsent: {
      type: Boolean,
      default: false
    },
    consentStatus: {
      type: String,
      enum: Object.values(ConsentStatus),
      default: ConsentStatus.PENDING
    },
    consentDate: Date,
    consentMethod: {
      type: String,
      enum: Object.values(VerificationMethod)
    },
    parentVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    verificationMethod: {
      type: String,
      enum: Object.values(VerificationMethod)
    },
    verificationToken: String,
    dataCollectionSettings: {
      allowAnalytics: { type: Boolean, default: false },
      allowProgressTracking: { type: Boolean, default: true },
      allowAchievements: { type: Boolean, default: true },
      allowCommunication: { type: Boolean, default: false }
    }
  },

  // Security subdocument
  security: {
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: String,
    backupCodes: [String],
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    lastPasswordChange: { type: Date, default: Date.now },
    passwordHistory: [String],
    trustedDevices: [{
      deviceId: String,
      deviceName: String,
      lastUsed: Date,
      fingerprint: String
    }],
    sessions: [{
      sessionId: String,
      deviceId: String,
      ipAddress: String,
      userAgent: String,
      createdAt: Date,
      expiresAt: Date,
      isActive: Boolean
    }]
  },

  // Permissions subdocument
  permissions: {
    canCreateContent: { type: Boolean, default: false },
    canModerateContent: { type: Boolean, default: false },
    canAccessAnalytics: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    customPermissions: [String]
  },

  // Activity tracking
  activity: {
    lastLogin: Date,
    lastActivity: Date,
    totalPlayTime: { type: Number, default: 0 },
    consecutiveDays: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },

  // Security events
  securityEvents: [{
    eventType: {
      type: String,
      enum: Object.values(SecurityEventType)
    },
    timestamp: Date,
    ipAddress: String,
    userAgent: String,
    details: String
  }],

  // Privacy settings
  privacy: {
    dataRetentionConsent: { type: Boolean, default: true },
    marketingConsent: { type: Boolean, default: false },
    thirdPartyConsent: { type: Boolean, default: false },
    deletionRequested: { type: Boolean, default: false },
    deletionRequestDate: Date,
    anonymizationDate: Date
  },

  // Subscription (optional)
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'family'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'suspended', 'expired'],
      default: 'active'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: { type: Boolean, default: true },
    paymentMethod: String,
    billingAddress: {
      country: String,
      state: String,
      postalCode: String
    }
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Indexes for performance
UserSchema.index({ 'activity.lastLogin': -1 });
UserSchema.index({ 'security.emailVerified': 1 });
UserSchema.index({ 'coppa.parentVerified': 1 });
UserSchema.index({ userType: 1, 'activity.createdAt': -1 });

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockUntil && this.security.lockUntil > new Date());
});

// Pre-save middleware for password hashing
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') && !this.isModified('pin')) {
    return next();
  }

  try {
    // Hash password if modified
    if (this.isModified('password') && this.password) {
      const hashedPassword = await argon2.hash(this.password);

      // Add to password history
      if (!this.security.passwordHistory) {
        this.security.passwordHistory = [];
      }
      this.security.passwordHistory.unshift(hashedPassword);
      this.security.passwordHistory = this.security.passwordHistory.slice(0, 5);

      this.password = hashedPassword;
      this.security.lastPasswordChange = new Date();
    }

    // Hash PIN if modified (for child accounts)
    if (this.isModified('pin') && this.pin) {
      this.pin = await argon2.hash(this.pin);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return argon2.verify(this.password, candidatePassword);
};

// Method to compare PIN
UserSchema.methods.comparePin = async function(candidatePin: string): Promise<boolean> {
  if (!this.pin) return false;
  return argon2.verify(this.pin, candidatePin);
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function(): string {
  const token = uuidv4();
  this.security.passwordResetToken = token;
  this.security.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
  return token;
};

// Method to generate email verification token
UserSchema.methods.generateEmailVerificationToken = function(): string {
  const token = uuidv4();
  this.security.emailVerificationToken = token;
  return token;
};

// Method to generate MFA backup codes
UserSchema.methods.generateMFABackupCodes = function(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(uuidv4().substring(0, 8).toUpperCase());
  }
  this.security.backupCodes = codes.map(code => argon2.hashSync(code));
  return codes;
};

// Method to check if account is locked
UserSchema.methods.isLocked = function(): boolean {
  return !!(this.security.lockUntil && this.security.lockUntil > new Date());
};

// Method to increment login attempts
UserSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  // Reset attempts if lock has expired
  if (this.security.lockUntil && this.security.lockUntil < new Date()) {
    this.security.loginAttempts = 1;
    this.security.lockUntil = undefined;
  } else {
    this.security.loginAttempts += 1;

    // Lock account after 5 failed attempts
    if (this.security.loginAttempts >= 5 && !this.security.lockUntil) {
      this.security.lockUntil = new Date(Date.now() + 3600000); // 1 hour lock
      await this.logSecurityEvent(SecurityEventType.ACCOUNT_LOCKED);
    }
  }
  await this.save();
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  this.security.loginAttempts = 0;
  this.security.lockUntil = undefined;
  await this.save();
};

// Method to check permissions
UserSchema.methods.hasPermission = function(permission: string): boolean {
  return this.permissions.customPermissions.includes(permission);
};

// Method to log security events
UserSchema.methods.logSecurityEvent = async function(
  eventType: SecurityEventType,
  details?: any
): Promise<void> {
  this.securityEvents.push({
    eventType,
    timestamp: new Date(),
    ipAddress: details?.ipAddress,
    userAgent: details?.userAgent,
    details: JSON.stringify(details)
  });

  // Keep only last 100 events
  if (this.securityEvents.length > 100) {
    this.securityEvents = this.securityEvents.slice(-100);
  }

  await this.save();
};

// Method to anonymize user data (GDPR/COPPA compliance)
UserSchema.methods.anonymizeData = async function(): Promise<void> {
  this.email = `deleted_${this.userId}@anonymized.local`;
  this.username = `deleted_user_${this.userId}`;
  this.profile.firstName = 'Deleted';
  this.profile.lastName = 'User';
  this.profile.dateOfBirth = undefined;
  this.password = undefined;
  this.pin = undefined;
  this.security = {} as any;
  this.privacy.anonymizationDate = new Date();
  await this.save();
};

// Create and export the model
export const UserModel = mongoose.model<IUser>('User', UserSchema);