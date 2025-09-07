import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { HighScoresContextType, HighScore } from '../../shared/types';
import { STORAGE_KEYS } from '../../shared/constants';
import { storage } from '../../shared/utils';

const HighScoresContext = createContext<HighScoresContextType | undefined>(undefined);

interface HighScoresProviderProps {
  children: ReactNode;
}

export const HighScoresProvider: React.FC<HighScoresProviderProps> = ({ children }) => {
  const [highScores, setHighScores] = useState<{ [game: string]: HighScore[] }>(() => {
    return storage.get(STORAGE_KEYS.HIGH_SCORES, {});
  });

  useEffect(() => {
    storage.set(STORAGE_KEYS.HIGH_SCORES, highScores);
  }, [highScores]);

  const addHighScore = (newScore: Omit<HighScore, 'timestamp'>) => {
    setHighScores(prevScores => {
      const gameScores = prevScores[newScore.game] || [];
      const updatedScores = [...gameScores, { ...newScore, timestamp: Date.now() }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep top 10 scores

      return {
        ...prevScores,
        [newScore.game]: updatedScores,
      };
    });
  };

  const getHighScoresForGame = (game: string): HighScore[] => {
    return highScores[game] || [];
  };

  return (
    <HighScoresContext.Provider value={{ highScores, addHighScore, getHighScoresForGame }}>
      {children}
    </HighScoresContext.Provider>
  );
};

export const useHighScores = (): HighScoresContextType => {
  const context = useContext(HighScoresContext);
  if (context === undefined) {
    throw new Error('useHighScores must be used within a HighScoresProvider');
  }
  return context;
};
