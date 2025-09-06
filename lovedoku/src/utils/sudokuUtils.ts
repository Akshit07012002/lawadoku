import { Cell, Difficulty } from '../types/sudoku'

// Check if a move is valid (follows Sudoku rules)
export const isValidMove = (currentGrid: Cell[][], row: number, col: number, value: string): boolean => {
  if (!value || value === '') return true
  
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && currentGrid[row][c].value === value) return false
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && currentGrid[r][col].value === value) return false
  }
  
  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && currentGrid[r][c].value === value) return false
    }
  }
  
  return true
}

// Check if the puzzle is completed
export const checkCompletion = (currentGrid: Cell[][]): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!currentGrid[i][j].value || currentGrid[i][j].value === '') {
        return false
      }
    }
  }
  return true
}

// Format timer display
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Get difficulty-based clue counts
export const getDifficultyClues = (difficulty: Difficulty): number => {
  const difficultyClues = {
    easy: 45,    // 36 clues removed
    medium: 35,  // 46 clues removed
    hard: 25     // 56 clues removed
  }
  return difficultyClues[difficulty]
}

// Create a new empty cell
export const createEmptyCell = (row: number, col: number): Cell => ({
  value: '',
  isPrefilled: false,
  row,
  col,
  pencilMarks: [],
  isConflicting: false,
  isHighlighted: false,
  isIncorrect: false
})

// Create a pre-filled cell
export const createPrefilledCell = (row: number, col: number, value: number): Cell => ({
  value,
  isPrefilled: true,
  row,
  col,
  pencilMarks: [],
  isConflicting: false,
  isHighlighted: false,
  isIncorrect: false
})
