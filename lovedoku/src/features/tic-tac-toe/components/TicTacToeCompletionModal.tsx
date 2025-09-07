import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../../shared/components/Modal';

interface TicTacToeCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  onBackToHub: () => void;
  winner: 'X' | 'O' | 'tie' | null;
  score: { X: number; O: number; ties: number };
}

const TicTacToeCompletionModal: React.FC<TicTacToeCompletionModalProps> = ({
  isOpen,
  onClose,
  onPlayAgain,
  onBackToHub,
  winner,
  score,
}) => {
  const getWinnerMessage = () => {
    if (winner === 'tie') return "It's a Tie!";
    if (winner === 'X') return "Player X Wins!";
    if (winner === 'O') return "Player O Wins!";
    return "Game Over!";
  };

  const getWinnerEmoji = () => {
    if (winner === 'tie') return '🤝';
    if (winner === 'X') return '❌';
    if (winner === 'O') return '⭕';
    return '🎮';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnOverlayClick={false}
      closeOnEscape={true}
    >
      <div className="text-center">
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-6xl mb-4"
        >
          {getWinnerEmoji()}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
        >
          {getWinnerMessage()}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 dark:text-gray-400 mb-6"
        >
          {winner === 'tie' 
            ? 'Great game! Both players played well! 🎯'
            : `Congratulations to ${winner}! Well played! 🏆`
          }
        </motion.p>
        
        {/* Score Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Game Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{score.X}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">X Wins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score.O}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">O Wins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{score.ties}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ties</div>
            </div>
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayAgain}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            🔄 Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToHub}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            🏠 Back to Hub
          </motion.button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default TicTacToeCompletionModal;
