/**
 * Web API Type Definitions for Cross-Browser Compatibility
 *
 * This file provides ambient TypeScript definitions for Web APIs
 * that have incomplete or missing browser support in standard TypeScript lib files,
 * particularly for Speech Recognition and Web Audio APIs.
 *
 * These are pure type definitions that provide compile-time type safety
 * without affecting runtime behavior.
 */

// ===== SPEECH RECOGNITION API TYPES =====

/**
 * Speech Recognition Error Codes
 * Based on Web Speech API specification
 */
export type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';

/**
 * Speech Recognition Alternative Result
 */
export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

/**
 * Speech Recognition Result with alternatives
 */
export interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

/**
 * Collection of speech recognition results
 */
export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

/**
 * Speech Recognition Result Event
 */
export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  readonly interpretation: any;
  readonly emma: Document | null;
}

/**
 * Speech Recognition Error Event
 */
export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

/**
 * Speech Recognition Event Type Map
 */
export interface SpeechRecognitionEventMap {
  'start': Event;
  'end': Event;
  'error': SpeechRecognitionErrorEvent;
  'result': SpeechRecognitionEvent;
  'nomatch': SpeechRecognitionEvent;
  'speechstart': Event;
  'speechend': Event;
  'soundstart': Event;
  'soundend': Event;
  'audiostart': Event;
  'audioend': Event;
}

/**
 * Speech Recognition Main Interface
 * Supports both standard and webkit implementations
 */
export interface SpeechRecognition extends EventTarget {
  // Configuration properties
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;

  // Event handler properties
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;

  // Control methods
  start(): void;
  stop(): void;
  abort(): void;

  // Event listener methods
  addEventListener<K extends keyof SpeechRecognitionEventMap>(
    type: K,
    listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof SpeechRecognitionEventMap>(
    type: K,
    listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

/**
 * Speech Recognition Constructor Interface
 */
export interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
  prototype: SpeechRecognition;
}

// ===== WEB AUDIO API EXTENSIONS =====

/**
 * WebKit Audio Context Interface
 * For older webkit-prefixed implementations
 */
export interface WebkitAudioContext extends AudioContext {
  // Extends standard AudioContext - no additional properties needed
}

/**
 * WebKit Audio Context Constructor
 */
export interface WebkitAudioContextConstructor {
  new(contextOptions?: AudioContextOptions): WebkitAudioContext;
  prototype: WebkitAudioContext;
}

// ===== GLOBAL WINDOW INTERFACE EXTENSIONS =====

/**
 * Global Window interface extensions for browser API compatibility
 */
declare global {
  interface Window {
    // Speech Recognition API - both standard and webkit prefixed
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;

    // Web Audio API - webkit prefixed version
    AudioContext: typeof AudioContext;
    webkitAudioContext?: WebkitAudioContextConstructor;
  }
}

// ===== UTILITY TYPES FOR FEATURE DETECTION =====

/**
 * Browser compatibility information
 */
export interface BrowserSupport {
  readonly speechRecognition: {
    readonly chrome: string;
    readonly firefox: string;
    readonly safari: string;
    readonly edge: string;
    readonly opera: string;
    readonly webview: string;
    readonly prefixed: readonly string[];
  };
  readonly webAudio: {
    readonly chrome: string;
    readonly firefox: string;
    readonly safari: string;
    readonly edge: string;
    readonly opera: string;
    readonly webview: string;
    readonly prefixed: readonly string[];
  };
}

/**
 * Type-safe feature detection utility functions
 */
export interface WebAPIFeatureDetection {
  isSpeechRecognitionSupported(): boolean;
  isWebAudioSupported(): boolean;
  isSpeechSynthesisSupported(): boolean;
  getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null;
  getAudioContextConstructor(): typeof AudioContext | WebkitAudioContextConstructor | null;
}

/**
 * Progressive enhancement wrapper interfaces
 */
export interface SpeechRecognitionWrapper {
  isAvailable(): boolean;
  getInstance(): SpeechRecognition | null;
  configure(config: Partial<SpeechRecognition>): boolean;
}

export interface AudioContextWrapper {
  isAvailable(): boolean;
  getInstance(): AudioContext | WebkitAudioContext | null;
  resume(): Promise<boolean>;
  close(): Promise<void>;
}

// All types are exported via interface/type declarations above
// No additional exports needed to avoid conflicts