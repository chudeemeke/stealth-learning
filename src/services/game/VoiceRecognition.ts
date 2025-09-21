import * as React from 'react';
import type {
  AgeGroup,
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionResult,
  WebkitAudioContext
} from '@/types';
import {
  WebAPIFeatureDetection,
  SpeechRecognitionWrapper,
  AudioContextWrapper
} from '@/utils/web-api-utils';

export interface VoiceRecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  ageGroup: AgeGroup;
  noiseReduction: boolean;
  timeout: number;
  autoStop: boolean;
}

export interface RecognitionResult {
  transcript: string;
  confidence: number;
  alternatives: Array<{
    transcript: string;
    confidence: number;
  }>;
  isFinal: boolean;
  timestamp: number;
}

export interface VoiceCommand {
  pattern: string | RegExp;
  action: string;
  confidence: number;
  description: string;
}

export interface VoiceAnalysis {
  clarity: number;
  volume: number;
  pace: number;
  pronunciation: number;
  age: number;
}

export class VoiceRecognitionEngine {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private config: VoiceRecognitionConfig;
  private callbacks: {
    onResult?: (result: RecognitionResult) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onCommand?: (command: VoiceCommand, transcript: string) => void;
  };
  private commands: VoiceCommand[] = [];
  private audioContext: AudioContext | WebkitAudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private volumeCallback: ((volume: number) => void) | null = null;
  private isInitialized: boolean = false;

  constructor(config: Partial<VoiceRecognitionConfig> = {}) {
    this.config = {
      language: 'en-US',
      continuous: false,
      interimResults: true,
      maxAlternatives: 3,
      ageGroup: '6-8',
      noiseReduction: true,
      timeout: 10000,
      autoStop: true,
      ...config,
    };

    this.callbacks = {};
    this.isInitialized = false;
    this.initialize();
  }

  // === INITIALIZATION ===

  private initialize(): void {
    if (!this.isSupported()) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    try {
      this.setupSpeechRecognition();
      this.setupAudioAnalysis();
      this.setupAgeAppropriateCommands();
      this.isInitialized = true;
      console.log('✅ VoiceRecognitionEngine initialized:', this.config);
    } catch (error) {
      console.error('Failed to initialize VoiceRecognitionEngine:', error);
      this.isInitialized = false;
    }
  }

  private isSupported(): boolean {
    return WebAPIFeatureDetection.isSpeechRecognitionSupported();
  }

  private setupSpeechRecognition(): void {
    const SpeechRecognitionConstructor = WebAPIFeatureDetection.getSpeechRecognitionConstructor();

    if (!SpeechRecognitionConstructor) {
      console.error('Speech Recognition not available');
      return;
    }

    this.recognition = new SpeechRecognitionConstructor();

    // Configure recognition
    this.recognition.lang = this.config.language;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;

    // Event handlers
    this.recognition.onstart = this.handleStart.bind(this);
    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = this.handleError.bind(this);
    this.recognition.onend = this.handleEnd.bind(this);
    this.recognition.onnomatch = this.handleNoMatch.bind(this);
    this.recognition.onspeechstart = this.handleSpeechStart.bind(this);
    this.recognition.onspeechend = this.handleSpeechEnd.bind(this);
  }

  private async setupAudioAnalysis(): Promise<void> {
    try {
      const AudioContextConstructor = WebAPIFeatureDetection.getAudioContextConstructor();

      if (!AudioContextConstructor) {
        console.warn('Web Audio API not available');
        return;
      }

      this.audioContext = new AudioContextConstructor();

      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: this.config.noiseReduction,
          autoGainControl: true,
        }
      });

      // Create audio analysis chain
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();

      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      console.log('✅ Audio analysis setup complete');
    } catch (error) {
      console.error('Failed to setup audio analysis:', error);
    }
  }

  private setupAgeAppropriateCommands(): void {
    switch (this.config.ageGroup) {
      case '3-5':
        this.commands = [
          { pattern: /^(yes|yeah|yep)$/i, action: 'confirm', confidence: 0.8, description: 'Confirm answer' },
          { pattern: /^(no|nope)$/i, action: 'deny', confidence: 0.8, description: 'Deny answer' },
          { pattern: /^(help|stuck)$/i, action: 'help', confidence: 0.7, description: 'Request help' },
          { pattern: /^(done|finished)$/i, action: 'complete', confidence: 0.7, description: 'Mark as done' },
          { pattern: /^(red|blue|green|yellow|orange|purple|pink)$/i, action: 'color', confidence: 0.9, description: 'Name a color' },
          { pattern: /^(one|two|three|four|five|six|seven|eight|nine|ten)$/i, action: 'number', confidence: 0.9, description: 'Say a number' },
        ];
        break;

      case '6-8':
        this.commands = [
          { pattern: /^(start|begin)$/i, action: 'start', confidence: 0.8, description: 'Start activity' },
          { pattern: /^(stop|pause)$/i, action: 'pause', confidence: 0.8, description: 'Pause activity' },
          { pattern: /^(repeat|again)$/i, action: 'repeat', confidence: 0.7, description: 'Repeat question' },
          { pattern: /^(skip|next)$/i, action: 'skip', confidence: 0.7, description: 'Skip question' },
          { pattern: /^(hint|clue)$/i, action: 'hint', confidence: 0.8, description: 'Request hint' },
          { pattern: /^(submit|answer)$/i, action: 'submit', confidence: 0.8, description: 'Submit answer' },
          { pattern: /^[a-zA-Z]$/i, action: 'letter', confidence: 0.9, description: 'Say a letter' },
          { pattern: /^\\d+$/i, action: 'number', confidence: 0.9, description: 'Say a number' },
        ];
        break;

      case '9+':
        this.commands = [
          { pattern: /^(start|begin|commence)$/i, action: 'start', confidence: 0.8, description: 'Start activity' },
          { pattern: /^(stop|pause|halt)$/i, action: 'pause', confidence: 0.8, description: 'Pause activity' },
          { pattern: /^(repeat|say again)$/i, action: 'repeat', confidence: 0.7, description: 'Repeat question' },
          { pattern: /^(skip|next|pass)$/i, action: 'skip', confidence: 0.7, description: 'Skip question' },
          { pattern: /^(hint|clue|help)$/i, action: 'hint', confidence: 0.8, description: 'Request hint' },
          { pattern: /^(submit|answer|confirm)$/i, action: 'submit', confidence: 0.8, description: 'Submit answer' },
          { pattern: /^(undo|back)$/i, action: 'undo', confidence: 0.7, description: 'Undo last action' },
          { pattern: /^(clear|reset)$/i, action: 'clear', confidence: 0.7, description: 'Clear current work' },
        ];
        break;
    }
  }

  // === EVENT HANDLERS ===

  private handleStart(): void {
    this.isListening = true;
    console.log('🎤 Voice recognition started');
    this.callbacks.onStart?.();

    // Start volume monitoring
    if (this.volumeCallback) {
      this.startVolumeMonitoring();
    }

    // Set timeout if enabled
    if (this.config.autoStop && this.config.timeout > 0) {
      setTimeout(() => {
        if (this.isListening) {
          this.stop();
        }
      }, this.config.timeout);
    }
  }

  private handleResult(event: SpeechRecognitionEvent): void {
    const results: SpeechRecognitionResult[] = [];

    // Safely convert SpeechRecognitionResultList to array
    for (let i = 0; i < event.results.length; i++) {
      results.push(event.results[i]);
    }

    for (let i = event.resultIndex; i < results.length; i++) {
      const result = results[i];
      const alternative = result[0];

      const recognitionResult: RecognitionResult = {
        transcript: alternative.transcript.trim(),
        confidence: alternative.confidence,
        alternatives: (() => {
          const alts = [];
          for (let j = 0; j < result.length; j++) {
            alts.push({
              transcript: result[j].transcript.trim(),
              confidence: result[j].confidence,
            });
          }
          return alts;
        })(),
        isFinal: result.isFinal,
        timestamp: Date.now(),
      };

      console.log('🗣️ Recognition result:', recognitionResult);
      this.callbacks.onResult?.(recognitionResult);

      // Check for voice commands
      if (result.isFinal) {
        this.processVoiceCommands(recognitionResult.transcript);
      }
    }
  }

  private handleError(event: SpeechRecognitionErrorEvent): void {
    let errorMessage = 'Speech recognition error';

    switch (event.error) {
      case 'no-speech':
        errorMessage = 'No speech detected. Please try speaking louder.';
        break;
      case 'audio-capture':
        errorMessage = 'Microphone access denied or not available.';
        break;
      case 'not-allowed':
        errorMessage = 'Microphone permission denied.';
        break;
      case 'network':
        errorMessage = 'Network error occurred during recognition.';
        break;
      case 'service-not-allowed':
        errorMessage = 'Speech recognition service not allowed.';
        break;
      case 'bad-grammar':
        errorMessage = 'Grammar error in recognition.';
        break;
      case 'language-not-supported':
        errorMessage = 'Language not supported.';
        break;
    }

    console.error('🚨 Speech recognition error:', event.error, errorMessage);
    this.callbacks.onError?.(errorMessage);
  }

  private handleEnd(): void {
    this.isListening = false;
    console.log('🔇 Voice recognition ended');
    this.callbacks.onEnd?.();
    this.stopVolumeMonitoring();
  }

  private handleNoMatch(): void {
    console.log('🤷 No speech match found');

    // Provide age-appropriate feedback
    const feedback = this.getNoMatchFeedback();
    this.callbacks.onError?.(feedback);
  }

  private handleSpeechStart(): void {
    console.log('🗣️ Speech detected');
  }

  private handleSpeechEnd(): void {
    console.log('🤐 Speech ended');
  }

  // === VOICE COMMAND PROCESSING ===

  private processVoiceCommands(transcript: string): void {
    const normalizedTranscript = transcript.toLowerCase().trim();

    for (const command of this.commands) {
      const isMatch = this.testCommandPattern(command.pattern, normalizedTranscript);

      if (isMatch) {
        console.log('🎯 Voice command matched:', command.action, transcript);
        this.callbacks.onCommand?.(command, transcript);
        break;
      }
    }
  }

  private testCommandPattern(pattern: string | RegExp, transcript: string): boolean {
    if (pattern instanceof RegExp) {
      return pattern.test(transcript);
    } else {
      return transcript.includes(pattern.toLowerCase());
    }
  }

  // === AUDIO ANALYSIS ===

  private startVolumeMonitoring(): void {
    if (!this.analyser || !this.volumeCallback) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const monitor = () => {
      if (!this.isListening || !this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);

      // Calculate volume (RMS)
      const sum = dataArray.reduce((acc, value) => acc + value * value, 0);
      const rms = Math.sqrt(sum / dataArray.length);
      const volume = rms / 255; // Normalize to 0-1

      this.volumeCallback?.(volume);
      requestAnimationFrame(monitor);
    };

    monitor();
  }

  private stopVolumeMonitoring(): void {
    // Volume monitoring stops automatically when isListening becomes false
  }

  analyzeVoice(audioData: Float32Array): VoiceAnalysis {
    // Simple voice analysis - could be enhanced with more sophisticated algorithms
    const volume = this.calculateVolume(audioData);
    const clarity = this.calculateClarity(audioData);
    const pace = this.calculatePace(audioData);

    return {
      clarity: Math.min(1, clarity),
      volume: Math.min(1, volume),
      pace: Math.min(1, pace),
      pronunciation: 0.8, // Placeholder - would require advanced analysis
      age: this.estimateAge(), // Based on voice characteristics
    };
  }

  private calculateVolume(audioData: Float32Array): number {
    const sum = audioData.reduce((acc, sample) => acc + sample * sample, 0);
    return Math.sqrt(sum / audioData.length);
  }

  private calculateClarity(audioData: Float32Array): number {
    // Simple clarity measure based on signal variance
    const mean = audioData.reduce((acc, sample) => acc + sample, 0) / audioData.length;
    const variance = audioData.reduce((acc, sample) => acc + Math.pow(sample - mean, 2), 0) / audioData.length;
    return Math.min(1, variance * 10); // Normalize
  }

  private calculatePace(audioData: Float32Array): number {
    // Simple pace calculation - could be enhanced
    const threshold = 0.1;
    let speechSegments = 0;
    let inSpeech = false;

    for (let i = 0; i < audioData.length; i++) {
      const sample = audioData[i];
      if (Math.abs(sample) > threshold) {
        if (!inSpeech) {
          speechSegments++;
          inSpeech = true;
        }
      } else {
        inSpeech = false;
      }
    }

    return Math.min(1, speechSegments / 100); // Normalize
  }

  private estimateAge(): number {
    // Placeholder - would require sophisticated voice analysis
    // Could use pitch, formant frequencies, speaking rate, etc.
    const ageGroups = { '3-5': 4, '6-8': 7, '9+': 12 };
    return ageGroups[this.config.ageGroup] || 7;
  }

  // === PUBLIC API ===

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !this.recognition) {
        reject(new Error('Speech recognition not available or not properly initialized'));
        return;
      }

      if (this.isListening) {
        resolve();
        return;
      }

      try {
        this.recognition.start();

        // Wait for start event
        const startHandler = () => {
          this.recognition?.removeEventListener('start', startHandler);
          resolve();
        };

        this.recognition.addEventListener('start', startHandler);

        // Handle errors during start
        const errorHandler = (event: SpeechRecognitionErrorEvent) => {
          this.recognition?.removeEventListener('error', errorHandler);
          reject(new Error(`Failed to start recognition: ${event.error}`));
        };

        this.recognition.addEventListener('error', errorHandler);

      } catch (error) {
        reject(error);
      }
    });
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  abort(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  // === CONFIGURATION ===

  setLanguage(language: string): void {
    this.config.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  setAgeGroup(ageGroup: AgeGroup): void {
    this.config.ageGroup = ageGroup;
    this.setupAgeAppropriateCommands();
  }

  addCommand(command: VoiceCommand): void {
    this.commands.push(command);
  }

  removeCommand(action: string): void {
    this.commands = this.commands.filter(cmd => cmd.action !== action);
  }

  setCallbacks(callbacks: typeof this.callbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  setVolumeCallback(callback: (volume: number) => void): void {
    this.volumeCallback = callback;
  }

  // === UTILITY METHODS ===

  isRecognitionActive(): boolean {
    return this.isListening;
  }

  isInitializedProperly(): boolean {
    return this.isInitialized && this.recognition !== null;
  }

  getConfig(): VoiceRecognitionConfig {
    return { ...this.config };
  }

  getCommands(): VoiceCommand[] {
    return [...this.commands];
  }

  getSupportedLanguages(): string[] {
    // This would ideally come from the browser's capabilities
    return [
      'en-US', 'en-GB', 'es-ES', 'es-MX', 'fr-FR', 'de-DE',
      'it-IT', 'ja-JP', 'ko-KR', 'pt-BR', 'ru-RU', 'zh-CN'
    ];
  }

  private getNoMatchFeedback(): string {
    switch (this.config.ageGroup) {
      case '3-5':
        return "I didn't hear you clearly. Can you try again?";
      case '6-8':
        return "I didn't understand. Please speak clearly and try again.";
      case '9+':
        return "Speech not recognized. Please ensure you're speaking clearly and try again.";
      default:
        return "Speech not recognized. Please try again.";
    }
  }

  // === ADVANCED FEATURES ===

  enableContinuousMode(): void {
    this.config.continuous = true;
    if (this.recognition) {
      this.recognition.continuous = true;
    }
  }

  disableContinuousMode(): void {
    this.config.continuous = false;
    if (this.recognition) {
      this.recognition.continuous = false;
    }
  }

  // Text-to-Speech integration for feedback
  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Text-to-speech not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Age-appropriate voice settings
      switch (this.config.ageGroup) {
        case '3-5':
          utterance.rate = options.rate || 0.8;
          utterance.pitch = options.pitch || 1.2;
          break;
        case '6-8':
          utterance.rate = options.rate || 0.9;
          utterance.pitch = options.pitch || 1.1;
          break;
        case '9+':
          utterance.rate = options.rate || 1.0;
          utterance.pitch = options.pitch || 1.0;
          break;
      }

      utterance.volume = options.volume || 0.8;
      utterance.lang = this.config.language;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(event.error));

      speechSynthesis.speak(utterance);
    });
  }

  // === CLEANUP ===

  destroy(): void {
    this.stop();

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.recognition = null;
    this.analyser = null;
    this.volumeCallback = null;
    this.callbacks = {};

    console.log('🧹 VoiceRecognitionEngine destroyed');
  }
}

// React Hook for using VoiceRecognitionEngine
export function useVoiceRecognition(config: Partial<VoiceRecognitionConfig> = {}) {
  const [engine] = React.useState(() => new VoiceRecognitionEngine(config));
  const [isListening, setIsListening] = React.useState(false);
  const [lastResult, setLastResult] = React.useState<RecognitionResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [volume, setVolume] = React.useState(0);

  React.useEffect(() => {
    engine.setCallbacks({
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResult: (result) => setLastResult(result),
      onError: (error) => setError(error),
    });

    engine.setVolumeCallback(setVolume);

    return () => engine.destroy();
  }, [engine]);

  const startListening = React.useCallback(async () => {
    try {
      setError(null);
      await engine.start();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start listening');
    }
  }, [engine]);

  const stopListening = React.useCallback(() => {
    engine.stop();
  }, [engine]);

  const speak = React.useCallback((text: string, options?: any) => {
    return engine.speak(text, options);
  }, [engine]);

  return {
    isListening,
    lastResult,
    error,
    volume,
    startListening,
    stopListening,
    speak,
    engine,
  };
}

export default VoiceRecognitionEngine;