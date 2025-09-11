import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle,
  Star,
  Users,
  Building,
  Award,
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { AnimatedButton } from '../ui/animated-button';

export const CTASection: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleExpertTrial = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/signup');
    }
  };

  const handleContactSales = () => {
    // This would typically open a contact form or redirect to a contact page
    window.location.href = 'mailto:sales@medimind.ai?subject=MediMind Central - Contact Sales';
  };

  const handleScheduleDemo = () => {
    navigate('/request-demo');
  };

  const benefits = [
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Get started in under 5 minutes with our streamlined onboarding process"
    },
    {
      icon: CheckCircle,
      title: "30-Day Free Trial",
      description: "Experience the full power of MediMind with no commitment required"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Our medical AI experts are available around the clock to assist you"
    },
    {
      icon: Award,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security that meets all healthcare compliance standards"
    }
  ];

  const stats = [
    { value: "99.9%", label: "Diagnostic Accuracy", icon: TrendingUp },
    { value: "3x", label: "Faster Diagnoses", icon: Zap },
    { value: "500+", label: "Healthcare Professionals", icon: Users },
    { value: "25+", label: "Medical Facilities", icon: Building }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-gray-50 to-white dark:from-secondary dark:to-primary overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05] bg-[size:100px]" />
        <motion.div 
          className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-primary/10 dark:bg-accent/20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-secondary/10 dark:bg-accent/30 blur-3xl"
          animate={{ 
            scale: [1.3, 1, 1.3],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Heading */}
        <motion.div
          className="text-center mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-accent/20 rounded-full text-primary dark:text-accent font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Ready to Transform Healthcare?
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            Start Your AI Journey
            <br />
            <span className="text-primary dark:text-accent">Today</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-200 leading-relaxed max-w-4xl mx-auto mb-12">
            Join hundreds of healthcare professionals who are already using MediMind to enhance 
            clinical decision-making, reduce administrative burden, and improve patient outcomes.
          </p>

          {/* Primary CTA with Spiral Animation */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <AnimatedButton
              onClick={handleScheduleDemo}
              variant="primary"
              size="lg"
              className="shadow-2xl"
            >
              <Calendar className="h-5 w-5" />
              Schedule Demo Now
              <ArrowRight className="h-5 w-5" />
            </AnimatedButton>
            
            <AnimatedButton
              onClick={handleContactSales}
              variant="secondary"
              size="lg"
            >
              <Phone className="h-5 w-5" />
              Contact Sales
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-xl bg-white dark:bg-primary/80 p-6 shadow-lg border border-gray-100 dark:border-accent/20 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-lg mb-4">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-200 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA Banner */}
        <motion.div
          className="text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-12 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:40px]" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Don't Wait. Start Saving Lives Today.
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Every day without MediMind is a missed opportunity to prevent medical errors, 
                save time, and improve patient outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AnimatedButton
                  onClick={handleScheduleDemo}
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 border-0"
                >
                  <Calendar className="h-5 w-5" />
                  Schedule Demo Now
                </AnimatedButton>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call (555) 123-4567
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 