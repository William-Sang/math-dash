import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/useToast'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

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
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -50, x: 50 }}
              className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-sm ${toastStyles[toast.type]}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{toast.title}</p>
                {toast.description && (
                  <p className="text-sm opacity-90">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
} 