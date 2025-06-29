import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Target, Clock, Zap } from 'lucide-react'

export default function StatsPage() {
  const navigate = useNavigate()

  // Mock data - in real app, this would come from localStorage or a data store
  const stats = {
    totalGames: 25,
    totalScore: 2450,
    bestScore: 180,
    averageScore: 98,
    totalTime: 1500, // in seconds
    averageTime: 60,
    accuracy: 85,
    streak: 12,
    achievements: [
      { name: '百分达人', description: '单局得分超过100分', unlocked: true },
      { name: '速算高手', description: '平均每题用时少于3秒', unlocked: true },
      { name: '数学大师', description: '单局得分超过200分', unlocked: false },
      { name: '连击王', description: '连续答对20题', unlocked: false },
    ]
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}分${remainingSeconds}秒`
  }

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary btn-sm flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          统计数据
        </h1>
      </div>

      {/* Stats Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto px-4 space-y-6"
      >
        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-4 text-center"
          >
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stats.totalGames}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              总游戏次数
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-4 text-center"
          >
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.bestScore}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              最高分
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card p-4 text-center"
          >
            <div className="text-2xl font-bold text-success-600 dark:text-success-400">
              {stats.accuracy}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              平均正确率
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.streak}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              最佳连击
            </div>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            详细统计
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">平均得分</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.averageScore}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">总游戏时间</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatTime(stats.totalTime)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">平均每局时间</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.averageTime}秒
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">总得分</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.totalScore.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            成就系统
          </h3>
          
          <div className="space-y-3">
            {stats.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  achievement.unlocked
                    ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-700'
                    : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    achievement.unlocked ? 'bg-success-500' : 'bg-gray-400'
                  }`}
                />
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      achievement.unlocked
                        ? 'text-success-800 dark:text-success-200'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {achievement.name}
                  </div>
                  <div
                    className={`text-sm ${
                      achievement.unlocked
                        ? 'text-success-600 dark:text-success-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-success-500 text-xl">✓</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            进步趋势
          </h3>
          
          <div className="h-32 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">图表功能即将推出</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 