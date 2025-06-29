import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Play, Settings, BarChart3, Moon, Sun, Edit3, CheckSquare, X } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useState } from 'react'

export default function HomePage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [selectedQuestionType, setSelectedQuestionType] = useState<'input' | 'multiple-choice'>('multiple-choice')
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false)

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
    <div className="min-h-screen flex flex-col items-center justify-center py-8">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        {/* Logo & Title */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl"
          >
            ±
          </motion.div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Math Dash Mania
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              数学冲刺狂
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              锻炼你的心算能力，挑战你的极限！
            </p>
          </div>
        </div>

        {/* Main Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4 w-full max-w-xs mx-auto"
        >
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
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card p-6 max-w-md mx-auto"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            今日数据
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-500">0</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">游戏次数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success-500">0%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">正确率</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">0</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">最高分</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Question Type Selection Modal */}
      <AnimatePresence>
        {showQuestionTypeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 w-full max-w-md mx-auto"
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
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedQuestionType === 'multiple-choice'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedQuestionType === 'multiple-choice'
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedQuestionType === 'multiple-choice' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
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
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedQuestionType === 'input'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedQuestionType === 'input'
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedQuestionType === 'input' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
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
  )
} 