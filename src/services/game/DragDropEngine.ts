import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

export interface DragItem {
  id: string;
  content: string | React.ReactNode;
  type: string;
  data?: any;
  locked?: boolean;
}

export interface DropZone {
  id: string;
  label: string;
  accepts: string[];
  maxItems?: number;
  items: DragItem[];
  validation?: (item: DragItem) => boolean;
}

export interface DragDropConfig {
  snapToGrid?: boolean;
  gridSize?: number;
  magneticSnap?: boolean;
  snapDistance?: number;
  enableReordering?: boolean;
  visualFeedback?: boolean;
  accessibilityMode?: boolean;
  ageGroup?: '3-5' | '6-8' | '9+';
}

export interface DragDropState {
  draggedItem: DragItem | null;
  draggedFromZone: string | null;
  hoveredZone: string | null;
  validDrop: boolean;
  dropZones: Record<string, DropZone>;
}

export class DragDropEngine {
  private state: DragDropState;
  private config: DragDropConfig;
  private callbacks: {
    onDragStart?: (item: DragItem, fromZone: string) => void;
    onDragEnd?: (item: DragItem, fromZone: string | null, toZone: string | null) => void;
    onDrop?: (item: DragItem, fromZone: string, toZone: string) => boolean;
    onValidationError?: (item: DragItem, zone: DropZone, error: string) => void;
  };

  constructor(config: DragDropConfig = {}) {
    this.config = {
      snapToGrid: false,
      gridSize: 20,
      magneticSnap: true,
      snapDistance: 30,
      enableReordering: true,
      visualFeedback: true,
      accessibilityMode: false,
      ageGroup: '6-8',
      ...config,
    };

    this.state = {
      draggedItem: null,
      draggedFromZone: null,
      hoveredZone: null,
      validDrop: false,
      dropZones: {},
    };

    this.callbacks = {};
  }

  // === INITIALIZATION ===

  initializeDropZones(zones: DropZone[]): void {
    this.state.dropZones = {};
    zones.forEach(zone => {
      this.state.dropZones[zone.id] = { ...zone };
    });
  }

  setCallbacks(callbacks: typeof this.callbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // === DRAG AND DROP LOGIC ===

  startDrag(item: DragItem, fromZone: string): boolean {
    if (item.locked) {
      console.log('Cannot drag locked item:', item.id);
      return false;
    }

    this.state.draggedItem = item;
    this.state.draggedFromZone = fromZone;
    this.state.validDrop = false;

    this.callbacks.onDragStart?.(item, fromZone);
    return true;
  }

  updateDragPosition(zoneId: string | null): void {
    this.state.hoveredZone = zoneId;

    if (zoneId && this.state.draggedItem) {
      const zone = this.state.dropZones[zoneId];
      this.state.validDrop = this.canDropInZone(this.state.draggedItem, zone);
    } else {
      this.state.validDrop = false;
    }
  }

  endDrag(dropZoneId: string | null): boolean {
    if (!this.state.draggedItem || !this.state.draggedFromZone) {
      this.resetDragState();
      return false;
    }

    const item = this.state.draggedItem;
    const fromZone = this.state.draggedFromZone;

    // Handle drop
    if (dropZoneId && this.state.validDrop) {
      const success = this.handleDrop(item, fromZone, dropZoneId);
      this.callbacks.onDragEnd?.(item, fromZone, dropZoneId);
      this.resetDragState();
      return success;
    }

    // Return to original position
    this.callbacks.onDragEnd?.(item, fromZone, null);
    this.resetDragState();
    return false;
  }

  private handleDrop(item: DragItem, fromZoneId: string, toZoneId: string): boolean {
    const fromZone = this.state.dropZones[fromZoneId];
    const toZone = this.state.dropZones[toZoneId];

    if (!fromZone || !toZone) {
      console.error('Invalid drop zones:', fromZoneId, toZoneId);
      return false;
    }

    // Validate drop
    if (!this.canDropInZone(item, toZone)) {
      this.callbacks.onValidationError?.(item, toZone, 'Invalid drop target');
      return false;
    }

    // Custom validation callback
    if (this.callbacks.onDrop && !this.callbacks.onDrop(item, fromZoneId, toZoneId)) {
      return false;
    }

    // Remove from source zone
    fromZone.items = fromZone.items.filter(i => i.id !== item.id);

    // Add to target zone
    if (toZone.maxItems && toZone.items.length >= toZone.maxItems) {
      // Handle overflow - remove oldest item
      toZone.items.shift();
    }
    toZone.items.push(item);

    return true;
  }

  private canDropInZone(item: DragItem, zone: DropZone): boolean {
    // Check if zone accepts this item type
    if (!zone.accepts.includes(item.type) && !zone.accepts.includes('*')) {
      return false;
    }

    // Check maximum items
    if (zone.maxItems && zone.items.length >= zone.maxItems) {
      return false;
    }

    // Custom validation
    if (zone.validation && !zone.validation(item)) {
      return false;
    }

    return true;
  }

  private resetDragState(): void {
    this.state.draggedItem = null;
    this.state.draggedFromZone = null;
    this.state.hoveredZone = null;
    this.state.validDrop = false;
  }

  // === UTILITY METHODS ===

  getDropZone(id: string): DropZone | undefined {
    return this.state.dropZones[id];
  }

  getAllDropZones(): Record<string, DropZone> {
    return { ...this.state.dropZones };
  }

  getDragState(): DragDropState {
    return { ...this.state };
  }

  moveItem(itemId: string, fromZoneId: string, toZoneId: string): boolean {
    const fromZone = this.state.dropZones[fromZoneId];
    const toZone = this.state.dropZones[toZoneId];

    if (!fromZone || !toZone) return false;

    const item = fromZone.items.find(i => i.id === itemId);
    if (!item) return false;

    if (!this.canDropInZone(item, toZone)) return false;

    // Remove from source
    fromZone.items = fromZone.items.filter(i => i.id !== itemId);

    // Add to target
    toZone.items.push(item);

    return true;
  }

  reorderItems(zoneId: string, itemIds: string[]): boolean {
    const zone = this.state.dropZones[zoneId];
    if (!zone || !this.config.enableReordering) return false;

    const reorderedItems: DragItem[] = [];
    for (const itemId of itemIds) {
      const item = zone.items.find(i => i.id === itemId);
      if (item) reorderedItems.push(item);
    }

    if (reorderedItems.length === zone.items.length) {
      zone.items = reorderedItems;
      return true;
    }

    return false;
  }

  clearZone(zoneId: string): boolean {
    const zone = this.state.dropZones[zoneId];
    if (!zone) return false;

    zone.items = [];
    return true;
  }

  addItemToZone(item: DragItem, zoneId: string): boolean {
    const zone = this.state.dropZones[zoneId];
    if (!zone) return false;

    if (!this.canDropInZone(item, zone)) return false;

    zone.items.push(item);
    return true;
  }

  removeItemFromZone(itemId: string, zoneId: string): boolean {
    const zone = this.state.dropZones[zoneId];
    if (!zone) return false;

    const initialLength = zone.items.length;
    zone.items = zone.items.filter(i => i.id !== itemId);

    return zone.items.length < initialLength;
  }

  // === VALIDATION ===

  validateAllZones(): { isValid: boolean; errors: Array<{ zoneId: string; error: string }> } {
    const errors: Array<{ zoneId: string; error: string }> = [];

    for (const [zoneId, zone] of Object.entries(this.state.dropZones)) {
      // Check required items
      if (zone.maxItems && zone.items.length === 0) {
        errors.push({ zoneId, error: 'Zone requires at least one item' });
      }

      // Validate each item in the zone
      for (const item of zone.items) {
        if (!this.canDropInZone(item, zone)) {
          errors.push({ zoneId, error: `Invalid item ${item.id} in zone` });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // === ACCESSIBILITY ===

  getAccessibilityInstructions(): string[] {
    const instructions: string[] = [];

    if (this.config.ageGroup === '3-5') {
      instructions.push('Drag the pictures to the correct boxes');
      instructions.push('Ask for help if you need it');
    } else if (this.config.ageGroup === '6-8') {
      instructions.push('Click and drag items to move them');
      instructions.push('Drop items in the correct zones');
      instructions.push('Use arrow keys to navigate if needed');
    } else {
      instructions.push('Use mouse or touch to drag and drop items');
      instructions.push('Press Tab to navigate between zones');
      instructions.push('Press Space to pick up/drop items when using keyboard');
    }

    return instructions;
  }

  // === GAME-SPECIFIC METHODS ===

  checkAnswers(): { correct: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let correct = true;
    let score = 0;

    for (const [zoneId, zone] of Object.entries(this.state.dropZones)) {
      // This would be implemented based on specific game logic
      // For now, just check if zones have expected items
      if (zone.items.length === 0 && zone.maxItems && zone.maxItems > 0) {
        correct = false;
        feedback.push(`Zone ${zone.label} is empty`);
      } else {
        score += zone.items.length * 10;
        feedback.push(`Zone ${zone.label} is correct!`);
      }
    }

    return { correct, score, feedback };
  }

  generateHint(): string {
    const emptyZones = Object.values(this.state.dropZones).filter(zone => zone.items.length === 0);

    if (emptyZones.length > 0) {
      const zone = emptyZones[0];
      return `Try placing an item in the ${zone.label} zone`;
    }

    return 'Check if all items are in the correct zones';
  }

  reset(): void {
    // Reset all zones to empty
    for (const zone of Object.values(this.state.dropZones)) {
      zone.items = [];
    }
    this.resetDragState();
  }

  // === ANIMATION HELPERS ===

  getItemAnimation(item: DragItem, ageGroup: string) {
    const baseAnimation = {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      drag: true,
      dragMomentum: false,
    };

    switch (ageGroup) {
      case '3-5':
        return {
          ...baseAnimation,
          whileHover: { scale: 1.1, rotate: 5 },
          whileTap: { scale: 0.9 },
          dragTransition: { bounceStiffness: 600, bounceDamping: 20 },
        };
      case '6-8':
        return {
          ...baseAnimation,
          whileHover: { scale: 1.08 },
          dragElastic: 0.1,
        };
      default:
        return baseAnimation;
    }
  }

  getZoneAnimation(zone: DropZone, state: DragDropState) {
    const isHovered = state.hoveredZone === zone.id;
    const isValidDrop = isHovered && state.validDrop;
    const isInvalidDrop = isHovered && !state.validDrop;

    return {
      scale: isHovered ? 1.02 : 1,
      backgroundColor: isValidDrop ? '#10B981' : isInvalidDrop ? '#EF4444' : '#F3F4F6',
      borderColor: isValidDrop ? '#059669' : isInvalidDrop ? '#DC2626' : '#D1D5DB',
      transition: { duration: 0.2 },
    };
  }
}

// React Hook for using DragDropEngine
export function useDragDropEngine(
  initialZones: DropZone[],
  config: DragDropConfig = {}
) {
  const engineRef = useRef<DragDropEngine | null>(null);
  const [state, setState] = useState<DragDropState | null>(null);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new DragDropEngine(config);
    engineRef.current.initializeDropZones(initialZones);
    setState(engineRef.current.getDragState());
  }, []);

  // Update state when engine state changes
  const updateState = useCallback(() => {
    if (engineRef.current) {
      setState(engineRef.current.getDragState());
    }
  }, []);

  const dragDropActions = {
    startDrag: (item: DragItem, fromZone: string) => {
      const success = engineRef.current?.startDrag(item, fromZone);
      updateState();
      return success;
    },

    updateDragPosition: (zoneId: string | null) => {
      engineRef.current?.updateDragPosition(zoneId);
      updateState();
    },

    endDrag: (dropZoneId: string | null) => {
      const success = engineRef.current?.endDrag(dropZoneId);
      updateState();
      return success;
    },

    moveItem: (itemId: string, fromZoneId: string, toZoneId: string) => {
      const success = engineRef.current?.moveItem(itemId, fromZoneId, toZoneId);
      updateState();
      return success;
    },

    clearZone: (zoneId: string) => {
      const success = engineRef.current?.clearZone(zoneId);
      updateState();
      return success;
    },

    reset: () => {
      engineRef.current?.reset();
      updateState();
    },

    checkAnswers: () => {
      return engineRef.current?.checkAnswers();
    },

    generateHint: () => {
      return engineRef.current?.generateHint();
    },

    validateAllZones: () => {
      return engineRef.current?.validateAllZones();
    },
  };

  return {
    engine: engineRef.current,
    state,
    actions: dragDropActions,
  };
}

export default DragDropEngine;