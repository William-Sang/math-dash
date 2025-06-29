import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface OptimizedMotionProps extends MotionProps {
  children: ReactNode
  enableAnimations?: boolean
  fallbackClassName?: string
}

// 简化的动画预设
export const fadeInPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 }
}

export const slideUpPreset = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

export const scalePreset = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2 }
}

// 性能优化的Motion组件
export function OptimizedMotion({ 
  children, 
  enableAnimations = true, 
  fallbackClassName = '',
  ...props 
}: OptimizedMotionProps) {
  // 在性能敏感的情况下可以禁用动画
  if (!enableAnimations) {
    return <div className={fallbackClassName}>{children}</div>
  }

  return (
    <motion.div
      {...props}
      // 启用硬件加速
      style={{ 
        willChange: 'transform, opacity',
        ...props.style 
      }}
    >
      {children}
    </motion.div>
  )
}

// 简化的页面容器
export function PageContainer({ 
  children, 
  enableAnimations = true 
}: { 
  children: ReactNode
  enableAnimations?: boolean 
}) {
  const containerClasses = "min-h-screen py-12 px-6 relative"
  
  if (!enableAnimations) {
    return <div className={containerClasses}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={containerClasses}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </motion.div>
  )
}

// 简化的卡片动画
export function AnimatedCard({ 
  children, 
  delay = 0,
  enableAnimations = true,
  className = ''
}: { 
  children: ReactNode
  delay?: number
  enableAnimations?: boolean
  className?: string
}) {
  const cardClasses = "bg-white dark:bg-gray-800 rounded-xl shadow-lg"
  
  if (!enableAnimations) {
    return <div className={`${cardClasses} ${className}`}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className={`${cardClasses} ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
} 