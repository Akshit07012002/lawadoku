import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    unlocked: boolean
    unlockedAt?: string
    category: 'games' | 'scores' | 'time' | 'special'
}

interface AchievementsContextType {
    achievements: Achievement[]
    unlockAchievement: (id: string) => void
    checkAchievements: (game: string, score?: number, time?: number) => void
    getUnlockedCount: () => number
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined)

export const useAchievements = () => {
    const context = useContext(AchievementsContext)
    if (context === undefined) {
        throw new Error('useAchievements must be used within an AchievementsProvider')
    }
    return context
}

interface AchievementsProviderProps {
    children: React.ReactNode
}

const initialAchievements: Achievement[] = [
    {
        id: 'first-game',
        title: 'First Steps',
        description: 'Complete your first game',
        icon: '🎮',
        unlocked: false,
        category: 'games'
    },
    {
        id: 'sudoku-master',
        title: 'Sudoku Master',
        description: 'Complete 10 Sudoku puzzles',
        icon: '🧩',
        unlocked: false,
        category: 'games'
    },
    {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Complete a Sudoku in under 5 minutes',
        icon: '⚡',
        unlocked: false,
        category: 'time'
    },
    {
        id: 'high-scorer',
        title: 'High Scorer',
        description: 'Score over 1000 in 2048',
        icon: '🏆',
        unlocked: false,
        category: 'scores'
    },
    {
        id: 'snake-charmer',
        title: 'Snake Charmer',
        description: 'Reach 50 points in Snake',
        icon: '🐍',
        unlocked: false,
        category: 'scores'
    },
    {
        id: 'mine-sweeper',
        title: 'Mine Sweeper',
        description: 'Complete 5 Minesweeper games',
        icon: '💣',
        unlocked: false,
        category: 'games'
    },
    {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Complete a game without using hints',
        icon: '✨',
        unlocked: false,
        category: 'special'
    },
    {
        id: 'night-owl',
        title: 'Night Owl',
        description: 'Play 5 games in dark mode',
        icon: '🦉',
        unlocked: false,
        category: 'special'
    }
]

export const AchievementsProvider: React.FC<AchievementsProviderProps> = ({ children }) => {
    const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)

    useEffect(() => {
        const saved = localStorage.getItem('achievements')
        if (saved) {
            try {
                const savedAchievements = JSON.parse(saved)
                setAchievements(savedAchievements)
            } catch (error) {
                console.error('Failed to load achievements:', error)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('achievements', JSON.stringify(achievements))
    }, [achievements])

    const unlockAchievement = (id: string) => {
        setAchievements(prev =>
            prev.map(achievement =>
                achievement.id === id && !achievement.unlocked
                    ? { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
                    : achievement
            )
        )
    }

    const checkAchievements = (game: string, score?: number, time?: number) => {
        // This will be called after each game completion
        // We'll implement specific achievement checks here
        achievements.forEach(achievement => {
            if (achievement.unlocked) return

            switch (achievement.id) {
                case 'first-game':
                    unlockAchievement('first-game')
                    break
                case 'speed-demon':
                    if (game === 'sudoku' && time && time < 300) { // 5 minutes
                        unlockAchievement('speed-demon')
                    }
                    break
                case 'high-scorer':
                    if (game === '2048' && score && score > 1000) {
                        unlockAchievement('high-scorer')
                    }
                    break
                case 'snake-charmer':
                    if (game === 'snake' && score && score >= 50) {
                        unlockAchievement('snake-charmer')
                    }
                    break
                // Add more achievement checks as needed
            }
        })
    }

    const getUnlockedCount = () => {
        return achievements.filter(a => a.unlocked).length
    }

    return (
        <AchievementsContext.Provider value={{ achievements, unlockAchievement, checkAchievements, getUnlockedCount }}>
            {children}
        </AchievementsContext.Provider>
    )
}
