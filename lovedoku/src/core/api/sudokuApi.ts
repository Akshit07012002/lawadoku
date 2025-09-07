import { API_CONFIG } from '../../shared/constants';
import { Difficulty } from '../../shared/types';

export interface SudokuPuzzle {
  puzzle: (number | null)[][];
  solution: number[][];
}

export interface SudokuApiResponse {
  puzzle: (number | null)[][];
  solution: (number | null)[][];
  difficulty: string;
}

class SudokuApi {
  private baseUrl = API_CONFIG.SUDOKU_API.BASE_URL;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePuzzle(difficulty: Difficulty): Promise<SudokuPuzzle> {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.SUDOKU_API.ENDPOINTS.GENERATE}?difficulty=${difficulty}`,
        {
          method: 'GET',
          headers: {
            'X-Api-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: SudokuApiResponse = await response.json();
      
      // API returns arrays directly, no need to parse
      const puzzle = data.puzzle;
      const solution = data.solution.map(row => row.map(cell => cell || 0));

      return { puzzle, solution };
    } catch (error) {
      console.error('Error fetching Sudoku puzzle:', error);
      throw error;
    }
  }

}

export default SudokuApi;
