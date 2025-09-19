import { useCallback, useRef, useEffect } from 'react';
import { Howl } from 'howler';

// Sound effect types
export type SoundType =
  | 'click'
  | 'success'
  | 'error'
  | 'coin'
  | 'levelUp'
  | 'pop'
  | 'whoosh'
  | 'ding'
  | 'unlock'
  | 'victory'
  | 'achievement'
  | 'milestone'
  | 'notification'
  | 'pause'
  | 'complete'
  | 'logout'
  | 'select'
  | 'hint'
  | 'warning';

// Sound library configuration
const soundLibrary: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  coin: '/sounds/coin.mp3',
  levelUp: '/sounds/level-up.mp3',
  pop: '/sounds/pop.mp3',
  whoosh: '/sounds/whoosh.mp3',
  ding: '/sounds/ding.mp3',
  unlock: '/sounds/unlock.mp3',
  victory: '/sounds/victory.mp3',
  achievement: '/sounds/achievement.mp3',
  milestone: '/sounds/milestone.mp3',
  notification: '/sounds/notification.mp3',
  pause: '/sounds/pause.mp3',
  complete: '/sounds/complete.mp3',
  logout: '/sounds/logout.mp3',
  select: '/sounds/select.mp3',
  hint: '/sounds/hint.mp3',
  warning: '/sounds/warning.mp3',
};

// Cache for loaded sounds
const soundCache = new Map<SoundType, Howl>();

// Initialize sounds in cache
const initializeSound = (type: SoundType) => {
  if (!soundCache.has(type)) {
    const sound = new Howl({
      src: [soundLibrary[type]],
      volume: 0.5,
      preload: true,
    });
    soundCache.set(type, sound);
  }
  return soundCache.get(type)!;
};

export const useSound = () => {
  const volumeRef = useRef(0.5);
  const enabledRef = useRef(true);

  // Play sound effect
  const playSound = useCallback((type: SoundType, volume?: number) => {
    if (!enabledRef.current) return;

    try {
      const sound = initializeSound(type);
      if (volume !== undefined) {
        sound.volume(volume);
      } else {
        sound.volume(volumeRef.current);
      }
      sound.play();
    } catch (error) {
      console.error(`Failed to play sound: ${type}`, error);
    }
  }, []);

  // Play sound with options
  const playSoundWithOptions = useCallback((
    type: SoundType,
    options: {
      volume?: number;
      loop?: boolean;
      rate?: number;
      onEnd?: () => void;
    }
  ) => {
    if (!enabledRef.current) return null;

    try {
      const sound = initializeSound(type);
      
      if (options.volume !== undefined) {
        sound.volume(options.volume);
      }
      if (options.loop !== undefined) {
        sound.loop(options.loop);
      }
      if (options.rate !== undefined) {
        sound.rate(options.rate);
      }
      if (options.onEnd) {
        sound.once('end', options.onEnd);
      }

      const id = sound.play();
      return {
        stop: () => sound.stop(id),
        pause: () => sound.pause(id),
        resume: () => sound.play(id),
        fade: (from: number, to: number, duration: number) => 
          sound.fade(from, to, duration, id),
      };
    } catch (error) {
      console.error(`Failed to play sound with options: ${type}`, error);
      return null;
    }
  }, []);

  // Set global volume
  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume));
    soundCache.forEach(sound => sound.volume(volumeRef.current));
  }, []);

  // Toggle sound on/off
  const toggleSound = useCallback((enabled?: boolean) => {
    if (enabled === undefined) {
      enabledRef.current = !enabledRef.current;
    } else {
      enabledRef.current = enabled;
    }
    
    if (!enabledRef.current) {
      // Stop all playing sounds when disabled
      soundCache.forEach(sound => sound.stop());
    }
    
    return enabledRef.current;
  }, []);

  // Preload sounds
  const preloadSounds = useCallback((types: SoundType[]) => {
    types.forEach(type => initializeSound(type));
  }, []);

  // Stop all sounds
  const stopAll = useCallback(() => {
    soundCache.forEach(sound => sound.stop());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't unload sounds as they might be used elsewhere
      // Just stop any playing sounds from this component
      soundCache.forEach(sound => sound.stop());
    };
  }, []);

  return {
    playSound,
    playSoundWithOptions,
    setVolume,
    toggleSound,
    preloadSounds,
    stopAll,
  };
};

// Singleton hook for background music
let backgroundMusic: Howl | null = null;
let musicVolume = 0.3;

export const useBackgroundMusic = () => {
  const play = useCallback((src: string, options?: { 
    volume?: number; 
    fadeIn?: number;
    loop?: boolean;
  }) => {
    // Stop current music if playing
    if (backgroundMusic) {
      backgroundMusic.stop();
    }

    backgroundMusic = new Howl({
      src: [src],
      loop: options?.loop !== false, // Default to true
      volume: options?.fadeIn ? 0 : (options?.volume ?? musicVolume),
    });

    backgroundMusic.play();

    if (options?.fadeIn) {
      backgroundMusic.fade(0, options.volume ?? musicVolume, options.fadeIn);
    }
  }, []);

  const stop = useCallback((fadeOut?: number) => {
    if (!backgroundMusic) return;

    if (fadeOut) {
      backgroundMusic.fade(backgroundMusic.volume(), 0, fadeOut);
      setTimeout(() => {
        backgroundMusic?.stop();
        backgroundMusic = null;
      }, fadeOut);
    } else {
      backgroundMusic.stop();
      backgroundMusic = null;
    }
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    musicVolume = Math.max(0, Math.min(1, volume));
    if (backgroundMusic) {
      backgroundMusic.volume(musicVolume);
    }
  }, []);

  const pause = useCallback(() => {
    backgroundMusic?.pause();
  }, []);

  const resume = useCallback(() => {
    backgroundMusic?.play();
  }, []);

  return {
    play,
    stop,
    pause,
    resume,
    setVolume: setMusicVolume,
  };
};

// Export default hook
export default useSound;