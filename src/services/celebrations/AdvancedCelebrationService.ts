/**
 * Advanced Celebration Service - AAA+ Gaming-Level Celebrations
 * Supports all 6 subjects with multiple celebration styles
 * Fully configurable through parent dashboard
 */

import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import * as THREE from 'three';

export type Subject = 'math' | 'english' | 'science' | 'logic' | 'geography' | 'arts';
export type CelebrationStyle = 'cosmic' | 'universe' | 'companion';
export type FeedbackStyle = 'pulse' | 'quantum' | 'aurora';
export type AgeGroup = '3-5' | '6-8' | '9+';

export interface CelebrationConfig {
  subject: Subject;
  style: CelebrationStyle;
  intensity: 'low' | 'medium' | 'high';
  ageGroup: AgeGroup;
  streakLevel: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  reducedMotion: boolean;
}

export interface FeedbackConfig {
  style: FeedbackStyle;
  ageGroup: AgeGroup;
  soundEnabled: boolean;
  duration: number; // 1-3 seconds
}

// Subject-specific celebration configurations
const SUBJECT_THEMES = {
  math: {
    colors: ['#3B82F6', '#1D4ED8', '#60A5FA', '#93C5FD'],
    symbols: ['✨', '⭐', '+', '×', '=', '∞', '💎', '🔢', 'π', '∑'],
    sounds: ['math-success-1', 'math-success-2', 'math-success-3'],
    particles: {
      shapes: ['square', 'circle', 'triangle'],
      behaviors: ['spiral', 'equation-form', 'geometric-build']
    }
  },
  english: {
    colors: ['#EF4444', '#DC2626', '#F87171', '#FCA5A5'],
    symbols: ['📚', '✨', 'A', 'B', 'C', '🔤', '📝', '💭', '✍️', '📖'],
    sounds: ['english-success-1', 'english-success-2', 'english-success-3'],
    particles: {
      shapes: ['letter', 'word-bubble', 'book-page'],
      behaviors: ['typewriter', 'float-up', 'story-unfold']
    }
  },
  science: {
    colors: ['#10B981', '#059669', '#34D399', '#6EE7B7'],
    symbols: ['⚗️', '🔬', '🧪', '⚛️', '💫', '🌟', '🔭', '🧬', '🌌', '🚀'],
    sounds: ['science-success-1', 'science-success-2', 'science-success-3'],
    particles: {
      shapes: ['atom', 'molecule', 'dna-helix'],
      behaviors: ['orbit', 'chemical-reaction', 'explosion']
    }
  },
  logic: {
    colors: ['#8B5CF6', '#7C3AED', '#A78BFA', '#C4B5FD'],
    symbols: ['🧩', '💡', '⚙️', '🎯', '🔀', '📊', '🎲', '♟️', '🔌', '💻'],
    sounds: ['logic-success-1', 'logic-success-2', 'logic-success-3'],
    particles: {
      shapes: ['gear', 'circuit', 'puzzle-piece'],
      behaviors: ['connect', 'solve-sequence', 'light-up']
    }
  },
  geography: {
    colors: ['#F59E0B', '#D97706', '#FCD34D', '#FDE68A'],
    symbols: ['🌍', '🗺️', '🧭', '📍', '🏔️', '🌊', '🏝️', '🌋', '🗿', '🏛️'],
    sounds: ['geography-success-1', 'geography-success-2', 'geography-success-3'],
    particles: {
      shapes: ['globe', 'compass', 'map-pin'],
      behaviors: ['spin-globe', 'unfold-map', 'travel-path']
    }
  },
  arts: {
    colors: ['#EC4899', '#DB2777', '#F472B6', '#FBCFE8'],
    symbols: ['🎨', '🖌️', '🎭', '🎪', '🎵', '🎶', '🖼️', '✏️', '🌈', '💫'],
    sounds: ['arts-success-1', 'arts-success-2', 'arts-success-3'],
    particles: {
      shapes: ['paintbrush', 'palette', 'musical-note'],
      behaviors: ['paint-stroke', 'color-blend', 'dance']
    }
  }
};

// Celebration style implementations
class CosmicCelebration {
  execute(config: CelebrationConfig): void {
    const theme = SUBJECT_THEMES[config.subject];
    const intensity = this.getIntensityMultiplier(config.intensity);

    // Tier-based celebrations based on streak
    if (config.streakLevel >= 10) {
      this.legendaryStatus(theme, config);
    } else if (config.streakLevel >= 5) {
      this.supernova(theme, config);
    } else if (config.streakLevel >= 3) {
      this.ignition(theme, config);
    } else {
      this.spark(theme, config);
    }
  }

  private spark(theme: any, config: CelebrationConfig): void {
    const particleCount = config.ageGroup === '3-5' ? 50 :
                         config.ageGroup === '6-8' ? 35 : 20;

    confetti({
      particleCount,
      spread: 70,
      origin: { y: 0.6 },
      colors: theme.colors,
      shapes: ['star', 'circle'],
      gravity: config.ageGroup === '3-5' ? 0.5 : 0.8,
      scalar: config.ageGroup === '3-5' ? 1.5 : 1
    });
  }

  private ignition(theme: any, config: CelebrationConfig): void {
    // Fire trail effects
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: theme.colors,
        shapes: ['circle'],
        gravity: 0.5
      });

      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: theme.colors,
        shapes: ['circle'],
        gravity: 0.5
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  private supernova(theme: any, config: CelebrationConfig): void {
    // Full-screen celebration with vortex effect
    const count = 300;
    const defaults = {
      origin: { y: 0.7 },
      colors: theme.colors
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        shapes: ['star', 'circle']
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // Add screen shake for 6-8 and 9+ age groups
    if (config.ageGroup !== '3-5' && !config.reducedMotion) {
      this.screenShake(300);
    }
  }

  private legendaryStatus(theme: any, config: CelebrationConfig): void {
    // Golden aura with epic celebration
    const duration = 5000;
    const animationEnd = Date.now() + duration;

    // Create golden border effect
    this.createGoldenAura();

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const frame = () => {
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
        colors: [...theme.colors, '#FFD700', '#FFC700', '#FFB700'],
        gravity: randomInRange(0.8, 1.2),
        scalar: randomInRange(0.8, 1.2),
        drift: randomInRange(-0.5, 0.5),
        shapes: ['star', 'circle', 'square']
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  private createGoldenAura(): void {
    const aura = document.createElement('div');
    aura.className = 'legendary-aura';
    aura.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9998;
      box-shadow: inset 0 0 200px rgba(255, 215, 0, 0.5);
      animation: pulse-glow 2s ease-in-out infinite;
    `;

    document.body.appendChild(aura);

    setTimeout(() => {
      aura.style.opacity = '0';
      aura.style.transition = 'opacity 1s ease-out';
      setTimeout(() => document.body.removeChild(aura), 1000);
    }, 4000);
  }

  private screenShake(duration: number): void {
    const body = document.body;
    body.style.animation = `shake ${duration}ms ease-in-out`;

    setTimeout(() => {
      body.style.animation = '';
    }, duration);
  }

  private getIntensityMultiplier(intensity: string): number {
    return intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1;
  }
}

class UniverseCelebration {
  private threeScene: THREE.Scene | null = null;
  private renderer: THREE.WebGLRenderer | null = null;

  execute(config: CelebrationConfig): void {
    const theme = SUBJECT_THEMES[config.subject];

    switch (config.subject) {
      case 'math':
        this.mathUniverse(theme, config);
        break;
      case 'english':
        this.englishUniverse(theme, config);
        break;
      case 'science':
        this.scienceUniverse(theme, config);
        break;
      case 'logic':
        this.logicUniverse(theme, config);
        break;
      case 'geography':
        this.geographyUniverse(theme, config);
        break;
      case 'arts':
        this.artsUniverse(theme, config);
        break;
    }
  }

  private mathUniverse(theme: any, config: CelebrationConfig): void {
    // Pythagorean theorem builds pyramids
    if (config.ageGroup === '3-5') {
      // Numbers become cute creatures
      this.createNumberCreatures(theme.colors);
    } else if (config.ageGroup === '6-8') {
      // Balanced math magic
      this.createMathMagic(theme.colors);
    } else {
      // Elegant equation transforms
      this.createEquationTransform(theme.colors);
    }

    // Fibonacci sequences create spirals
    this.createFibonacciSpiral(theme.colors);

    // Infinity symbols portal effect
    this.createInfinityPortal(theme.colors);
  }

  private englishUniverse(theme: any, config: CelebrationConfig): void {
    // Shakespeare's quill writes in air
    this.createAirWriting(theme.colors);

    if (config.ageGroup === '3-5') {
      // ABC blocks build castles
      this.createBlockCastle(theme.colors);
    } else if (config.ageGroup === '6-8') {
      // Story book opens magically
      this.createMagicalBook(theme.colors);
    } else {
      // Sophisticated typography effects
      this.createTypographyEffect(theme.colors);
    }

    // Alphabet soup letters dance
    this.createLetterDance(theme.colors);
  }

  private scienceUniverse(theme: any, config: CelebrationConfig): void {
    // Tesla coils create lightning
    this.createLightningEffect(theme.colors);

    if (config.ageGroup === '3-5') {
      // Friendly atoms bounce
      this.createBouncingAtoms(theme.colors);
    } else if (config.ageGroup === '6-8') {
      // Cool experiments bubble
      this.createBubblingExperiment(theme.colors);
    } else {
      // Quantum particles teleport
      this.createQuantumTeleport(theme.colors);
    }

    // Periodic table elements dance
    this.createElementDance(theme.colors);
  }

  private logicUniverse(theme: any, config: CelebrationConfig): void {
    // Rubik's cube solves itself spectacularly
    this.createCubeSolve(theme.colors);

    if (config.ageGroup === '3-5') {
      // Simple pattern completion
      this.createPatternComplete(theme.colors);
    } else if (config.ageGroup === '6-8') {
      // Puzzle pieces celebrate
      this.createPuzzleCelebration(theme.colors);
    } else {
      // Algorithm visualization flows
      this.createAlgorithmFlow(theme.colors);
    }

    // Gears mesh in satisfying ways
    this.createGearMesh(theme.colors);
  }

  private geographyUniverse(theme: any, config: CelebrationConfig): void {
    // Tectonic plates shift dramatically
    this.createTectonicShift(theme.colors);

    if (config.ageGroup === '3-5') {
      // Cartoon Earth smiles
      this.createSmilingEarth(theme.colors);
    } else if (config.ageGroup === '6-8') {
      // Adventure map reveals treasure
      this.createTreasureReveal(theme.colors);
    } else {
      // Satellite view zooms elegantly
      this.createSatelliteZoom(theme.colors);
    }

    // Weather patterns swirl beautifully
    this.createWeatherSwirl(theme.colors);
  }

  private artsUniverse(theme: any, config: CelebrationConfig): void {
    // Sculptures come to life
    this.createLivingSculpture(theme.colors);

    if (config.ageGroup === '3-5') {
      // Crayons draw rainbows
      this.createRainbowDrawing(theme.colors);
    } else if (config.ageGroup === '6-8') {
      // Art supplies dance
      this.createSupplyDance(theme.colors);
    } else {
      // Gallery spotlights achievement
      this.createGallerySpotlight(theme.colors);
    }

    // Canvas paints itself
    this.createSelfPainting(theme.colors);
  }

  // Implementation methods for each effect
  private createNumberCreatures(colors: string[]): void {
    const container = document.createElement('div');
    container.className = 'number-creatures';
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
    `;

    for (let i = 0; i < 5; i++) {
      const creature = document.createElement('div');
      creature.textContent = String(Math.floor(Math.random() * 10));
      creature.style.cssText = `
        position: absolute;
        font-size: 48px;
        font-weight: bold;
        color: ${colors[i % colors.length]};
        animation: bounce-around 2s ease-in-out;
        left: ${Math.random() * 80 + 10}%;
        top: ${Math.random() * 80 + 10}%;
      `;
      container.appendChild(creature);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 2500);
  }

  private createMathMagic(colors: string[]): void {
    // Create magical math transformation effect
    const symbols = ['+', '-', '×', '÷', '=', 'π', '∞'];
    const container = document.createElement('div');
    container.className = 'math-magic';
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    symbols.forEach((symbol, index) => {
      const element = document.createElement('div');
      element.textContent = symbol;
      element.style.cssText = `
        position: absolute;
        font-size: 36px;
        font-weight: bold;
        color: ${colors[index % colors.length]};
        animation: spiral-out 1.5s ease-out forwards;
        animation-delay: ${index * 0.1}s;
      `;
      container.appendChild(element);
    });

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 2000);
  }

  private createEquationTransform(colors: string[]): void {
    // Elegant equation morphing
    const equation = document.createElement('div');
    equation.className = 'equation-transform';
    equation.innerHTML = 'E = mc<sup>2</sup>';
    equation.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 48px;
      font-family: 'Times New Roman', serif;
      color: ${colors[0]};
      z-index: 9999;
      animation: equation-morph 2s ease-in-out;
    `;

    document.body.appendChild(equation);
    setTimeout(() => equation.remove(), 2500);
  }

  private createFibonacciSpiral(colors: string[]): void {
    // Create golden spiral effect
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9998;
      opacity: 0.7;
    `;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 3;
      ctx.beginPath();

      let a = 0;
      let b = 1;
      let centerX = canvas.width / 2;
      let centerY = canvas.height / 2;

      for (let i = 0; i < 8; i++) {
        const temp = a + b;
        a = b;
        b = temp;

        ctx.arc(centerX, centerY, b * 10, 0, Math.PI / 2);
        centerX += b * 10;
        centerY += b * 10;
      }

      ctx.stroke();
    }

    document.body.appendChild(canvas);
    canvas.style.animation = 'fade-out 3s ease-out forwards';
    setTimeout(() => canvas.remove(), 3000);
  }

  private createInfinityPortal(colors: string[]): void {
    // Create infinity symbol portal
    const portal = document.createElement('div');
    portal.innerHTML = '∞';
    portal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 120px;
      color: ${colors[0]};
      z-index: 9999;
      animation: rotate-scale 2s ease-in-out;
      filter: drop-shadow(0 0 20px ${colors[1]});
    `;

    document.body.appendChild(portal);
    setTimeout(() => portal.remove(), 2500);
  }

  // Additional effect implementations...
  private createAirWriting(colors: string[]): void {
    const text = ['O', 'n', 'c', 'e', ' ', 'u', 'p', 'o', 'n', '...'];
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      font-family: cursive;
      font-size: 36px;
      color: ${colors[0]};
    `;

    text.forEach((char, i) => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.cssText = `
          opacity: 0;
          animation: write-in 0.5s ease-out forwards;
        `;
        container.appendChild(span);
      }, i * 100);
    });

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
  }

  private createBlockCastle(colors: string[]): void {
    // ABC blocks building animation
    const blocks = ['A', 'B', 'C', 'D', 'E'];
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      bottom: 20%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      gap: 10px;
    `;

    blocks.forEach((letter, i) => {
      const block = document.createElement('div');
      block.textContent = letter;
      block.style.cssText = `
        width: 60px;
        height: 60px;
        background: ${colors[i % colors.length]};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        border-radius: 8px;
        animation: block-build 0.5s ease-out forwards;
        animation-delay: ${i * 0.1}s;
        opacity: 0;
      `;
      container.appendChild(block);
    });

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
  }

  private createMagicalBook(colors: string[]): void {
    // Story book opening effect
    const book = document.createElement('div');
    book.innerHTML = '📖';
    book.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 80px;
      z-index: 9999;
      animation: book-open 2s ease-in-out;
    `;

    document.body.appendChild(book);

    // Add sparkles around book
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.innerHTML = '✨';
      sparkle.style.cssText = `
        position: fixed;
        font-size: 24px;
        z-index: 9998;
        animation: sparkle-float 2s ease-out forwards;
        top: calc(50% + ${(Math.random() - 0.5) * 200}px);
        left: calc(50% + ${(Math.random() - 0.5) * 200}px);
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 2000);
    }

    setTimeout(() => book.remove(), 2500);
  }

  private createTypographyEffect(colors: string[]): void {
    // Sophisticated text transformation
    const words = ['READ', 'WRITE', 'LEARN', 'GROW'];
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: 'Georgia', serif;
    `;

    words.forEach((word, i) => {
      const element = document.createElement('div');
      element.textContent = word;
      element.style.cssText = `
        position: absolute;
        font-size: 48px;
        font-weight: 300;
        letter-spacing: 8px;
        color: ${colors[i % colors.length]};
        opacity: 0;
        animation: text-wave 1.5s ease-out forwards;
        animation-delay: ${i * 0.2}s;
      `;
      container.appendChild(element);
    });

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
  }

  private createLetterDance(colors: string[]): void {
    // Dancing alphabet letters
    const letters = 'ABCDEFGHIJKLMNOP'.split('');
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
    `;

    letters.forEach((letter, i) => {
      const element = document.createElement('div');
      element.textContent = letter;
      element.style.cssText = `
        position: absolute;
        font-size: 32px;
        font-weight: bold;
        color: ${colors[i % colors.length]};
        left: ${Math.random() * 90 + 5}%;
        top: ${Math.random() * 90 + 5}%;
        animation: letter-dance 2s ease-in-out infinite;
        animation-delay: ${i * 0.1}s;
      `;
      container.appendChild(element);
    });

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
  }

  // Science Universe effects
  private createLightningEffect(colors: string[]): void {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
    `;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const drawLightning = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        const segments = 8;
        for (let i = 1; i < segments; i++) {
          const progress = i / segments;
          const x = x1 + (x2 - x1) * progress + (Math.random() - 0.5) * 50;
          const y = y1 + (y2 - y1) * progress;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(x2, y2);
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 3;
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = colors[1];
        ctx.shadowBlur = 20;
        ctx.stroke();
      };

      drawLightning(canvas.width / 2, 0, canvas.width / 2, canvas.height);
      drawLightning(canvas.width / 3, 0, canvas.width / 3, canvas.height);
      drawLightning(2 * canvas.width / 3, 0, 2 * canvas.width / 3, canvas.height);
    }

    document.body.appendChild(canvas);
    canvas.style.animation = 'flash 0.5s ease-out 3';
    setTimeout(() => canvas.remove(), 1500);
  }

  private createBouncingAtoms(colors: string[]): void {
    const atoms = ['⚛️', '🔴', '🔵', '🟢', '🟡'];
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
    `;

    atoms.forEach((atom, i) => {
      const element = document.createElement('div');
      element.textContent = atom;
      element.style.cssText = `
        position: absolute;
        font-size: 40px;
        left: ${Math.random() * 80 + 10}%;
        bottom: 0;
        animation: bounce-high 2s ease-out forwards;
        animation-delay: ${i * 0.1}s;
      `;
      container.appendChild(element);
    });

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
  }

  private createBubblingExperiment(colors: string[]): void {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
    `;

    // Create beaker
    const beaker = document.createElement('div');
    beaker.innerHTML = '🧪';
    beaker.style.cssText = `
      font-size: 100px;
      animation: shake-beaker 2s ease-in-out;
    `;
    container.appendChild(beaker);

    // Create bubbles
    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement('div');
      bubble.style.cssText = `
        position: absolute;
        width: ${Math.random() * 20 + 10}px;
        height: ${Math.random() * 20 + 10}px;
        background: ${colors[i % colors.length]};
        border-radius: 50%;
        bottom: 50px;
        left: calc(50% + ${(Math.random() - 0.5) * 40}px);
        animation: bubble-up ${1 + Math.random()}s ease-out forwards;
        animation-delay: ${i * 0.1}s;
        opacity: 0.8;
      `;
      container.appendChild(bubble);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
  }

  private createQuantumTeleport(colors: string[]): void {
    const particles = ['⚛️', '💫', '✨'];
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
    `;

    particles.forEach((particle, i) => {
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      const endX = Math.random() * window.innerWidth;
      const endY = Math.random() * window.innerHeight;

      const element = document.createElement('div');
      element.textContent = particle;
      element.style.cssText = `
        position: absolute;
        font-size: 32px;
        left: ${startX}px;
        top: ${startY}px;
        animation: quantum-jump 1s ease-in-out forwards;
        --end-x: ${endX}px;
        --end-y: ${endY}px;
      `;
      container.appendChild(element);
    });

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 2000);
  }

  private createElementDance(colors: string[]): void {
    const elements = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O'];
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      z-index: 9999;
    `;

    elements.forEach((element, i) => {
      const box = document.createElement('div');
      box.textContent = element;
      box.style.cssText = `
        width: 60px;
        height: 60px;
        background: ${colors[i % colors.length]};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        border-radius: 4px;
        animation: element-pop 0.5s ease-out forwards;
        animation-delay: ${i * 0.1}s;
        opacity: 0;
      `;
      container.appendChild(box);
    });

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3000);
  }

  // Additional implementations for other subjects...
  private createCubeSolve(colors: string[]): void {
    // Implementation for Rubik's cube solving animation
  }

  private createPatternComplete(colors: string[]): void {
    // Implementation for pattern completion
  }

  private createPuzzleCelebration(colors: string[]): void {
    // Implementation for puzzle piece celebration
  }

  private createAlgorithmFlow(colors: string[]): void {
    // Implementation for algorithm visualization
  }

  private createGearMesh(colors: string[]): void {
    // Implementation for gear meshing animation
  }

  private createTectonicShift(colors: string[]): void {
    // Implementation for tectonic plate animation
  }

  private createSmilingEarth(colors: string[]): void {
    // Implementation for cartoon Earth
  }

  private createTreasureReveal(colors: string[]): void {
    // Implementation for treasure map reveal
  }

  private createSatelliteZoom(colors: string[]): void {
    // Implementation for satellite zoom effect
  }

  private createWeatherSwirl(colors: string[]): void {
    // Implementation for weather pattern animation
  }

  private createLivingSculpture(colors: string[]): void {
    // Implementation for sculpture coming to life
  }

  private createRainbowDrawing(colors: string[]): void {
    // Implementation for crayon rainbow effect
  }

  private createSupplyDance(colors: string[]): void {
    // Implementation for art supplies dancing
  }

  private createGallerySpotlight(colors: string[]): void {
    // Implementation for gallery spotlight effect
  }

  private createSelfPainting(colors: string[]): void {
    // Implementation for canvas self-painting effect
  }
}

class CompanionCelebration {
  private companions: Map<string, CompanionState> = new Map();

  execute(config: CelebrationConfig): void {
    const companion = this.getOrCreateCompanion(config.subject);
    companion.celebrate(config);
  }

  private getOrCreateCompanion(subject: Subject): CompanionState {
    if (!this.companions.has(subject)) {
      this.companions.set(subject, new CompanionState(subject));
    }
    return this.companions.get(subject)!;
  }
}

class CompanionState {
  private level: number = 1;
  private experience: number = 0;
  private subject: Subject;

  constructor(subject: Subject) {
    this.subject = subject;
    this.loadState();
  }

  celebrate(config: CelebrationConfig): void {
    this.gainExperience(10 * config.streakLevel);
    this.performCelebration(config);
  }

  private performCelebration(config: CelebrationConfig): void {
    const companion = this.createCompanionElement();

    switch (this.level) {
      case 1:
        this.babyJump(companion);
        break;
      case 2:
        this.childBackflip(companion);
        break;
      case 3:
        this.teenMagic(companion);
        break;
      case 4:
        this.adultTransform(companion);
        break;
      case 5:
        this.masterReality(companion);
        break;
    }
  }

  private createCompanionElement(): HTMLElement {
    const companion = document.createElement('div');
    companion.className = 'companion-celebration';
    companion.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 100px;
      font-size: 80px;
      z-index: 10000;
    `;

    // Subject-specific companion emoji
    const companions = {
      math: '🔢',
      english: '📖',
      science: '🔬',
      logic: '🧩',
      geography: '🌍',
      arts: '🎨'
    };

    companion.textContent = companions[this.subject];
    document.body.appendChild(companion);

    return companion;
  }

  private babyJump(element: HTMLElement): void {
    element.style.animation = 'companion-jump 0.5s ease-out 3';
    setTimeout(() => element.remove(), 2000);
  }

  private childBackflip(element: HTMLElement): void {
    element.style.animation = 'companion-backflip 1s ease-in-out';

    // Add confetti throw
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: 0.85, y: 0.7 }
      });
    }, 500);

    setTimeout(() => element.remove(), 2500);
  }

  private teenMagic(element: HTMLElement): void {
    element.style.animation = 'companion-magic 2s ease-in-out';

    // Add magic spell effects
    const spell = document.createElement('div');
    spell.innerHTML = '✨💫✨';
    spell.style.cssText = `
      position: fixed;
      bottom: 180px;
      right: 80px;
      font-size: 40px;
      animation: spell-cast 1.5s ease-out;
      z-index: 9999;
    `;
    document.body.appendChild(spell);

    setTimeout(() => {
      spell.remove();
      element.remove();
    }, 2000);
  }

  private adultTransform(element: HTMLElement): void {
    element.style.animation = 'companion-transform 3s ease-in-out';
    element.style.filter = 'hue-rotate(360deg)';

    setTimeout(() => element.remove(), 3500);
  }

  private masterReality(element: HTMLElement): void {
    // Reality-bending celebration
    document.body.style.animation = 'reality-warp 2s ease-in-out';
    element.style.animation = 'companion-ascend 3s ease-out';

    setTimeout(() => {
      document.body.style.animation = '';
      element.remove();
    }, 3000);
  }

  private gainExperience(amount: number): void {
    this.experience += amount;
    const nextLevel = this.level * 100;

    if (this.experience >= nextLevel && this.level < 5) {
      this.level++;
      this.experience = 0;
      this.showLevelUp();
    }

    this.saveState();
  }

  private showLevelUp(): void {
    const notification = document.createElement('div');
    notification.textContent = `Companion Level ${this.level}!`;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 40px;
      border-radius: 16px;
      font-size: 24px;
      font-weight: bold;
      z-index: 10001;
      animation: level-up-notification 2s ease-out;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  private loadState(): void {
    const saved = localStorage.getItem(`companion-${this.subject}`);
    if (saved) {
      const data = JSON.parse(saved);
      this.level = data.level;
      this.experience = data.experience;
    }
  }

  private saveState(): void {
    localStorage.setItem(`companion-${this.subject}`, JSON.stringify({
      level: this.level,
      experience: this.experience
    }));
  }
}

// Main Advanced Celebration Service
export class AdvancedCelebrationService {
  private static instance: AdvancedCelebrationService;
  private cosmicCelebration: CosmicCelebration;
  private universeCelebration: UniverseCelebration;
  private companionCelebration: CompanionCelebration;
  private audioService: Map<string, Howl> = new Map();
  private streakCounter: number = 0;
  private currentStyle: CelebrationStyle = 'cosmic';

  private constructor() {
    this.cosmicCelebration = new CosmicCelebration();
    this.universeCelebration = new UniverseCelebration();
    this.companionCelebration = new CompanionCelebration();
    this.initializeAudio();
    this.addGlobalStyles();
  }

  public static getInstance(): AdvancedCelebrationService {
    if (!AdvancedCelebrationService.instance) {
      AdvancedCelebrationService.instance = new AdvancedCelebrationService();
    }
    return AdvancedCelebrationService.instance;
  }

  public celebrate(config: CelebrationConfig): void {
    // Use the selected celebration style
    const style = config.style || this.currentStyle;

    switch (style) {
      case 'cosmic':
        this.cosmicCelebration.execute(config);
        break;
      case 'universe':
        this.universeCelebration.execute(config);
        break;
      case 'companion':
        this.companionCelebration.execute(config);
        break;
    }

    // Play appropriate sound
    if (config.soundEnabled) {
      this.playSound(config.subject, config.streakLevel);
    }

    // Trigger haptic feedback
    if (config.hapticEnabled) {
      this.triggerHaptic(config.intensity);
    }
  }

  public setCelebrationStyle(style: CelebrationStyle): void {
    this.currentStyle = style;
  }

  public incrementStreak(): number {
    return ++this.streakCounter;
  }

  public resetStreak(): void {
    this.streakCounter = 0;
  }

  private playSound(subject: Subject, streakLevel: number): void {
    const theme = SUBJECT_THEMES[subject];
    const soundIndex = Math.min(Math.floor(streakLevel / 3), theme.sounds.length - 1);
    const soundId = theme.sounds[soundIndex];

    // Play sound if loaded
    if (this.audioService.has(soundId)) {
      this.audioService.get(soundId)!.play();
    }
  }

  private triggerHaptic(intensity: string): void {
    if ('vibrate' in navigator) {
      const pattern = intensity === 'low' ? [50] :
                     intensity === 'high' ? [100, 50, 100] :
                     [75];
      navigator.vibrate(pattern);
    }
  }

  private initializeAudio(): void {
    // Initialize audio files for each subject
    // In production, these would be actual audio files
    Object.values(SUBJECT_THEMES).forEach(theme => {
      theme.sounds.forEach(soundId => {
        // Placeholder for actual audio loading
        // this.audioService.set(soundId, new Howl({ src: [`/sounds/${soundId}.mp3`] }));
      });
    });
  }

  private addGlobalStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }

      @keyframes pulse-glow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }

      @keyframes bounce-around {
        0% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-100px) rotate(180deg); }
        100% { transform: translateY(0) rotate(360deg); }
      }

      @keyframes spiral-out {
        0% { transform: translate(0, 0) rotate(0) scale(0); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translate(var(--spiral-x, 200px), var(--spiral-y, -200px)) rotate(720deg) scale(1.5); opacity: 0; }
      }

      @keyframes equation-morph {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2) rotate(180deg); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 1; }
      }

      @keyframes fade-out {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }

      @keyframes rotate-scale {
        0% { transform: translate(-50%, -50%) rotate(0) scale(1); }
        50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.5); }
        100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
      }

      @keyframes write-in {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      @keyframes block-build {
        0% { transform: translateY(-200px) rotate(0); opacity: 0; }
        50% { transform: translateY(0) rotate(360deg); opacity: 1; }
        75% { transform: translateY(-20px); }
        100% { transform: translateY(0); }
      }

      @keyframes book-open {
        0% { transform: translate(-50%, -50%) rotateY(0); }
        50% { transform: translate(-50%, -50%) rotateY(90deg); }
        100% { transform: translate(-50%, -50%) rotateY(0); }
      }

      @keyframes sparkle-float {
        0% { transform: scale(0) rotate(0); opacity: 0; }
        50% { transform: scale(1) rotate(180deg); opacity: 1; }
        100% { transform: scale(0.5) rotate(360deg) translateY(-50px); opacity: 0; }
      }

      @keyframes text-wave {
        0% { transform: translateY(50px) scale(0.8); opacity: 0; }
        50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
        100% { transform: translateY(0) scale(1); opacity: 0.8; }
      }

      @keyframes letter-dance {
        0%, 100% { transform: translateY(0) rotate(0); }
        25% { transform: translateY(-20px) rotate(-10deg); }
        75% { transform: translateY(20px) rotate(10deg); }
      }

      @keyframes flash {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }

      @keyframes bounce-high {
        0% { transform: translateY(0); }
        50% { transform: translateY(-300px); }
        100% { transform: translateY(0); opacity: 0; }
      }

      @keyframes shake-beaker {
        0%, 100% { transform: translateX(0) rotate(0); }
        25% { transform: translateX(-10px) rotate(-5deg); }
        75% { transform: translateX(10px) rotate(5deg); }
      }

      @keyframes bubble-up {
        0% { transform: translateY(0) scale(0); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
      }

      @keyframes quantum-jump {
        0% { opacity: 1; }
        49% { opacity: 1; transform: scale(1); }
        50% { opacity: 0; transform: scale(0); }
        51% { opacity: 0; transform: scale(0); left: var(--end-x); top: var(--end-y); }
        100% { opacity: 1; transform: scale(1); left: var(--end-x); top: var(--end-y); }
      }

      @keyframes element-pop {
        0% { transform: scale(0) rotate(0); opacity: 0; }
        50% { transform: scale(1.2) rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); opacity: 1; }
      }

      @keyframes companion-jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-50px); }
      }

      @keyframes companion-backflip {
        0% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-100px) rotate(-180deg); }
        100% { transform: translateY(0) rotate(-360deg); }
      }

      @keyframes companion-magic {
        0% { transform: scale(1) rotate(0); filter: hue-rotate(0); }
        50% { transform: scale(1.5) rotate(180deg); filter: hue-rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); filter: hue-rotate(360deg); }
      }

      @keyframes companion-transform {
        0% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(2); filter: brightness(2); }
        100% { transform: scale(1); filter: brightness(1); }
      }

      @keyframes companion-ascend {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-300px) scale(2); opacity: 0; }
      }

      @keyframes reality-warp {
        0%, 100% { filter: hue-rotate(0) blur(0); }
        50% { filter: hue-rotate(180deg) blur(2px); }
      }

      @keyframes spell-cast {
        0% { transform: scale(0) rotate(0); opacity: 0; }
        50% { transform: scale(1.5) rotate(360deg); opacity: 1; }
        100% { transform: scale(1) rotate(720deg) translateY(-50px); opacity: 0; }
      }

      @keyframes level-up-notification {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Export singleton instance
export const advancedCelebrationService = AdvancedCelebrationService.getInstance();