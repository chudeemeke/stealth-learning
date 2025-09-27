/**
 * AAA+ Voice Interaction Service
 * Comprehensive voice control for 3-5 age group
 * Kid-friendly voice commands with animated assistant
 */

export interface VoiceCommand {
  phrases: string[];
  action: string;
  callback?: (params?: any) => void;
  response?: string;
  animation?: 'wave' | 'jump' | 'spin' | 'nod' | 'celebrate';
  requiresConfirmation?: boolean;
  ageGroup?: ('3-5' | '6-8' | '9+')[];
}

export interface VoiceAssistantState {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  lastCommand: string;
  confidence: number;
  emotion: 'happy' | 'excited' | 'thinking' | 'encouraging' | 'celebrating';
  animationState: string;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  voiceType: 'child-friendly' | 'standard' | 'character';
  volume: number;
  rate: number;
  pitch: number;
  autoListen: boolean;
  confirmationRequired: boolean;
  feedbackSounds: boolean;
  visualCues: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
  }
}

export class VoiceInteractionService {
  private static instance: VoiceInteractionService;
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private commands: Map<string, VoiceCommand> = new Map();
  private state: VoiceAssistantState;
  private settings: VoiceSettings;
  private isInitialized: boolean = false;
  private audioContext: AudioContext | null = null;
  private callbacks: Set<(state: VoiceAssistantState) => void> = new Set();
  private voiceCharacter: VoiceCharacter;
  private commandHistory: string[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private wakeWords: string[] = ['hey buddy', 'hello friend', 'hi there', 'help me'];
  private isAwake: boolean = false;
  private wakeTimeout: number | null = null;

  private readonly WAKE_TIMEOUT = 30000; // 30 seconds
  private readonly CONFIDENCE_THRESHOLD = 0.5;

  private constructor() {
    this.state = this.initializeState();
    this.settings = this.initializeSettings();
    this.voiceCharacter = new VoiceCharacter();
    this.initializeCommands();
    this.loadSettings();
  }

  public static getInstance(): VoiceInteractionService {
    if (!VoiceInteractionService.instance) {
      VoiceInteractionService.instance = new VoiceInteractionService();
    }
    return VoiceInteractionService.instance;
  }

  private initializeState(): VoiceAssistantState {
    return {
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
      lastCommand: '',
      confidence: 0,
      emotion: 'happy',
      animationState: 'idle'
    };
  }

  private initializeSettings(): VoiceSettings {
    return {
      enabled: true,
      language: 'en-US',
      voiceType: 'child-friendly',
      volume: 0.8,
      rate: 0.9, // Slightly slower for kids
      pitch: 1.2, // Slightly higher pitch
      autoListen: false,
      confirmationRequired: true,
      feedbackSounds: true,
      visualCues: true
    };
  }

  /**
   * Initialize voice service
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Check browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn('🎤 Speech Recognition not supported');
        return false;
      }

      if (!('speechSynthesis' in window)) {
        console.warn('🔊 Speech Synthesis not supported');
        return false;
      }

      // Initialize recognition
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;
      this.recognition.lang = this.settings.language;

      // Initialize synthesis
      this.synthesis = window.speechSynthesis;

      // Initialize audio context for sound effects
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Setup recognition handlers
      this.setupRecognitionHandlers();

      // Wait for voices to load
      await this.waitForVoices();

      // Initialize voice character
      this.voiceCharacter.initialize();

      this.isInitialized = true;
      console.log('🎙️ Voice Interaction Service initialized');

      // Welcome message for kids
      if (this.settings.enabled) {
        this.speak("Hi friend! I'm here to help you learn and play!", 'excited');
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize voice service:', error);
      return false;
    }
  }

  /**
   * Setup speech recognition handlers
   */
  private setupRecognitionHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.updateState({ isListening: true, emotion: 'happy' });
      this.playSound('listening');
      console.log('🎤 Listening...');
    };

    this.recognition.onend = () => {
      this.updateState({ isListening: false });

      // Restart if auto-listen is enabled
      if (this.settings.autoListen && this.settings.enabled) {
        setTimeout(() => this.startListening(), 500);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.updateState({ isListening: false, emotion: 'thinking' });

      if (event.error === 'no-speech') {
        this.speak("I didn't hear anything. Can you say that again?", 'encouraging');
      } else if (event.error === 'audio-capture') {
        this.speak("I can't hear you. Is your microphone working?", 'thinking');
      }
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.handleSpeechResult(event);
    };
  }

  /**
   * Initialize kid-friendly voice commands
   */
  private initializeCommands(): void {
    // Navigation commands
    this.addCommand({
      phrases: ['play games', 'let\'s play', 'start playing', 'play time'],
      action: 'navigate_games',
      response: 'Let\'s play some fun games!',
      animation: 'jump'
    });

    this.addCommand({
      phrases: ['go home', 'main menu', 'start over'],
      action: 'navigate_home',
      response: 'Going back home!',
      animation: 'wave'
    });

    // Game commands
    this.addCommand({
      phrases: ['play math', 'math time', 'numbers game', 'counting'],
      action: 'play_math',
      response: 'Let\'s play with numbers! Math is fun!',
      animation: 'spin'
    });

    this.addCommand({
      phrases: ['play english', 'letters game', 'words', 'reading'],
      action: 'play_english',
      response: 'Time for letters and words!',
      animation: 'nod'
    });

    this.addCommand({
      phrases: ['play science', 'science time', 'experiments'],
      action: 'play_science',
      response: 'Let\'s explore science together!',
      animation: 'jump'
    });

    // Answer commands (for young kids)
    this.addCommand({
      phrases: ['number one', 'first one', 'the first', 'one'],
      action: 'select_option_1',
      response: 'You chose the first one!',
      animation: 'nod'
    });

    this.addCommand({
      phrases: ['number two', 'second one', 'the second', 'two'],
      action: 'select_option_2',
      response: 'You chose the second one!',
      animation: 'nod'
    });

    this.addCommand({
      phrases: ['number three', 'third one', 'the third', 'three'],
      action: 'select_option_3',
      response: 'You chose the third one!',
      animation: 'nod'
    });

    this.addCommand({
      phrases: ['number four', 'fourth one', 'the fourth', 'four'],
      action: 'select_option_4',
      response: 'You chose the fourth one!',
      animation: 'nod'
    });

    // Help commands
    this.addCommand({
      phrases: ['help me', 'i need help', 'what do i do', 'help please'],
      action: 'show_help',
      response: 'I\'m here to help! You can say things like "play games" or "help me"!',
      animation: 'wave'
    });

    this.addCommand({
      phrases: ['repeat', 'say again', 'what did you say', 'again please'],
      action: 'repeat_last',
      response: 'Let me say that again!',
      animation: 'nod'
    });

    // Encouragement responses
    this.addCommand({
      phrases: ['i don\'t know', 'too hard', 'difficult', 'i can\'t'],
      action: 'encourage',
      response: 'That\'s okay! Let\'s try together. You can do it!',
      animation: 'celebrate'
    });

    // Fun interactions
    this.addCommand({
      phrases: ['hello', 'hi', 'hey', 'hi there'],
      action: 'greet',
      response: 'Hello friend! Ready to learn and play?',
      animation: 'wave'
    });

    this.addCommand({
      phrases: ['thank you', 'thanks', 'thanks a lot'],
      action: 'acknowledge',
      response: 'You\'re welcome! You\'re doing great!',
      animation: 'celebrate'
    });

    this.addCommand({
      phrases: ['good job', 'well done', 'awesome', 'great'],
      action: 'celebrate_self',
      response: 'Yes! You\'re amazing! Keep it up!',
      animation: 'celebrate'
    });

    // Control commands
    this.addCommand({
      phrases: ['stop', 'pause', 'wait', 'stop listening'],
      action: 'stop_listening',
      response: 'Okay, I\'ll stop listening now.',
      animation: 'nod'
    });

    this.addCommand({
      phrases: ['louder', 'speak louder', 'volume up'],
      action: 'increase_volume',
      response: 'Making it louder for you!',
      animation: 'nod'
    });

    this.addCommand({
      phrases: ['quieter', 'speak quieter', 'volume down', 'too loud'],
      action: 'decrease_volume',
      response: 'Making it quieter for you!',
      animation: 'nod'
    });
  }

  /**
   * Handle speech recognition results
   */
  private handleSpeechResult(event: SpeechRecognitionEvent): void {
    const results = event.results;
    const current = results[event.resultIndex];

    if (!current.isFinal) return;

    const transcript = current[0].transcript.toLowerCase().trim();
    const confidence = current[0].confidence;

    console.log(`🗣️ Heard: "${transcript}" (confidence: ${confidence})`);

    // Add to history
    this.commandHistory.push(transcript);
    if (this.commandHistory.length > 10) {
      this.commandHistory.shift();
    }

    // Update state
    this.updateState({
      lastCommand: transcript,
      confidence,
      isProcessing: true,
      emotion: 'thinking'
    });

    // Check for wake word if not awake
    if (!this.isAwake) {
      if (this.checkWakeWord(transcript)) {
        this.wake();
        return;
      }
      // Ignore commands when not awake
      this.updateState({ isProcessing: false });
      return;
    }

    // Process command if confidence is high enough
    if (confidence >= this.CONFIDENCE_THRESHOLD) {
      this.processCommand(transcript);
    } else {
      this.speak("I didn't quite catch that. Can you say it again?", 'encouraging');
      this.updateState({ isProcessing: false });
    }
  }

  /**
   * Check for wake word
   */
  private checkWakeWord(transcript: string): boolean {
    return this.wakeWords.some(word => transcript.includes(word));
  }

  /**
   * Wake the assistant
   */
  private wake(): void {
    this.isAwake = true;
    this.updateState({ emotion: 'excited' });
    this.speak("Hi! I'm listening! What would you like to do?", 'excited');
    this.voiceCharacter.animate('wave');

    // Set wake timeout
    if (this.wakeTimeout) {
      clearTimeout(this.wakeTimeout);
    }
    this.wakeTimeout = window.setTimeout(() => this.sleep(), this.WAKE_TIMEOUT);
  }

  /**
   * Put assistant to sleep
   */
  private sleep(): void {
    this.isAwake = false;
    this.updateState({ emotion: 'happy' });
    this.speak("Say 'hey buddy' when you need me!", 'happy');
    this.voiceCharacter.animate('sleep');
  }

  /**
   * Process recognized command
   */
  private processCommand(transcript: string): void {
    let commandFound = false;

    // Check each command
    for (const [key, command] of this.commands.entries()) {
      for (const phrase of command.phrases) {
        if (transcript.includes(phrase)) {
          commandFound = true;

          // Confirmation for important actions
          if (command.requiresConfirmation && this.settings.confirmationRequired) {
            this.confirmCommand(command, transcript);
          } else {
            this.executeCommand(command);
          }

          break;
        }
      }
      if (commandFound) break;
    }

    if (!commandFound) {
      // Try fuzzy matching for common mistakes
      const fuzzyCommand = this.fuzzyMatchCommand(transcript);
      if (fuzzyCommand) {
        this.executeCommand(fuzzyCommand);
      } else {
        this.speak("I don't understand that. Try saying 'help me' to see what I can do!", 'encouraging');
      }
    }

    this.updateState({ isProcessing: false });

    // Reset wake timeout
    if (this.wakeTimeout) {
      clearTimeout(this.wakeTimeout);
      this.wakeTimeout = window.setTimeout(() => this.sleep(), this.WAKE_TIMEOUT);
    }
  }

  /**
   * Fuzzy match commands for common mistakes
   */
  private fuzzyMatchCommand(transcript: string): VoiceCommand | null {
    // Simple fuzzy matching for kid mistakes
    const fuzzyMap: Record<string, string> = {
      'pway': 'play',
      'gwames': 'games',
      'hewp': 'help',
      'fank you': 'thank you',
      'pwease': 'please'
    };

    let corrected = transcript;
    for (const [mistake, correct] of Object.entries(fuzzyMap)) {
      corrected = corrected.replace(mistake, correct);
    }

    if (corrected !== transcript) {
      // Try matching again with corrected text
      for (const command of this.commands.values()) {
        for (const phrase of command.phrases) {
          if (corrected.includes(phrase)) {
            return command;
          }
        }
      }
    }

    return null;
  }

  /**
   * Confirm command before execution
   */
  private confirmCommand(command: VoiceCommand, transcript: string): void {
    this.speak(`Do you want to ${command.action.replace(/_/g, ' ')}? Say yes or no.`, 'thinking');

    // Listen for confirmation
    const confirmHandler = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      if (!result.isFinal) return;

      const response = result[0].transcript.toLowerCase();

      if (response.includes('yes') || response.includes('yeah') || response.includes('okay')) {
        this.executeCommand(command);
      } else if (response.includes('no') || response.includes('nope')) {
        this.speak("Okay, no problem!", 'happy');
      } else {
        this.speak("I need to hear yes or no.", 'encouraging');
      }

      // Remove handler
      this.recognition.removeEventListener('result', confirmHandler);
    };

    this.recognition.addEventListener('result', confirmHandler);
  }

  /**
   * Execute voice command
   */
  private executeCommand(command: VoiceCommand): void {
    console.log(`🎯 Executing command: ${command.action}`);

    // Update state
    this.updateState({ emotion: 'happy' });

    // Play animation
    if (command.animation) {
      this.voiceCharacter.animate(command.animation);
    }

    // Speak response
    if (command.response) {
      this.speak(command.response, this.state.emotion);
    }

    // Execute callback
    if (command.callback) {
      command.callback();
    }

    // Dispatch event for app to handle
    window.dispatchEvent(new CustomEvent('voice-command', {
      detail: {
        action: command.action,
        command: command
      }
    }));
  }

  /**
   * Add voice command
   */
  public addCommand(command: VoiceCommand): void {
    const key = command.phrases[0];
    this.commands.set(key, command);
  }

  /**
   * Start listening for voice commands
   */
  public startListening(): void {
    if (!this.isInitialized || !this.settings.enabled) {
      console.warn('Voice service not initialized or disabled');
      return;
    }

    if (this.state.isListening) return;

    try {
      this.recognition.start();
      this.playSound('activate');
    } catch (error) {
      console.error('Failed to start listening:', error);
    }
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    if (!this.recognition || !this.state.isListening) return;

    try {
      this.recognition.stop();
      this.playSound('deactivate');
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
  }

  /**
   * Speak text with emotion
   */
  public speak(text: string, emotion?: VoiceAssistantState['emotion']): void {
    if (!this.synthesis || !this.settings.enabled) return;

    // Cancel current utterance
    if (this.currentUtterance) {
      this.synthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.settings.volume;
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.lang = this.settings.language;

    // Select child-friendly voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = this.selectVoice(voices);
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Update state
    if (emotion) {
      this.updateState({ emotion });
    }
    this.updateState({ isSpeaking: true });

    // Handle events
    utterance.onstart = () => {
      this.voiceCharacter.startSpeaking();
    };

    utterance.onend = () => {
      this.updateState({ isSpeaking: false });
      this.voiceCharacter.stopSpeaking();
      this.currentUtterance = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.updateState({ isSpeaking: false });
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  /**
   * Select appropriate voice
   */
  private selectVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;

    // Priority list for kid-friendly voices
    const priorities = [
      'Google US English', // Female, clear
      'Microsoft Zira', // Female, friendly
      'Samantha', // macOS female
      'Daniel' // Friendly male
    ];

    // Try to find preferred voice
    for (const name of priorities) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }

    // Fallback to any female voice (usually friendlier for kids)
    const femaleVoice = voices.find(v =>
      v.name.toLowerCase().includes('female') ||
      v.name.includes('Zira') ||
      v.name.includes('Samantha')
    );
    if (femaleVoice) return femaleVoice;

    // Default to first voice
    return voices[0];
  }

  /**
   * Wait for voices to load
   */
  private async waitForVoices(): Promise<void> {
    return new Promise(resolve => {
      const voices = this.synthesis?.getVoices();
      if (voices && voices.length > 0) {
        resolve();
        return;
      }

      if ('onvoiceschanged' in this.synthesis!) {
        this.synthesis!.onvoiceschanged = () => {
          resolve();
        };
      } else {
        // Fallback with timeout
        setTimeout(resolve, 100);
      }
    });
  }

  /**
   * Play sound effect
   */
  private playSound(type: 'activate' | 'deactivate' | 'listening' | 'success' | 'error'): void {
    if (!this.settings.feedbackSounds || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    switch (type) {
      case 'activate':
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
        break;
      case 'deactivate':
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
        break;
      case 'listening':
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        break;
      case 'success':
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.2);
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        break;
    }

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Update state and notify listeners
   */
  private updateState(partial: Partial<VoiceAssistantState>): void {
    Object.assign(this.state, partial);
    this.callbacks.forEach(callback => callback(this.state));
  }

  /**
   * Subscribe to state changes
   */
  public onStateChange(callback: (state: VoiceAssistantState) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Update settings
   */
  public updateSettings(settings: Partial<VoiceSettings>): void {
    Object.assign(this.settings, settings);

    // Update recognition language if changed
    if (this.recognition && settings.language) {
      this.recognition.lang = settings.language;
    }

    this.saveSettings();
  }

  /**
   * Get current settings
   */
  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  /**
   * Get current state
   */
  public getState(): VoiceAssistantState {
    return { ...this.state };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('voice_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save voice settings:', error);
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('voice_settings');
      if (stored) {
        Object.assign(this.settings, JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load voice settings:', error);
    }
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    this.stopListening();
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    if (this.wakeTimeout) {
      clearTimeout(this.wakeTimeout);
    }
    this.callbacks.clear();
  }
}

/**
 * Voice Character Animation
 */
class VoiceCharacter {
  private element: HTMLElement | null = null;
  private currentAnimation: string = 'idle';
  private isSpeaking: boolean = false;

  public initialize(): void {
    // Create character element if needed
    // This would be integrated with React component
    console.log('🤖 Voice character initialized');
  }

  public animate(animation: string): void {
    this.currentAnimation = animation;
    // Trigger CSS animation or Lottie animation
    console.log(`🎭 Character animation: ${animation}`);
  }

  public startSpeaking(): void {
    this.isSpeaking = true;
    this.animate('speaking');
  }

  public stopSpeaking(): void {
    this.isSpeaking = false;
    this.animate('idle');
  }
}

// Export singleton instance
export const voiceService = VoiceInteractionService.getInstance();