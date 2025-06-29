import { create } from 'zustand'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  timeoutId?: NodeJS.Timeout
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id' | 'timeoutId'>) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { ...toast, id }
    
    // 限制最大通知数量，避免堆积
    const currentToasts = get().toasts
    if (currentToasts.length >= 5) {
      // 移除最旧的通知
      const oldestToast = currentToasts[0]
      get().removeToast(oldestToast.id)
    }
    
    // 检查是否有相同标题的通知，避免重复
    const existingToast = currentToasts.find(t => t.title === toast.title)
    if (existingToast) {
      get().removeToast(existingToast.id)
    }
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Auto remove after duration
    const duration = toast.duration || 4000 // 增加到4秒，给用户更多时间阅读
    const timeoutId = setTimeout(() => {
      const currentState = get()
      // 确保 toast 还存在才移除
      if (currentState.toasts.find(t => t.id === id)) {
        currentState.removeToast(id)
      }
    }, duration)
    
    // 存储 timeout ID 以便在需要时清除
    newToast.timeoutId = timeoutId
  },
  removeToast: (id) => {
    const toast = get().toasts.find(t => t.id === id)
    if (toast && toast.timeoutId) {
      clearTimeout(toast.timeoutId)
    }
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },
  clearAllToasts: () => {
    const toasts = get().toasts
    toasts.forEach(toast => {
      if (toast.timeoutId) {
        clearTimeout(toast.timeoutId)
      }
    })
    set({ toasts: [] })
  }
}))

export const useToast = () => {
  const { toasts, addToast, removeToast, clearAllToasts } = useToastStore()
  
  const toastMethods = {
    success: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'success', title, description, duration }),
    error: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'error', title, description, duration }),
    warning: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'warning', title, description, duration }),
    info: (title: string, description?: string, duration?: number) =>
      addToast({ type: 'info', title, description, duration }),
  }
  
  return { toasts, addToast, removeToast, clearAllToasts, toast: toastMethods }
} 