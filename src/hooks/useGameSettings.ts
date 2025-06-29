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
  gameDuration: 60, // 默认 60 秒
  difficulty: 'medium' // 默认中等难度
}

export const useGameSettings = create<GameSettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      
      setGameDuration: (duration: number) =>
        set((state) => ({
          settings: {
            ...state.settings,
            gameDuration: duration
          }
        })),
        
      setDifficulty: (difficulty: GameSettings['difficulty']) =>
        set((state) => ({
          settings: {
            ...state.settings,
            difficulty
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