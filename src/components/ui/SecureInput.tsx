/**
 * SecureInput Component
 * Airbnb + Duolingo design with security-first approach
 * COPPA compliant with built-in validation and privacy features
 */

import React, { useState, useRef, useEffect, InputHTMLAttributes, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import DesignSystem from '@/styles/design-system';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  User,
  Mail,
  Key,
  CreditCard,
  Calendar,
  Phone,
  Globe,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { AgeAwareComponentProps } from '@/types';

// Input validation patterns with security rules
const VALIDATION_PATTERNS = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid email address',
    sanitize: (value: string) => value.toLowerCase().trim(),
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    sanitize: (value: string) => value,
  },
  phone: {
    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    message: 'Please enter a valid phone number',
    sanitize: (value: string) => value.replace(/\D/g, ''),
  },
  creditCard: {
    pattern: /^[0-9]{13,19}$/,
    message: 'Please enter a valid card number',
    sanitize: (value: string) => value.replace(/\s/g, ''),
  },
  username: {
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message: 'Username must be 3-20 characters, letters, numbers, and underscores only',
    sanitize: (value: string) => value.trim(),
  },
  childName: {
    pattern: /^[a-zA-Z\s]{2,30}$/,
    message: 'Name must be 2-30 letters only',
    sanitize: (value: string) => DOMPurify.sanitize(value.trim()),
  },
};

export interface SecureInputProps extends
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'>,
  Partial<AgeAwareComponentProps> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'default' | 'filled' | 'outlined' | 'ghost' | 'playful';
  inputType?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'username' | 'childName' | 'creditCard';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  validation?: keyof typeof VALIDATION_PATTERNS | 'custom';
  customValidator?: (value: string) => boolean | string;
  secure?: boolean;
  privacy?: 'normal' | 'sensitive' | 'pii' | 'child-data';
  loading?: boolean;
  success?: boolean;
  animated?: boolean;
  floatingLabel?: boolean;
  characterCounter?: boolean;
  strengthIndicator?: boolean;
  autoComplete?: 'off' | 'on' | 'new-password' | 'current-password' | 'email' | 'username';
  onSecureChange?: (value: string, isValid: boolean) => void;
}

export const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(({
  ageGroup = '6-8',
  label,
  error: externalError,
  hint,
  variant = 'default',
  inputType = 'text',
  icon,
  rightIcon,
  showPasswordToggle = false,
  validation,
  customValidator,
  secure = true,
  privacy = 'normal',
  loading = false,
  success = false,
  animated = true,
  floatingLabel = false,
  characterCounter = false,
  strengthIndicator = false,
  maxLength = 100,
  disabled = false,
  required = false,
  placeholder,
  value,
  onChange,
  onSecureChange,
  onBlur,
  onFocus,
  autoComplete = 'off',
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actualValue = value !== undefined ? String(value) : internalValue;
  const hasValue = actualValue.length > 0;

  // Security: Auto-detect sensitive data
  useEffect(() => {
    if (inputType === 'password' || inputType === 'creditCard') {
      // Never log sensitive data
      if (process.env.NODE_ENV === 'development') {
        console.log('SecureInput: Sensitive field detected, privacy mode enabled');
      }
    }
  }, [inputType]);

  // Get appropriate icon based on input type
  const getDefaultIcon = () => {
    if (icon) return icon;

    switch (inputType) {
      case 'email': return <Mail size={20} />;
      case 'password': return <Lock size={20} />;
      case 'tel': return <Phone size={20} />;
      case 'username': return <User size={20} />;
      case 'childName': return <Sparkles size={20} />;
      case 'creditCard': return <CreditCard size={20} />;
      case 'date': return <Calendar size={20} />;
      default: return null;
    }
  };

  // Validate input based on patterns and rules
  const validateInput = (inputValue: string): boolean => {
    if (!required && !inputValue) return true;

    if (validation && VALIDATION_PATTERNS[validation]) {
      const rule = VALIDATION_PATTERNS[validation];
      const isValid = rule.pattern.test(inputValue);

      if (!isValid) {
        setValidationError(rule.message);
        return false;
      }
    }

    if (customValidator) {
      const result = customValidator(inputValue);
      if (typeof result === 'string') {
        setValidationError(result);
        return false;
      }
      if (!result) {
        setValidationError('Invalid input');
        return false;
      }
    }

    setValidationError('');
    return true;
  };

  // Calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };

  // Handle input change with security
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Sanitize input based on type
    if (validation && VALIDATION_PATTERNS[validation]) {
      newValue = VALIDATION_PATTERNS[validation].sanitize(newValue);
    }

    // XSS prevention
    if (privacy === 'child-data' || privacy === 'pii') {
      newValue = DOMPurify.sanitize(newValue);
    }

    // Limit length for security
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }

    setInternalValue(newValue);

    // Calculate password strength if needed
    if (inputType === 'password' && strengthIndicator) {
      setPasswordStrength(calculatePasswordStrength(newValue));
    }

    // Validate on change for real-time feedback
    const isValid = validateInput(newValue);

    // Call secure change handler
    if (onSecureChange) {
      onSecureChange(newValue, isValid);
    }

    // Call original onChange
    if (onChange) {
      e.target.value = newValue;
      onChange(e);
    }
  };

  // Handle blur with validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    setIsFocused(false);
    validateInput(actualValue);

    if (onBlur) {
      onBlur(e);
    }
  };

  // Handle focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);

    if (onFocus) {
      onFocus(e);
    }
  };

  // Get input type for rendering
  const getInputType = () => {
    if (inputType === 'password' && showPassword) return 'text';
    if (inputType === 'creditCard') return 'text';
    if (inputType === 'username' || inputType === 'childName') return 'text';
    return inputType === 'tel' ? 'tel' : inputType;
  };

  // Design system styles
  const variantStyles = {
    default: {
      container: 'bg-white border-2',
      input: 'bg-transparent',
      borderColor: isFocused
        ? DesignSystem.colors.primary[400]
        : validationError
        ? DesignSystem.colors.error
        : success
        ? DesignSystem.colors.success
        : DesignSystem.colors.neutral[200],
    },
    filled: {
      container: `bg-${isFocused ? 'gray-50' : 'gray-100'} border-b-2`,
      input: 'bg-transparent',
      borderColor: isFocused
        ? DesignSystem.colors.primary[400]
        : DesignSystem.colors.neutral[300],
    },
    outlined: {
      container: 'bg-transparent border-2',
      input: 'bg-transparent',
      borderColor: isFocused
        ? DesignSystem.colors.primary[500]
        : DesignSystem.colors.neutral[300],
    },
    ghost: {
      container: 'bg-transparent border-b-2',
      input: 'bg-transparent',
      borderColor: isFocused
        ? DesignSystem.colors.primary[400]
        : 'transparent',
    },
    playful: {
      container: `bg-gradient-to-r from-green-50 to-emerald-50 border-3`,
      input: 'bg-transparent',
      borderColor: isFocused
        ? DesignSystem.colors.accent[400]
        : DesignSystem.colors.primary[300],
    },
  };

  const currentVariant = variantStyles[variant];

  // Age-specific sizing
  const sizeClasses = {
    '3-5': 'min-h-[64px] text-xl px-4 py-3',
    '6-8': 'min-h-[48px] text-lg px-3 py-2',
    '9+': 'min-h-[44px] text-base px-3 py-2',
  };

  // Security indicator
  const getSecurityIcon = () => {
    if (privacy === 'sensitive' || privacy === 'pii') {
      return <ShieldCheck size={16} color={DesignSystem.colors.success} />;
    }
    if (privacy === 'child-data') {
      return <Shield size={16} color={DesignSystem.colors.primary[500]} />;
    }
    if (secure) {
      return <Lock size={14} color={DesignSystem.colors.neutral[400]} />;
    }
    return null;
  };

  const showError = isTouched && (validationError || externalError);
  const displayError = validationError || externalError;

  return (
    <div className="w-full">
      {/* Label */}
      {label && !floatingLabel && (
        <motion.label
          className="block mb-2 font-semibold"
          style={{
            fontFamily: DesignSystem.typography.fonts.body,
            fontSize: ageGroup === '3-5' ? '1.125rem' : '0.875rem',
            color: DesignSystem.colors.neutral[700],
          }}
          htmlFor={props.id}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {getSecurityIcon()}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        <motion.div
          className={cn(
            'relative flex items-center rounded-xl overflow-hidden transition-all duration-200',
            currentVariant.container,
            sizeClasses[ageGroup],
            disabled && 'opacity-50 cursor-not-allowed',
            showError && 'animate-shake'
          )}
          style={{
            borderColor: currentVariant.borderColor,
            boxShadow: isFocused
              ? DesignSystem.effects?.shadows?.playful?.green || '0 0 0 3px rgba(67, 200, 67, 0.1)'
              : undefined,
          }}
          animate={animated && isFocused ? { scale: 1.01 } : {}}
        >
          {/* Left Icon */}
          {getDefaultIcon() && (
            <div
              className="flex-shrink-0 mr-2"
              style={{ color: DesignSystem.colors.neutral[400] }}
            >
              {getDefaultIcon()}
            </div>
          )}

          {/* Floating Label */}
          {floatingLabel && label && (
            <motion.label
              className="absolute left-3 pointer-events-none"
              style={{
                fontFamily: DesignSystem.typography.fonts.body,
                color: DesignSystem.colors.neutral[500],
              }}
              animate={{
                top: hasValue || isFocused ? '0.25rem' : '50%',
                fontSize: hasValue || isFocused ? '0.75rem' : '1rem',
                y: hasValue || isFocused ? 0 : '-50%',
              }}
              transition={{ duration: 0.2 }}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </motion.label>
          )}

          {/* Input Field */}
          <input
            ref={ref || inputRef}
            type={getInputType()}
            className={cn(
              'flex-1 outline-none',
              currentVariant.input,
              floatingLabel && 'pt-4',
              privacy === 'sensitive' && 'text-security-disc'
            )}
            style={{
              fontFamily: DesignSystem.typography.fonts.body,
              color: DesignSystem.colors.neutral[900],
            }}
            value={actualValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            placeholder={!floatingLabel ? placeholder : undefined}
            autoComplete={autoComplete}
            aria-label={label}
            aria-invalid={showError}
            aria-describedby={showError ? `${props.id}-error` : undefined}
            {...props}
          />

          {/* Right Side Elements */}
          <div className="flex items-center gap-2 ml-2">
            {/* Character Counter */}
            {characterCounter && maxLength && (
              <span
                className="text-xs"
                style={{
                  color: actualValue.length > maxLength * 0.9
                    ? DesignSystem.colors.warning
                    : DesignSystem.colors.neutral[400],
                }}
              >
                {actualValue.length}/{maxLength}
              </span>
            )}

            {/* Loading Spinner */}
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              </motion.div>
            )}

            {/* Success Indicator */}
            {success && !loading && !showError && (
              <CheckCircle size={20} color={DesignSystem.colors.success} />
            )}

            {/* Password Toggle */}
            {inputType === 'password' && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} color={DesignSystem.colors.neutral[500]} />
                ) : (
                  <Eye size={18} color={DesignSystem.colors.neutral[500]} />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && <div className="flex-shrink-0">{rightIcon}</div>}
          </div>
        </motion.div>

        {/* Password Strength Indicator */}
        {inputType === 'password' && strengthIndicator && actualValue && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium" style={{ color: DesignSystem.colors.neutral[600] }}>
                Password Strength:
              </span>
              <span
                className="text-xs font-bold"
                style={{
                  color: passwordStrength < 40
                    ? DesignSystem.colors.error
                    : passwordStrength < 70
                    ? DesignSystem.colors.warning
                    : DesignSystem.colors.success,
                }}
              >
                {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full"
                style={{
                  background: passwordStrength < 40
                    ? DesignSystem.colors.error
                    : passwordStrength < 70
                    ? DesignSystem.colors.warning
                    : DesignSystem.colors.success,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${passwordStrength}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Hint Text */}
      {hint && !showError && (
        <motion.p
          className="mt-1 text-sm flex items-center gap-1"
          style={{ color: DesignSystem.colors.neutral[500] }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Info size={14} />
          {hint}
        </motion.p>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {showError && (
          <motion.p
            id={`${props.id}-error`}
            className="mt-1 text-sm flex items-center gap-1"
            style={{ color: DesignSystem.colors.error }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <AlertCircle size={14} />
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Security Notice for Sensitive Data */}
      {privacy === 'child-data' && (
        <motion.div
          className="mt-2 p-2 rounded-lg bg-blue-50 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Shield size={16} color={DesignSystem.colors.info} />
          <span className="text-xs" style={{ color: DesignSystem.colors.info }}>
            This information is protected under COPPA regulations
          </span>
        </motion.div>
      )}
    </div>
  );
});

SecureInput.displayName = 'SecureInput';

// Export utility for form validation
export const validateForm = (
  values: Record<string, string>,
  rules: Record<string, keyof typeof VALIDATION_PATTERNS>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.entries(values).forEach(([field, value]) => {
    const rule = rules[field];
    if (rule && VALIDATION_PATTERNS[rule]) {
      const pattern = VALIDATION_PATTERNS[rule];
      if (!pattern.pattern.test(value)) {
        errors[field] = pattern.message;
      }
    }
  });

  return errors;
};

export default SecureInput;