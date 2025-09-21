/**
 * Web API Utility Functions and Wrapper Classes
 *
 * This file provides runtime implementations for feature detection
 * and progressive enhancement wrappers for Web APIs.
 *
 * These utilities complement the type definitions in web-api.d.ts
 * by providing actual runtime functionality.
 */

import type {
  SpeechRecognition,
  SpeechRecognitionConstructor,
  WebkitAudioContext,
  WebkitAudioContextConstructor,
  BrowserSupport,
  WebAPIFeatureDetection as IWebAPIFeatureDetection,
  SpeechRecognitionWrapper as ISpeechRecognitionWrapper,
  AudioContextWrapper as IAudioContextWrapper,
} from '@/types';

// ===== BROWSER COMPATIBILITY CONSTANTS =====

/**
 * Browser compatibility information for Web APIs
 */
const BROWSER_SUPPORT: BrowserSupport = {
  speechRecognition: {
    chrome: '25+',
    firefox: 'Not supported',
    safari: '14.1+',
    edge: '79+',
    opera: '27+',
    webview: '4.4+',
    prefixed: ['webkit'] as const
  },
  webAudio: {
    chrome: '14+',
    firefox: '25+',
    safari: '6+',
    edge: '12+',
    opera: '15+',
    webview: '37+',
    prefixed: ['webkit', 'moz'] as const
  }
} as const;

// ===== FEATURE DETECTION UTILITIES =====

/**
 * Feature detection utility class
 * Provides type-safe runtime checks for Web API availability
 */
class WebAPIFeatureDetection implements IWebAPIFeatureDetection {
  /**
   * Check if Speech Recognition is supported
   */
  static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' &&
           ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  /**
   * Check if Web Audio API is supported
   */
  static isWebAudioSupported(): boolean {
    return typeof window !== 'undefined' &&
           ('AudioContext' in window || 'webkitAudioContext' in window);
  }

  /**
   * Check if Speech Synthesis is supported
   */
  static isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Get the available Speech Recognition constructor
   */
  static getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  /**
   * Get the available Audio Context constructor
   */
  static getAudioContextConstructor(): typeof AudioContext | WebkitAudioContextConstructor | null {
    if (typeof window === 'undefined') return null;
    return window.AudioContext || window.webkitAudioContext || null;
  }

  // Instance methods for interface compatibility
  isSpeechRecognitionSupported(): boolean {
    return WebAPIFeatureDetection.isSpeechRecognitionSupported();
  }

  isWebAudioSupported(): boolean {
    return WebAPIFeatureDetection.isWebAudioSupported();
  }

  isSpeechSynthesisSupported(): boolean {
    return WebAPIFeatureDetection.isSpeechSynthesisSupported();
  }

  getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
    return WebAPIFeatureDetection.getSpeechRecognitionConstructor();
  }

  getAudioContextConstructor(): typeof AudioContext | WebkitAudioContextConstructor | null {
    return WebAPIFeatureDetection.getAudioContextConstructor();
  }
}

// ===== PROGRESSIVE ENHANCEMENT WRAPPERS =====

/**
 * Progressive enhancement wrapper for speech recognition
 * Provides graceful degradation when APIs are not available
 */
class SpeechRecognitionWrapper implements ISpeechRecognitionWrapper {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = WebAPIFeatureDetection.isSpeechRecognitionSupported();

    if (this.isSupported) {
      const SpeechRecognitionConstructor = WebAPIFeatureDetection.getSpeechRecognitionConstructor();
      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
      }
    }
  }

  /**
   * Check if speech recognition is available and initialized
   */
  public isAvailable(): boolean {
    return this.isSupported && this.recognition !== null;
  }

  /**
   * Get the recognition instance (with type safety)
   */
  public getInstance(): SpeechRecognition | null {
    return this.recognition;
  }

  /**
   * Safe method to configure recognition with fallback
   */
  public configure(config: Partial<SpeechRecognition>): boolean {
    if (!this.recognition) return false;

    try {
      Object.assign(this.recognition, config);
      return true;
    } catch (error) {
      console.warn('Failed to configure speech recognition:', error);
      return false;
    }
  }
}

/**
 * Progressive enhancement wrapper for audio context
 * Provides graceful degradation when APIs are not available
 */
class AudioContextWrapper implements IAudioContextWrapper {
  private audioContext: AudioContext | WebkitAudioContext | null = null;
  private isSupported: boolean = false;

  constructor(options?: AudioContextOptions) {
    this.isSupported = WebAPIFeatureDetection.isWebAudioSupported();

    if (this.isSupported) {
      const AudioContextConstructor = WebAPIFeatureDetection.getAudioContextConstructor();
      if (AudioContextConstructor) {
        try {
          this.audioContext = new AudioContextConstructor(options);
        } catch (error) {
          console.warn('Failed to create audio context:', error);
          this.isSupported = false;
        }
      }
    }
  }

  /**
   * Check if audio context is available and initialized
   */
  public isAvailable(): boolean {
    return this.isSupported && this.audioContext !== null;
  }

  /**
   * Get the audio context instance (with type safety)
   */
  public getInstance(): AudioContext | WebkitAudioContext | null {
    return this.audioContext;
  }

  /**
   * Resume audio context if suspended (required by browser autoplay policies)
   */
  public async resume(): Promise<boolean> {
    if (!this.audioContext) return false;

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      return this.audioContext.state === 'running';
    } catch (error) {
      console.warn('Failed to resume audio context:', error);
      return false;
    }
  }

  /**
   * Close and cleanup audio context
   */
  public async close(): Promise<void> {
    if (this.audioContext) {
      try {
        await this.audioContext.close();
      } catch (error) {
        console.warn('Failed to close audio context:', error);
      } finally {
        this.audioContext = null;
      }
    }
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get user agent information for browser-specific handling
 */
function getBrowserInfo() {
  if (typeof window === 'undefined' || !window.navigator) {
    return { name: 'unknown', version: 'unknown', isWebkit: false };
  }

  const userAgent = window.navigator.userAgent;
  const isWebkit = /webkit/i.test(userAgent);

  let name = 'unknown';
  let version = 'unknown';

  if (/chrome/i.test(userAgent)) {
    name = 'chrome';
    const match = userAgent.match(/chrome\/(\d+)/i);
    version = match ? match[1] : 'unknown';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    name = 'safari';
    const match = userAgent.match(/version\/(\d+)/i);
    version = match ? match[1] : 'unknown';
  } else if (/firefox/i.test(userAgent)) {
    name = 'firefox';
    const match = userAgent.match(/firefox\/(\d+)/i);
    version = match ? match[1] : 'unknown';
  } else if (/edge/i.test(userAgent)) {
    name = 'edge';
    const match = userAgent.match(/edge\/(\d+)/i);
    version = match ? match[1] : 'unknown';
  }

  return { name, version, isWebkit };
}

/**
 * Check if a specific browser version meets minimum requirements
 */
function checkBrowserCompatibility(
  apiType: keyof BrowserSupport,
  currentBrowser?: ReturnType<typeof getBrowserInfo>
): { isSupported: boolean; reason?: string } {
  const browser = currentBrowser || getBrowserInfo();
  const requirements = BROWSER_SUPPORT[apiType];

  if (!requirements) {
    return { isSupported: false, reason: 'API type not recognized' };
  }

  const browserRequirement = requirements[browser.name as keyof typeof requirements] as string;

  if (typeof browserRequirement === 'string') {
    if (browserRequirement === 'Not supported') {
      return { isSupported: false, reason: `${browser.name} does not support ${apiType}` };
    }

    // Parse version requirement (e.g., "25+" -> 25)
    const minVersionMatch = browserRequirement.match(/(\d+)/);
    if (minVersionMatch && browser.version !== 'unknown') {
      const minVersion = parseInt(minVersionMatch[1], 10);
      const currentVersion = parseInt(browser.version, 10);

      if (currentVersion >= minVersion) {
        return { isSupported: true };
      } else {
        return {
          isSupported: false,
          reason: `${browser.name} version ${browser.version} is below minimum requirement ${browserRequirement}`
        };
      }
    }
  }

  return { isSupported: false, reason: 'Unable to determine compatibility' };
}

// ===== EXPORTS =====

export {
  WebAPIFeatureDetection,
  SpeechRecognitionWrapper,
  AudioContextWrapper,
  BROWSER_SUPPORT,
  getBrowserInfo,
  checkBrowserCompatibility
};