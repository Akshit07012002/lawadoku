import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
    const [gameWon, setGameWon] = useState(false)
    const [showLoveMessage, setShowLoveMessage] = useState(false)

    const initializeBoard = useCallback(() => {
        const newBoard: Tile[][] = Array(4).fill(null).map(() => Array(4).fill(null))
        addRandomTile(newBoard)
        addRandomTile(newBoard)
        setBoard(newBoard)
    }, [])

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

    const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => [...row])
            let moved = false
            let newScore = score

            const moveInDirection = () => {
                if (direction === 'left' || direction === 'right') {
                    for (let i = 0; i < 4; i++) {
                        const row = newBoard[i].filter(tile => tile)
                        if (direction === 'right') row.reverse()

                        const merged: Tile[] = []
                        for (let j = 0; j < row.length; j++) {
                            if (j + 1 < row.length && row[j].value === row[j + 1].value) {
                                const newValue = (row[j].value * 2) as TileValue
                                merged.push({
                                    id: `${i}-${j}-${Date.now()}`,
                                    value: newValue,
                                    x: direction === 'left' ? j : 3 - j,
                                    y: i,
                                    merged: true
                                })
                                newScore += newValue
                                j++ // Skip next tile
                            } else {
                                merged.push({
                                    ...row[j],
                                    x: direction === 'left' ? j : 3 - j,
                                    merged: false
                                })
                            }
                        }

                        // Fill remaining cells with null
                        while (merged.length < 4) {
                            if (direction === 'left') {
                                merged.push(null as any)
                            } else {
                                merged.unshift(null as any)
                            }
                        }

                        if (direction === 'right') merged.reverse()
                        newBoard[i] = merged
                        if (JSON.stringify(newBoard[i]) !== JSON.stringify(prevBoard[i])) moved = true
                    }
                } else {
                    // Up/Down movement
                    for (let j = 0; j < 4; j++) {
                        const column = newBoard.map(row => row[j]).filter(tile => tile)
                        if (direction === 'down') column.reverse()

                        const merged: Tile[] = []
                        for (let i = 0; i < column.length; i++) {
                            if (i + 1 < column.length && column[i].value === column[i + 1].value) {
                                const newValue = (column[i].value * 2) as TileValue
                                merged.push({
                                    id: `${i}-${j}-${Date.now()}`,
                                    value: newValue,
                                    x: j,
                                    y: direction === 'up' ? i : 3 - i,
                                    merged: true
                                })
                                newScore += newValue
                                i++ // Skip next tile
                            } else {
                                merged.push({
                                    ...column[i],
                                    y: direction === 'up' ? i : 3 - i,
                                    merged: false
                                })
                            }
                        }

                        // Fill remaining cells with null
                        while (merged.length < 4) {
                            if (direction === 'up') {
                                merged.push(null as any)
                            } else {
                                merged.unshift(null as any)
                            }
                        }

                        if (direction === 'down') merged.reverse()
                        for (let i = 0; i < 4; i++) {
                            newBoard[i][j] = merged[i]
                        }
                        if (JSON.stringify(newBoard.map(row => row[j])) !== JSON.stringify(prevBoard.map(row => row[j]))) moved = true
                    }
                }
            }

            moveInDirection()

            if (moved) {
                addRandomTile(newBoard)
                setScore(newScore)

                // Check for win condition (2048 tile)
                const has2048 = newBoard.some(row => row.some(tile => tile?.value === 2048))
                if (has2048 && !gameWon) {
                    setGameWon(true)
                    setShowLoveMessage(true)
                }
            }

            return newBoard
        })
    }, [score, gameWon])

    useEffect(() => {
        initializeBoard()
    }, [initializeBoard])

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault()
                    moveTiles('up')
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    moveTiles('down')
                    break
                case 'ArrowLeft':
                    e.preventDefault()
                    moveTiles('left')
                    break
                case 'ArrowRight':
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
            <div className="bg-white rounded-2xl p-6 max-w-md mx-auto">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-purple-700 mb-2">🔢 2048</h2>
                    <p className="text-gray-600">Score: {score}</p>
                    <p className="text-sm text-gray-500">Use arrow keys to move, ESC to close</p>
                </div>

                <div className="grid grid-cols-4 gap-2 bg-gray-200 p-2 rounded-lg w-64 h-64 mx-auto">
                    {board.flat().map((tile, index) => (
                        <div
                            key={tile?.id || index}
                            className={`w-14 h-14 rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-200 ${tile ? getTileColor(tile.value) : 'bg-gray-100'
                                } ${tile?.merged ? 'scale-110' : ''}`}
                        >
                            {tile ? tile.value : ''}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
            </div>
        </motion.div>
    )
}
