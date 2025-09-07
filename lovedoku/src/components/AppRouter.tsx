import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GameHub } from './GameHub'
import { SudokuPage } from '../features/sudoku/pages'
import { Minesweeper } from '../features/minesweeper'
import { SnakeGame } from '../features/snake'
import { Game2048 } from '../features/game2048'
import { TicTacToe } from '../features/tic-tac-toe'
import { MemoryGame } from '../features/memory'
import { TriviaGame } from '../features/trivia'
import { GameLayout } from '../layouts'

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
            <GameLayout title="Minesweeper" onBack={() => window.history.back()}>
              <Minesweeper onClose={() => window.history.back()} />
            </GameLayout>
          }
        />

        <Route
          path="/snake"
          element={
            <GameLayout title="Snake Game" onBack={() => window.history.back()}>
              <SnakeGame onClose={() => window.history.back()} />
            </GameLayout>
          }
        />

        <Route
          path="/2048"
          element={
            <GameLayout title="2048" onBack={() => window.history.back()}>
              <Game2048 onClose={() => window.history.back()} />
            </GameLayout>
          }
        />

        <Route
          path="/tic-tac-toe"
          element={
            <GameLayout title="Tic Tac Toe" onBack={() => window.history.back()}>
              <TicTacToe onClose={() => window.history.back()} />
            </GameLayout>
          }
        />

        <Route
          path="/memory"
          element={
            <GameLayout title="Memory Game" onBack={() => window.history.back()}>
              <MemoryGame onClose={() => window.history.back()} />
            </GameLayout>
          }
        />

        <Route
          path="/trivia"
          element={
            <GameLayout title="Trivia Game" onBack={() => window.history.back()}>
              <TriviaGame onClose={() => window.history.back()} />
            </GameLayout>
          }
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
