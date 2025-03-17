import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  MessageSquare, 
  Clock, 
  Database, 
  BedDouble,
  Mic,
  UsersRound,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: BedDouble,
      title: "Real-time Bed Management",
      description: "Track and manage hospital bed occupancy in real-time with an intuitive interface for efficient patient distribution",
      variant: 'large' as const
    },
    {
      icon: Brain,
      title: "AI Medical Assistant",
      description: "Get instant AI-powered medical insights and recommendations based on patient data and clinical guidelines",
      variant: 'medium' as const
    },
    {
      icon: Mic,
      title: "Voice-Enabled Notes",
      description: "Capture patient notes hands-free with advanced voice recognition and automatic transcription",
      variant: 'medium' as const
    },
    {
      icon: UsersRound,
      title: "Shift Handover System",
      description: "Seamlessly transfer patient information between medical staff with structured digital handovers",
      variant: 'large' as const
    },
    {
      icon: ClipboardList,
      title: "Patient Tracking",
      description: "Monitor patient conditions, treatments, and progress with comprehensive digital records",
      variant: 'medium' as const
    },
    {
      icon: Shield,
      title: "Secure Data Sharing",
      description: "Share patient information securely between authorized healthcare providers with end-to-end encryption",
      variant: 'small' as const
    },
    {
      icon: Database,
      title: "Medical Records",
      description: "Centralized storage and easy access to patient histories, test results, and treatment plans",
      variant: 'small' as const
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Instant notifications and updates on patient status changes and critical events",
      variant: 'small' as const
    },
    {
      icon: Stethoscope,
      title: "Clinical Support",
      description: "Evidence-based recommendations and alerts to support clinical decision-making",
      variant: 'small' as const
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Comprehensive Healthcare Management
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Streamline your medical practice with our integrated suite of tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
              variant={feature.variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
};