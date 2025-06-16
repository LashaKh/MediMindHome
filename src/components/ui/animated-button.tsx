import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SpiralAnimation } from './spiral-animation';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'lg'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-primary border-2 border-primary'
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowAnimation(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Keep animation running for a bit longer
    setTimeout(() => setShowAnimation(false), 1000);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-lg font-semibold transition-all duration-300
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Spiral Animation Background */}
      {showAnimation && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <SpiralAnimation />
        </div>
      )}
      
      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.button>
  );
}; 