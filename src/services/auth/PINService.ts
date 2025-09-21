import { DatabaseService } from '../database/DatabaseService';
import { EncryptionService } from '../database/DatabaseService';
import type { ChildProfile } from '../database/schema';

export interface PINAttempt {
  profileId: string;
  pin: string;
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
  deviceId: string;
}

export interface PINPolicy {
  minLength: number;
  maxLength: number;
  requireNumbers: boolean;
  requireLetters: boolean;
  requireSpecialChars: boolean;
  maxAttempts: number;
  lockoutDuration: number; // minutes
  expirationDays?: number;
}

export interface PINValidationResult {
  isValid: boolean;
  remainingAttempts?: number;
  isLockedOut: boolean;
  lockoutExpiresAt?: Date;
  error?: string;
}

class PINService {
  private static instance: PINService;
  private dbService: DatabaseService;

  // Default PIN policy for child profiles
  private readonly DEFAULT_PIN_POLICY: PINPolicy = {
    minLength: 4,
    maxLength: 6,
    requireNumbers: true,
    requireLetters: false,
    requireSpecialChars: false,
    maxAttempts: 5,
    lockoutDuration: 15, // 15 minutes
    expirationDays: 90
  };

  // Storage keys for PIN attempts and lockouts
  private readonly PIN_ATTEMPTS_KEY = 'sl_pin_attempts';
  private readonly PIN_LOCKOUTS_KEY = 'sl_pin_lockouts';

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  static getInstance(): PINService {
    if (!PINService.instance) {
      PINService.instance = new PINService();
    }
    return PINService.instance;
  }

  /**
   * Create a PIN for a child profile
   */
  async createPIN(profileId: string, pin: string, parentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate PIN format
      const validation = this.validatePINFormat(pin);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Verify parent has permission to set PIN
      const profile = await this.dbService.getChildProfile(profileId);
      if (!profile || profile.userId !== parentId) {
        return { success: false, error: 'Unauthorized' };
      }

      // Hash the PIN using PBKDF2
      const hashedPIN = EncryptionService.hashPassword(pin);

      // Update profile with hashed PIN
      await this.dbService.updateChildProfile(profileId, {
        avatarPin: hashedPIN,
        updatedAt: new Date()
      });

      // Log PIN creation
      await this.logPINEvent(profileId, 'created', true);

      console.log(`✅ PIN created for child profile: ${profileId}`);
      return { success: true };

    } catch (error) {
      console.error('PIN creation error:', error);
      return { success: false, error: 'Failed to create PIN' };
    }
  }

  /**
   * Update a PIN for a child profile
   */
  async updatePIN(
    profileId: string,
    currentPin: string,
    newPin: string,
    parentId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify current PIN first
      const currentValidation = await this.validatePIN(profileId, currentPin);
      if (!currentValidation.isValid) {
        return { success: false, error: 'Current PIN is incorrect' };
      }

      // Validate new PIN format
      const newPinValidation = this.validatePINFormat(newPin);
      if (!newPinValidation.isValid) {
        return { success: false, error: newPinValidation.error };
      }

      // Ensure new PIN is different from current
      if (currentPin === newPin) {
        return { success: false, error: 'New PIN must be different from current PIN' };
      }

      // Update PIN
      const result = await this.createPIN(profileId, newPin, parentId);

      if (result.success) {
        await this.logPINEvent(profileId, 'updated', true);

        // Clear any existing lockouts since PIN was successfully changed
        this.clearLockout(profileId);
      }

      return result;

    } catch (error) {
      console.error('PIN update error:', error);
      return { success: false, error: 'Failed to update PIN' };
    }
  }

  /**
   * Remove PIN from a child profile
   */
  async removePIN(profileId: string, parentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify parent has permission
      const profile = await this.dbService.getChildProfile(profileId);
      if (!profile || profile.userId !== parentId) {
        return { success: false, error: 'Unauthorized' };
      }

      // Remove PIN from profile
      await this.dbService.updateChildProfile(profileId, {
        avatarPin: undefined,
        updatedAt: new Date()
      });

      // Clear any existing attempts and lockouts
      this.clearPINAttempts(profileId);
      this.clearLockout(profileId);

      // Log PIN removal
      await this.logPINEvent(profileId, 'removed', true);

      console.log(`✅ PIN removed for child profile: ${profileId}`);
      return { success: true };

    } catch (error) {
      console.error('PIN removal error:', error);
      return { success: false, error: 'Failed to remove PIN' };
    }
  }

  /**
   * Validate a PIN for authentication
   */
  async validatePIN(profileId: string, pin: string): Promise<PINValidationResult> {
    try {
      // Check if profile is locked out
      const lockoutStatus = this.getLockoutStatus(profileId);
      if (lockoutStatus.isLockedOut) {
        return {
          isValid: false,
          remainingAttempts: 0,
          isLockedOut: true,
          lockoutExpiresAt: lockoutStatus.lockoutExpiresAt,
          error: 'Account temporarily locked due to too many failed attempts'
        };
      }

      // Get profile
      const profile = await this.dbService.getChildProfile(profileId);
      if (!profile) {
        return {
          isValid: false,
          remainingAttempts: 0,
          isLockedOut: false,
          error: 'Profile not found'
        };
      }

      // Check if PIN is set
      if (!profile.avatarPin) {
        return {
          isValid: true, // No PIN required
          remainingAttempts: undefined,
          isLockedOut: false
        };
      }

      // Validate PIN
      const isValidPIN = EncryptionService.verifyPassword(pin, profile.avatarPin);

      // Record attempt
      await this.recordPINAttempt(profileId, pin, isValidPIN);

      if (isValidPIN) {
        // Clear failed attempts on successful login
        this.clearPINAttempts(profileId);

        await this.logPINEvent(profileId, 'validated', true);

        return {
          isValid: true,
          remainingAttempts: undefined,
          isLockedOut: false
        };
      } else {
        // Handle failed attempt
        const attempts = this.getPINAttempts(profileId);
        const failedAttempts = attempts.filter(a => !a.success && this.isRecentAttempt(a)).length;
        const remainingAttempts = Math.max(0, this.DEFAULT_PIN_POLICY.maxAttempts - failedAttempts);

        await this.logPINEvent(profileId, 'failed', false);

        // Check if should lock out
        if (remainingAttempts === 0) {
          this.setLockout(profileId);

          return {
            isValid: false,
            remainingAttempts: 0,
            isLockedOut: true,
            lockoutExpiresAt: new Date(Date.now() + this.DEFAULT_PIN_POLICY.lockoutDuration * 60 * 1000),
            error: 'Too many failed attempts. Account locked temporarily.'
          };
        }

        return {
          isValid: false,
          remainingAttempts,
          isLockedOut: false,
          error: `Incorrect PIN. ${remainingAttempts} attempts remaining.`
        };
      }

    } catch (error) {
      console.error('PIN validation error:', error);
      return {
        isValid: false,
        remainingAttempts: 0,
        isLockedOut: false,
        error: 'PIN validation failed'
      };
    }
  }

  /**
   * Check if a profile has a PIN set
   */
  async hasPIN(profileId: string): Promise<boolean> {
    try {
      const profile = await this.dbService.getChildProfile(profileId);
      return !!(profile?.avatarPin);
    } catch (error) {
      console.error('Error checking PIN status:', error);
      return false;
    }
  }

  /**
   * Get PIN security status for a profile
   */
  async getPINStatus(profileId: string): Promise<{
    hasPIN: boolean;
    isLockedOut: boolean;
    remainingAttempts: number;
    lockoutExpiresAt?: Date;
    lastPINChange?: Date;
    needsPINChange?: boolean;
  }> {
    try {
      const profile = await this.dbService.getChildProfile(profileId);
      const lockoutStatus = this.getLockoutStatus(profileId);
      const attempts = this.getPINAttempts(profileId);
      const recentFailedAttempts = attempts.filter(a => !a.success && this.isRecentAttempt(a)).length;

      return {
        hasPIN: !!(profile?.avatarPin),
        isLockedOut: lockoutStatus.isLockedOut,
        remainingAttempts: Math.max(0, this.DEFAULT_PIN_POLICY.maxAttempts - recentFailedAttempts),
        lockoutExpiresAt: lockoutStatus.lockoutExpiresAt,
        lastPINChange: profile?.updatedAt,
        needsPINChange: this.checkIfPINChangeRequired(profile)
      };
    } catch (error) {
      console.error('Error getting PIN status:', error);
      return {
        hasPIN: false,
        isLockedOut: false,
        remainingAttempts: this.DEFAULT_PIN_POLICY.maxAttempts
      };
    }
  }

  /**
   * Generate a random PIN for a child (for parent setup)
   */
  generateRandomPIN(): string {
    const length = 4; // Default length for child PINs
    let pin = '';

    for (let i = 0; i < length; i++) {
      pin += Math.floor(Math.random() * 10).toString();
    }

    return pin;
  }

  /**
   * Get PIN policy for validation
   */
  getPINPolicy(): PINPolicy {
    return { ...this.DEFAULT_PIN_POLICY };
  }

  // === PRIVATE METHODS ===

  private validatePINFormat(pin: string): { isValid: boolean; error?: string } {
    const policy = this.DEFAULT_PIN_POLICY;

    if (pin.length < policy.minLength) {
      return { isValid: false, error: `PIN must be at least ${policy.minLength} characters` };
    }

    if (pin.length > policy.maxLength) {
      return { isValid: false, error: `PIN must be no more than ${policy.maxLength} characters` };
    }

    if (policy.requireNumbers && !/\d/.test(pin)) {
      return { isValid: false, error: 'PIN must contain at least one number' };
    }

    if (policy.requireLetters && !/[a-zA-Z]/.test(pin)) {
      return { isValid: false, error: 'PIN must contain at least one letter' };
    }

    if (policy.requireSpecialChars && !/[^a-zA-Z0-9]/.test(pin)) {
      return { isValid: false, error: 'PIN must contain at least one special character' };
    }

    return { isValid: true };
  }

  private async recordPINAttempt(profileId: string, pin: string, success: boolean): Promise<void> {
    try {
      const attempts = this.getPINAttempts(profileId);

      const attempt: PINAttempt = {
        profileId,
        pin: '', // Don't store actual PIN for security
        timestamp: new Date(),
        success,
        deviceId: this.getDeviceId()
      };

      attempts.push(attempt);

      // Keep only recent attempts (last 24 hours)
      const recentAttempts = attempts.filter(a => this.isRecentAttempt(a));

      localStorage.setItem(`${this.PIN_ATTEMPTS_KEY}_${profileId}`, JSON.stringify(recentAttempts));
    } catch (error) {
      console.error('Error recording PIN attempt:', error);
    }
  }

  private getPINAttempts(profileId: string): PINAttempt[] {
    try {
      const stored = localStorage.getItem(`${this.PIN_ATTEMPTS_KEY}_${profileId}`);
      if (!stored) return [];

      const attempts = JSON.parse(stored) as PINAttempt[];
      return attempts.map(a => ({
        ...a,
        timestamp: new Date(a.timestamp)
      }));
    } catch (error) {
      console.error('Error getting PIN attempts:', error);
      return [];
    }
  }

  private clearPINAttempts(profileId: string): void {
    localStorage.removeItem(`${this.PIN_ATTEMPTS_KEY}_${profileId}`);
  }

  private getLockoutStatus(profileId: string): { isLockedOut: boolean; lockoutExpiresAt?: Date } {
    try {
      const stored = localStorage.getItem(`${this.PIN_LOCKOUTS_KEY}_${profileId}`);
      if (!stored) return { isLockedOut: false };

      const lockout = JSON.parse(stored);
      const lockoutExpiresAt = new Date(lockout.expiresAt);

      if (lockoutExpiresAt > new Date()) {
        return { isLockedOut: true, lockoutExpiresAt };
      } else {
        // Lockout expired, clear it
        this.clearLockout(profileId);
        return { isLockedOut: false };
      }
    } catch (error) {
      console.error('Error checking lockout status:', error);
      return { isLockedOut: false };
    }
  }

  private setLockout(profileId: string): void {
    const lockout = {
      profileId,
      lockedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.DEFAULT_PIN_POLICY.lockoutDuration * 60 * 1000).toISOString()
    };

    localStorage.setItem(`${this.PIN_LOCKOUTS_KEY}_${profileId}`, JSON.stringify(lockout));
  }

  private clearLockout(profileId: string): void {
    localStorage.removeItem(`${this.PIN_LOCKOUTS_KEY}_${profileId}`);
  }

  private isRecentAttempt(attempt: PINAttempt): boolean {
    const hoursSinceAttempt = (Date.now() - attempt.timestamp.getTime()) / (1000 * 60 * 60);
    return hoursSinceAttempt < 24; // Consider attempts from last 24 hours
  }

  private checkIfPINChangeRequired(profile: ChildProfile | null): boolean {
    if (!profile?.avatarPin || !this.DEFAULT_PIN_POLICY.expirationDays) {
      return false;
    }

    const daysSinceChange = (Date.now() - profile.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceChange > this.DEFAULT_PIN_POLICY.expirationDays;
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('sl_device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sl_device_id', deviceId);
    }
    return deviceId;
  }

  private async logPINEvent(profileId: string, action: string, success: boolean): Promise<void> {
    try {
      // This would integrate with the analytics system
      console.log(`PIN Event: ${action} for profile ${profileId} - ${success ? 'Success' : 'Failed'}`);
    } catch (error) {
      console.error('Error logging PIN event:', error);
    }
  }
}

// Export singleton instance
export const pinService = PINService.getInstance();
export default PINService;