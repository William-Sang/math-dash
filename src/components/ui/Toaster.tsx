import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useToast } from '@/hooks/useToast'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const toastStyles = {
  success: 'bg-success-50 text-success-800 border-success-200 dark:bg-success-900 dark:text-success-200 dark:border-success-700',
  error: 'bg-danger-50 text-danger-800 border-danger-200 dark:bg-danger-900 dark:text-danger-200 dark:border-danger-700',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
  info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
}

export function Toaster() {
  const { toasts, removeToast, clearAllToasts } = useToast()

  // 添加键盘事件监听，按 ESC 键清除所有通知
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && toasts.length > 0) {
        clearAllToasts()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toasts.length, clearAllToasts])

  // 在页面可见性变化时清理通知（PWA 支持）
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && toasts.length > 0) {
        // 当页面隐藏时，清除所有通知以避免堆积
        setTimeout(() => {
          if (document.hidden) {
            clearAllToasts()
          }
        }, 1000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [toasts.length, clearAllToasts])

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 max-w-sm w-full px-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => {
          const Icon = toastIcons[toast.type]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { delay: index * 0.1 }
              }}
              exit={{ 
                opacity: 0, 
                y: -50, 
                scale: 0.8,
                transition: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: -100, right: 100 }}
              onDragEnd={(_, info: PanInfo) => {
                // 如果拖拽距离超过阈值，移除通知
                if (Math.abs(info.offset.x) > 100) {
                  removeToast(toast.id)
                }
              }}
              whileDrag={{ scale: 1.05 }}
              className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg cursor-pointer select-none ${toastStyles[toast.type]}`}
              onClick={() => removeToast(toast.id)}
              style={{ touchAction: 'pan-x' }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{toast.title}</p>
                {toast.description && (
                  <p className="text-sm opacity-90 truncate">{toast.description}</p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeToast(toast.id)
                }}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1 rounded"
                aria-label="关闭通知"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
      
      {/* 如果有多个通知，显示清除所有按钮 */}
      {toasts.length > 1 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={clearAllToasts}
          className="w-full mt-2 py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
        >
          清除所有通知 ({toasts.length})
        </motion.button>
      )}
    </div>
  )
} 