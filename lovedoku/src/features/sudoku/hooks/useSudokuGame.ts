import { useState, useCallback, useEffect } from 'react';
import { SudokuGameHook, Cell, HistoryEntry } from '../types';
import { Difficulty } from '../../../shared/types';
import { SudokuApi } from '../../../core/api';
import { GAME_CONFIG } from '../../../shared/constants';
import { 
  isValidMove, 
  checkCompletion, 
  convertPuzzleToGrid,
  checkConflicts
} from '../utils';
import { generateSudokuPuzzle } from '../utils/puzzleGenerator';

export const useSudokuGame = (difficulty: Difficulty, onComplete: () => void): SudokuGameHook => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API instance
  const sudokuApi = new SudokuApi((import.meta as any).env?.VITE_API_NINJAS_KEY || '');

  // Fetch Sudoku puzzle from API or generate locally
  const fetchSudokuPuzzle = useCallback(async (difficultyLevel: Difficulty): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      let puzzleData;
      
      // Try API first if key is available
      const apiKey = (import.meta as any).env?.VITE_API_NINJAS_KEY;
      if (apiKey) {
        console.log('🔑 API key found:', apiKey.substring(0, 8) + '...', 'attempting to fetch puzzle from API...');
        try {
          puzzleData = await sudokuApi.generatePuzzle(difficultyLevel);
          console.log('✅ Successfully fetched puzzle from API');
        } catch (apiError) {
          console.warn('❌ API failed, using local generator:', apiError);
          puzzleData = generateSudokuPuzzle(difficultyLevel);
          console.log('✅ Fallback: Generated puzzle locally');
        }
      } else {
        // Use local generator as fallback
        console.log('🏠 No API key found, using local Sudoku puzzle generator');
        puzzleData = generateSudokuPuzzle(difficultyLevel);
        console.log('✅ Successfully generated puzzle locally');
      }
      
      const { grid: newGrid, solution: newSolution } = convertPuzzleToGrid(
        puzzleData.puzzle,
        puzzleData.solution
      );
      
      setGrid(newGrid);
      setSolution(newSolution);
      setIsCompleted(false);
      setSelectedCell(null);
      setTimer(0);
      setIsTimerRunning(true);
      setHintsUsed(0);
      setHistory([]);
      setHistoryIndex(-1);
      
      console.log('🎯 Sudoku puzzle loaded successfully!', {
        difficulty: difficultyLevel,
        filledCells: newGrid.flat().filter(cell => cell.value !== null).length,
        totalCells: 81
      });
    } catch (error) {
      console.error('Error generating Sudoku puzzle:', error);
      setError('Failed to generate puzzle. Please try again.');
    } finally {
      setIsLoading(false);
    }
    }, []);

  // Load puzzle on mount and difficulty change
  useEffect(() => {
    fetchSudokuPuzzle(difficulty);
  }, [difficulty, fetchSudokuPuzzle]);

  // Timer effect
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, GAME_CONFIG.SUDOKU.TIMER_INTERVAL);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isCompleted]);

  // Check if number is correct for position
  const isCorrectNumber = useCallback((row: number, col: number, value: string | number): boolean => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    return solution[row][col] === numValue;
  }, [solution]);

  // Add to history
  const addToHistory = useCallback((newGrid: Cell[][], value: string | number, row: number, col: number) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ grid: JSON.parse(JSON.stringify(newGrid)), value, row, col });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Handle input change with validation
  const handleInputChange = useCallback((rowIndex: number, colIndex: number, value: string): void => {
    if (grid[rowIndex][colIndex].isPrefilled) return;
    
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex].value = value === '' ? null : parseInt(value, 10);
    
    if (value === '') {
      newGrid[rowIndex][colIndex].value = null;
      newGrid[rowIndex][colIndex].isConflicting = false;
      newGrid[rowIndex][colIndex].isIncorrect = false;
      
      const gridWithConflicts = checkConflicts(newGrid);
      setGrid(gridWithConflicts);
      addToHistory(gridWithConflicts, value, rowIndex, colIndex);
      return;
    }
    
    if (value >= '1' && value <= '9') {
      if (!isValidMove(newGrid, rowIndex, colIndex, value)) {
        newGrid[rowIndex][colIndex].isConflicting = true;
        newGrid[rowIndex][colIndex].isIncorrect = false;
      } else {
        if (!isCorrectNumber(rowIndex, colIndex, value)) {
          newGrid[rowIndex][colIndex].isIncorrect = true;
          newGrid[rowIndex][colIndex].isConflicting = false;
        } else {
          newGrid[rowIndex][colIndex].isConflicting = false;
          newGrid[rowIndex][colIndex].isIncorrect = false;
        }
      }
      
      const gridWithConflicts = checkConflicts(newGrid);
      setGrid(gridWithConflicts);
      addToHistory(gridWithConflicts, value, rowIndex, colIndex);
      
      if (checkCompletion(gridWithConflicts)) {
        setIsCompleted(true);
        setIsTimerRunning(false);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }
  }, [grid, addToHistory, onComplete, isValidMove, isCorrectNumber]);

  // Handle cell selection
  const handleCellClick = useCallback((row: number, col: number) => {
    console.log('🎯 Cell clicked:', [row, col]);
    setSelectedCell([row, col]);
    setGrid(prevGrid => 
      prevGrid.map((gridRow, r) => 
        gridRow.map((cell, c) => ({
          ...cell,
          isHighlighted: r === row || c === col || 
            (Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3))
        }))
      )
    );
    
    // Focus the clicked cell
    setTimeout(() => {
      const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"] input`) as HTMLInputElement;
      if (cellElement) {
        cellElement.focus();
      }
    }, 0);
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle arrow key navigation even if no cell is selected
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      
      // If no cell is selected, start from the first cell
      let currentRow = selectedCell ? selectedCell[0] : 0;
      let currentCol = selectedCell ? selectedCell[1] : 0;
      
      console.log('🎯 Arrow key pressed:', e.key, 'Current position:', selectedCell || [0, 0]);
      
      let newRow = currentRow;
      let newCol = currentCol;
      
      switch (e.key) {
        case 'ArrowUp':
          newRow = Math.max(0, currentRow - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(8, currentRow + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, currentCol - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(8, currentCol + 1);
          break;
      }
      
      console.log('🎯 New position:', [newRow, newCol]);
      setSelectedCell([newRow, newCol]);
      
      // Focus the new cell after a short delay to ensure state update
      setTimeout(() => {
        const newCellElement = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"] input`) as HTMLInputElement;
        if (newCellElement) {
          newCellElement.focus();
        }
      }, 0);
      return;
    }
    
    // Handle number input and other keys only if a cell is selected
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    
    // Handle number input
    if (e.key >= '1' && e.key <= '9') {
      handleInputChange(row, col, e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleInputChange(row, col, '');
    }
  }, [selectedCell, handleInputChange]);

  // Get hint
  const getHint = useCallback(() => {
    if (hintsUsed >= GAME_CONFIG.SUDOKU.MAX_HINTS) return;
    
    const emptyCells: [number, number][] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!grid[row][col].value) {
          emptyCells.push([row, col]);
        }
      }
    }
    
    if (emptyCells.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomCol] = emptyCells[randomIndex];
    
    const correctValue = solution[randomRow][randomCol];
    const newGrid = [...grid];
    newGrid[randomRow][randomCol].value = correctValue;
    newGrid[randomRow][randomCol].isPrefilled = true;
    newGrid[randomRow][randomCol].isIncorrect = false;
    newGrid[randomRow][randomCol].isConflicting = false;
    setGrid(newGrid);
    setHintsUsed(prev => prev + 1);
  }, [grid, solution, hintsUsed]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setGrid(prevState.grid);
      setHistoryIndex(prevIndex => prevIndex - 1);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setGrid(nextState.grid);
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  }, [history, historyIndex]);

  // New game
  const newGame = useCallback(() => {
    fetchSudokuPuzzle(difficulty);
  }, [difficulty, fetchSudokuPuzzle]);

  // Auto solve
  const autoSolve = useCallback(() => {
    const solvedGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        value: solution[rowIndex][colIndex],
        isPrefilled: true,
        isConflicting: false,
        isIncorrect: false,
      }))
    );
    setGrid(solvedGrid);
    setIsCompleted(true);
    setIsTimerRunning(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  }, [grid, solution, onComplete]);

  // Set difficulty
  const setDifficulty = useCallback((newDifficulty: Difficulty) => {
    fetchSudokuPuzzle(newDifficulty);
  }, [fetchSudokuPuzzle]);

  return {
    grid,
    solution,
    isCompleted,
    selectedCell,
    timer,
    isTimerRunning,
    hintsUsed,
    history,
    historyIndex,
    isLoading,
    error,
    difficulty,
    handleInputChange,
    handleCellClick,
    handleKeyDown,
    getHint,
    undo,
    redo,
    newGame,
    autoSolve,
    setDifficulty,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    isApiKeyConfigured: true, // Always true since we have fallback
  };
};
