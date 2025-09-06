import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Cell } from '../types/sudoku'
import GlareHover from '../blocks/Animations/GlareHover/GlareHover'

interface SudokuCellProps {
    cell: Cell
    rowIndex: number
    colIndex: number
    selectedCell: [number, number] | null
    showPencilMarks: boolean
    onCellClick: (row: number, col: number) => void
    onInputChange: (row: number, col: number, value: string) => void
    onTogglePencilMark: (row: number, col: number, number: number) => void
    onKeyDown?: (row: number, col: number, key: string) => void
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
    cell,
    rowIndex,
    colIndex,
    selectedCell,
    showPencilMarks,
    onCellClick,
    onInputChange,
    onTogglePencilMark,
    onKeyDown
}) => {
    const inputRef = useRef<HTMLInputElement>(null)

    // Focus input when this cell becomes selected
    useEffect(() => {
        if (selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex) {
            if (inputRef.current && !cell.isPrefilled && !showPencilMarks) {
                inputRef.current.focus()
            }
        }
    }, [selectedCell, rowIndex, colIndex, cell.isPrefilled, showPencilMarks])
    // All cells have white background - 3x3 blocks are now externally bordered
    const getBoxBackground = () => {
        return 'bg-white'
    }

    // Get cell styling based on state
    const getCellStyling = () => {
        let baseClasses = 'w-full h-full flex items-center justify-center text-sm sm:text-base md:text-lg lg:text-xl font-bold relative transition-all duration-200 ease-in-out hover:shadow-md rounded-sm'

        // No internal 3x3 borders - these will be handled externally

        // Add subtle borders for all cells
        baseClasses += ' border border-gray-300 shadow-sm'

        // Handle cell-specific styling - no highlighting
        if (cell.isConflicting) {
            baseClasses += ' bg-red-100 border-red-300 shadow-sm'
        } else if (cell.isIncorrect) {
            baseClasses += ' bg-orange-100 border-orange-300 shadow-sm'
        } else if (cell.isPrefilled) {
            // Prefilled cells - no special background
            baseClasses += ' text-blue-700'
        } else {
            // Regular empty cells
            baseClasses += ` ${getBoxBackground()}`
        }

        return baseClasses
    }

    return (
        <GlareHover
            key={`${rowIndex}-${colIndex}`}
            width="100%"
            height="100%"
            background="transparent"
            className="w-full h-full"
        >
            <div
                className={getCellStyling()}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onKeyDown={(e) => {
                    // Handle cell-level keyboard events
                    if (['Enter', ' '].includes(e.key)) {
                        e.preventDefault()
                        onCellClick(rowIndex, colIndex)
                    }
                }}
                tabIndex={0}
                style={{ aspectRatio: '1 / 1' }}
            >
                {cell.isPrefilled ? (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: rowIndex * 0.1 + colIndex * 0.01 }}
                        className="text-blue-700 font-bold"
                    >
                        {cell.value}
                    </motion.span>
                ) : showPencilMarks ? (
                    <div className="absolute inset-0 p-0.5">
                        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0 text-xs">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button
                                    key={num}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onTogglePencilMark(rowIndex, colIndex, num)
                                    }}
                                    className={`w-full h-full flex items-center justify-center text-xs leading-none ${cell.pencilMarks.includes(num)
                                        ? 'text-blue-700 font-bold bg-blue-100'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <input
                        ref={inputRef}
                        type="text"
                        className={`w-full h-full text-center text-sm sm:text-base md:text-lg lg:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gradient-to-br focus:from-blue-50 focus:to-blue-25 transition-all duration-200 rounded-sm bg-transparent ${cell.isConflicting ? 'text-red-600' : cell.isIncorrect ? 'text-orange-600' : 'text-gray-700'
                            }`}
                        maxLength={1}
                        pattern="[1-9]"
                        inputMode="numeric"
                        value={cell.value || ""}
                        autoFocus={false}
                        onChange={(e) => onInputChange(rowIndex, colIndex, e.target.value)}
                        onKeyDown={(e) => {
                            console.info("KEY DOWN", e.key);
                            // Handle special keys first
                            if (['h', 'H', 'u', 'U', 'r', 'R', 'n', 'N', 'p', 'P', 'Escape'].includes(e.key)) {
                                e.preventDefault()
                                e.stopPropagation()
                                if (onKeyDown) {
                                    onKeyDown(rowIndex, colIndex, e.key)
                                }
                                return
                            }

                            // Let navigation keys bubble up to global handler (desktop only)
                            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                // Only let global handler take care of navigation on desktop
                                if (window.innerWidth > 768) {
                                    return
                                } else {
                                    // On mobile, prevent default to avoid unwanted scrolling
                                    e.preventDefault()
                                    return
                                }
                            }

                            // Handle input keys
                            if (e.key === 'Backspace' || e.key === 'Delete') {
                                e.preventDefault()
                                onInputChange(rowIndex, colIndex, '')
                                return
                            }

                            // Allow only numbers 1-9
                            if (e.key >= '1' && e.key <= '9') {
                                e.preventDefault()
                                // Immediate visual feedback
                                const input = e.target as HTMLInputElement
                                input.value = e.key
                                onInputChange(rowIndex, colIndex, e.key)
                                return
                            }

                            // Prevent all other keys
                            e.preventDefault()
                        }}
                        style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)' }}
                    />
                )}
            </div>
        </GlareHover>
    )
}
