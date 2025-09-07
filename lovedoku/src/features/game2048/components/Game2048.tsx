import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../../../shared/hooks'
import { useHighScores } from '../../../core/providers'
import { useAchievements } from '../../../core/providers'

type TileValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048
interface Tile {
    id: string
    value: TileValue
    x: number
    y: number
    merged?: boolean
}

export const Game2048: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [board, setBoard] = useState<Tile[][]>([])
    const [score, setScore] = useState(0)
    const [bestScore, setBestScore] = useState(0)
    const [gameWon, setGameWon] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [showLoveMessage, setShowLoveMessage] = useState(false)

    const { playSound } = useSound()
    const { addHighScore, getHighScoresForGame } = useHighScores()
    const { checkAchievements } = useAchievements()

    const initializeBoard = useCallback(() => {
        const newBoard: Tile[][] = Array(4).fill(null).map(() => Array(4).fill(null))
        addRandomTile(newBoard)
        addRandomTile(newBoard)
        setBoard(newBoard)
        setScore(0)
        setGameWon(false)
        setGameOver(false)
        setShowLoveMessage(false)
    }, [])

    // Load best score on mount
    useEffect(() => {
        const scores = getHighScoresForGame('game2048')
        if (scores.length > 0) {
            setBestScore(scores[0].score)
        }
    }, [getHighScoresForGame])

    const addRandomTile = (board: Tile[][]) => {
        const emptyCells: [number, number][] = []
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (!board[i][j]) {
                    emptyCells.push([i, j])
                }
            }
        }

        if (emptyCells.length > 0) {
            const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
            const value = Math.random() < 0.9 ? 2 : 4
            board[i][j] = {
                id: `${i}-${j}-${Date.now()}`,
                value,
                x: j,
                y: i
            }
        }
    }

    const checkGameOver = (board: Tile[][]) => {
        // Check if there are empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (!board[i][j]) return false
            }
        }

        // Check if any adjacent cells can merge
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = board[i][j]
                if (
                    (i < 3 && board[i + 1][j]?.value === current?.value) ||
                    (j < 3 && board[i][j + 1]?.value === current?.value)
                ) {
                    return false
                }
            }
        }

        return true
    }

    const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return

        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => row.map(tile => tile ? { ...tile } : null))
            let moved = false
            let scoreGained = 0

            const moveRow = (row: Tile[], reverse: boolean = false) => {
                const filtered = row.filter(tile => tile !== null)
                if (reverse) filtered.reverse()

                const merged: Tile[] = []
                for (let i = 0; i < filtered.length; i++) {
                    if (i < filtered.length - 1 && filtered[i].value === filtered[i + 1].value) {
                        const newValue = (filtered[i].value * 2) as TileValue
                        merged.push({
                            id: `${Date.now()}-${Math.random()}`,
                            value: newValue,
                            x: 0, // Will be set later
                            y: 0, // Will be set later
                            merged: true
                        })
                        scoreGained += newValue
                        i++ // Skip next tile
                    } else {
                        merged.push({ ...filtered[i] })
                    }
                }

                // Pad with nulls
                while (merged.length < 4) {
                    if (reverse) {
                        merged.unshift(null)
                    } else {
                        merged.push(null)
                    }
                }

                if (reverse) merged.reverse()
                return merged
            }

            const moveColumn = (colIndex: number, reverse: boolean = false) => {
                const column = newBoard.map(row => row[colIndex])
                const filtered = column.filter(tile => tile !== null)
                if (reverse) filtered.reverse()

                const merged: Tile[] = []
                for (let i = 0; i < filtered.length; i++) {
                    if (i < filtered.length - 1 && filtered[i].value === filtered[i + 1].value) {
                        const newValue = (filtered[i].value * 2) as TileValue
                        merged.push({
                            id: `${Date.now()}-${Math.random()}`,
                            value: newValue,
                            x: colIndex,
                            y: 0, // Will be set later
                            merged: true
                        })
                        scoreGained += newValue
                        i++ // Skip next tile
                    } else {
                        merged.push({ ...filtered[i] })
                    }
                }

                // Pad with nulls
                while (merged.length < 4) {
                    if (reverse) {
                        merged.unshift(null)
                    } else {
                        merged.push(null)
                    }
                }

                if (reverse) merged.reverse()
                return merged
            }

            if (direction === 'left') {
                for (let i = 0; i < 4; i++) {
                    const newRow = moveRow(newBoard[i], false)
                    for (let j = 0; j < 4; j++) {
                        if (newRow[j]) {
                            newRow[j].x = j
                            newRow[j].y = i
                        }
                    }
                    if (JSON.stringify(newRow) !== JSON.stringify(prevBoard[i])) {
                        moved = true
                    }
                    newBoard[i] = newRow
                }
            } else if (direction === 'right') {
                for (let i = 0; i < 4; i++) {
                    const newRow = moveRow(newBoard[i], true)
                    for (let j = 0; j < 4; j++) {
                        if (newRow[j]) {
                            newRow[j].x = j
                            newRow[j].y = i
                        }
                    }
                    if (JSON.stringify(newRow) !== JSON.stringify(prevBoard[i])) {
                        moved = true
                    }
                    newBoard[i] = newRow
                }
            } else if (direction === 'up') {
                for (let j = 0; j < 4; j++) {
                    const newColumn = moveColumn(j, false)
                    for (let i = 0; i < 4; i++) {
                        if (newColumn[i]) {
                            newColumn[i].x = j
                            newColumn[i].y = i
                        }
                        newBoard[i][j] = newColumn[i]
                    }
                    if (JSON.stringify(newColumn) !== JSON.stringify(prevBoard.map(row => row[j]))) {
                        moved = true
                    }
                }
            } else if (direction === 'down') {
                for (let j = 0; j < 4; j++) {
                    const newColumn = moveColumn(j, true)
                    for (let i = 0; i < 4; i++) {
                        if (newColumn[i]) {
                            newColumn[i].x = j
                            newColumn[i].y = i
                        }
                        newBoard[i][j] = newColumn[i]
                    }
                    if (JSON.stringify(newColumn) !== JSON.stringify(prevBoard.map(row => row[j]))) {
                        moved = true
                    }
                }
            }

            if (moved) {
                addRandomTile(newBoard)
                const newScore = score + scoreGained
                setScore(newScore)
                playSound('click')

                // Check for win condition (2048 tile)
                const has2048 = newBoard.some(row => row.some(tile => tile?.value === 2048))
                if (has2048 && !gameWon) {
                    setGameWon(true)
                    playSound('win')
                    setTimeout(() => setShowLoveMessage(true), 1000)
                }

                // Check for game over
                const isGameOver = checkGameOver(newBoard)
                if (isGameOver) {
                    setGameOver(true)
                    playSound('error')
                }

                // Check achievements
                checkAchievements('game2048', newScore)
            } else {
                playSound('click')
            }

            return newBoard
        })
    }, [score, gameWon, gameOver, playSound, checkAchievements])

    useEffect(() => {
        initializeBoard()
    }, [initializeBoard])

    // Touch gesture handling for mobile
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        })
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        })
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distanceX = touchStart.x - touchEnd.x
        const distanceY = touchStart.y - touchEnd.y
        const isLeftSwipe = distanceX > minSwipeDistance
        const isRightSwipe = distanceX < -minSwipeDistance
        const isUpSwipe = distanceY > minSwipeDistance
        const isDownSwipe = distanceY < -minSwipeDistance

        if (isLeftSwipe) {
            moveTiles('left')
        } else if (isRightSwipe) {
            moveTiles('right')
        } else if (isUpSwipe) {
            moveTiles('up')
        } else if (isDownSwipe) {
            moveTiles('down')
        }
    }

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault()
                    moveTiles('up')
                    break
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault()
                    moveTiles('down')
                    break
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault()
                    moveTiles('left')
                    break
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault()
                    moveTiles('right')
                    break
                case 'Escape':
                    onClose()
                    break
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [moveTiles, onClose])

    const getTileColor = (value: TileValue) => {
        const colors = {
            2: 'bg-red-100 text-red-800',
            4: 'bg-orange-100 text-orange-800',
            8: 'bg-yellow-100 text-yellow-800',
            16: 'bg-green-100 text-green-800',
            32: 'bg-blue-100 text-blue-800',
            64: 'bg-indigo-100 text-indigo-800',
            128: 'bg-purple-100 text-purple-800',
            256: 'bg-pink-100 text-pink-800',
            512: 'bg-rose-100 text-rose-800',
            1024: 'bg-amber-100 text-amber-800',
            2048: 'bg-gradient-to-br from-pink-400 to-red-500 text-white'
        }
        return colors[value] || 'bg-gray-100 text-gray-800'
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 max-w-sm w-full"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="text-center mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400 mb-2">🔢 2048</h2>
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Score: <span className="font-bold">{score}</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Best: <span className="font-bold">{bestScore}</span>
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Use arrow keys or swipe to move
                    </p>
                </div>

                <div
                    className="grid grid-cols-4 gap-1 sm:gap-2 bg-gray-200 dark:bg-gray-700 p-1 sm:p-2 rounded-lg w-full aspect-square mx-auto relative"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {board.flat().map((tile, index) => (
                        <motion.div
                            key={tile?.id || index}
                            className={`w-full h-full rounded sm:rounded-lg flex items-center justify-center text-sm sm:text-lg font-bold transition-all duration-200 ${tile ? getTileColor(tile.value) : 'bg-gray-100 dark:bg-gray-600'
                                } ${tile?.merged ? 'scale-110' : ''}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.01 }}
                        >
                            {tile ? tile.value : ''}
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Controls */}
                <div className="grid grid-cols-2 gap-2 mt-4 sm:hidden">
                    <button
                        onClick={() => moveTiles('up')}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                        ↑ Up
                    </button>
                    <button
                        onClick={() => moveTiles('down')}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                        ↓ Down
                    </button>
                    <button
                        onClick={() => moveTiles('left')}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                        ← Left
                    </button>
                    <button
                        onClick={() => moveTiles('right')}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                        → Right
                    </button>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={initializeBoard}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        New Game
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Close Game
                    </button>
                </div>

                {/* Love Unlock Message */}
                <AnimatePresence>
                    {showLoveMessage && (
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
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-2xl font-bold text-green-700 mb-4">You Won! 🎉</h3>
                                <p className="text-lg text-green-600 mb-6">
                                    Congratulations! You've reached 2048!
                                </p>
                                <button
                                    onClick={() => setShowLoveMessage(false)}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                                >
                                    Continue
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}
