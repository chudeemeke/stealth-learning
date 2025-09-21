import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIntersectionAnimation } from '@/hooks/useAnimations';

// Grid configuration types
export interface GridConfig {
  minItemWidth: number;
  maxItemWidth?: number;
  gap: number;
  padding: number;
  aspectRatio?: number;
  ageGroup?: '3-5' | '6-8' | '9+';
}

// Responsive grid props
export interface ResponsiveGridProps {
  children: React.ReactNode;
  config?: Partial<GridConfig>;
  className?: string;
  animated?: boolean;
  staggerDelay?: number;
  onItemsPerRowChange?: (itemsPerRow: number) => void;
}

// Age-specific grid configurations
const ageGridConfigs: Record<string, GridConfig> = {
  '3-5': {
    minItemWidth: 280,
    maxItemWidth: 400,
    gap: 24,
    padding: 24,
    aspectRatio: 1.2,
  },
  '6-8': {
    minItemWidth: 240,
    maxItemWidth: 360,
    gap: 20,
    padding: 20,
    aspectRatio: 1.1,
  },
  '9+': {
    minItemWidth: 200,
    maxItemWidth: 320,
    gap: 16,
    padding: 16,
    aspectRatio: 1,
  },
};

// Auto-fit responsive grid component
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  config = {},
  className,
  animated = true,
  staggerDelay = 0.1,
  onItemsPerRowChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerRow, setItemsPerRow] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  // Merge with age-specific defaults
  const ageGroup = config.ageGroup || '6-8';
  const finalConfig: GridConfig = {
    ...ageGridConfigs[ageGroup],
    ...config,
  };

  // Calculate grid layout
  const calculateLayout = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const availableWidth = container.clientWidth - (finalConfig.padding * 2);
    const totalGapWidth = (itemsPerRow - 1) * finalConfig.gap;
    const itemWidth = (availableWidth - totalGapWidth) / itemsPerRow;

    // Find optimal items per row
    let optimalItemsPerRow = 1;
    for (let i = 1; i <= 6; i++) {
      const testTotalGapWidth = (i - 1) * finalConfig.gap;
      const testItemWidth = (availableWidth - testTotalGapWidth) / i;

      if (testItemWidth >= finalConfig.minItemWidth &&
          (!finalConfig.maxItemWidth || testItemWidth <= finalConfig.maxItemWidth)) {
        optimalItemsPerRow = i;
      }
    }

    if (optimalItemsPerRow !== itemsPerRow) {
      setItemsPerRow(optimalItemsPerRow);
      onItemsPerRowChange?.(optimalItemsPerRow);
    }

    setContainerWidth(availableWidth);
  };

  // Resize observer for responsive behavior
  useEffect(() => {
    const resizeObserver = new ResizeObserver(calculateLayout);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [finalConfig, itemsPerRow]);

  // Initial calculation
  useEffect(() => {
    calculateLayout();
  }, []);

  // Calculate grid template columns
  const gridTemplateColumns = `repeat(${itemsPerRow}, 1fr)`;

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn('w-full', className)}
      style={{
        padding: finalConfig.padding,
      }}
      variants={animated ? containerVariants : undefined}
      initial={animated ? 'hidden' : undefined}
      animate={animated ? 'visible' : undefined}
    >
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns,
          gap: finalConfig.gap,
          minHeight: finalConfig.aspectRatio ?
            `${(containerWidth / itemsPerRow) * finalConfig.aspectRatio}px` :
            undefined,
        }}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={animated ? itemVariants : undefined}
            className="w-full"
            style={{
              aspectRatio: finalConfig.aspectRatio,
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Masonry grid component for varying heights
export const MasonryGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  ageGroup?: '3-5' | '6-8' | '9+';
  className?: string;
}> = ({
  children,
  columns,
  gap,
  ageGroup = '6-8',
  className,
}) => {
  const [calculatedColumns, setCalculatedColumns] = useState(columns || 2);
  const containerRef = useRef<HTMLDivElement>(null);

  const ageDefaults = {
    '3-5': { columns: 1, gap: 24 },
    '6-8': { columns: 2, gap: 20 },
    '9+': { columns: 3, gap: 16 },
  };

  const finalColumns = columns || ageDefaults[ageGroup].columns;
  const finalGap = gap || ageDefaults[ageGroup].gap;

  // Auto-calculate columns based on container width
  useEffect(() => {
    if (!columns && containerRef.current) {
      const calculateColumns = () => {
        const width = containerRef.current!.clientWidth;
        const minColumnWidth = ageGroup === '3-5' ? 300 : ageGroup === '6-8' ? 250 : 200;
        const newColumns = Math.max(1, Math.floor(width / minColumnWidth));
        setCalculatedColumns(newColumns);
      };

      const resizeObserver = new ResizeObserver(calculateColumns);
      resizeObserver.observe(containerRef.current);
      calculateColumns();

      return () => resizeObserver.disconnect();
    }
  }, [columns, ageGroup]);

  // Distribute children across columns
  const distributeChildren = () => {
    const childrenArray = React.Children.toArray(children);
    const columnArrays: React.ReactNode[][] = Array.from({ length: calculatedColumns }, () => []);

    childrenArray.forEach((child, index) => {
      const columnIndex = index % calculatedColumns;
      columnArrays[columnIndex].push(child);
    });

    return columnArrays;
  };

  const columnArrays = distributeChildren();

  return (
    <div
      ref={containerRef}
      className={cn('flex', className)}
      style={{ gap: finalGap }}
    >
      {columnArrays.map((columnChildren, columnIndex) => (
        <div
          key={columnIndex}
          className="flex flex-col flex-1"
          style={{ gap: finalGap }}
        >
          {columnChildren.map((child, childIndex) => (
            <motion.div
              key={`${columnIndex}-${childIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: (columnIndex * columnChildren.length + childIndex) * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {child}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Touch-optimized spacing hook
export const useTouchOptimizedSpacing = (ageGroup: '3-5' | '6-8' | '9+' = '6-8') => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setIsTouch(hasTouch);

      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Touch-optimized spacing based on age group and device
  const getSpacing = () => {
    const baseSpacing = {
      '3-5': {
        mobile: { padding: 20, gap: 20, touchTarget: 64 },
        tablet: { padding: 24, gap: 24, touchTarget: 64 },
        desktop: { padding: 32, gap: 32, touchTarget: 56 },
      },
      '6-8': {
        mobile: { padding: 16, gap: 16, touchTarget: 48 },
        tablet: { padding: 20, gap: 20, touchTarget: 48 },
        desktop: { padding: 24, gap: 24, touchTarget: 44 },
      },
      '9+': {
        mobile: { padding: 12, gap: 12, touchTarget: 44 },
        tablet: { padding: 16, gap: 16, touchTarget: 44 },
        desktop: { padding: 20, gap: 20, touchTarget: 40 },
      },
    };

    return baseSpacing[ageGroup][deviceType];
  };

  const spacing = getSpacing();

  // Touch-optimized classes
  const getTouchClasses = () => {
    return {
      container: cn(
        'w-full',
        isTouch && 'touch-manipulation select-none'
      ),
      interactive: cn(
        'cursor-pointer transition-all duration-200',
        isTouch && 'active:scale-95'
      ),
      touchTarget: {
        minHeight: spacing.touchTarget,
        minWidth: spacing.touchTarget,
      },
      spacing: {
        padding: spacing.padding,
        gap: spacing.gap,
      },
    };
  };

  return {
    deviceType,
    isTouch,
    spacing,
    classes: getTouchClasses(),
    ageGroup,
  };
};

// Auto-sizing container component
export const AutoSizeContainer: React.FC<{
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  ageGroup?: '3-5' | '6-8' | '9+';
  className?: string;
}> = ({
  children,
  minWidth,
  maxWidth,
  ageGroup = '6-8',
  className,
}) => {
  const { spacing, classes } = useTouchOptimizedSpacing(ageGroup);

  const containerStyle = {
    minWidth: minWidth || (ageGroup === '3-5' ? 320 : ageGroup === '6-8' ? 280 : 240),
    maxWidth: maxWidth || (ageGroup === '3-5' ? 600 : ageGroup === '6-8' ? 500 : 400),
    padding: spacing.padding,
  };

  return (
    <div
      className={cn(
        'mx-auto w-full',
        classes.container,
        className
      )}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

// Flexible spacer component
export const FlexSpacer: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  ageGroup?: '3-5' | '6-8' | '9+';
  direction?: 'horizontal' | 'vertical';
  className?: string;
}> = ({
  size = 'md',
  ageGroup = '6-8',
  direction = 'vertical',
  className,
}) => {
  const { spacing } = useTouchOptimizedSpacing(ageGroup);

  const getSizeValue = () => {
    if (typeof size === 'number') return size;

    const sizeMap = {
      xs: spacing.gap * 0.5,
      sm: spacing.gap * 0.75,
      md: spacing.gap,
      lg: spacing.gap * 1.5,
      xl: spacing.gap * 2,
    };

    return sizeMap[size];
  };

  const sizeValue = getSizeValue();

  const style = direction === 'horizontal'
    ? { width: sizeValue }
    : { height: sizeValue };

  return (
    <div
      className={cn('flex-shrink-0', className)}
      style={style}
    />
  );
};

// Responsive breakpoint hook
export const useResponsiveBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < 480) setBreakpoint('xs');
      else if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl';

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width: window.innerWidth,
  };
};

export default ResponsiveGrid;