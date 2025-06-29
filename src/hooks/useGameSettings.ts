import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GameSettings {
  gameDuration: number // 游戏时长（秒）
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' // 难度等级
}

interface GameSettingsState {
  settings: GameSettings
  setGameDuration: (duration: number) => void
  setDifficulty: (difficulty: GameSettings['difficulty']) => void
  resetSettings: () => void
}

const DEFAULT_SETTINGS: GameSettings = {
  gameDuration: 30, // 默认 30 秒
  difficulty: 'medium' // 默认中等难度
}

export const useGameSettings = create<GameSettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      
      setGameDuration: (_duration: number) =>
        set((state) => ({
          settings: {
            ...state.settings,
            gameDuration: _duration
          }
        })),
        
      setDifficulty: (_difficulty: GameSettings['difficulty']) =>
        set((state) => ({
          settings: {
            ...state.settings,
            difficulty: _difficulty
          }
        })),
        
      resetSettings: () =>
        set({ settings: DEFAULT_SETTINGS })
    }),
    {
      name: 'game-settings-storage'
    }
  )
) 