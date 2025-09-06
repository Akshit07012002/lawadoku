import { motion, AnimatePresence } from 'framer-motion'

const AdModal = ({ stage, onNext, onClose }) => {
    const renderAdStage1 = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl shadow-xl max-w-md mx-auto">
                <div className="text-white mb-6">
                    <h2 className="text-2xl font-bold mb-2">🎮 Advertisement 🎮</h2>
                    <p className="text-lg mb-2">Download Candy Crush now! 😜</p>
                    <p className="text-sm opacity-90">Only 99.99% of your soul!</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNext}
                    className="bg-white text-orange-500 px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    Skip Ad →
                </motion.button>
            </div>
        </motion.div>
    )

    const renderAdStage2 = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <div className="bg-gradient-to-r from-pink-400 to-purple-500 p-8 rounded-2xl shadow-xl max-w-md mx-auto">
                <div className="text-white mb-6">
                    <h2 className="text-2xl font-bold mb-4">💕 Loading love.exe... 💕</h2>

                    {/* Animated hearts */}
                    <div className="flex justify-center space-x-3 mb-4">
                        {['❤️', '💖', '💝', '💕', '💗'].map((heart, i) => (
                            <motion.span
                                key={i}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                                className="text-3xl"
                            >
                                {heart}
                            </motion.span>
                        ))}
                    </div>

                    <p className="text-lg mb-2">Initializing romance protocols...</p>
                    <p className="text-base opacity-90">Two souls, one puzzle, infinite solutions ❤️</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="bg-white text-purple-500 px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    Continue →
                </motion.button>
            </div>
        </motion.div>
    )

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
                onClick={stage === 1 ? undefined : onClose}
            >
                <div onClick={(e) => e.stopPropagation()}>
                    {stage === 1 ? renderAdStage1() : renderAdStage2()}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default AdModal
