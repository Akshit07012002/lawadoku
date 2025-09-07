import React from 'react';
import { motion } from 'framer-motion';
import { Modal, Button } from '../../../shared/components';
import { formatTime } from '../utils';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  onBackToHub: () => void;
  time: number;
  hintsUsed: number;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  onPlayAgain,
  onBackToHub,
  time,
  hintsUsed,
}) => {
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
          🎉
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Congratulations!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 dark:text-gray-400 mb-6"
        >
          You solved the Sudoku puzzle! 🧩
        </motion.p>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatTime(time)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {hintsUsed}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Hints Used</div>
            </div>
          </div>
        </motion.div>
        
        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
        >
          🏆 Puzzle Master!
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 justify-center"
        >
          <Button
            variant="primary"
            onClick={onPlayAgain}
            className="flex items-center gap-2"
          >
            🔄 Play Again
          </Button>
          <Button
            variant="secondary"
            onClick={onBackToHub}
            className="flex items-center gap-2"
          >
            🏠 Back to Hub
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default CompletionModal;
