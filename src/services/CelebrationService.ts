/**
 * Comprehensive Celebration Service
 * Duolingo-inspired celebration system with multiple celebration types
 * Includes confetti, streaks, achievements, and level-ups
 */

import confetti from 'canvas-confetti';

export interface CelebrationConfig {
  type: 'success' | 'achievement' | 'streak' | 'levelUp' | 'perfect' | 'milestone';
  intensity?: 'subtle' | 'normal' | 'intense';
  duration?: number;
  colors?: string[];
  sound?: boolean;
  message?: string;
  icon?: string;
}

export interface AchievementData {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt: Date;
}

export class CelebrationService {
  private static instance: CelebrationService;
  private activeConfetti: confetti.CreateTypes[] = [];
  private streakCounter: number = 0;
  private lastCelebrationTime: number = 0;
  private achievements: Map<string, AchievementData> = new Map();

  private constructor() {
    this.initializeAchievements();
  }

  public static getInstance(): CelebrationService {
    if (!CelebrationService.instance) {
      CelebrationService.instance = new CelebrationService();
    }
    return CelebrationService.instance;
  }

  /**
   * Initialize default achievements
   */
  private initializeAchievements(): void {
    const defaultAchievements: AchievementData[] = [
      {
        id: 'first_win',
        title: 'First Victory!',
        description: 'Complete your first game',
        icon: '🏆',
        rarity: 'common',
        xpReward: 10,
        unlockedAt: new Date(),
      },
      {
        id: 'streak_3',
        title: 'On Fire!',
        description: 'Get 3 correct answers in a row',
        icon: '🔥',
        rarity: 'uncommon',
        xpReward: 25,
        unlockedAt: new Date(),
      },
      {
        id: 'perfect_score',
        title: 'Perfectionist',
        description: 'Complete a game with 100% accuracy',
        icon: '⭐',
        rarity: 'rare',
        xpReward: 50,
        unlockedAt: new Date(),
      },
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete a game in under 1 minute',
        icon: '⚡',
        rarity: 'epic',
        xpReward: 75,
        unlockedAt: new Date(),
      },
      {
        id: 'master_learner',
        title: 'Master Learner',
        description: 'Reach level 50',
        icon: '👑',
        rarity: 'legendary',
        xpReward: 200,
        unlockedAt: new Date(),
      },
    ];

    defaultAchievements.forEach((achievement) => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  /**
   * Main celebration method - triggers appropriate celebration based on config
   */
  public celebrate(config: CelebrationConfig): void {
    const now = Date.now();

    // Prevent celebration spam
    if (now - this.lastCelebrationTime < 100) {
      return;
    }

    this.lastCelebrationTime = now;

    switch (config.type) {
      case 'success':
        this.celebrateSuccess(config);
        break;
      case 'achievement':
        this.celebrateAchievement(config);
        break;
      case 'streak':
        this.celebrateStreak(config);
        break;
      case 'levelUp':
        this.celebrateLevelUp(config);
        break;
      case 'perfect':
        this.celebratePerfect(config);
        break;
      case 'milestone':
        this.celebrateMilestone(config);
        break;
      default:
        this.celebrateSuccess(config);
    }

    // Play sound if enabled
    if (config.sound !== false) {
      this.playSound(config.type);
    }

    // Show message if provided
    if (config.message) {
      this.showCelebrationMessage(config.message, config.icon);
    }
  }

  /**
   * Success celebration - standard correct answer
   */
  private celebrateSuccess(config: CelebrationConfig): void {
    const intensity = config.intensity || 'normal';
    const colors = config.colors || ['#10B981', '#35B835', '#4ADE80'];

    const particleCount = intensity === 'subtle' ? 30 : intensity === 'intense' ? 150 : 75;
    const spread = intensity === 'subtle' ? 50 : intensity === 'intense' ? 100 : 70;

    confetti({
      particleCount,
      spread,
      origin: { y: 0.6 },
      colors,
      gravity: 0.8,
      scalar: 1,
      drift: 0,
      ticks: 100,
    });
  }

  /**
   * Achievement unlocked celebration
   */
  private celebrateAchievement(config: CelebrationConfig): void {
    const colors = config.colors || ['#FFC940', '#FFD700', '#FFA500', '#FF8C00'];

    // Star burst effect
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star'],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle'],
      });
    };

    // Multiple bursts
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }

  /**
   * Streak celebration - consecutive correct answers
   */
  private celebrateStreak(config: CelebrationConfig): void {
    this.streakCounter++;
    const colors = config.colors || ['#FF385C', '#FF6B6B', '#FF8787'];

    // Fire effect going up
    const duration = config.duration || 3000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        shapes: ['circle'],
        gravity: 0.5,
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        shapes: ['circle'],
        gravity: 0.5,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  /**
   * Level up celebration - major achievement
   */
  private celebrateLevelUp(config: CelebrationConfig): void {
    const colors = config.colors || ['#10B981', '#FFC940', '#FF385C', '#3B82F6', '#A855F7'];
    const duration = config.duration || 5000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const frame = () => {
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
        colors,
        gravity: randomInRange(0.8, 1.2),
        scalar: randomInRange(0.8, 1.2),
        drift: randomInRange(-0.5, 0.5),
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Extra burst at the beginning
    confetti({
      particleCount: 300,
      spread: 100,
      origin: { y: 0.4 },
      colors,
      startVelocity: 50,
      gravity: 1.2,
    });
  }

  /**
   * Perfect score celebration
   */
  private celebratePerfect(config: CelebrationConfig): void {
    const colors = config.colors || ['#FFD700', '#FFC940', '#FFED4E'];

    // Golden shower effect
    const end = Date.now() + 3000;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 90,
        spread: 360,
        origin: { x: Math.random(), y: 0 },
        colors,
        shapes: ['star', 'circle'],
        gravity: 2,
        drift: 0,
        scalar: randomInRange(0.4, 1),
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  /**
   * Milestone celebration - reaching significant points
   */
  private celebrateMilestone(config: CelebrationConfig): void {
    const colors = config.colors || ['#10B981', '#35B835', '#4ADE80', '#FFC940', '#FF385C'];

    // Fireworks effect
    const firework = () => {
      const particleCount = 300;
      const defaults = {
        origin: { y: 0.7 },
        colors,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        const count = Math.floor(particleCount * particleRatio);
        confetti({
          ...defaults,
          ...opts,
          particleCount: count,
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    };

    // Multiple fireworks
    firework();
    setTimeout(firework, 250);
    setTimeout(firework, 500);
  }

  /**
   * Play celebration sound
   */
  private playSound(type: string): void {
    // Create audio context for web audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds for different celebration types
    switch (type) {
      case 'success':
        // Success chord: C-E-G (major triad)
        this.playChord(audioContext, [261.63, 329.63, 392.00], 0.2);
        break;
      case 'achievement':
        // Achievement fanfare: ascending notes
        this.playArpeggio(audioContext, [261.63, 329.63, 392.00, 523.25], 0.3);
        break;
      case 'streak':
        // Streak sound: quick ascending glissando
        this.playGlissando(audioContext, 261.63, 523.25, 0.2);
        break;
      case 'levelUp':
        // Level up: triumphant fanfare
        this.playFanfare(audioContext);
        break;
      case 'perfect':
        // Perfect: sparkle sound
        this.playSparkle(audioContext);
        break;
      case 'milestone':
        // Milestone: grand chord progression
        this.playProgression(audioContext);
        break;
    }
  }

  private playChord(context: AudioContext, frequencies: number[], duration: number): void {
    const now = context.currentTime;
    frequencies.forEach((freq) => {
      const osc = context.createOscillator();
      const gain = context.createGain();

      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.value = 0.1;

      osc.connect(gain);
      gain.connect(context.destination);

      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  private playArpeggio(context: AudioContext, notes: number[], duration: number): void {
    notes.forEach((freq, index) => {
      setTimeout(() => {
        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.frequency.value = freq;
        osc.type = 'triangle';
        gain.gain.value = 0.15;

        osc.connect(gain);
        gain.connect(context.destination);

        const now = context.currentTime;
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }, index * 75);
    });
  }

  private playGlissando(context: AudioContext, startFreq: number, endFreq: number, duration: number): void {
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = 'sawtooth';
    gain.gain.value = 0.1;

    osc.connect(gain);
    gain.connect(context.destination);

    const now = context.currentTime;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  }

  private playFanfare(context: AudioContext): void {
    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 523.25, 659.25];
    this.playArpeggio(context, notes, 1);
  }

  private playSparkle(context: AudioContext): void {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const freq = 2000 + Math.random() * 2000;
        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.value = 0.05;

        osc.connect(gain);
        gain.connect(context.destination);

        const now = context.currentTime;
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }, i * 50);
    }
  }

  private playProgression(context: AudioContext): void {
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 369.99, 440.00], // D major
      [329.63, 415.30, 493.88], // E major
      [349.23, 440.00, 523.25], // F major
    ];

    chords.forEach((chord, index) => {
      setTimeout(() => {
        this.playChord(context, chord, 0.5);
      }, index * 200);
    });
  }

  /**
   * Show celebration message overlay
   */
  private showCelebrationMessage(message: string, icon?: string): void {
    const messageEl = document.createElement('div');
    messageEl.className = 'celebration-message animate-scale-in';
    messageEl.innerHTML = `
      ${icon ? `<span class="celebration-icon">${icon}</span>` : ''}
      <span class="celebration-text">${message}</span>
    `;

    // Style the message
    messageEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #10B981 0%, #35B835 100%);
      color: white;
      padding: 1.5rem 2.5rem;
      border-radius: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      font-family: 'Nunito', sans-serif;
      box-shadow: 0 10px 25px -5px rgba(67, 200, 67, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: scaleIn 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    document.body.appendChild(messageEl);

    // Remove after animation
    setTimeout(() => {
      messageEl.style.animation = 'fadeOut 300ms ease-in-out';
      setTimeout(() => {
        document.body.removeChild(messageEl);
      }, 300);
    }, 2000);
  }

  /**
   * Track and celebrate streaks
   */
  public incrementStreak(): number {
    this.streakCounter++;

    // Celebrate streak milestones
    if (this.streakCounter === 3) {
      this.celebrate({
        type: 'streak',
        message: '3 in a row! 🔥',
        icon: '🔥',
      });
    } else if (this.streakCounter === 5) {
      this.celebrate({
        type: 'streak',
        intensity: 'normal',
        message: '5 streak! On fire! 🔥',
        icon: '🔥🔥',
      });
    } else if (this.streakCounter === 10) {
      this.celebrate({
        type: 'streak',
        intensity: 'intense',
        message: 'UNSTOPPABLE! 10 STREAK! 🔥',
        icon: '🔥🔥🔥',
      });
    }

    return this.streakCounter;
  }

  /**
   * Reset streak counter
   */
  public resetStreak(): void {
    this.streakCounter = 0;
  }

  /**
   * Get current streak
   */
  public getStreak(): number {
    return this.streakCounter;
  }

  /**
   * Unlock an achievement
   */
  public unlockAchievement(achievementId: string): AchievementData | null {
    const achievement = this.achievements.get(achievementId);

    if (achievement) {
      this.celebrate({
        type: 'achievement',
        message: `Achievement Unlocked: ${achievement.title}`,
        icon: achievement.icon,
      });

      return achievement;
    }

    return null;
  }

  /**
   * Clean up any active celebrations
   */
  public cleanup(): void {
    this.activeConfetti.forEach((conf) => {
      if (conf && typeof conf === 'function') {
        conf.reset && conf.reset();
      }
    });
    this.activeConfetti = [];
  }
}

// Helper function for random values
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Export singleton instance
export const celebrationService = CelebrationService.getInstance();

// Export convenience functions
export const celebrate = (config: CelebrationConfig) => celebrationService.celebrate(config);
export const incrementStreak = () => celebrationService.incrementStreak();
export const resetStreak = () => celebrationService.resetStreak();
export const getStreak = () => celebrationService.getStreak();
export const unlockAchievement = (id: string) => celebrationService.unlockAchievement(id);