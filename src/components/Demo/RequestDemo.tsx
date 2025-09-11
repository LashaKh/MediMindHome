import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  User,
  Mail,
  Phone,
  Users,
  MapPin,
  Calendar,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
  Shield,
  HeartHandshake,
  DollarSign,
  Stethoscope,
  Activity
} from 'lucide-react';
import { AnimatedButton } from '../ui/animated-button';

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Company Details
  companyName: string;
  companySize: string;
  industry: string;
  jobTitle: string;
  
  // Healthcare Information
  facilityType: string;
  numberOfProviders: string;
  currentEHR: string;
  
  // Requirements
  useCase: string;
  timeline: string;
  budgetRange: string;
  specificNeeds: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  companySize: '',
  industry: '',
  jobTitle: '',
  facilityType: '',
  numberOfProviders: '',
  currentEHR: '',
  useCase: '',
  timeline: '',
  budgetRange: '',
  specificNeeds: ''
};

const companySizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
];

const industryOptions = [
  { value: 'hospital', label: 'Hospital System' },
  { value: 'clinic', label: 'Medical Clinic' },
  { value: 'private-practice', label: 'Private Practice' },
  { value: 'urgent-care', label: 'Urgent Care' },
  { value: 'specialty-care', label: 'Specialty Care' },
  { value: 'telemedicine', label: 'Telemedicine' },
  { value: 'other', label: 'Other Healthcare Organization' }
];

const facilityTypeOptions = [
  { value: 'primary-care', label: 'Primary Care' },
  { value: 'emergency', label: 'Emergency Department' },
  { value: 'icu', label: 'Intensive Care Unit' },
  { value: 'surgery', label: 'Surgery Center' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'multi-specialty', label: 'Multi-Specialty' }
];

const timelineOptions = [
  { value: 'immediate', label: 'Immediate (Within 1 month)' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6-12-months', label: '6-12 months' },
  { value: 'exploring', label: 'Just exploring options' }
];

const budgetRangeOptions = [
  { value: 'startup', label: 'Startup Budget (< $10K annually)' },
  { value: 'small', label: 'Small Practice ($10K - $50K annually)' },
  { value: 'medium', label: 'Medium Organization ($50K - $200K annually)' },
  { value: 'large', label: 'Large Organization ($200K - $500K annually)' },
  { value: 'enterprise', label: 'Enterprise ($500K+ annually)' },
  { value: 'discuss', label: 'Prefer to discuss' }
];

export const RequestDemo: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const totalSteps = 3;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 2:
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.companySize) newErrors.companySize = 'Company size is required';
        if (!formData.industry) newErrors.industry = 'Industry is required';
        if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
        break;
      case 3:
        if (!formData.facilityType) newErrors.facilityType = 'Facility type is required';
        if (!formData.numberOfProviders.trim()) newErrors.numberOfProviders = 'Number of providers is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center py-12 px-4">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-8" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Thank You for Your Interest!
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              We've received your demo request and a member of our healthcare AI team will contact you within 24 hours to schedule your personalized demonstration.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                What happens next?
              </h3>
              <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  Our team will review your requirements and prepare a customized demo
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  We'll contact you within 24 hours to schedule your demo
                </li>
                <li className="flex items-start gap-3">
                  <Stethoscope className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  Experience how MediMind can transform your healthcare practice
                </li>
              </ul>
            </div>
            
            <AnimatedButton
              onClick={handleBackHome}
              variant="primary"
              size="lg"
              className="shadow-xl"
            >
              Return to Home
              <ArrowRight className="h-5 w-5" />
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-12 px-4">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05] bg-[size:100px]" />
        <motion.div 
          className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-400/20 dark:bg-blue-600/30 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-400/20 dark:bg-indigo-600/30 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Enterprise Demo Request
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Schedule Your Personalized Demo
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience how MediMind can transform your healthcare organization. 
            Get a tailored demonstration based on your specific needs.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-full p-2">
            <div className="flex justify-between items-center">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`h-3 rounded-full flex-1 ${
                    i + 1 <= currentStep 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`} />
                  {i < totalSteps - 1 && <div className="w-2" />}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 px-2">
              {['Personal', 'Company', 'Healthcare'].map((label, i) => (
                <div key={i} className={`text-sm font-medium ${
                  i + 1 <= currentStep 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Personal Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Let's start with your basic details
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.firstName 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.lastName 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Work Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.email 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                          } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                          placeholder="Enter your work email"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.phone 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                          } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Company Details
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Tell us about your organization
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.companyName 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                        placeholder="Enter your company name"
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Size *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          value={formData.companySize}
                          onChange={(e) => handleInputChange('companySize', e.target.value)}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.companySize 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                          } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors appearance-none`}
                        >
                          <option value="">Select company size</option>
                          {companySizeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.companySize && (
                        <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Industry *
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.industry 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors appearance-none`}
                      >
                        <option value="">Select industry</option>
                        {industryOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.industry && (
                        <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.jobTitle 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                        placeholder="e.g., Chief Medical Officer, IT Director, Practice Manager"
                      />
                      {errors.jobTitle && (
                        <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Healthcare Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Help us understand your healthcare environment
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Facility Type *
                      </label>
                      <select
                        value={formData.facilityType}
                        onChange={(e) => handleInputChange('facilityType', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.facilityType 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors appearance-none`}
                      >
                        <option value="">Select facility type</option>
                        {facilityTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.facilityType && (
                        <p className="text-red-500 text-sm mt-1">{errors.facilityType}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Healthcare Providers *
                      </label>
                      <input
                        type="number"
                        value={formData.numberOfProviders}
                        onChange={(e) => handleInputChange('numberOfProviders', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.numberOfProviders 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        } bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                        placeholder="e.g., 15"
                        min="1"
                      />
                      {errors.numberOfProviders && (
                        <p className="text-red-500 text-sm mt-1">{errors.numberOfProviders}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current EHR System
                      </label>
                      <input
                        type="text"
                        value={formData.currentEHR}
                        onChange={(e) => handleInputChange('currentEHR', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-blue-500 bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        placeholder="e.g., Epic, Cerner, Allscripts, or 'None'"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12">
              {currentStep > 1 ? (
                <AnimatedButton
                  onClick={handlePrevious}
                  variant="secondary"
                  size="md"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </AnimatedButton>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <AnimatedButton
                  onClick={handleNext}
                  variant="primary"
                  size="md"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  onClick={handleSubmit}
                  variant="primary"
                  size="md"
                  className="shadow-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="h-4 w-4" />
                      Request Demo
                    </>
                  )}
                </AnimatedButton>
              )}
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              HIPAA Compliant
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              SOC 2 Certified
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4" />
              Trusted by 500+ Providers
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};