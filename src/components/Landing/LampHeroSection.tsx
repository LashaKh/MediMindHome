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
      <div className="text-center max-w-5xl mx-auto space-y-20 pt-48 pb-32 px-8">
        {/* Logo and Brand */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <Stethoscope className="w-16 h-16 text-white" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </motion.div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white">
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
          className="mt-24 mb-20 bg-gradient-to-br from-slate-300 to-slate-500 py-10 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl leading-tight"
        >
          {t('hero.headline')} <br /> {t('hero.subheadline')}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl leading-relaxed text-gray-300 max-w-4xl mx-auto mb-20 px-6"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Key Value Props */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 md:gap-8 py-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 text-white">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span className="text-lg font-medium">{t('hero.valueProps.deepContext')}</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="text-lg font-medium">{t('hero.valueProps.security')}</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-lg font-medium">{t('hero.valueProps.insights')}</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={handleGetStarted}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-bold text-white shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('hero.startFreeTrial')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
          </motion.button>
          
          <motion.button
            onClick={handleDemoClick}
            className="group rounded-full border-2 border-cyan-400/30 px-8 py-4 text-lg font-semibold text-white hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('hero.seeProducts')}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-28 max-w-4xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400">{t('hero.stats.availability')}</div>
            <div className="text-gray-300 mt-2">{t('hero.stats.availabilityDesc')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400">{t('hero.stats.speed')}</div>
            <div className="text-gray-300 mt-2">{t('hero.stats.speedDesc')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400">{t('hero.stats.compliance')}</div>
            <div className="text-gray-300 mt-2">{t('hero.stats.complianceDesc')}</div>
          </div>
        </motion.div>
      </div>
    </LampContainer>
  );
}; 