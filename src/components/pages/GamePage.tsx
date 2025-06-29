import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Pause, Home, Timer, Zap, Heart } from 'lucide-react'
import { useAudio } from '@/hooks/useAudio'
import { useAchievements, Achievement } from '@/hooks/useAchievements'
import { useToast } from '@/hooks/useToast'
import { useGameSettings } from '@/hooks/useGameSettings'
import ErrorBoundary from '@/components/ErrorBoundary'
import { PageContainer } from '@/components/ui/OptimizedMotion'

interface Question {
  num1: number
  num2: number
  operator: string
  type: 'input' | 'multiple-choice'
  options?: number[]
}

interface LocationState {
  questionType?: 'input' | 'multiple-choice'
}

export default function GamePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState
  const selectedQuestionType = state?.questionType || 'multiple-choice'
  
  // Hooks
  const { playSound, playBackgroundMusic, stopBackgroundMusic, soundEnabled, setSoundEnabled, musicEnabled, setMusicEnabled } = useAudio()
  const { updateStats, checkAchievements } = useAchievements()
  const { toast } = useToast()
  const { settings } = useGameSettings()
  
  // Game state
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(settings.gameDuration)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const gameInitialized = useRef(false)
  const handleGameEndRef = useRef<(() => void) | null>(null)
  const gameEndedRef = useRef(false) // 防止重复调用游戏结束
  const [question, setQuestion] = useState<Question>({ 
    num1: 5, 
    num2: 3, 
    operator: '+', 
    type: selectedQuestionType, 
    options: selectedQuestionType === 'multiple-choice' ? [5, 6, 7, 8] : undefined 
  })
  const [answer, setAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isGameActive, setIsGameActive] = useState(true)
  const [gameStartTime] = useState(Date.now())
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [perfectAnswers, setPerfectAnswers] = useState(0)
  const isGeneratingQuestion = useRef(false)
  const achievementTimers = useRef<NodeJS.Timeout[]>([])
  const gameTimers = useRef<NodeJS.Timeout[]>([])

  // Safe delay execution that cleans up on unmount
  const safeDelay = useCallback((callback: () => void, delay: number) => {
    const timerId = setTimeout(callback, delay)
    gameTimers.current.push(timerId)
    return timerId
  }, [])

  // Calculate correct answer
  const correctAnswer = useMemo(() => {
    switch (question.operator) {
      case '+': return question.num1 + question.num2
      case '-': return question.num1 - question.num2
      case '×': return question.num1 * question.num2
      case '÷': return question.num1 / question.num2
      default: return 0
    }
  }, [question.num1, question.num2, question.operator])

  // Generate random number within range
  const getRandomNumber = useCallback((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }, [])

  // Get operator type for stats
  const getOperatorType = useCallback((operator: string) => {
    switch (operator) {
      case '+': return 'addition'
      case '-': return 'subtraction'
      case '×': return 'multiplication'
      case '÷': return 'division'
      default: return 'addition'
    }
  }, [])

  // Generate question based on difficulty
  const generateQuestion = useCallback(() => {
    if (isGeneratingQuestion.current) return
    isGeneratingQuestion.current = true

    try {
      let num1: number, num2: number, operator: string
      
      const operators = ['+', '-', '×', '÷']
      const difficultySettings = {
        easy: { min: 1, max: 10, allowDivision: false },
        medium: { min: 1, max: 50, allowDivision: true },
        hard: { min: 10, max: 100, allowDivision: true },
        expert: { min: 50, max: 200, allowDivision: true }
      }
      
      const config = difficultySettings[settings.difficulty as keyof typeof difficultySettings] || difficultySettings.medium
      
      do {
        operator = operators[Math.floor(Math.random() * (config.allowDivision ? 4 : 3))]
        
        if (operator === '÷') {
          // For division, ensure clean division
          const divisor = getRandomNumber(2, Math.min(config.max / 2, 20))
          const quotient = getRandomNumber(config.min, Math.floor(config.max / divisor))
          num1 = divisor * quotient
          num2 = divisor
        } else {
          num1 = getRandomNumber(config.min, config.max)
          num2 = getRandomNumber(config.min, config.max)
          
          // Ensure subtraction doesn't result in negative numbers
          if (operator === '-' && num2 > num1) {
            [num1, num2] = [num2, num1]
          }
        }
      } while (num1 === 0 || num2 === 0)

      const correctAnswer = (() => {
        switch (operator) {
          case '+': return num1 + num2
          case '-': return num1 - num2
          case '×': return num1 * num2
          case '÷': return num1 / num2
          default: return 0
        }
      })()

      let options: number[] | undefined
      if (selectedQuestionType === 'multiple-choice') {
        options = [correctAnswer]
        
        // Generate 3 wrong answers
        while (options.length < 4) {
          const wrongAnswer = correctAnswer + getRandomNumber(-10, 10)
          if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer) && wrongAnswer > 0) {
            options.push(wrongAnswer)
          }
        }
        
        // Shuffle options
        options = options.sort(() => Math.random() - 0.5)
      }

      setQuestion({
        num1,
        num2,
        operator,
        type: selectedQuestionType,
        options
      })
      
      // Reset input states
      setAnswer('')
      setSelectedOption(null)
    } catch (error) {
      console.error('Error generating question:', error)
    } finally {
      isGeneratingQuestion.current = false
    }
  }, [settings.difficulty, selectedQuestionType, getRandomNumber])

  const handleGameEnd = useCallback(() => {
    // 防止重复调用
    if (gameEndedRef.current) {
      return
    }
    gameEndedRef.current = true
    
    setIsGameActive(false)
    stopBackgroundMusic()
    playSound('gameEnd')
    
    // Calculate game statistics
    const gameTimeSpent = Math.round((Date.now() - gameStartTime) / 1000)
    const finalAccuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0
    
    // Update achievements and statistics
    const sessionData = {
      score,
      accuracy: finalAccuracy,
      timeSpent: gameTimeSpent,
      questionsAnswered,
      perfectAnswers,
      streak
    }
    
    updateStats(sessionData)
    const newAchievements = checkAchievements()
    
    // Show achievement notifications with delay to avoid overwhelming
    if (newAchievements.length > 0) {
      if (newAchievements.length === 1) {
        // Single achievement
        playSound('achievement')
        toast.success(`🎉 解锁成就: ${newAchievements[0].name}`, undefined, 5000)
      } else {
        // Multiple achievements - show summary first
        playSound('achievement')
        toast.success(`🎉 解锁了 ${newAchievements.length} 个成就！`, '点击查看详情', 6000)
        
        // Then show individual achievements with delay
        newAchievements.forEach((achievement: Achievement, index: number) => {
          const timerId = setTimeout(() => {
            toast.info(`${achievement.icon} ${achievement.name}`, achievement.description, 4000)
          }, (index + 1) * 1500) // 1.5秒间隔
          achievementTimers.current.push(timerId)
        })
      }
    }
    
    navigate('/result', { 
      state: { 
        score, 
        totalTime: gameTimeSpent,
        accuracy: finalAccuracy,
        questionsAnswered,
        streak,
        newAchievements: newAchievements.length
      } 
    })
  }, [navigate, score, gameStartTime, questionsAnswered, correctAnswers, perfectAnswers, streak, updateStats, checkAchievements, stopBackgroundMusic, playSound, toast])

  // Update the ref whenever handleGameEnd changes
  useEffect(() => {
    handleGameEndRef.current = handleGameEnd
  }, [handleGameEnd])

  const handleSubmit = useCallback(() => {
    try {
      let userAnswer: number
      
      if (question.type === 'input') {
        userAnswer = parseInt(answer)
        if (isNaN(userAnswer)) {
          toast.error('请输入有效的数字')
          return
        }
      } else {
        userAnswer = selectedOption || 0
      }
      
      const isCorrect = userAnswer === correctAnswer
      const operatorType = getOperatorType(question.operator)
      
      // Update statistics
      setQuestionsAnswered(prev => prev + 1)
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1)
        setPerfectAnswers(prev => prev + 1)
      }
      
      // Update operator-specific stats
      updateStats({
        operatorType: operatorType as any,
        isCorrect
      })
      
      if (isCorrect) {
        const points = 10 + (streak * 2)
        setScore(prevScore => prevScore + points)
        setStreak(prevStreak => prevStreak + 1)
        playSound('correct')
        
        // Show streak bonuses
        if (streak > 0 && (streak + 1) % 5 === 0) {
          toast.success(`🔥 ${streak + 1}连击! 奖励分数!`)
        }
        
        // Generate new question after a short delay
        safeDelay(() => generateQuestion(), 100)
      } else {
        setLives(prevLives => prevLives - 1)
        setStreak(0)
        playSound('incorrect')
        
        if (lives <= 1) {
          if (handleGameEndRef.current) {
            handleGameEndRef.current()
          }
        } else {
          // Generate new question after a short delay
          safeDelay(() => generateQuestion(), 100)
        }
      }
    } catch (error) {
      console.error('处理答案时出错:', error)
      toast.error('处理答案时出现错误')
    }
  }, [question.type, answer, selectedOption, correctAnswer, getOperatorType, updateStats, streak, lives, playSound, toast, generateQuestion, safeDelay])

  const handleOptionClick = useCallback((option: number) => {
    try {
      if (selectedOption !== null || !isGameActive) return
      
      setSelectedOption(option)
      
      // Delay to show visual feedback
      safeDelay(() => {
        try {
          const isCorrect = option === correctAnswer
          const operatorType = getOperatorType(question.operator)
          
          // Update statistics
          setQuestionsAnswered(prev => prev + 1)
          if (isCorrect) {
            setCorrectAnswers(prev => prev + 1)
            setPerfectAnswers(prev => prev + 1)
          }
          
          // Update operator-specific stats
          updateStats({
            operatorType: operatorType as any,
            isCorrect
          })
          
          if (isCorrect) {
            const points = 10 + (streak * 2)
            setScore(prevScore => prevScore + points)
            setStreak(prevStreak => prevStreak + 1)
            playSound('correct')
            
            // Show streak bonuses
            if (streak > 0 && (streak + 1) % 5 === 0) {
              toast.success(`🔥 ${streak + 1}连击! 奖励分数!`)
            }
            
            // Generate new question
            generateQuestion()
          } else {
            setLives(prevLives => prevLives - 1)
            setStreak(0)
            playSound('incorrect')
            
            if (lives <= 1) {
              if (handleGameEndRef.current) {
                handleGameEndRef.current()
              }
            } else {
              // Generate new question
              generateQuestion()
            }
          }
        } catch (error) {
          console.error('处理选项点击时出错:', error)
          toast.error('处理答案时出现错误')
        }
      }, 300) // Slightly longer delay to show visual feedback
    } catch (error) {
      console.error('选项点击出错:', error)
      toast.error('选择答案时出现错误')
    }
  }, [correctAnswer, streak, lives, getOperatorType, updateStats, playSound, toast, question.operator, generateQuestion, safeDelay])

  // Game initialization and cleanup
  useEffect(() => {
    if (!gameInitialized.current) {
      gameInitialized.current = true
      // Use refs to avoid dependency issues
      const audioManager = {
        playSound: (soundName: string) => {
          try {
            playSound(soundName as any)
          } catch (error) {
            console.error('Error playing sound:', error)
          }
        },
        playBackgroundMusic: () => {
          try {
            playBackgroundMusic()
          } catch (error) {
            console.error('Error playing background music:', error)
          }
        }
      }
      
      audioManager.playSound('gameStart')
      audioManager.playBackgroundMusic()
      
      // Generate initial question safely
      if (!isGeneratingQuestion.current) {
        generateQuestion()
      }
    }
    
    return () => {
      try {
        stopBackgroundMusic()
      } catch (error) {
        console.error('Error stopping background music:', error)
      }
      // Clear all timers
      achievementTimers.current.forEach(timerId => clearTimeout(timerId))
      achievementTimers.current = []
      gameTimers.current.forEach(timerId => clearTimeout(timerId))
      gameTimers.current = []
    }
  }, []) // Empty dependency array - this should only run once on mount

  // Timer countdown
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (handleGameEndRef.current) {
            handleGameEndRef.current()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameActive, timeLeft])

  // 移除重复的游戏结束触发器，避免双重调用
  // 游戏结束已经在定时器内部处理，这里不需要重复处理

  // Game pause/resume
  const togglePause = () => {
    setIsGameActive(!isGameActive)
    playSound('click')
    if (!isGameActive) {
      playBackgroundMusic()
    } else {
      stopBackgroundMusic()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && question.type === 'input') {
      handleSubmit()
    }
  }

  const canSubmit = question.type === 'input' ? answer : selectedOption !== null

  return (
    <ErrorBoundary>
      <PageContainer enableAnimations={false}>
      {/* Header */}
      <div className="flex justify-between items-center px-4 mb-8">
        <button
          onClick={() => {
            stopBackgroundMusic()
            navigate('/')
          }}
          className="btn btn-secondary btn-sm flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          主页
        </button>
        
        {/* Audio Controls */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            音效
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={musicEnabled}
              onChange={(e) => setMusicEnabled(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            音乐
          </label>
        </div>
        
        <button
          onClick={togglePause}
          className="btn btn-secondary btn-sm flex items-center gap-2"
        >
          <Pause className="w-4 h-4" />
          {isGameActive ? '暂停' : '继续'}
        </button>
      </div>

      {/* Game Stats */}
      <div className="flex justify-between items-center px-4 mb-8">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Timer className="w-5 h-5" />
          <span className="font-bold text-lg">{timeLeft}s</span>
        </div>
        
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <Zap className="w-5 h-5" />
          <span className="font-bold text-lg">{streak}</span>
          {streak >= 5 && <span className="text-sm">🔥</span>}
        </div>
        
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <Heart className="w-5 h-5" />
          <span className="font-bold text-lg">{lives}</span>
        </div>
      </div>

      {/* Score */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
          {score}
        </div>
        <div className="text-gray-500 dark:text-gray-400">分数</div>
        
        {/* Progress info */}
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          答题: {questionsAnswered} | 正确: {correctAnswers} | 准确率: {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="card p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {question.num1} {question.operator} {question.num2} = ?
            </div>
            
            {/* Question Type Indicator */}
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {question.type === 'input' ? '输入答案' : '选择答案'}
            </div>
            
            {question.type === 'input' ? (
              <>
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input text-center text-2xl font-bold mb-6"
                  placeholder="答案"
                  autoFocus
                  disabled={!isGameActive}
                />
                
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || !isGameActive}
                  className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认答案
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    disabled={!isGameActive || selectedOption !== null}
                    className={`px-6 py-4 text-xl font-bold min-h-[60px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ${
                      selectedOption === option
                        ? selectedOption === correctAnswer
                          ? 'bg-green-500 text-white focus:ring-green-500 shadow-lg'
                          : 'bg-red-500 text-white focus:ring-red-500 shadow-lg'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:ring-primary-500 shadow-sm hover:shadow-md'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {!isGameActive && timeLeft > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              游戏已暂停
            </h2>
            <button
              onClick={togglePause}
              className="btn btn-primary btn-lg"
            >
              继续游戏
            </button>
          </div>
        </div>
      )}
      </PageContainer>
    </ErrorBoundary>
  )
} 