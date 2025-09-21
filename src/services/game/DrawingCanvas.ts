import { AgeGroup } from '@/types';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp?: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: DrawingTool;
  completed: boolean;
}

export type DrawingTool = 'pen' | 'eraser' | 'highlighter' | 'crayon' | 'brush';

export interface DrawingCanvasConfig {
  width: number;
  height: number;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
  tool: DrawingTool;
  ageGroup: AgeGroup;
  enablePressure: boolean;
  smoothing: boolean;
  snapToShape: boolean;
  gridAssist: boolean;
  undoLimit: number;
}

export interface CanvasState {
  strokes: Stroke[];
  undoStack: Stroke[][];
  redoStack: Stroke[][];
  currentStroke: Stroke | null;
  isDrawing: boolean;
  tool: DrawingTool;
  color: string;
  width: number;
}

export interface RecognitionResult {
  shape?: 'circle' | 'square' | 'triangle' | 'line' | 'arrow';
  letter?: string;
  number?: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class DrawingCanvas {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private config: DrawingCanvasConfig;
  private state: CanvasState;
  private animationId: number | null = null;
  private callbacks: {
    onStrokeComplete?: (stroke: Stroke) => void;
    onDrawingComplete?: (strokes: Stroke[]) => void;
    onRecognition?: (result: RecognitionResult) => void;
    onClear?: () => void;
  };

  constructor(canvas: HTMLCanvasElement, config: Partial<DrawingCanvasConfig> = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.config = {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 3,
      tool: 'pen',
      ageGroup: '6-8',
      enablePressure: false,
      smoothing: true,
      snapToShape: false,
      gridAssist: false,
      undoLimit: 50,
      ...config,
    };

    this.state = {
      strokes: [],
      undoStack: [],
      redoStack: [],
      currentStroke: null,
      isDrawing: false,
      tool: this.config.tool,
      color: this.config.strokeColor,
      width: this.config.strokeWidth,
    };

    this.callbacks = {};

    this.initialize();
  }

  // === INITIALIZATION ===

  private initialize(): void {
    if (!this.canvas || !this.context) {
      throw new Error('Canvas or context not available');
    }

    // Set canvas size
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;

    // Configure context
    this.context.fillStyle = this.config.backgroundColor;
    this.context.fillRect(0, 0, this.config.width, this.config.height);

    // Set age-appropriate defaults
    this.setupAgeAppropriateSettings();

    // Add event listeners
    this.addEventListeners();

    console.log('✅ DrawingCanvas initialized:', this.config);
  }

  private setupAgeAppropriateSettings(): void {
    switch (this.config.ageGroup) {
      case '3-5':
        this.config.strokeWidth = 8;
        this.config.tool = 'crayon';
        this.config.smoothing = true;
        this.config.snapToShape = true;
        break;
      case '6-8':
        this.config.strokeWidth = 5;
        this.config.tool = 'pen';
        this.config.smoothing = true;
        this.config.snapToShape = false;
        break;
      case '9+':
        this.config.strokeWidth = 3;
        this.config.tool = 'pen';
        this.config.smoothing = false;
        this.config.enablePressure = true;
        break;
    }

    this.state.tool = this.config.tool;
    this.state.width = this.config.strokeWidth;
  }

  // === EVENT HANDLING ===

  private addEventListeners(): void {
    if (!this.canvas) return;

    // Mouse events
    this.canvas.addEventListener('mousedown', this.handlePointerDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handlePointerMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handlePointerUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handlePointerUp.bind(this));

    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this));

    // Prevent default touch behaviors
    this.canvas.addEventListener('touchstart', (e) => e.preventDefault());
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault());
  }

  private handlePointerDown(event: MouseEvent): void {
    const point = this.getPointFromEvent(event);
    this.startStroke(point);
  }

  private handlePointerMove(event: MouseEvent): void {
    if (!this.state.isDrawing) return;
    const point = this.getPointFromEvent(event);
    this.addPointToStroke(point);
  }

  private handlePointerUp(): void {
    this.endStroke();
  }

  private handleTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      const point = this.getPointFromTouch(event.touches[0]);
      this.startStroke(point);
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    if (!this.state.isDrawing || event.touches.length !== 1) return;
    const point = this.getPointFromTouch(event.touches[0]);
    this.addPointToStroke(point);
  }

  private handleTouchEnd(): void {
    this.endStroke();
  }

  private getPointFromEvent(event: MouseEvent): Point {
    const rect = this.canvas!.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      pressure: 0.5,
      timestamp: Date.now(),
    };
  }

  private getPointFromTouch(touch: Touch): Point {
    const rect = this.canvas!.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      pressure: touch.force || 0.5,
      timestamp: Date.now(),
    };
  }

  // === STROKE MANAGEMENT ===

  private startStroke(point: Point): void {
    this.saveState(); // For undo functionality

    const strokeId = `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.state.currentStroke = {
      id: strokeId,
      points: [point],
      color: this.state.color,
      width: this.state.width,
      tool: this.state.tool,
      completed: false,
    };

    this.state.isDrawing = true;
    this.state.redoStack = []; // Clear redo stack when starting new stroke

    this.render();
  }

  private addPointToStroke(point: Point): void {
    if (!this.state.currentStroke || !this.state.isDrawing) return;

    this.state.currentStroke.points.push(point);

    // Apply smoothing if enabled
    if (this.config.smoothing && this.state.currentStroke.points.length > 2) {
      this.applySmoothingToCurrentStroke();
    }

    this.render();
  }

  private endStroke(): void {
    if (!this.state.currentStroke || !this.state.isDrawing) return;

    this.state.currentStroke.completed = true;
    this.state.isDrawing = false;

    // Apply shape recognition if enabled
    if (this.config.snapToShape) {
      this.attemptShapeRecognition(this.state.currentStroke);
    }

    // Add completed stroke to strokes array
    this.state.strokes.push(this.state.currentStroke);

    // Trigger callback
    this.callbacks.onStrokeComplete?.(this.state.currentStroke);

    // Check if drawing is complete (could be triggered by specific conditions)
    this.checkDrawingCompletion();

    this.state.currentStroke = null;
    this.render();
  }

  private applySmoothingToCurrentStroke(): void {
    if (!this.state.currentStroke || this.state.currentStroke.points.length < 3) return;

    const points = this.state.currentStroke.points;
    const lastIndex = points.length - 1;

    // Apply simple smoothing using quadratic curves
    if (lastIndex >= 2) {
      const p1 = points[lastIndex - 2];
      const p2 = points[lastIndex - 1];
      const p3 = points[lastIndex];

      // Create intermediate point
      const smoothedPoint: Point = {
        x: (p1.x + 2 * p2.x + p3.x) / 4,
        y: (p1.y + 2 * p2.y + p3.y) / 4,
        pressure: p2.pressure,
        timestamp: p2.timestamp,
      };

      points[lastIndex - 1] = smoothedPoint;
    }
  }

  // === SHAPE RECOGNITION ===

  private attemptShapeRecognition(stroke: Stroke): void {
    if (stroke.points.length < 5) return;

    const recognition = this.recognizeShape(stroke.points);

    if (recognition.confidence > 0.7) {
      // Replace stroke with recognized shape
      const shapeStroke = this.createShapeStroke(recognition, stroke);

      if (shapeStroke) {
        // Replace the last stroke with the shape
        Object.assign(stroke, shapeStroke);
        this.callbacks.onRecognition?.(recognition);
      }
    }
  }

  private recognizeShape(points: Point[]): RecognitionResult {
    const boundingBox = this.calculateBoundingBox(points);

    // Simple shape recognition algorithms
    const circleConfidence = this.isCircle(points, boundingBox);
    const squareConfidence = this.isSquare(points, boundingBox);
    const triangleConfidence = this.isTriangle(points, boundingBox);
    const lineConfidence = this.isLine(points, boundingBox);

    const confidences = [
      { shape: 'circle' as const, confidence: circleConfidence },
      { shape: 'square' as const, confidence: squareConfidence },
      { shape: 'triangle' as const, confidence: triangleConfidence },
      { shape: 'line' as const, confidence: lineConfidence },
    ];

    const bestMatch = confidences.reduce((best, current) =>
      current.confidence > best.confidence ? current : best
    );

    return {
      shape: bestMatch.shape,
      confidence: bestMatch.confidence,
      boundingBox,
    };
  }

  private calculateBoundingBox(points: Point[]): { x: number; y: number; width: number; height: number } {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  private isCircle(points: Point[], bbox: any): number {
    if (points.length < 10) return 0;

    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;
    const expectedRadius = Math.min(bbox.width, bbox.height) / 2;

    let sumDeviation = 0;
    for (const point of points) {
      const distance = Math.sqrt(
        Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
      );
      sumDeviation += Math.abs(distance - expectedRadius);
    }

    const avgDeviation = sumDeviation / points.length;
    const tolerance = expectedRadius * 0.2;

    return Math.max(0, 1 - (avgDeviation / tolerance));
  }

  private isSquare(points: Point[], bbox: any): number {
    // Check if bounding box is roughly square
    const aspectRatio = bbox.width / bbox.height;
    if (aspectRatio < 0.8 || aspectRatio > 1.2) return 0;

    // Check if points are near the corners/edges
    const tolerance = Math.min(bbox.width, bbox.height) * 0.1;
    let edgePoints = 0;

    for (const point of points) {
      const nearLeft = Math.abs(point.x - bbox.x) < tolerance;
      const nearRight = Math.abs(point.x - (bbox.x + bbox.width)) < tolerance;
      const nearTop = Math.abs(point.y - bbox.y) < tolerance;
      const nearBottom = Math.abs(point.y - (bbox.y + bbox.height)) < tolerance;

      if ((nearLeft || nearRight) || (nearTop || nearBottom)) {
        edgePoints++;
      }
    }

    return Math.min(1, edgePoints / (points.length * 0.6));
  }

  private isTriangle(points: Point[], bbox: any): number {
    // Simplified triangle detection - look for three distinct clusters
    if (points.length < 15) return 0;

    // For now, return low confidence - triangle detection is complex
    return 0.3;
  }

  private isLine(points: Point[], bbox: any): number {
    const aspectRatio = Math.max(bbox.width, bbox.height) / Math.min(bbox.width, bbox.height);

    if (aspectRatio < 3) return 0; // Not line-like

    // Check if points roughly follow a straight line
    let linearFit = 0;
    for (let i = 1; i < points.length - 1; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      const p3 = points[i + 1];

      // Calculate angle deviation
      const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
      const angleDiff = Math.abs(angle1 - angle2);

      if (angleDiff < 0.2) linearFit++; // Small angle difference
    }

    return Math.min(1, linearFit / (points.length * 0.7));
  }

  private createShapeStroke(recognition: RecognitionResult, originalStroke: Stroke): Stroke | null {
    if (!recognition.shape) return null;

    const bbox = recognition.boundingBox;
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;

    let points: Point[] = [];

    switch (recognition.shape) {
      case 'circle':
        points = this.generateCirclePoints(centerX, centerY, Math.min(bbox.width, bbox.height) / 2);
        break;
      case 'square':
        points = this.generateSquarePoints(bbox.x, bbox.y, bbox.width, bbox.height);
        break;
      case 'line':
        points = [{ x: bbox.x, y: centerY }, { x: bbox.x + bbox.width, y: centerY }];
        break;
      default:
        return null;
    }

    return {
      ...originalStroke,
      points,
    };
  }

  private generateCirclePoints(centerX: number, centerY: number, radius: number): Point[] {
    const points: Point[] = [];
    const numPoints = 64;

    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        pressure: 0.5,
        timestamp: Date.now(),
      });
    }

    return points;
  }

  private generateSquarePoints(x: number, y: number, width: number, height: number): Point[] {
    return [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
      { x, y }, // Close the square
    ].map(point => ({ ...point, pressure: 0.5, timestamp: Date.now() }));
  }

  // === DRAWING TOOLS ===

  setTool(tool: DrawingTool): void {
    this.state.tool = tool;

    // Update drawing properties based on tool
    switch (tool) {
      case 'pen':
        this.state.width = this.config.ageGroup === '3-5' ? 5 : 3;
        break;
      case 'brush':
        this.state.width = this.config.ageGroup === '3-5' ? 12 : 8;
        break;
      case 'crayon':
        this.state.width = this.config.ageGroup === '3-5' ? 10 : 6;
        break;
      case 'highlighter':
        this.state.width = this.config.ageGroup === '3-5' ? 15 : 10;
        break;
      case 'eraser':
        this.state.width = this.config.ageGroup === '3-5' ? 20 : 15;
        break;
    }
  }

  setColor(color: string): void {
    this.state.color = color;
  }

  setWidth(width: number): void {
    this.state.width = width;
  }

  // === RENDERING ===

  private render(): void {
    if (!this.context) return;

    // Clear canvas
    this.context.fillStyle = this.config.backgroundColor;
    this.context.fillRect(0, 0, this.config.width, this.config.height);

    // Draw grid if enabled
    if (this.config.gridAssist) {
      this.drawGrid();
    }

    // Draw completed strokes
    for (const stroke of this.state.strokes) {
      this.drawStroke(stroke);
    }

    // Draw current stroke
    if (this.state.currentStroke) {
      this.drawStroke(this.state.currentStroke);
    }
  }

  private drawStroke(stroke: Stroke): void {
    if (!this.context || stroke.points.length === 0) return;

    this.context.save();

    // Set stroke properties
    this.context.strokeStyle = stroke.color;
    this.context.lineWidth = stroke.width;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';

    // Handle different tools
    switch (stroke.tool) {
      case 'highlighter':
        this.context.globalCompositeOperation = 'multiply';
        this.context.globalAlpha = 0.4;
        break;
      case 'eraser':
        this.context.globalCompositeOperation = 'destination-out';
        break;
      case 'crayon':
        this.context.shadowColor = stroke.color;
        this.context.shadowBlur = 2;
        break;
      default:
        this.context.globalCompositeOperation = 'source-over';
    }

    // Draw the stroke
    this.context.beginPath();

    if (stroke.points.length === 1) {
      // Single point - draw a dot
      const point = stroke.points[0];
      this.context.arc(point.x, point.y, stroke.width / 2, 0, 2 * Math.PI);
      this.context.fill();
    } else {
      // Multiple points - draw connected lines
      this.context.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];

        if (this.config.smoothing && i < stroke.points.length - 1) {
          // Use quadratic curves for smoothing
          const nextPoint = stroke.points[i + 1];
          const controlX = (point.x + nextPoint.x) / 2;
          const controlY = (point.y + nextPoint.y) / 2;
          this.context.quadraticCurveTo(point.x, point.y, controlX, controlY);
        } else {
          this.context.lineTo(point.x, point.y);
        }
      }

      this.context.stroke();
    }

    this.context.restore();
  }

  private drawGrid(): void {
    if (!this.context) return;

    const gridSize = 20;
    this.context.save();
    this.context.strokeStyle = '#e0e0e0';
    this.context.lineWidth = 1;
    this.context.globalAlpha = 0.3;

    // Vertical lines
    for (let x = 0; x <= this.config.width; x += gridSize) {
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.config.height);
      this.context.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.config.height; y += gridSize) {
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(this.config.width, y);
      this.context.stroke();
    }

    this.context.restore();
  }

  // === STATE MANAGEMENT ===

  private saveState(): void {
    this.state.undoStack.push([...this.state.strokes]);

    // Limit undo stack size
    if (this.state.undoStack.length > this.config.undoLimit) {
      this.state.undoStack.shift();
    }
  }

  undo(): boolean {
    if (this.state.undoStack.length === 0) return false;

    // Save current state to redo stack
    this.state.redoStack.push([...this.state.strokes]);

    // Restore previous state
    const previousState = this.state.undoStack.pop()!;
    this.state.strokes = previousState;

    this.render();
    return true;
  }

  redo(): boolean {
    if (this.state.redoStack.length === 0) return false;

    // Save current state to undo stack
    this.state.undoStack.push([...this.state.strokes]);

    // Restore next state
    const nextState = this.state.redoStack.pop()!;
    this.state.strokes = nextState;

    this.render();
    return true;
  }

  clear(): void {
    this.saveState();
    this.state.strokes = [];
    this.state.currentStroke = null;
    this.state.isDrawing = false;
    this.state.redoStack = [];

    this.render();
    this.callbacks.onClear?.();
  }

  // === EXPORT/IMPORT ===

  exportToDataURL(format: 'png' | 'jpeg' = 'png', quality: number = 0.8): string {
    if (!this.canvas) throw new Error('Canvas not available');
    return this.canvas.toDataURL(`image/${format}`, quality);
  }

  exportStrokes(): Stroke[] {
    return JSON.parse(JSON.stringify(this.state.strokes));
  }

  importStrokes(strokes: Stroke[]): void {
    this.saveState();
    this.state.strokes = JSON.parse(JSON.stringify(strokes));
    this.render();
  }

  // === ANALYSIS ===

  analyzeDrawing(): {
    totalStrokes: number;
    totalPoints: number;
    drawingTime: number;
    avgStrokeLength: number;
    colors: string[];
    tools: DrawingTool[];
    boundingBox: { x: number; y: number; width: number; height: number };
  } {
    const allPoints = this.state.strokes.flatMap(stroke => stroke.points);
    const colors = [...new Set(this.state.strokes.map(stroke => stroke.color))];
    const tools = [...new Set(this.state.strokes.map(stroke => stroke.tool))];

    let minTime = Infinity;
    let maxTime = 0;

    for (const stroke of this.state.strokes) {
      for (const point of stroke.points) {
        if (point.timestamp) {
          minTime = Math.min(minTime, point.timestamp);
          maxTime = Math.max(maxTime, point.timestamp);
        }
      }
    }

    const drawingTime = maxTime - minTime;
    const avgStrokeLength = allPoints.length / this.state.strokes.length || 0;

    let boundingBox = { x: 0, y: 0, width: 0, height: 0 };
    if (allPoints.length > 0) {
      boundingBox = this.calculateBoundingBox(allPoints);
    }

    return {
      totalStrokes: this.state.strokes.length,
      totalPoints: allPoints.length,
      drawingTime,
      avgStrokeLength,
      colors,
      tools,
      boundingBox,
    };
  }

  private checkDrawingCompletion(): void {
    // This could be enhanced with specific completion criteria
    // For now, just trigger the callback after each stroke
    this.callbacks.onDrawingComplete?.(this.state.strokes);
  }

  // === CALLBACKS ===

  setCallbacks(callbacks: typeof this.callbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // === GETTERS ===

  getState(): CanvasState {
    return { ...this.state };
  }

  getConfig(): DrawingCanvasConfig {
    return { ...this.config };
  }

  canUndo(): boolean {
    return this.state.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.state.redoStack.length > 0;
  }

  isEmpty(): boolean {
    return this.state.strokes.length === 0;
  }

  // === CLEANUP ===

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Remove event listeners
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.handlePointerDown);
      this.canvas.removeEventListener('mousemove', this.handlePointerMove);
      this.canvas.removeEventListener('mouseup', this.handlePointerUp);
      this.canvas.removeEventListener('mouseleave', this.handlePointerUp);
      this.canvas.removeEventListener('touchstart', this.handleTouchStart);
      this.canvas.removeEventListener('touchmove', this.handleTouchMove);
      this.canvas.removeEventListener('touchend', this.handleTouchEnd);
      this.canvas.removeEventListener('touchcancel', this.handleTouchEnd);
    }

    this.canvas = null;
    this.context = null;
  }
}

export default DrawingCanvas;