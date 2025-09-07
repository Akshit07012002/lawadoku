// Game Configuration
export const GAME_CONFIG = {
  SUDOKU: {
    GRID_SIZE: 9,
    BOX_SIZE: 3,
    DIFFICULTY_LEVELS: ['easy', 'medium', 'hard'] as const,
    MAX_HINTS: 3,
    TIMER_INTERVAL: 1000,
  },
  TRIVIA: {
    QUESTIONS_PER_GAME: 10,
    TIME_PER_QUESTION: 30,
    DIFFICULTY_POINTS: {
      easy: 10,
      medium: 20,
      hard: 30,
    },
  },
  MEMORY: {
    DIFFICULTY_LEVELS: {
      easy: { pairs: 6, cols: 4 },
      medium: { pairs: 8, cols: 4 },
      hard: { pairs: 12, cols: 6 },
    },
  },
  MINESWEEPER: {
    DIFFICULTY_LEVELS: {
      easy: { rows: 9, cols: 9, mines: 10 },
      medium: { rows: 16, cols: 16, mines: 40 },
      hard: { rows: 16, cols: 30, mines: 99 },
    },
  },
} as const;

// API Configuration
export const API_CONFIG = {
  SUDOKU_API: {
    BASE_URL: 'https://api.api-ninjas.com/v1',
    ENDPOINTS: {
      GENERATE: '/sudokugenerate',
    },
  },
  TRIVIA_API: {
    BASE_URL: 'https://opentdb.com/api.php',
    CATEGORIES: {
      GENERAL_KNOWLEDGE: '9',
      BOOKS: '10',
      FILM: '11',
      MUSIC: '12',
      SCIENCE_NATURE: '17',
      COMPUTERS: '18',
      SPORTS: '21',
      GEOGRAPHY: '22',
      HISTORY: '23',
      ART: '25',
    },
  },
} as const;

// UI Constants
export const UI_CONFIG = {
  ANIMATION: {
    DURATION: {
      FAST: 200,
      NORMAL: 300,
      SLOW: 500,
    },
    SPRING: {
      STIFFNESS: 300,
      DAMPING: 30,
    },
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
  Z_INDEX: {
    MODAL: 50,
    DROPDOWN: 40,
    HEADER: 30,
    OVERLAY: 20,
  },
} as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  SUDOKU: {
    NAVIGATION: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'],
    INPUT: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ACTIONS: {
      HINT: 'h',
      UNDO: 'u',
      REDO: 'r',
      NEW_GAME: 'n',
      PENCIL_MARKS: 'p',
      CLEAR: 'Escape',
    },
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  SOUND_ENABLED: 'soundEnabled',
  HIGH_SCORES: 'highScores',
  ACHIEVEMENTS: 'achievements',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  SUDOKU: '/sudoku',
  TRIVIA: '/trivia',
  MINESWEEPER: '/minesweeper',
  SNAKE: '/snake',
  GAME_2048: '/2048',
  TIC_TAC_TOE: '/tic-tac-toe',
  MEMORY: '/memory',
} as const;

// Sound Effects
export const SOUND_EFFECTS = {
  CLICK: 'click',
  SUCCESS: 'success',
  ERROR: 'error',
  WIN: 'win',
} as const;

// Achievement Configuration
export const ACHIEVEMENTS = {
  FIRST_WIN: {
    id: 'first-win',
    name: 'First Blood',
    description: 'Win your first game!',
    criteria: (game: string, score: number) => score > 0,
  },
  SUDOKU_MASTER: {
    id: 'sudoku-master',
    name: 'Sudoku Master',
    description: 'Complete a Sudoku puzzle on Hard difficulty.',
    criteria: (game: string, score: number) => game === 'sudoku' && score > 0,
  },
  SNAKE_PRO: {
    id: 'snake-pro',
    name: 'Snake Pro',
    description: 'Reach a score of 50 in Snake.',
    criteria: (game: string, score: number) => game === 'snake' && score >= 50,
  },
  GAME_2048_EXPERT: {
    id: '2048-expert',
    name: '2048 Expert',
    description: 'Reach the 2048 tile.',
    criteria: (game: string, score: number) => game === 'game2048' && score >= 2048,
  },
  MINESWEEPER_HERO: {
    id: 'minesweeper-hero',
    name: 'Minesweeper Hero',
    description: 'Win Minesweeper on Hard difficulty.',
    criteria: (game: string, score: number) => game === 'minesweeper' && score > 0,
  },
  TICTACTOE_CHAMP: {
    id: 'tictactoe-champ',
    name: 'Tic-Tac-Toe Champ',
    description: 'Win 5 Tic-Tac-Toe games against the AI.',
    criteria: (game: string, score: number) => game === 'tic-tac-toe' && score >= 5,
  },
  MEMORY_MASTER: {
    id: 'memory-master',
    name: 'Memory Master',
    description: 'Complete Memory Game on Hard difficulty in under 60 seconds.',
    criteria: (game: string, score: number) => game === 'memory' && score > 0,
  },
  TRIVIA_WHIZ: {
    id: 'trivia-whiz',
    name: 'Trivia Whiz',
    description: 'Score over 200 points in a Trivia game.',
    criteria: (game: string, score: number) => game === 'trivia' && score >= 200,
  },
} as const;
