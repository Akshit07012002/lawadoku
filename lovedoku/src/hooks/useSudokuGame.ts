import { useState, useCallback, useEffect } from 'react'
import { Cell, Difficulty, GridState, HistoryEntry } from '../types/sudoku'
import { isValidMove, checkCompletion, getDifficultyClues, createEmptyCell, createPrefilledCell } from '../utils/sudokuUtils'
import { getApiKey, isApiKeyConfigured } from '../config/api'

interface SudokuPuzzle {
  puzzle: (number | null)[][]
  solution: number[][]
}

export const useSudokuGame = (difficulty: Difficulty, onComplete: () => void) => {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [solution, setSolution] = useState<number[][]>([])
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [timer, setTimer] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
  const [hintsUsed, setHintsUsed] = useState<number>(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch Sudoku puzzle from API
  const fetchSudokuPuzzle = useCallback(async (difficultyLevel: Difficulty): Promise<SudokuPuzzle> => {
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${difficultyLevel}`,
        {
          headers: {
            'X-Api-Key': getApiKey(),
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching Sudoku puzzle:', error)
      throw error
    }
  }, [])

  // Convert API puzzle format to our grid format
  const convertPuzzleToGrid = useCallback((puzzle: (number | null)[][], solution: number[][]): GridState => {
    const grid: Cell[][] = []
    const solutionGrid: number[][] = []
    
    // The API returns 2D arrays, so we can iterate directly
    for (let i = 0; i < 9; i++) {
      const row: Cell[] = []
      const solutionRow: number[] = []
      
      for (let j = 0; j < 9; j++) {
        const puzzleValue = puzzle[i][j]
        const solutionValue = solution[i][j]
        
        if (puzzleValue !== null) {
          row.push(createPrefilledCell(i, j, puzzleValue))
        } else {
          row.push(createEmptyCell(i, j))
        }
        
        solutionRow.push(solutionValue)
      }
      
      grid.push(row)
      solutionGrid.push(solutionRow)
    }
    
    return { grid, solutionGrid }
  }, [])

  // Generate a new Sudoku puzzle using the API
  const generateValidSudoku = useCallback(async (difficultyLevel: Difficulty): Promise<GridState> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const puzzleData = await fetchSudokuPuzzle(difficultyLevel)
      const { grid, solutionGrid } = convertPuzzleToGrid(puzzleData.puzzle, puzzleData.solution)
      
      setIsLoading(false)
      return { grid, solutionGrid }
    } catch (error) {
      setIsLoading(false)
      setError('Failed to fetch puzzle. Please try again.')
      
      // Fallback to a simple puzzle if API fails
      console.warn('Using fallback puzzle due to API error:', error)
      return generateFallbackPuzzle(difficultyLevel)
    }
  }, [fetchSudokuPuzzle, convertPuzzleToGrid])

  // Fallback puzzle generation
  const generateFallbackPuzzle = useCallback((difficultyLevel: Difficulty): GridState => {
    // Simple 9x9 Sudoku solution
    const solution: number[][] = [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9]
    ]
    
    const solutionGrid = solution.map(row => [...row])
    
    // Create puzzle by removing some numbers
    const minClues = getDifficultyClues(difficultyLevel)
    const totalCells = 81
    const maxToRemove = totalCells - minClues
    
    // Create a list of all cell positions
    const allPositions: [number, number][] = []
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        allPositions.push([i, j])
      }
    }
    
    // Randomly select positions to remove numbers from
    const shuffledPositions = [...allPositions].sort(() => Math.random() - 0.5)
    const positionsToRemove = shuffledPositions.slice(0, maxToRemove)
    
    const grid: Cell[][] = []
    for (let i = 0; i < 9; i++) {
      const row: Cell[] = []
      for (let j = 0; j < 9; j++) {
        const shouldKeepNumber = !positionsToRemove.some(([row, col]) => row === i && col === j)
        
        if (shouldKeepNumber) {
          row.push(createPrefilledCell(i, j, solution[i][j]))
        } else {
          row.push(createEmptyCell(i, j))
        }
      }
      grid.push(row)
    }
    
    return { grid, solutionGrid }
  }, [])

  // Check if a number is correct for its position
  const isCorrectNumber = useCallback((row: number, col: number, value: string): boolean => {
    if (!value || value === '') return true
    return solution[row] && solution[row][col] === Number(value)
  }, [solution])

  // Check for conflicts in the grid
  const checkConflicts = useCallback((currentGrid: Cell[][]): Cell[][] => {
    const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell, isConflicting: false })))
    
    // Check each cell for conflicts
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = newGrid[row][col]
        if (cell.value && cell.value !== '') {
          let hasConflict = false
          
          // Check row conflicts
          for (let c = 0; c < 9; c++) {
            if (c !== col && newGrid[row][c].value === cell.value) {
              hasConflict = true
              newGrid[row][c].isConflicting = true
            }
          }
          
          // Check column conflicts
          for (let r = 0; r < 9; r++) {
            if (r !== row && newGrid[r][col].value === cell.value) {
              hasConflict = true
              newGrid[r][col].isConflicting = true
            }
          }
          
          // Check 3x3 box conflicts
          const startRow = Math.floor(row / 3) * 3
          const startCol = Math.floor(col / 3) * 3
          for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
              if ((r !== row || c !== col) && newGrid[r][c].value === cell.value) {
                hasConflict = true
                newGrid[r][c].isConflicting = true
              }
            }
          }
          
          // Mark the current cell as conflicting if any conflicts were found
          if (hasConflict) {
            newGrid[row][col].isConflicting = true
          }
        }
      }
    }
    
    return newGrid
  }, [])

  // Highlight related cells
  const highlightRelatedCells = useCallback((row: number, col: number): Cell[][] => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell, isHighlighted: false })))
    
    // Highlight same row
    for (let c = 0; c < 9; c++) {
      newGrid[row][c].isHighlighted = true
    }
    
    // Highlight same column
    for (let r = 0; r < 9; r++) {
      newGrid[r][col].isHighlighted = true
    }
    
    // Highlight same 3x3 box
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        newGrid[r][c].isHighlighted = true
      }
    }
    
    return newGrid
  }, [grid])

  // Add to history
  const addToHistory = useCallback((newGrid: Cell[][], value: string | number, row: number, col: number) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ grid: JSON.parse(JSON.stringify(newGrid)), value, row, col })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Handle input change with validation
  const handleInputChange = useCallback((rowIndex: number, colIndex: number, value: string): void => {
    if (grid[rowIndex][colIndex].isPrefilled) return // Can't change pre-filled cells
    
    const newGrid = [...grid]
    newGrid[rowIndex][colIndex].value = value
    
    // If the cell is being cleared (empty value), remove all markers
    if (value === '') {
      newGrid[rowIndex][colIndex].isConflicting = false
      newGrid[rowIndex][colIndex].isIncorrect = false
      
      // Check for conflicts with other cells (in case clearing this cell resolves conflicts)
      const gridWithConflicts = checkConflicts(newGrid)
      setGrid(gridWithConflicts)
      
      // Add to history
      addToHistory(gridWithConflicts, value, rowIndex, colIndex)
      return
    }
    
    // Only allow numbers 1-9
    if (value >= '1' && value <= '9') {
      // Check if this move would create a conflict
      if (!isValidMove(newGrid, rowIndex, colIndex, value)) {
        // Mark the cell as conflicting (breaks Sudoku rules)
        newGrid[rowIndex][colIndex].isConflicting = true
        newGrid[rowIndex][colIndex].isIncorrect = false
      } else {
        // No conflict, so check if the number is correct for this position
        if (!isCorrectNumber(rowIndex, colIndex, value)) {
          // Mark the cell as incorrect (follows rules but wrong number)
          newGrid[rowIndex][colIndex].isIncorrect = true
          newGrid[rowIndex][colIndex].isConflicting = false
        } else {
          // Clear any previous markers
          newGrid[rowIndex][colIndex].isConflicting = false
          newGrid[rowIndex][colIndex].isIncorrect = false
        }
      }
      
      // Check for conflicts with other cells
      const gridWithConflicts = checkConflicts(newGrid)
      setGrid(gridWithConflicts)
      
      // Add to history
      addToHistory(gridWithConflicts, value, rowIndex, colIndex)
      
      // Check if puzzle is completed
      if (checkCompletion(gridWithConflicts)) {
        setIsCompleted(true)
        setIsTimerRunning(false)
        setTimeout(() => {
          onComplete()
        }, 500)
      }
    }
  }, [grid, checkConflicts, addToHistory, onComplete, isValidMove, isCorrectNumber])

  // Handle cell selection
  const handleCellClick = useCallback((row: number, col: number) => {
    // Allow selection of any cell for navigation purposes
    // Only allow input editing for non-prefilled cells
    setSelectedCell([row, col])
    setGrid(highlightRelatedCells(row, col))
  }, [grid, highlightRelatedCells])


  // Get hint
  const getHint = useCallback(() => {
    if (hintsUsed >= 3) return // Limit hints
    
    // Find all empty cells
    const emptyCells: [number, number][] = []
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!grid[row][col].value || grid[row][col].value === '') {
          emptyCells.push([row, col])
        }
      }
    }
    
    // If no empty cells, return
    if (emptyCells.length === 0) return
    
    // Randomly select an empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    const [randomRow, randomCol] = emptyCells[randomIndex]
    
    // Show the correct value for the randomly selected cell
    const correctValue = solution[randomRow][randomCol]
    const newGrid = [...grid]
    newGrid[randomRow][randomCol].value = correctValue
    newGrid[randomRow][randomCol].isPrefilled = true
    newGrid[randomRow][randomCol].isIncorrect = false
    newGrid[randomRow][randomCol].isConflicting = false
    setGrid(newGrid)
    setHintsUsed(prev => prev + 1)
  }, [grid, hintsUsed, solution])

  // Undo last move
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setGrid(history[historyIndex - 1].grid)
    }
  }, [history, historyIndex])

  // Redo move
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setGrid(history[historyIndex + 1].grid)
    }
  }, [history, historyIndex])

  // New game
  const newGame = useCallback(() => {
    const initializeGrid = async () => {
      const { grid: newGrid, solutionGrid } = await generateValidSudoku(difficulty)
      setGrid(newGrid)
      setSolution(solutionGrid)
      setTimer(0)
      setIsTimerRunning(true)
      setHintsUsed(0)
      setHistory([])
      setHistoryIndex(-1)
      setSelectedCell(null)
      setIsCompleted(false)
    }
    initializeGrid()
  }, [difficulty, generateValidSudoku])

  // Auto-solve (development only)
  const autoSolve = useCallback(() => {
    const newGrid = grid.map(row => row.map(cell => {
      if (cell.isPrefilled) {
        return cell // Keep pre-filled cells unchanged
      }
      // Fill in the correct number from solution
      const correctValue = solution[cell.row][cell.col]
      return {
        ...cell,
        value: correctValue,
        isConflicting: false,
        isIncorrect: false
      }
    }))
    setGrid(newGrid)
    
    // Check if puzzle is completed
    if (checkCompletion(newGrid)) {
      setIsCompleted(true)
      setIsTimerRunning(false)
      setTimeout(() => {
        onComplete()
      }, 500)
    }
  }, [grid, solution, onComplete])

  // Timer effect
  useEffect(() => {
    let interval: number
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Initialize grid on component mount
  useEffect(() => {
    const initializeGrid = async () => {
      const { grid: newGrid, solutionGrid } = await generateValidSudoku(difficulty)
      setGrid(newGrid)
      setSolution(solutionGrid)
      setTimer(0)
      setIsTimerRunning(true)
      setHintsUsed(0)
      setHistory([])
      setHistoryIndex(-1)
      setSelectedCell(null)
      setIsCompleted(false)
    }
    initializeGrid()
  }, [difficulty, generateValidSudoku])

  return {
    // State
    grid,
    solution,
    isCompleted,
    selectedCell,
    timer,
    isTimerRunning,
    hintsUsed,
    isLoading,
    error,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    
    // Actions
    handleInputChange,
    handleCellClick,
    getHint,
    undo,
    redo,
    newGame,
    autoSolve,
    
    // API status
    isApiKeyConfigured: isApiKeyConfigured()
  }
}
