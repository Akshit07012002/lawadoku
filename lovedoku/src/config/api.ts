// API Configuration for Sudoku API
// Get your API key from: https://api-ninjas.com/

export const API_CONFIG = {
  // Replace 'YOUR_API_KEY_HERE' with your actual API key from api-ninjas.com
  API_KEY: 'fN11ANB8cmUx8B8Za7Xx2Q==EFaO44y9ymoIol5q',
  
  // API endpoints
  BASE_URL: 'https://api.api-ninjas.com/v1',
  
  // Available difficulties
  DIFFICULTIES: ['easy', 'medium', 'hard'] as const,
  
  // API rate limits (check api-ninjas.com for current limits)
  RATE_LIMIT: {
    FREE: 1000, // requests per month
    PREMIUM: 100000, // requests per month
  }
}

// Helper function to check if API key is configured
export const isApiKeyConfigured = (): boolean => {
  return API_CONFIG.API_KEY !== 'YOUR_API_KEY_HERE' && API_CONFIG.API_KEY.length > 0
}

// Helper function to get API key with validation
export const getApiKey = (): string => {
  if (!isApiKeyConfigured()) {
    throw new Error('API key not configured. Please get your API key from https://api-ninjas.com/ and update the config file.')
  }
  return API_CONFIG.API_KEY
}
