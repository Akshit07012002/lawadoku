import { useState, useEffect, useCallback } from 'react';
import { SoundName, SoundContextType } from '../types';
import { STORAGE_KEYS } from '../constants';
import { storage } from '../utils';

export const useSound = (): SoundContextType => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    return storage.get(STORAGE_KEYS.SOUND_ENABLED, true);
  });

  useEffect(() => {
    storage.set(STORAGE_KEYS.SOUND_ENABLED, isEnabled);
  }, [isEnabled]);

  const playSound = useCallback((name: SoundName): void => {
    if (!isEnabled) return;

    try {
      // Create audio context for sound generation
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Generate different tones based on sound type
      const frequencies = {
        click: 800,
        success: 1000,
        error: 400,
        win: 1200,
      };

      const frequency = frequencies[name];
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      // Set volume and duration based on sound type
      const volumes = {
        click: 0.1,
        success: 0.2,
        error: 0.3,
        win: 0.4,
      };

      const durations = {
        click: 0.1,
        success: 0.3,
        error: 0.2,
        win: 0.5,
      };

      gainNode.gain.setValueAtTime(volumes[name], audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + durations[name]);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + durations[name]);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  }, [isEnabled]);

  const toggleSound = useCallback((): void => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    playSound,
    isEnabled,
    toggleSound,
  };
};
