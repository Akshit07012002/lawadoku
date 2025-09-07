import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import MinesweeperCompletionModal from './MinesweeperCompletionModal'

interface Cell {
    isMine: boolean
    isRevealed: boolean
    isFlagged: boolean
    neighborMines: number
    x: number
    y: number
}

type Difficulty = 'easy' | 'medium' | 'hard'

export const Minesweeper: React.FC<{ onClose: () => void; onBackToHub?: () => void }> = ({ onClose, onBackToHub }) => {
    const [board, setBoard] = useState<Cell[][]>([])
    const [gameOver, setGameOver] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [firstClick, setFirstClick] = useState(true)
    const [flagMode, setFlagMode] = useState(false)
    const [difficulty, setDifficulty] = useState<Difficulty>('medium')
    const [time, setTime] = useState(0)
    const [flagsUsed, setFlagsUsed] = useState(0)
    const [gameStarted, setGameStarted] = useState(false)
    const [showCompletionModal, setShowCompletionModal] = useState(false)

    const getGameConfig = (diff: Difficulty) => {
        switch (diff) {
            case 'easy':
                return { size: 6, mines: 6 }
            case 'medium':
                return { size: 8, mines: 10 }
            case 'hard':
                return { size: 10, mines: 20 }
            default:
                return { size: 8, mines: 10 }
        }
    }

    const { size: BOARD_SIZE, mines: MINE_COUNT } = getGameConfig(difficulty)

    const initializeBoard = useCallback(() => {
        const newBoard: Cell[][] = []
        for (let i = 0; i < BOARD_SIZE; i++) {
            newBoard[i] = []
            for (let j = 0; j < BOARD_SIZE; j++) {
                newBoard[i][j] = {
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0,
                    x: j,
                    y: i
                }
            }
        }
        setBoard(newBoard)
    }, [])

    const placeMines = useCallback((excludeX: number, excludeY: number) => {
        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => [...row])
            let minesPlaced = 0

            while (minesPlaced < MINE_COUNT) {
                const x = Math.floor(Math.random() * BOARD_SIZE)
                const y = Math.floor(Math.random() * BOARD_SIZE)

                // Don't place mine on first click or already mined cell
                if ((x === excludeX && y === excludeY) || newBoard[y][x].isMine) {
                    continue
                }

                newBoard[y][x].isMine = true
                minesPlaced++
            }

            // Calculate neighbor mine counts
            for (let i = 0; i < BOARD_SIZE; i++) {
                for (let j = 0; j < BOARD_SIZE; j++) {
                    if (!newBoard[i][j].isMine) {
                        let count = 0
                        for (let di = -1; di <= 1; di++) {
                            for (let dj = -1; dj <= 1; dj++) {
                                const ni = i + di
                                const nj = j + dj
                                if (ni >= 0 && ni < BOARD_SIZE && nj >= 0 && nj < BOARD_SIZE) {
                                    if (newBoard[ni][nj].isMine) count++
                                }
                            }
                        }
                        newBoard[i][j].neighborMines = count
                    }
                }
            }

            return newBoard
        })
    }, [])

    const revealCell = useCallback((x: number, y: number) => {
        if (gameOver || board[y][x].isRevealed || board[y][x].isFlagged) return

        if (firstClick) {
            placeMines(x, y)
            setFirstClick(false)
            setGameStarted(true)
        }

        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => [...row])

            if (newBoard[y][x].isMine) {
                // Game over - reveal all mines as hearts
                for (let i = 0; i < BOARD_SIZE; i++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {
                        if (newBoard[i][j].isMine) {
                            newBoard[i][j].isRevealed = true
                        }
                    }
                }
                setGameOver(true)
                setTimeout(() => setShowCompletionModal(true), 1000)
                return newBoard
            }

            const revealRecursive = (cx: number, cy: number) => {
                if (cx < 0 || cx >= BOARD_SIZE || cy < 0 || cy >= BOARD_SIZE) return
                if (newBoard[cy][cx].isRevealed || newBoard[cy][cx].isFlagged) return

                newBoard[cy][cx].isRevealed = true

                if (newBoard[cy][cx].neighborMines === 0) {
                    for (let di = -1; di <= 1; di++) {
                        for (let dj = -1; dj <= 1; dj++) {
                            revealRecursive(cx + dj, cy + di)
                        }
                    }
                }
            }

            revealRecursive(x, y)

            // Check if game is won
            const revealedCount = newBoard.flat().filter(cell => cell.isRevealed).length
            if (revealedCount === BOARD_SIZE * BOARD_SIZE - MINE_COUNT) {
                setGameWon(true)
                setTimeout(() => setShowCompletionModal(true), 1000)
            }

            return newBoard
        })
    }, [board, gameOver, firstClick, placeMines])

    const toggleFlag = useCallback((x: number, y: number) => {
        if (gameOver || board[y][x].isRevealed) return

        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => [...row])
            const wasFlagged = newBoard[y][x].isFlagged
            newBoard[y][x].isFlagged = !wasFlagged

            // Update flag count
            setFlagsUsed(prev => wasFlagged ? prev - 1 : prev + 1)

            return newBoard
        })
    }, [board, gameOver])

    const resetGame = useCallback(() => {
        setGameOver(false)
        setGameWon(false)
        setFirstClick(true)
        setTime(0)
        setFlagsUsed(0)
        setGameStarted(false)
        setShowCompletionModal(false)
        initializeBoard()
    }, [initializeBoard])

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

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (gameStarted && !gameOver && !gameWon) {
            interval = setInterval(() => {
                setTime(prev => prev + 1)
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [gameStarted, gameOver, gameWon])

    useEffect(() => {
        initializeBoard()
    }, [initializeBoard])

    // Reset game when difficulty changes
    useEffect(() => {
        resetGame()
    }, [difficulty, resetGame])

    const getCellContent = (cell: Cell) => {
        if (!cell.isRevealed) {
            return cell.isFlagged ? '🚩' : ''
        }

        if (cell.isMine) {
            return '💣' // Bomb
        }

        if (cell.neighborMines === 0) {
            return ''
        }

        const colors = [
            'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-600',
            'text-red-800', 'text-cyan-600', 'text-gray-600', 'text-pink-600'
        ]

        return (
            <span className={`font-bold text-lg ${colors[cell.neighborMines - 1]}`}>
                {cell.neighborMines}
            </span>
        )
    }

    const getCellClass = (cell: Cell) => {
        if (!cell.isRevealed) {
            return 'bg-gray-300 hover:bg-gray-400 cursor-pointer border-2 border-gray-400 hover:border-gray-500'
        }

        if (cell.isMine) {
            return 'bg-red-200 border-2 border-red-400' // Red background for bombs
        }

        if (cell.neighborMines === 0) {
            return 'bg-gray-50 border border-gray-200'
        }

        return 'bg-white border border-gray-200'
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const getCellSize = () => {
        const maxSize = Math.min(32, Math.floor(400 / BOARD_SIZE))
        return `${maxSize}px`
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
            <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-purple-700 mb-2 flex items-center justify-center gap-2">
                        💣 Minesweeper
                    </h2>
                    <p className="text-gray-600 mb-4">Find all the mines without hitting them!</p>

                    {/* Game Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-100 rounded-lg p-3">
                            <div className="text-2xl font-bold text-blue-600">{formatTime(time)}</div>
                            <div className="text-xs text-gray-500">Time</div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                            <div className="text-2xl font-bold text-red-600">{flagsUsed}/{MINE_COUNT}</div>
                            <div className="text-xs text-gray-500">Flags</div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                            <div className="text-2xl font-bold text-green-600">
                                {board.flat().filter(cell => cell.isRevealed && !cell.isMine).length}
                            </div>
                            <div className="text-xs text-gray-500">Revealed</div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap justify-center gap-3 mb-4">
                        {/* Difficulty Selector */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficulty(diff)}
                                    className={`px-3 py-1 rounded text-sm font-medium transition-all ${difficulty === diff
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Mode Toggle */}
                        <button
                            onClick={() => setFlagMode(!flagMode)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${flagMode
                                    ? 'bg-red-500 text-white'
                                    : 'bg-blue-500 text-white'
                                }`}
                        >
                            {flagMode ? '🚩 Flag Mode' : '🔍 Reveal Mode'}
                        </button>
                    </div>
                </div>

                {/* Game Board */}
                <div className="flex justify-center mb-6">
                    <div
                        className="grid gap-1 bg-gray-400 p-2 rounded-lg shadow-inner"
                        style={{
                            gridTemplateColumns: `repeat(${BOARD_SIZE}, ${getCellSize()})`,
                            gridTemplateRows: `repeat(${BOARD_SIZE}, ${getCellSize()})`
                        }}
                    >
                        {board.map((row, y) =>
                            row.map((cell, x) => (
                                <motion.div
                                    key={`${x}-${y}`}
                                    className={`flex items-center justify-center text-sm font-bold transition-all duration-150 cursor-pointer select-none ${getCellClass(cell)}`}
                                    style={{ width: getCellSize(), height: getCellSize() }}
                                    onClick={() => flagMode ? toggleFlag(x, y) : revealCell(x, y)}
                                    onContextMenu={(e) => {
                                        e.preventDefault()
                                        toggleFlag(x, y)
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {getCellContent(cell)}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Game Status */}
                <div className="text-center space-y-4">
                    {gameOver && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 font-semibold text-xl"
                        >
                            💣 Game Over! 💣
                        </motion.div>
                    )}

                    {gameWon && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-600 font-semibold text-xl"
                        >
                            🎉 Congratulations! You won in {formatTime(time)}! 🎉
                        </motion.div>
                    )}

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
                            onClick={onClose}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                        >
                            ❌ Close
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Completion Modal */}
            <MinesweeperCompletionModal
                isOpen={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
                onPlayAgain={handlePlayAgain}
                onBackToHub={handleBackToHub}
                isWin={gameWon}
                time={time}
                flagsUsed={flagsUsed}
                difficulty={difficulty}
            />
        </motion.div>
    )
}
