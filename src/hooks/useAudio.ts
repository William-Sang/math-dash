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
      soundVolume: 0.5,
      musicVolume: 0.2,
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

// Using a single, reliable sound effect for all UI sounds for testing purposes.
const UI_SOUND_SRC = 'https://soundbible.com/grab.php?id=1280&type=mp3';

const SOUND_EFFECTS = {
  correct: UI_SOUND_SRC,
  incorrect: UI_SOUND_SRC,
  click: UI_SOUND_SRC,
  achievement: UI_SOUND_SRC,
  gameStart: UI_SOUND_SRC,
  gameEnd: UI_SOUND_SRC,
}

const BACKGROUND_MUSIC_SRC = 'https://www.orangefreesounds.com/wp-content/uploads/2017/09/Swan-lake-music.mp3';

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
    console.log("Initializing sounds from public URL...");
    Object.entries(SOUND_EFFECTS).forEach(([key, src]) => {
      try {
        this.sounds[key] = new Howl({
          src: [src],
          volume: this.audioStore.soundVolume,
          preload: true,
        })
      } catch (error) {
        console.error(`Error loading sound '${key}' from URL:`, error);
      }
    })
    console.log("Sounds initialized.");
  }

  private initializeBackgroundMusic() {
    console.log("Initializing background music from public URL...");
    try {
      this.backgroundMusic = new Howl({
        src: [BACKGROUND_MUSIC_SRC],
        loop: true,
        volume: this.audioStore.musicVolume,
        preload: true,
        html5: true, 
      });
      console.log("Background music object created.");
    } catch (error) {
      console.error("Error creating background music Howl object from URL:", error);
    }
  }

  playSound(soundName: keyof typeof SOUND_EFFECTS) {
    if (!this.audioStore.soundEnabled) return
    
    const sound = this.sounds[soundName]
    if (sound) {
      sound.stop()
      sound.volume(this.audioStore.soundVolume)
      sound.play()
    }
  }

  private playMusicLogic() {
    if (!this.backgroundMusic) return;

    if (!this.backgroundMusic.playing()) {
      const playId = this.backgroundMusic.play();
      console.log("Attempting to play music with ID:", playId);
      this.backgroundMusic.once('playerror', (id, err) => {
        console.error('Background music play error:', err, `(ID: ${id})`);
      });
      this.backgroundMusic.once('play', () => {
        console.log("Music started playing successfully.");
      });
    } else {
      console.log("Music is already playing.");
    }
  }

  playBackgroundMusic() {
    console.log("playBackgroundMusic called. Music enabled:", this.audioStore.musicEnabled, "Context state:", Howler.ctx.state);
    if (!this.audioStore.musicEnabled || !this.backgroundMusic) {
      console.log("Play conditions not met.");
      return;
    }

    if (Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().then(() => {
        console.log('AudioContext resumed successfully. Now playing music.');
        this.playMusicLogic();
      }).catch(e => console.error("Error resuming AudioContext:", e));
    } else {
      this.playMusicLogic();
    }
  }

  stopBackgroundMusic() {
    console.log("stopBackgroundMusic called.");
    if (this.backgroundMusic && this.backgroundMusic.playing()) {
      this.backgroundMusic.stop()
      console.log("Music stop command issued.");
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
    if (!audioManager) {
      console.log("Creating new AudioManager instance.");
      audioManager = new AudioManager()
    }
    managerRef.current = audioManager;
  }, [])

  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.updateSoundVolume(audioStore.soundVolume)
    }
  }, [audioStore.soundVolume])

  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.updateMusicVolume(audioStore.musicVolume)
    }
  }, [audioStore.musicVolume])

  const playSound = (soundName: keyof typeof SOUND_EFFECTS) => {
    if (managerRef.current) {
      managerRef.current.playSound(soundName)
    }
  }

  const playBackgroundMusic = () => {
    if (managerRef.current) {
      managerRef.current.playBackgroundMusic()
    }
  }

  const stopBackgroundMusic = () => {
    if (managerRef.current) {
      managerRef.current.stopBackgroundMusic()
    }
  }

  return {
    ...audioStore,
    playSound,
    playBackgroundMusic,
    stopBackgroundMusic,
  }
}