/**
 * Enhanced Audio Service with comprehensive sound library
 * Provides high-quality audio experience for educational games
 */

import { Howl, Howler } from 'howler';

export interface AudioTrack {
  id: string;
  name: string;
  src: string;
  volume?: number;
  loop?: boolean;
  category: 'sfx' | 'music' | 'voice' | 'ambient';
  preload?: boolean;
}

export interface AudioConfig {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  voiceVolume: number;
  enabled: boolean;
  quality: 'low' | 'medium' | 'high';
}

class EnhancedAudioService {
  private audioTracks = new Map<string, Howl>();
  private currentMusic: Howl | null = null;
  private config: AudioConfig = {
    masterVolume: 0.8,
    sfxVolume: 0.7,
    musicVolume: 0.5,
    voiceVolume: 0.9,
    enabled: true,
    quality: 'high'
  };

  // Comprehensive sound library with generated audio descriptions
  private soundLibrary: AudioTrack[] = [
    // UI Sound Effects
    { id: 'click', name: 'Button Click', src: '/sounds/click.mp3', category: 'sfx', volume: 0.6 },
    { id: 'hover', name: 'Button Hover', src: '/sounds/hover.mp3', category: 'sfx', volume: 0.3 },
    { id: 'select', name: 'Item Select', src: '/sounds/select.mp3', category: 'sfx', volume: 0.5 },
    { id: 'back', name: 'Back Navigation', src: '/sounds/back.mp3', category: 'sfx', volume: 0.5 },

    // Game Sound Effects
    { id: 'correct', name: 'Correct Answer', src: '/sounds/correct.mp3', category: 'sfx', volume: 0.8 },
    { id: 'incorrect', name: 'Wrong Answer', src: '/sounds/incorrect.mp3', category: 'sfx', volume: 0.6 },
    { id: 'hint', name: 'Hint Reveal', src: '/sounds/hint.mp3', category: 'sfx', volume: 0.5 },
    { id: 'success', name: 'Success Chime', src: '/sounds/success.mp3', category: 'sfx', volume: 0.9 },
    { id: 'achievement', name: 'Achievement Unlock', src: '/sounds/achievement.mp3', category: 'sfx', volume: 1.0 },
    { id: 'levelUp', name: 'Level Complete', src: '/sounds/level-up.mp3', category: 'sfx', volume: 0.9 },
    { id: 'star', name: 'Star Earned', src: '/sounds/star.mp3', category: 'sfx', volume: 0.7 },
    { id: 'coin', name: 'Coin Collect', src: '/sounds/coin.mp3', category: 'sfx', volume: 0.6 },
    { id: 'powerup', name: 'Power Up', src: '/sounds/powerup.mp3', category: 'sfx', volume: 0.8 },

    // Emotional & Feedback Sounds
    { id: 'celebration', name: 'Celebration', src: '/sounds/celebration.mp3', category: 'sfx', volume: 0.9 },
    { id: 'applause', name: 'Applause', src: '/sounds/applause.mp3', category: 'sfx', volume: 0.7 },
    { id: 'cheer', name: 'Victory Cheer', src: '/sounds/cheer.mp3', category: 'sfx', volume: 0.8 },
    { id: 'whoosh', name: 'Magic Whoosh', src: '/sounds/whoosh.mp3', category: 'sfx', volume: 0.5 },
    { id: 'sparkle', name: 'Magical Sparkle', src: '/sounds/sparkle.mp3', category: 'sfx', volume: 0.4 },
    { id: 'ding', name: 'Notification Ding', src: '/sounds/ding.mp3', category: 'sfx', volume: 0.6 },
    { id: 'pop', name: 'Pop Sound', src: '/sounds/pop.mp3', category: 'sfx', volume: 0.5 },

    // Game State Sounds
    { id: 'pause', name: 'Game Pause', src: '/sounds/pause.mp3', category: 'sfx', volume: 0.4 },
    { id: 'resume', name: 'Game Resume', src: '/sounds/resume.mp3', category: 'sfx', volume: 0.4 },
    { id: 'gameStart', name: 'Game Start', src: '/sounds/game-start.mp3', category: 'sfx', volume: 0.7 },
    { id: 'gameEnd', name: 'Game Complete', src: '/sounds/game-end.mp3', category: 'sfx', volume: 0.8 },
    { id: 'countdown', name: 'Countdown Tick', src: '/sounds/countdown.mp3', category: 'sfx', volume: 0.6 },
    { id: 'timeWarning', name: 'Time Warning', src: '/sounds/time-warning.mp3', category: 'sfx', volume: 0.7 },

    // Subject-Specific Sounds
    { id: 'mathCorrect', name: 'Math Success', src: '/sounds/math-correct.mp3', category: 'sfx', volume: 0.8 },
    { id: 'englishCorrect', name: 'English Success', src: '/sounds/english-correct.mp3', category: 'sfx', volume: 0.8 },
    { id: 'scienceCorrect', name: 'Science Success', src: '/sounds/science-correct.mp3', category: 'sfx', volume: 0.8 },
    { id: 'typing', name: 'Typing Sound', src: '/sounds/typing.mp3', category: 'sfx', volume: 0.3 },
    { id: 'eraser', name: 'Eraser Sound', src: '/sounds/eraser.mp3', category: 'sfx', volume: 0.4 },

    // Background Music
    { id: 'menuMusic', name: 'Menu Theme', src: '/music/menu-theme.mp3', category: 'music', loop: true, volume: 0.4 },
    { id: 'mathMusic', name: 'Math Game Music', src: '/music/math-theme.mp3', category: 'music', loop: true, volume: 0.3 },
    { id: 'englishMusic', name: 'English Game Music', src: '/music/english-theme.mp3', category: 'music', loop: true, volume: 0.3 },
    { id: 'scienceMusic', name: 'Science Game Music', src: '/music/science-theme.mp3', category: 'music', loop: true, volume: 0.3 },
    { id: 'victoryMusic', name: 'Victory Theme', src: '/music/victory-theme.mp3', category: 'music', loop: false, volume: 0.6 },

    // Ambient Sounds
    { id: 'classroomAmbient', name: 'Classroom Atmosphere', src: '/sounds/ambient/classroom.mp3', category: 'ambient', loop: true, volume: 0.2 },
    { id: 'libraryAmbient', name: 'Library Atmosphere', src: '/sounds/ambient/library.mp3', category: 'ambient', loop: true, volume: 0.2 },
    { id: 'labAmbient', name: 'Science Lab Atmosphere', src: '/sounds/ambient/laboratory.mp3', category: 'ambient', loop: true, volume: 0.2 },
    { id: 'natureAmbient', name: 'Nature Sounds', src: '/sounds/ambient/nature.mp3', category: 'ambient', loop: true, volume: 0.3 }
  ];

  constructor() {
    this.loadConfig();
    this.initializeAudio();
  }

  private loadConfig(): void {
    try {
      const saved = localStorage.getItem('audioConfig');
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load audio config:', error);
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('audioConfig', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save audio config:', error);
    }
  }

  private initializeAudio(): void {
    // Set global Howler settings
    Howler.volume(this.config.masterVolume);

    // Preload critical sounds
    this.preloadSounds([
      'click', 'hover', 'select', 'correct', 'incorrect',
      'success', 'achievement', 'hint'
    ]);
  }

  // Enhanced Web Audio API sound generation for fallbacks
  private generateTone(frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine'): Promise<void> {
    return new Promise((resolve) => {
      if (!this.config.enabled) {
        resolve();
        return;
      }

      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.config.sfxVolume * 0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);

        setTimeout(resolve, duration * 1000);
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
        resolve();
      }
    });
  }

  // Fallback sounds using Web Audio API
  private async playFallbackSound(type: string): Promise<void> {
    const fallbackSounds: { [key: string]: () => Promise<void> } = {
      click: () => this.generateTone(800, 0.1),
      hover: () => this.generateTone(600, 0.05),
      correct: () => this.playMelody([523, 659, 784], 0.2),
      incorrect: () => this.generateTone(200, 0.3, 'square'),
      success: () => this.playMelody([523, 659, 784, 1047], 0.15),
      achievement: () => this.playMelody([392, 523, 659, 784, 1047], 0.2)
    };

    const fallback = fallbackSounds[type];
    if (fallback) {
      await fallback();
    }
  }

  private async playMelody(frequencies: number[], noteDuration: number): Promise<void> {
    for (let i = 0; i < frequencies.length; i++) {
      await this.generateTone(frequencies[i], noteDuration);
      await new Promise(resolve => setTimeout(resolve, noteDuration * 1000 * 0.1));
    }
  }

  // Public API methods
  public async playSound(soundId: string, options?: {
    volume?: number;
    rate?: number;
    onEnd?: () => void;
  }): Promise<void> {
    if (!this.config.enabled) return;

    try {
      let sound = this.audioTracks.get(soundId);

      if (!sound) {
        const track = this.soundLibrary.find(t => t.id === soundId);
        if (track) {
          sound = await this.loadSound(track);
        }
      }

      if (sound) {
        const volume = (options?.volume ?? 1) * this.getVolumeForCategory(this.getCategoryForSound(soundId));
        sound.volume(volume);

        if (options?.rate) sound.rate(options.rate);
        if (options?.onEnd) sound.once('end', options.onEnd);

        sound.play();
      } else {
        // Fallback to generated sound
        await this.playFallbackSound(soundId);
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundId}`, error);
      await this.playFallbackSound(soundId);
    }
  }

  public async playMusic(musicId: string, fadeInDuration = 1000): Promise<void> {
    if (!this.config.enabled) return;

    try {
      // Stop current music
      if (this.currentMusic) {
        this.currentMusic.fade(this.currentMusic.volume(), 0, 500);
        setTimeout(() => {
          this.currentMusic?.stop();
          this.currentMusic = null;
        }, 500);
      }

      // Load and play new music
      const track = this.soundLibrary.find(t => t.id === musicId && t.category === 'music');
      if (track) {
        const music = await this.loadSound(track);

        if (music) {
          music.volume(0);
          music.play();
          music.fade(0, this.config.musicVolume, fadeInDuration);
          this.currentMusic = music;
        }
      }
    } catch (error) {
      console.warn(`Failed to play music: ${musicId}`, error);
    }
  }

  public stopMusic(fadeOutDuration = 1000): void {
    if (this.currentMusic) {
      this.currentMusic.fade(this.currentMusic.volume(), 0, fadeOutDuration);
      setTimeout(() => {
        this.currentMusic?.stop();
        this.currentMusic = null;
      }, fadeOutDuration);
    }
  }

  public pauseMusic(): void {
    this.currentMusic?.pause();
  }

  public resumeMusic(): void {
    this.currentMusic?.play();
  }

  public preloadSounds(soundIds: string[]): void {
    soundIds.forEach(id => {
      const track = this.soundLibrary.find(t => t.id === id);
      if (track && !this.audioTracks.has(id)) {
        this.loadSound(track);
      }
    });
  }

  private async loadSound(track: AudioTrack): Promise<Howl> {
    return new Promise((resolve, reject) => {
      const sound = new Howl({
        src: [track.src],
        loop: track.loop || false,
        volume: track.volume || 1,
        preload: true,
        onload: () => {
          this.audioTracks.set(track.id, sound);
          resolve(sound);
        },
        onloaderror: (id, error) => {
          console.warn(`Failed to load sound: ${track.id}`, error);
          reject(error);
        }
      });
    });
  }

  private getCategoryForSound(soundId: string): 'sfx' | 'music' | 'voice' | 'ambient' {
    const track = this.soundLibrary.find(t => t.id === soundId);
    return track?.category || 'sfx';
  }

  private getVolumeForCategory(category: 'sfx' | 'music' | 'voice' | 'ambient'): number {
    switch (category) {
      case 'sfx': return this.config.sfxVolume;
      case 'music': return this.config.musicVolume;
      case 'voice': return this.config.voiceVolume;
      case 'ambient': return this.config.sfxVolume * 0.5;
      default: return this.config.sfxVolume;
    }
  }

  // Configuration methods
  public setMasterVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.config.masterVolume);
    this.saveConfig();
  }

  public setSfxVolume(volume: number): void {
    this.config.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveConfig();
  }

  public setMusicVolume(volume: number): void {
    this.config.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume(this.config.musicVolume);
    }
    this.saveConfig();
  }

  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.stopMusic(0);
      this.audioTracks.forEach(sound => sound.stop());
    }
    this.saveConfig();
  }

  public getConfig(): AudioConfig {
    return { ...this.config };
  }

  public getSoundLibrary(): AudioTrack[] {
    return [...this.soundLibrary];
  }

  // Advanced features
  public createSoundSequence(soundIds: string[], interval = 200): Promise<void> {
    return new Promise(async (resolve) => {
      for (let i = 0; i < soundIds.length; i++) {
        await this.playSound(soundIds[i]);
        if (i < soundIds.length - 1) {
          await new Promise(r => setTimeout(r, interval));
        }
      }
      resolve();
    });
  }

  public createSoundChord(soundIds: string[]): void {
    soundIds.forEach(id => this.playSound(id));
  }
}

// Export singleton instance
export const audioService = new EnhancedAudioService();
export default audioService;