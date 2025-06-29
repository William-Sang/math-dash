import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Avatar {
  id: string
  name: string
  icon: string
  unlocked: boolean
  unlockCondition?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  unlocked: boolean
  unlockCondition?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface UserTitle {
  id: string
  name: string
  unlocked: boolean
  unlockCondition?: string
}

const DEFAULT_AVATARS: Avatar[] = [
  // 默认头像
  {
    id: 'default',
    name: '默认',
    icon: '👤',
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'student',
    name: '学生',
    icon: '🎓',
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'teacher',
    name: '老师',
    icon: '👨‍🏫',
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'scientist',
    name: '科学家',
    icon: '👨‍🔬',
    unlocked: true,
    rarity: 'common'
  },
  // 解锁类头像
  {
    id: 'lightning',
    name: '闪电侠',
    icon: '⚡',
    unlocked: false,
    unlockCondition: '速算高手成就',
    rarity: 'rare'
  },
  {
    id: 'fire',
    name: '火焰王',
    icon: '🔥',
    unlocked: false,
    unlockCondition: '连击王成就',
    rarity: 'rare'
  },
  {
    id: 'target',
    name: '神射手',
    icon: '🎯',
    unlocked: false,
    unlockCondition: '精准射手成就',
    rarity: 'epic'
  },
  {
    id: 'plus',
    name: '加法大师',
    icon: '➕',
    unlocked: false,
    unlockCondition: '加法专家成就',
    rarity: 'rare'
  },
  {
    id: 'racer',
    name: '竞速王',
    icon: '🏎️',
    unlocked: false,
    unlockCondition: '极速竞赛者成就',
    rarity: 'epic'
  },
  {
    id: 'crown',
    name: '数学之王',
    icon: '👑',
    unlocked: false,
    unlockCondition: '获得5个传奇成就',
    rarity: 'legendary'
  },
  {
    id: 'wizard',
    name: '数学法师',
    icon: '🧙‍♂️',
    unlocked: false,
    unlockCondition: '数学大师成就',
    rarity: 'epic'
  },
  {
    id: 'robot',
    name: '计算机器人',
    icon: '🤖',
    unlocked: false,
    unlockCondition: '完成1000道题',
    rarity: 'rare'
  }
]

const DEFAULT_THEMES: Theme[] = [
  // 默认主题
  {
    id: 'light',
    name: '清新蓝',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937'
    },
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'dark', 
    name: '深邃黑',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#10b981',
      background: '#1f2937',
      surface: '#374151',
      text: '#f9fafb'
    },
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'forest',
    name: '森林绿',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ecfdf5',
      surface: '#d1fae5',
      text: '#064e3b'
    },
    unlocked: true,
    rarity: 'common'
  },
  {
    id: 'sunset',
    name: '日落橙',
    colors: {
      primary: '#ea580c',
      secondary: '#6b7280',
      accent: '#dc2626',
      background: '#fff7ed',
      surface: '#fed7aa',
      text: '#9a3412'
    },
    unlocked: true,
    rarity: 'common'
  },
  // 解锁主题
  {
    id: 'master',
    name: '大师紫',
    colors: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      accent: '#f59e0b',
      background: '#faf5ff',
      surface: '#e9d5ff',
      text: '#581c87'
    },
    unlocked: false,
    unlockCondition: '数学大师成就',
    rarity: 'epic'
  },
  {
    id: 'diamond',
    name: '钻石蓝',
    colors: {
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      accent: '#06b6d4', 
      background: '#f0f9ff',
      surface: '#bae6fd',
      text: '#0c4a6e'
    },
    unlocked: false,
    unlockCondition: '完美主义者成就',
    rarity: 'epic'
  },
  {
    id: 'golden',
    name: '黄金色',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#ef4444',
      background: '#fffbeb',
      surface: '#fef3c7',
      text: '#92400e'
    },
    unlocked: false,
    unlockCondition: '连胜大师成就',
    rarity: 'legendary'
  },
  {
    id: 'multiplication',
    name: '乘法红',
    colors: {
      primary: '#dc2626',
      secondary: '#ef4444',
      accent: '#f97316',
      background: '#fef2f2',
      surface: '#fecaca',
      text: '#991b1b'
    },
    unlocked: false,
    unlockCondition: '乘法大师成就',
    rarity: 'epic'
  },
  {
    id: 'veteran',
    name: '老兵墨绿',
    colors: {
      primary: '#166534',
      secondary: '#22c55e',
      accent: '#eab308',
      background: '#f0fdf4',
      surface: '#bbf7d0',
      text: '#14532d'
    },
    unlocked: false,
    unlockCondition: '百战老兵成就',
    rarity: 'legendary'
  },
  {
    id: 'rainbow',
    name: '彩虹',
    colors: {
      primary: '#e11d48',
      secondary: '#f97316',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937'
    },
    unlocked: false,
    unlockCondition: '解锁所有其他主题',
    rarity: 'legendary'
  }
]

const DEFAULT_TITLES: UserTitle[] = [
  {
    id: 'none',
    name: '无称号',
    unlocked: true
  },
  {
    id: 'persistent',
    name: '坚持不懈',
    unlocked: false,
    unlockCondition: '马拉松跑者成就'
  },
  {
    id: 'persister',
    name: '坚持者',
    unlocked: false,
    unlockCondition: '每日坚持成就'
  },
  {
    id: 'legendary_player',
    name: '传奇玩家',
    unlocked: false,
    unlockCondition: '世纪得分者成就'
  },
  {
    id: 'math_genius',
    name: '数学天才',
    unlocked: false,
    unlockCondition: '获得所有成就'
  }
]

interface PersonalizationState {
  selectedAvatar: string
  selectedTheme: string
  selectedTitle: string
  avatars: Avatar[]
  themes: Theme[]
  titles: UserTitle[]
  setAvatar: (avatarId: string) => void
  setTheme: (themeId: string) => void
  setTitle: (titleId: string) => void
  unlockAvatar: (avatarId: string) => void
  unlockTheme: (themeId: string) => void
  unlockTitle: (titleId: string) => void
  getUnlockedAvatars: () => Avatar[]
  getUnlockedThemes: () => Theme[]
  getUnlockedTitles: () => UserTitle[]
  getCurrentTheme: () => Theme
  getCurrentAvatar: () => Avatar
  getCurrentTitle: () => UserTitle
}

export const usePersonalization = create<PersonalizationState>()(
  persist(
    (set, get) => ({
      selectedAvatar: 'default',
      selectedTheme: 'light',
      selectedTitle: 'none',
      avatars: DEFAULT_AVATARS,
      themes: DEFAULT_THEMES,
      titles: DEFAULT_TITLES,

      setAvatar: (avatarId) => {
        const avatar = get().avatars.find(a => a.id === avatarId)
        if (avatar && avatar.unlocked) {
          set({ selectedAvatar: avatarId })
        }
      },

      setTheme: (themeId) => {
        const theme = get().themes.find(t => t.id === themeId)
        if (theme && theme.unlocked) {
          set({ selectedTheme: themeId })
        }
      },

      setTitle: (titleId) => {
        const title = get().titles.find(t => t.id === titleId)
        if (title && title.unlocked) {
          set({ selectedTitle: titleId })
        }
      },

      unlockAvatar: (avatarId) => {
        const avatars = get().avatars.map(avatar => 
          avatar.id === avatarId ? { ...avatar, unlocked: true } : avatar
        )
        set({ avatars })
      },

      unlockTheme: (themeId) => {
        const themes = get().themes.map(theme => 
          theme.id === themeId ? { ...theme, unlocked: true } : theme
        )
        set({ themes })
      },

      unlockTitle: (titleId) => {
        const titles = get().titles.map(title => 
          title.id === titleId ? { ...title, unlocked: true } : title
        )
        set({ titles })
      },

      getUnlockedAvatars: () => {
        return get().avatars.filter(a => a.unlocked)
      },

      getUnlockedThemes: () => {
        return get().themes.filter(t => t.unlocked)
      },

      getUnlockedTitles: () => {
        return get().titles.filter(t => t.unlocked)
      },

      getCurrentTheme: () => {
        return get().themes.find(t => t.id === get().selectedTheme) || get().themes[0]
      },

      getCurrentAvatar: () => {
        return get().avatars.find(a => a.id === get().selectedAvatar) || get().avatars[0]
      },

      getCurrentTitle: () => {
        return get().titles.find(t => t.id === get().selectedTitle) || get().titles[0]
      }
    }),
    {
      name: 'personalization-storage',
    }
  )
)

// Helper function to unlock items based on achievements
export const unlockItemsFromAchievements = (achievementIds: string[]) => {
  const personalization = usePersonalization.getState()
  
  achievementIds.forEach(achievementId => {
    // Check avatars
    const avatarToUnlock = personalization.avatars.find(a => 
      !a.unlocked && a.unlockCondition?.includes(achievementId)
    )
    if (avatarToUnlock) {
      personalization.unlockAvatar(avatarToUnlock.id)
    }

    // Check themes
    const themeToUnlock = personalization.themes.find(t => 
      !t.unlocked && t.unlockCondition?.includes(achievementId)
    )
    if (themeToUnlock) {
      personalization.unlockTheme(themeToUnlock.id)
    }

    // Check titles
    const titleToUnlock = personalization.titles.find(t => 
      !t.unlocked && t.unlockCondition?.includes(achievementId)
    )
    if (titleToUnlock) {
      personalization.unlockTitle(titleToUnlock.id)
    }
  })
}