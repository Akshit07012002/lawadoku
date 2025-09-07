import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GameHub } from './GameHub'
import { SudokuPage } from './SudokuPage'
import { Minesweeper } from './Minesweeper'
import { SnakeGame } from './SnakeGame'
import { Game2048 } from './Game2048'
import { TicTacToe } from './TicTacToe'
import { MemoryGame } from './MemoryGame'
import { TriviaGame } from './TriviaGame'

export const AppRouter: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        {/* Home/Hub Route */}
        <Route path="/" element={<GameHub />} />

        {/* Game Routes */}
        <Route path="/sudoku" element={<SudokuPage />} />

        <Route
          path="/minesweeper"
          element={
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
              <Minesweeper onClose={() => window.history.back()} />
            </div>
          }
        />

        <Route
          path="/snake"
          element={
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
              <SnakeGame onClose={() => window.history.back()} />
            </div>
          }
        />

        <Route
          path="/2048"
          element={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
              <Game2048 onClose={() => window.history.back()} />
            </div>
          }
        />

        <Route
          path="/tic-tac-toe"
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
              <TicTacToe onClose={() => window.history.back()} />
            </div>
          }
        />

        <Route
          path="/memory"
          element={
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
              <MemoryGame onClose={() => window.history.back()} />
            </div>
          }
        />

        <Route
          path="/trivia"
          element={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
              <TriviaGame onClose={() => window.history.back()} />
            </div>
          }
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
