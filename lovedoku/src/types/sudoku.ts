export interface Cell {
  value: string | number
  isPrefilled: boolean
  row: number
  col: number
  pencilMarks: number[]
  isConflicting: boolean
  isHighlighted: boolean
  isIncorrect: boolean
}

export interface SudokuGridProps {
  onComplete: () => void
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface SudokuPuzzle {
  puzzle: (number | null)[][]
  solution: number[][]
}

export interface GridState {
  grid: Cell[][]
  solutionGrid: number[][]
}

export interface HistoryEntry {
  grid: Cell[][]
  value: string | number
  row: number
  col: number
}
