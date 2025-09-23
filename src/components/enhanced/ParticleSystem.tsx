import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  symbol: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  subject: 'math' | 'english' | 'science' | 'general';
  intensity?: 'low' | 'medium' | 'high';
  trigger?: boolean;
  celebration?: boolean;
  className?: string;
}

const PARTICLE_CONFIGS = {
  math: {
    symbols: ['✨', '⭐', '+', '×', '=', '∞', '💎', '🔢'],
    colors: ['#3B82F6', '#1D4ED8', '#60A5FA', '#93C5FD'],
    theme: 'mathematical'
  },
  english: {
    symbols: ['📚', '✨', 'A', 'B', 'C', '🔤', '📝', '💭'],
    colors: ['#EF4444', '#DC2626', '#F87171', '#FCA5A5'],
    theme: 'literary'
  },
  science: {
    symbols: ['⚗️', '🔬', '🧪', '⚛️', '💫', '🌟', '✨', '🔬'],
    colors: ['#10B981', '#059669', '#34D399', '#6EE7B7'],
    theme: 'scientific'
  },
  general: {
    symbols: ['✨', '⭐', '💫', '🌟', '💎', '🎉', '✨'],
    colors: ['#8B5CF6', '#7C3AED', '#A78BFA', '#C4B5FD'],
    theme: 'celebration'
  }
};

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  subject,
  intensity = 'medium',
  trigger = false,
  celebration = false,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const config = PARTICLE_CONFIGS[subject];

  const getParticleCount = () => {
    const baseCount = { low: 15, medium: 30, high: 50 };
    return celebration ? baseCount[intensity] * 2 : baseCount[intensity];
  };

  const createParticle = (x?: number, y?: number): Particle => {
    const container = containerRef.current;
    if (!container) {
      return {
        id: Math.random().toString(36),
        x: 0, y: 0, vx: 0, vy: 0, size: 0, color: '',
        opacity: 0, symbol: '', rotation: 0, rotationSpeed: 0,
        life: 0, maxLife: 0
      };
    }

    const rect = container.getBoundingClientRect();
    const symbols = config.symbols;
    const colors = config.colors;

    return {
      id: Math.random().toString(36),
      x: x ?? Math.random() * rect.width,
      y: y ?? rect.height + 20,
      vx: (Math.random() - 0.5) * (celebration ? 8 : 3),
      vy: celebration ? -Math.random() * 15 - 5 : -Math.random() * 3 - 1,
      size: Math.random() * (celebration ? 24 : 16) + (celebration ? 16 : 8),
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.7 + 0.3,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * (celebration ? 8 : 4),
      life: 0,
      maxLife: celebration ? 180 : 120 + Math.random() * 60
    };
  };

  const updateParticles = () => {
    setParticles(prevParticles => {
      return prevParticles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + (celebration ? 0.2 : 0.1), // gravity
          rotation: particle.rotation + particle.rotationSpeed,
          life: particle.life + 1,
          opacity: Math.max(0, particle.opacity - (celebration ? 0.004 : 0.008))
        }))
        .filter(particle =>
          particle.life < particle.maxLife &&
          particle.opacity > 0 &&
          particle.y < (containerRef.current?.clientHeight || 1000) + 100
        );
    });
  };

  useEffect(() => {
    const animate = () => {
      updateParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (trigger || celebration) {
      const particleCount = getParticleCount();
      const newParticles: Particle[] = [];

      if (celebration) {
        // Celebration burst from multiple points
        const burstPoints = 5;
        for (let i = 0; i < burstPoints; i++) {
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            const x = (rect.width / (burstPoints + 1)) * (i + 1);
            const y = rect.height * 0.7;

            for (let j = 0; j < particleCount / burstPoints; j++) {
              newParticles.push(createParticle(x, y));
            }
          }
        }
      } else {
        // Regular particle generation
        for (let i = 0; i < particleCount; i++) {
          newParticles.push(createParticle());
        }
      }

      setParticles(prev => [...prev, ...newParticles]);
    }
  }, [trigger, celebration, intensity]);

  // Continuous particle generation for ambient effect
  useEffect(() => {
    if (!celebration) {
      const interval = setInterval(() => {
        if (particles.length < getParticleCount()) {
          setParticles(prev => [...prev, createParticle()]);
        }
      }, intensity === 'high' ? 200 : intensity === 'medium' ? 400 : 800);

      return () => clearInterval(interval);
    }
  }, [particles.length, intensity, celebration]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute select-none"
          style={{
            left: particle.x,
            top: particle.y,
            fontSize: particle.size,
            color: particle.color,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            textShadow: `0 0 ${particle.size * 0.3}px ${particle.color}40`,
            filter: celebration ? 'brightness(1.3) saturate(1.2)' : 'none'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          {particle.symbol}
        </motion.div>
      ))}
    </div>
  );
};

export default ParticleSystem;