import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Sparkles, 
  Shield, 
  Zap
} from 'lucide-react';
import { ArchitectureCylinder } from '../ui/architecture-cylinder';
import { agentLayers } from '../ui/architecture-data';

export const ArchitectureSection: React.FC = () => {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

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

  const hoveredAgentData = hoveredLayer ? agentLayers.find(layer => layer.id === hoveredLayer) : null;

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
          className="text-center max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20"
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
            <Layers className="w-4 h-4" />
            Technical Architecture
          </motion.div>

          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Multi-Agentic
            </span>
            <span className="block text-gray-900 dark:text-white mt-2">Architecture</span>
          </h3>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-5xl mx-auto px-4 sm:px-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Our revolutionary layered AI system ensures maximum accuracy and reliability through multiple specialized agents working in harmony.
            <span className="block mt-2 text-primary dark:text-accent font-semibold">
              Each layer adds a critical validation step to guarantee medical-grade precision.
            </span>
          </motion.p>
        </motion.div>

        {/* Main Architecture Visualization */}
        <motion.div
          className="mb-16 sm:mb-20 md:mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Side-by-side Layout: 3D Cylinder and Detail Card */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start"
            variants={itemVariants}
          >
            {/* Left Side - 3D Cylinder Visualization */}
            <motion.div 
              className="flex flex-col items-center justify-center"
              variants={itemVariants}
            >
              <div className="relative bg-white dark:bg-dark-secondary/40 rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-200 dark:border-accent/20 backdrop-blur-sm w-full max-w-lg">
                <ArchitectureCylinder 
                  hoveredLayer={hoveredLayer}
                  onLayerHover={setHoveredLayer}
                />
              </div>
            </motion.div>

            {/* Right Side - Interactive Detail Card */}
            <motion.div 
              className="flex flex-col justify-center"
              variants={itemVariants}
            >
              <div className="space-y-6">
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Architecture Details
                </h4>
                
                <motion.div
                  className="relative overflow-hidden rounded-2xl bg-white dark:bg-dark-secondary/40 backdrop-blur-sm p-8 shadow-xl border border-gray-100 dark:border-accent/10 min-h-[400px]"
                  animate={{
                    scale: hoveredAgentData ? 1.02 : 1,
                    boxShadow: hoveredAgentData 
                      ? '0 25px 50px rgba(59, 130, 246, 0.15)' 
                      : '0 15px 30px rgba(0, 0, 0, 0.1)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {hoveredAgentData ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${hoveredAgentData.color} text-white shadow-lg`}>
                          <hoveredAgentData.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h5 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {hoveredAgentData.title}
                          </h5>
                          <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent font-semibold">
                            Layer {hoveredAgentData.position + 1} of 5
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {hoveredAgentData.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-accent" />
                          <span className="font-medium text-accent">
                            Active in processing pipeline
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-primary" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            Medical-grade validation
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="mb-6"
                      >
                        <Sparkles className="w-16 h-16 text-primary" />
                      </motion.div>
                      <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Explore Each Layer
                      </h5>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                        Hover over any layer in the architecture visualization to see detailed information about its role.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};