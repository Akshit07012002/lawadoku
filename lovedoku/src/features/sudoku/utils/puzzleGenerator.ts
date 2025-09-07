// Simple Sudoku puzzle generator for fallback when API is not available
export const generateSudokuPuzzle = (difficulty: 'easy' | 'medium' | 'hard'): { puzzle: (number | null)[][], solution: number[][] } => {
  // Create a solved Sudoku grid
  const solution = generateSolvedGrid();
  
  // Remove numbers based on difficulty
  const puzzle = removeNumbers(solution, difficulty);
  
  return { puzzle, solution };
};

const generateSolvedGrid = (): number[][] => {
  const grid: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first
  fillDiagonalBoxes(grid);
  
  // Fill remaining cells
  fillRemainingCells(grid, 0, 3);
  
  return grid;
};

const fillDiagonalBoxes = (grid: number[][]): void => {
  for (let i = 0; i < 9; i += 3) {
    fillBox(grid, i, i);
  }
};

const fillBox = (grid: number[][], row: number, col: number): void => {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(nums);
  
  let index = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[row + i][col + j] = nums[index++];
    }
  }
};

const fillRemainingCells = (grid: number[][], i: number, j: number): boolean => {
  if (j >= 9 && i < 8) {
    i++;
    j = 0;
  }
  
  if (i >= 9 && j >= 9) {
    return true;
  }
  
  if (i < 3) {
    if (j < 3) j = 3;
  } else if (i < 6) {
    if (j === Math.floor(i / 3) * 3) j += 3;
  } else {
    if (j === 6) {
      i++;
      j = 0;
      if (i >= 9) return true;
    }
  }
  
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, i, j, num)) {
      grid[i][j] = num;
      if (fillRemainingCells(grid, i, j + 1)) {
        return true;
      }
      grid[i][j] = 0;
    }
  }
  
  return false;
};

const isValidPlacement = (grid: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
};

const removeNumbers = (grid: number[][], difficulty: 'easy' | 'medium' | 'hard'): (number | null)[][] => {
  const puzzle = grid.map(row => [...row]);
  const cellsToRemove = {
    easy: 40,
    medium: 50,
    hard: 60
  };
  
  const cells = [];
  for (let i = 0; i < 81; i++) {
    cells.push(i);
  }
  
  shuffleArray(cells);
  
  for (let i = 0; i < cellsToRemove[difficulty]; i++) {
    const cellIndex = cells[i];
    const row = Math.floor(cellIndex / 9);
    const col = cellIndex % 9;
    puzzle[row][col] = null;
  }
  
  return puzzle;
};

const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
