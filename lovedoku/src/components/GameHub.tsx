import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SudokuGrid } from './SudokuGrid'
import { SnakeGame } from './SnakeGame'
import { Game2048 } from './Game2048'
import { Minesweeper } from './Minesweeper'

type GameState = 'hub' | 'sudoku' | 'love-proposal' | 'ads' | 'doorstep' | 'love-exe' | 'snake' | 'game2048' | 'minesweeper'

export const GameHub: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('hub')
    const [lawanyaUnlocked, setLawanyaUnlocked] = useState(false)

    // Handle 10-second timer for doorstep screen
    useEffect(() => {
        if (gameState === 'doorstep') {
            const timer = setTimeout(() => {
                setGameState('love-proposal')
            }, 10000) // 10 seconds

            return () => clearTimeout(timer)
        }
    }, [gameState])

    const handleSudokuComplete = () => {
        setGameState('ads')
    }

    const handleLoveProposal = (accepted: boolean) => {
        if (accepted) {
            setGameState('love-exe')
        } else {
            // Show silly error message
            alert('Incorrect input. Please try again.')
        }
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

                    {/* Lawanya Mode - Locked */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => lawanyaUnlocked && setGameState('love-proposal')}
                        className={`rounded-2xl p-6 shadow-lg transition-all ${lawanyaUnlocked
                            ? 'bg-gradient-to-br from-pink-100 to-red-100 cursor-pointer hover:shadow-xl'
                            : 'bg-gray-100 cursor-not-allowed opacity-60'
                            }`}
                    >
                        <div className="text-4xl mb-4">
                            {lawanyaUnlocked ? '💕' : '🔒'}
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Lawanya Mode</h3>
                        <p className="text-gray-500">
                            {lawanyaUnlocked ? 'Click to unlock!' : 'Locked'}
                        </p>
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

    const renderAds = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-black text-white flex items-center justify-center"
        >
            <div className="text-center">
                <motion.div
                    animate={{
                        filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)', 'hue-rotate(0deg)'],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-8"
                >
                    🎮
                </motion.div>
                <h1 className="text-4xl font-bold mb-4">🎯 FREE IPHONE 27 ULTRA++! 🎯</h1>
                <p className="text-xl mb-8">Congratulations! You're the 1,000,000th Sudoku Solver!</p>
                <p className="text-lg mb-8 text-yellow-300">Click here to claim your prize!</p>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setGameState('doorstep')}
                    className="px-8 py-4 bg-green-600 text-white text-xl rounded-lg hover:bg-green-700"
                >
                    CLAIM NOW!
                </motion.button>
            </div>
        </motion.div>
    )

    const renderDoorstep = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 flex items-center justify-center"
        >
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto text-center">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-8xl mb-6"
                    >
                        🚪
                    </motion.div>
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">
                        Check Your Doorstep!
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Something special is waiting for you...
                    </p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-lg text-gray-500"
                    >
                        <p>⏰ Please wait 10 seconds...</p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )

    const renderLoveProposal = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-pink-200 via-red-200 to-purple-200 flex items-center justify-center"
        >
            <div className="text-center max-w-2xl mx-auto p-8">
                <motion.div
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl mb-8"
                >
                    💕
                </motion.div>

                <h1 className="text-5xl font-bold text-red-700 mb-6">
                    Achievement Unlocked: Girlfriend?
                </h1>

                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLoveProposal(true)}
                        className="px-8 py-4 bg-red-600 text-white text-2xl rounded-lg hover:bg-red-700 mx-4"
                    >
                        Accept ❤️
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLoveProposal(false)}
                        className="px-8 py-4 bg-gray-600 text-white text-2xl rounded-lg hover:bg-gray-700 mx-4"
                    >
                        Reject 😢
                    </motion.button>
                </div>
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

    const renderLoveExe = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-black text-green-400 flex items-center justify-center font-mono"
        >
            <div className="text-center max-w-4xl mx-auto p-8">
                <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-6xl mb-8"
                >
                    💻
                </motion.div>

                <h1 className="text-4xl font-bold mb-8 text-green-300">
                    love.exe - Executing...
                </h1>

                <div className="space-y-4 text-left max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex items-center space-x-4"
                    >
                        <span className="text-green-500">▶</span>
                        <span>10%: Compiling feelings...</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="flex items-center space-x-4"
                    >
                        <span className="text-green-500">▶</span>
                        <span>30%: Encrypting hugs...</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3 }}
                        className="flex items-center space-x-4"
                    >
                        <span className="text-green-500">▶</span>
                        <span>60%: Rendering future memories...</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4 }}
                        className="flex items-center space-x-4 text-yellow-400"
                    >
                        <span className="text-green-500">✅</span>
                        <span className="font-bold">100%: Linking hearts → SUCCESS!</span>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 5 }}
                    className="mt-8 p-6 bg-yellow-100 border-2 border-yellow-400 rounded-lg"
                >
                    <h3 className="text-2xl font-bold text-yellow-800 mb-2">🎉 Reward Unlocked! 🎉</h3>
                    <p className="text-lg text-yellow-700 mb-4">
                        Please check your real-life inventory for a special surprise...
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                            setLawanyaUnlocked(true)
                            setGameState('hub')
                        }}
                        className="px-8 py-4 bg-green-600 text-white text-xl rounded-lg hover:bg-green-700"
                    >
                        Return to Hub
                    </motion.button>
                </motion.div>
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
            {gameState === 'ads' && renderAds()}
            {gameState === 'doorstep' && renderDoorstep()}
            {gameState === 'love-proposal' && renderLoveProposal()}
            {gameState === 'love-exe' && renderLoveExe()}
        </AnimatePresence>
    )
}
