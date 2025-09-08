import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MigrationNoticeProps {
  isOpen: boolean;
}

export const MigrationNotice: React.FC<MigrationNoticeProps> = ({ isOpen }) => {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isOpen && countdown === 0) {
      // Auto-redirect when countdown reaches 0
      window.location.href = 'https://medimind.md';
    }
  }, [isOpen, countdown]);

  const handleRedirect = () => {
    window.location.href = 'https://medimind.md';
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-800/85 backdrop-blur-md" />
      
      <motion.div 
        className="relative mx-4 max-w-lg w-full"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Gradient border effect */}
        <div className="p-1 rounded-3xl bg-gradient-to-r from-slate-400 via-slate-300 to-slate-200">
          <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100 rounded-3xl shadow-2xl">
            
            {/* Content */}
            <div className="p-10 text-center relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute top-4 left-4">
                  <Brain className="w-16 h-16 text-slate-600" />
                </div>
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-12 h-12 text-slate-600" />
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Brain className="w-20 h-20 text-slate-600" />
                </div>
              </div>

              {/* Animated logo/icon */}
              <motion.div 
                className="mx-auto mb-8 w-20 h-20 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 rounded-2xl flex items-center justify-center shadow-xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-10 h-10 text-white" />
              </motion.div>

              {/* Title with gradient text */}
              <motion.h1 
                className="text-4xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                We've Evolved!
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="text-slate-600 mb-8 text-lg leading-relaxed font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                MediMind has migrated to our new domain with enhanced AI capabilities, 
                faster performance, and revolutionary medical intelligence features.
              </motion.p>

              {/* New Domain showcase */}
              <motion.div 
                className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 rounded-2xl p-6 mb-8 border border-slate-200 shadow-inner"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <p className="text-sm text-slate-500 mb-2 font-medium">
                  🚀 Experience the future of medical AI at:
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                  medimind.md
                </p>
              </motion.div>

              {/* Enhanced countdown */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full px-6 py-3 border border-slate-300">
                  <Sparkles className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-700 font-medium">
                    Auto-redirecting in{' '}
                    <motion.span 
                      className="font-bold text-slate-800 text-xl"
                      key={countdown}
                      initial={{ scale: 1.3, color: '#1e293b' }}
                      animate={{ scale: 1, color: '#334155' }}
                      transition={{ duration: 0.3 }}
                    >
                      {countdown}
                    </motion.span>{' '}
                    seconds
                  </span>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                onClick={handleRedirect}
                className="w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 hover:from-slate-900 hover:via-slate-800 hover:to-slate-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">Enter MediMind 2.0</span>
                <ExternalLink className="w-6 h-6" />
              </motion.button>

              {/* Enhanced footer message */}
              <motion.p 
                className="text-sm text-slate-400 mt-6 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                ✨ Powered by next-generation AI technology<br />
                🔒 Enhanced security and privacy features
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MigrationNotice;