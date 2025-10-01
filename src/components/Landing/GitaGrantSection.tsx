import React from 'react';
import gitaGrantLogo from '../../assets/images/gita-grant-logo.png';

export const GitaGrantSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-dark-primary py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/30 dark:from-accent/10 dark:to-secondary/20 rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-secondary/20 to-accent/30 dark:from-secondary/10 dark:to-accent/15 rounded-full blur-3xl transform translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-accent/20 to-primary/30 dark:from-primary/10 dark:to-accent/15 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      {/* Geometric Grid Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="h-full w-full bg-grid-white bg-repeat" style={{
          backgroundImage: 'linear-gradient(to right, rgba(26, 54, 93, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(26, 54, 93, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Floating Badge */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-pulse" />
              <div className="relative bg-white dark:bg-dark-secondary rounded-xl px-6 py-3 border border-gray-200 dark:border-dark-border shadow-lg">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold text-sm tracking-wider uppercase">
                  Grant Recognition
                </span>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Proudly Supported by
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              GITA Grant Program
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-700 dark:text-dark-muted max-w-4xl mx-auto leading-relaxed font-light">
            MediMind's groundbreaking healthcare AI solutions are proudly supported by the 
            <span className="font-semibold text-gray-900 dark:text-white"> Georgia's Innovation and Technology Agency (GITA)</span>, 
            empowering us to revolutionize medical technology for better patient outcomes.
          </p>
        </div>

        {/* Logo and Content Card */}
        <div className="relative max-w-5xl mx-auto">
          <div className="group relative">
            {/* Animated Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000 animate-pulse" />
            
            {/* Main Card */}
            <div className="relative bg-white/90 dark:bg-dark-secondary/90 backdrop-blur-xl rounded-3xl border border-gray-200/30 dark:border-dark-border/30 shadow-2xl overflow-hidden">
              {/* Inner Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-accent/10 dark:via-transparent dark:to-secondary/10 pointer-events-none" />
              
              <div className="relative p-8 lg:p-16">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                  {/* Logo Container */}
                  <div className="flex-shrink-0 group/logo">
                    <div className="relative">
                      {/* Logo Glow Effect */}
                      <div className="absolute -inset-8 bg-gradient-to-r from-primary to-accent rounded-full blur-3xl opacity-0 group-hover/logo:opacity-20 transition duration-700" />
                      
                      {/* Logo Image with Sophisticated Frame */}
                      <div className="relative bg-white dark:bg-dark-primary rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-dark-border/50 transform group-hover/logo:scale-105 transition duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-dark-secondary dark:to-dark-primary rounded-2xl" />
                        <img 
                          src={gitaGrantLogo} 
                          alt="GITA Grant Program Logo" 
                          className="relative w-48 lg:w-64 h-auto object-contain filter drop-shadow-lg"
                        />
                      </div>
                      
                      {/* Floating Particles Effect */}
                      <div className="absolute -top-4 -right-4 w-3 h-3 bg-primary rounded-full opacity-60 animate-ping" />
                      <div className="absolute -bottom-4 -left-4 w-2 h-2 bg-secondary rounded-full opacity-40 animate-ping" style={{ animationDelay: '1s' }} />
                      <div className="absolute top-1/2 -right-6 w-1.5 h-1.5 bg-accent rounded-full opacity-50 animate-ping" style={{ animationDelay: '2s' }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="mb-8">
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                        Advancing Healthcare Innovation
                      </h3>
                      <p className="text-lg text-gray-700 dark:text-dark-muted leading-relaxed mb-6">
                        Through strategic partnership with GITA, we're developing cutting-edge AI solutions 
                        that transform how medical professionals diagnose, treat, and care for patients across Georgia and beyond.
                      </p>
                      
                      {/* Key Points */}
                      <div className="space-y-4">
                        {[
                          { 
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            ), 
                            text: "Pioneering AI-driven medical technology" 
                          },
                          { 
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            ), 
                            text: "Enhancing healthcare accessibility nationwide" 
                          },
                          { 
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            ), 
                            text: "Fostering innovation through strategic partnerships" 
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-center lg:justify-start gap-4 group/item">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border border-primary/20 dark:border-accent/30 rounded-xl flex items-center justify-center text-primary dark:text-accent group-hover/item:scale-110 group-hover/item:bg-gradient-to-br group-hover/item:from-primary/20 group-hover/item:to-accent/20 dark:group-hover/item:from-primary/30 dark:group-hover/item:to-accent/30 transition-all duration-300">
                              {item.icon}
                            </div>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Accent Line */}
              <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};