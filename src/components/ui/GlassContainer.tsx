import React, { forwardRef, HTMLAttributes, CSSProperties } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  resolveGlassProps,
  GlassComponentProps,
  supportsBackdropFilter,
  createFallbackStyle,
  glassOptimizationStyles
} from '@/utils/glassmorphism';
import { animationPresets } from '@/utils/animations';

// Extended props interface
interface GlassContainerProps
  extends Omit<HTMLMotionProps<'div'>, 'style'>,
          GlassComponentProps {
  children?: React.ReactNode;
  asChild?: boolean;
  animated?: boolean;
  animation?: keyof typeof animationPresets;
  fallbackEnabled?: boolean;
  optimized?: boolean;
}

// Glass Container Component
export const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(
  ({
    children,
    className,
    preset = 'standard',
    config,
    darkMode = false,
    ageGroup,
    style,
    asChild = false,
    animated = false,
    animation = 'fade',
    fallbackEnabled = true,
    optimized = true,
    ...props
  }, ref) => {
    // Resolve glass styles
    const glassStyles = resolveGlassProps({
      preset,
      config,
      darkMode,
      ageGroup,
      style,
    });

    // Apply fallback for unsupported browsers
    const finalStyles: CSSProperties = supportsBackdropFilter() || !fallbackEnabled
      ? {
          ...glassStyles,
          ...(optimized ? glassOptimizationStyles : {}),
        }
      : {
          ...createFallbackStyle(config || {}),
          ...style,
        };

    // Animation variants
    const variants = animated ? animationPresets[animation] : undefined;

    // Render as motion.div with glass effects
    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          !supportsBackdropFilter() && fallbackEnabled && 'backdrop-blur-none',
          className
        )}
        style={finalStyles}
        variants={variants}
        initial={animated ? 'hidden' : undefined}
        animate={animated ? 'visible' : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassContainer.displayName = 'GlassContainer';

// Glass Card Component (specialized glass container)
interface GlassCardProps extends GlassContainerProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({
    children,
    header,
    footer,
    padding = 'md',
    hover = false,
    className,
    ageGroup,
    ...props
  }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-10',
    };

    const agePadding = ageGroup === '3-5' ? 'lg' : ageGroup === '6-8' ? 'md' : 'sm';
    const finalPadding = ageGroup ? agePadding : padding;

    return (
      <GlassContainer
        ref={ref}
        className={cn(
          'transition-all duration-300',
          paddingClasses[finalPadding],
          hover && 'hover:shadow-apple-lg hover:scale-[1.02]',
          className
        )}
        ageGroup={ageGroup}
        animated
        animation="scale"
        {...props}
      >
        {header && (
          <div className="mb-4 border-b border-white/20 pb-4">
            {header}
          </div>
        )}

        <div className="flex-1">
          {children}
        </div>

        {footer && (
          <div className="mt-4 border-t border-white/20 pt-4">
            {footer}
          </div>
        )}
      </GlassContainer>
    );
  }
);

GlassCard.displayName = 'GlassCard';

// Glass Modal Component
interface GlassModalProps extends GlassContainerProps {
  isOpen: boolean;
  onClose?: () => void;
  overlay?: boolean;
  closeOnOverlayClick?: boolean;
  centered?: boolean;
}

export const GlassModal = forwardRef<HTMLDivElement, GlassModalProps>(
  ({
    children,
    isOpen,
    onClose,
    overlay = true,
    closeOnOverlayClick = true,
    centered = true,
    className,
    ...props
  }, ref) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose?.();
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        {overlay && (
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          />
        )}

        {/* Modal Content */}
        <GlassContainer
          ref={ref}
          className={cn(
            'relative z-10 max-h-[90vh] max-w-lg overflow-y-auto',
            centered && 'mx-4',
            className
          )}
          preset="strong"
          animated
          animation="scale"
          {...props}
        >
          {children}
        </GlassContainer>
      </div>
    );
  }
);

GlassModal.displayName = 'GlassModal';

// Glass Button Component
interface GlassButtonProps extends GlassContainerProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const GlassButton = forwardRef<HTMLDivElement, GlassButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    className,
    ageGroup,
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const ageSize = ageGroup === '3-5' ? 'lg' : ageGroup === '6-8' ? 'md' : 'sm';
    const finalSize = ageGroup ? ageSize : size;

    const variantConfig = {
      primary: { preset: 'standard' as const, opacity: 0.3 },
      secondary: { preset: 'subtle' as const, opacity: 0.2 },
      ghost: { preset: 'crystal' as const, opacity: 0.1 },
    };

    const config = variantConfig[variant];

    return (
      <GlassContainer
        ref={ref}
        className={cn(
          'inline-flex cursor-pointer items-center justify-center rounded-apple-lg',
          'font-medium transition-all duration-200',
          'hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-system-blue/50 focus:ring-offset-2',
          sizeClasses[finalSize],
          disabled && 'cursor-not-allowed opacity-50',
          loading && 'cursor-wait',
          className
        )}
        preset={config.preset}
        config={{ backgroundOpacity: config.opacity }}
        ageGroup={ageGroup}
        onClick={disabled || loading ? undefined : onClick}
        animated
        animation="scale"
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        {...props}
      >
        {loading ? (
          <motion.div
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          children
        )}
      </GlassContainer>
    );
  }
);

GlassButton.displayName = 'GlassButton';

// Glass Panel Component (for dashboards and layouts)
interface GlassPanelProps extends GlassContainerProps {
  title?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({
    children,
    title,
    collapsible = false,
    defaultCollapsed = false,
    className,
    ...props
  }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    return (
      <GlassContainer
        ref={ref}
        className={cn('overflow-hidden', className)}
        preset="subtle"
        animated
        animation="slide"
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-white/20 p-4">
            <h3 className="font-semibold text-white">{title}</h3>
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-white/70 hover:text-white"
              >
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  animate={{ rotate: isCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M4 6l4 4 4-4" />
                </motion.svg>
              </button>
            )}
          </div>
        )}

        <motion.div
          initial={false}
          animate={{
            height: isCollapsed ? 0 : 'auto',
            opacity: isCollapsed ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="overflow-hidden"
        >
          <div className="p-4">
            {children}
          </div>
        </motion.div>
      </GlassContainer>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

// Export all components
export default {
  Container: GlassContainer,
  Card: GlassCard,
  Modal: GlassModal,
  Button: GlassButton,
  Panel: GlassPanel,
};