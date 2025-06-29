import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Volume2, VolumeX, Moon, Sun, Trash2, Music, User, Palette, Crown, Sliders } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAudio } from '@/hooks/useAudio'
import { usePersonalization } from '@/hooks/usePersonalization'
import { useAchievements } from '@/hooks/useAchievements'
import { useToast } from '@/hooks/useToast'
import { useGameSettings } from '@/hooks/useGameSettings'
import { useState } from 'react'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { toast } = useToast()
  const { resetStats } = useAchievements()
  
  // Game settings
  const { settings, setGameDuration, setDifficulty, resetSettings } = useGameSettings()
  
  // Audio settings
  const {
    soundEnabled,
    musicEnabled,
    soundVolume,
    musicVolume,
    setSoundEnabled,
    setMusicEnabled,
    setSoundVolume,
    setMusicVolume,
    playSound
  } = useAudio()

  // Personalization settings
  const {
    selectedAvatar,
    selectedTheme,
    selectedTitle,
    setAvatar,
    setTheme,
    setTitle,
    getUnlockedAvatars,
    getUnlockedThemes,
    getUnlockedTitles,
    getCurrentAvatar,
    getCurrentTitle
  } = usePersonalization()

  const [activeTab, setActiveTab] = useState<'general' | 'audio' | 'personalization'>('general')

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
      localStorage.clear()
      resetStats()
      resetSettings()
      toast.success('数据已清除')
    }
  }

  const handleSoundTest = () => {
    playSound('click')
  }

  const handleVolumeChange = (type: 'sound' | 'music', value: number) => {
    if (type === 'sound') {
      setSoundVolume(value / 100)
      playSound('click') // Test sound
    } else {
      setMusicVolume(value / 100)
    }
  }

  const unlockedAvatars = getUnlockedAvatars()
  const unlockedThemes = getUnlockedThemes()
  const unlockedTitles = getUnlockedTitles()
  const currentAvatar = getCurrentAvatar()
  const currentTitle = getCurrentTitle()

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
        className="max-w-4xl mx-auto px-4 space-y-6"
      >
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{currentAvatar.icon}</div>
            <div className="flex-1">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {currentTitle.name !== '无称号' ? currentTitle.name : '数学挑战者'}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {currentAvatar.name} • 当前主题: {unlockedThemes.find(t => t.id === selectedTheme)?.name}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: 'general', name: '通用', icon: Sliders },
            { id: 'audio', name: '音频', icon: Volume2 },
            { id: 'personalization', name: '个性化', icon: Palette }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
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
                  <select 
                    className="input"
                    value={settings.gameDuration}
                    onChange={(e) => setGameDuration(parseInt(e.target.value))}
                  >
                    <option value="30">30秒</option>
                    <option value="60">60秒</option>
                    <option value="90">90秒</option>
                    <option value="120">120秒</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    难度等级
                  </label>
                  <select 
                    className="input"
                    value={settings.difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard' | 'expert')}
                  >
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
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
                这将删除所有游戏记录、成就和设置
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'audio' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Sound Effects */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                音效设置
              </h3>
              
              <div className="space-y-4">
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

                {soundEnabled && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        音效音量
                      </label>
                      <button
                        onClick={handleSoundTest}
                        className="btn btn-secondary btn-sm"
                      >
                        测试音效
                      </button>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundVolume * 100}
                      onChange={(e) => handleVolumeChange('sound', parseInt(e.target.value))}
                      className="w-full accent-primary-500"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      {Math.round(soundVolume * 100)}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Background Music */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                背景音乐
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Music className={`w-5 h-5 ${musicEnabled ? 'text-green-500' : 'text-gray-500'}`} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        背景音乐
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {musicEnabled ? '已开启' : '已关闭'}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      musicEnabled ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        musicEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {musicEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      音乐音量
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={musicVolume * 100}
                      onChange={(e) => handleVolumeChange('music', parseInt(e.target.value))}
                      className="w-full accent-primary-500"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      {Math.round(musicVolume * 100)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'personalization' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Avatar Selection */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                选择头像
              </h3>
              
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {unlockedAvatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setAvatar(avatar.id)}
                    className={`p-3 rounded-lg text-2xl transition-all hover:scale-105 ${
                      selectedAvatar === avatar.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title={avatar.name}
                  >
                    {avatar.icon}
                  </button>
                ))}
              </div>
              
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                已解锁 {unlockedAvatars.length} 个头像
              </div>
            </div>

            {/* Theme Selection */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Palette className="w-5 h-5" />
                选择主题
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unlockedThemes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                      selectedTheme === themeOption.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: themeOption.colors.primary }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {themeOption.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        themeOption.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        themeOption.rarity === 'epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                        themeOption.rarity === 'rare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                      }`}>
                        {themeOption.rarity === 'legendary' ? '传奇' : 
                         themeOption.rarity === 'epic' ? '史诗' :
                         themeOption.rarity === 'rare' ? '稀有' : '普通'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {Object.values(themeOption.colors).slice(0, 5).map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                已解锁 {unlockedThemes.length} 个主题
              </div>
            </div>

            {/* Title Selection */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Crown className="w-5 h-5" />
                选择称号
              </h3>
              
              <div className="space-y-2">
                {unlockedTitles.map((title) => (
                  <button
                    key={title.id}
                    onClick={() => setTitle(title.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedTitle === title.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent'
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {title.name}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                已解锁 {unlockedTitles.length} 个称号
              </div>
            </div>
          </motion.div>
        )}

        {/* App Info */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            关于应用
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>版本</span>
              <span>2.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>开发者</span>
              <span>Math Dash Team</span>
            </div>
            <div className="flex justify-between">
              <span>新功能</span>
              <span>统计图表 • 音效系统 • 个性化定制</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 