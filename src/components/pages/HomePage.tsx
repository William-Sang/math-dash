import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Play, Settings, BarChart3, Moon, Sun, Edit3, CheckSquare, X } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { usePersonalization } from '@/hooks/usePersonalization'
import { useAchievements } from '@/hooks/useAchievements'
import { useState, useEffect } from 'react'
import { PageContainer, AnimatedCard, fadeInPreset } from '@/components/ui/OptimizedMotion'

export default function HomePage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { getCurrentAvatar, getCurrentTitle } = usePersonalization()
  const { stats, updateDailyStreak } = useAchievements()
  const [selectedQuestionType, setSelectedQuestionType] = useState<'input' | 'multiple-choice'>('multiple-choice')
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false)
  const [enableAnimations, setEnableAnimations] = useState(false)
  
  // 延迟启用动画，确保关键内容先渲染
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableAnimations(true)
    }, 300) // 300ms 后启用动画
    
    return () => clearTimeout(timer)
  }, [])
  
  // Update daily streak when visiting home page
  useEffect(() => {
    // 使用 requestIdleCallback 延迟非关键操作
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        updateDailyStreak()
      })
    } else {
      setTimeout(() => {
        updateDailyStreak()
      }, 100)
    }
  }, [updateDailyStreak])
  
  const currentAvatar = getCurrentAvatar()
  const currentTitle = getCurrentTitle()

  const handleStartGame = () => {
    setShowQuestionTypeModal(true)
  }

  const handleConfirmStart = () => {
    setShowQuestionTypeModal(false)
    navigate('/game', { state: { questionType: selectedQuestionType } })
  }

  const handleCloseModal = () => {
    setShowQuestionTypeModal(false)
  }

  return (
    <PageContainer enableAnimations={enableAnimations}>
      {/* Header */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {theme === 'light' ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Sun className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="main-container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div
          {...(enableAnimations ? fadeInPreset : { initial: {}, animate: {}, transition: {} })}
          className="text-center space-y-8 w-full max-w-md mx-auto"
        >
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              ±
            </div>
            
            {/* User Info */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-3xl">{currentAvatar.icon}</div>
              <div className="text-left">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentTitle.name !== '无称号' ? currentTitle.name : '数学挑战者'}
                </div>
              </div>
            </div>
            
            <h1 className="main-title text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Math Dash Mania
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              数学冲刺狂
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              锻炼你的心算能力，挑战你的极限！
            </p>
          </div>

        {/* Main Menu */}
        <div className="space-y-4 w-full">
          <button
            onClick={handleStartGame}
            className="w-full btn btn-primary btn-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Play className="w-6 h-6" />
            开始游戏
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/stats')}
              className="btn btn-secondary flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <BarChart3 className="w-5 h-5" />
              统计
            </button>
            
            <button
              onClick={() => navigate('/settings')}
              className="btn btn-secondary flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              设置
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <AnimatedCard enableAnimations={enableAnimations} className="p-6 w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            总体数据
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-500">{stats.totalGames}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">游戏次数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success-500">{stats.accuracy}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">正确率</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{stats.bestScore}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">最高分</div>
            </div>
          </div>
          
          {stats.dailyStreak > 0 && (
            <div className="mt-4 pt-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-orange-500">🔥</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  连续学习 {stats.dailyStreak} 天
                </span>
              </div>
            </div>
          )}
        </AnimatedCard>
      </motion.div>

      {/* Question Type Selection Modal */}
      <AnimatePresence>
        {showQuestionTypeModal && (
          <motion.div
            initial={enableAnimations ? { opacity: 0 } : {}}
            animate={enableAnimations ? { opacity: 1 } : {}}
            exit={enableAnimations ? { opacity: 0 } : {}}
            transition={enableAnimations ? { duration: 0.2 } : {}}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={enableAnimations ? { scale: 0.9, opacity: 0 } : {}}
              animate={enableAnimations ? { scale: 1, opacity: 1 } : {}}
              exit={enableAnimations ? { scale: 0.9, opacity: 0 } : {}}
              transition={enableAnimations ? { duration: 0.2 } : {}}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  选择题目类型
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Question Type Options */}
              <div className="space-y-3 mb-6">
                {/* Multiple Choice Option */}
                <button
                  onClick={() => setSelectedQuestionType('multiple-choice')}
                  className={`w-full p-4 rounded-lg transition-all duration-200 text-left ${
                    selectedQuestionType === 'multiple-choice'
                      ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      selectedQuestionType === 'multiple-choice'
                        ? 'bg-primary-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {selectedQuestionType === 'multiple-choice' && (
                        <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900"></div>
                      )}
                    </div>
                    <CheckSquare className="w-5 h-5 text-primary-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">选择题</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">从4个选项中选择答案</div>
                    </div>
                  </div>
                </button>

                {/* Input Type Option */}
                <button
                  onClick={() => setSelectedQuestionType('input')}
                  className={`w-full p-4 rounded-lg transition-all duration-200 text-left ${
                    selectedQuestionType === 'input'
                      ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      selectedQuestionType === 'input'
                        ? 'bg-primary-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {selectedQuestionType === 'input' && (
                        <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-900"></div>
                      )}
                    </div>
                    <Edit3 className="w-5 h-5 text-primary-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">输入答案</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">自己输入数字答案</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 btn btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmStart}
                  className="flex-1 btn btn-primary"
                >
                  开始游戏
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </PageContainer>
  )
} 