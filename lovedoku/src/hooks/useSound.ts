import { useState, useEffect, useCallback } from 'react'

interface SoundOptions {
  volume?: number
  loop?: boolean
}

export const useSound = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled')
    return saved ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(isEnabled))
  }, [isEnabled])

  const playSound = useCallback((soundName: string, options: SoundOptions = {}) => {
    if (!isEnabled) return

    try {
      // Create audio context for web audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Generate different sounds based on name
      let frequency = 440
      let duration = 0.1
      
      switch (soundName) {
        case 'click':
          frequency = 800
          duration = 0.1
          break
        case 'success':
          frequency = 600
          duration = 0.3
          break
        case 'error':
          frequency = 200
          duration = 0.2
          break
        case 'win':
          frequency = 880
          duration = 0.5
          break
        case 'move':
          frequency = 500
          duration = 0.05
          break
        case 'complete':
          frequency = 660
          duration = 0.4
          break
        default:
          frequency = 440
          duration = 0.1
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime((options.volume || 0.3) * 0.1, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }, [isEnabled])

  const toggleSound = useCallback(() => {
    setIsEnabled((prev: any) => !prev)
  }, [])

  return {
    isEnabled,
    playSound,
    toggleSound
  }
}
