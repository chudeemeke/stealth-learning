/**
 * Audio Generator for creating placeholder sounds using Web Audio API
 * Creates high-quality educational game sounds programmatically
 */

export class AudioGenerator {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Generate a click sound
  public generateClick(): Promise<Blob> {
    return this.generateAndExport(() => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    }, 0.1);
  }

  // Generate a success sound
  public generateSuccess(): Promise<Blob> {
    return this.generateAndExport(() => {
      const frequencies = [523.25, 659.25, 783.99]; // C, E, G major chord
      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = this.audioContext.currentTime + index * 0.1;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
      });
    }, 0.8);
  }

  // Generate an error sound
  public generateError(): Promise<Blob> {
    return this.generateAndExport(() => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.type = 'sawtooth';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.4);
    }, 0.4);
  }

  // Generate achievement sound
  public generateAchievement(): Promise<Blob> {
    return this.generateAndExport(() => {
      const melody = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C octave
      melody.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'triangle';

        const startTime = this.audioContext.currentTime + index * 0.15;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      });
    }, 1.0);
  }

  // Generate level up sound
  public generateLevelUp(): Promise<Blob> {
    return this.generateAndExport(() => {
      // Ascending melody
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
      notes.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = this.audioContext.currentTime + index * 0.1;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
      });
    }, 1.5);
  }

  // Generate coin collect sound
  public generateCoin(): Promise<Blob> {
    return this.generateAndExport(() => {
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator1.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator1.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.2);
      oscillator1.type = 'square';

      oscillator2.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);
      oscillator2.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      oscillator1.start(this.audioContext.currentTime);
      oscillator1.stop(this.audioContext.currentTime + 0.2);
      oscillator2.start(this.audioContext.currentTime);
      oscillator2.stop(this.audioContext.currentTime + 0.2);
    }, 0.3);
  }

  // Generate background music loop
  public generateBackgroundMusic(style: 'math' | 'english' | 'science' = 'math'): Promise<Blob> {
    const duration = 8; // 8 second loop

    return this.generateAndExport(() => {
      const chords = this.getChordProgression(style);
      const tempo = 120; // BPM
      const beatDuration = 60 / tempo;

      chords.forEach((chord, chordIndex) => {
        chord.forEach((freq, noteIndex) => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          const filter = this.audioContext.createBiquadFilter();

          oscillator.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(this.audioContext.destination);

          oscillator.frequency.value = freq;
          oscillator.type = 'triangle';

          filter.type = 'lowpass';
          filter.frequency.value = 2000;
          filter.Q.value = 1;

          const startTime = this.audioContext.currentTime + chordIndex * beatDuration * 2;
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(0.05, startTime + beatDuration * 2 - 0.1);
          gainNode.gain.linearRampToValueAtTime(0, startTime + beatDuration * 2);

          oscillator.start(startTime);
          oscillator.stop(startTime + beatDuration * 2);
        });
      });
    }, duration);
  }

  private getChordProgression(style: 'math' | 'english' | 'science'): number[][] {
    switch (style) {
      case 'math':
        // Structured, logical progression - C major, F major, G major, C major
        return [
          [261.63, 329.63, 392.00], // C major
          [174.61, 220.00, 261.63], // F major
          [196.00, 246.94, 293.66], // G major
          [261.63, 329.63, 392.00]  // C major
        ];
      case 'english':
        // Creative, flowing progression - Am, F, C, G
        return [
          [220.00, 261.63, 329.63], // A minor
          [174.61, 220.00, 261.63], // F major
          [261.63, 329.63, 392.00], // C major
          [196.00, 246.94, 293.66]  // G major
        ];
      case 'science':
        // Mysterious, discovery-like - Em, Am, D, G
        return [
          [164.81, 196.00, 246.94], // E minor
          [220.00, 261.63, 329.63], // A minor
          [146.83, 185.00, 220.00], // D major
          [196.00, 246.94, 293.66]  // G major
        ];
      default:
        return [
          [261.63, 329.63, 392.00], // C major
          [174.61, 220.00, 261.63], // F major
          [196.00, 246.94, 293.66], // G major
          [261.63, 329.63, 392.00]  // C major
        ];
    }
  }

  private async generateAndExport(generatorFn: () => void, duration: number): Promise<Blob> {
    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(2, 44100 * duration, 44100);

    // Temporarily replace the audio context
    const originalContext = this.audioContext;
    this.audioContext = offlineContext as any;

    try {
      generatorFn();

      const renderedBuffer = await offlineContext.startRendering();

      // Convert AudioBuffer to WAV Blob
      const wavBlob = this.audioBufferToWav(renderedBuffer);

      return wavBlob;
    } finally {
      this.audioContext = originalContext;
    }
  }

  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const writeUint16 = (offset: number, value: number) => {
      view.setUint16(offset, value, true);
    };

    const writeUint32 = (offset: number, value: number) => {
      view.setUint32(offset, value, true);
    };

    writeString(0, 'RIFF');
    writeUint32(4, 36 + length * numberOfChannels * 2);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    writeUint32(16, 16);
    writeUint16(20, 1);
    writeUint16(22, numberOfChannels);
    writeUint32(24, sampleRate);
    writeUint32(28, sampleRate * numberOfChannels * 2);
    writeUint16(32, numberOfChannels * 2);
    writeUint16(34, 16);
    writeString(36, 'data');
    writeUint32(40, length * numberOfChannels * 2);

    // PCM data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  // Generate all placeholder sounds and download them
  public async generateAllSounds(): Promise<void> {
    const sounds = [
      { name: 'click', generator: () => this.generateClick() },
      { name: 'success', generator: () => this.generateSuccess() },
      { name: 'error', generator: () => this.generateError() },
      { name: 'achievement', generator: () => this.generateAchievement() },
      { name: 'level-up', generator: () => this.generateLevelUp() },
      { name: 'coin', generator: () => this.generateCoin() },
      { name: 'math-theme', generator: () => this.generateBackgroundMusic('math') },
      { name: 'english-theme', generator: () => this.generateBackgroundMusic('english') },
      { name: 'science-theme', generator: () => this.generateBackgroundMusic('science') }
    ];

    for (const sound of sounds) {
      try {
        const blob = await sound.generator();
        this.downloadBlob(blob, `${sound.name}.wav`);
        console.log(`Generated: ${sound.name}.wav`);
      } catch (error) {
        console.error(`Failed to generate ${sound.name}:`, error);
      }
    }
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Export singleton
export const audioGenerator = new AudioGenerator();