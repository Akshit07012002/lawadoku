import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AchievementsContextType, Achievement } from '../../shared/types';
import { STORAGE_KEYS, ACHIEVEMENTS } from '../../shared/constants';
import { storage } from '../../shared/utils';

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

interface AchievementsProviderProps {
  children: ReactNode;
}

const initialAchievements: Achievement[] = Object.values(ACHIEVEMENTS).map(achievement => ({
  ...achievement,
  unlocked: false,
}));

export const AchievementsProvider: React.FC<AchievementsProviderProps> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const savedAchievements = storage.get(STORAGE_KEYS.ACHIEVEMENTS, []);
    
    // Merge saved achievements with initial to ensure new achievements are added
    return initialAchievements.map(initial => {
      const saved = savedAchievements.find((a: Achievement) => a.id === initial.id);
      return saved ? { ...initial, unlocked: saved.unlocked } : initial;
    });
  });

  useEffect(() => {
    storage.set(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  }, [achievements]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(ach => (ach.id === id && !ach.unlocked ? { ...ach, unlocked: true } : ach))
    );
  };

  const checkAchievements = (game: string, score: number) => {
    achievements.forEach(ach => {
      if (!ach.unlocked && ach.criteria(game, score)) {
        unlockAchievement(ach.id);
        // You could add a notification system here
        console.log(`Achievement Unlocked: ${ach.name}!`);
      }
    });
  };

  const getUnlockedCount = (): number => {
    return achievements.filter(ach => ach.unlocked).length;
  };

  return (
    <AchievementsContext.Provider value={{ 
      achievements, 
      unlockAchievement, 
      checkAchievements, 
      getUnlockedCount 
    }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = (): AchievementsContextType => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};
