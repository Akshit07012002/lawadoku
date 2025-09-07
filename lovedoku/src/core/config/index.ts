// Environment Configuration
export const ENV_CONFIG = {
  API_KEYS: {
    SUDOKU_API: import.meta.env.VITE_API_NINJAS_KEY || '',
  },
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Lawadoku',
  VERSION: '2.0.0',
  DESCRIPTION: 'A collection of mini-games with a romantic twist',
  AUTHOR: 'Akshit Mahaur',
  REPOSITORY: 'https://github.com/Akshit07012002/lawadoku',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_SOUND: true,
  ENABLE_ANIMATIONS: true,
  ENABLE_ACHIEVEMENTS: true,
  ENABLE_HIGH_SCORES: true,
  ENABLE_DARK_MODE: true,
  ENABLE_PWA: false, // Will be enabled in future
} as const;
