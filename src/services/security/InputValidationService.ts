/**
 * Ultra-Secure Input Validation Service
 * Comprehensive sanitization and validation for all user inputs
 */

import DOMPurify from 'dompurify';
import { z } from 'zod';

interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: string[];
  sanitized?: T;
}

class InputValidationService {
  private static instance: InputValidationService;

  // Common validation patterns
  private readonly patterns = {
    // Child-safe name: letters, spaces, hyphens, apostrophes only
    childName: /^[a-zA-Z\s\-']{1,50}$/,

    // Parent email: RFC 5322 compliant but stricter
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // Safe usernames: alphanumeric plus underscore/dash
    username: /^[a-zA-Z0-9_-]{3,20}$/,

    // Game content IDs: strict alphanumeric with dashes
    gameId: /^[a-zA-Z0-9-]{1,50}$/,

    // PIN: 4-6 digits only
    pin: /^\d{4,6}$/,

    // Age groups
    ageGroup: /^(3-5|6-8|9\+?)$/,

    // Subject codes
    subject: /^(math|english|science)$/i,

    // UUID format
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  };

  // Schema definitions using Zod
  private readonly schemas = {
    // Child profile validation
    childProfile: z.object({
      name: z.string()
        .min(1, 'Name is required')
        .max(50, 'Name must be less than 50 characters')
        .regex(this.patterns.childName, 'Name contains invalid characters'),

      age: z.number()
        .int('Age must be a whole number')
        .min(3, 'Minimum age is 3')
        .max(12, 'Maximum age is 12'),

      ageGroup: z.enum(['3-5', '6-8', '9+'], {
        errorMap: () => ({ message: 'Invalid age group' })
      }),

      grade: z.string()
        .max(20, 'Grade must be less than 20 characters')
        .optional(),

      avatarId: z.string()
        .regex(this.patterns.uuid, 'Invalid avatar ID format')
        .optional()
    }),

    // Parent profile validation
    parentProfile: z.object({
      firstName: z.string()
        .min(1, 'First name is required')
        .max(50, 'First name must be less than 50 characters')
        .regex(this.patterns.childName, 'First name contains invalid characters'),

      lastName: z.string()
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters')
        .regex(this.patterns.childName, 'Last name contains invalid characters'),

      email: z.string()
        .email('Invalid email format')
        .regex(this.patterns.email, 'Email format not allowed')
        .max(100, 'Email must be less than 100 characters'),

      timezone: z.string()
        .max(50, 'Timezone must be less than 50 characters')
    }),

    // Authentication validation
    authentication: z.object({
      email: z.string()
        .email('Invalid email format')
        .regex(this.patterns.email, 'Email format not allowed'),

      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),

      pin: z.string()
        .regex(this.patterns.pin, 'PIN must be 4-6 digits')
        .optional()
    }),

    // Game data validation
    gameData: z.object({
      gameId: z.string()
        .regex(this.patterns.gameId, 'Invalid game ID format'),

      score: z.number()
        .int('Score must be a whole number')
        .min(0, 'Score cannot be negative')
        .max(10000, 'Score exceeds maximum'),

      timeElapsed: z.number()
        .min(0, 'Time cannot be negative')
        .max(3600, 'Session time exceeds maximum (1 hour)'),

      answers: z.array(z.object({
        questionId: z.string().max(100),
        answer: z.string().max(500),
        isCorrect: z.boolean(),
        timeSpent: z.number().min(0).max(300)
      })).max(100, 'Too many answers')
    }),

    // Preferences validation
    preferences: z.object({
      soundEnabled: z.boolean(),
      musicVolume: z.number().min(0).max(1),
      effectsVolume: z.number().min(0).max(1),
      subtitlesEnabled: z.boolean(),
      colorMode: z.enum(['bright', 'soft', 'high-contrast']),
      fontSize: z.enum(['small', 'medium', 'large']),
      animationSpeed: z.enum(['slow', 'normal', 'fast'])
    })
  };

  constructor() {
    this.initializeDOMPurify();
  }

  static getInstance(): InputValidationService {
    if (!InputValidationService.instance) {
      InputValidationService.instance = new InputValidationService();
    }
    return InputValidationService.instance;
  }

  /**
   * Configure DOMPurify with secure settings
   */
  private initializeDOMPurify(): void {
    // Configure DOMPurify for maximum security
    DOMPurify.setConfig({
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [], // No attributes allowed
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
      FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'frame'],
      KEEP_CONTENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      SANITIZE_DOM: true,
      WHOLE_DOCUMENT: false
    });

    console.log('✅ DOMPurify initialized with ultra-secure configuration');
  }

  /**
   * Sanitize text input to remove any HTML/script content
   */
  sanitizeText(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    // First pass: DOMPurify sanitization
    let sanitized = DOMPurify.sanitize(input, { RETURN_DOM_FRAGMENT: false });

    // Second pass: Additional character filtering
    sanitized = sanitized
      .replace(/[<>]/g, '') // Remove any remaining angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/data:/gi, '') // Remove data: protocols
      .replace(/vbscript:/gi, '') // Remove vbscript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();

    return sanitized;
  }

  /**
   * Validate child profile data
   */
  validateChildProfile(data: unknown): ValidationResult<z.infer<typeof this.schemas.childProfile>> {
    return this.validate(this.schemas.childProfile, data);
  }

  /**
   * Validate parent profile data
   */
  validateParentProfile(data: unknown): ValidationResult<z.infer<typeof this.schemas.parentProfile>> {
    return this.validate(this.schemas.parentProfile, data);
  }

  /**
   * Validate authentication data
   */
  validateAuthentication(data: unknown): ValidationResult<z.infer<typeof this.schemas.authentication>> {
    return this.validate(this.schemas.authentication, data);
  }

  /**
   * Validate game data
   */
  validateGameData(data: unknown): ValidationResult<z.infer<typeof this.schemas.gameData>> {
    return this.validate(this.schemas.gameData, data);
  }

  /**
   * Validate user preferences
   */
  validatePreferences(data: unknown): ValidationResult<z.infer<typeof this.schemas.preferences>> {
    return this.validate(this.schemas.preferences, data);
  }

  /**
   * Generic validation function with sanitization
   */
  private validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
    try {
      // First sanitize string fields if data is an object
      const sanitizedData = this.sanitizeObjectStrings(data);

      // Validate with Zod schema
      const result = schema.safeParse(sanitizedData);

      if (result.success) {
        return {
          isValid: true,
          data: result.data,
          sanitized: result.data,
          errors: []
        };
      } else {
        return {
          isValid: false,
          errors: result.error.errors.map(err =>
            `${err.path.join('.')}: ${err.message}`
          )
        };
      }
    } catch (error) {
      return {
        isValid: false,
        errors: ['Validation error: ' + (error as Error).message]
      };
    }
  }

  /**
   * Recursively sanitize string fields in objects
   */
  private sanitizeObjectStrings(obj: unknown): unknown {
    if (typeof obj === 'string') {
      return this.sanitizeText(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObjectStrings(item));
    }

    if (obj && typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObjectStrings(value);
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Validate and sanitize free-form text (like game answers)
   */
  validateText(text: string, maxLength: number = 500): ValidationResult<string> {
    try {
      const sanitized = this.sanitizeText(text);

      const errors: string[] = [];

      if (sanitized.length === 0 && text.length > 0) {
        errors.push('Text contains invalid content');
      }

      if (sanitized.length > maxLength) {
        errors.push(`Text exceeds maximum length of ${maxLength} characters`);
      }

      return {
        isValid: errors.length === 0,
        data: sanitized,
        sanitized,
        errors
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Text validation failed']
      };
    }
  }

  /**
   * Validate UUID format
   */
  validateUUID(uuid: string): boolean {
    return this.patterns.uuid.test(uuid);
  }

  /**
   * Validate email format with additional security checks
   */
  validateEmail(email: string): ValidationResult<string> {
    try {
      const sanitized = this.sanitizeText(email);

      const errors: string[] = [];

      if (!this.patterns.email.test(sanitized)) {
        errors.push('Invalid email format');
      }

      // Additional security checks
      if (sanitized.includes('..')) {
        errors.push('Email contains consecutive dots');
      }

      if (sanitized.startsWith('.') || sanitized.endsWith('.')) {
        errors.push('Email cannot start or end with a dot');
      }

      return {
        isValid: errors.length === 0,
        data: sanitized,
        sanitized,
        errors
      };
    } catch (error) {
      return {
        isValid: false,
        errors: ['Email validation failed']
      };
    }
  }

  /**
   * Check for potential security threats in input
   */
  detectSecurityThreats(input: string): string[] {
    const threats: string[] = [];

    const threatPatterns = [
      { pattern: /<script/i, threat: 'Script injection attempt' },
      { pattern: /javascript:/i, threat: 'JavaScript protocol detected' },
      { pattern: /on\w+=/i, threat: 'Event handler detected' },
      { pattern: /data:.*base64/i, threat: 'Base64 data URI detected' },
      { pattern: /eval\(/i, threat: 'Code evaluation attempt' },
      { pattern: /document\./i, threat: 'DOM manipulation attempt' },
      { pattern: /window\./i, threat: 'Window object access attempt' },
      { pattern: /alert\(/i, threat: 'Alert function call detected' },
      { pattern: /confirm\(/i, threat: 'Confirm dialog detected' },
      { pattern: /prompt\(/i, threat: 'Prompt dialog detected' }
    ];

    threatPatterns.forEach(({ pattern, threat }) => {
      if (pattern.test(input)) {
        threats.push(threat);
      }
    });

    return threats;
  }
}

// Export singleton instance
export const inputValidator = InputValidationService.getInstance();
export default InputValidationService;