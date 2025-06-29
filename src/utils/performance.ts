// 性能监控工具

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private marks: Map<string, number> = new Map()
  private measures: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // 标记性能时间点
  mark(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name)
      this.marks.set(name, performance.now())
    }
  }

  // 测量两个时间点之间的性能
  measure(name: string, startMark: string, endMark?: string): number {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark)
        } else {
          performance.measure(name, startMark)
        }
        
        const entries = performance.getEntriesByName(name, 'measure')
        if (entries.length > 0) {
          const duration = entries[entries.length - 1].duration
          this.measures.set(name, duration)
          return duration
        }
      } catch (error) {
        console.warn('Performance measurement failed:', error)
      }
    }
    return 0
  }

  // 获取页面加载性能指标
  getPageLoadMetrics(): any {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      return null
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return null

    return {
      // 页面加载时间
      pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      // DOM内容加载时间
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      // 首次内容绘制
      firstContentfulPaint: this.getFirstContentfulPaint(),
      // 最大内容绘制
      largestContentfulPaint: this.getLargestContentfulPaint(),
      // 累积布局偏移
      cumulativeLayoutShift: this.getCumulativeLayoutShift(),
      // 首次输入延迟
      firstInputDelay: this.getFirstInputDelay()
    }
  }

  private getFirstContentfulPaint(): number {
    const entries = performance.getEntriesByName('first-contentful-paint')
    return entries.length > 0 ? entries[0].startTime : 0
  }

  private getLargestContentfulPaint(): number {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        
        // 超时处理
        setTimeout(() => resolve(0), 5000)
      } else {
        resolve(0)
      }
    }) as any
  }

  private getCumulativeLayoutShift(): number {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
        })
        observer.observe({ entryTypes: ['layout-shift'] })
        
        // 5秒后返回结果
        setTimeout(() => {
          observer.disconnect()
          resolve(clsValue)
        }, 5000)
      } else {
        resolve(0)
      }
    }) as any
  }

  private getFirstInputDelay(): number {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const firstInput = entries[0]
          if (firstInput) {
            const fid = (firstInput as any).processingStart - firstInput.startTime
            resolve(fid)
          }
        })
        observer.observe({ entryTypes: ['first-input'] })
        
        // 超时处理
        setTimeout(() => resolve(0), 10000)
      } else {
        resolve(0)
      }
    }) as any
  }

  // 内存使用情况
  getMemoryUsage(): any {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(2)
      }
    }
    return null
  }

  // 生成性能报告
  generateReport(): any {
    return {
      marks: Object.fromEntries(this.marks),
      measures: Object.fromEntries(this.measures),
      pageLoad: this.getPageLoadMetrics(),
      memory: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    }
  }

  // 清除性能数据
  clear(): void {
    this.marks.clear()
    this.measures.clear()
    if (typeof performance !== 'undefined' && performance.clearMarks) {
      performance.clearMarks()
      performance.clearMeasures()
    }
  }
}

// 便捷函数
export const perf = PerformanceMonitor.getInstance()

// React Hook for performance monitoring
export function usePerformanceMonitoring() {
  const mark = (name: string) => perf.mark(name)
  const measure = (name: string, startMark: string, endMark?: string) => 
    perf.measure(name, startMark, endMark)
  const getReport = () => perf.generateReport()
  
  return { mark, measure, getReport }
} 