import React from 'react'
import { Difficulty } from '../types/sudoku'
import { formatTime } from '../utils/sudokuUtils'

interface GameControlsProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onNewGame: () => void
  onUndo: () => void
  onRedo: () => void
  onHint: () => void
  onTogglePencilMarks: () => void
  onAutoSolve: () => void
  timer: number
  hintsUsed: number
  showPencilMarks: boolean
  canUndo: boolean
  canRedo: boolean
  isDevelopment?: boolean
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onUndo,
  onRedo,
  onHint,
  onTogglePencilMarks,
  onAutoSolve,
  timer,
  hintsUsed,
  showPencilMarks,
  canUndo,
  canRedo,
  isDevelopment = false
}) => {
  return (
    <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 sm:gap-4 bg-white rounded-xl p-2 sm:p-4 shadow-lg">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
          className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={onNewGame}
          className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Game
        </button>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
        <div className="text-xs sm:text-sm md:text-lg font-semibold text-gray-700">
          Time: {formatTime(timer)}
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↩️
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↪️
          </button>
        </div>

        <button
          onClick={onHint}
          disabled={hintsUsed >= 3}
          className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          💡
        </button>

        <button
          onClick={onTogglePencilMarks}
          className={`px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${showPencilMarks
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
        >
          ✏️
        </button>

        {/* Development-only autosolve button */}
        {isDevelopment && (
          <button
            onClick={onAutoSolve}
            className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🚀
          </button>
        )}
      </div>
    </div>
  )
}
