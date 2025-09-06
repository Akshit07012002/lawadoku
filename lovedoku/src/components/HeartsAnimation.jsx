import { motion, AnimatePresence } from 'framer-motion'

const HeartsAnimation = ({ isVisible }) => {
    const hearts = ['❤️', '💖', '💝', '💕', '💗', '💓', '💞', '💟', '💌', '💋', '💘', '💙', '💚', '💛', '🧡']

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {hearts.map((heart, index) => (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                x: Math.random() * 800 - 400,
                                y: 0,
                                scale: 0
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                y: -300,
                                x: Math.random() * 800 - 400,
                                scale: [0, 1, 0.8]
                            }}
                            transition={{
                                duration: 4,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                            className="fixed pointer-events-none text-3xl z-50"
                            style={{
                                left: `${50 + Math.random() * 100}%`,
                                top: '60%'
                            }}
                        >
                            {heart}
                        </motion.div>
                    ))}
                </>
            )}
        </AnimatePresence>
    )
}

export default HeartsAnimation
