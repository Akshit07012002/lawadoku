import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../../../shared/components';

interface MinesweeperCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  onBackToHub: () => void;
  isWin: boolean;
  time: number;
  flagsUsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const MinesweeperCompletionModal: React.FC<MinesweeperCompletionModalProps> = ({
  isOpen,
  onClose,
  onPlayAgain,
  onBackToHub,
  isWin,
  time,
  flagsUsed,
  difficulty,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          {isWin ? '🏆💣' : '💥💣'}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
        >
          {isWin ? 'Minesweeper Hero!' : 'Game Over!'}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 dark:text-gray-400 mb-6"
        >
          {isWin 
            ? `You cleared all mines on ${difficulty} difficulty! 🎯`
            : 'Better luck next time! Try again! 💪'
          }
        </motion.p>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatTime(time)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{flagsUsed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Flags Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{difficulty}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Difficulty</div>
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

export default MinesweeperCompletionModal;
