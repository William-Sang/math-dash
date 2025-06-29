import { lazy, Suspense, ComponentType } from 'react'

interface LazyLoadProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// 简单的加载组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
  </div>
)

// 懒加载包装器
export function LazyLoad({ children, fallback = <LoadingSpinner /> }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

// 创建懒加载组件的工具函数
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(importFn)
}

// 预加载的懒加载组件
export const LazyStatsPage = createLazyComponent(() => import('@/components/pages/StatsPage'))
export const LazySettingsPage = createLazyComponent(() => import('@/components/pages/SettingsPage'))
export const LazyAudioTestPage = createLazyComponent(() => import('@/components/pages/AudioTestPage')) 