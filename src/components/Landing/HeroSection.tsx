import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Stethoscope, Sparkles, Brain, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const HeroSection: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/signup');
    }
  };

  const handleDemoClick = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px]" />
      <motion.div 
          className="absolute top-1/4 -left-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
        <motion.div 
          className="absolute bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto space-y-8">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <Stethoscope className="w-16 h-16 text-white" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-accent" />
              </motion.div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white">
              MediMind
            </h1>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            className="space-y-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              AI-Powered Medical Intelligence
              <br />
              <span className="bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
                Redefining Healthcare
              </span>
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-100 max-w-4xl mx-auto">
              Transform clinical decision-making with cutting-edge AI that understands your patients, 
              analyzes complex medical data, and provides instant expert insights when every second matters.
            </p>
          </motion.div>

          {/* Key Value Props */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 md:gap-8 py-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 text-white">
              <Brain className="w-6 h-6 text-accent" />
              <span className="text-lg font-medium">Deep Patient Context</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Shield className="w-6 h-6 text-accent" />
              <span className="text-lg font-medium">Clinical-Grade Security</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="text-lg font-medium">Real-time Insights</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.button
              onClick={handleGetStarted}
              className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-primary shadow-2xl hover:shadow-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
              Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-0 group-hover:opacity-10 transition-opacity"
                initial={false}
              />
            </motion.button>
            
            <motion.button
              onClick={handleDemoClick}
              className="group rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white hover:border-white hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              See Products
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">24/7</div>
              <div className="text-white/80 mt-2">AI Medical Assistant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">Instant</div>
              <div className="text-white/80 mt-2">Clinical Insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">100%</div>
              <div className="text-white/80 mt-2">HIPAA Compliant</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};