import { useState, useEffect, useRef } from 'react'
import AchievementNotification from './AchievementNotification'

// 成就通知组件只需要这些属性，不需要condition函数
interface AchievementDisplay {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
  reward?: {
    type: 'points' | 'theme' | 'avatar' | 'title'
    value: string | number
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface AchievementManagerProps {
  achievements: AchievementDisplay[]
  playSound?: () => void
}

export default function AchievementManager({ achievements, playSound }: AchievementManagerProps) {
  const [visibleAchievements, setVisibleAchievements] = useState<AchievementDisplay[]>([])
  const processedRef = useRef(new Set<string>())
  const soundPlayedRef = useRef(new Set<string>())

  useEffect(() => {
    if (achievements.length === 0) return

    // 找出未处理的成就
    const newAchievements = achievements.filter(achievement => 
      !processedRef.current.has(achievement.id)
    )

    if (newAchievements.length === 0) return

    // 标记为已处理
    newAchievements.forEach(achievement => {
      processedRef.current.add(achievement.id)
    })

    // 依次显示新成就
    newAchievements.forEach((achievement, index) => {
      setTimeout(() => {
        setVisibleAchievements(prev => [...prev, achievement])
        
        // 播放音效（每个成就一次）
        if (playSound && !soundPlayedRef.current.has(achievement.id)) {
          soundPlayedRef.current.add(achievement.id)
          playSound()
        }
      }, index * 500) // 每个成就间隔0.5秒显示
    })
  }, [achievements, playSound])

  const handleCloseAchievement = (achievementId: string) => {
    setVisibleAchievements(prev => 
      prev.filter(achievement => achievement.id !== achievementId)
    )
  }

  return (
    <>
      {visibleAchievements.map((achievement, index) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => handleCloseAchievement(achievement.id)}
          index={index}
        />
      ))}
    </>
  )
} 