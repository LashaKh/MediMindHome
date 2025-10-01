import React from 'react';
import { motion } from 'framer-motion';
import { agentLayers } from './architecture-data';

interface ArchitectureCylinderProps {
  hoveredLayer: string | null;
  onLayerHover: (layerId: string | null) => void;
}

export const ArchitectureCylinder: React.FC<ArchitectureCylinderProps> = ({
  hoveredLayer,
  onLayerHover
}) => {
  return (
    <div className="relative w-full mx-auto h-[460px] flex items-center justify-center">
      {/* Visual boundary container */}
      <div className="absolute inset-4 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 backdrop-blur-sm opacity-60"></div>
      <div className="relative w-full h-full max-w-xs z-10">
        {/* Main Stack Container */}
        <div className="relative h-full flex flex-col justify-center space-y-3 px-4">
          {agentLayers.map((layer, index) => {
            const isHovered = hoveredLayer === layer.id;
            const isAnyHovered = hoveredLayer !== null;
            const shouldDim = isAnyHovered && !isHovered;
            
            return (
              <motion.div
                key={layer.id}
                className="relative cursor-pointer"
                onMouseEnter={() => onLayerHover(layer.id)}
                onMouseLeave={() => onLayerHover(null)}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ 
                  opacity: shouldDim ? 0.6 : 1,
                  y: 0,
                  scale: isHovered ? 1.05 : 1
                }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.1
                }}
                whileInView={{ opacity: shouldDim ? 0.6 : 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
              >
                {/* Cylinder Layer - Simplified and Visible */}
                <div className="relative">
                  {/* Top Circle */}
                  <div 
                    className={`w-full h-6 bg-gradient-to-r ${layer.color} rounded-full shadow-lg mb-1`}
                    style={{
                      transform: 'perspective(150px) rotateX(45deg) scaleY(0.6)',
                      transformOrigin: 'center bottom'
                    }}
                  />
                  
                  {/* Main Cylinder Body */}
                  <motion.div
                    className={`relative w-full h-12 bg-gradient-to-r ${layer.color} shadow-xl overflow-hidden`}
                    animate={{
                      boxShadow: isHovered 
                        ? '0 20px 50px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.3)' 
                        : '0 8px 25px rgba(0, 0, 0, 0.2)',
                      filter: isHovered ? 'brightness(1.2) saturate(1.3)' : 'brightness(1) saturate(1)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* 3D Effect Highlights */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/30" />
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-black/20" />
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30" />
                    
                    {/* Animated gradient overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${layer.color} opacity-0`}
                      animate={{
                        opacity: isHovered ? 0.3 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Shimmer effect on hover */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <motion.div
                          className="p-2 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20 relative overflow-hidden"
                          animate={{
                            scale: isHovered ? 1.3 : 1,
                            rotate: isHovered ? 12 : 0,
                            backgroundColor: isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                            boxShadow: isHovered 
                              ? '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(59, 130, 246, 0.3)' 
                              : '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                        >
                          {/* Icon glow background */}
                          {isHovered && (
                            <motion.div
                              className="absolute inset-0 bg-white/20 rounded-lg"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          )}
                          <layer.icon className="w-5 h-5 text-white drop-shadow-lg relative z-10" />
                        </motion.div>
                        
                        {/* Title */}
                        <div className="text-white">
                          <h4 className="text-sm font-bold leading-tight drop-shadow-lg">
                            {layer.title}
                          </h4>
                        </div>
                      </div>
                      
                      {/* Layer Number */}
                      <motion.div
                        className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-sm font-bold border border-white/20 relative overflow-hidden"
                        animate={{
                          scale: isHovered ? 1.4 : 1,
                          backgroundColor: isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                          rotate: isHovered ? 360 : 0,
                          boxShadow: isHovered 
                            ? '0 0 25px rgba(255,255,255,0.6), 0 0 50px rgba(59, 130, 246, 0.4)' 
                            : '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
                      >
                        {/* Pulsing background */}
                        {isHovered && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full"
                            animate={{
                              scale: [0.8, 1.2, 0.8],
                              opacity: [0.4, 0.8, 0.4]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                        <span className="relative z-10">{index + 1}</span>
                      </motion.div>
                    </div>
                    
                    {/* Enhanced Hover Glow Effects */}
                    {isHovered && (
                      <>
                        {/* Inner glow */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${layer.color} rounded-sm`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.3 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Outer luminescence - contained */}
                        <motion.div
                          className={`absolute -inset-px bg-gradient-to-r ${layer.color} rounded-lg blur-sm`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ 
                            opacity: 0.3,
                            scale: 1.02,
                          }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                        />
                        
                        {/* Pulsing aura - contained */}
                        <motion.div
                          className={`absolute -inset-0.5 bg-gradient-to-r ${layer.color} rounded-lg blur-md`}
                          animate={{
                            opacity: [0.1, 0.25, 0.1],
                            scale: [1, 1.03, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </>
                    )}
                  </motion.div>
                  
                  {/* Bottom Circle */}
                  <div 
                    className={`w-full h-6 bg-gradient-to-r ${layer.color} rounded-full shadow-lg mt-1`}
                    style={{
                      transform: 'perspective(150px) rotateX(-45deg) scaleY(0.6)',
                      transformOrigin: 'center top',
                      filter: 'brightness(0.8)'
                    }}
                  />
                </div>
                
                {/* Floating Particles on Hover */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${20 + i * 12}%`,
                          top: `${30 + (i % 2) * 40}%`
                        }}
                        animate={{
                          y: [-10, -30, -10],
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
};

