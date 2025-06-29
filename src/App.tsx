import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomePage from '@/components/pages/HomePage'
import GamePage from '@/components/pages/GamePage'
import ResultPage from '@/components/pages/ResultPage'
import SettingsPage from '@/components/pages/SettingsPage'
import StatsPage from '@/components/pages/StatsPage'
import { useTheme } from '@/hooks/useTheme'
import { Toaster } from '@/components/ui/Toaster'

function App() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-4 safe-area">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
        <Toaster />
      </motion.div>
    </div>
  )
}

export default App 