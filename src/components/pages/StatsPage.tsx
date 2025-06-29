import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Target, Clock, Zap, Trophy, Calendar, BarChart3 } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart
} from 'recharts'
import { useAchievements } from '@/hooks/useAchievements'

export default function StatsPage() {
  const navigate = useNavigate()
  const { stats, achievements } = useAchievements()

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}分${remainingSeconds}秒`
  }

  // Prepare chart data
  const recentGamesData = stats.gameHistory.slice(-10).map((game, index) => ({
    game: `第${index + 1}局`,
    score: game.score,
    accuracy: game.accuracy,
    time: game.timeSpent
  }))

  const operatorData = [
    {
      name: '加法',
      correct: stats.operatorStats.addition.correct,
      total: stats.operatorStats.addition.total,
      accuracy: stats.operatorStats.addition.total > 0 
        ? Math.round((stats.operatorStats.addition.correct / stats.operatorStats.addition.total) * 100) 
        : 0
    },
    {
      name: '减法',
      correct: stats.operatorStats.subtraction.correct,
      total: stats.operatorStats.subtraction.total,
      accuracy: stats.operatorStats.subtraction.total > 0 
        ? Math.round((stats.operatorStats.subtraction.correct / stats.operatorStats.subtraction.total) * 100) 
        : 0
    },
    {
      name: '乘法',
      correct: stats.operatorStats.multiplication.correct,
      total: stats.operatorStats.multiplication.total,
      accuracy: stats.operatorStats.multiplication.total > 0 
        ? Math.round((stats.operatorStats.multiplication.correct / stats.operatorStats.multiplication.total) * 100) 
        : 0
    },
    {
      name: '除法',
      correct: stats.operatorStats.division.correct,
      total: stats.operatorStats.division.total,
      accuracy: stats.operatorStats.division.total > 0 
        ? Math.round((stats.operatorStats.division.correct / stats.operatorStats.division.total) * 100) 
        : 0
    }
  ]

  const achievementData = [
    { name: '已解锁', value: achievements.filter(a => a.unlocked).length, color: '#10b981' },
    { name: '未解锁', value: achievements.filter(a => !a.unlocked).length, color: '#6b7280' }
  ]

  const rarityData = achievements.reduce((acc, achievement) => {
    if (achievement.unlocked) {
      acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const rarityChartData = Object.entries(rarityData).map(([rarity, count]) => ({
    name: rarity === 'common' ? '普通' : rarity === 'rare' ? '稀有' : rarity === 'epic' ? '史诗' : '传奇',
    value: count,
    color: rarity === 'common' ? '#6b7280' : rarity === 'rare' ? '#3b82f6' : rarity === 'epic' ? '#7c3aed' : '#f59e0b'
  }))

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
        className="max-w-6xl mx-auto px-4 space-y-6"
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
              {stats.bestStreak}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              最佳连击
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Games Performance */}
          {recentGamesData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                近期游戏表现
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={recentGamesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="game" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                    name="得分"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Operator Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              运算符表现
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={operatorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#10b981" name="正确率 (%)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Accuracy Over Time */}
          {recentGamesData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                正确率趋势
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={recentGamesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="game" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="正确率 (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Achievement Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              成就进度
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={achievementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {achievementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            详细统计
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">平均得分</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.averageScore}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">总游戏时间</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatTime(stats.totalTime)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">完美游戏</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.perfectGames}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">连续天数</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.dailyStreak}天
              </span>
            </div>
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            成就系统
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.1 + index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                  achievement.unlocked
                    ? getRarityStyles(achievement.rarity).bg + ' ' + getRarityStyles(achievement.rarity).border
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-2xl">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      achievement.unlocked
                        ? getRarityStyles(achievement.rarity).text
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {achievement.name}
                  </div>
                  <div
                    className={`text-sm ${
                      achievement.unlocked
                        ? getRarityStyles(achievement.rarity).subtext
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {achievement.description}
                  </div>
                  {achievement.reward && achievement.unlocked && (
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      奖励: {achievement.reward.type === 'points' ? `${achievement.reward.value}积分` : achievement.reward.value}
                    </div>
                  )}
                </div>
                {achievement.unlocked && (
                  <div className={`text-xl ${getRarityStyles(achievement.rarity).text}`}>✓</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Helper function to get rarity-based styles
function getRarityStyles(rarity: string) {
  switch (rarity) {
    case 'common':
      return {
        bg: 'bg-gray-50 dark:bg-gray-800',
        border: 'border-gray-300 dark:border-gray-600',
        text: 'text-gray-800 dark:text-gray-200',
        subtext: 'text-gray-600 dark:text-gray-300'
      }
    case 'rare':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-300 dark:border-blue-700',
        text: 'text-blue-800 dark:text-blue-200',
        subtext: 'text-blue-600 dark:text-blue-300'
      }
    case 'epic':
      return {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-300 dark:border-purple-700',
        text: 'text-purple-800 dark:text-purple-200',
        subtext: 'text-purple-600 dark:text-purple-300'
      }
    case 'legendary':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-300 dark:border-yellow-700',
        text: 'text-yellow-800 dark:text-yellow-200',
        subtext: 'text-yellow-600 dark:text-yellow-300'
      }
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-800',
        border: 'border-gray-300 dark:border-gray-600',
        text: 'text-gray-800 dark:text-gray-200',
        subtext: 'text-gray-600 dark:text-gray-300'
      }
  }
} 