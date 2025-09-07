import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../../../shared/hooks'
import { useHighScores } from '../../../core/providers'
import { useAchievements } from '../../../core/providers'

interface MemoryGameProps {
  onClose: () => void
}

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆']

export const MemoryGame: React.FC<MemoryGameProps> = ({ onClose }) => {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [time, setTime] = useState(0)
  const [isGameStarted, setIsGameStarted] = useState(false)

  const { playSound } = useSound()
  const { addHighScore } = useHighScores()
  const { checkAchievements } = useAchievements()

  const getCardCount = () => {
    switch (difficulty) {
      case 'easy': return 8
      case 'medium': return 12
      case 'hard': return 16
      default: return 8
    }
  }

  const initializeCards = useCallback(() => {
    const cardCount = getCardCount()
    const pairs = cardCount / 2
    const selectedEmojis = EMOJIS.slice(0, pairs)

    const newCards: Card[] = []
    for (let i = 0; i < pairs; i++) {
      newCards.push(
        { id: i * 2, emoji: selectedEmojis[i], isFlipped: false, isMatched: false },
        { id: i * 2 + 1, emoji: selectedEmojis[i], isFlipped: false, isMatched: false }
      )
    }

    // Shuffle cards
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]]
    }

    setCards(newCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameWon(false)
    setTime(0)
    setIsGameStarted(false)
  }, [difficulty])

  useEffect(() => {
    initializeCards()
  }, [initializeCards])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isGameStarted && !gameWon) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isGameStarted, gameWon])

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2 || cards.find(c => c.id === cardId)?.isFlipped || gameWon) return

    const newCards = cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    )
    setCards(newCards)
    setFlippedCards(prev => [...prev, cardId])
    playSound('click')

    if (!isGameStarted) {
      setIsGameStarted(true)
    }
  }

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards
      const firstCard = cards.find(c => c.id === firstId)
      const secondCard = cards.find(c => c.id === secondId)

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          ))
          setMatches(prev => prev + 1)
          setFlippedCards([])
          playSound('success')
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          ))
          setFlippedCards([])
          playSound('error')
        }, 1000)
      }
      setMoves(prev => prev + 1)
    }
  }, [flippedCards, cards, playSound])

  useEffect(() => {
    if (matches > 0 && matches === getCardCount() / 2) {
      setGameWon(true)
      playSound('win')
      addHighScore({
        game: 'memory',
        score: matches,
        player: 'Player',
        difficulty,
        time
      })
      checkAchievements('memory', matches, time)
    }
  }, [matches, difficulty, time, playSound, addHighScore, checkAchievements, getCardCount])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScore = () => {
    const maxMoves = getCardCount() * 2
    const efficiency = Math.max(0, ((maxMoves - moves) / maxMoves) * 100)
    return Math.round(efficiency)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
            🧠 Memory Game 🎯
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Match the pairs to win!</p>

          {/* Difficulty Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4 justify-center">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${difficulty === diff
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{moves}</div>
              <div className="text-xs text-blue-500">Moves</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{matches}</div>
              <div className="text-xs text-green-500">Matches</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatTime(time)}</div>
              <div className="text-xs text-purple-500">Time</div>
            </div>
          </div>

          {/* Win Message */}
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 mb-4"
            >
              <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">🎉 Congratulations! 🎉</h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                You completed the game in {moves} moves and {formatTime(time)}!
              </p>
              <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                Efficiency Score: {getScore()}%
              </p>
            </motion.div>
          )}
        </div>

        {/* Game Board */}
        <div className="flex justify-center mb-6">
          <div
            className="grid gap-2 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${difficulty === 'easy' ? 4 : difficulty === 'medium' ? 4 : 4}, 1fr)`
            }}
          >
            {cards.map((card) => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched || gameWon}
                className={`w-16 h-16 text-2xl rounded-lg transition-all duration-300 ${card.isMatched
                  ? 'bg-green-500 text-white'
                  : card.isFlipped
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500'
                  } ${(card.isFlipped || card.isMatched || gameWon) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <AnimatePresence>
                  {card.isFlipped && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {card.emoji}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initializeCards}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            🔄 New Game
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            ❌ Close
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
