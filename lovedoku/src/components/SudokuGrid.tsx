import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Difficulty } from '../types/sudoku'
import { SudokuCell } from './SudokuCell'
import { GameControls } from './GameControls'
import { useSudokuGame } from '../hooks/useSudokuGame'
import ShinyText from '../blocks/TextAnimations/ShinyText/ShinyText'

interface SudokuGridProps {
    onComplete: () => void
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({ onComplete }) => {
    const [difficulty, setDifficulty] = useState<Difficulty>('medium')


    const {
        grid,
        isCompleted,
        selectedCell,
        timer,
        hintsUsed,
        isLoading,
        error,
        canUndo,
        canRedo,
        handleInputChange,
        handleCellClick,
        getHint,
        undo,
        redo,
        newGame,
        autoSolve,
        isApiKeyConfigured
    } = useSudokuGame(difficulty, onComplete)














    const handleDifficultyChange = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty)
    }

    // Debounced input handler for better performance
    const debounceTimeoutRef = useRef<number | null>(null)

    const debouncedHandleInputChange = useCallback((row: number, col: number, value: string) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = setTimeout(() => {
            handleInputChange(row, col, value)
        }, 50) // 50ms debounce
    }, [handleInputChange])

    // Helper function to find next empty cell in a direction
    const findNextEmptyCell = (row: number, col: number, direction: 'up' | 'down' | 'left' | 'right'): number => {
        switch (direction) {
            case 'up':
                for (let i = row - 1; i >= 0; i--) {
                    if (!grid[i][col].isPrefilled) {
                        return i
                    }
                }
                return row // Stay in place if no empty cell found
            case 'down':
                for (let i = row + 1; i <= 8; i++) {
                    if (!grid[i][col].isPrefilled) {
                        return i
                    }
                }
                return row // Stay in place if no empty cell found
            case 'left':
                for (let i = col - 1; i >= 0; i--) {
                    if (!grid[row][i].isPrefilled) {
                        return i
                    }
                }
                return col // Stay in place if no empty cell found
            case 'right':
                for (let i = col + 1; i <= 8; i++) {
                    if (!grid[row][i].isPrefilled) {
                        return i
                    }
                }
                return col // Stay in place if no empty cell found
            default:
                return direction === 'up' || direction === 'down' ? row : col
        }
    }

    // Global keyboard shortcuts and initial navigation
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            console.info("GLOBAL KEY DOWN", e.key, "selectedCell:", selectedCell);
            // Handle navigation when no cell is selected and not in input
            if (!selectedCell && !(e.target instanceof HTMLInputElement)) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    console.info("NOT IN SELECTED CELL", e.key);
                    e.preventDefault()
                    // Start from top-left if no cell selected
                    handleCellClick(0, 0)
                    return
                }
            }

            // Handle navigation keys globally (desktop only, even when focused on input)
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                // Only enable keyboard navigation on desktop (screen width > 768px)
                if (window.innerWidth > 768) {
                    e.preventDefault()
                    if (!selectedCell) {
                        // Start from top-left if no cell selected
                        handleCellClick(0, 0)
                    } else {
                        // Navigate from current selection
                        const [currentRow, currentCol] = selectedCell
                        let newRow = currentRow
                        let newCol = currentCol

                        switch (e.key) {
                            case 'ArrowUp':
                                newRow = findNextEmptyCell(currentRow, currentCol, 'up')
                                // If no empty cell found in current row, wrap to previous row
                                if (newRow === currentRow && currentRow > 0) {
                                    for (let prevRow = currentRow - 1; prevRow >= 0; prevRow--) {
                                        for (let i = 8; i >= 0; i--) {
                                            if (!grid[prevRow][i].isPrefilled) {
                                                newRow = prevRow
                                                newCol = i
                                                break
                                            }
                                        }
                                        if (newRow !== currentRow) break
                                    }
                                }
                                break
                            case 'ArrowDown':
                                newRow = findNextEmptyCell(currentRow, currentCol, 'down')
                                break
                            case 'ArrowLeft':
                                newCol = findNextEmptyCell(currentRow, currentCol, 'left')
                                break
                            case 'ArrowRight':
                                newCol = findNextEmptyCell(currentRow, currentCol, 'right')
                                // If no empty cell found in current row, wrap to next row
                                if (newCol === currentCol && currentRow < 8) {
                                    for (let nextRow = currentRow + 1; nextRow <= 8; nextRow++) {
                                        for (let i = 0; i <= 8; i++) {
                                            if (!grid[nextRow][i].isPrefilled) {
                                                newRow = nextRow
                                                newCol = i
                                                break
                                            }
                                        }
                                        if (newRow !== currentRow) break
                                    }
                                }
                                break
                            case 'Tab':
                                // Tab: move to next empty cell
                                const nextCell = findNextEmptyCell(currentRow, currentCol, 'right')
                                if (nextCell !== currentCol) {
                                    newCol = nextCell
                                } else if (currentRow < 8) {
                                    newRow = currentRow + 1
                                    newCol = findNextEmptyCell(currentRow + 1, 0, 'right')
                                }
                                break
                        }

                        if (newRow !== currentRow || newCol !== currentCol) {
                            handleCellClick(newRow, newCol)
                        }
                    }
                }
                return
            }

            // Only handle other shortcuts when not typing in an input
            if (e.target instanceof HTMLInputElement) return

            switch (e.key.toLowerCase()) {
                case 'h':
                    e.preventDefault()
                    getHint()
                    break
                case 'u':
                    e.preventDefault()
                    if (canUndo) undo()
                    break
                case 'r':
                    e.preventDefault()
                    if (canRedo) redo()
                    break
                case 'n':
                    e.preventDefault()
                    newGame()
                    break
                case 'escape':
                    e.preventDefault()
                    handleCellClick(-1, -1)
                    break
            }
        }

        window.addEventListener('keydown', handleGlobalKeyDown)
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown)
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [getHint, undo, redo, newGame, canUndo, canRedo, handleCellClick, selectedCell])

    const handleKeyDown = (row: number, col: number, key: string) => {
        // Handle navigation when no cell is selected
        if (!selectedCell) {
            console.info("NOT IN SELECTED CELL", key);
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                // Start from top-left if no cell selected
                handleCellClick(0, 0);
                return;
            }
        }

        let newRow = row;
        let newCol = col;

        switch (key) {
            case 'ArrowUp':
                console.info("ARROW UP", key);
                newRow = findNextEmptyCell(row, col, 'up');
                // If no empty cell found in current row, wrap to previous row
                if (newRow === row && row > 0) {
                    for (let prevRow = row - 1; prevRow >= 0; prevRow--) {
                        for (let i = 8; i >= 0; i--) {
                            if (!grid[prevRow][i].isPrefilled) {
                                newRow = prevRow
                                newCol = i
                                break
                            }
                        }
                        if (newRow !== row) break
                    }
                }
                break;
            case 'ArrowDown':
                console.info("ARROW DOWN", key);
                newRow = findNextEmptyCell(row, col, 'down');
                break;
            case 'ArrowLeft':
                console.info("ARROW LEFT", key);
                newCol = findNextEmptyCell(row, col, 'left');
                break;
            case 'ArrowRight':
                console.info("ARROW RIGHT", key);
                newCol = findNextEmptyCell(row, col, 'right');
                // If no empty cell found in current row, wrap to next row
                if (newCol === col && row < 8) {
                    for (let nextRow = row + 1; nextRow <= 8; nextRow++) {
                        for (let i = 0; i <= 8; i++) {
                            if (!grid[nextRow][i].isPrefilled) {
                                newRow = nextRow
                                newCol = i
                                break
                            }
                        }
                        if (newRow !== row) break
                    }
                }
                break;
            case 'Tab':
                console.info("TAB", key);
                // Tab: move to next empty cell
                const nextCell = findNextEmptyCell(row, col, 'right');
                if (nextCell !== col) {
                    newCol = nextCell;
                } else if (row < 8) {
                    newRow = row + 1;
                    newCol = findNextEmptyCell(row + 1, 0, 'right');
                }
                break
            case 'Enter':
            case 'h':
            case 'H':
                // Get hint
                getHint()
                return
            case 'u':
            case 'U':
                // Undo
                if (canUndo) undo()
                return
            case 'r':
            case 'R':
                // Redo
                if (canRedo) redo()
                return
            case 'n':
            case 'N':
                // New game
                newGame()
                return
            case 'Escape':
                // Clear selection
                handleCellClick(-1, -1)
                return
            default:
                return
        }

        // Update selection if position changed
        if (newRow !== row || newCol !== col) {
            handleCellClick(newRow, newCol)
        }
    }

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
                <div className="flex items-center justify-center h-48 sm:h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-sm sm:text-lg text-gray-600">Generating puzzle...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
                    <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
                    <button
                        onClick={newGame}
                        className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!isApiKeyConfigured) {
        return (
            <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">API Key Required</h3>
                    <p className="text-sm sm:text-base text-yellow-700 mb-4">
                        Please configure your API key in the config file to fetch new puzzles.
                    </p>
                    <p className="text-xs sm:text-sm text-yellow-600">
                        The game will use fallback puzzles until the API key is configured.
                    </p>
                </div>
            </div>
        )
    }

    // Safety check for empty grid
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
                <div className="flex items-center justify-center h-48 sm:h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-sm sm:text-lg text-gray-600">Loading puzzle...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">


            <GameControls
                difficulty={difficulty}
                onDifficultyChange={handleDifficultyChange}
                onNewGame={newGame}
                onUndo={undo}
                onRedo={redo}
                onHint={getHint}
                onAutoSolve={autoSolve}
                timer={timer}
                hintsUsed={hintsUsed}
                canUndo={canUndo}
                canRedo={canRedo}
                isDevelopment={true}
            />

            {/* Puzzle Instructions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-6"
            >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 sm:p-3 md:p-4 shadow-lg border border-blue-200">
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-700 font-medium mb-2">
                        🧩 Solve the puzzle to unlock your special reward... ✨
                    </p>
                    <p className="text-xs text-blue-600">
                        💡 Keyboard shortcuts: Arrow keys/Tab to navigate (desktop), 1-9 to input, H for hint, U/R for undo/redo, N for new game, P for pencil marks, Esc to clear selection
                    </p>
                </div>
            </motion.div>

            <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-2 sm:px-4 md:px-6">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 h-2 overflow-hidden"
                    >
                        <div
                            className="w-[300%] h-full opacity-70 animate-star-movement-top"
                            style={{
                                background: 'radial-gradient(circle, #3b82f6, transparent 10%)',
                                animationDuration: '8s'
                            }}
                        />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-2 overflow-hidden">
                        <div
                            className="w-[300%] h-full opacity-70 animate-star-movement-bottom"
                            style={{
                                background: 'radial-gradient(circle, #3b82f6, transparent 10%)',
                                animationDuration: '8s'
                            }}
                        />
                    </div>

                    <div className="absolute left-0 top-0 w-2 h-full overflow-hidden">
                        <div
                            className="w-full h-[300%] opacity-70 animate-star-movement-left"
                            style={{
                                background: 'radial-gradient(circle, #3b82f6, transparent 10%)',
                                animationDuration: '8s'
                            }}
                        />
                    </div>

                    <div className="absolute right-0 top-0 w-2 h-full overflow-hidden">
                        <div
                            className="w-full h-[300%] opacity-70 animate-star-movement-right"
                            style={{
                                background: 'radial-gradient(circle, #3b82f6, transparent 10%)',
                                animationDuration: '8s'
                            }}
                        />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-2xl p-2 sm:p-3 md:p-4 lg:p-5 border-2 sm:border-4 border-blue-200 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-blue-100/50 rounded-2xl" />

                    <div className="relative z-10">
                        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2 bg-white rounded overflow-hidden border-2 border-gray-300 p-2 sm:p-3 md:p-4">
                            {/* Create 9 3x3 blocks */}
                            {[0, 1, 2].map(blockRow =>
                                [0, 1, 2].map(blockCol => (
                                    <div
                                        key={`block-${blockRow}-${blockCol}`}
                                        className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2 border-2 border-blue-400 rounded p-1 sm:p-1.5 md:p-2 bg-blue-50/30"
                                    >
                                        {[0, 1, 2].map(cellRow =>
                                            [0, 1, 2].map(cellCol => {
                                                const rowIndex = blockRow * 3 + cellRow
                                                const colIndex = blockCol * 3 + cellCol
                                                const cell = grid[rowIndex]?.[colIndex]

                                                // Safety check for cell existence
                                                if (!cell) {
                                                    return null
                                                }

                                                return (
                                                    <SudokuCell
                                                        key={`${rowIndex}-${colIndex}`}
                                                        cell={cell}
                                                        rowIndex={rowIndex}
                                                        colIndex={colIndex}
                                                        selectedCell={selectedCell}
                                                        onCellClick={handleCellClick}
                                                        onInputChange={debouncedHandleInputChange}
                                                        onKeyDown={handleKeyDown}
                                                    />
                                                )
                                            })
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {isCompleted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="mt-6 text-center"
                        >
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg border-2 border-green-300">
                                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span className="text-lg sm:text-2xl">🎉</span>
                                    <ShinyText
                                        text="Puzzle completed! Loading reward..."
                                        disabled={false}
                                        speed={2}
                                        className="font-bold text-sm sm:text-base md:text-lg"
                                    />
                                    <span className="text-lg sm:text-2xl">✨</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
