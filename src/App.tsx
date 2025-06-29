import { Routes, Route } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import HomePage from '@/components/pages/HomePage'
import GamePage from '@/components/pages/GamePage'
import ResultPage from '@/components/pages/ResultPage'
import { LazyStatsPage, LazySettingsPage, LazyAudioTestPage, LazyLoad } from '@/components/ui/LazyLoad'
import { useTheme } from '@/hooks/useTheme'
import { Toaster } from '@/components/ui/Toaster'

function App() {
  const { theme } = useTheme()
  const [isInitialRenderComplete, setIsInitialRenderComplete] = useState(false)

  // 延迟启用非关键功能，确保关键内容先渲染
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialRenderComplete(true)
    }, 100) // 100ms 后启用完整功能
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div
        className="min-h-screen app-background safe-area"
      >
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="loading-spinner"></div></div>}>
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
        </Suspense>
        {isInitialRenderComplete && <Toaster />}
      </div>
    </div>
  )
}

export default App 