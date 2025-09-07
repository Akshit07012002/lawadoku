import React from 'react';
import { motion } from 'framer-motion';
import { LayoutProps } from '../shared/types';
import { Button } from '../shared/components';

const GameLayout: React.FC<LayoutProps> = ({
    children,
    title,
    showBackButton = true,
    onBack
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
                {showBackButton && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 sm:mb-6"
                    >
                        <Button
                            variant="secondary"
                            onClick={onBack || (() => window.history.back())}
                            className="flex items-center gap-2 text-sm sm:text-base"
                            size="sm"
                        >
                            ← Back to Hub
                        </Button>
                    </motion.div>
                )}

                {title && (
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4"
                    >
                        {title}
                    </motion.h1>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default GameLayout;
