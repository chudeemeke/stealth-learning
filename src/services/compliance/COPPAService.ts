/**
 * COPPA Compliance Service
 * Ensures adherence to Children's Online Privacy Protection Act
 */

import { ultraEncryption } from '@/services/security/UltraEncryptionService';
import { inputValidator } from '@/services/security/InputValidationService';
import { securityConfig } from '@/config/security-wrapper';

interface DataCollectionConsent {
  parentId: string;
  childId: string;
  consentType: 'limited' | 'full' | 'none';
  dataTypes: string[];
  consentDate: Date;
  expiryDate: Date;
  ipAddress?: string;
  parentSignature: string;
}

interface DataMinimization {
  purpose: string;
  dataTypes: string[];
  retentionPeriod: number; // days
  necessityJustification: string;
}

interface ParentalControl {
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  allowCommunication: boolean;
  allowThirdPartyIntegration: boolean;
  maxSessionTime: number; // minutes
  allowedSubjects: string[];
  blockedFeatures: string[];
}

class COPPAService {
  private static instance: COPPAService;

  // Data minimization rules
  private readonly dataMinimizationRules: DataMinimization[] = [
    {
      purpose: 'Educational Progress Tracking',
      dataTypes: ['game_scores', 'learning_progress', 'skill_levels'],
      retentionPeriod: 365, // 1 year
      necessityJustification: 'Essential for adaptive learning and progress tracking'
    },
    {
      purpose: 'User Experience Optimization',
      dataTypes: ['user_preferences', 'accessibility_settings'],
      retentionPeriod: 365,
      necessityJustification: 'Required to maintain personalized learning experience'
    },
    {
      purpose: 'Safety and Security',
      dataTypes: ['login_attempts', 'session_data', 'device_fingerprint'],
      retentionPeriod: 90,
      necessityJustification: 'Necessary for protecting child accounts from unauthorized access'
    }
  ];

  // Prohibited data collection for children under 13
  private readonly prohibitedDataTypes = [
    'email_address',
    'phone_number',
    'physical_address',
    'photo',
    'video',
    'audio_recording',
    'location_data',
    'biometric_data',
    'social_security_number',
    'behavioral_advertising_data'
  ];

  constructor() {
    this.validateCOPPACompliance();
  }

  static getInstance(): COPPAService {
    if (!COPPAService.instance) {
      COPPAService.instance = new COPPAService();
    }
    return COPPAService.instance;
  }

  /**
   * Validate COPPA compliance on service initialization
   */
  private validateCOPPACompliance(): void {
    try {
      console.log('🔒 Initializing COPPA compliance service...');

      // Check if parental verification is enabled
      if (!securityConfig.ENABLE_PARENTAL_VERIFICATION) {
        console.error('🔒 COPPA VIOLATION: Parental verification must be enabled');
        throw new Error('COPPA compliance requires parental verification');
      }

      // Validate data retention period
      if (securityConfig.DATA_RETENTION_DAYS > 365) {
        console.warn('🔒 COPPA WARNING: Data retention period exceeds recommended 1 year');
      }

      console.log('✅ COPPA compliance service initialized');

    } catch (error) {
      console.error('🔒 COPPA compliance initialization failed:', error);
      throw error;
    }
  }

  /**
   * Check if data collection is permitted for a specific child
   */
  async isDataCollectionPermitted(
    childId: string,
    dataType: string,
    purpose: string
  ): Promise<{ permitted: boolean; reason?: string }> {
    try {
      // Check if data type is prohibited for children
      if (this.prohibitedDataTypes.includes(dataType)) {
        return {
          permitted: false,
          reason: `Data type '${dataType}' is prohibited under COPPA`
        };
      }

      // Get parental consent
      const consent = await this.getParentalConsent(childId);
      if (!consent) {
        return {
          permitted: false,
          reason: 'No parental consent found'
        };
      }

      // Check if consent covers this data type
      if (!consent.dataTypes.includes(dataType)) {
        return {
          permitted: false,
          reason: `Parental consent does not cover '${dataType}'`
        };
      }

      // Check if consent is still valid
      if (consent.expiryDate < new Date()) {
        return {
          permitted: false,
          reason: 'Parental consent has expired'
        };
      }

      // Check data minimization rules
      const minimizationRule = this.dataMinimizationRules.find(rule =>
        rule.purpose === purpose && rule.dataTypes.includes(dataType)
      );

      if (!minimizationRule) {
        return {
          permitted: false,
          reason: `No data minimization rule found for purpose '${purpose}'`
        };
      }

      return { permitted: true };

    } catch (error) {
      console.error('🔒 Data collection permission check failed:', error);
      return {
        permitted: false,
        reason: 'Error checking data collection permissions'
      };
    }
  }

  /**
   * Record parental consent
   */
  async recordParentalConsent(consent: Omit<DataCollectionConsent, 'consentDate'>): Promise<boolean> {
    try {
      // Validate parent signature
      const signatureValidation = inputValidator.validateText(consent.parentSignature, 100);
      if (!signatureValidation.isValid) {
        throw new Error('Invalid parent signature');
      }

      // Encrypt and store consent
      const consentRecord: DataCollectionConsent = {
        ...consent,
        consentDate: new Date(),
        parentSignature: signatureValidation.sanitized!
      };

      const encryptedConsent = ultraEncryption.encryptObject(consentRecord);
      const consentKey = `coppa_consent_${consent.childId}`;

      localStorage.setItem(consentKey, JSON.stringify(encryptedConsent));

      console.log('✅ Parental consent recorded for child:', consent.childId);
      return true;

    } catch (error) {
      console.error('🔒 Failed to record parental consent:', error);
      return false;
    }
  }

  /**
   * Get parental consent for a child
   */
  async getParentalConsent(childId: string): Promise<DataCollectionConsent | null> {
    try {
      const consentKey = `coppa_consent_${childId}`;
      const encryptedConsent = localStorage.getItem(consentKey);

      if (!encryptedConsent) {
        return null;
      }

      const consentData = JSON.parse(encryptedConsent);
      const consent = ultraEncryption.decryptObject<DataCollectionConsent>(consentData);

      return consent;

    } catch (error) {
      console.error('🔒 Failed to retrieve parental consent:', error);
      return null;
    }
  }

  /**
   * Revoke parental consent
   */
  async revokeParentalConsent(childId: string, parentId: string): Promise<boolean> {
    try {
      // Verify parent identity
      const consent = await this.getParentalConsent(childId);
      if (!consent || consent.parentId !== parentId) {
        throw new Error('Unauthorized consent revocation attempt');
      }

      // Remove consent record
      const consentKey = `coppa_consent_${childId}`;
      localStorage.removeItem(consentKey);

      // Trigger data deletion process
      await this.deleteChildData(childId);

      console.log('✅ Parental consent revoked and data deleted for child:', childId);
      return true;

    } catch (error) {
      console.error('🔒 Failed to revoke parental consent:', error);
      return false;
    }
  }

  /**
   * Delete all data for a child (right to be forgotten)
   */
  async deleteChildData(childId: string): Promise<boolean> {
    try {
      // Get all localStorage keys related to the child
      const keysToDelete: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes(childId) || key.includes(`child_${childId}`))) {
          keysToDelete.push(key);
        }
      }

      // Delete all child-related data
      keysToDelete.forEach(key => {
        localStorage.removeItem(key);
      });

      console.log(`✅ Deleted ${keysToDelete.length} data items for child:`, childId);
      return true;

    } catch (error) {
      console.error('🔒 Failed to delete child data:', error);
      return false;
    }
  }

  /**
   * Get data retention period for a data type
   */
  getDataRetentionPeriod(dataType: string, purpose: string): number {
    const rule = this.dataMinimizationRules.find(rule =>
      rule.purpose === purpose && rule.dataTypes.includes(dataType)
    );

    return rule ? rule.retentionPeriod : 30; // Default 30 days
  }

  /**
   * Clean up expired data
   */
  async cleanupExpiredData(): Promise<void> {
    try {
      const now = Date.now();
      const keysToDelete: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        try {
          const data = localStorage.getItem(key);
          if (!data) continue;

          // Check if data has timestamp and is expired
          const parsed = JSON.parse(data);
          if (parsed.timestamp) {
            const age = now - parsed.timestamp;
            const maxAge = securityConfig.DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000;

            if (age > maxAge) {
              keysToDelete.push(key);
            }
          }
        } catch {
          // Skip non-JSON data
          continue;
        }
      }

      // Delete expired data
      keysToDelete.forEach(key => {
        localStorage.removeItem(key);
      });

      if (keysToDelete.length > 0) {
        console.log(`✅ Cleaned up ${keysToDelete.length} expired data items`);
      }

    } catch (error) {
      console.error('🔒 Failed to cleanup expired data:', error);
    }
  }

  /**
   * Generate COPPA compliance report
   */
  async generateComplianceReport(): Promise<{
    totalChildren: number;
    childrenWithConsent: number;
    dataRetentionCompliance: boolean;
    prohibitedDataFound: string[];
    expiredConsents: number;
  }> {
    try {
      let totalChildren = 0;
      let childrenWithConsent = 0;
      let expiredConsents = 0;
      const prohibitedDataFound: string[] = [];

      // Scan localStorage for child data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        // Count children
        if (key.includes('child_profile_')) {
          totalChildren++;
        }

        // Count consents
        if (key.includes('coppa_consent_')) {
          try {
            const childId = key.replace('coppa_consent_', '');
            const consent = await this.getParentalConsent(childId);

            if (consent) {
              childrenWithConsent++;

              if (consent.expiryDate < new Date()) {
                expiredConsents++;
              }
            }
          } catch {
            // Skip invalid consent records
            continue;
          }
        }

        // Check for prohibited data
        this.prohibitedDataTypes.forEach(prohibitedType => {
          if (key.includes(prohibitedType)) {
            prohibitedDataFound.push(`${prohibitedType} found in ${key}`);
          }
        });
      }

      return {
        totalChildren,
        childrenWithConsent,
        dataRetentionCompliance: securityConfig.DATA_RETENTION_DAYS <= 365,
        prohibitedDataFound,
        expiredConsents
      };

    } catch (error) {
      console.error('🔒 Failed to generate compliance report:', error);
      throw error;
    }
  }

  /**
   * Verify parental email (placeholder for server-side implementation)
   */
  async verifyParentalEmail(email: string): Promise<{ verified: boolean; verificationToken?: string }> {
    try {
      const emailValidation = inputValidator.validateEmail(email);
      if (!emailValidation.isValid) {
        return { verified: false };
      }

      // In production, this would send a verification email
      console.log('🔒 Parental email verification required for:', emailValidation.sanitized);

      // Generate verification token
      const verificationToken = ultraEncryption.generateSecureToken(32);

      return {
        verified: false, // Requires actual email verification
        verificationToken
      };

    } catch (error) {
      console.error('🔒 Parental email verification failed:', error);
      return { verified: false };
    }
  }
}

// Export singleton instance
export const coppaService = COPPAService.getInstance();
export default COPPAService;