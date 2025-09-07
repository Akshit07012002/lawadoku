import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAchievements } from '../contexts/AchievementsContext'
import { useSound } from '../hooks/useSound'

export const GameHub: React.FC = () => {
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const { getUnlockedCount } = useAchievements()
    const { playSound, isEnabled: soundEnabled, toggleSound } = useSound()

    const handleGameClick = (gamePath: string) => {
        playSound('click')
        navigate(gamePath)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`min-h-screen p-8 ${theme === 'dark'
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100'
                }`}
        >
            <div className="max-w-6xl mx-auto text-center">
                {/* Header with Controls */}
                <div className="flex justify-between items-center mb-8">
                    <div></div>
                    <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-purple-800'
                            }`}
                    >
                        🎮 Game Hub 🎮
                    </motion.h1>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${theme === 'dark'
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-white text-gray-800 hover:bg-gray-100'
                                }`}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleSound}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${theme === 'dark'
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-white text-gray-800 hover:bg-gray-100'
                                }`}
                        >
                            {soundEnabled ? '🔊' : '🔇'}
                        </motion.button>
                    </div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${theme === 'dark'
                        ? 'bg-gray-800 text-gray-300'
                        : 'bg-white text-gray-700'
                        }`}
                    >
                        <span className="text-2xl">🏆</span>
                        <span className="font-semibold">Achievements: {getUnlockedCount()}</span>
                    </div>
                </motion.div>

                {/* Games Grid */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                >
                    {/* Sudoku Game */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGameClick('/sudoku')}
                        className={`rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all ${theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-4xl mb-4">🧩</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                            }`}>Sudoku</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>Classic number puzzle</p>
                    </motion.div>

                    {/* 2048 Game */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGameClick('/2048')}
                        className={`rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all ${theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-4xl mb-4">🔢</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                            }`}>2048</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>Classic number merging game</p>
                    </motion.div>

                    {/* Snake Game */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGameClick('/snake')}
                        className={`rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all ${theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-4xl mb-4">🐍</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                            }`}>Snake</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>Chase the heart! ❤️</p>
                    </motion.div>

                    {/* Minesweeper */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGameClick('/minesweeper')}
                        className={`rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all ${theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-4xl mb-4">💣</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                            }`}>Minesweeper</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>Classic mine hunting game</p>
                    </motion.div>

                    {/* Tic-Tac-Toe */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGameClick('/tic-tac-toe')}
                        className={`rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all ${theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-4xl mb-4">⭕</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                            }`}>Tic-Tac-Toe</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>Classic 3-in-a-row game</p>
                    </motion.div>

                    {/* Memory Game */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGameClick('/memory')}
                        className={`rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all ${theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-4xl mb-4">🧠</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                            }`}>Memory Game</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>Match the cards</p>
                    </motion.div>

                    {/* Trivia Game */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGameClick('/trivia')}
                        className={`rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all ${theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                            }`}>Trivia</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>Test your knowledge</p>
                    </motion.div>

                </motion.div>
            </div>
        </motion.div>
    );
}