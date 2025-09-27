/**
 * Quick Feedback Engine - Non-intrusive incorrect answer feedback
 * Provides gentle, encouraging feedback that doesn't interrupt gameplay flow
 * Duration: 1-3 seconds maximum
 */

import { Howl } from 'howler';

export type FeedbackStyle = 'pulse' | 'quantum' | 'aurora';
export type AgeGroup = '3-5' | '6-8' | '9+';
export type Subject = 'math' | 'english' | 'science' | 'logic' | 'geography' | 'arts';

export interface FeedbackConfig {
  style: FeedbackStyle;
  ageGroup: AgeGroup;
  subject: Subject;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  proximity?: number; // 0-1, how close to correct answer
  attemptNumber?: number;
}

// Subject-specific feedback themes
const FEEDBACK_THEMES = {
  math: {
    colors: {
      warm: '#FCD34D', // Yellow - getting closer
      cool: '#93C5FD', // Blue - farther away
      neutral: '#F3F4F6' // Gray - neutral
    },
    messages: ['Almost there!', 'Try again!', 'Getting closer!', 'One more time!'],
    hints: ['Check your calculation', 'Review the operation', 'Count carefully']
  },
  english: {
    colors: {
      warm: '#FCA5A5', // Light red - getting closer
      cool: '#E5E7EB', // Gray - farther away
      neutral: '#FEF3C7' // Light yellow - neutral
    },
    messages: ['Good try!', 'Almost!', 'Keep going!', 'So close!'],
    hints: ['Check spelling', 'Sound it out', 'Think about the meaning']
  },
  science: {
    colors: {
      warm: '#6EE7B7', // Green - getting closer
      cool: '#E0E7FF', // Light blue - farther away
      neutral: '#F3F4F6' // Gray - neutral
    },
    messages: ['Experiment again!', 'Hypothesis needs work!', 'Observe closely!', 'Try another angle!'],
    hints: ['Think scientifically', 'Use the process', 'What did you observe?']
  },
  logic: {
    colors: {
      warm: '#C4B5FD', // Purple - getting closer
      cool: '#FED7E2', // Pink - farther away
      neutral: '#F9FAFB' // Light gray - neutral
    },
    messages: ['Rethink it!', 'Logic check!', 'Pattern break!', 'Analyze again!'],
    hints: ['Follow the pattern', 'Think step by step', 'What comes next?']
  },
  geography: {
    colors: {
      warm: '#FDE68A', // Yellow - getting closer
      cool: '#DBEAFE', // Light blue - farther away
      neutral: '#F3F4F6' // Gray - neutral
    },
    messages: ['Explore more!', 'Wrong direction!', 'Navigate again!', 'Chart a new course!'],
    hints: ['Think about location', 'Remember the map', 'Which continent?']
  },
  arts: {
    colors: {
      warm: '#FBCFE8', // Pink - getting closer
      cool: '#E9D5FF', // Light purple - farther away
      neutral: '#FAF5FF' // Very light purple - neutral
    },
    messages: ['Creative try!', 'Remix it!', 'Different stroke!', 'New perspective!'],
    hints: ['Express yourself', 'Try a different color', 'What do you see?']
  }
};

class PulseFeedback {
  execute(config: FeedbackConfig, element?: HTMLElement): void {
    const theme = FEEDBACK_THEMES[config.subject];
    const target = element || document.querySelector('.answer-input-area') as HTMLElement || document.body;

    // Create pulse overlay
    const pulse = document.createElement('div');
    pulse.className = 'pulse-feedback';
    pulse.style.cssText = `
      position: absolute;
      inset: -10px;
      border-radius: 12px;
      pointer-events: none;
      z-index: 1000;
      background: radial-gradient(circle, ${theme.colors.warm}40 0%, transparent 70%);
      animation: gentle-pulse 1.5s ease-out;
      opacity: 0;
    `;

    // Add to target
    target.style.position = 'relative';
    target.appendChild(pulse);

    // Show encouragement message
    if (config.ageGroup !== '9+') {
      this.showEncouragement(theme, config);
    }

    // Add hint sparkles
    this.addHintSparkles(target, theme);

    // Clean up
    setTimeout(() => {
      pulse.remove();
    }, 1500);
  }

  private showEncouragement(theme: any, config: FeedbackConfig): void {
    const message = theme.messages[Math.floor(Math.random() * theme.messages.length)];
    const encouragement = document.createElement('div');

    encouragement.textContent = message;
    encouragement.style.cssText = `
      position: fixed;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      color: #374151;
      padding: ${config.ageGroup === '3-5' ? '16px 32px' : '12px 24px'};
      border-radius: 24px;
      font-size: ${config.ageGroup === '3-5' ? '24px' : config.ageGroup === '6-8' ? '20px' : '16px'};
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      z-index: 10000;
      opacity: 0;
      animation: message-pop 1.5s ease-out;
    `;

    document.body.appendChild(encouragement);
    setTimeout(() => encouragement.remove(), 1500);
  }

  private addHintSparkles(target: HTMLElement, theme: any): void {
    // Add subtle sparkles that point toward correct direction
    for (let i = 0; i < 3; i++) {
      const sparkle = document.createElement('div');
      sparkle.textContent = '✨';
      sparkle.style.cssText = `
        position: absolute;
        font-size: 16px;
        pointer-events: none;
        z-index: 999;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        opacity: 0;
        animation: sparkle-hint 1.5s ease-out;
        animation-delay: ${i * 0.2}s;
      `;
      target.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1500);
    }
  }
}

class QuantumFeedback {
  execute(config: FeedbackConfig, element?: HTMLElement): void {
    const theme = FEEDBACK_THEMES[config.subject];
    const target = element || document.querySelector('.answer-input-area') as HTMLElement || document.body;

    // Create rewind effect
    this.createRewindEffect(target);

    // Show ghost of correct answer briefly
    if (config.proximity && config.proximity > 0.7) {
      this.showAnswerGhost(target, theme);
    }

    // Play soft chime
    if (config.soundEnabled) {
      this.playSoftChime();
    }

    // Auto-reset input with smooth animation
    this.autoResetInput(target);
  }

  private createRewindEffect(target: HTMLElement): void {
    // Create rewind particles
    const particles = document.createElement('div');
    particles.className = 'quantum-rewind';
    particles.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1000;
      overflow: hidden;
    `;

    // Add rewind particles
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #60A5FA;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        animation: rewind-particle 1s ease-out;
        animation-delay: ${i * 0.05}s;
      `;
      particles.appendChild(particle);
    }

    target.style.position = 'relative';
    target.appendChild(particles);

    // Screen edge shimmer
    this.addEdgeShimmer();

    // Clock rewind animation
    this.showClockRewind();

    setTimeout(() => particles.remove(), 1200);
  }

  private showAnswerGhost(target: HTMLElement, theme: any): void {
    const ghost = document.createElement('div');
    ghost.className = 'answer-ghost';
    ghost.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${theme.colors.warm};
      font-size: 20px;
      font-weight: 600;
      pointer-events: none;
      z-index: 999;
      opacity: 0;
      animation: ghost-flash 0.5s ease-out;
    `;
    ghost.textContent = '?';

    target.appendChild(ghost);
    setTimeout(() => ghost.remove(), 500);
  }

  private addEdgeShimmer(): void {
    const shimmer = document.createElement('div');
    shimmer.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 998;
      box-shadow: inset 0 0 100px rgba(147, 197, 253, 0.3);
      animation: edge-shimmer 1s ease-out;
    `;

    document.body.appendChild(shimmer);
    setTimeout(() => shimmer.remove(), 1000);
  }

  private showClockRewind(): void {
    const clock = document.createElement('div');
    clock.innerHTML = '⏰';
    clock.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      font-size: 32px;
      z-index: 10000;
      animation: clock-spin 1s ease-out;
      opacity: 0.5;
    `;

    document.body.appendChild(clock);
    setTimeout(() => clock.remove(), 1000);
  }

  private autoResetInput(target: HTMLElement): void {
    const input = target.querySelector('input') as HTMLElement as HTMLInputElement;
    if (input) {
      // Smooth fade and clear
      input.style.transition = 'opacity 0.3s ease-out';
      input.style.opacity = '0.3';

      setTimeout(() => {
        input.value = '';
        input.style.opacity = '1';
        input.focus();
      }, 300);
    }
  }

  private playSoftChime(): void {
    // Use Web Audio API for gentle chime
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 880; // A5 note
    oscillator.type = 'sine';

    gainNode.gain.value = 0.1;
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  }
}

class AuroraFeedback {
  private activeAurora: HTMLElement | null = null;

  execute(config: FeedbackConfig, element?: HTMLElement): void {
    const theme = FEEDBACK_THEMES[config.subject];
    const target = element || document.querySelector('.answer-input-area') as HTMLElement || document.body;

    // Create aurora effect
    this.createAuroraEffect(theme, config);

    // Adjust color temperature based on proximity
    if (config.proximity !== undefined) {
      this.adjustColorTemperature(config.proximity, theme);
    }

    // Add directional particles
    this.addDirectionalParticles(theme);

    // Breathing glow on UI elements
    this.addBreathingGlow(target, config.proximity || 0.5);

    // Subtle musical hint
    if (config.soundEnabled && config.proximity !== undefined) {
      this.playMusicalHint(config.proximity);
    }
  }

  private createAuroraEffect(theme: any, config: FeedbackConfig): void {
    // Remove existing aurora if any
    if (this.activeAurora) {
      this.activeAurora.remove();
    }

    const aurora = document.createElement('div');
    aurora.className = 'aurora-feedback';
    aurora.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 997;
      background: linear-gradient(
        135deg,
        ${theme.colors.warm}10 0%,
        ${theme.colors.cool}10 50%,
        ${theme.colors.neutral}10 100%
      );
      opacity: 0;
      animation: aurora-wave 3s ease-out;
    `;

    // Add aurora waves
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          ellipse at ${50 + (i - 1) * 30}% 0%,
          ${theme.colors.warm}20 0%,
          transparent 50%
        );
        animation: aurora-flow ${2 + i}s ease-in-out infinite;
        animation-delay: ${i * 0.3}s;
      `;
      aurora.appendChild(wave);
    }

    document.body.appendChild(aurora);
    this.activeAurora = aurora;

    // Auto-cleanup
    setTimeout(() => {
      if (this.activeAurora === aurora) {
        aurora.style.opacity = '0';
        aurora.style.transition = 'opacity 1s ease-out';
        setTimeout(() => {
          aurora.remove();
          if (this.activeAurora === aurora) {
            this.activeAurora = null;
          }
        }, 1000);
      }
    }, 2000);
  }

  private adjustColorTemperature(proximity: number, theme: any): void {
    // Adjust screen warmth based on proximity to correct answer
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 996;
      mix-blend-mode: multiply;
      background: ${proximity > 0.7 ? theme.colors.warm : proximity > 0.3 ? theme.colors.neutral : theme.colors.cool};
      opacity: ${0.1 * (1 - proximity)};
      animation: fade-in-out 2s ease-out;
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 2000);
  }

  private addDirectionalParticles(theme: any): void {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 998;
    `;

    // Create particles that drift toward correct answer
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: ${theme.colors.warm};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.5};
        animation: drift-hint 3s ease-out;
        animation-delay: ${i * 0.1}s;
      `;
      container.appendChild(particle);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3500);
  }

  private addBreathingGlow(target: HTMLElement, proximity: number): void {
    // Calculate breathing speed based on proximity
    const speed = proximity > 0.7 ? 0.5 : proximity > 0.3 ? 1 : 1.5;

    target.style.transition = 'all 0.3s ease-out';
    target.style.animation = `breathing-glow ${speed}s ease-in-out 3`;

    setTimeout(() => {
      target.style.animation = '';
    }, speed * 3000);
  }

  private playMusicalHint(proximity: number): void {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Higher pitch when closer to correct answer
    const baseFreq = 220; // A3
    const freq = baseFreq * (1 + proximity * 2);

    oscillator.frequency.value = freq;
    oscillator.type = 'triangle';

    gainNode.gain.value = 0.05;
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }
}

// Main Quick Feedback Engine
export class QuickFeedbackEngine {
  private static instance: QuickFeedbackEngine;
  private pulseFeedback: PulseFeedback;
  private quantumFeedback: QuantumFeedback;
  private auroraFeedback: AuroraFeedback;
  private currentStyle: FeedbackStyle = 'pulse';
  private feedbackHistory: Map<string, number> = new Map();

  private constructor() {
    this.pulseFeedback = new PulseFeedback();
    this.quantumFeedback = new QuantumFeedback();
    this.auroraFeedback = new AuroraFeedback();
    this.addGlobalStyles();
  }

  public static getInstance(): QuickFeedbackEngine {
    if (!QuickFeedbackEngine.instance) {
      QuickFeedbackEngine.instance = new QuickFeedbackEngine();
    }
    return QuickFeedbackEngine.instance;
  }

  public provideFeedback(config: FeedbackConfig, element?: HTMLElement): void {
    // Prevent feedback spam
    const now = Date.now();
    const lastFeedback = this.feedbackHistory.get('last') || 0;

    if (now - lastFeedback < 500) {
      return; // Don't show feedback more than once per 500ms
    }

    this.feedbackHistory.set('last', now);

    // Use the selected feedback style
    const style = config.style || this.currentStyle;

    switch (style) {
      case 'pulse':
        this.pulseFeedback.execute(config, element);
        break;
      case 'quantum':
        this.quantumFeedback.execute(config, element);
        break;
      case 'aurora':
        this.auroraFeedback.execute(config, element);
        break;
    }

    // Trigger haptic feedback if enabled
    if (config.hapticEnabled) {
      this.triggerHaptic();
    }
  }

  public setFeedbackStyle(style: FeedbackStyle): void {
    this.currentStyle = style;
  }

  public calculateProximity(userAnswer: string, correctAnswer: string): number {
    // Simple Levenshtein distance-based proximity
    const distance = this.levenshteinDistance(
      userAnswer.toLowerCase(),
      correctAnswer.toLowerCase()
    );

    const maxLength = Math.max(userAnswer.length, correctAnswer.length);
    const proximity = maxLength > 0 ? 1 - (distance / maxLength) : 0;

    return Math.max(0, Math.min(1, proximity));
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private triggerHaptic(): void {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 20]); // Gentle pattern
    }
  }

  private addGlobalStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gentle-pulse {
        0% {
          opacity: 0;
          transform: scale(0.95);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.05);
        }
        100% {
          opacity: 0;
          transform: scale(1);
        }
      }

      @keyframes message-pop {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(10px) scale(0.9);
        }
        40% {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1.05);
        }
        70% {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) translateY(-10px) scale(0.95);
        }
      }

      @keyframes sparkle-hint {
        0% {
          opacity: 0;
          transform: scale(0) rotate(0);
        }
        50% {
          opacity: 1;
          transform: scale(1) rotate(180deg);
        }
        100% {
          opacity: 0;
          transform: scale(0.5) rotate(360deg) translateY(-20px);
        }
      }

      @keyframes rewind-particle {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(
            calc(-50% + var(--random-x, 100px)),
            calc(-50% + var(--random-y, -100px))
          ) scale(0);
          opacity: 0;
        }
      }

      @keyframes ghost-flash {
        0%, 100% {
          opacity: 0;
        }
        50% {
          opacity: 0.3;
        }
      }

      @keyframes edge-shimmer {
        0% {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes clock-spin {
        0% {
          transform: rotate(0);
          opacity: 0;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          transform: rotate(-360deg);
          opacity: 0;
        }
      }

      @keyframes aurora-wave {
        0% {
          opacity: 0;
        }
        30% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes aurora-flow {
        0%, 100% {
          transform: translateY(0) scaleY(1);
        }
        50% {
          transform: translateY(-50px) scaleY(1.5);
        }
      }

      @keyframes fade-in-out {
        0% {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes drift-hint {
        0% {
          transform: translate(0, 0);
          opacity: 0;
        }
        20% {
          opacity: 1;
        }
        100% {
          transform: translate(var(--drift-x, 50px), var(--drift-y, -50px));
          opacity: 0;
        }
      }

      @keyframes breathing-glow {
        0%, 100% {
          filter: brightness(1);
        }
        50% {
          filter: brightness(1.1);
        }
      }

      /* Rewind particle variables */
      .quantum-rewind > div {
        --random-x: calc((random() - 0.5) * 200px);
        --random-y: calc((random() - 0.5) * 200px);
      }

      /* Drift hint variables */
      .aurora-feedback div[style*="drift-hint"] {
        --drift-x: calc((random() - 0.5) * 100px);
        --drift-y: calc((random() - 0.5) * 100px);
      }
    `;
    document.head.appendChild(style);
  }
}

// Export singleton instance
export const quickFeedbackEngine = QuickFeedbackEngine.getInstance();