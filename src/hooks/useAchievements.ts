import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (_stats: GameStats) => boolean
  unlocked: boolean
  unlockedAt?: Date
  reward?: {
    type: 'points' | 'theme' | 'avatar' | 'title'
    value: string | number
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface GameStats {
  totalGames: number
  totalScore: number
  bestScore: number
  averageScore: number
  totalTime: number
  averageTime: number
  accuracy: number
  streak: number
  bestStreak: number
  totalCorrectAnswers: number
  totalWrongAnswers: number
  perfectGames: number
  fastestTime: number
  longestStreak: number
  dailyStreak: number
  lastPlayDate: string
  gameHistory: GameSession[]
  operatorStats: {
    addition: { correct: number; total: number }
    subtraction: { correct: number; total: number }
    multiplication: { correct: number; total: number }
    division: { correct: number; total: number }
  }
}

export interface GameSession {
  date: string
  score: number
  accuracy: number
  timeSpent: number
  questionsAnswered: number
  perfectAnswers: number
  streak: number
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // 基础成就
  {
    id: 'first_game',
    name: '初来乍到',
    description: '完成你的第一局游戏',
    icon: '🎮',
    condition: (stats) => stats.totalGames >= 1,
    unlocked: false,
    rarity: 'common',
    reward: { type: 'points', value: 50 }
  },
  {
    id: 'hundred_club',
    name: '百分达人',
    description: '单局得分超过100分',
    icon: '💯',
    condition: (stats) => stats.bestScore >= 100,
    unlocked: false,
    rarity: 'common',
    reward: { type: 'points', value: 100 }
  },
  {
    id: 'speed_demon',
    name: '速算高手',
    description: '平均每题用时少于3秒',
    icon: '⚡',
    condition: (stats) => stats.averageTime <= 3,
    unlocked: false,
    rarity: 'rare',
    reward: { type: 'avatar', value: 'lightning' }
  },
  {
    id: 'math_master',
    name: '数学大师',
    description: '单局得分超过200分',
    icon: '🧠',
    condition: (stats) => stats.bestScore >= 200,
    unlocked: false,
    rarity: 'epic',
    reward: { type: 'theme', value: 'master' }
  },
  {
    id: 'combo_king',
    name: '连击王',
    description: '连续答对20题',
    icon: '🔥',
    condition: (stats) => stats.bestStreak >= 20,
    unlocked: false,
    rarity: 'rare',
    reward: { type: 'avatar', value: 'fire' }
  },
  {
    id: 'perfectionist',
    name: '完美主义者',
    description: '完成一局100%正确率的游戏',
    icon: '💎',
    condition: (stats) => stats.perfectGames >= 1,
    unlocked: false,
    rarity: 'epic',
    reward: { type: 'theme', value: 'diamond' }
  },
  {
    id: 'marathon_runner',
    name: '马拉松跑者',
    description: '总游戏时间超过60分钟',
    icon: '🏃',
    condition: (stats) => stats.totalTime >= 3600,
    unlocked: false,
    rarity: 'rare',
    reward: { type: 'title', value: '坚持不懈' }
  },
  {
    id: 'streak_master',
    name: '连胜大师',
    description: '连续答对50题',
    icon: '🌟',
    condition: (stats) => stats.bestStreak >= 50,
    unlocked: false,
    rarity: 'legendary',
    reward: { type: 'theme', value: 'golden' }
  },
  {
    id: 'accuracy_ace',
    name: '精准射手',
    description: '总体正确率达到95%',
    icon: '🎯',
    condition: (stats) => stats.accuracy >= 95,
    unlocked: false,
    rarity: 'epic',
    reward: { type: 'avatar', value: 'target' }
  },
  {
    id: 'daily_dedication',
    name: '每日坚持',
    description: '连续7天游戏',
    icon: '📅',
    condition: (stats) => stats.dailyStreak >= 7,
    unlocked: false,
    rarity: 'rare',
    reward: { type: 'title', value: '坚持者' }
  },
  {
    id: 'addition_expert',
    name: '加法专家',
    description: '加法题正确率达到98%',
    icon: '➕',
    condition: (stats) => {
      const addStats = stats.operatorStats.addition
      return addStats.total > 0 && (addStats.correct / addStats.total) >= 0.98
    },
    unlocked: false,
    rarity: 'rare',
    reward: { type: 'avatar', value: 'plus' }
  },
  {
    id: 'multiplication_master',
    name: '乘法大师',
    description: '乘法题正确率达到95%',
    icon: '✖️',
    condition: (stats) => {
      const multiStats = stats.operatorStats.multiplication
      return multiStats.total > 0 && (multiStats.correct / multiStats.total) >= 0.95
    },
    unlocked: false,
    rarity: 'epic',
    reward: { type: 'theme', value: 'multiplication' }
  },
  {
    id: 'century_scorer',
    name: '世纪得分者',
    description: '总得分超过10000分',
    icon: '🏆',
    condition: (stats) => stats.totalScore >= 10000,
    unlocked: false,
    rarity: 'legendary',
    reward: { type: 'title', value: '传奇玩家' }
  },
  {
    id: 'speed_racer',
    name: '极速竞赛者',
    description: '最快完成时间少于30秒',
    icon: '🏎️',
    condition: (stats) => stats.fastestTime > 0 && stats.fastestTime <= 30,
    unlocked: false,
    rarity: 'epic',
    reward: { type: 'avatar', value: 'racer' }
  },
  {
    id: 'hundred_games',
    name: '百战老兵',
    description: '完成100局游戏',
    icon: '🎖️',
    condition: (stats) => stats.totalGames >= 100,
    unlocked: false,
    rarity: 'legendary',
    reward: { type: 'theme', value: 'veteran' }
  }
]

const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  totalScore: 0,
  bestScore: 0,
  averageScore: 0,
  totalTime: 0,
  averageTime: 0,
  accuracy: 0,
  streak: 0,
  bestStreak: 0,
  totalCorrectAnswers: 0,
  totalWrongAnswers: 0,
  perfectGames: 0,
  fastestTime: 0,
  longestStreak: 0,
  dailyStreak: 0,
  lastPlayDate: '',
  gameHistory: [],
  operatorStats: {
    addition: { correct: 0, total: 0 },
    subtraction: { correct: 0, total: 0 },
    multiplication: { correct: 0, total: 0 },
    division: { correct: 0, total: 0 }
  }
}

interface AchievementsState {
  achievements: Achievement[]
  stats: GameStats
  unlockedPoints: number
  updateDailyStreak: () => void
  updateStats: (_sessionData: Partial<GameSession> & { 
    operatorType?: 'addition' | 'subtraction' | 'multiplication' | 'division'
    isCorrect?: boolean
  }) => void
  checkAchievements: () => Achievement[]
  resetStats: () => void
  getUnlockedAchievements: () => Achievement[]
  getPendingAchievements: () => Achievement[]
}

const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: DEFAULT_ACHIEVEMENTS,
      stats: DEFAULT_STATS,
      unlockedPoints: 0,

      updateDailyStreak: () =>
        set((state) => {
          const currentStats = state.stats
          const today = new Date().toISOString().split('T')[0]
          
          // Only update if it's a new day
          if (currentStats.lastPlayDate !== today) {
            let dailyStreak = currentStats.dailyStreak
            
            if (currentStats.lastPlayDate === '') {
              // First time playing
              dailyStreak = 1
            } else {
              const lastDate = new Date(currentStats.lastPlayDate)
              const currentDate = new Date(today)
              const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              
              if (diffDays === 1) {
                dailyStreak += 1
              } else if (diffDays > 1) {
                dailyStreak = 1
              }
            }
            
            return {
              stats: {
                ...currentStats,
                dailyStreak,
                lastPlayDate: today
              }
            }
          }
          
          return state
        }),

      updateStats: (_sessionData) =>
        set((state) => {
          const currentStats = state.stats
          const today = new Date().toISOString().split('T')[0]
          
          // Update operator stats if provided
          if (_sessionData.operatorType && _sessionData.isCorrect !== undefined) {
            const operatorStats = { ...currentStats.operatorStats }
            operatorStats[_sessionData.operatorType].total += 1
            if (_sessionData.isCorrect) {
              operatorStats[_sessionData.operatorType].correct += 1
            }
            currentStats.operatorStats = operatorStats
          }

          const newStats: GameStats = {
            ...currentStats,
            totalGames: currentStats.totalGames + (_sessionData.score !== undefined ? 1 : 0), // Only increment if this is a complete game
            totalScore: currentStats.totalScore + (_sessionData.score || 0),
            bestScore: Math.max(currentStats.bestScore, _sessionData.score || 0),
            totalTime: currentStats.totalTime + (_sessionData.timeSpent || 0),
            bestStreak: Math.max(currentStats.bestStreak, _sessionData.streak || 0),
            totalCorrectAnswers: currentStats.totalCorrectAnswers + (_sessionData.perfectAnswers || 0),
            totalWrongAnswers: currentStats.totalWrongAnswers + Math.max(0, (_sessionData.questionsAnswered || 0) - (_sessionData.perfectAnswers || 0)),
            perfectGames: currentStats.perfectGames + (_sessionData.accuracy === 100 ? 1 : 0),
            fastestTime: currentStats.fastestTime === 0 ? (_sessionData.timeSpent || 0) : Math.min(currentStats.fastestTime, _sessionData.timeSpent || 0),
            gameHistory: _sessionData.score !== undefined ? [
              ...(currentStats.gameHistory || []),
              {
                date: today,
                score: _sessionData.score || 0,
                accuracy: _sessionData.accuracy || 0,
                timeSpent: _sessionData.timeSpent || 0,
                questionsAnswered: _sessionData.questionsAnswered || 0,
                perfectAnswers: _sessionData.perfectAnswers || 0,
                streak: _sessionData.streak || 0
              }
            ].slice(-50) : currentStats.gameHistory // Keep only last 50 games
          }

          // Calculate averages
          if (newStats.totalGames > 0) {
            newStats.averageScore = Math.round(newStats.totalScore / newStats.totalGames)
            newStats.averageTime = Math.round(newStats.totalTime / newStats.totalGames)
            const totalAnswers = newStats.totalCorrectAnswers + newStats.totalWrongAnswers
            newStats.accuracy = totalAnswers > 0 ? Math.round((newStats.totalCorrectAnswers / totalAnswers) * 100) : 0
          }

          return { stats: newStats }
        }),

      checkAchievements: () => {
        const { stats, achievements } = get()
        const newlyUnlocked: Achievement[] = []

        const defaultConditions = new Map(DEFAULT_ACHIEVEMENTS.map(a => [a.id, a.condition]));

        achievements.forEach((achievement) => {
          const condition = defaultConditions.get(achievement.id);
          if (condition && !achievement.unlocked && condition(stats)) {
            newlyUnlocked.push({ ...achievement, unlocked: true, unlockedAt: new Date() })
            set((state) => ({
              achievements: state.achievements.map((a) =>
                a.id === achievement.id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
              ),
              unlockedPoints: state.unlockedPoints + (achievement.reward?.value as number || 0)
            }))
          }
        })
        return newlyUnlocked
      },

      resetStats: () => set({ stats: DEFAULT_STATS, achievements: DEFAULT_ACHIEVEMENTS, unlockedPoints: 0 }),

      getUnlockedAchievements: () => {
        return get().achievements.filter(a => a.unlocked)
      },

      getPendingAchievements: () => {
        return get().achievements.filter(a => !a.unlocked)
      }
    }),
    {
      name: 'achievements-storage',
    }
  )
)

export const useAchievements = useAchievementsStore;