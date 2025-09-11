import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  User, 
  ArrowRight, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { BackgroundCells } from '../ui/background-ripple-effect';

export const ProductsSection: React.FC = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 'central',
      icon: Building2,
      title: 'MediMind Central',
      subtitle: 'Hospitals & Health Systems',
      description: 'Complete AI-powered healthcare platform for large organizations with deep EMR integration and enterprise-grade security.',
      features: [
        'Deep EMR Integration',
        'AI Co-pilot for Clinical Decisions', 
        'Real-time Lab Warnings',
        'Clinical Decision Support',
        'Enterprise Security & Compliance'
      ],
      cta: 'Get Enterprise Demo'
    },
    {
      id: 'expert',
      icon: User,
      title: 'MediMind Expert',
      subtitle: 'Individual Physicians & Specialists',
      description: 'Specialized AI assistant for individual healthcare providers with custom knowledge bases and rapid deployment.',
      features: [
        'Specialty Knowledge Bases',
        'Clinical Guidelines & Protocols',
        'Medical Calculators',
        'Voice Transcription', 
        'Case Discussion Support'
      ],
      cta: 'Start Free Trial'
    }
  ];



  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Background with Ripple Effect */}
      <div className="absolute inset-0">
        <BackgroundCells className="bg-gradient-to-b from-white to-gray-50 dark:from-primary dark:to-secondary h-full" />
      </div>
      
      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-40">
        {/* Header */}
        <motion.div
          className="text-center max-w-5xl mx-auto mb-8 sm:mb-12 md:mb-16 py-4"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-full border border-accent/20 dark:border-accent/30 mb-6">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-accent font-semibold text-sm">Modern Healthcare</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black dark:text-white mb-4 sm:mb-6 leading-tight">
            AI Platform
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 dark:text-gray-200 leading-relaxed max-w-4xl mx-auto px-2 sm:px-4">
            Choose the perfect MediMind solution for your practice. From hospital systems to individual physician workflows, we have the AI tools to transform your healthcare delivery.
          </p>
        </motion.div>

        {/* Premium Product Cards */}
        <div className="max-w-7xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-stretch">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="group relative h-full"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                {/* Card Background with Glass Effect */}
                <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/30 dark:border-slate-700/30 shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:border-blue-200/30 dark:group-hover:border-slate-600/40 h-full flex flex-col">
                  
                  {/* Premium Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    index === 0 
                      ? 'from-blue-50/30 via-blue-100/20 to-transparent dark:from-blue-950/20 dark:via-blue-900/10 dark:to-transparent' 
                      : 'from-blue-50/30 via-slate-100/20 to-transparent dark:from-slate-950/20 dark:via-slate-900/10 dark:to-transparent'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  
                  {/* Top Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    index === 0 
                      ? 'from-blue-500 via-blue-600 to-cyan-500' 
                      : 'from-slate-500 via-slate-600 to-blue-500'
                  }`} />

                  <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col h-full">
                    {/* Header Section */}
                    <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <motion.div 
                        className={`relative p-4 rounded-2xl shadow-lg ${
                          index === 0 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                            : 'bg-gradient-to-br from-slate-600 to-slate-700'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <product.icon className="w-8 h-8 text-white relative z-10" />
                        
                        {/* Icon Glow Effect */}
                        <div className={`absolute inset-0 rounded-2xl ${
                          index === 0 
                            ? 'bg-blue-500/20' 
                            : 'bg-slate-500/20'
                        } blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{product.title}</h3>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm ${
                            index === 0 ? 'bg-blue-600' : 'bg-slate-600'
                          }`}>
                            {index === 0 ? 'Enterprise' : 'Professional'}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">{product.subtitle}</p>
                      </div>
                    </div>

                    {/* Enhanced Description */}
                    <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 font-medium">
                      {product.description}
                    </p>

                    {/* Premium Features */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 lg:mb-10 flex-grow">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-cyan-500" />
                        Key Capabilities
                      </h4>
                      
                      <div className="grid gap-3">
                        {product.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg bg-gradient-to-r from-gray-50/50 to-transparent dark:from-slate-800/30 dark:to-transparent border border-gray-200/30 dark:border-slate-700/20 hover:border-gray-300/50 dark:hover:border-slate-600/40 transition-colors duration-300"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: featureIndex * 0.08 + 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                          >
                            <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-slate-500'}`} />
                            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Section - CTA and Trust Badge */}
                    <div className="mt-auto">
                      {/* Enhanced CTA Button */}
                      <motion.button
                        onClick={() => {
                          if (index === 0) {
                            // Enterprise Demo - navigate to our demo request form
                            navigate('/request-demo');
                          } else {
                            // Start Free Trial - navigate to expert page
                            window.open('https://medimind.md/expert', '_blank');
                          }
                        }}
                        className={`group relative w-full p-4 sm:p-5 lg:p-6 rounded-2xl font-bold text-base sm:text-lg text-white shadow-xl overflow-hidden mb-4 sm:mb-6 ${
                          index === 0 
                            ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800' 
                            : 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Animated Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                        
                        <div className="relative flex items-center justify-center gap-3">
                          {product.cta}
                          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </motion.button>

                      {/* Trust Badge */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>HIPAA Compliant & SOC 2 Certified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle Background Glow */}
                <div className={`absolute -inset-4 bg-gradient-to-br ${
                  index === 0 
                    ? 'from-blue-500/8 to-blue-600/4' 
                    : 'from-slate-500/8 to-slate-600/4'
                } rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10`} />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}; 