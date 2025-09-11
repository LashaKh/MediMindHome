import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Shield, Sparkles, Stethoscope } from 'lucide-react';
import { LampContainer } from '../ui/lamp';
import { useAuthStore } from '../../store/useAuthStore';
import { useTranslation } from '../../hooks/useTranslation';

export const LampHeroSection: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/signup');
    }
  };

  const handleDemoClick = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LampContainer className="bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
      <div className="text-center max-w-5xl mx-auto space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 pt-20 sm:pt-28 md:pt-32 lg:pt-40 pb-16 sm:pb-20 md:pb-24 lg:pb-32 px-4 sm:px-6 md:px-8">
        {/* Logo and Brand */}
        <motion.div
          className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 md:mb-16 lg:mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-white" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />
            </motion.div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight text-white">
            {t('hero.title')}
          </h1>
        </motion.div>

        {/* Main Headline with Lamp Effect */}
        <motion.h2
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24 mb-8 sm:mb-12 md:mb-16 lg:mb-20 bg-gradient-to-br from-slate-300 to-slate-500 py-4 sm:py-6 md:py-8 lg:py-10 bg-clip-text text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium tracking-tight text-transparent leading-tight"
        >
          {t('hero.headline')} <br /> {t('hero.subheadline')}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-300 max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16 lg:mb-20 px-2 sm:px-4 md:px-6"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Key Value Props */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 py-8 sm:py-12 md:py-16 lg:py-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <span className="text-sm sm:text-base md:text-lg font-medium">{t('hero.valueProps.deepContext')}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <span className="text-sm sm:text-base md:text-lg font-medium">{t('hero.valueProps.security')}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <span className="text-sm sm:text-base md:text-lg font-medium">{t('hero.valueProps.insights')}</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8 sm:pt-12 md:pt-16 lg:pt-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={handleGetStarted}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('hero.startFreeTrial')}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
          </motion.button>
          
          <motion.button
            onClick={handleDemoClick}
            className="group rounded-full border-2 border-cyan-400/30 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('hero.seeProducts')}
          </motion.button>
        </motion.div>

      </div>
    </LampContainer>
  );
}; 