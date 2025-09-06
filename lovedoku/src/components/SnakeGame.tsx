import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Position {
    x: number
    y: number
}

export const SnakeGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
    const [food, setFood] = useState<Position>({ x: 15, y: 15 })
    const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT')

    const [score, setScore] = useState(0)
    const [showBirthdayMessage, setShowBirthdayMessage] = useState(false)

    const moveSnake = useCallback(() => {

        setSnake(prevSnake => {
            const newSnake = [...prevSnake]
            const head = { ...newSnake[0] }

            switch (direction) {
                case 'UP':
                    head.y = head.y > 0 ? head.y - 1 : 19
                    break
                case 'DOWN':
                    head.y = head.y < 19 ? head.y + 1 : 0
                    break
                case 'LEFT':
                    head.x = head.x > 0 ? head.x - 1 : 19
                    break
                case 'RIGHT':
                    head.x = head.x < 19 ? head.x + 1 : 0
                    break
            }

            // Check if snake ate food
            if (head.x === food.x && head.y === food.y) {
                const newScore = score + 1
                setScore(newScore)

                // Birthday easter egg at score 7
                if (newScore === 7) {
                    setShowBirthdayMessage(true)
                }

                // Generate new food position
                setFood({
                    x: Math.floor(Math.random() * 20),
                    y: Math.floor(Math.random() * 20)
                })
            } else {
                newSnake.pop() // Remove tail if no food eaten
            }

            newSnake.unshift(head)
            return newSnake
        })
    }, [direction, food])

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                    setDirection('UP')
                    break
                case 'ArrowDown':
                    setDirection('DOWN')
                    break
                case 'ArrowLeft':
                    setDirection('LEFT')
                    break
                case 'ArrowRight':
                    setDirection('RIGHT')
                    break
                case 'Escape':
                    onClose()
                    break
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [onClose])

    useEffect(() => {
        const gameLoop = setInterval(moveSnake, 150)
        return () => clearInterval(gameLoop)
    }, [moveSnake])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
            <div className="bg-white rounded-2xl p-6 max-w-md mx-auto">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-purple-700 mb-2">🐍 Snake Game</h2>
                    <p className="text-gray-600">Score: {score}</p>
                    <p className="text-sm text-gray-500">Use arrow keys to move, ESC to close</p>
                </div>

                <div className="grid grid-cols-20 grid-rows-20 gap-0 bg-gray-100 border-2 border-gray-300 w-80 h-80 mx-auto">
                    {/* Snake */}
                    {snake.map((segment, index) => (
                        <div
                            key={index}
                            className={`w-4 h-4 ${index === 0 ? 'bg-green-600' : 'bg-green-400'
                                } rounded-sm`}
                            style={{
                                gridColumn: segment.x + 1,
                                gridRow: segment.y + 1
                            }}
                        />
                    ))}

                    {/* Food (Heart) */}
                    <div
                        className="w-4 h-4 text-red-500 text-center text-xs flex items-center justify-center"
                        style={{
                            gridColumn: food.x + 1,
                            gridRow: food.y + 1
                        }}
                    >
                        ❤️
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Close Game
                    </button>
                </div>

                {/* Birthday Easter Egg Message */}
                <AnimatePresence>
                    {showBirthdayMessage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-gradient-to-br from-pink-100 to-red-100 rounded-2xl p-8 text-center max-w-md mx-4"
                            >
                                <div className="text-6xl mb-4">🎂</div>
                                <h3 className="text-2xl font-bold text-red-700 mb-4">7th January 💕</h3>
                                <p className="text-lg text-red-600 mb-6">
                                    The day you were born — my lucky start! ❤️
                                </p>
                                <button
                                    onClick={() => setShowBirthdayMessage(false)}
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                                >
                                    Continue ❤️
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
