import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SudokuGrid } from './SudokuGrid'
import { SnakeGame } from './SnakeGame'
import { Game2048 } from './Game2048'
import { Minesweeper } from './Minesweeper'

type GameState = 'hub' | 'sudoku' | 'snake' | 'game2048' | 'minesweeper'

export const GameHub: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('hub')
    const handleSudokuComplete = () => {
        // Just show a completion message or return to hub
        alert('Congratulations! You completed the Sudoku puzzle!')
        setGameState('hub')
    }

    const renderHub = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8"
        >
            <div className="max-w-6xl mx-auto text-center">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl font-bold text-purple-800 mb-8"
                >
                    🎮 Game Hub 🎮
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-600 mb-12"
                >
                    A collection of fun mini-games I built for you
                </motion.p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    {/* Sudoku Game */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGameState('sudoku')}
                        className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                    >
                        <div className="text-4xl mb-4">🧩</div>
                        <h3 className="text-xl font-bold text-purple-700 mb-2">Sudoku</h3>
                        <p className="text-gray-600">Classic number puzzle</p>
                    </motion.div>

                    {/* 2048 Game - Love Edition */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGameState('game2048')}
                        className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                    >
                        <div className="text-4xl mb-4">🔢</div>
                        <h3 className="text-xl font-bold text-purple-700 mb-2">2048</h3>
                        <p className="text-gray-600">Classic number merging game</p>
                    </motion.div>

                    {/* Snake Game - Easter Egg */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGameState('snake')}
                        className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                    >
                        <div className="text-4xl mb-4">🐍</div>
                        <h3 className="text-xl font-bold text-purple-700 mb-2">Snake</h3>
                        <p className="text-gray-600">Chase the heart! ❤️</p>
                    </motion.div>

                    {/* Minesweeper - Love Edition */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setGameState('minesweeper')}
                        className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                    >
                        <div className="text-4xl mb-4">💣</div>
                        <h3 className="text-xl font-bold text-purple-700 mb-2">Minesweeper</h3>
                        <p className="text-gray-600">Classic mine hunting game</p>
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


    return (
        <AnimatePresence mode="wait">
            {gameState === 'hub' && renderHub()}
            {gameState === 'sudoku' && renderSudoku()}
            {gameState === 'snake' && renderSnakeGame()}
            {gameState === 'game2048' && renderGame2048()}
            {gameState === 'minesweeper' && renderMinesweeper()}
        </AnimatePresence>
    )
}
