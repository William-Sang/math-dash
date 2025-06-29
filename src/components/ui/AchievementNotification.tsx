import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X } from 'lucide-react'
import { useEffect } from 'react'

// 成就通知组件只需要这些属性，不需要condition函数
interface AchievementDisplay {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
  reward?: {
    type: 'points' | 'theme' | 'avatar' | 'title'
    value: string | number
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface AchievementNotificationProps {
  achievement: AchievementDisplay | null
  onClose: () => void
  index?: number // 用于堆叠显示
}

export default function AchievementNotification({ achievement, onClose, index = 0 }: AchievementNotificationProps) {
  // Auto close after 4 seconds
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500'
      case 'epic': return 'from-purple-400 to-pink-500'
      case 'rare': return 'from-blue-400 to-cyan-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '传奇'
      case 'epic': return '史诗'
      case 'rare': return '稀有'
      default: return '普通'
    }
  }

  // 计算垂直位置，每个成就弹框高度约80px，间隔10px
  const topPosition = 20 + index * 90

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, scale: 0.8, x: 300 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            x: 0,
            rotate: [0, -1, 1, -1, 0] // Slight shake animation
          }}
          exit={{ opacity: 0, scale: 0.8, x: 300 }}
          transition={{ 
            duration: 0.4,
            rotate: { duration: 0.6, times: [0, 0.2, 0.4, 0.6, 1] }
          }}
          className="fixed right-3 z-[100] w-72"
          style={{ top: `${topPosition}px` }}
          onClick={onClose}
        >
          <div className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} p-[1.5px] rounded-lg shadow-xl`}>
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg p-2 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      🎉 成就解锁!
                    </span>
                    <span className={`text-xs px-1 py-0.5 rounded text-white bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                      {getRarityText(achievement.rarity)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-sm">{achievement.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white text-xs">
                      {achievement.name}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 leading-tight">
                    {achievement.description}
                  </p>
                  
                  {achievement.reward && (
                    <div className="text-xs text-green-600 dark:text-green-400">
                      奖励: {achievement.reward.type === 'points' ? `${achievement.reward.value}积分` : achievement.reward.value}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}