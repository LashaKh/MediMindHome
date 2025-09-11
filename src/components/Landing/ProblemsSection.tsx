import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  FileX, 
  TrendingDown,
  Users,
  DollarSign,
  Brain,
  Shield,
  ArrowRight,
  Zap,
  Search,
  Mic
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const ProblemsSection: React.FC = () => {
  const { t } = useTranslation();
  
  const problems = [
    {
      icon: AlertTriangle,
      title: t('problems.items.errors.title'),
      description: t('problems.items.errors.description'),
      stat: t('problems.items.errors.stat'),
      statLabel: t('problems.items.errors.statLabel'),
      impact: "Critical"
    },
    {
      icon: Clock,
      title: t('problems.items.burden.title'),
      description: t('problems.items.burden.description'),
      stat: t('problems.items.burden.stat'),
      statLabel: t('problems.items.burden.statLabel'),
      impact: "High"
    },
    {
      icon: FileX,
      title: t('problems.items.fragmentation.title'),
      description: t('problems.items.fragmentation.description'),
      stat: t('problems.items.fragmentation.stat'),
      statLabel: t('problems.items.fragmentation.statLabel'),
      impact: "High"
    },
    {
      icon: TrendingDown,
      title: t('problems.items.burnout.title'),
      description: t('problems.items.burnout.description'),
      stat: t('problems.items.burnout.stat'),
      statLabel: t('problems.items.burnout.statLabel'),
      impact: "Critical"
    }
  ];

  const solutions = [
    {
      icon: Brain,
      title: t('problems.solutions.deepContext.title'),
      description: t('problems.solutions.deepContext.description'),
      feature: t('problems.solutions.deepContext.feature'),
      details: ["Automatic EMR integration", "Real-time patient analysis", "Contextual decision support"]
    },
    {
      icon: Zap,
      title: t('problems.solutions.insights.title'), 
      description: t('problems.solutions.insights.description'),
      feature: t('problems.solutions.insights.feature'),
      details: ["ECG interpretation", "Lab result analysis", "Diagnostic suggestions"]
    },
    {
      icon: Shield,
      title: t('problems.solutions.safety.title'),
      description: t('problems.solutions.safety.description'),
      feature: t('problems.solutions.safety.feature'),
      details: ["Critical value alerts", "Drug interaction warnings", "Contraindication detection"]
    },
    {
      icon: FileX,
      title: t('problems.solutions.documentation.title'),
      description: t('problems.solutions.documentation.description'),
      feature: t('problems.solutions.documentation.feature'),
      details: ["Auto-generated notes", "Clinical summaries", "Structured reporting"]
    },
    {
      icon: Mic,
      title: t('problems.solutions.transcription.title'),
      description: t('problems.solutions.transcription.description'),
      feature: t('problems.solutions.transcription.feature'),
      details: ["Medical transcription", "Conversation analysis", "Auto-documentation"]
    },
    {
      icon: Search,
      title: t('problems.solutions.research.title'),
      description: t('problems.solutions.research.description'),
      feature: t('problems.solutions.research.feature'),
      details: ["Research summaries", "Evidence-based recommendations", "Latest guidelines"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden bg-white dark:bg-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.08] bg-[size:80px]" />
        <motion.div 
          className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          className="text-center max-w-5xl mx-auto mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 dark:border-accent/20 text-primary dark:text-accent text-sm font-semibold mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AlertTriangle className="w-4 h-4" />
            {t('problems.badge')}
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
            {t('problems.title')}
            <motion.span 
              className="block text-primary dark:text-accent mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text dark:text-transparent"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              {t('problems.subtitle')}
            </motion.span>
          </h2>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto px-4 sm:px-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('problems.description')} <span className="text-primary dark:text-accent font-semibold">{t('problems.highlight')}</span>
          </motion.p>
        </motion.div>

        {/* Enhanced Problems Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20 md:mb-24 lg:mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-dark-secondary/50 backdrop-blur-sm p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-accent/10 hover:shadow-2xl dark:hover:shadow-primary/20 transition-all duration-700 hover:-translate-y-3 h-full group-hover:border-primary/20 dark:group-hover:border-accent/30">
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  layoutId={`problem-bg-${index}`}
                />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <motion.div 
                      className="flex-shrink-0 inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <problem.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors duration-300">
                          {problem.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          problem.impact === 'Critical' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                        }`}>
                          {problem.impact}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
                        {problem.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-primary/50 dark:to-dark-secondary/50 rounded-xl">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {problem.stat}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                        {problem.statLabel}
                      </div>
                    </div>
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:from-secondary group-hover:to-accent transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowRight className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Solutions Preview */}
        <motion.div
          className="text-center max-w-5xl mx-auto mb-12 sm:mb-16 md:mb-20"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 dark:border-accent/30 text-primary dark:text-accent text-sm font-semibold mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Brain className="w-4 h-4" />
            {t('problems.solutions.title')}
          </motion.div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t('problems.solutions.subtitle')}
            </span>
          </h3>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed px-4 sm:px-6">
            {t('problems.solutions.description')}
          </p>
        </motion.div>

        {/* Enhanced Solutions Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group text-center"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-dark-secondary/40 backdrop-blur-sm p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-accent/10 hover:shadow-2xl dark:hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2 group-hover:border-primary/20 dark:group-hover:border-accent/30 h-full">
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="mb-6"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-lg mx-auto">
                      <solution.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </div>
                  </motion.div>
                  
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary dark:text-accent text-xs font-semibold mb-3">
                      {solution.feature}
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors duration-300 mb-3 sm:mb-4">
                      {solution.title}
                    </h4>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6">
                    {solution.description}
                  </p>

                  {solution.details && (
                    <ul className="space-y-2 text-left">
                      {solution.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}; 