import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../shared/components';
import { Difficulty } from '../../../shared/types';
import { formatTime } from '../utils';

interface GameControlsProps {
    timer: number;
    hintsUsed: number;
    maxHints: number;
    difficulty: Difficulty;
    isLoading: boolean;
    canUndo: boolean;
    canRedo: boolean;
    onNewGame: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onGetHint: () => void;
    onAutoSolve: () => void;
    onDifficultyChange: (difficulty: Difficulty) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
    timer,
    hintsUsed,
    maxHints,
    difficulty,
    isLoading,
    canUndo,
    canRedo,
    onNewGame,
    onUndo,
    onRedo,
    onGetHint,
    onAutoSolve,
    onDifficultyChange,
}) => {
    const difficultyOptions: { value: Difficulty; label: string }[] = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
            {/* Timer and Stats */}
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatTime(timer)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Time</div>
                </div>

                <div className="text-center">
                    <div className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
                        {hintsUsed}/{maxHints}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Hints</div>
                </div>

                <div className="text-center">
                    <div className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {difficulty}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Difficulty</div>
                </div>
            </div>

            {/* Difficulty Selector */}
            <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                </label>
                <div className="flex gap-1 sm:gap-2">
                    {difficultyOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={difficulty === option.value ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => onDifficultyChange(option.value)}
                            disabled={isLoading}
                            className="text-xs sm:text-sm"
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                    variant="primary"
                    onClick={onNewGame}
                    disabled={isLoading}
                    loading={isLoading}
                >
                    New Game
                </Button>

                <Button
                    variant="secondary"
                    onClick={onGetHint}
                    disabled={isLoading || hintsUsed >= maxHints}
                >
                    Get Hint ({maxHints - hintsUsed})
                </Button>

                <Button
                    variant="ghost"
                    onClick={onUndo}
                    disabled={!canUndo || isLoading}
                >
                    Undo
                </Button>

                <Button
                    variant="ghost"
                    onClick={onRedo}
                    disabled={!canRedo || isLoading}
                >
                    Redo
                </Button>

                <Button
                    variant="danger"
                    onClick={onAutoSolve}
                    disabled={isLoading}
                    className="col-span-2"
                >
                    Auto Solve
                </Button>
            </div>
        </motion.div>
    );
};

export default GameControls;
