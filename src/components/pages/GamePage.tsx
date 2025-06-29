import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Pause, Home, Timer, Zap, Heart } from 'lucide-react'
import { useAudio } from '@/hooks/useAudio'
import { useAchievements } from '@/hooks/useAchievements'
import { useToast } from '@/hooks/useToast'

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
  const { playSound, playBackgroundMusic, stopBackgroundMusic } = useAudio()
  const { updateStats } = useAchievements()
  const { toast } = useToast()
  
  // Game state
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
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

  const calculateAnswer = useCallback(() => {
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
      const correctAnswer = (() => {
        switch (operator) {
          case '+': return num1 + num2
          case '-': return num1 - num2
          case '×': return num1 * num2
          case '÷': return num1 / num2
          default: return 0
        }
      })()
      newQuestion.options = generateMultipleChoiceOptions(correctAnswer)
    }
    
    setQuestion(newQuestion)
    setAnswer('')
    setSelectedOption(null)
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
    
    const newAchievements = updateStats(sessionData)
    
    // Show achievement notifications
    if (newAchievements.length > 0) {
      newAchievements.forEach(achievement => {
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
  }, [navigate, score, gameStartTime, questionsAnswered, correctAnswers, perfectAnswers, streak, updateStats, stopBackgroundMusic, playSound, toast])

  const handleSubmit = useCallback(() => {
    const correctAnswer = calculateAnswer()
    let userAnswer: number
    
    if (question.type === 'input') {
      userAnswer = parseInt(answer)
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
      
      generateQuestion()
    } else {
      setLives(prevLives => prevLives - 1)
      setStreak(0)
      playSound('incorrect')
      
      if (lives <= 1) {
        handleGameEnd()
      } else {
        generateQuestion()
      }
    }
  }, [calculateAnswer, answer, selectedOption, question.type, question.operator, streak, lives, generateQuestion, handleGameEnd, getOperatorType, updateStats, playSound, toast])

  const handleOptionClick = useCallback((option: number) => {
    setSelectedOption(option)
    setTimeout(() => {
      const correctAnswer = calculateAnswer()
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
        
        generateQuestion()
      } else {
        setLives(prevLives => prevLives - 1)
        setStreak(0)
        playSound('incorrect')
        
        if (lives <= 1) {
          handleGameEnd()
        } else {
          generateQuestion()
        }
      }
    }, 500)
  }, [calculateAnswer, streak, lives, generateQuestion, handleGameEnd, getOperatorType, updateStats, playSound, toast, question.operator])

  // Game initialization and cleanup
  useEffect(() => {
    playSound('gameStart')
    playBackgroundMusic()
    generateQuestion()
    
    return () => {
      stopBackgroundMusic()
    }
  }, [playSound, playBackgroundMusic, stopBackgroundMusic, generateQuestion])

  // Timer
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleGameEnd()
    }
  }, [timeLeft, isGameActive, handleGameEnd])

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
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    disabled={!isGameActive || selectedOption !== null}
                    className={`btn btn-lg text-xl font-bold min-h-[60px] transition-all duration-200 ${
                      selectedOption === option
                        ? selectedOption === calculateAnswer()
                          ? 'btn-success'
                          : 'btn-danger'
                        : 'btn-outline hover:btn-primary'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {option}
                  </button>
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
  )
} 