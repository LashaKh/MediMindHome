import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Shield, 
  Activity,
  Database,
  Sparkles,
  Target,
  Star,
  Award,
  TrendingUp,
  Zap,
  Brain,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const competitiveAdvantages = [
    {
      icon: Target,
      title: t('features.advantages.customizable.title'),
      description: t('features.advantages.customizable.description'),
      details: ["Modular AI components", "Custom workflow integration", "Specialty-specific tools", "Flexible deployment"],
      badge: t('features.advantages.customizable.badge')
    },
    {
      icon: Database,
      title: t('features.advantages.integration.title'),
      description: t('features.advantages.integration.description'),
      details: ["200+ EMR systems", "48-hour deployment", "Zero downtime", "Real-time sync"],
      badge: t('features.advantages.integration.badge')
    },
    {
      icon: Users,
      title: t('features.advantages.design.title'),
      description: t('features.advantages.design.description'),
      details: ["Physician-designed UX", "Clinical workflow focus", "Intuitive interfaces", "Medical context aware"],
      badge: t('features.advantages.design.badge')
    },
    {
      icon: Sparkles,
      title: t('features.advantages.specialization.title'),
      description: t('features.advantages.specialization.description'),
      details: ["15+ medical specialties", "Department-specific AI", "Custom knowledge bases", "Specialized algorithms"],
      badge: t('features.advantages.specialization.badge')
    },
    {
      icon: Brain,
      title: t('features.advantages.intelligence.title'),
      description: t('features.advantages.intelligence.description'),
      details: ["Medical-grade AI models", "Continuous learning", "Evidence-based insights", "Predictive analytics"],
      badge: t('features.advantages.intelligence.badge')
    },
    {
      icon: Zap,
      title: t('features.advantages.performance.title'),
      description: t('features.advantages.performance.description'),
      details: ["<3s response time", "Real-time processing", "Edge computing", "Optimized algorithms"],
      badge: t('features.advantages.performance.badge')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-dark-secondary dark:via-dark-primary dark:to-dark-secondary" />
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.08] bg-[size:80px]" />
        
        {/* Floating Background Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-accent/5 to-primary/5 blur-3xl"
          animate={{ 
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          className="text-center max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 dark:border-accent/20 text-primary dark:text-accent text-sm font-semibold mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Award className="w-4 h-4" />
            {t('features.badge')}
          </motion.div>

          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t('features.title')}
            </span>
            <span className="block text-gray-900 dark:text-white mt-2">{t('features.subtitle')}</span>
          </h3>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-5xl mx-auto px-4 sm:px-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('features.description')}
            <span className="block mt-2 text-primary dark:text-accent font-semibold">
              {t('features.highlight')}
            </span>
          </motion.p>
        </motion.div>

        {/* Enhanced Competitive Advantages Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {competitiveAdvantages.map((advantage, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-dark-secondary/40 backdrop-blur-sm p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-accent/10 hover:shadow-2xl dark:hover:shadow-primary/20 transition-all duration-700 hover:-translate-y-3 h-full group-hover:border-primary/20 dark:group-hover:border-accent/30">
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                />
                
                <div className="relative z-10">
                  {/* Badge */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ scale: 0, rotate: -10 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-lg">
                      {advantage.badge}
                    </span>
                  </motion.div>

                  {/* Icon */}
                  <motion.div 
                    className="mb-6"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-lg">
                      <advantage.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </div>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="mb-6">
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors duration-300 mb-3 sm:mb-4">
                      {advantage.title}
                    </h4>
                    
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                      {advantage.description}
                    </p>
                  </div>

                  {/* Feature Details */}
                  <div className="space-y-3">
                    {advantage.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        className="flex items-center gap-3"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + detailIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                        <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                          {detail}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Statistics Section */}
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-primary dark:via-dark-secondary dark:to-dark-primary p-8 sm:p-12 md:p-16 shadow-2xl border border-gray-200 dark:border-accent/20"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.08] bg-[size:60px]" />
            <motion.div 
              className="absolute top-5 left-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-5 right-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 blur-2xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.6, 0.3, 0.6],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 dark:border-accent/30 text-primary dark:text-accent text-sm font-semibold mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <TrendingUp className="w-4 h-4" />
                Performance Metrics
              </motion.div>

              <h4 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Proven <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Excellence</span>
              </h4>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Industry-leading performance metrics that demonstrate our commitment to exceptional healthcare AI solutions.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Activity, value: "99.9%", label: "Accuracy Rate", color: "from-green-500 to-emerald-500" },
                { icon: Clock, value: "<3s", label: "Response Time", color: "from-blue-500 to-cyan-500" },
                { icon: Shield, value: "100%", label: "HIPAA Compliant", color: "from-purple-500 to-violet-500" },
                { icon: Users, value: "24/7", label: "Availability", color: "from-orange-500 to-red-500" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    <stat.icon className="h-10 w-10" />
                  </motion.div>
                  
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};