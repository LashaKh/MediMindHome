import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Construction, Wrench, Cog, Sparkles } from 'lucide-react';

export const ECGAnalysis: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-primary/10 via-transparent to-transparent">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ECG Analysis
              </h1>
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              {/* Animated Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="inline-flex p-4 rounded-full bg-primary/10 dark:bg-primary/20 mb-6"
              >
                <Construction className="w-12 h-12 text-primary" />
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Coming Soon
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We're working hard to bring you advanced ECG analysis capabilities. This feature will be available soon!
              </p>

              {/* Feature Preview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex justify-center mb-3">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Advanced ECG interpretation using state-of-the-art AI models
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex justify-center mb-3">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Automated Measurements</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Precise interval and amplitude measurements
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Detection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatic detection of abnormalities and patterns
                  </p>
                </motion.div>
              </div>

              {/* Progress Indicator */}
              <div className="max-w-md mx-auto">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Development Progress</span>
                  <span>75%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};