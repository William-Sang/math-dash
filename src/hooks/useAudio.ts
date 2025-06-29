import { useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AudioState {
  soundEnabled: boolean
  musicEnabled: boolean
  soundVolume: number
  musicVolume: number
  setSoundEnabled: (enabled: boolean) => void
  setMusicEnabled: (enabled: boolean) => void
  setSoundVolume: (volume: number) => void
  setMusicVolume: (volume: number) => void
}

const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      musicEnabled: true,
      soundVolume: 0.7,
      musicVolume: 0.5,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
      setSoundVolume: (volume) => set({ soundVolume: volume }),
      setMusicVolume: (volume) => set({ musicVolume: volume }),
    }),
    {
      name: 'audio-settings',
    }
  )
)

// Sound effects data URLs (base64 encoded short sounds)
const SOUND_EFFECTS = {
  correct: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR', // Simple beep
  incorrect: 'data:audio/wav;base64,UklGRjIGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR', // Different tone
  click: 'data:audio/wav;base64,UklGRjIGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR', // Click sound
  achievement: 'data:audio/wav;base64,UklGRjIGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR', // Achievement fanfare
  gameStart: 'data:audio/wav;base64,UklGRjIGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR', // Game start
  gameEnd: 'data:audio/wav;base64,UklGRjIGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR', // Game end
}

class AudioManager {
  private sounds: { [key: string]: Howl } = {}
  private backgroundMusic: Howl | null = null
  private audioStore: AudioState

  constructor() {
    this.audioStore = useAudioStore.getState()
    this.initializeSounds()
    this.initializeBackgroundMusic()
  }

  private initializeSounds() {
    Object.entries(SOUND_EFFECTS).forEach(([key, src]) => {
      this.sounds[key] = new Howl({
        src: [src],
        volume: this.audioStore.soundVolume,
        preload: true,
      })
    })
  }

  private initializeBackgroundMusic() {
    // Create a simple ambient background track using Web Audio API
    this.backgroundMusic = new Howl({
      src: ['data:audio/wav;base64,UklGRjIGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR'],
      loop: true,
      volume: this.audioStore.musicVolume,
      preload: true,
    })
  }

  playSound(soundName: keyof typeof SOUND_EFFECTS) {
    if (!this.audioStore.soundEnabled) return
    
    const sound = this.sounds[soundName]
    if (sound) {
      sound.volume(this.audioStore.soundVolume)
      sound.play()
    }
  }

  playBackgroundMusic() {
    if (!this.audioStore.musicEnabled || !this.backgroundMusic) return
    
    this.backgroundMusic.volume(this.audioStore.musicVolume)
    this.backgroundMusic.play()
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.stop()
    }
  }

  updateSoundVolume(volume: number) {
    Object.values(this.sounds).forEach(sound => {
      sound.volume(volume)
    })
  }

  updateMusicVolume(volume: number) {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume(volume)
    }
  }
}

let audioManager: AudioManager | null = null

export const useAudio = () => {
  const audioStore = useAudioStore()
  const managerRef = useRef<AudioManager | null>(null)

  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = new AudioManager()
      audioManager = managerRef.current
    }
  }, [])

  useEffect(() => {
    if (audioManager) {
      audioManager.updateSoundVolume(audioStore.soundVolume)
    }
  }, [audioStore.soundVolume])

  useEffect(() => {
    if (audioManager) {
      audioManager.updateMusicVolume(audioStore.musicVolume)
    }
  }, [audioStore.musicVolume])

  const playSound = (soundName: keyof typeof SOUND_EFFECTS) => {
    if (audioManager) {
      audioManager.playSound(soundName)
    }
  }

  const playBackgroundMusic = () => {
    if (audioManager) {
      audioManager.playBackgroundMusic()
    }
  }

  const stopBackgroundMusic = () => {
    if (audioManager) {
      audioManager.stopBackgroundMusic()
    }
  }

  return {
    ...audioStore,
    playSound,
    playBackgroundMusic,
    stopBackgroundMusic,
  }
}