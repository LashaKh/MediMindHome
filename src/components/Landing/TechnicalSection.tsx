import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Cloud, 
  Lock, 
  TrendingUp, 
  Users, 
  Building, 
  Zap
} from 'lucide-react';

export const TechnicalSection: React.FC = () => {
  const techFeatures = [
    {
      icon: Cpu,
      title: "Advanced AI Engine",
      description: "State-of-the-art machine learning models trained on medical data with 99.9% accuracy in clinical decision support.",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: Cloud,
      title: "Cloud-Native Architecture",
      description: "Scalable, HIPAA-compliant infrastructure that adapts to your hospital's growth and changing needs.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-grade encryption, multi-factor authentication, and comprehensive audit trails for complete data protection.",
      gradient: "from-red-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Sub-3-second response times for critical medical insights, ensuring rapid clinical decision support.",
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-gray-50 dark:from-primary dark:to-secondary overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05] bg-[size:80px]" />
        <motion.div 
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 dark:bg-accent/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-secondary/10 dark:bg-accent/30 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Technology Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Cutting-Edge Technology
            <span className="block text-secondary dark:text-accent mt-2">Built for Healthcare</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-200 leading-relaxed">
            Our platform combines advanced AI, cloud infrastructure, and enterprise-grade security 
            to deliver unparalleled medical intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-xl bg-white dark:bg-primary/80 p-6 shadow-lg border border-gray-100 dark:border-accent/20 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="text-center">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-4`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-200 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 