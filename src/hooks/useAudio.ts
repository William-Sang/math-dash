import { useEffect, useRef } from 'react'
import { Howl, Howler } from 'howler'
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
      soundVolume: 0.2,
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

// 使用 Mixkit 提供的免费音效文件 (https://mixkit.co/)
// 所有音效均为免费使用，无需署名，符合 Mixkit Free License
const SOUND_EFFECTS = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // 成功提示音 - 清脆的成功音效
  incorrect: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3', // 错误提示音 - 温和的错误提示
  click: 'https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3', // 点击音效 - 简洁的UI点击声
  achievement: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // 成就音效 - 与成功音效相同
  gameStart: 'https://assets.mixkit.co/active_storage/sfx/2858/2858-preview.mp3', // 游戏开始音效 - 积极的开始提示音
  gameEnd: 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3', // 游戏结束音效 - 温和的完成音效
}

// 保留原来的背景音乐（Mixkit的音乐文件有访问限制）
const BACKGROUND_MUSIC_SRC = 'https://www.orangefreesounds.com/wp-content/uploads/2017/09/Swan-lake-music.mp3';

class AudioManager {
  private sounds: { [key: string]: Howl } = {}
  private backgroundMusic: Howl | null = null
  private userInteracted: boolean = false

  constructor() {
    this.initializeSounds()
    this.initializeBackgroundMusic()
    this.setupUserInteractionListener()
  }

  private setupUserInteractionListener() {
    const handleUserInteraction = () => {
      this.userInteracted = true
      console.log('User interaction detected, audio context ready')
      // 移除监听器，只需要一次交互
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)
  }

  private initializeSounds() {
    console.log("Initializing sounds from public URL...");
    Object.entries(SOUND_EFFECTS).forEach(([key, src]) => {
      try {
        // 为游戏结束音效添加特殊配置
        const soundConfig: any = {
          src: [src],
          volume: 0.2, // 使用默认音量，稍后会通过updateSoundVolume更新
          preload: true,
          onloaderror: (id: any, error: any) => {
            console.error(`Error loading sound '${key}':`, error);
          }
        }
        
        // 限制游戏结束音效的播放时长为2秒
        if (key === 'gameEnd') {
          soundConfig.sprite = {
            short: [0, 2000] // 从0秒开始，播放2秒
          }
        }
        
        this.sounds[key] = new Howl(soundConfig)
      } catch (error) {
        console.error(`Error creating sound '${key}':`, error);
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
        volume: 0.2, // 使用默认音量，稍后会通过updateMusicVolume更新
        preload: true,
        html5: true,
        onloaderror: (id, error) => {
          console.error("Error loading background music:", error);
        },
        onload: () => {
          console.log("Background music loaded successfully.");
        }
      });
      console.log("Background music object created.");
    } catch (error) {
      console.error("Error creating background music Howl object from URL:", error);
    }
  }

  playSound(soundName: keyof typeof SOUND_EFFECTS) {
    const currentState = useAudioStore.getState()
    if (!currentState.soundEnabled || !this.userInteracted) {
      console.log('Sound disabled or no user interaction:', { 
        soundEnabled: currentState.soundEnabled, 
        userInteracted: this.userInteracted 
      })
      return
    }
    
    const sound = this.sounds[soundName]
    if (sound) {
      try {
        sound.stop()
        sound.volume(currentState.soundVolume)
        
        // 游戏结束音效使用限制时长的sprite
        if (soundName === 'gameEnd') {
          sound.play('short')
        } else {
          sound.play()
        }
        
        console.log(`Playing sound: ${soundName}`)
      } catch (error) {
        console.error(`Error playing sound ${soundName}:`, error)
      }
    } else {
      console.warn(`Sound ${soundName} not found`)
    }
  }

  private playMusicLogic() {
    if (!this.backgroundMusic) {
      console.log("No background music object available")
      return;
    }

    if (!this.backgroundMusic.playing()) {
      try {
        const playId = this.backgroundMusic.play();
        console.log("Attempting to play music with ID:", playId);
        
        this.backgroundMusic.once('playerror', (id, err) => {
          console.error('Background music play error:', err, `(ID: ${id})`);
        });
        
        this.backgroundMusic.once('play', () => {
          console.log("Music started playing successfully.");
        });
      } catch (error) {
        console.error('Error in playMusicLogic:', error)
      }
    } else {
      console.log("Music is already playing.");
    }
  }

  playBackgroundMusic() {
    const currentState = useAudioStore.getState()
    console.log("playBackgroundMusic called. Music enabled:", currentState.musicEnabled, "User interacted:", this.userInteracted, "Context state:", Howler.ctx.state);
    
    if (!currentState.musicEnabled || !this.backgroundMusic || !this.userInteracted) {
      console.log("Play conditions not met:", {
        musicEnabled: currentState.musicEnabled,
        hasBackgroundMusic: !!this.backgroundMusic,
        userInteracted: this.userInteracted
      });
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
      try {
        this.backgroundMusic.stop()
        console.log("Music stop command issued.");
      } catch (error) {
        console.error('Error stopping music:', error)
      }
    }
  }

  updateSoundVolume(volume: number) {
    console.log('Updating sound volume to:', volume)
    Object.values(this.sounds).forEach(sound => {
      try {
        sound.volume(volume)
      } catch (error) {
        console.error('Error updating sound volume:', error)
      }
    })
  }

  updateMusicVolume(volume: number) {
    console.log('Updating music volume to:', volume)
    if (this.backgroundMusic) {
      try {
        this.backgroundMusic.volume(volume)
      } catch (error) {
        console.error('Error updating music volume:', error)
      }
    }
  }

  // 新增方法：根据当前状态控制音乐播放
  updateMusicPlayback() {
    const currentState = useAudioStore.getState()
    if (currentState.musicEnabled) {
      this.playBackgroundMusic()
    } else {
      this.stopBackgroundMusic()
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

  // 新增：监听音乐开关状态变化
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.updateMusicPlayback()
    }
  }, [audioStore.musicEnabled])

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