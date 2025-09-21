/**
 * DatabaseService Test Factory
 *
 * Provides controlled instantiation of DatabaseService for testing environments.
 * This factory respects the singleton pattern while enabling proper test isolation.
 */

import { DatabaseService } from '../database/DatabaseService';
import { vi } from 'vitest';

/**
 * Test factory for creating DatabaseService instances with proper dependency injection
 * This allows tests to bypass the private constructor limitation while maintaining
 * the singleton pattern in production code.
 */
export class DatabaseServiceTestFactory {
  private static testInstance: DatabaseService | null = null;

  /**
   * Creates or retrieves a test instance of DatabaseService
   * Uses the getInstance method which properly handles the singleton pattern
   */
  static getTestInstance(): DatabaseService {
    if (!this.testInstance) {
      // Use the public getInstance method which handles the singleton pattern correctly
      this.testInstance = DatabaseService.getInstance();
    }
    return this.testInstance;
  }

  /**
   * Creates a fresh test instance with mocked encryption service
   * This is useful for tests that need complete isolation
   */
  static createIsolatedTestInstance(): DatabaseService {
    // Create mock encryption service for testing
    const mockEncryptionService = {
      encrypt: vi.fn().mockImplementation((data: string) => `encrypted_${data}`),
      decrypt: vi.fn().mockImplementation((data: string) => data.replace('encrypted_', '')),
      hash: vi.fn().mockImplementation((data: string) => `hashed_${data}`),
      hashPassword: vi.fn().mockImplementation((password: string) => `hashed_${password}`),
      verifyPassword: vi.fn().mockReturnValue(true)
    };

    // Use getInstance with mock encryption service parameter for testing
    return DatabaseService.getInstance(mockEncryptionService);
  }

  /**
   * Resets the test instance for clean test isolation
   * Call this in test teardown to ensure tests don't interfere with each other
   */
  static resetTestInstance(): void {
    this.testInstance = null;
    // Note: The actual singleton instance remains intact for production use
  }

  /**
   * Gets the production singleton instance
   * This maintains the singleton pattern while being explicit about test vs production usage
   */
  static getProductionInstance(): DatabaseService {
    return DatabaseService.getInstance();
  }
}

/**
 * Convenience function for tests that need a DatabaseService instance
 * Uses the singleton pattern correctly without trying to access private constructor
 */
export function createTestDatabaseService(): DatabaseService {
  return DatabaseServiceTestFactory.getTestInstance();
}

/**
 * Convenience function for tests that need complete isolation
 * Creates instance with mocked dependencies
 */
export function createIsolatedTestDatabaseService(): DatabaseService {
  return DatabaseServiceTestFactory.createIsolatedTestInstance();
}

export default DatabaseServiceTestFactory;