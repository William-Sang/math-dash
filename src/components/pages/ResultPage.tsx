import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { RotateCcw, Home, Share2 } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { useAudio } from '@/hooks/useAudio'
import AchievementManager from '@/components/ui/AchievementManager'
import { useEffect, useRef } from 'react'

// 成就显示类型（不包含condition函数）
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

interface ResultState {
  score: number
  totalTime: number
  accuracy: number
  questionsAnswered?: number
  endReason?: 'timeUp' | 'livesOut'
  newAchievements?: AchievementDisplay[]
}

export default function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const { playSound } = useAudio()
  const playSoundRef = useRef(playSound)
  
  // 更新ref引用
  useEffect(() => {
    playSoundRef.current = playSound
  }, [playSound])
  
  const result: ResultState = location.state || { score: 0, totalTime: 0, accuracy: 0, questionsAnswered: 0 }

  const handleShare = () => {
    const shareText = `我在 Math Dash Mania 中获得了 ${result.score} 分！正确率 ${result.accuracy}%，用时 ${result.totalTime} 秒。快来挑战吧！`
    
    if (navigator.share) {
      navigator.share({
        title: 'Math Dash Mania - 游戏结果',
        text: shareText,
      })
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success('结果已复制到剪贴板！')
      })
    }
  }

  const getScoreRating = (score: number) => {
    if (score >= 200) return { text: '数学天才！', color: 'text-yellow-500', icon: '🏆' }
    if (score >= 150) return { text: '优秀！', color: 'text-green-500', icon: '🌟' }
    if (score >= 100) return { text: '不错！', color: 'text-blue-500', icon: '👍' }
    if (score >= 50) return { text: '还行', color: 'text-orange-500', icon: '👌' }
    return { text: '继续努力！', color: 'text-gray-500', icon: '💪' }
  }

  const rating = getScoreRating(result.score)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-md mx-auto"
      >
        {/* Header */}
        <div className="space-y-4">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl"
          >
            {rating.icon}
          </motion.div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              游戏结束！
            </h1>
            {result.endReason === 'livesOut' && (
              <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 font-medium flex items-center justify-center gap-2">
                  <span className="text-xl">💥</span>
                  错误3次，游戏结束！
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  别灰心，继续练习会越来越好的！
                </p>
              </div>
            )}
            {result.endReason === 'timeUp' && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 font-medium flex items-center justify-center gap-2">
                  <span className="text-xl">⏰</span>
                  时间到！
                </p>
              </div>
            )}
            <p className={`text-xl font-semibold ${rating.color}`}>
              {rating.text}
            </p>
          </div>
        </div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card p-6 space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">最终得分</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {result.score}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">正确率</span>
              <span className="text-xl font-semibold text-success-600 dark:text-success-400">
                {result.accuracy}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">用时</span>
              <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {result.totalTime}s
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
              平均每题用时: {result.questionsAnswered && result.questionsAnswered > 0 ? (result.totalTime / result.questionsAnswered).toFixed(1) : 0}s
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={() => navigate('/game')}
            className="w-full btn btn-primary btn-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <RotateCcw className="w-6 h-6" />
            再来一局
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleShare}
              className="btn btn-secondary flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Share2 className="w-5 h-5" />
              分享
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              主页
            </button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Achievement Manager */}
      <AchievementManager 
        achievements={result.newAchievements || []}
        playSound={() => playSoundRef.current('achievement')}
      />
    </div>
  )
} 