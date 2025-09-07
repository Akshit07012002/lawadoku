import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Difficulty } from '../../../shared/types';
import { GAME_CONFIG } from '../../../shared/constants';
import { useSudokuGame } from '../hooks';
import { SudokuGrid, GameControls, CompletionModal } from '../components';
import { GameLayout } from '../../../layouts';

const SudokuPage: React.FC = () => {
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [isCompleted, setIsCompleted] = useState(false);

    const {
        grid,
        solution,
        selectedCell,
        timer,
        hintsUsed,
        isLoading,
        error,
        handleInputChange,
        handleCellClick,
        handleKeyDown,
        getHint,
        undo,
        redo,
        newGame,
        autoSolve,
        setDifficulty: changeDifficulty,
        canUndo,
        canRedo,
        isApiKeyConfigured,
    } = useSudokuGame(difficulty, () => setIsCompleted(true));

    const handleComplete = () => {
        setIsCompleted(true);
    };

    const handlePlayAgain = () => {
        setIsCompleted(false);
        newGame();
    };

    const handleBackToHub = () => {
        navigate('/');
    };

    const handleDifficultyChange = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
        changeDifficulty(newDifficulty);
    };

    if (error) {
        return (
            <GameLayout title="Sudoku" onBack={handleBackToHub}>
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                    <button
                        onClick={newGame}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </GameLayout>
        );
    }

    // Remove the API key check - let the hook handle fallback automatically

    return (
        <GameLayout title="Sudoku" onBack={handleBackToHub}>
            <div className="max-w-4xl mx-auto">
                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        🧩 Complete the puzzle to test your skills! 🎯
                    </p>
                </motion.div>

                {/* Game Controls */}
                <GameControls
                    timer={timer}
                    hintsUsed={hintsUsed}
                    maxHints={GAME_CONFIG.SUDOKU.MAX_HINTS}
                    difficulty={difficulty}
                    isLoading={isLoading}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onNewGame={newGame}
                    onUndo={undo}
                    onRedo={redo}
                    onGetHint={getHint}
                    onAutoSolve={autoSolve}
                    onDifficultyChange={handleDifficultyChange}
                />

                {/* Sudoku Grid */}
                <SudokuGrid
                    grid={grid}
                    selectedCell={selectedCell}
                    onCellClick={handleCellClick}
                    onInputChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />

                {/* Completion Modal */}
                <CompletionModal
                    isOpen={isCompleted}
                    onClose={() => setIsCompleted(false)}
                    onPlayAgain={handlePlayAgain}
                    onBackToHub={handleBackToHub}
                    time={timer}
                    hintsUsed={hintsUsed}
                />
            </div>
        </GameLayout>
    );
};

export default SudokuPage;
