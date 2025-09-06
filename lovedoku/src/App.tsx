import React, { useEffect } from 'react'
import { GameHub } from './components/GameHub'
import './App.css'

const App: React.FC = () => {
    // Easter egg: CTRL+L shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (e.ctrlKey && e.key === 'l') {
                alert("Psst… you're my only solution to this puzzle.")
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Konami Code Easter Egg
    useEffect(() => {
        let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
        let konamiIndex = 0

        const handleKonami = (e: KeyboardEvent): void => {
            if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
                konamiIndex++
                if (konamiIndex === konamiCode.length) {
                    alert("Psst… I was always yours. ❤️")
                    konamiIndex = 0
                }
            } else {
                konamiIndex = 0
            }
        }

        window.addEventListener('keydown', handleKonami)
        return () => window.removeEventListener('keydown', handleKonami)
    }, [])

    // Console log easter eggs
    useEffect(() => {
        console.log("git commit -m 'My heart belongs to Lawanya'")
        console.log("git push origin us <3")
        console.log("Committing my heart to: Lawanya <3")
    }, [])

    return <GameHub />
}

export default App
