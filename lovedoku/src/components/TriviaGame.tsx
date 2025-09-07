
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../hooks/useSound'
import { useHighScores } from '../contexts/HighScoresContext'
import { useAchievements } from '../contexts/AchievementsContext'

interface TriviaGameProps {
    onClose: () => void
}

interface Question {
    category: string
    type: 'multiple' | 'boolean'
    difficulty: 'easy' | 'medium' | 'hard'
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

interface TriviaQuestion extends Question {
    all_answers: string[]
    shuffled_answers: string[]
}

export const TriviaGame: React.FC<TriviaGameProps> = ({ onClose }) => {
    const [questions, setQuestions] = useState<TriviaQuestion[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'finished'>('loading')
    const [timeLeft, setTimeLeft] = useState(30)
    const [streak, setStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
    const [category, setCategory] = useState('9') // General Knowledge
    const [isAnswered, setIsAnswered] = useState(false)
    const isFetchingRef = useRef(false)

    const { playSound } = useSound()
    const { addHighScore } = useHighScores()
    const { checkAchievements } = useAchievements()

    const categories = [
        { id: '9', name: 'General Knowledge' },
        { id: '10', name: 'Books' },
        { id: '11', name: 'Film' },
        { id: '12', name: 'Music' },
        { id: '17', name: 'Science & Nature' },
        { id: '18', name: 'Computers' },
        { id: '21', name: 'Sports' },
        { id: '22', name: 'Geography' },
        { id: '23', name: 'History' },
        { id: '25', name: 'Art' }
    ]

    const shuffleArray = (array: string[]) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    const decodeHtml = (html: string) => {
        const txt = document.createElement('textarea')
        txt.innerHTML = html
        return txt.value
    }

    const fetchQuestions = async () => {
        // Prevent duplicate calls
        if (isFetchingRef.current) {
            console.log('Already fetching questions, skipping...')
            return
        }

        try {
            isFetchingRef.current = true
            setGameState('loading')
            console.log('Fetching questions from OpenTDB API...')

            const response = await fetch(
                `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            )

            console.log('Response status:', response.status)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('API Response:', data)

            if (data.response_code === 0) {
                const processedQuestions = data.results.map((q: Question) => {
                    const allAnswers = [q.correct_answer, ...q.incorrect_answers]
                    return {
                        ...q,
                        question: decodeHtml(q.question),
                        correct_answer: decodeHtml(q.correct_answer),
                        incorrect_answers: q.incorrect_answers.map(decodeHtml),
                        all_answers: allAnswers.map(decodeHtml),
                        shuffled_answers: shuffleArray(allAnswers.map(decodeHtml))
                    }
                })
                setQuestions(processedQuestions)
                setCurrentQuestion(0)
                setScore(0)
                setStreak(0)
                setMaxStreak(0)
                setTimeLeft(30)
                setIsAnswered(false)
                setGameState('playing')
                playSound('click')
            } else {
                console.error('API returned error code:', data.response_code)
                // Fallback to mock data
                loadMockQuestions()
            }
        } catch (error) {
            console.error('Error fetching questions:', error)
            // Fallback to mock data
            loadMockQuestions()
        } finally {
            isFetchingRef.current = false
        }
    }

    const loadMockQuestions = () => {
        console.log('Loading mock questions as fallback...')
        const mockQuestions: TriviaQuestion[] = [
            {
                category: 'General Knowledge',
                type: 'multiple',
                difficulty: 'easy',
                question: 'What is the capital of France?',
                correct_answer: 'Paris',
                incorrect_answers: ['London', 'Berlin', 'Madrid'],
                all_answers: ['Paris', 'London', 'Berlin', 'Madrid'],
                shuffled_answers: ['Paris', 'London', 'Berlin', 'Madrid']
            },
            {
                category: 'General Knowledge',
                type: 'multiple',
                difficulty: 'easy',
                question: 'What is 2 + 2?',
                correct_answer: '4',
                incorrect_answers: ['3', '5', '6'],
                all_answers: ['4', '3', '5', '6'],
                shuffled_answers: ['4', '3', '5', '6']
            },
            {
                category: 'General Knowledge',
                type: 'multiple',
                difficulty: 'medium',
                question: 'Which planet is known as the Red Planet?',
                correct_answer: 'Mars',
                incorrect_answers: ['Venus', 'Jupiter', 'Saturn'],
                all_answers: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
                shuffled_answers: ['Mars', 'Venus', 'Jupiter', 'Saturn']
            },
            {
                category: 'General Knowledge',
                type: 'multiple',
                difficulty: 'hard',
                question: 'What is the largest mammal in the world?',
                correct_answer: 'Blue whale',
                incorrect_answers: ['African elephant', 'Giraffe', 'Hippopotamus'],
                all_answers: ['Blue whale', 'African elephant', 'Giraffe', 'Hippopotamus'],
                shuffled_answers: ['Blue whale', 'African elephant', 'Giraffe', 'Hippopotamus']
            },
            {
                category: 'General Knowledge',
                type: 'multiple',
                difficulty: 'easy',
                question: 'What color do you get when you mix red and blue?',
                correct_answer: 'Purple',
                incorrect_answers: ['Green', 'Orange', 'Yellow'],
                all_answers: ['Purple', 'Green', 'Orange', 'Yellow'],
                shuffled_answers: ['Purple', 'Green', 'Orange', 'Yellow']
            }
        ]

        setQuestions(mockQuestions)
        setCurrentQuestion(0)
        setScore(0)
        setStreak(0)
        setMaxStreak(0)
        setTimeLeft(30)
        setIsAnswered(false)
        setGameState('playing')
        playSound('click')
    }

    const handleAnswer = (answer: string) => {
        if (isAnswered) return

        setIsAnswered(true)
        setSelectedAnswer(answer)

        const isCorrect = answer === questions[currentQuestion].correct_answer

        if (isCorrect) {
            const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30
            const timeBonus = Math.floor(timeLeft / 3)
            const totalPoints = points + timeBonus

            setScore(prev => prev + totalPoints)
            setStreak(prev => {
                const newStreak = prev + 1
                setMaxStreak(prevMax => Math.max(prevMax, newStreak))
                return newStreak
            })
            playSound('success')
        } else {
            setStreak(0)
            playSound('error')
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1)
                setTimeLeft(30)
                setIsAnswered(false)
                setSelectedAnswer(null)
            } else {
                setGameState('finished')
                addHighScore({
                    game: 'trivia',
                    score,
                    player: 'Player',
                    difficulty
                })
                checkAchievements('trivia', score)
                playSound('win')
            }
        }, 2000)
    }

    // Load questions on component mount and when settings change
    useEffect(() => {
        console.log('TriviaGame: Loading questions...')
        fetchQuestions()
    }, [category, difficulty])

    // Timer
    useEffect(() => {
        let interval: number | null = null
        if (gameState === 'playing' && timeLeft > 0 && !isAnswered) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && !isAnswered) {
            handleAnswer('')
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [gameState, timeLeft, isAnswered])

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'text-green-600 bg-green-100'
            case 'medium': return 'text-yellow-600 bg-yellow-100'
            case 'hard': return 'text-red-600 bg-red-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getAnswerColor = (answer: string) => {
        if (!isAnswered) return 'bg-white hover:bg-blue-50 border-gray-300'

        if (answer === questions[currentQuestion].correct_answer) {
            return 'bg-green-500 text-white border-green-500'
        } else if (answer === selectedAnswer && answer !== questions[currentQuestion].correct_answer) {
            return 'bg-red-500 text-white border-red-500'
        } else {
            return 'bg-gray-200 text-gray-500 border-gray-200'
        }
    }

    if (gameState === 'loading') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center"
            >
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="text-6xl mb-4"
                    >
                        🧠
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Loading Questions...</h2>
                    <p className="text-gray-600 dark:text-gray-300">Preparing your trivia challenge!</p>
                </div>
            </motion.div>
        )
    }

    if (gameState === 'finished') {
        const accuracy = Math.round((score / (questions.length * (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30))) * 100)

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl mb-4"
                    >
                        🎉
                    </motion.div>

                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Quiz Complete!</h2>

                    <div className="space-y-4 mb-6">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}</div>
                            <div className="text-sm text-blue-500">Total Score</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">{maxStreak}</div>
                                <div className="text-xs text-green-500">Max Streak</div>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
                                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{accuracy}%</div>
                                <div className="text-xs text-purple-500">Accuracy</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={fetchQuestions}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            🔄 Play Again
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                        >
                            ❌ Close
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
                        🧠 Trivia Challenge 🎯
                    </h2>

                    {/* Settings */}
                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            {(['easy', 'medium', 'hard'] as const).map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficulty(diff)}
                                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${difficulty === diff
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}</div>
                            <div className="text-xs text-blue-500">Score</div>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{streak}</div>
                            <div className="text-xs text-green-500">Streak</div>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{timeLeft}</div>
                            <div className="text-xs text-purple-500">Time</div>
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentQuestion + 1}/10</div>
                            <div className="text-xs text-orange-500">Question</div>
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(questions[currentQuestion]?.difficulty)}`}>
                            {questions[currentQuestion]?.difficulty?.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {questions[currentQuestion]?.category}
                        </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 leading-relaxed">
                        {questions[currentQuestion]?.question}
                    </h3>

                    {/* Answers */}
                    <div className="space-y-3">
                        {questions[currentQuestion]?.shuffled_answers?.map((answer, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAnswer(answer)}
                                disabled={isAnswered}
                                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'
                                    } ${getAnswerColor(answer)}`}
                            >
                                <span className="font-medium">{answer}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <motion.div
                        className="bg-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchQuestions}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        🔄 New Quiz
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                    >
                        ❌ Close
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}