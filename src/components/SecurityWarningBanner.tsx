/**
 * Security Warning Banner Component
 * Displays critical security warnings to users when running without backend authentication
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { emergencySecurityConfig, isFeatureEnabled } from '@/config/security-wrapper';

const SecurityWarningBanner: React.FC = () => {
  const config = emergencySecurityConfig;
  const showWarning = config.FEATURES.SHOW_SECURITY_WARNING;

  if (!showWarning) {
    return null;
  }

  // Different warning styles based on security level
  const getWarningStyle = () => {
    switch (config.SECURITY_STATUS.level) {
      case 'CRITICAL':
        return {
          background: 'linear-gradient(90deg, #DC2626, #EF4444)',
          color: 'white',
          icon: '⚠️',
          message: 'SECURITY WARNING: This application is running without proper authentication. DO NOT enter real personal information. For demonstration only.'
        };
      case 'HIGH':
        if (import.meta.env.DEV) {
          return {
            background: '#FEF3C7',
            color: '#92400E',
            icon: '🔧',
            message: 'Development Mode - Security features disabled for testing'
          };
        }
        return null;
      case 'MEDIUM':
        return {
          background: '#DBEAFE',
          color: '#1E40AF',
          icon: '🔒',
          message: 'Backend API configured. Ensure proper security measures are in place.'
        };
      default:
        return null;
    }
  };

  const warningStyle = getWarningStyle();

  if (!warningStyle) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: warningStyle.background,
          color: warningStyle.color,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          style={{
            padding: '12px 20px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>{warningStyle.icon}</span>
          <span>{warningStyle.message}</span>
        </motion.div>

        {/* Additional details for critical warnings */}
        {config.SECURITY_STATUS.level === 'CRITICAL' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '0 20px 12px',
              fontSize: '12px',
              textAlign: 'center',
              opacity: 0.9
            }}
          >
            <div>
              ⚠️ Features Disabled:
              {!isFeatureEnabled('ENABLE_AUTHENTICATION') && ' Authentication,'}
              {!isFeatureEnabled('ENABLE_DATA_STORAGE') && ' Data Storage,'}
              {!isFeatureEnabled('ENABLE_PARENT_DASHBOARD') && ' Parent Dashboard,'}
              {!isFeatureEnabled('ALLOW_CHILD_REGISTRATION') && ' New Registrations'}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SecurityWarningBanner;