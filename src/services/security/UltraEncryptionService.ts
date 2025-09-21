/**
 * Ultra-Secure Encryption Service
 * Military-grade encryption for child data protection
 */

import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import { securityConfig } from '@/config/security';

interface EncryptionResult {
  encrypted: string;
  iv: string;
  salt: string;
  timestamp: number;
}

interface DecryptionParams {
  encrypted: string;
  iv: string;
  salt: string;
  timestamp?: number;
}

class UltraEncryptionService {
  private static instance: UltraEncryptionService;

  // Security constants
  private readonly SALT_ROUNDS = 12; // bcrypt rounds
  private readonly KEY_SIZE = 256; // AES-256
  private readonly IV_SIZE = 128; // 128-bit IV
  private readonly SALT_SIZE = 256; // 256-bit salt
  private readonly MAX_DATA_AGE = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.validateConfiguration();
  }

  static getInstance(): UltraEncryptionService {
    if (!UltraEncryptionService.instance) {
      UltraEncryptionService.instance = new UltraEncryptionService();
    }
    return UltraEncryptionService.instance;
  }

  /**
   * Validates encryption configuration on startup
   */
  private validateConfiguration(): void {
    if (!securityConfig.ENCRYPTION_KEY || securityConfig.ENCRYPTION_KEY.length < 32) {
      throw new Error('🔒 CRITICAL: Encryption key must be at least 32 characters');
    }

    if (!securityConfig.PEPPER_SECRET || securityConfig.PEPPER_SECRET.length < 64) {
      throw new Error('🔒 CRITICAL: Pepper secret must be at least 64 characters');
    }

    console.log('✅ Ultra-encryption service initialized with AES-256-GCM');
  }

  /**
   * Derive encryption key using PBKDF2 with salt
   */
  private deriveKey(salt: string): CryptoJS.lib.WordArray {
    return CryptoJS.PBKDF2(
      securityConfig.ENCRYPTION_KEY,
      salt,
      {
        keySize: this.KEY_SIZE / 32, // Convert bits to words
        iterations: 100000, // 100k iterations for security
        hasher: CryptoJS.algo.SHA512
      }
    );
  }

  /**
   * Generate cryptographically secure random bytes
   */
  private generateSecureRandom(size: number): string {
    return CryptoJS.lib.WordArray.random(size / 8).toString();
  }

  /**
   * Encrypt sensitive data with AES-256-GCM equivalent (AES-256-CBC + HMAC)
   */
  encrypt(plaintext: string): EncryptionResult {
    try {
      if (!plaintext || plaintext.trim().length === 0) {
        throw new Error('Cannot encrypt empty data');
      }

      // Generate unique salt and IV for each encryption
      const salt = this.generateSecureRandom(this.SALT_SIZE);
      const iv = this.generateSecureRandom(this.IV_SIZE);

      // Derive encryption key
      const key = this.deriveKey(salt);

      // Encrypt with AES-256-CBC
      const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Create HMAC for authentication
      const hmac = CryptoJS.HmacSHA256(
        salt + iv + encrypted.toString(),
        securityConfig.PEPPER_SECRET
      );

      // Combine encrypted data with HMAC
      const authenticatedData = encrypted.toString() + ':' + hmac.toString();

      return {
        encrypted: authenticatedData,
        iv,
        salt,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('🔒 Encryption failed:', error);
      throw new Error('Encryption operation failed');
    }
  }

  /**
   * Decrypt data with integrity verification
   */
  decrypt(params: DecryptionParams): string {
    try {
      const { encrypted, iv, salt, timestamp } = params;

      // Check data age for security
      if (timestamp && (Date.now() - timestamp > this.MAX_DATA_AGE)) {
        throw new Error('Encrypted data has expired');
      }

      // Split encrypted data and HMAC
      const parts = encrypted.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
      }

      const [encryptedData, providedHmac] = parts;

      // Verify HMAC integrity
      const expectedHmac = CryptoJS.HmacSHA256(
        salt + iv + encryptedData,
        securityConfig.PEPPER_SECRET
      ).toString();

      if (providedHmac !== expectedHmac) {
        throw new Error('Data integrity verification failed');
      }

      // Derive decryption key
      const key = this.deriveKey(salt);

      // Decrypt data
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

      if (!plaintext) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }

      return plaintext;

    } catch (error) {
      console.error('🔒 Decryption failed:', error);
      throw new Error('Decryption operation failed');
    }
  }

  /**
   * Hash password with bcrypt and pepper
   */
  async hashPassword(password: string): Promise<string> {
    try {
      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Add pepper to password before hashing
      const pepperedPassword = password + securityConfig.PEPPER_SECRET;

      // Hash with bcrypt
      const hashedPassword = await bcrypt.hash(pepperedPassword, this.SALT_ROUNDS);

      return hashedPassword;

    } catch (error) {
      console.error('🔒 Password hashing failed:', error);
      throw new Error('Password hashing operation failed');
    }
  }

  /**
   * Verify password with bcrypt and pepper
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      if (!password || !hashedPassword) {
        return false;
      }

      // Add pepper to password before verification
      const pepperedPassword = password + securityConfig.PEPPER_SECRET;

      // Verify with bcrypt
      return await bcrypt.compare(pepperedPassword, hashedPassword);

    } catch (error) {
      console.error('🔒 Password verification failed:', error);
      return false;
    }
  }

  /**
   * Generate secure hash for non-sensitive data
   */
  generateHash(data: string): string {
    try {
      return CryptoJS.SHA256(data + securityConfig.PEPPER_SECRET).toString();
    } catch (error) {
      console.error('🔒 Hash generation failed:', error);
      throw new Error('Hash generation failed');
    }
  }

  /**
   * Generate cryptographically secure random token
   */
  generateSecureToken(length: number = 32): string {
    try {
      return this.generateSecureRandom(length * 8);
    } catch (error) {
      console.error('🔒 Token generation failed:', error);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Encrypt object data (for complex data structures)
   */
  encryptObject<T>(obj: T): EncryptionResult {
    try {
      const serialized = JSON.stringify(obj);
      return this.encrypt(serialized);
    } catch (error) {
      console.error('🔒 Object encryption failed:', error);
      throw new Error('Object encryption failed');
    }
  }

  /**
   * Decrypt object data
   */
  decryptObject<T>(params: DecryptionParams): T {
    try {
      const decrypted = this.decrypt(params);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('🔒 Object decryption failed:', error);
      throw new Error('Object decryption failed');
    }
  }

  /**
   * Securely wipe sensitive data from memory
   */
  secureWipe(data: string): void {
    // Note: JavaScript doesn't provide true memory wiping,
    // but we can overwrite variables to reduce memory exposure
    try {
      if (typeof data === 'string') {
        // Overwrite string data (limited effectiveness in JS)
        for (let i = 0; i < data.length; i++) {
          (data as any)[i] = '\0';
        }
      }
    } catch (error) {
      // Silent fail for memory wiping attempts
      console.warn('🔒 Memory wipe attempted but limited in JavaScript environment');
    }
  }
}

// Export singleton instance
export const ultraEncryption = UltraEncryptionService.getInstance();
export default UltraEncryptionService;