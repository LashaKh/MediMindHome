import React, { useState, KeyboardEvent, useEffect } from 'react';
import { useMessageInput } from './InputArea/useMessageInput';
import { useTranslation } from '../../hooks/useTranslation';
import { MessageInputProps } from './InputArea/types';
import { VoiceInput } from './InputArea/VoiceInput';
import { TextArea } from './InputArea/TextArea';
import { SendButton } from './InputArea/SendButton';
import { ImageUploadButton } from './InputArea/ImageUploadButton';
import { ImagePreview } from './InputArea/ImagePreview';
import { PaperclipIcon, Sparkles, X, HeartPulse, ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

// Array of 30+ cardiology-related complex questions for medical professionals
const cardiologyPrompts = [
  "What's your interpretation of ST-elevation in leads V1-V4 with reciprocal changes in a 58-year-old patient with acute chest pain?",
  "How do you differentiate between LBBB-induced ST changes and true STEMI in emergency presentations?",
  "What is your approach to management of refractory ventricular tachycardia in post-MI patients?",
  "What are the latest evidence-based treatment protocols for NSTEMI with elevated troponin levels?",
  "How do you interpret elevated BNP levels in the context of preserved ejection fraction?",
  "What's your approach to antithrombotic therapy in AFib patients with high HAS-BLED scores?",
  "How do you manage rate vs rhythm control in atrial fibrillation patients with tachycardia-induced cardiomyopathy?",
  "Discuss the hemodynamic consequences of severe mitral regurgitation in acute settings vs chronic adaptation",
  "What are the indications for CRT-D vs ICD in patients with NYHA Class III heart failure?",
  "How do you approach perioperative management of patients with drug-eluting stents requiring non-cardiac surgery?",
  "What's your interpretation of an asymmetrically hypertrophied interventricular septum with systolic anterior motion?",
  "Discuss the role of SGLT2 inhibitors in heart failure patients with preserved ejection fraction",
  "What's your management protocol for cardiogenic shock following extensive anterior wall MI?",
  "How do you interpret diastolic dysfunction patterns on echocardiography in restrictive cardiomyopathy?",
  "What are the latest guideline recommendations for managing hypertrophic obstructive cardiomyopathy?",
  "Discuss the differential diagnosis of elevated troponin in a patient without chest pain or ECG changes",
  "What's your approach to anticoagulation bridging in mechanical valve patients requiring invasive procedures?",
  "How do you differentiate between constrictive pericarditis and restrictive cardiomyopathy?",
  "What diagnostic approach would you take for suspected cardiac amyloidosis in elderly patients with heart failure?",
  "How do you interpret strain imaging in subclinical LV dysfunction from cardiotoxic chemotherapy?",
  "What are the current recommendations for TAVR vs SAVR in moderate-risk patients with aortic stenosis?",
  "Discuss the role of coronary calcium scoring in asymptomatic patients with intermediate cardiovascular risk",
  "What's your approach to diagnosis and management of stress-induced cardiomyopathy?",
  "How do you manage antiplatelet therapy after PCI in patients requiring long-term anticoagulation?",
  "What is your interpretation of Brugada pattern on ECG in asymptomatic patients?",
  "How do you approach evaluation of syncope in patients with QTc prolongation?",
  "Discuss the role of cardiac MRI in myocardial viability assessment after MI",
  "What's your approach to management of pulmonary hypertension in left heart disease?",
  "How do you interpret hemodynamic findings in cardiac catheterization for constrictive pericarditis?",
  "What is your approach to diagnosis and management of cardiac sarcoidosis?",
  "Discuss the optimal timing for intervention in asymptomatic severe mitral regurgitation",
  "What's your interpretation of discordant findings between FFR and IVUS in intermediate coronary lesions?",
  "How do you approach management of patients with bicuspid aortic valve and ascending aortic dilation?",
  "What's your diagnostic workup for cardiac involvement in systemic inflammatory diseases?",
  "Discuss the utility of strain echocardiography in diagnosing subclinical myocardial dysfunction"
];

export const InputArea: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const { 
    message, 
    setMessage, 
    handleSubmit,
    selectedImage,
    imagePreviewUrl,
    handleImageSelect,
    clearImage,
    fileInputRef
  } = useMessageInput(onSend);
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const [displayedPrompts, setDisplayedPrompts] = useState<string[]>([]);
  const [showPrompts, setShowPrompts] = useState(true);

  // Set initial prompts and rotate them periodically
  useEffect(() => {
    // Function to get random prompts
    const getRandomPrompts = () => {
      const shuffled = [...cardiologyPrompts].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4); // Display 4 prompts at a time
    };

    // Set initial prompts
    setDisplayedPrompts(getRandomPrompts());

    // No interval for rotation - prompts will only change when component mounts
  }, []);

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const togglePrompts = () => {
    setShowPrompts(!showPrompts);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const usePrompt = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Cardiology prompts */}
        {message.trim() === '' && !selectedImage && (
          <div className="mb-4">
            <button 
              onClick={togglePrompts}
              className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              {showPrompts ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
              <HeartPulse className="w-4 h-4 text-primary dark:text-accent" />
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">Suggested cardiology queries</h3>
            </button>
            
            {showPrompts && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {displayedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => usePrompt(prompt)}
                    className="text-left p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary dark:before:bg-accent"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3 h-3 mt-0.5 text-primary dark:text-accent flex-shrink-0" />
                      <span className="text-xs line-clamp-2">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ImagePreview 
            imageUrl={imagePreviewUrl} 
            onClear={clearImage} 
          />
          
          <div className="flex flex-col gap-3">
            <div className="relative w-full">
              <TextArea
                value={message}
                onChange={setMessage}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder="Enter your cardiology query or select from suggestions above..."
                className="w-full min-h-[80px] py-4 px-4 pr-14 text-base rounded-xl shadow-sm"
              />

              <div className="absolute right-3 bottom-3 flex items-center">
                <SendButton
                  disabled={(!message.trim() && !selectedImage) || !!disabled}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleActions}
                  className={clsx(
                    "p-2 rounded-lg transition-colors",
                    showActions 
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                  )}
                >
                  {showActions ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <PaperclipIcon className="w-5 h-5" />
                  )}
                </button>
                
                {showActions && (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <ImageUploadButton
                      onSelect={handleImageSelect}
                      fileInputRef={fileInputRef}
                    />

                    <VoiceInput
                      onTranscript={(text: string) => setMessage(prev => prev + ' ' + text)}
                      disabled={disabled}
                    />
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Powered by MediMind AI for Cardiology Professionals
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};