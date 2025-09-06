import { motion } from 'framer-motion'

const WinScreen = ({ onAccept, onReject, rejectCount }) => {
    const getRejectMessage = () => {
        const messages = [
            "Are you sure? Recompile answer.",
            "Error 404: Girlfriend not found",
            "System.out.println('Please reconsider')",
            "Git commit -m 'Accept proposal'",
            "sudo make me a sandwich",
            "This is not the answer you're looking for",
            "Infinite loop detected in rejection logic",
            "Stack overflow in relationship status",
            "Exception: Heart not found",
            "Segmentation fault in love algorithm"
        ]
        return messages[rejectCount % messages.length]
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl font-bold text-purple-600 mb-2">You Win! 🎉</h1>
                    <h2 className="text-2xl font-bold text-pink-600 mb-6">Achievement Unlocked: Girlfriend?</h2>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4 mb-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onAccept}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        Accept ❤️
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onReject}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        Reject 😢
                    </motion.button>
                </motion.div>

                {rejectCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-100 rounded-lg p-4"
                    >
                        <p className="text-gray-700 text-lg font-medium">
                            {getRejectMessage()}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Rejection count: {rejectCount}
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

export default WinScreen
