import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SudokuGrid } from './SudokuGrid'
import { SnakeGame } from './SnakeGame'
import { Game2048 } from './Game2048'
import { Minesweeper } from './Minesweeper'
import { TicTacToe } from './TicTacToe'
import { MemoryGame } from './MemoryGame'
import { TriviaGame } from './TriviaGame'
import { useTheme } from '../contexts/ThemeContext'
import { useAchievements } from '../contexts/AchievementsContext'
import { useSound } from '../hooks/useSound'

type GameState = 'hub' | 'sudoku' | 'snake' | 'game2048' | 'minesweeper' | 'tic-tac-toe' | 'memory' | 'trivia'

export const GameHub: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('hub')
    const { theme, toggleTheme } = useTheme()
    const { getUnlockedCount } = useAchievements()
    const { playSound, isEnabled: soundEnabled, toggleSound } = useSound()

    const handleSudokuComplete = () => {
        // Just show a completion message or return to hub
        playSound('win')
        alert('Congratulations! You completed the Sudoku puzzle!')
        setGameState('hub')
    }

    const renderHub = () => (
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
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className={`p-3 rounded-full ${theme === 'dark'
                                    ? 'bg-yellow-500 hover:bg-yellow-600'
                                    : 'bg-gray-800 hover:bg-gray-700'
                                } text-white`}
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleSound}
                            className={`p-3 rounded-full ${soundEnabled
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-red-500 hover:bg-red-600'
                                } text-white`}
                            title="Toggle Sound"
                        >
                            {soundEnabled ? '🔊' : '🔇'}
                        </motion.button>
                    </div>
                </div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={`text-xl mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                >
                    A collection of fun mini-games for everyone
                </motion.p>

                {/* Achievement Counter */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme === 'dark'
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-yellow-100 text-yellow-800'
                        } mb-8`}
                >
                    <span className="text-2xl">🏆</span>
                    <span className="font-semibold">{getUnlockedCount()} Achievements Unlocked</span>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    {/* Sudoku Game */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            playSound('click')
                            setGameState('sudoku')
                        }}
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
                        onClick={() => {
                            playSound('click')
                            setGameState('game2048')
                        }}
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
                        onClick={() => {
                            playSound('click')
                            setGameState('snake')
                        }}
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
                        onClick={() => {
                            playSound('click')
                            setGameState('minesweeper')
                        }}
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
                        onClick={() => {
                            playSound('click')
                            setGameState('tic-tac-toe')
                        }}
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
                        onClick={() => {
                            playSound('click')
                            setGameState('memory')
                        }}
                        className={`rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all ${theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-4xl mb-4">🧠</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                            }`}>Memory</h3>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>Match the pairs</p>
                    </motion.div>

                    {/* Trivia Game */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            playSound('click')
                            setGameState('trivia')
                        }}
                        className={`rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all ${
                            theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-white hover:bg-gray-50'
                        }`}
                    >
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className={`text-xl font-bold mb-2 ${
                            theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                        }`}>Trivia</h3>
                        <p className={`${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Test your knowledge</p>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    )

    const renderSudoku = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8"
        >
            <div className="max-w-4xl mx-auto">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setGameState('hub')}
                    className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    ← Back to Hub
                </motion.button>

                <SudokuGrid onComplete={handleSudokuComplete} />
            </div>
        </motion.div>
    )




    const renderSnakeGame = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-8"
        >
            <div className="max-w-4xl mx-auto">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setGameState('hub')}
                    className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    ← Back to Hub
                </motion.button>

                <SnakeGame onClose={() => setGameState('hub')} />
            </div>
        </motion.div>
    )

    const renderGame2048 = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8"
        >
            <div className="max-w-4xl mx-auto">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setGameState('hub')}
                    className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    ← Back to Hub
                </motion.button>

                <Game2048 onClose={() => setGameState('hub')} />
            </div>
        </motion.div>
    )

    const renderMinesweeper = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-8"
        >
            <div className="max-w-4xl mx-auto">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setGameState('hub')}
                    className="mb-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                    ← Back to Hub
                </motion.button>

                <Minesweeper onClose={() => setGameState('hub')} />
            </div>
        </motion.div>
    )


    const renderTicTacToe = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8"
        >
            <div className="max-w-4xl mx-auto">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                        playSound('click')
                        setGameState('hub')
                    }}
                    className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    ← Back to Hub
                </motion.button>

                <TicTacToe onClose={() => setGameState('hub')} />
            </div>
        </motion.div>
    )

    const renderMemoryGame = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-8"
        >
            <div className="max-w-4xl mx-auto">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                        playSound('click')
                        setGameState('hub')
                    }}
                    className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    ← Back to Hub
                </motion.button>

                <MemoryGame onClose={() => setGameState('hub')} />
            </div>
        </motion.div>
    )

    const renderTriviaGame = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8"
        >
            <div className="max-w-4xl mx-auto">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => {
                        playSound('click')
                        setGameState('hub')
                    }}
                    className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    ← Back to Hub
                </motion.button>

                <TriviaGame onClose={() => setGameState('hub')} />
            </div>
        </motion.div>
    )

    return (
        <AnimatePresence mode="wait">
            {gameState === 'hub' && renderHub()}
            {gameState === 'sudoku' && renderSudoku()}
            {gameState === 'snake' && renderSnakeGame()}
            {gameState === 'game2048' && renderGame2048()}
            {gameState === 'minesweeper' && renderMinesweeper()}
            {gameState === 'tic-tac-toe' && renderTicTacToe()}
            {gameState === 'memory' && renderMemoryGame()}
            {gameState === 'trivia' && renderTriviaGame()}
        </AnimatePresence>
    )
}
