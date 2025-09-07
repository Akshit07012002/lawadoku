// Base Types
export type Theme = 'light' | 'dark';
export type Difficulty = 'easy' | 'medium' | 'hard';

// Game State Types
export interface GameState {
  isLoading: boolean;
  isCompleted: boolean;
  isPaused: boolean;
  score: number;
  time: number;
  error: string | null;
}

// High Score Types
export interface HighScore {
  game: string;
  score: number;
  player: string;
  difficulty?: string;
  timestamp: number;
}

export interface HighScoresContextType {
  highScores: { [game: string]: HighScore[] };
  addHighScore: (newScore: Omit<HighScore, 'timestamp'>) => void;
  getHighScoresForGame: (game: string) => HighScore[];
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  criteria: (game: string, score: number) => boolean;
}

export interface AchievementsContextType {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  checkAchievements: (game: string, score: number) => void;
  getUnlockedCount: () => number;
}

// Sound Types
export type SoundName = 'click' | 'success' | 'error' | 'win';

export interface SoundContextType {
  playSound: (name: SoundName) => void;
  isEnabled: boolean;
  toggleSound: () => void;
}

// Theme Types
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface GameComponentProps extends BaseComponentProps {
  onClose: () => void;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event Handler Types
export type EventHandler<T = void> = (value: T) => void;
export type AsyncEventHandler<T = void> = (value: T) => Promise<void>;

// Form Types
export interface FormField {
  name: string;
  value: string | number;
  error?: string;
  required?: boolean;
}

// Animation Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
}

// Layout Types
export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}
