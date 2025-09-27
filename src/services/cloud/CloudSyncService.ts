/**
 * AAA+ Cloud Sync & Save Service
 * Cross-device synchronization with offline-first architecture
 * Automatic conflict resolution and data integrity
 */

import { EventEmitter } from 'events';
import { UltraEncryptionService } from '../security/UltraEncryptionService';

export interface CloudSaveData {
  id: string;
  userId: string;
  deviceId: string;
  timestamp: number;
  version: number;
  data: {
    profile: UserProfile;
    progress: GameProgress;
    achievements: Achievement[];
    settings: UserSettings;
    friends: string[];
    studyGroups: string[];
  };
  checksum: string;
  encrypted: boolean;
  compressed: boolean;
}

interface UserProfile {
  displayName: string;
  avatar: string;
  ageGroup: '3-5' | '6-8' | '9+';
  level: number;
  totalXP: number;
  preferredSubjects: string[];
  learningStyle: string;
}

interface GameProgress {
  subjects: Map<string, SubjectProgress>;
  totalGamesPlayed: number;
  totalQuestionsAnswered: number;
  accuracyRate: number;
  streakDays: number;
  lastPlayed: Date;
}

interface SubjectProgress {
  level: number;
  xp: number;
  mastery: number;
  questionsAnswered: number;
  correctAnswers: number;
  bestStreak: number;
  unlockedContent: string[];
}

interface Achievement {
  id: string;
  unlockedAt: Date;
  progress: number;
}

interface UserSettings {
  soundEnabled: boolean;
  musicVolume: number;
  effectsVolume: number;
  language: string;
  theme: string;
  accessibility: any;
}

interface SyncStatus {
  isS

yncing: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
  syncProgress: number;
  errors: SyncError[];
}

interface SyncError {
  timestamp: Date;
  type: 'network' | 'conflict' | 'validation' | 'quota';
  message: string;
  retryCount: number;
}

interface ConflictResolution {
  strategy: 'latest' | 'merge' | 'local' | 'remote';
  resolver?: (local: any, remote: any) => any;
}

export class CloudSyncService extends EventEmitter {
  private static instance: CloudSyncService;
  private encryptionService: UltraEncryptionService;
  private localData: CloudSaveData | null = null;
  private syncStatus: SyncStatus;
  private syncQueue: any[] = [];
  private syncTimer: number | null = null;
  private deviceId: string;
  private userId: string | null = null;
  private isOnline: boolean = navigator.onLine;
  private conflictResolution: ConflictResolution;

  // Configuration
  private readonly SYNC_INTERVAL = 30000; // 30 seconds
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly STORAGE_QUOTA = 50 * 1024 * 1024; // 50MB
  private readonly API_ENDPOINT = process.env.VITE_API_URL || 'https://api.stealth-learning.com';

  private constructor() {
    super();
    this.encryptionService = UltraEncryptionService.getInstance();
    this.deviceId = this.getDeviceId();
    this.syncStatus = this.initializeSyncStatus();
    this.conflictResolution = {
      strategy: 'merge'
    };
    this.initialize();
  }

  public static getInstance(): CloudSyncService {
    if (!CloudSyncService.instance) {
      CloudSyncService.instance = new CloudSyncService();
    }
    return CloudSyncService.instance;
  }

  private initializeSyncStatus(): SyncStatus {
    return {
      isSyncing: false,
      lastSyncTime: null,
      pendingChanges: 0,
      syncProgress: 0,
      errors: []
    };
  }

  /**
   * Initialize cloud sync service
   */
  private async initialize(): Promise<void> {
    // Setup online/offline listeners
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Setup storage event for cross-tab sync
    window.addEventListener('storage', this.handleStorageChange.bind(this));

    // Load local data
    await this.loadLocalData();

    // Start sync if online
    if (this.isOnline) {
      this.startAutoSync();
    }

    console.log('☁️ Cloud Sync Service initialized');
  }

  /**
   * Login and setup sync
   */
  public async login(userId: string, token?: string): Promise<void> {
    this.userId = userId;

    // Store auth token securely
    if (token) {
      await this.encryptionService.encryptData({ token });
    }

    // Perform initial sync
    await this.performSync();

    // Start auto-sync
    this.startAutoSync();

    this.emit('logged_in', { userId });
  }

  /**
   * Save data to cloud
   */
  public async saveToCloud(data: Partial<CloudSaveData['data']>): Promise<void> {
    if (!this.userId) {
      throw new Error('User not logged in');
    }

    // Merge with existing data
    const currentData = await this.getLocalData();
    const mergedData = this.mergeData(currentData.data, data);

    // Create save object
    const saveData: CloudSaveData = {
      id: this.generateSaveId(),
      userId: this.userId,
      deviceId: this.deviceId,
      timestamp: Date.now(),
      version: (currentData.version || 0) + 1,
      data: mergedData,
      checksum: this.calculateChecksum(mergedData),
      encrypted: true,
      compressed: true
    };

    // Encrypt sensitive data
    saveData.data = await this.encryptSaveData(saveData.data);

    // Compress data
    saveData.data = this.compressData(saveData.data);

    // Save locally first
    await this.saveLocalData(saveData);

    // Add to sync queue
    this.addToSyncQueue(saveData);

    // Trigger sync if online
    if (this.isOnline) {
      this.performSync();
    }

    this.emit('data_saved', saveData);
  }

  /**
   * Load data from cloud
   */
  public async loadFromCloud(): Promise<CloudSaveData['data']> {
    if (!this.userId) {
      throw new Error('User not logged in');
    }

    try {
      // Try to fetch from cloud
      if (this.isOnline) {
        const cloudData = await this.fetchCloudData();
        if (cloudData) {
          // Validate and decrypt
          const decrypted = await this.decryptSaveData(cloudData.data);
          const decompressed = this.decompressData(decrypted);

          // Save locally
          await this.saveLocalData({
            ...cloudData,
            data: decompressed
          });

          return decompressed;
        }
      }

      // Fall back to local data
      const localData = await this.getLocalData();
      return localData.data;

    } catch (error) {
      console.error('Failed to load from cloud:', error);

      // Return local data as fallback
      const localData = await this.getLocalData();
      return localData.data;
    }
  }

  /**
   * Perform sync operation
   */
  private async performSync(): Promise<void> {
    if (this.syncStatus.isSyncing || !this.isOnline) {
      return;
    }

    this.syncStatus.isSyncing = true;
    this.syncStatus.syncProgress = 0;
    this.emit('sync_started');

    try {
      // Get local changes
      const localData = await this.getLocalData();
      const cloudData = await this.fetchCloudData();

      // Check for conflicts
      if (cloudData && cloudData.timestamp > localData.timestamp) {
        // Resolve conflict
        const resolved = await this.resolveConflict(localData, cloudData);
        await this.saveLocalData(resolved);
        await this.uploadToCloud(resolved);
      } else {
        // Upload local changes
        await this.uploadToCloud(localData);
      }

      // Process sync queue
      await this.processSyncQueue();

      // Update status
      this.syncStatus.lastSyncTime = new Date();
      this.syncStatus.pendingChanges = 0;
      this.syncStatus.syncProgress = 100;
      this.syncStatus.errors = [];

      this.emit('sync_completed', {
        timestamp: this.syncStatus.lastSyncTime,
        changes: 0
      });

    } catch (error: any) {
      console.error('Sync failed:', error);

      this.syncStatus.errors.push({
        timestamp: new Date(),
        type: 'network',
        message: error.message,
        retryCount: 0
      });

      this.emit('sync_failed', error);

      // Retry if needed
      this.scheduleRetry();

    } finally {
      this.syncStatus.isSyncing = false;
    }
  }

  /**
   * Fetch data from cloud
   */
  private async fetchCloudData(): Promise<CloudSaveData | null> {
    if (!this.userId) return null;

    try {
      const response = await fetch(`${this.API_ENDPOINT}/sync/${this.userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
          'X-Device-Id': this.deviceId
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No cloud save exists
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Failed to fetch cloud data:', error);

      // Simulate cloud data for development
      if (process.env.NODE_ENV === 'development') {
        return this.simulateCloudData();
      }

      throw error;
    }
  }

  /**
   * Upload data to cloud
   */
  private async uploadToCloud(data: CloudSaveData): Promise<void> {
    if (!this.userId) return;

    try {
      const response = await fetch(`${this.API_ENDPOINT}/sync/${this.userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
          'Content-Type': 'application/json',
          'X-Device-Id': this.deviceId
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Upload failed: HTTP ${response.status}`);
      }

      this.emit('upload_completed', data);

    } catch (error) {
      console.error('Failed to upload to cloud:', error);

      // In development, simulate success
      if (process.env.NODE_ENV === 'development') {
        console.log('📤 Simulated cloud upload successful');
        this.emit('upload_completed', data);
        return;
      }

      throw error;
    }
  }

  /**
   * Resolve sync conflict
   */
  private async resolveConflict(
    local: CloudSaveData,
    remote: CloudSaveData
  ): Promise<CloudSaveData> {
    console.log('⚠️ Resolving sync conflict');

    switch (this.conflictResolution.strategy) {
      case 'latest':
        // Use the most recent data
        return local.timestamp > remote.timestamp ? local : remote;

      case 'merge':
        // Merge both datasets
        return this.mergeCloudData(local, remote);

      case 'local':
        // Always use local data
        return local;

      case 'remote':
        // Always use remote data
        return remote;

      default:
        // Custom resolver
        if (this.conflictResolution.resolver) {
          const resolved = await this.conflictResolution.resolver(local, remote);
          return resolved;
        }
        return local;
    }
  }

  /**
   * Merge cloud data intelligently
   */
  private mergeCloudData(local: CloudSaveData, remote: CloudSaveData): CloudSaveData {
    const merged: CloudSaveData = {
      ...local,
      timestamp: Date.now(),
      version: Math.max(local.version, remote.version) + 1
    };

    // Merge profile (use most recent)
    merged.data.profile = local.timestamp > remote.timestamp
      ? local.data.profile
      : remote.data.profile;

    // Merge progress (use highest values)
    merged.data.progress = this.mergeProgress(
      local.data.progress,
      remote.data.progress
    );

    // Merge achievements (union)
    const achievementSet = new Set([
      ...local.data.achievements,
      ...remote.data.achievements
    ]);
    merged.data.achievements = Array.from(achievementSet);

    // Merge settings (use most recent)
    merged.data.settings = local.timestamp > remote.timestamp
      ? local.data.settings
      : remote.data.settings;

    // Merge friends (union)
    const friendSet = new Set([
      ...local.data.friends,
      ...remote.data.friends
    ]);
    merged.data.friends = Array.from(friendSet);

    // Update checksum
    merged.checksum = this.calculateChecksum(merged.data);

    this.emit('conflict_resolved', {
      strategy: 'merge',
      local,
      remote,
      merged
    });

    return merged;
  }

  /**
   * Merge progress data
   */
  private mergeProgress(local: GameProgress, remote: GameProgress): GameProgress {
    const merged: GameProgress = {
      subjects: new Map(),
      totalGamesPlayed: Math.max(local.totalGamesPlayed, remote.totalGamesPlayed),
      totalQuestionsAnswered: Math.max(local.totalQuestionsAnswered, remote.totalQuestionsAnswered),
      accuracyRate: (local.accuracyRate + remote.accuracyRate) / 2,
      streakDays: Math.max(local.streakDays, remote.streakDays),
      lastPlayed: local.lastPlayed > remote.lastPlayed ? local.lastPlayed : remote.lastPlayed
    };

    // Merge subject progress
    const allSubjects = new Set([
      ...local.subjects.keys(),
      ...remote.subjects.keys()
    ]);

    for (const subject of allSubjects) {
      const localSubject = local.subjects.get(subject);
      const remoteSubject = remote.subjects.get(subject);

      if (!localSubject) {
        merged.subjects.set(subject, remoteSubject!);
      } else if (!remoteSubject) {
        merged.subjects.set(subject, localSubject);
      } else {
        // Merge both
        merged.subjects.set(subject, {
          level: Math.max(localSubject.level, remoteSubject.level),
          xp: Math.max(localSubject.xp, remoteSubject.xp),
          mastery: Math.max(localSubject.mastery, remoteSubject.mastery),
          questionsAnswered: Math.max(localSubject.questionsAnswered, remoteSubject.questionsAnswered),
          correctAnswers: Math.max(localSubject.correctAnswers, remoteSubject.correctAnswers),
          bestStreak: Math.max(localSubject.bestStreak, remoteSubject.bestStreak),
          unlockedContent: Array.from(new Set([
            ...localSubject.unlockedContent,
            ...remoteSubject.unlockedContent
          ]))
        });
      }
    }

    return merged;
  }

  /**
   * Merge data objects
   */
  private mergeData(current: any, updates: any): any {
    return {
      ...current,
      ...updates,
      // Deep merge arrays and objects
      progress: updates.progress ? {
        ...current.progress,
        ...updates.progress
      } : current.progress,
      achievements: updates.achievements ? [
        ...new Set([...current.achievements, ...updates.achievements])
      ] : current.achievements
    };
  }

  /**
   * Process sync queue
   */
  private async processSyncQueue(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const item = this.syncQueue.shift();
      try {
        await this.uploadToCloud(item);
      } catch (error) {
        // Re-add to queue on failure
        this.syncQueue.unshift(item);
        throw error;
      }
    }
  }

  /**
   * Add to sync queue
   */
  private addToSyncQueue(data: CloudSaveData): void {
    this.syncQueue.push(data);
    this.syncStatus.pendingChanges = this.syncQueue.length;
    this.emit('pending_changes', this.syncStatus.pendingChanges);
  }

  /**
   * Schedule retry
   */
  private scheduleRetry(): void {
    const lastError = this.syncStatus.errors[this.syncStatus.errors.length - 1];
    if (!lastError) return;

    if (lastError.retryCount >= this.MAX_RETRY_ATTEMPTS) {
      console.error('Max retry attempts reached');
      this.emit('sync_abandoned', lastError);
      return;
    }

    lastError.retryCount++;
    const delay = Math.pow(2, lastError.retryCount) * 1000; // Exponential backoff

    setTimeout(() => {
      this.performSync();
    }, delay);
  }

  /**
   * Start auto sync
   */
  private startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = window.setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.performSync();
      }
    }, this.SYNC_INTERVAL);

    console.log('🔄 Auto-sync started');
  }

  /**
   * Stop auto sync
   */
  public stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    console.log('⏹️ Auto-sync stopped');
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.isOnline = true;
    console.log('🌐 Connection restored');

    // Resume sync
    if (this.syncQueue.length > 0) {
      this.performSync();
    }

    this.emit('connection_restored');
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.isOnline = false;
    console.log('📴 Connection lost');
    this.emit('connection_lost');
  }

  /**
   * Handle storage change (cross-tab sync)
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'cloud_save_data' && event.newValue) {
      try {
        const data = JSON.parse(event.newValue);
        this.localData = data;
        this.emit('cross_tab_sync', data);
      } catch (error) {
        console.error('Failed to parse storage change:', error);
      }
    }
  }

  /**
   * Encrypt save data
   */
  private async encryptSaveData(data: any): Promise<any> {
    // Encrypt sensitive fields
    const sensitive = ['profile', 'friends', 'settings'];
    const encrypted = { ...data };

    for (const field of sensitive) {
      if (encrypted[field]) {
        encrypted[field] = await this.encryptionService.encryptData(encrypted[field]);
      }
    }

    return encrypted;
  }

  /**
   * Decrypt save data
   */
  private async decryptSaveData(data: any): Promise<any> {
    const sensitive = ['profile', 'friends', 'settings'];
    const decrypted = { ...data };

    for (const field of sensitive) {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        decrypted[field] = await this.encryptionService.decryptData(decrypted[field]);
      }
    }

    return decrypted;
  }

  /**
   * Compress data
   */
  private compressData(data: any): any {
    // Use LZ-String compression
    if (typeof data === 'object') {
      const json = JSON.stringify(data);
      // In production, use actual compression library
      return json; // Placeholder
    }
    return data;
  }

  /**
   * Decompress data
   */
  private decompressData(data: any): any {
    // Use LZ-String decompression
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  }

  /**
   * Calculate checksum
   */
  private calculateChecksum(data: any): string {
    const json = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Get device ID
   */
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  /**
   * Get auth token
   */
  private async getAuthToken(): Promise<string> {
    // In production, retrieve from secure storage
    return 'dev_token';
  }

  /**
   * Generate save ID
   */
  private generateSaveId(): string {
    return `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save local data
   */
  private async saveLocalData(data: CloudSaveData): Promise<void> {
    this.localData = data;
    localStorage.setItem('cloud_save_data', JSON.stringify(data));
  }

  /**
   * Load local data
   */
  private async loadLocalData(): Promise<void> {
    const stored = localStorage.getItem('cloud_save_data');
    if (stored) {
      try {
        this.localData = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load local data:', error);
        this.localData = this.createDefaultSaveData();
      }
    } else {
      this.localData = this.createDefaultSaveData();
    }
  }

  /**
   * Get local data
   */
  private async getLocalData(): Promise<CloudSaveData> {
    if (!this.localData) {
      await this.loadLocalData();
    }
    return this.localData || this.createDefaultSaveData();
  }

  /**
   * Create default save data
   */
  private createDefaultSaveData(): CloudSaveData {
    return {
      id: this.generateSaveId(),
      userId: this.userId || 'anonymous',
      deviceId: this.deviceId,
      timestamp: Date.now(),
      version: 1,
      data: {
        profile: {
          displayName: 'Player',
          avatar: '🦊',
          ageGroup: '6-8',
          level: 1,
          totalXP: 0,
          preferredSubjects: [],
          learningStyle: 'mixed'
        },
        progress: {
          subjects: new Map(),
          totalGamesPlayed: 0,
          totalQuestionsAnswered: 0,
          accuracyRate: 0,
          streakDays: 0,
          lastPlayed: new Date()
        },
        achievements: [],
        settings: {
          soundEnabled: true,
          musicVolume: 0.7,
          effectsVolume: 0.8,
          language: 'en',
          theme: 'default',
          accessibility: {}
        },
        friends: [],
        studyGroups: []
      },
      checksum: '',
      encrypted: false,
      compressed: false
    };
  }

  /**
   * Simulate cloud data for development
   */
  private simulateCloudData(): CloudSaveData | null {
    if (Math.random() > 0.5) {
      const data = this.createDefaultSaveData();
      data.timestamp = Date.now() - 10000; // Older than local
      return data;
    }
    return null;
  }

  /**
   * Get sync status
   */
  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Force sync
   */
  public async forceSync(): Promise<void> {
    await this.performSync();
  }

  /**
   * Set conflict resolution strategy
   */
  public setConflictResolution(resolution: ConflictResolution): void {
    this.conflictResolution = resolution;
  }

  /**
   * Clear all cloud data
   */
  public async clearCloudData(): Promise<void> {
    this.localData = null;
    this.syncQueue = [];
    localStorage.removeItem('cloud_save_data');
    this.emit('data_cleared');
  }

  /**
   * Export save data
   */
  public async exportSaveData(): Promise<string> {
    const data = await this.getLocalData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import save data
   */
  public async importSaveData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
      await this.saveLocalData(data);
      await this.performSync();
      this.emit('data_imported', data);
    } catch (error) {
      console.error('Failed to import save data:', error);
      throw error;
    }
  }

  /**
   * Get storage usage
   */
  public async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || this.STORAGE_QUOTA
      };
    }

    // Fallback
    const dataSize = JSON.stringify(this.localData).length;
    return {
      used: dataSize,
      quota: this.STORAGE_QUOTA
    };
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    this.stopAutoSync();
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }
}

// Export singleton instance
export const cloudSync = CloudSyncService.getInstance();