import { Difficulty } from '../../shared/types';

export interface Cell {
  value: number | null;
  isPrefilled: boolean;
  isConflicting: boolean;
  isIncorrect: boolean;
  isHighlighted: boolean;
}

export interface GridState {
  grid: Cell[][];
  solution: number[][];
}

export interface HistoryEntry {
  grid: Cell[][];
  value: string | number;
  row: number;
  col: number;
}

export interface SudokuGameState {
  grid: Cell[][];
  solution: number[][];
  isCompleted: boolean;
  selectedCell: [number, number] | null;
  timer: number;
  isTimerRunning: boolean;
  hintsUsed: number;
  history: HistoryEntry[];
  historyIndex: number;
  isLoading: boolean;
  error: string | null;
  difficulty: Difficulty;
}

export interface SudokuGameActions {
  handleInputChange: (row: number, col: number, value: string) => void;
  handleCellClick: (row: number, col: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  newGame: () => void;
  undo: () => void;
  redo: () => void;
  getHint: () => void;
  autoSolve: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
}

export interface SudokuGameHook extends SudokuGameState, SudokuGameActions {
  canUndo: boolean;
  canRedo: boolean;
  isApiKeyConfigured: boolean;
}
