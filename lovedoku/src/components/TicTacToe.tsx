import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../hooks/useSound'
import { useHighScores } from '../contexts/HighScoresContext'
import { useAchievements } from '../contexts/AchievementsContext'

interface TicTacToeProps {
  onClose: () => void
}

type Player = 'X' | 'O' | null
type Board = Player[]

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
]

export const TicTacToe: React.FC<TicTacToeProps> = ({ onClose }) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [winner, setWinner] = useState<Player | 'tie' | null>(null)
  const [gameMode, setGameMode] = useState<'vs-human' | 'vs-ai'>('vs-human')
  const [score, setScore] = useState({ X: 0, O: 0, ties: 0 })
  const [isThinking, setIsThinking] = useState(false)
  
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
        playSound('complete')
        setScore(prev => ({ ...prev, ties: prev.ties + 1 }))
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
      if (gameMode === 'vs-ai' && currentPlayer === 'X') {
        makeAIMove(newBoard)
      }
    }
  }

  const makeAIMove = (currentBoard: Board) => {
    setIsThinking(true)
    playSound('move')
    
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
            playSound('complete')
            setScore(prev => ({ ...prev, ties: prev.ties + 1 }))
          }
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
    playSound('click')
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
            ⭕ Tic-Tac-Toe ❌
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Get three in a row to win!</p>
          
          {/* Game Mode Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
            <button
              onClick={() => {
                setGameMode('vs-human')
                resetGame()
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                gameMode === 'vs-human'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              vs Human
            </button>
            <button
              onClick={() => {
                setGameMode('vs-ai')
                resetGame()
              }}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                gameMode === 'vs-ai'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              vs AI
            </button>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-red-100 dark:bg-red-900 rounded-lg p-2">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">X</div>
              <div className="text-sm text-red-500">{score.X}</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
              <div className="text-lg font-bold text-gray-600 dark:text-gray-400">Ties</div>
              <div className="text-sm text-gray-500">{score.ties}</div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">O</div>
              <div className="text-sm text-blue-500">{score.O}</div>
            </div>
          </div>

          {/* Status */}
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {getStatusMessage()}
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => makeMove(index)}
              disabled={cell !== null || winner !== null || isThinking}
              className={`w-20 h-20 text-3xl font-bold rounded-lg transition-all duration-200 ${
                cell === 'X'
                  ? 'bg-red-500 text-white'
                  : cell === 'O'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-400'
              } ${(cell !== null || winner !== null || isThinking) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <AnimatePresence>
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {cell}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            🔄 New Game
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetScore}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            📊 Reset Score
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
