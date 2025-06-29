import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomePage from '@/components/pages/HomePage'
import GamePage from '@/components/pages/GamePage'
import ResultPage from '@/components/pages/ResultPage'
import { LazyStatsPage, LazySettingsPage, LazyAudioTestPage, LazyLoad } from '@/components/ui/LazyLoad'
import { useTheme } from '@/hooks/useTheme'
import { Toaster } from '@/components/ui/Toaster'

function App() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 safe-area"
        style={{ willChange: 'opacity' }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/stats" element={
            <LazyLoad>
              <LazyStatsPage />
            </LazyLoad>
          } />
          <Route path="/settings" element={
            <LazyLoad>
              <LazySettingsPage />
            </LazyLoad>
          } />
          <Route path="/audio-test" element={
            <LazyLoad>
              <LazyAudioTestPage />
            </LazyLoad>
          } />
        </Routes>
        <Toaster />
      </motion.div>
    </div>
  )
}

export default App 