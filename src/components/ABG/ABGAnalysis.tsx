import React, { useState, useEffect } from 'react';
import { Upload, Camera, Image as ImageIcon, Loader2, Send, X, RefreshCw, Clipboard, Info, ChevronLeft, Clock, AlertCircle, AlertTriangle, CheckCircle, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeImage } from '../../lib/api/vision';
import { ABGResultDisplay } from './ABGResultDisplay';
import { useCamera } from './hooks/useCamera';
import { useABGStore } from '../../store/useABGStore';
import { ImageUpload } from './components/ImageUpload';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisResults } from './components/AnalysisResults';
import { InterpretationResults } from './components/InterpretationResults';
import { ActionPlanResults } from './components/ActionPlanResults';
import { PatientSelector } from './components/PatientSelector';
import type { Patient } from '../../types/patient';
import { Tooltip } from '../../components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

// Define the steps in the ABG analysis workflow
const WORKFLOW_STEPS = {
  UPLOAD: 'upload',
  ANALYSIS: 'analysis',
  INTERPRETATION: 'interpretation',
  ACTION_PLAN: 'action_plan',
};

const ABGAnalysis: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [editedAnalysis, setEditedAnalysis] = useState<string | null>(null);
  const [webhookResponse, setWebhookResponse] = useState<string | null>(null);
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSendingActionPlan, setIsSendingActionPlan] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentStep, setCurrentStep] = useState<string>(WORKFLOW_STEPS.UPLOAD);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [currentResultId, setCurrentResultId] = useState<string | null>(null);
  const { addResult, updateResult } = useABGStore();
  const {
    isCameraOpen,
    isStreamReady,
    error: cameraError,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto
  } = useCamera();
  const navigate = useNavigate();

  // Track progress through the workflow
  useEffect(() => {
    if (webhookResponse && actionPlan) {
      setCurrentStep(WORKFLOW_STEPS.ACTION_PLAN);
    } else if (webhookResponse) {
      setCurrentStep(WORKFLOW_STEPS.INTERPRETATION);
    } else if (analysis) {
      setCurrentStep(WORKFLOW_STEPS.ANALYSIS);
    } else {
      setCurrentStep(WORKFLOW_STEPS.UPLOAD);
    }
  }, [analysis, webhookResponse, actionPlan]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      setSelectedImage(files[0]);
      setAnalysis(null);
      setEditedAnalysis(null);
      setWebhookResponse(null);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
      setAnalysis(null);
      setEditedAnalysis(null);
      setWebhookResponse(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const startTime = Date.now();
      
      // Get analysis from Google Vision
      const result = await analyzeImage(selectedImage);
      setAnalysis(result);
      setEditedAnalysis(result);
      
      // Calculate processing time
      const endTime = Date.now();
      setProcessingTime(endTime - startTime);
      
      // Automatically send to webhook
      const bgType = document.querySelector<HTMLInputElement>('input[name="bgType"]:checked')?.value || 'arterial';
      
      // Prepare patient context if a patient is selected
      let patientContext = null;
      if (selectedPatient) {
        patientContext = {
          name: selectedPatient.name,
          age: selectedPatient.age,
          sex: selectedPatient.sex,
          diagnosis: selectedPatient.diagnosis,
          status: selectedPatient.status,
          admissionDate: selectedPatient.admissionDate,
          medicalHistory: selectedPatient.medicalHistory,
          comorbidities: selectedPatient.comorbidities,
          echoData: selectedPatient.echoData,
          ecgData: selectedPatient.ecgData
        };
      }

      // Send to make.com webhook
      const response = await fetch('https://hook.eu2.make.com/r51ixhhymi94mf67ykcb6bpx3q558vo7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          analysis: result,
          type: bgType === 'arterial' ? 'Arterial Blood Gas' : 'Venous Blood Gas',
          timestamp: new Date().toISOString(),
          patient: patientContext
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send data to webhook');
      }

      const responseText = await response.text();
      setWebhookResponse(responseText);
      
      // Automatically save the result after receiving the interpretation
      await autoSaveResult(result, responseText, null, bgType);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze and process image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetActionPlan = async () => {
    if (!webhookResponse) return;

    const uniqueId = crypto.randomUUID();

    try {
      setIsSendingActionPlan(true);
      setError(null);

      const response = await fetch('https://hook.eu2.make.com/my64d4sw14m11sw7513fhskb6bkkvhut', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          interpretation: webhookResponse,
          timestamp: new Date().toISOString(),
          requestId: uniqueId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get action plan');
      }

      const responseText = await response.text();
      setActionPlan(responseText);
      
      // Automatically update the existing result with the action plan
      if (currentResultId && analysis) {
        await updateExistingResult(responseText);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get action plan');
    } finally {
      setIsSendingActionPlan(false);
    }
  };

  // Function to automatically save result after first interpretation
  const autoSaveResult = async (analysisResult: string, interpretation: string, actionPlanData: string | null, bgType: string) => {
    try {
      setSaveStatus('saving');
      
      // Prepare patient info if a patient is selected
      let patientInfo = null;
      if (selectedPatient) {
        patientInfo = {
          id: selectedPatient.id,
          name: selectedPatient.name,
          diagnosis: selectedPatient.diagnosis
        };
      }
      
      const resultId = await addResult({
        raw_analysis: analysisResult,
        interpretation: interpretation,
        action_plan: actionPlanData,
        patient: patientInfo,
        patient_id: selectedPatient?.id,
        type: bgType === 'arterial' ? 'Arterial Blood Gas' : 'Venous Blood Gas'
      });
      
      // Store the ID of the newly created result
      setCurrentResultId(resultId);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      return resultId;
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      throw error;
    }
  };
  
  // Function to update existing result with action plan
  const updateExistingResult = async (actionPlanData: string) => {
    if (!currentResultId) return;
    
    try {
      setSaveStatus('saving');
      
      await updateResult(currentResultId, {
        action_plan: actionPlanData
      });
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Original manual save function - keeping for backup but no longer needed
  const handleSaveResults = async () => {
    if (!analysis || !webhookResponse || !actionPlan) return;

    try {
      setSaveStatus('saving');
      
      const bgType = document.querySelector<HTMLInputElement>('input[name="bgType"]:checked')?.value || 'arterial';
      
      // Prepare patient context if a patient is selected
      let patientInfo = null;
      if (selectedPatient) {
        patientInfo = {
          id: selectedPatient.id,
          name: selectedPatient.name,
          diagnosis: selectedPatient.diagnosis
        };
      }
      
      // If we already have a result ID, update it instead of creating a new one
      if (currentResultId) {
        await updateResult(currentResultId, {
          action_plan: actionPlan
        });
      } else {
        const resultId = await addResult({
          raw_analysis: analysis,
          interpretation: webhookResponse,
          action_plan: actionPlan,
          patient: patientInfo,
          patient_id: selectedPatient?.id,
          type: bgType === 'arterial' ? 'Arterial Blood Gas' : 'Venous Blood Gas'
        });
        setCurrentResultId(resultId);
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleClearAll = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setEditedAnalysis(null);
    setWebhookResponse(null);
    setActionPlan(null);
    setError(null);
    setSelectedPatient(null);
    setProcessingTime(null);
    setCurrentResultId(null);
    setCurrentStep(WORKFLOW_STEPS.UPLOAD);
  };

  // Progress indicator for the workflow
  const renderProgressIndicator = () => {
    const steps = [
      { id: WORKFLOW_STEPS.UPLOAD, label: 'Upload', icon: Upload },
      { id: WORKFLOW_STEPS.ANALYSIS, label: 'Analysis', icon: Clipboard },
      { id: WORKFLOW_STEPS.INTERPRETATION, label: 'Interpretation', icon: AlertCircle },
      { id: WORKFLOW_STEPS.ACTION_PLAN, label: 'Action Plan', icon: CheckCircle },
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isPast = steps.findIndex(s => s.id === currentStep) > index;
          const isFuture = steps.findIndex(s => s.id === currentStep) < index;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : isPast 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-2 ${
                  isActive 
                    ? 'text-primary font-medium' 
                    : isPast 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`w-16 h-1 mx-2 ${
                    isPast 
                      ? 'bg-green-400 dark:bg-green-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with title and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Blood Gas Analysis
              <button 
                onClick={() => setShowInstructions(!showInstructions)}
                className="ml-2 text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full"
                aria-label="Show instructions"
              >
                <Info className="w-5 h-5" />
              </button>
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400 max-w-xl">
              Advanced AI-powered analysis of arterial and venous blood gas results with interpretations and clinical recommendations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={() => navigate('/bg-history')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <History className="w-5 h-5" />
              <span>View History</span>
            </button>
          </div>
        </div>
        
        {/* Instructions panel */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <Info className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">How to use the Blood Gas Analysis tool</h3>
                  <ol className="space-y-2 text-blue-800 dark:text-blue-200">
                    <li><strong>1. Choose a patient</strong> - Select from your patient list or proceed without patient context</li>
                    <li><strong>2. Specify blood gas type</strong> - Select arterial or venous blood gas</li>
                    <li><strong>3. Upload image</strong> - Upload a blood gas result image from your device or take a photo</li>
                    <li><strong>4. Review analysis</strong> - The system will extract values and provide interpretation</li>
                    <li><strong>5. Get recommendations</strong> - Based on the analysis, receive clinical recommendations</li>
                    <li><strong>6. Save to records</strong> - Save analysis and recommendations to patient records</li>
                  </ol>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Close instructions
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Progress indicator */}
        {renderProgressIndicator()}

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-primary/10 via-transparent to-transparent">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white mr-3 text-sm">1</span>
              Upload Blood Gas Image
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 pl-10">
              Upload or capture a blood gas result image for automated analysis
            </p>
          </div>

          <div className="p-6">
            {/* Patient Selector */}
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Patient Context</h3>
              <PatientSelector 
                selectedPatient={selectedPatient}
                onSelectPatient={setSelectedPatient}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Blood Gas Type</h3>
              <div className="flex gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bgType"
                    value="arterial"
                    defaultChecked
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="text-gray-800 dark:text-gray-200">Arterial Blood Gas</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bgType"
                    value="venous"
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="text-gray-800 dark:text-gray-200">Venous Blood Gas</span>
                </label>
              </div>
            </div>

            {isCameraOpen ? (
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <CameraCapture
                  videoRef={videoRef}
                  isStreamReady={isStreamReady}
                  onCapture={capturePhoto}
                  onCancel={stopCamera}
                />
              </div>
            ) : (
              <ImageUpload
                isDragging={isDragging}
                selectedImage={selectedImage}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={handleFileSelect}
                onRemoveImage={() => {
                  setSelectedImage(null);
                  setAnalysis(null);
                  setEditedAnalysis(null);
                  setWebhookResponse(null);
                  setError(null);
                }}
                onStartCamera={startCamera}
              />
            )}

            {(error || cameraError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error encountered</p>
                  <p>{error || cameraError}</p>
                </div>
              </motion.div>
            )}

            {selectedImage && !isCameraOpen && (
              <div className="mt-6 flex items-center justify-between">
                {processingTime && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Processed in {(processingTime / 1000).toFixed(1)}s
                  </div>
                )}
                <div className="ml-auto">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`
                      flex items-center gap-2 px-6 py-3
                      bg-primary text-white rounded-lg 
                      hover:bg-primary/90 transition-colors
                      shadow-sm shadow-primary/10
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Scanning & Analyzing...</span>
                      </>
                    ) : (
                      <span>Scan & Analyze</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Sections */}
        <AnimatePresence mode="wait">
          {analysis && editedAnalysis && (
            <AnalysisResults
              key="analysis-results"
              analysis={analysis}
              editedAnalysis={editedAnalysis}
              isSending={false}
              onAnalysisChange={setEditedAnalysis}
              onSendToWebhook={() => {}}
            />
          )}

          {webhookResponse && (
            <InterpretationResults
              key="interpretation-results"
              webhookResponse={webhookResponse}
              isSendingActionPlan={isSendingActionPlan}
              onGetActionPlan={handleGetActionPlan}
            />
          )}

          {actionPlan && (
            <ActionPlanResults
              key="action-plan-results"
              actionPlan={actionPlan}
              onSave={handleSaveResults}
              saveStatus={saveStatus}
              autoSaved={true}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export { ABGAnalysis };