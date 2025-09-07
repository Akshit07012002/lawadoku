import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SudokuGrid } from './SudokuGrid'

export const SudokuPage: React.FC = () => {
    const navigate = useNavigate()
    const [isCompleted, setIsCompleted] = useState(false)

    const handleComplete = () => {
        setIsCompleted(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        ← Back to Hub
                    </button>
                </div>
                <SudokuGrid onComplete={handleComplete} />
            </div>

            {/* Completion Screen */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setIsCompleted(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Celebration Animation */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                                className="text-8xl mb-6"
                            >
                                🎉
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
                            >
                                Congratulations!
                            </motion.h2>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-gray-600 dark:text-gray-300 mb-6"
                            >
                                You solved the Sudoku puzzle! 🧩
                            </motion.p>

                            {/* Stats */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6"
                            >
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    🏆 Puzzle Master!
                                </div>
                                <p className="text-sm text-blue-500 dark:text-blue-300">
                                    Your logical thinking skills are impressive!
                                </p>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex gap-3 justify-center"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setIsCompleted(false)
                                        // Trigger new game - you might want to add this functionality
                                        window.location.reload()
                                    }}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
                                >
                                    🔄 Play Again
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/')}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium transition-colors"
                                >
                                    🏠 Back to Hub
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
