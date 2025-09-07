import { Cell, GridState, Difficulty } from './types';
import { GAME_CONFIG } from '../../shared/constants';

// Check if a move is valid according to Sudoku rules
export const isValidMove = (
  grid: Cell[][],
  row: number,
  col: number,
  value: string | number
): boolean => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  
  // Check row
  for (let c = 0; c < GAME_CONFIG.SUDOKU.GRID_SIZE; c++) {
    if (c !== col && grid[row][c].value === numValue) {
      return false;
    }
  }
  
  // Check column
  for (let r = 0; r < GAME_CONFIG.SUDOKU.GRID_SIZE; r++) {
    if (r !== row && grid[r][col].value === numValue) {
      return false;
    }
  }
  
  // Check 3x3 box
  const startRow = Math.floor(row / GAME_CONFIG.SUDOKU.BOX_SIZE) * GAME_CONFIG.SUDOKU.BOX_SIZE;
  const startCol = Math.floor(col / GAME_CONFIG.SUDOKU.BOX_SIZE) * GAME_CONFIG.SUDOKU.BOX_SIZE;
  
  for (let r = startRow; r < startRow + GAME_CONFIG.SUDOKU.BOX_SIZE; r++) {
    for (let c = startCol; c < startCol + GAME_CONFIG.SUDOKU.BOX_SIZE; c++) {
      if ((r !== row || c !== col) && grid[r][c].value === numValue) {
        return false;
      }
    }
  }
  
  return true;
};

// Check if the puzzle is completed
export const checkCompletion = (grid: Cell[][]): boolean => {
  for (let row = 0; row < GAME_CONFIG.SUDOKU.GRID_SIZE; row++) {
    for (let col = 0; col < GAME_CONFIG.SUDOKU.GRID_SIZE; col++) {
      if (!grid[row][col].value) {
        return false;
      }
    }
  }
  return true;
};

// Create an empty cell
export const createEmptyCell = (): Cell => ({
  value: null,
  isPrefilled: false,
  isConflicting: false,
  isIncorrect: false,
  isHighlighted: false,
});

// Create a prefilled cell
export const createPrefilledCell = (value: number): Cell => ({
  value,
  isPrefilled: true,
  isConflicting: false,
  isIncorrect: false,
  isHighlighted: false,
});

// Get difficulty-based clue counts
export const getDifficultyClues = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy':
      return 40;
    case 'medium':
      return 30;
    case 'hard':
      return 20;
    default:
      return 30;
  }
};

// Convert API puzzle format to our grid format
export const convertPuzzleToGrid = (
  puzzle: (number | null)[][],
  solution: number[][]
): GridState => {
  const grid: Cell[][] = [];
  
  for (let row = 0; row < GAME_CONFIG.SUDOKU.GRID_SIZE; row++) {
    const gridRow: Cell[] = [];
    for (let col = 0; col < GAME_CONFIG.SUDOKU.GRID_SIZE; col++) {
      const value = puzzle[row][col];
      if (value !== null) {
        gridRow.push(createPrefilledCell(value));
      } else {
        gridRow.push(createEmptyCell());
      }
    }
    grid.push(gridRow);
  }
  
  return { grid, solution };
};

// Check for conflicts in the grid
export const checkConflicts = (grid: Cell[][]): Cell[][] => {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  
  for (let row = 0; row < GAME_CONFIG.SUDOKU.GRID_SIZE; row++) {
    for (let col = 0; col < GAME_CONFIG.SUDOKU.GRID_SIZE; col++) {
      const cell = newGrid[row][col];
      if (cell.value && !cell.isPrefilled) {
        cell.isConflicting = !isValidMove(newGrid, row, col, cell.value);
      }
    }
  }
  
  return newGrid;
};

// Format time display
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
