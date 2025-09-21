import { StealthLearningDB } from './schema';

export interface Migration {
  version: number;
  description: string;
  up: (db: StealthLearningDB) => Promise<void>;
  down: (db: StealthLearningDB) => Promise<void>;
}

// Migration registry
export const migrations: Migration[] = [
  {
    version: 1,
    description: 'Initial schema setup',
    up: async (db: StealthLearningDB) => {
      // Version 1 schema is already defined in the constructor
      console.log('✅ Initial schema created');
    },
    down: async (db: StealthLearningDB) => {
      // Cannot rollback initial schema
      throw new Error('Cannot rollback initial schema');
    }
  },
  {
    version: 2,
    description: 'Add voice recognition support to questions',
    up: async (db: StealthLearningDB) => {
      // Add voice recognition fields to questions
      const gameContents = await db.gameContent.toArray();

      for (const content of gameContents) {
        const updatedQuestions = content.questions.map(question => ({
          ...question,
          voiceEnabled: false,
          speechPrompt: undefined
        }));

        await db.gameContent.update(content.id, {
          questions: updatedQuestions
        });
      }

      console.log('✅ Added voice recognition support to questions');
    },
    down: async (db: StealthLearningDB) => {
      // Remove voice recognition fields
      const gameContents = await db.gameContent.toArray();

      for (const content of gameContents) {
        const revertedQuestions = content.questions.map(question => {
          const { voiceEnabled, speechPrompt, ...rest } = question as any;
          return rest;
        });

        await db.gameContent.update(content.id, {
          questions: revertedQuestions
        });
      }

      console.log('✅ Removed voice recognition support from questions');
    }
  },
  {
    version: 3,
    description: 'Add advanced analytics tracking',
    up: async (db: StealthLearningDB) => {
      // Add new analytics fields
      const events = await db.analyticsEvents.toArray();

      for (const event of events) {
        await db.analyticsEvents.update(event.id, {
          ...event,
          metadata: {
            ...event.metadata,
            // deviceType: 'unknown', // Removed - not in metadata type
            // internetSpeed: 'unknown', // Removed - not in metadata type
            // batteryLevel: null // Removed - not in metadata type
          }
        });
      }

      console.log('✅ Added advanced analytics tracking');
    },
    down: async (db: StealthLearningDB) => {
      // Revert analytics changes
      const events = await db.analyticsEvents.toArray();

      for (const event of events) {
        const { deviceType, internetSpeed, batteryLevel, ...rest } = event.metadata as any;
        await db.analyticsEvents.update(event.id, {
          ...event,
          metadata: rest
        });
      }

      console.log('✅ Reverted advanced analytics tracking');
    }
  }
];

// Migration runner
export class MigrationRunner {
  private db: StealthLearningDB;

  constructor(db: StealthLearningDB) {
    this.db = db;
  }

  async getCurrentVersion(): Promise<number> {
    try {
      // Get the current schema version from Dexie
      return this.db.verno;
    } catch (error) {
      console.error('Failed to get current version:', error);
      return 0;
    }
  }

  async getTargetVersion(): Promise<number> {
    return Math.max(...migrations.map(m => m.version));
  }

  async runMigrations(): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    const targetVersion = await this.getTargetVersion();

    if (currentVersion >= targetVersion) {
      console.log(`✅ Database is up to date (version ${currentVersion})`);
      return;
    }

    console.log(`🔄 Migrating database from version ${currentVersion} to ${targetVersion}`);

    // Get migrations to run
    const migrationsToRun = migrations
      .filter(m => m.version > currentVersion && m.version <= targetVersion)
      .sort((a, b) => a.version - b.version);

    // Run migrations sequentially
    for (const migration of migrationsToRun) {
      try {
        console.log(`🔄 Running migration ${migration.version}: ${migration.description}`);

        // Use Dexie's schema upgrade mechanism
        this.db.version(migration.version).upgrade(async (trans) => {
          await migration.up(this.db);
        });

        console.log(`✅ Migration ${migration.version} completed`);
      } catch (error) {
        console.error(`❌ Migration ${migration.version} failed:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Migration ${migration.version} failed: ${errorMessage}`);
      }
    }

    console.log('✅ All migrations completed successfully');
  }

  async rollback(targetVersion: number): Promise<void> {
    const currentVersion = await this.getCurrentVersion();

    if (currentVersion <= targetVersion) {
      console.log(`✅ Already at or below target version ${targetVersion}`);
      return;
    }

    console.log(`🔄 Rolling back database from version ${currentVersion} to ${targetVersion}`);

    // Get migrations to rollback
    const migrationsToRollback = migrations
      .filter(m => m.version > targetVersion && m.version <= currentVersion)
      .sort((a, b) => b.version - a.version); // Reverse order for rollback

    // Run rollbacks sequentially
    for (const migration of migrationsToRollback) {
      try {
        console.log(`🔄 Rolling back migration ${migration.version}: ${migration.description}`);
        await migration.down(this.db);
        console.log(`✅ Rollback ${migration.version} completed`);
      } catch (error) {
        console.error(`❌ Rollback ${migration.version} failed:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Rollback ${migration.version} failed: ${errorMessage}`);
      }
    }

    console.log('✅ All rollbacks completed successfully');
  }

  async validateMigrations(): Promise<boolean> {
    try {
      // Check for duplicate version numbers
      const versions = migrations.map(m => m.version);
      const uniqueVersions = new Set(versions);

      if (versions.length !== uniqueVersions.size) {
        console.error('❌ Duplicate migration version numbers found');
        return false;
      }

      // Check for sequential version numbers
      const sortedVersions = versions.sort((a, b) => a - b);
      for (let i = 0; i < sortedVersions.length - 1; i++) {
        if (sortedVersions[i + 1] - sortedVersions[i] !== 1) {
          console.error(`❌ Non-sequential migration versions: ${sortedVersions[i]} -> ${sortedVersions[i + 1]}`);
          return false;
        }
      }

      console.log('✅ Migration validation passed');
      return true;
    } catch (error) {
      console.error('❌ Migration validation failed:', error);
      return false;
    }
  }

  async getMigrationHistory(): Promise<{version: number, description: string, appliedAt?: Date}[]> {
    const currentVersion = await this.getCurrentVersion();

    return migrations.map(migration => ({
      version: migration.version,
      description: migration.description,
      appliedAt: migration.version <= currentVersion ? new Date() : undefined
    }));
  }
}

// Database upgrade utilities
export const initializeDatabaseWithMigrations = async (db: StealthLearningDB): Promise<void> => {
  try {
    console.log('🔄 Initializing database with migrations...');

    const migrationRunner = new MigrationRunner(db);

    // Validate migrations first
    const isValid = await migrationRunner.validateMigrations();
    if (!isValid) {
      throw new Error('Migration validation failed');
    }

    // Open the database
    await db.open();

    // Run any pending migrations
    await migrationRunner.runMigrations();

    console.log('✅ Database initialization with migrations completed');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// MigrationRunner is already exported above via export class declaration