/**
 * Key Management Service (KMS)
 * Enterprise-grade key management with AWS KMS integration and local fallback
 */

import {
  KMSClient,
  GenerateDataKeyCommand,
  DecryptCommand,
  CreateKeyCommand,
  DescribeKeyCommand,
  GenerateRandomCommand,
  CreateAliasCommand,
  RotateKeyOnDemandCommand
} from '@aws-sdk/client-kms';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  UpdateSecretCommand,
  RotateSecretCommand
} from '@aws-sdk/client-secrets-manager';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { pino } from 'pino';

const logger = pino({ name: 'KeyManagementService' });

// Key rotation intervals
const KEY_ROTATION_DAYS = 90;
const EMERGENCY_KEY_ROTATION_HOURS = 1;

// Encryption algorithms
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_DERIVATION_ALGORITHM = 'pbkdf2';
const KEY_DERIVATION_ITERATIONS = 100000;
const KEY_SIZE = 32; // 256 bits
const IV_SIZE = 16; // 128 bits
const SALT_SIZE = 32; // 256 bits
const TAG_SIZE = 16; // 128 bits

// Key types
export enum KeyType {
  MASTER = 'master',
  DATA_ENCRYPTION = 'data_encryption',
  JWT_SIGNING = 'jwt_signing',
  API_KEY = 'api_key',
  DATABASE_ENCRYPTION = 'database_encryption',
  FILE_ENCRYPTION = 'file_encryption',
  SESSION = 'session',
  TEMPORARY = 'temporary'
}

// Key metadata interface
interface KeyMetadata {
  keyId: string;
  keyType: KeyType;
  algorithm: string;
  createdAt: Date;
  rotatedAt?: Date;
  expiresAt?: Date;
  version: number;
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  tags: Record<string, string>;
}

// Encrypted key storage
interface EncryptedKey {
  encryptedDataKey: string;
  encryptedKeyMaterial: string;
  metadata: KeyMetadata;
  checksum: string;
}

// Key cache entry
interface CachedKey {
  key: Buffer;
  metadata: KeyMetadata;
  cachedAt: Date;
  ttl: number;
}

export class KeyManagementService {
  private static instance: KeyManagementService;
  private kmsClient?: KMSClient;
  private secretsClient?: SecretsManagerClient;
  private keyCache: Map<string, CachedKey> = new Map();
  private masterKey?: Buffer;
  private keyStorePath: string;
  private isAwsEnabled: boolean;
  private rotationSchedule: Map<string, NodeJS.Timer> = new Map();

  private constructor() {
    this.keyStorePath = process.env.KEY_STORE_PATH || './keys';
    this.isAwsEnabled = process.env.AWS_KMS_ENABLED === 'true';

    if (this.isAwsEnabled) {
      this.initializeAwsClients();
    } else {
      logger.warn('AWS KMS disabled, using local key management (not recommended for production)');
      this.initializeLocalKeyStore();
    }

    this.startKeyRotationSchedule();
    this.setupCleanupInterval();
  }

  public static getInstance(): KeyManagementService {
    if (!KeyManagementService.instance) {
      KeyManagementService.instance = new KeyManagementService();
    }
    return KeyManagementService.instance;
  }

  /**
   * Initialize AWS KMS and Secrets Manager clients
   */
  private initializeAwsClients(): void {
    const region = process.env.AWS_REGION || 'us-east-1';

    this.kmsClient = new KMSClient({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    this.secretsClient = new SecretsManagerClient({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    logger.info(`AWS KMS initialized in region ${region}`);
  }

  /**
   * Initialize local key store for development/fallback
   */
  private async initializeLocalKeyStore(): Promise<void> {
    try {
      await fs.mkdir(this.keyStorePath, { recursive: true });

      // Generate or load master key
      const masterKeyPath = path.join(this.keyStorePath, 'master.key');

      try {
        const masterKeyData = await fs.readFile(masterKeyPath);
        this.masterKey = Buffer.from(masterKeyData.toString('hex'), 'hex');
        logger.info('Master key loaded from local store');
      } catch {
        // Generate new master key
        this.masterKey = crypto.randomBytes(KEY_SIZE);
        await fs.writeFile(masterKeyPath, this.masterKey.toString('hex'));
        logger.info('New master key generated and saved');
      }

      // Set restrictive permissions on key file
      await fs.chmod(masterKeyPath, 0o600);
    } catch (error) {
      logger.error('Failed to initialize local key store:', error);
      throw error;
    }
  }

  /**
   * Generate a new data encryption key
   */
  public async generateDataKey(keyType: KeyType = KeyType.DATA_ENCRYPTION): Promise<{
    plaintext: Buffer;
    encrypted: string;
    keyId: string;
  }> {
    const keyId = crypto.randomUUID();

    if (this.isAwsEnabled && this.kmsClient) {
      try {
        // Use AWS KMS to generate data key
        const command = new GenerateDataKeyCommand({
          KeyId: process.env.AWS_KMS_KEY_ID!,
          KeySpec: 'AES_256'
        });

        const response = await this.kmsClient.send(command);

        if (!response.Plaintext || !response.CiphertextBlob) {
          throw new Error('Failed to generate data key from AWS KMS');
        }

        // Cache the key
        this.cacheKey(keyId, Buffer.from(response.Plaintext), {
          keyId,
          keyType,
          algorithm: ENCRYPTION_ALGORITHM,
          createdAt: new Date(),
          version: 1,
          isActive: true,
          usageCount: 0,
          tags: {}
        });

        return {
          plaintext: Buffer.from(response.Plaintext),
          encrypted: Buffer.from(response.CiphertextBlob).toString('base64'),
          keyId
        };
      } catch (error) {
        logger.error('AWS KMS data key generation failed:', error);
        // Fall back to local generation
      }
    }

    // Local key generation
    const plaintext = crypto.randomBytes(KEY_SIZE);
    const encrypted = await this.encryptKey(plaintext, keyType);

    // Store encrypted key
    await this.storeEncryptedKey(keyId, encrypted, keyType);

    // Cache the plaintext key
    this.cacheKey(keyId, plaintext, {
      keyId,
      keyType,
      algorithm: ENCRYPTION_ALGORITHM,
      createdAt: new Date(),
      version: 1,
      isActive: true,
      usageCount: 0,
      tags: {}
    });

    return {
      plaintext,
      encrypted,
      keyId
    };
  }

  /**
   * Encrypt a key using master key
   */
  private async encryptKey(keyBuffer: Buffer, keyType: KeyType): Promise<string> {
    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }

    const iv = crypto.randomBytes(IV_SIZE);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, this.masterKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(keyBuffer),
      cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    // Combine IV, tag, and encrypted data
    const combined = Buffer.concat([iv, tag, encrypted]);

    return combined.toString('base64');
  }

  /**
   * Decrypt a key using master key
   */
  private async decryptKey(encryptedKey: string): Promise<Buffer> {
    if (!this.masterKey) {
      throw new Error('Master key not initialized');
    }

    const combined = Buffer.from(encryptedKey, 'base64');
    const iv = combined.subarray(0, IV_SIZE);
    const tag = combined.subarray(IV_SIZE, IV_SIZE + TAG_SIZE);
    const encrypted = combined.subarray(IV_SIZE + TAG_SIZE);

    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, this.masterKey, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    return decrypted;
  }

  /**
   * Retrieve a key by ID
   */
  public async getKey(keyId: string): Promise<Buffer> {
    // Check cache first
    const cached = this.keyCache.get(keyId);
    if (cached && cached.cachedAt.getTime() + cached.ttl > Date.now()) {
      cached.metadata.usageCount++;
      cached.metadata.lastUsed = new Date();
      return cached.key;
    }

    // Load from storage
    const encryptedKey = await this.loadEncryptedKey(keyId);
    const plaintext = await this.decryptKey(encryptedKey.encryptedKeyMaterial);

    // Update cache
    this.cacheKey(keyId, plaintext, encryptedKey.metadata);

    return plaintext;
  }

  /**
   * Store an encrypted key
   */
  private async storeEncryptedKey(
    keyId: string,
    encryptedKeyMaterial: string,
    keyType: KeyType
  ): Promise<void> {
    const metadata: KeyMetadata = {
      keyId,
      keyType,
      algorithm: ENCRYPTION_ALGORITHM,
      createdAt: new Date(),
      version: 1,
      isActive: true,
      usageCount: 0,
      tags: {}
    };

    const encryptedKey: EncryptedKey = {
      encryptedDataKey: '',
      encryptedKeyMaterial,
      metadata,
      checksum: this.calculateChecksum(encryptedKeyMaterial)
    };

    const keyPath = path.join(this.keyStorePath, `${keyId}.json`);
    await fs.writeFile(keyPath, JSON.stringify(encryptedKey, null, 2));
    await fs.chmod(keyPath, 0o600);
  }

  /**
   * Load an encrypted key from storage
   */
  private async loadEncryptedKey(keyId: string): Promise<EncryptedKey> {
    const keyPath = path.join(this.keyStorePath, `${keyId}.json`);
    const data = await fs.readFile(keyPath, 'utf-8');
    const encryptedKey: EncryptedKey = JSON.parse(data);

    // Verify checksum
    const checksum = this.calculateChecksum(encryptedKey.encryptedKeyMaterial);
    if (checksum !== encryptedKey.checksum) {
      throw new Error(`Key integrity check failed for ${keyId}`);
    }

    return encryptedKey;
  }

  /**
   * Cache a key in memory
   */
  private cacheKey(keyId: string, key: Buffer, metadata: KeyMetadata, ttl: number = 3600000): void {
    this.keyCache.set(keyId, {
      key,
      metadata,
      cachedAt: new Date(),
      ttl
    });
  }

  /**
   * Rotate a key
   */
  public async rotateKey(keyId: string): Promise<string> {
    logger.info(`Rotating key ${keyId}`);

    // Generate new key
    const newKeyData = await this.generateDataKey();

    // Load old key metadata
    const oldKey = await this.loadEncryptedKey(keyId);

    // Create new key with incremented version
    const newKeyId = crypto.randomUUID();
    const newMetadata: KeyMetadata = {
      ...oldKey.metadata,
      keyId: newKeyId,
      version: oldKey.metadata.version + 1,
      rotatedAt: new Date(),
      createdAt: new Date()
    };

    // Store new key
    await this.storeEncryptedKey(newKeyId, newKeyData.encrypted, newMetadata.keyType);

    // Mark old key as inactive
    oldKey.metadata.isActive = false;
    await this.storeEncryptedKey(keyId, oldKey.encryptedKeyMaterial, oldKey.metadata.keyType);

    // Update cache
    this.keyCache.delete(keyId);
    this.cacheKey(newKeyId, newKeyData.plaintext, newMetadata);

    logger.info(`Key ${keyId} rotated to ${newKeyId}`);

    return newKeyId;
  }

  /**
   * Generate a secure API key
   */
  public async generateApiKey(userId: string, scope: string[]): Promise<string> {
    const keyData = {
      userId,
      scope,
      createdAt: new Date().toISOString(),
      nonce: crypto.randomBytes(16).toString('hex')
    };

    const keyString = JSON.stringify(keyData);
    const hash = crypto.createHash('sha256').update(keyString).digest();
    const apiKey = `slk_${Buffer.concat([hash, crypto.randomBytes(16)]).toString('base64url')}`;

    // Store API key metadata
    await this.storeApiKeyMetadata(apiKey, userId, scope);

    return apiKey;
  }

  /**
   * Store API key metadata
   */
  private async storeApiKeyMetadata(apiKey: string, userId: string, scope: string[]): Promise<void> {
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const metadata = {
      hash,
      userId,
      scope,
      createdAt: new Date(),
      lastUsed: null,
      isActive: true
    };

    const metadataPath = path.join(this.keyStorePath, 'api-keys', `${hash}.json`);
    await fs.mkdir(path.dirname(metadataPath), { recursive: true });
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Validate an API key
   */
  public async validateApiKey(apiKey: string): Promise<{
    valid: boolean;
    userId?: string;
    scope?: string[];
  }> {
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const metadataPath = path.join(this.keyStorePath, 'api-keys', `${hash}.json`);

    try {
      const data = await fs.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(data);

      if (!metadata.isActive) {
        return { valid: false };
      }

      // Update last used
      metadata.lastUsed = new Date();
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      return {
        valid: true,
        userId: metadata.userId,
        scope: metadata.scope
      };
    } catch {
      return { valid: false };
    }
  }

  /**
   * Generate a JWT signing key pair
   */
  public async generateJWTKeyPair(): Promise<{
    publicKey: string;
    privateKey: string;
    keyId: string;
  }> {
    const keyId = crypto.randomUUID();

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: this.masterKey?.toString('base64') || 'temp-passphrase'
      }
    });

    // Store keys
    const keyPairPath = path.join(this.keyStorePath, 'jwt-keys', keyId);
    await fs.mkdir(keyPairPath, { recursive: true });
    await fs.writeFile(path.join(keyPairPath, 'public.pem'), publicKey);
    await fs.writeFile(path.join(keyPairPath, 'private.pem'), privateKey);
    await fs.chmod(path.join(keyPairPath, 'private.pem'), 0o600);

    return { publicKey, privateKey, keyId };
  }

  /**
   * Calculate checksum for integrity verification
   */
  private calculateChecksum(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Start automated key rotation schedule
   */
  private startKeyRotationSchedule(): void {
    // Rotate keys every KEY_ROTATION_DAYS
    const rotationInterval = KEY_ROTATION_DAYS * 24 * 60 * 60 * 1000;

    setInterval(async () => {
      try {
        logger.info('Starting scheduled key rotation');
        await this.rotateAllKeys();
      } catch (error) {
        logger.error('Scheduled key rotation failed:', error);
      }
    }, rotationInterval);
  }

  /**
   * Rotate all active keys
   */
  private async rotateAllKeys(): Promise<void> {
    const keysDir = this.keyStorePath;
    const files = await fs.readdir(keysDir);

    for (const file of files) {
      if (file.endsWith('.json') && !file.startsWith('master')) {
        const keyId = file.replace('.json', '');
        try {
          const encryptedKey = await this.loadEncryptedKey(keyId);
          if (encryptedKey.metadata.isActive) {
            await this.rotateKey(keyId);
          }
        } catch (error) {
          logger.error(`Failed to rotate key ${keyId}:`, error);
        }
      }
    }
  }

  /**
   * Emergency key rotation (in case of compromise)
   */
  public async emergencyRotation(): Promise<void> {
    logger.warn('EMERGENCY KEY ROTATION INITIATED');

    // Immediately rotate all keys
    await this.rotateAllKeys();

    // Clear key cache
    this.keyCache.clear();

    // Generate new master key
    if (!this.isAwsEnabled) {
      this.masterKey = crypto.randomBytes(KEY_SIZE);
      const masterKeyPath = path.join(this.keyStorePath, 'master.key');
      await fs.writeFile(masterKeyPath, this.masterKey.toString('hex'));
      await fs.chmod(masterKeyPath, 0o600);
    }

    logger.warn('Emergency key rotation completed');
  }

  /**
   * Setup cleanup interval for expired keys
   */
  private setupCleanupInterval(): void {
    setInterval(() => {
      // Clean expired cache entries
      for (const [keyId, cached] of this.keyCache.entries()) {
        if (cached.cachedAt.getTime() + cached.ttl < Date.now()) {
          this.keyCache.delete(keyId);
        }
      }
    }, 3600000); // Every hour
  }

  /**
   * Encrypt data using a specific key
   */
  public async encryptData(data: Buffer, keyId: string): Promise<{
    encrypted: Buffer;
    iv: Buffer;
    tag: Buffer;
  }> {
    const key = await this.getKey(keyId);
    const iv = crypto.randomBytes(IV_SIZE);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return { encrypted, iv, tag };
  }

  /**
   * Decrypt data using a specific key
   */
  public async decryptData(
    encrypted: Buffer,
    keyId: string,
    iv: Buffer,
    tag: Buffer
  ): Promise<Buffer> {
    const key = await this.getKey(keyId);
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    return decrypted;
  }

  /**
   * Generate a secure random token
   */
  public generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('base64url');
  }

  /**
   * Derive a key from a password (for user passwords)
   */
  public async deriveKeyFromPassword(
    password: string,
    salt?: Buffer
  ): Promise<{ key: Buffer; salt: Buffer }> {
    const actualSalt = salt || crypto.randomBytes(SALT_SIZE);

    const derivedKey = await promisify(crypto.pbkdf2)(
      password,
      actualSalt,
      KEY_DERIVATION_ITERATIONS,
      KEY_SIZE,
      'sha256'
    );

    return {
      key: derivedKey,
      salt: actualSalt
    };
  }
}

// Export singleton instance
export const kmsService = KeyManagementService.getInstance();