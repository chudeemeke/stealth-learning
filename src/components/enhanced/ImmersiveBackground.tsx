import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ImmersiveBackgroundProps {
  subject: 'math' | 'english' | 'science' | 'general';
  intensity?: 'subtle' | 'medium' | 'dynamic';
  children?: React.ReactNode;
  className?: string;
}

const BACKGROUND_CONFIGS = {
  math: {
    primary: 'from-blue-900 via-blue-700 to-purple-900',
    secondary: 'from-blue-600/20 to-purple-600/20',
    accent: '#3B82F6',
    pattern: 'mathematical',
    symbols: ['∞', '∑', '∫', '√', '≈', '∆', 'π', '°', '±', '÷', '×', '+'],
    gradientOverlay: 'bg-gradient-to-br from-blue-900/80 via-purple-900/60 to-indigo-900/80'
  },
  english: {
    primary: 'from-red-900 via-orange-800 to-yellow-900',
    secondary: 'from-red-600/20 to-orange-600/20',
    accent: '#EF4444',
    pattern: 'literary',
    symbols: ['✒️', '📜', '📖', '✍️', '💭', '""', '&', '@', '!', '?', ':', ';'],
    gradientOverlay: 'bg-gradient-to-br from-red-900/80 via-orange-900/60 to-yellow-900/80'
  },
  science: {
    primary: 'from-green-900 via-teal-800 to-cyan-900',
    secondary: 'from-green-600/20 to-teal-600/20',
    accent: '#10B981',
    pattern: 'scientific',
    symbols: ['⚛️', '🧬', '⚗️', '🔬', '💫', '🌟', '⚡', '🧪', '🌍', '🔬', '🧲', '💊'],
    gradientOverlay: 'bg-gradient-to-br from-green-900/80 via-teal-900/60 to-cyan-900/80'
  },
  general: {
    primary: 'from-purple-900 via-pink-800 to-indigo-900',
    secondary: 'from-purple-600/20 to-pink-600/20',
    accent: '#8B5CF6',
    pattern: 'cosmic',
    symbols: ['✨', '⭐', '💫', '🌟', '💎', '🎨', '🎭', '🎪', '🎡', '🎢', '🎠', '🎨'],
    gradientOverlay: 'bg-gradient-to-br from-purple-900/80 via-pink-900/60 to-indigo-900/80'
  }
};

export const ImmersiveBackground: React.FC<ImmersiveBackgroundProps> = ({
  subject,
  intensity = 'medium',
  children,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = BACKGROUND_CONFIGS[subject];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Floating symbols animation
    const symbols: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      symbol: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const symbolCount = intensity === 'subtle' ? 8 : intensity === 'medium' ? 15 : 25;

    // Initialize symbols
    for (let i = 0; i < symbolCount; i++) {
      symbols.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (intensity === 'dynamic' ? 0.8 : 0.3),
        vy: (Math.random() - 0.5) * (intensity === 'dynamic' ? 0.8 : 0.3),
        size: Math.random() * (intensity === 'dynamic' ? 40 : 24) + 16,
        opacity: Math.random() * 0.3 + 0.1,
        symbol: config.symbols[Math.floor(Math.random() * config.symbols.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      symbols.forEach(symbol => {
        // Update position
        symbol.x += symbol.vx;
        symbol.y += symbol.vy;
        symbol.rotation += symbol.rotationSpeed;

        // Wrap around edges
        if (symbol.x < -50) symbol.x = canvas.width + 50;
        if (symbol.x > canvas.width + 50) symbol.x = -50;
        if (symbol.y < -50) symbol.y = canvas.height + 50;
        if (symbol.y > canvas.height + 50) symbol.y = -50;

        // Draw symbol
        ctx.save();
        ctx.translate(symbol.x, symbol.y);
        ctx.rotate((symbol.rotation * Math.PI) / 180);
        ctx.font = `${symbol.size}px Arial`;
        ctx.fillStyle = `${config.accent}${Math.floor(symbol.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add subtle glow effect
        ctx.shadowColor = config.accent;
        ctx.shadowBlur = intensity === 'dynamic' ? 20 : 10;

        ctx.fillText(symbol.symbol, 0, 0);
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [subject, intensity, config]);

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.primary}`} />

      {/* Animated canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Overlay gradient for depth */}
      <div className={`absolute inset-0 ${config.gradientOverlay}`} style={{ zIndex: 2 }} />

      {/* Animated mesh gradient overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${config.secondary} opacity-50`}
        style={{ zIndex: 3 }}
        animate={{
          background: [
            `linear-gradient(45deg, ${config.accent}20, transparent, ${config.accent}10)`,
            `linear-gradient(135deg, transparent, ${config.accent}15, transparent)`,
            `linear-gradient(225deg, ${config.accent}10, transparent, ${config.accent}20)`,
            `linear-gradient(315deg, transparent, ${config.accent}15, transparent)`
          ]
        }}
        transition={{
          duration: intensity === 'dynamic' ? 8 : 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Floating orbs for extra depth */}
      {intensity !== 'subtle' && (
        <div className="absolute inset-0" style={{ zIndex: 4 }}>
          {[...Array(intensity === 'dynamic' ? 6 : 3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-xl opacity-20"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                backgroundColor: config.accent,
                left: `${20 + i * 25}%`,
                top: `${30 + i * 20}%`
              }}
              animate={{
                x: [0, 100, -50, 0],
                y: [0, -80, 50, 0],
                scale: [1, 1.2, 0.8, 1],
                opacity: [0.1, 0.3, 0.1, 0.2]
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
          zIndex: 5
        }}
      />
    </div>
  );
};

export default ImmersiveBackground;