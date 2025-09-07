import React, { createContext, useContext, useState, useEffect } from 'react'

export interface HighScore {
    id: string
    game: string
    score: number
    player: string
    date: string
    difficulty?: string
    time?: number
}

interface HighScoresContextType {
    highScores: HighScore[]
    addHighScore: (score: Omit<HighScore, 'id' | 'date'>) => void
    getHighScores: (game: string) => HighScore[]
    clearHighScores: () => void
}

const HighScoresContext = createContext<HighScoresContextType | undefined>(undefined)

export const useHighScores = () => {
    const context = useContext(HighScoresContext)
    if (context === undefined) {
        throw new Error('useHighScores must be used within a HighScoresProvider')
    }
    return context
}

interface HighScoresProviderProps {
    children: React.ReactNode
}

export const HighScoresProvider: React.FC<HighScoresProviderProps> = ({ children }) => {
    const [highScores, setHighScores] = useState<HighScore[]>([])

    useEffect(() => {
        const saved = localStorage.getItem('highScores')
        if (saved) {
            try {
                setHighScores(JSON.parse(saved))
            } catch (error) {
                console.error('Failed to load high scores:', error)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('highScores', JSON.stringify(highScores))
    }, [highScores])

    const addHighScore = (scoreData: Omit<HighScore, 'id' | 'date'>) => {
        const newScore: HighScore = {
            ...scoreData,
            id: Date.now().toString(),
            date: new Date().toISOString()
        }

        setHighScores(prev => {
            const updated = [...prev, newScore]
                .sort((a, b) => b.score - a.score)
                .slice(0, 50) // Keep only top 50 scores
            return updated
        })
    }

    const getHighScores = (game: string) => {
        return highScores
            .filter(score => score.game === game)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10) // Top 10 for each game
    }

    const clearHighScores = () => {
        setHighScores([])
    }

    return (
        <HighScoresContext.Provider value={{ highScores, addHighScore, getHighScores, clearHighScores }}>
            {children}
        </HighScoresContext.Provider>
    )
}
