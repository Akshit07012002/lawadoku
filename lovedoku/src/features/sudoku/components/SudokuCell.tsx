import React from 'react';
import { motion } from 'framer-motion';
import { Cell } from '../types';

interface SudokuCellProps {
    cell: Cell;
    row: number;
    col: number;
    onClick: (row: number, col: number) => void;
    onInputChange: (row: number, col: number, value: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    isSelected: boolean;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
    cell,
    row,
    col,
    onClick,
    onInputChange,
    onKeyDown,
    isSelected,
}) => {
    const handleClick = () => {
        onClick(row, col);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || (value >= '1' && value <= '9')) {
            onInputChange(row, col, value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Only handle number input and other non-navigation keys for the selected cell
        if (isSelected && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            onKeyDown(e);
        }
    };

    const getCellClasses = () => {
        let classes = 'w-full h-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200';

        // Add borders based on position in 3x3 boxes
        const isRightBox = col % 3 === 2;
        const isBottomBox = row % 3 === 2;
        const isLeftBox = col % 3 === 0;
        const isTopBox = row % 3 === 0;

        // Regular cell borders
        classes += ' border border-gray-300 dark:border-gray-600';

        // Thicker borders for 3x3 box boundaries
        if (isRightBox) {
            classes += ' border-r-2 border-r-gray-500 dark:border-r-gray-400';
        }
        if (isBottomBox) {
            classes += ' border-b-2 border-b-gray-500 dark:border-b-gray-400';
        }
        if (isLeftBox) {
            classes += ' border-l-2 border-l-gray-500 dark:border-l-gray-400';
        }
        if (isTopBox) {
            classes += ' border-t-2 border-t-gray-500 dark:border-t-gray-400';
        }

        // Add subtle background for 3x3 boxes (alternating pattern)
        const boxRow = Math.floor(row / 3);
        const boxCol = Math.floor(col / 3);
        const isEvenBox = (boxRow + boxCol) % 2 === 0;

        if (isEvenBox) {
            classes += ' bg-gray-50 dark:bg-gray-800';
        }

        // Base styling (only if not in a 3x3 box background)
        if (!isEvenBox) {
            if (cell.isPrefilled) {
                classes += ' bg-gray-100 dark:bg-gray-700 font-bold text-gray-900 dark:text-white';
            } else {
                classes += ' bg-white dark:bg-gray-800 text-gray-900 dark:text-white';
            }
        } else {
            // For cells in 3x3 box backgrounds, just set text color
            classes += ' text-gray-900 dark:text-white';
            if (cell.isPrefilled) {
                classes += ' font-bold';
            }
        }

        // Error states
        if (cell.isConflicting) {
            classes += ' bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100';
        } else if (cell.isIncorrect) {
            classes += ' bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100';
        }

        // Selection state
        if (isSelected) {
            classes += ' ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900';
        }

        // Make prefilled cells focusable for navigation
        if (cell.isPrefilled && !isSelected) {
            classes += ' cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700';
        }

        // Highlight state
        if (cell.isHighlighted && !isSelected) {
            classes += ' bg-blue-50 dark:bg-blue-900';
        }

        return classes;
    };

    return (
        <motion.div
            className="aspect-square flex items-center justify-center relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-row={row}
            data-col={col}
        >
            <input
                type="text"
                value={cell.value?.toString() || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                className={getCellClasses()}
                disabled={cell.isPrefilled}
                maxLength={1}
                inputMode="numeric"
                pattern="[1-9]"
            />
        </motion.div>
    );
};

export default SudokuCell;
