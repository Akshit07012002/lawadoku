import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../../../shared/hooks'
import { useHighScores } from '../../../core/providers'
import { useAchievements } from '../../../core/providers'
import TicTacToeCompletionModal from './TicTacToeCompletionModal'

interface TicTacToeProps {
    onClose: () => void
    onBackToHub?: () => void
}

type Player = 'X' | 'O' | null
type Board = Player[]

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
]

export const TicTacToe: React.FC<TicTacToeProps> = ({ onClose, onBackToHub }) => {
    const [board, setBoard] = useState<Board>(Array(9).fill(null))
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
    const [winner, setWinner] = useState<Player | 'tie' | null>(null)
    const [gameMode, setGameMode] = useState<'vs-human' | 'vs-ai'>('vs-human')
    const [score, setScore] = useState({ X: 0, O: 0, ties: 0 })
    const [isThinking, setIsThinking] = useState(false)
    const [showCompletionModal, setShowCompletionModal] = useState(false)

    const { playSound } = useSound()
    const { addHighScore } = useHighScores()
    const { checkAchievements } = useAchievements()

    const checkWinner = (board: Board): Player | 'tie' | null => {
        for (const [a, b, c] of WINNING_COMBINATIONS) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]
            }
        }
        return board.every(cell => cell !== null) ? 'tie' : null
    }

    const makeMove = (index: number) => {
        if (board[index] || winner || isThinking) return

        const newBoard = [...board]
        newBoard[index] = currentPlayer
        setBoard(newBoard)
        playSound('click')

        const gameWinner = checkWinner(newBoard)
        if (gameWinner) {
            setWinner(gameWinner)
            if (gameWinner !== 'tie') {
                playSound('win')
                setScore(prev => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }))
                addHighScore({
                    game: 'tic-tac-toe',
                    score: 1,
                    player: 'Player',
                    difficulty: gameMode
                })
                checkAchievements('tic-tac-toe', 1)
            } else {
                playSound('success')
                setScore(prev => ({ ...prev, ties: prev.ties + 1 }))
            }
            // Show completion modal after a short delay
            setTimeout(() => setShowCompletionModal(true), 1000)
        } else {
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
            if (gameMode === 'vs-ai' && currentPlayer === 'X') {
                makeAIMove(newBoard)
            }
        }
    }

    const makeAIMove = (currentBoard: Board) => {
        setIsThinking(true)
        playSound('click')

        setTimeout(() => {
            const emptyIndices = currentBoard.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[]

            if (emptyIndices.length === 0) return

            // Simple AI: Try to win, then block, then take center, then take corners, then take edges
            let move = -1

            // Try to win
            for (const index of emptyIndices) {
                const testBoard = [...currentBoard]
                testBoard[index] = 'O'
                if (checkWinner(testBoard) === 'O') {
                    move = index
                    break
                }
            }

            // Try to block
            if (move === -1) {
                for (const index of emptyIndices) {
                    const testBoard = [...currentBoard]
                    testBoard[index] = 'X'
                    if (checkWinner(testBoard) === 'X') {
                        move = index
                        break
                    }
                }
            }

            // Take center
            if (move === -1 && emptyIndices.includes(4)) {
                move = 4
            }

            // Take corners
            if (move === -1) {
                const corners = [0, 2, 6, 8]
                for (const corner of corners) {
                    if (emptyIndices.includes(corner)) {
                        move = corner
                        break
                    }
                }
            }

            // Take any available
            if (move === -1) {
                move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
            }

            if (move !== -1) {
                const newBoard = [...currentBoard]
                newBoard[move] = 'O'
                setBoard(newBoard)

                const gameWinner = checkWinner(newBoard)
                if (gameWinner) {
                    setWinner(gameWinner)
                    if (gameWinner !== 'tie') {
                        playSound('win')
                        setScore(prev => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }))
                    } else {
                        playSound('success')
                        setScore(prev => ({ ...prev, ties: prev.ties + 1 }))
                    }
                    // Show completion modal after a short delay
                    setTimeout(() => setShowCompletionModal(true), 1000)
                } else {
                    setCurrentPlayer('X')
                }
            }

            setIsThinking(false)
        }, 500)
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setCurrentPlayer('X')
        setWinner(null)
        setIsThinking(false)
        setShowCompletionModal(false)
        playSound('click')
    }

    const handlePlayAgain = () => {
        setShowCompletionModal(false)
        resetGame()
    }

    const handleBackToHub = () => {
        if (onBackToHub) {
            onBackToHub()
        } else {
            onClose()
        }
    }

    const resetScore = () => {
        setScore({ X: 0, O: 0, ties: 0 })
        playSound('click')
    }

    const getStatusMessage = () => {
        if (isThinking) return "AI is thinking..."
        if (winner === 'tie') return "It's a tie!"
        if (winner) return `Player ${winner} wins!`
        return `Player ${currentPlayer}'s turn`
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4"
        >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                    <motion.h2 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3"
                    >
                        <span className="text-5xl">⭕</span>
                        Tic-Tac-Toe
                        <span className="text-5xl">❌</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium"
                    >
                        Get three in a row to win! 🎯
                    </motion.p>

                    {/* Game Mode Selector */}
                    <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl p-1 mb-6 shadow-inner"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setGameMode('vs-human')
                                resetGame()
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${gameMode === 'vs-human'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-500 hover:text-gray-800 dark:hover:text-white'
                                }`}
                        >
                            👥 vs Human
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setGameMode('vs-ai')
                                resetGame()
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${gameMode === 'vs-ai'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-500 hover:text-gray-800 dark:hover:text-white'
                                }`}
                        >
                            🤖 vs AI
                        </motion.button>
                    </motion.div>

                    {/* Score Display */}
                    <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-3 gap-3 mb-6"
                    >
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-xl p-4 shadow-lg border border-red-200 dark:border-red-700"
                        >
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">❌</div>
                            <div className="text-3xl font-black text-red-700 dark:text-red-300">{score.X}</div>
                            <div className="text-xs text-red-500 dark:text-red-400 font-medium">WINS</div>
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600"
                        >
                            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-1">🤝</div>
                            <div className="text-3xl font-black text-gray-700 dark:text-gray-300">{score.ties}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">TIES</div>
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4 shadow-lg border border-blue-200 dark:border-blue-700"
                        >
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">⭕</div>
                            <div className="text-3xl font-black text-blue-700 dark:text-blue-300">{score.O}</div>
                            <div className="text-xs text-blue-500 dark:text-blue-400 font-medium">WINS</div>
                        </motion.div>
                    </motion.div>

                    {/* Status */}
                    <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 mb-6 border border-blue-200 dark:border-gray-600"
                    >
                        <div className="text-xl font-bold text-gray-800 dark:text-white text-center">
                            {getStatusMessage()}
                        </div>
                    </motion.div>
                </div>

                {/* Game Board */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-3 gap-3 mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-4 rounded-2xl shadow-inner border border-gray-300 dark:border-gray-600"
                >
                    {board.map((cell, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => makeMove(index)}
                            disabled={cell !== null || winner !== null || isThinking}
                            className={`w-24 h-24 text-4xl font-bold rounded-xl transition-all duration-300 shadow-lg ${cell === 'X'
                                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-200 dark:shadow-red-800'
                                : cell === 'O'
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200 dark:shadow-blue-800'
                                    : 'bg-white dark:bg-gray-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-500 dark:hover:to-gray-400 text-gray-300 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
                                } ${(cell !== null || winner !== null || isThinking) ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
                        >
                            <AnimatePresence>
                                {cell && (
                                    <motion.span
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        transition={{ 
                                            duration: 0.4,
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 10
                                        }}
                                        className="block"
                                    >
                                        {cell}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetGame}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">🔄</span>
                        New Game
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetScore}
                        className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">📊</span>
                        Reset Score
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">❌</span>
                        Close
                    </motion.button>
                </motion.div>
            </div>

            {/* Completion Modal */}
            <TicTacToeCompletionModal
                isOpen={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
                onPlayAgain={handlePlayAgain}
                onBackToHub={handleBackToHub}
                winner={winner}
                score={score}
            />
        </motion.div>
    )
}
