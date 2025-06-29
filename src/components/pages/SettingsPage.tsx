import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Volume2, VolumeX, Moon, Sun, Trash2 } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useToast } from '@/hooks/useToast'
import { useState } from 'react'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()
  const [soundEnabled, setSoundEnabled] = useState(true)

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
      localStorage.clear()
      toast.success('数据已清除')
    }
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
          设置
        </h1>
      </div>

      {/* Settings Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto px-4 space-y-6"
      >
        {/* Theme Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            外观设置
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  深色模式
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {theme === 'dark' ? '已开启' : '已关闭'}
                </div>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sound Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            音效设置
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-green-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  游戏音效
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {soundEnabled ? '已开启' : '已关闭'}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundEnabled ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Game Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            游戏设置
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                游戏时长
              </label>
              <select className="input">
                <option value="30">30秒</option>
                <option value="60" selected>60秒</option>
                <option value="90">90秒</option>
                <option value="120">120秒</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                难度等级
              </label>
              <select className="input">
                <option value="easy">简单</option>
                <option value="medium" selected>中等</option>
                <option value="hard">困难</option>
                <option value="expert">专家</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            数据管理
          </h3>
          
          <button
            onClick={handleClearData}
            className="w-full btn btn-danger flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            清除所有数据
          </button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            这将删除所有游戏记录和设置
          </p>
        </div>

        {/* App Info */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            关于应用
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>版本</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>开发者</span>
              <span>Math Dash Team</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 