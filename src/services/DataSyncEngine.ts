import { DatabaseService, EncryptionService } from './database/DatabaseService';
import { LearningAnalyticsEngine } from './analytics/LearningAnalytics';
import {
  StudentModel,
  PerformanceRecord,
  SpacedRepetitionCard,
  GameState,
  Achievement,
  LearningSession,
} from '@/types';

// Sync operation types
export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncStatus = 'pending' | 'syncing' | 'completed' | 'failed' | 'conflict';
export type ConflictResolutionStrategy = 'server_wins' | 'client_wins' | 'merge' | 'manual';

// Sync record structure
export interface SyncRecord {
  id: string;
  operation: SyncOperation;
  entityType: string;
  entityId: string;
  data: any;
  timestamp: Date;
  status: SyncStatus;
  retryCount: number;
  lastError?: string;
  deviceId: string;
  userId: string;
}

// Conflict data structure
export interface ConflictData {
  id: string;
  entityType: string;
  entityId: string;
  localData: any;
  serverData: any;
  localTimestamp: Date;
  serverTimestamp: Date;
  resolutionStrategy?: ConflictResolutionStrategy;
  resolvedData?: any;
  status: 'pending' | 'resolved' | 'ignored';
}

// Sync configuration
export interface SyncConfig {
  batchSize: number;
  retryAttempts: number;
  conflictResolution: ConflictResolutionStrategy;
  syncInterval: number; // milliseconds
  offlineThreshold: number; // max offline operations before forcing sync
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
}

/**
 * Data Synchronization Engine
 * Handles offline data sync, conflict resolution, and data consistency
 */
export class DataSyncEngine {
  private db: DatabaseService;
  private encryption: EncryptionService;
  private analytics: LearningAnalyticsEngine;
  private syncQueue: SyncRecord[] = [];
  private conflictQueue: ConflictData[] = [];
  private isOnline: boolean = navigator.onLine;
  private isSyncing: boolean = false;
  private lastSyncTimestamp: Date | null = null;
  private syncTimer: NodeJS.Timeout | null = null;
  private deviceId: string;

  private readonly DEFAULT_CONFIG: SyncConfig = {
    batchSize: 50,
    retryAttempts: 3,
    conflictResolution: 'server_wins',
    syncInterval: 30000, // 30 seconds
    offlineThreshold: 100,
    compressionEnabled: true,
    encryptionEnabled: true,
  };

  constructor(
    db: DatabaseService,
    encryption: EncryptionService,
    analytics: LearningAnalyticsEngine,
    config?: Partial<SyncConfig>
  ) {
    this.db = db;
    this.encryption = encryption;
    this.analytics = analytics;
    this.deviceId = this.generateDeviceId();

    // Initialize configuration
    this.config = { ...this.DEFAULT_CONFIG, ...config };

    // Set up network monitoring
    this.setupNetworkMonitoring();

    // Initialize sync queue from storage
    this.initializeSyncQueue();

    // Start periodic sync
    this.startPeriodicSync();
  }

  private config: SyncConfig;

  /**
   * Queue an operation for synchronization
   */
  async queueOperation(
    operation: SyncOperation,
    entityType: string,
    entityId: string,
    data: any,
    userId: string
  ): Promise<string> {
    const syncRecord: SyncRecord = {
      id: this.generateSyncId(),
      operation,
      entityType,
      entityId,
      data: this.config.encryptionEnabled ?
        await this.encryption.encrypt(JSON.stringify(data)) : data,
      timestamp: new Date(),
      status: 'pending',
      retryCount: 0,
      deviceId: this.deviceId,
      userId,
    };

    // Add to in-memory queue
    this.syncQueue.push(syncRecord);

    // Persist to local storage
    await this.persistSyncQueue();

    // Trigger immediate sync if online
    if (this.isOnline && !this.isSyncing) {
      this.performSync();
    }

    // Check offline threshold
    if (this.syncQueue.length >= this.config.offlineThreshold) {
      console.warn('Offline threshold reached. Consider forcing sync.');
    }

    return syncRecord.id;
  }

  /**
   * Perform synchronization with server
   */
  async performSync(): Promise<{ success: number; failed: number; conflicts: number }> {
    if (this.isSyncing || !this.isOnline) {
      return { success: 0, failed: 0, conflicts: 0 };
    }

    this.isSyncing = true;
    let successCount = 0;
    let failedCount = 0;
    let conflictCount = 0;

    try {
      // Process sync queue in batches
      const pendingRecords = this.syncQueue.filter(record =>
        record.status === 'pending' || record.status === 'failed'
      );

      for (let i = 0; i < pendingRecords.length; i += this.config.batchSize) {
        const batch = pendingRecords.slice(i, i + this.config.batchSize);
        const batchResults = await this.processSyncBatch(batch);

        successCount += batchResults.success;
        failedCount += batchResults.failed;
        conflictCount += batchResults.conflicts;
      }

      // Update last sync timestamp
      this.lastSyncTimestamp = new Date();

      // Clean up completed records
      this.syncQueue = this.syncQueue.filter(record =>
        record.status !== 'completed'
      );

      // Persist updated queue
      await this.persistSyncQueue();

      // Process any new conflicts
      if (conflictCount > 0) {
        await this.processConflicts();
      }

    } catch (error) {
      console.error('Sync failed:', error);
      failedCount += this.syncQueue.filter(r => r.status === 'syncing').length;
    } finally {
      this.isSyncing = false;
    }

    return { success: successCount, failed: failedCount, conflicts: conflictCount };
  }

  /**
   * Process a batch of sync records
   */
  private async processSyncBatch(batch: SyncRecord[]): Promise<{ success: number; failed: number; conflicts: number }> {
    let successCount = 0;
    let failedCount = 0;
    let conflictCount = 0;

    // Mark records as syncing
    batch.forEach(record => {
      record.status = 'syncing';
    });

    try {
      // Prepare batch payload
      const payload = await this.prepareBatchPayload(batch);

      // Send to server
      const response = await this.sendBatchToServer(payload);

      // Process response
      for (let i = 0; i < batch.length; i++) {
        const record = batch[i];
        const result = response.results[i];

        if (result.success) {
          record.status = 'completed';
          successCount++;
        } else if (result.conflict) {
          record.status = 'conflict';
          await this.handleConflict(record, result.serverData);
          conflictCount++;
        } else {
          record.status = 'failed';
          record.lastError = result.error;
          record.retryCount++;
          failedCount++;

          // Mark as permanently failed if retry limit exceeded
          if (record.retryCount >= this.config.retryAttempts) {
            record.status = 'failed';
          }
        }
      }

    } catch (error) {
      // Mark all records as failed
      const errorMessage = error instanceof Error ? error.message : String(error);
      batch.forEach(record => {
        record.status = 'failed';
        record.lastError = errorMessage;
        record.retryCount++;
      });
      failedCount = batch.length;
    }

    return { success: successCount, failed: failedCount, conflicts: conflictCount };
  }

  /**
   * Handle conflict detection and resolution
   */
  private async handleConflict(syncRecord: SyncRecord, serverData: any): Promise<void> {
    const localData = this.config.encryptionEnabled ?
      JSON.parse(await this.encryption.decrypt(syncRecord.data)) : syncRecord.data;

    const conflict: ConflictData = {
      id: this.generateConflictId(),
      entityType: syncRecord.entityType,
      entityId: syncRecord.entityId,
      localData,
      serverData,
      localTimestamp: syncRecord.timestamp,
      serverTimestamp: new Date(serverData.lastModified),
      resolutionStrategy: this.config.conflictResolution,
      status: 'pending',
    };

    this.conflictQueue.push(conflict);
    await this.persistConflictQueue();
  }

  /**
   * Process conflicts based on resolution strategy
   */
  private async processConflicts(): Promise<void> {
    const pendingConflicts = this.conflictQueue.filter(c => c.status === 'pending');

    for (const conflict of pendingConflicts) {
      try {
        const resolution = await this.resolveConflict(conflict);
        conflict.resolvedData = resolution;
        conflict.status = 'resolved';

        // Apply resolution to local storage
        await this.applyResolution(conflict);

        // Queue the resolved data for sync
        await this.queueOperation(
          'UPDATE',
          conflict.entityType,
          conflict.entityId,
          resolution,
          'system' // system user for conflict resolution
        );

      } catch (error) {
        console.error('Failed to resolve conflict:', conflict.id, error);
      }
    }

    await this.persistConflictQueue();
  }

  /**
   * Resolve conflict based on strategy
   */
  private async resolveConflict(conflict: ConflictData): Promise<any> {
    switch (conflict.resolutionStrategy) {
      case 'server_wins':
        return conflict.serverData;

      case 'client_wins':
        return conflict.localData;

      case 'merge':
        return this.mergeConflictData(conflict);

      case 'manual':
        // For manual resolution, return server data temporarily
        // In a real implementation, this would trigger a UI for user decision
        console.warn('Manual conflict resolution required for:', conflict.id);
        return conflict.serverData;

      default:
        return conflict.serverData;
    }
  }

  /**
   * Merge conflicting data intelligently
   */
  private mergeConflictData(conflict: ConflictData): any {
    const { localData, serverData } = conflict;

    // Intelligent merging based on entity type
    switch (conflict.entityType) {
      case 'student':
        return this.mergeStudentData(localData, serverData);

      case 'performance':
        return this.mergePerformanceData(localData, serverData);

      case 'achievement':
        return this.mergeAchievementData(localData, serverData);

      default:
        // Default merge: prefer non-null values, latest timestamp wins
        return {
          ...serverData,
          ...Object.keys(localData).reduce((acc: Record<string, any>, key) => {
            if (localData[key] !== null && localData[key] !== undefined) {
              acc[key] = localData[key];
            }
            return acc;
          }, {}),
          lastModified: new Date(),
        };
    }
  }

  /**
   * Merge student data with preservation of critical fields
   */
  private mergeStudentData(local: StudentModel, server: StudentModel): StudentModel {
    return {
      ...server,
      // Preserve local learning progress
      skillLevels: this.mergeSkillLevels(local.skillLevels, server.skillLevels),
      performanceHistory: this.mergePerformanceHistory(
        local.performanceHistory,
        server.performanceHistory
      ),
      // Use latest XP and achievements
      xp: Math.max(local.xp || 0, server.xp || 0),
      totalStars: Math.max(local.totalStars || 0, server.totalStars || 0),
      streakCount: Math.max(local.streakCount || 0, server.streakCount || 0),
      // Preserve user preferences
      preferences: { ...server.preferences, ...local.preferences },
      updatedAt: new Date(),
    };
  }

  /**
   * Apply conflict resolution to local storage
   */
  private async applyResolution(conflict: ConflictData): Promise<void> {
    switch (conflict.entityType) {
      case 'student':
        await this.db.updateStudent(conflict.resolvedData);
        break;
      case 'performance':
        await this.db.savePerformanceRecord(conflict.resolvedData);
        break;
      case 'achievement':
        await this.db.updateAchievement(conflict.resolvedData);
        break;
      // Add more entity types as needed
    }
  }

  /**
   * Setup network monitoring
   */
  private setupNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Network connection restored. Starting sync...');
      if (!this.isSyncing) {
        this.performSync();
      }
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Network connection lost. Entering offline mode.');
    });
  }

  /**
   * Start periodic synchronization
   */
  private startPeriodicSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      if (this.isOnline && !this.isSyncing && this.syncQueue.length > 0) {
        this.performSync();
      }
    }, this.config.syncInterval);
  }

  /**
   * Utility methods
   */
  private generateDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  private generateSyncId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConflictId(): string {
    return `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeSyncQueue(): Promise<void> {
    try {
      const stored = localStorage.getItem('syncQueue');
      if (stored) {
        this.syncQueue = JSON.parse(stored).map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to initialize sync queue:', error);
      this.syncQueue = [];
    }
  }

  private async persistSyncQueue(): Promise<void> {
    try {
      localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to persist sync queue:', error);
    }
  }

  private async persistConflictQueue(): Promise<void> {
    try {
      localStorage.setItem('conflictQueue', JSON.stringify(this.conflictQueue));
    } catch (error) {
      console.error('Failed to persist conflict queue:', error);
    }
  }

  // Placeholder methods for server communication
  private async prepareBatchPayload(batch: SyncRecord[]): Promise<any> {
    return {
      deviceId: this.deviceId,
      timestamp: new Date().toISOString(),
      operations: batch.map(record => ({
        id: record.id,
        operation: record.operation,
        entityType: record.entityType,
        entityId: record.entityId,
        data: record.data,
        timestamp: record.timestamp.toISOString(),
      })),
    };
  }

  private async sendBatchToServer(payload: any): Promise<any> {
    // Placeholder for actual server communication
    // In real implementation, this would be an HTTP request
    console.log('Sending batch to server:', payload);

    // Mock response
    return {
      success: true,
      results: payload.operations.map(() => ({ success: true })),
    };
  }

  // Helper methods for data merging
  private mergeSkillLevels(local: Map<string, any>, server: Map<string, any>): Map<string, any> {
    const merged = new Map(server);

    local.forEach((localSkill, skillName) => {
      const serverSkill = server.get(skillName);
      if (!serverSkill || localSkill.lastAssessed > serverSkill.lastAssessed) {
        merged.set(skillName, localSkill);
      }
    });

    return merged;
  }

  private mergePerformanceHistory(local: PerformanceRecord[], server: PerformanceRecord[]): PerformanceRecord[] {
    const combined = [...local, ...server];
    const unique = combined.reduce((acc, record) => {
      if (!acc.find(r => r.id === record.id)) {
        acc.push(record);
      }
      return acc;
    }, [] as PerformanceRecord[]);

    return unique.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private mergePerformanceData(local: PerformanceRecord, server: PerformanceRecord): PerformanceRecord {
    // For performance records, use the one with the latest timestamp
    return local.timestamp > server.timestamp ? local : server;
  }

  private mergeAchievementData(local: Achievement, server: Achievement): Achievement {
    return {
      ...server,
      // Preserve unlock status if achieved locally
      unlockedAt: local.unlockedAt || server.unlockedAt,
      progress: Math.max(local.progress || 0, server.progress || 0),
    };
  }

  /**
   * Public API methods
   */

  // Get sync status
  getSyncStatus(): {
    isOnline: boolean;
    isSyncing: boolean;
    queueLength: number;
    conflictCount: number;
    lastSync: Date | null;
  } {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      queueLength: this.syncQueue.length,
      conflictCount: this.conflictQueue.filter(c => c.status === 'pending').length,
      lastSync: this.lastSyncTimestamp,
    };
  }

  // Force immediate sync
  async forcSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    await this.performSync();
  }

  // Clear sync queue (for debugging)
  clearSyncQueue(): void {
    this.syncQueue = [];
    this.persistSyncQueue();
  }

  // Update sync configuration
  updateConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Restart periodic sync with new interval
    if (newConfig.syncInterval) {
      this.startPeriodicSync();
    }
  }

  // Cleanup
  destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOnline = true;
    if (!this.isSyncing) {
      this.performSync();
    }
  };

  private handleOffline = () => {
    this.isOnline = false;
  };
}

// Export singleton instance factory
export const createDataSyncEngine = (
  db: DatabaseService,
  encryption: EncryptionService,
  analytics: LearningAnalyticsEngine,
  config?: Partial<SyncConfig>
) => {
  return new DataSyncEngine(db, encryption, analytics, config);
};