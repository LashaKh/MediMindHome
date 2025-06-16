import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  User, 
  Check, 
  ArrowRight, 
  Database, 
  UserCheck, 
  Brain,
  Shield,
  Stethoscope,
  FileText,
  Mic,
  Search,
  Calculator,
  Upload,
  CheckCircle,
  Zap,
  Clock,
  Users,
  Star,
  Award,
  TrendingUp,
  Globe,
  Sparkles
} from 'lucide-react';
import { BackgroundCells } from '../ui/background-ripple-effect';
import { useTranslation } from '../../hooks/useTranslation';

export const ProductsSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeProduct, setActiveProduct] = useState<'central' | 'expert'>('central');

  const products = [
    {
      id: 'central',
      icon: Building2,
      title: t('products.central.title'),
      subtitle: t('products.central.subtitle'),
      price: t('products.central.price'),
      description: t('products.central.description'),
      target: t('products.central.target'),
      paymentModel: t('products.central.paymentModel'),
      badge: t('products.central.badge'),
      features: [
        t('products.central.features.deepEmr'),
        t('products.central.features.aiCoPilot'),
        t('products.central.features.labWarnings'),
        t('products.central.features.clinicalSupport'),
        t('products.central.features.documentation'),
        t('products.central.features.transcription'),
        t('products.central.features.research'),
        t('products.central.features.workflow'),
        t('products.central.features.decisionTrees'),
        t('products.central.features.security')
      ],
      advantages: [
        t('products.central.advantages.noManualEntry'),
        t('products.central.advantages.instantAccess'),
        t('products.central.advantages.proactiveAlerts'),
        t('products.central.advantages.enterpriseSecurity'),
        t('products.central.advantages.seamlessIntegration')
      ],
      gradient: "from-primary via-secondary to-accent",
      stats: [
        { label: t('products.central.stats.hospitals'), value: "25+", icon: Building2 },
        { label: t('products.central.stats.physicians'), value: "500+", icon: Users },
        { label: t('products.central.stats.accuracy'), value: "99.9%", icon: Award },
        { label: t('products.central.stats.uptime'), value: "99.99%", icon: TrendingUp }
      ]
    },
    {
      id: 'expert',
      icon: User,
      title: t('products.expert.title'),
      subtitle: t('products.expert.subtitle'),
      price: t('products.expert.price'),
      description: t('products.expert.description'),
      target: t('products.expert.target'),
      paymentModel: t('products.expert.paymentModel'),
      badge: t('products.expert.badge'),
      features: [
        t('products.expert.features.knowledgeBases'),
        t('products.expert.features.specialties'),
        t('products.expert.features.guidelines'),
        t('products.expert.features.calculators'),
        t('products.expert.features.customKnowledge'),
        t('products.expert.features.uploadMaterials'),
        t('products.expert.features.analysisTools'),
        t('products.expert.features.voiceTranscription'),
        t('products.expert.features.searchAssistant'),
        t('products.expert.features.caseDiscussion')
      ],
      advantages: [
        t('products.expert.advantages.noIntegration'),
        t('products.expert.advantages.immediateSetup'),
        t('products.expert.advantages.affordablePricing'),
        t('products.expert.advantages.specialtyFocused'),
        t('products.expert.advantages.personalCustomization')
      ],
      gradient: "from-secondary via-accent to-primary",
      stats: [
        { label: t('products.expert.stats.specialties'), value: "15+", icon: Stethoscope },
        { label: t('products.expert.stats.guidelines'), value: "1000+", icon: FileText },
        { label: t('products.expert.stats.response'), value: "<3s", icon: Clock },
        { label: t('products.expert.stats.satisfaction'), value: "98%", icon: Star }
      ]
    }
  ];

  const integrationFeatures = [
    {
      icon: Zap,
      title: t('products.integration.features.deployment.title'),
      description: t('products.integration.features.deployment.description'),
      details: [
        t('products.integration.features.deployment.details.hourDeployment'),
        t('products.integration.features.deployment.details.zeroDowntime'),
        t('products.integration.features.deployment.details.dedicatedTeam'),
        t('products.integration.features.deployment.details.customConfig')
      ],
      badge: t('products.integration.features.deployment.badge')
    },
    {
      icon: Shield,
      title: t('products.integration.features.security.title'),
      description: t('products.integration.features.security.description'),
      details: [
        t('products.integration.features.security.details.soc2Certified'),
        t('products.integration.features.security.details.endToEndEncryption'),
        t('products.integration.features.security.details.roleBasedAccess'),
        t('products.integration.features.security.details.continuousMonitoring')
      ],
      badge: t('products.integration.features.security.badge')
    },
    {
      icon: Clock,
      title: t('products.integration.features.support.title'),
      description: t('products.integration.features.support.description'),
      details: [
        t('products.integration.features.support.details.medicalSpecialists'),
        t('products.integration.features.support.details.uptimeSla'),
        t('products.integration.features.support.details.priorityQueue'),
        t('products.integration.features.support.details.proactiveMonitoring')
      ],
      badge: t('products.integration.features.support.badge')
    },
    {
      icon: Users,
      title: t('products.integration.features.training.title'),
      description: t('products.integration.features.training.description'),
      details: [
        t('products.integration.features.training.details.certificationPrograms'),
        t('products.integration.features.training.details.videoTutorials'),
        t('products.integration.features.training.details.liveSessions'),
        t('products.integration.features.training.details.changeManagement')
      ],
      badge: t('products.integration.features.training.badge')
    },
    {
      icon: Database,
      title: t('products.integration.features.universalIntegration.title'),
      description: t('products.integration.features.universalIntegration.description'),
      details: [
        t('products.integration.features.universalIntegration.details.emrIntegrations'),
        t('products.integration.features.universalIntegration.details.realTimeSync'),
        t('products.integration.features.universalIntegration.details.customEndpoints'),
        t('products.integration.features.universalIntegration.details.legacySupport')
      ],
      badge: t('products.integration.features.universalIntegration.badge')
    },
    {
      icon: Building2,
      title: t('products.integration.features.scalability.title'),
      description: t('products.integration.features.scalability.description'),
      details: [
        t('products.integration.features.scalability.details.autoScaling'),
        t('products.integration.features.scalability.details.multiRegion'),
        t('products.integration.features.scalability.details.loadBalancing'),
        t('products.integration.features.scalability.details.performanceOptimization')
      ],
      badge: t('products.integration.features.scalability.badge')
    }
  ];

  const currentProduct = products.find(p => p.id === activeProduct)!;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Ripple Effect */}
      <div className="absolute inset-0">
        <BackgroundCells className="bg-gradient-to-b from-white to-gray-50 dark:from-primary dark:to-secondary h-full" />
      </div>
      
      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-40">
        {/* Header */}
        <motion.div
          className="text-center max-w-5xl mx-auto mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-full border border-accent/20 dark:border-accent/30 mb-6">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-accent font-semibold text-sm">{t('products.badge')}</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t('products.title')}
            <br />
            <span className="text-gray-900 dark:text-white">{t('products.subtitle')}</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-200 leading-relaxed max-w-4xl mx-auto">
            {t('products.description')}
          </p>
        </motion.div>

        {/* Product Selector */}
        <motion.div
          className="flex justify-center mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="relative flex bg-white/80 dark:bg-primary/60 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 dark:border-accent/20 shadow-lg">
            <motion.div
              className={`absolute top-2 bottom-2 bg-gradient-to-r ${currentProduct.gradient} rounded-xl shadow-lg ${
                activeProduct === 'central' ? 'left-2 right-1/2 mr-1' : 'left-1/2 right-2 ml-1'
              }`}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => setActiveProduct(product.id as 'central' | 'expert')}
                className={`relative z-10 flex items-center gap-3 px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                  activeProduct === product.id 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <product.icon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">{product.title}</div>
                  <div className="text-sm opacity-80">{product.target}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Details */}
        <motion.div
          key={activeProduct}
          className="max-w-7xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Product Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-primary/80 backdrop-blur-sm p-12 shadow-2xl border border-gray-200 dark:border-accent/20 mb-16">
            <div className="absolute top-6 right-6">
              <span className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-accent to-secondary rounded-full shadow-lg">
                {currentProduct.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-6 mb-6">
                    <div className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${currentProduct.gradient} text-white shadow-xl`}>
                      <currentProduct.icon className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{currentProduct.title}</h3>
                      <p className="text-xl text-gray-600 dark:text-gray-300">{currentProduct.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
                    {currentProduct.description}
                  </p>

                  <div className="bg-gradient-to-r from-gray-50 to-white dark:from-secondary/50 dark:to-primary/50 rounded-2xl p-8 space-y-6 border border-gray-200 dark:border-accent/20">
                    <div className="flex items-center gap-4">
                      <UserCheck className="w-6 h-6 text-accent" />
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{t('products.targetLabel')}: {currentProduct.target}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Database className="w-6 h-6 text-accent" />
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{t('products.modelLabel')}: {currentProduct.paymentModel}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {currentProduct.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {currentProduct.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-4 bg-white/60 dark:bg-primary/60 rounded-xl border border-gray-200 dark:border-accent/20"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <stat.icon className="h-8 w-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  className={`group w-full inline-flex items-center justify-center gap-4 px-10 py-6 text-xl font-bold text-white bg-gradient-to-r ${currentProduct.gradient} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeProduct === 'central' ? t('products.central.cta') : t('products.expert.cta')}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Features List */}
              <div className="space-y-8">
                <h4 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Brain className="w-8 h-8 text-accent" />
                  {t('products.completeFeatureSet')}
                </h4>
                
                <div className="space-y-4">
                  {currentProduct.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-white/60 dark:bg-primary/60 rounded-xl border border-gray-200 dark:border-accent/20 hover:border-accent/40 dark:hover:border-accent/40 hover:shadow-lg transition-all duration-300"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Key Advantages */}
                <div className="mt-8">
                  <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-accent" />
                    {t('products.keyAdvantages')}
                  </h5>
                  <div className="space-y-3">
                    {currentProduct.advantages.map((advantage, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Integration Features */}
        <motion.div
          className="text-center max-w-6xl mx-auto mb-24"
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
            <Building2 className="w-4 h-4" />
            {t('products.integration.badge')}
          </motion.div>

          <h3 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            <span className="text-accent dark:text-accent">
              {t('products.integration.title')}
            </span>
            <span className="block text-gray-900 dark:text-white mt-2">{t('products.integration.subtitle')}</span>
          </h3>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-5xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {t('products.integration.description')} <span className="text-primary dark:text-accent font-semibold">{t('products.integration.highlight')}</span>
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrationFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-dark-secondary/40 backdrop-blur-sm p-8 shadow-xl border border-gray-100 dark:border-accent/10 hover:shadow-2xl dark:hover:shadow-primary/20 transition-all duration-700 hover:-translate-y-3 h-full group-hover:border-primary/20 dark:group-hover:border-accent/30">
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
                      {feature.badge}
                    </span>
                  </motion.div>

                  {/* Icon */}
                  <motion.div 
                    className="mb-6"
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-lg">
                      <feature.icon className="h-8 w-8" />
                    </div>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors duration-300 mb-4">
                      {feature.title}
                    </h4>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>

                  {/* Feature Details */}
                  <div className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        className="flex items-center gap-3"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + detailIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {detail}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 