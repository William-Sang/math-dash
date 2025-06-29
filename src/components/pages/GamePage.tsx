import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Pause, Home, Timer, Zap, Heart } from 'lucide-react'
import { useAudio } from '@/hooks/useAudio'
import { useAchievements, Achievement } from '@/hooks/useAchievements'
import { useToast } from '@/hooks/useToast'
import { useGameSettings } from '@/hooks/useGameSettings'
import ErrorBoundary from '@/components/ErrorBoundary'

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

  const correctAnswer = useMemo(() => {
    const { num1, num2, operator } = question
    switch (operator) {
      case '+': return num1 + num2
      case '-': return num1 - num2
      case '×': return num1 * num2
      case '÷': return num1 / num2
      default: return 0
    }
  }, [question])

  const generateMultipleChoiceOptions = useCallback((correctAnswer: number) => {
    const options = [correctAnswer]
    
    // Generate 3 incorrect options
    while (options.length < 4) {
      const variance = Math.max(1, Math.floor(Math.abs(correctAnswer) * 0.2))
      const offset = Math.floor(Math.random() * variance * 2) - variance
      const newOption = correctAnswer + offset
      
      if (newOption !== correctAnswer && !options.includes(newOption) && newOption >= 0) {
        options.push(newOption)
      } else {
        const fallbackOption = correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1)
        if (fallbackOption !== correctAnswer && !options.includes(fallbackOption) && fallbackOption >= 0) {
          options.push(fallbackOption)
        }
      }
    }
    
    return options.sort(() => Math.random() - 0.5)
  }, [])

  const getOperatorType = useCallback((operator: string) => {
    switch (operator) {
      case '+': return 'addition'
      case '-': return 'subtraction'
      case '×': return 'multiplication'
      case '÷': return 'division'
      default: return 'addition'
    }
  }, [])

  const generateQuestion = useCallback(() => {
    if (isGeneratingQuestion.current) return
    isGeneratingQuestion.current = true
    
    const operators = ['+', '-', '×', '÷']
    const operator = operators[Math.floor(Math.random() * operators.length)]
    const questionType = selectedQuestionType
    let num1: number, num2: number
    
    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        break
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20
        num2 = Math.floor(Math.random() * num1)
        break
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        break
      case '÷':
        num2 = Math.floor(Math.random() * 12) + 1
        num1 = num2 * (Math.floor(Math.random() * 12) + 1)
        break
      default:
        num1 = 5
        num2 = 3
    }
    
    const newQuestion: Question = { num1, num2, operator, type: questionType }
    
    if (questionType === 'multiple-choice') {
      const newCorrectAnswer = operator === '+' ? num1 + num2 : operator === '-' ? num1 - num2 : operator === '×' ? num1 * num2 : num1 / num2
      newQuestion.options = generateMultipleChoiceOptions(newCorrectAnswer)
    }
    
    setQuestion(newQuestion)
    setAnswer('')
    setSelectedOption(null)
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isGeneratingQuestion.current = false
    }, 50)
  }, [selectedQuestionType, generateMultipleChoiceOptions])

  const handleGameEnd = useCallback(() => {
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
    
    // Show achievement notifications
    if (newAchievements.length > 0) {
      newAchievements.forEach((achievement: Achievement) => {
        playSound('achievement')
        toast.success(`🎉 解锁成就: ${achievement.name}`)
      })
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
        setTimeout(() => generateQuestion(), 100)
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
          setTimeout(() => generateQuestion(), 100)
        }
      }
    } catch (error) {
      console.error('处理答案时出错:', error)
      toast.error('处理答案时出现错误')
    }
  }, [correctAnswer, answer, selectedOption, question.type, question.operator, streak, lives, getOperatorType, updateStats, playSound, toast, generateQuestion])

  const handleOptionClick = useCallback((option: number) => {
    try {
      setSelectedOption(option)
      setTimeout(() => {
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
            
            setTimeout(() => generateQuestion(), 100)
          } else {
            setLives(prevLives => prevLives - 1)
            setStreak(0)
            playSound('incorrect')
            
            if (lives <= 1) {
              if (handleGameEndRef.current) {
                handleGameEndRef.current()
              }
            } else {
              setTimeout(() => generateQuestion(), 100)
            }
          }
        } catch (error) {
          console.error('处理选项点击时出错:', error)
          toast.error('处理答案时出现错误')
        }
      }, 500)
    } catch (error) {
      console.error('选项点击出错:', error)
      toast.error('选择答案时出现错误')
    }
  }, [correctAnswer, streak, lives, getOperatorType, updateStats, playSound, toast, question.operator, generateQuestion])

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
    }
  }, []) // Empty dependency array - this should only run once on mount

  // Update game time when settings change (only if game hasn't started significantly)
  useEffect(() => {
    // Only reset time if the game just started (within first few seconds)
    const gameRunTime = Math.round((Date.now() - gameStartTime) / 1000)
    if (gameRunTime < 5) {
      setTimeLeft(settings.gameDuration)
    }
  }, [settings.gameDuration, gameStartTime])

  // Timer
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isGameActive) {
      // Call handleGameEnd safely using ref to avoid dependency issues
      if (handleGameEndRef.current) {
        try {
          handleGameEndRef.current()
        } catch (error) {
          console.error('Error ending game:', error)
        }
      }
    }
  }, [timeLeft, isGameActive]) // Remove handleGameEnd from dependencies

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
      <div className="min-h-screen flex flex-col py-8">
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
        <motion.div 
          key={score}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          className="text-4xl font-bold text-primary-600 dark:text-primary-400"
        >
          {score}
        </motion.div>
        <div className="text-gray-500 dark:text-gray-400">分数</div>
        
        {/* Progress info */}
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          答题: {questionsAnswered} | 正确: {correctAnswers} | 准确率: {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={`${question.num1}-${question.operator}-${question.num2}-${question.type}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col items-center justify-center space-y-8"
      >
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
              <div className="grid grid-cols-2 gap-4">
                {question.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    disabled={!isGameActive || selectedOption !== null}
                    className={`btn btn-lg text-xl font-bold min-h-[60px] transition-all duration-200 ${
                      selectedOption === option
                        ? selectedOption === correctAnswer
                          ? 'btn-success'
                          : 'btn-danger'
                        : 'btn-outline hover:btn-primary'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Pause Overlay */}
      {!isGameActive && timeLeft > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
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
        </motion.div>
      )}
    </div>
    </ErrorBoundary>
  )
} 