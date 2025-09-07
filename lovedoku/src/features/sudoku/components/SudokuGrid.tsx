import React from 'react';
import { motion } from 'framer-motion';
import { Cell } from '../types';
import SudokuCell from './SudokuCell';

interface SudokuGridProps {
    grid: Cell[][];
    selectedCell: [number, number] | null;
    onCellClick: (row: number, col: number) => void;
    onInputChange: (row: number, col: number, value: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
    grid,
    selectedCell,
    onCellClick,
    onInputChange,
    onKeyDown,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-9 gap-0.5 sm:gap-1 p-2 sm:p-4 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md mx-auto border-2 border-gray-400 dark:border-gray-600"
            onKeyDown={onKeyDown}
            tabIndex={0}
        >
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <SudokuCell
                        key={`${rowIndex}-${colIndex}`}
                        cell={cell}
                        row={rowIndex}
                        col={colIndex}
                        onClick={onCellClick}
                        onInputChange={onInputChange}
                        onKeyDown={onKeyDown}
                        isSelected={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex}
                    />
                ))
            )}
        </motion.div>
    );
};

export default SudokuGrid;
