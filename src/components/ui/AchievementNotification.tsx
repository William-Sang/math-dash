import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X } from 'lucide-react'
import { Achievement } from '@/hooks/useAchievements'

interface AchievementNotificationProps {
  achievement: Achievement | null
  onClose: () => void
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  if (!achievement) return null

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          rotate: [0, -1, 1, -1, 0] // Slight shake animation
        }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ 
          duration: 0.6,
          rotate: { duration: 0.8, times: [0, 0.2, 0.4, 0.6, 1] }
        }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} p-[2px] rounded-lg shadow-2xl`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-w-[300px] max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    🎉 成就解锁!
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full text-white bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                    {getRarityText(achievement.rarity)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {achievement.name}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
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
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}