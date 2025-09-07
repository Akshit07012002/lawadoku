import { API_CONFIG } from '../../shared/constants';
import { Difficulty } from '../../shared/types';

export interface TriviaQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: Difficulty;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaApiResponse {
  response_code: number;
  results: TriviaQuestion[];
}

class TriviaApi {
  private baseUrl = API_CONFIG.TRIVIA_API.BASE_URL;

  async getQuestions(
    amount: number = 10,
    category: string = API_CONFIG.TRIVIA_API.CATEGORIES.GENERAL_KNOWLEDGE,
    difficulty: Difficulty = 'easy'
  ): Promise<TriviaQuestion[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TriviaApiResponse = await response.json();

      if (data.response_code !== 0) {
        throw new Error(`API returned error code: ${data.response_code}`);
      }

      return data.results.map(question => ({
        ...question,
        question: this.decodeHtml(question.question),
        correct_answer: this.decodeHtml(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(this.decodeHtml),
      }));
    } catch (error) {
      console.error('Error fetching trivia questions:', error);
      throw error;
    }
  }

  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}

export default TriviaApi;
