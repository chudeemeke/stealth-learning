import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Z_INDEX_CLASSES } from '@/styles/z-index';
import { getAccessibleTextColor } from '@/utils/contrast';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  description?: string;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ToastNotificationProps {
  toast: Toast;
  onDismiss: (id: string) => void;
  ageGroup?: '3-5' | '6-8' | '9+';
}

const TOAST_CONFIGS = {
  success: {
    icon: '✅',
    bgColor: '#10B981',
    borderColor: '#059669',
    animation: '🎉'
  },
  error: {
    icon: '❌',
    bgColor: '#EF4444',
    borderColor: '#DC2626',
    animation: '😢'
  },
  warning: {
    icon: '⚠️',
    bgColor: '#F59E0B',
    borderColor: '#D97706',
    animation: '🤔'
  },
  info: {
    icon: 'ℹ️',
    bgColor: '#3B82F6',
    borderColor: '#1D4ED8',
    animation: '💡'
  },
  confirm: {
    icon: '❓',
    bgColor: '#8B5CF6',
    borderColor: '#7C3AED',
    animation: '🤷'
  }
};

const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
  onDismiss,
  ageGroup = '6-8'
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = TOAST_CONFIGS[toast.type];
  const textStyle = getAccessibleTextColor(config.bgColor, {
    level: 'AAA',
    largeText: ageGroup === '3-5'
  });

  useEffect(() => {
    if (toast.duration && !toast.onConfirm) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const sizeClasses = {
    '3-5': 'min-h-[80px] p-6 text-xl',
    '6-8': 'min-h-[60px] p-4 text-base',
    '9+': 'min-h-[48px] p-3 text-sm'
  };

  return (
    <motion.div
      className={`
        ${Z_INDEX_CLASSES.TOAST_NOTIFICATION}
        ${sizeClasses[ageGroup]}
        rounded-2xl shadow-2xl border-3 backdrop-blur-md
        flex items-center gap-4 max-w-md min-w-[300px]
      `}
      style={{
        backgroundColor: config.bgColor + 'F0',
        borderColor: config.borderColor
      }}
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={isExiting
        ? { opacity: 0, y: -50, scale: 0.8 }
        : { opacity: 1, y: 0, scale: 1 }
      }
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Animated Icon */}
      <motion.div
        className="text-3xl"
        animate={{
          rotate: toast.type === 'success' ? [0, 360] : 0,
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: toast.type === 'success' ? 1 : Infinity,
          repeatDelay: 2
        }}
      >
        {config.icon}
      </motion.div>

      {/* Message Content */}
      <div className="flex-1">
        <p
          className={`font-semibold ${toast.className || ''}`}
          style={{
            color: textStyle.color,
            textShadow: textStyle.shadow
          }}
        >
          {toast.message}
        </p>
        {toast.description && (
          <p
            className="text-sm mt-1 opacity-90"
            style={{
              color: textStyle.color,
              textShadow: textStyle.shadow
            }}
          >
            {toast.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {toast.onConfirm && (
        <div className="flex gap-2">
          <motion.button
            className={`
              px-4 py-2 rounded-lg font-bold
              bg-white/90 text-gray-800
              ${ageGroup === '3-5' ? 'min-w-[64px] min-h-[64px]' : 'min-w-[48px] min-h-[48px]'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toast.onConfirm?.();
              handleDismiss();
            }}
          >
            ✓ Yes
          </motion.button>
          <motion.button
            className={`
              px-4 py-2 rounded-lg font-bold
              bg-gray-300/90 text-gray-800
              ${ageGroup === '3-5' ? 'min-w-[64px] min-h-[64px]' : 'min-w-[48px] min-h-[48px]'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toast.onCancel?.();
              handleDismiss();
            }}
          >
            ✗ No
          </motion.button>
        </div>
      )}

      {/* Single Action Button */}
      {toast.action && !toast.onConfirm && (
        <motion.button
          className={`
            px-4 py-2 rounded-lg font-bold
            bg-white/90 text-gray-800
            ${ageGroup === '3-5' ? 'min-h-[64px]' : 'min-h-[48px]'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            toast.action?.onClick();
            handleDismiss();
          }}
        >
          {toast.action.label}
        </motion.button>
      )}

      {/* Dismiss Button */}
      {!toast.onConfirm && (
        <motion.button
          className="text-2xl opacity-70 hover:opacity-100 p-1"
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.8 }}
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          ✕
        </motion.button>
      )}

      {/* Fun animation overlay for kids */}
      {ageGroup === '3-5' && toast.type === 'success' && (
        <motion.div
          className="absolute -top-4 -right-4 text-4xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 2,
            repeat: 3
          }}
        >
          {config.animation}
        </motion.div>
      )}
    </motion.div>
  );
};

// Toast Container Component
export const ToastContainer: React.FC<{
  toasts: Toast[];
  onDismiss: (id: string) => void;
  ageGroup?: '3-5' | '6-8' | '9+';
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}> = ({
  toasts,
  onDismiss,
  ageGroup = '6-8',
  position = 'top-right'
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} ${Z_INDEX_CLASSES.TOAST_NOTIFICATION}`}
    >
      <AnimatePresence mode="sync">
        <div className="flex flex-col gap-3">
          {toasts.map((toast) => (
            <ToastNotification
              key={toast.id}
              toast={toast}
              onDismiss={onDismiss}
              ageGroup={ageGroup}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

// Toast Hook for easy usage
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: ToastType = 'info',
    options?: Partial<Toast>
  ) => {
    const toast: Toast = {
      id: Date.now().toString(),
      message,
      type,
      duration: options?.duration ?? 5000,
      ...options
    };

    setToasts((prev) => [...prev, toast]);
  };

  const showConfirmToast = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    const toast: Toast = {
      id: Date.now().toString(),
      message,
      type: 'confirm',
      onConfirm,
      onCancel
    };

    setToasts((prev) => [...prev, toast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    showToast,
    showConfirmToast,
    dismissToast,
    clearToasts
  };
};

// Standalone ToastContainer that manages its own state
export const StandaloneToastContainer: React.FC<{
  ageGroup?: '3-5' | '6-8' | '9+';
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}> = ({ ageGroup = '6-8', position = 'top-right' }) => {
  const { toasts, dismissToast } = useToast();

  return (
    <ToastContainer
      toasts={toasts}
      onDismiss={dismissToast}
      ageGroup={ageGroup}
      position={position}
    />
  );
};

export default ToastNotification;