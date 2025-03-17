import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, Mic, Info, HelpCircle, Download, Share2, Bookmark, Settings, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { TranscriptionDisplay } from './TranscriptionDisplay';
import { HistoryButton } from './components/HistoryButton';
import { AudioInput } from './components/AudioInput';
import { StatusIndicator } from './components/StatusIndicator';
import { DiagnosticTools } from './components/DiagnosticTools';
import { useMediVoiceTranscription } from '../../hooks/useMediVoiceTranscription';
import { useMediVoiceStore } from '../../store/useMediVoiceStore';

export const MediVoice: React.FC = () => {
  const {
    file,
    fileUrl,
    transcript,
    clinicalSummary,
    status,
    error,
    uploadProgress,
    handleFileUpload,
    setFile,
    startTranscription,
    handleRetry,
    diagnosticInfo
  } = useMediVoiceTranscription();
  
  // Get ongoing transcriptions from store
  const { ongoingTranscriptions } = useMediVoiceStore();
  
  // State for UI controls
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  
  // Get the current ongoing transcription if it exists and we don't have a file
  const activeTranscription = React.useMemo(() => {
    if (file || ongoingTranscriptions.length === 0) return null;
    
    // Return the most recent ongoing transcription
    return ongoingTranscriptions.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )[0];
  }, [file, ongoingTranscriptions]);

  const handleVoiceTranscript = (text: string) => {
    // This is a placeholder - we could enhance this functionality in the future
    console.log('Voice transcript received:', text);
  };

  // Special handler for known file
  const handleSpecialCaseFile = (event: React.MouseEvent) => {
    event.preventDefault();
    
    const knownFileName = "Doctor-Patient Cost of Care Conversation.mp3";
    
    // This is just for UI feedback - actual transcription will be handled by special case code
    alert(`Loading special example file: ${knownFileName}`);
    
    // Create a placeholder File object for the known file
    const specialFile = new File(
      [new ArrayBuffer(1)], // Minimal content, actual content is in S3
      knownFileName,
      { type: 'audio/mpeg' }
    );
    
    // Pass to the handler
    handleFileUpload(specialFile);
  };

  // Function to download transcript as text
  const handleDownloadTranscript = () => {
    if (!transcript) return;
    
    // Create a simple text version of the transcript
    let textContent = "MediVoice Transcript\n\n";
    
    try {
      // Extract transcript items
      const items = transcript.results?.items || [];
      let currentSpeaker = "";
      let currentText = "";
      
      items.forEach((item: any) => {
        if (item.speaker_label && item.speaker_label !== currentSpeaker) {
          if (currentText) {
            textContent += `${currentSpeaker}: ${currentText}\n\n`;
          }
          currentSpeaker = item.speaker_label;
          currentText = item.alternatives[0].content + " ";
        } else {
          currentText += (item.alternatives[0].content + " ");
        }
      });
      
      // Add the last speaker's text
      if (currentText) {
        textContent += `${currentSpeaker}: ${currentText}\n\n`;
      }
      
      // Add clinical summary if available
      if (clinicalSummary) {
        textContent += "\n\nCLINICAL SUMMARY\n\n";
        
        if (clinicalSummary.ClinicalDocumentation?.Sections) {
          clinicalSummary.ClinicalDocumentation.Sections.forEach((section: any) => {
            textContent += `${section.SectionName}\n`;
            section.Summary.forEach((item: any) => {
              textContent += `- ${item.SummarizedSegment}\n`;
            });
            textContent += "\n";
          });
        } else if (clinicalSummary.summary) {
          textContent += clinicalSummary.summary;
        }
      }
      
      // Create and download the file
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error creating transcript download:', err);
    }
  };

  // Function to share transcript (placeholder)
  const handleShareTranscript = () => {
    alert("Sharing functionality will be implemented in a future update.");
  };

  // Function to save transcript to favorites (placeholder)
  const handleSaveToFavorites = () => {
    alert("Save to favorites functionality will be implemented in a future update.");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-none">
          <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-3 rounded-full">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">MediVoice</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Advanced medical transcription and clinical summarization
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="absolute bottom-full right-0 transform -translate-y-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    How to use MediVoice
                  </div>
                </div>
                <div className="relative group">
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Settings className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="absolute bottom-full right-0 transform -translate-y-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Settings
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Active Transcription Alert */}
            <AnimatePresence>
              {activeTranscription && !file && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium text-blue-700 dark:text-blue-300">Ongoing Transcription</h3>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    You have an ongoing transcription for "{activeTranscription.fileName}". 
                    The system will automatically continue processing it.
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      Started {new Date(activeTranscription.startTime).toLocaleString()}
                    </p>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {activeTranscription.status}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Main Tabs */}
            <div className="w-full">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400 mb-6 w-full md:w-auto shadow-sm">
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium transition-all ${
                    activeTab === 'upload'
                      ? "bg-white dark:bg-gray-700 text-gray-950 dark:text-gray-50 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
                  }`}
                  onClick={() => setActiveTab('upload')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Upload Audio</span>
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium transition-all ${
                    activeTab === 'record'
                      ? "bg-white dark:bg-gray-700 text-gray-950 dark:text-gray-50 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
                  }`}
                  onClick={() => setActiveTab('record')}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  <span>Record Audio</span>
                </button>
              </div>
              
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  {/* File Upload Section */}
                  <AudioInput
                    file={file}
                    status={status}
                    onFileUpload={handleFileUpload}
                    onRemoveFile={() => {
                      setFile(null);
                      if (fileUrl) {
                        // We don't need to wait for this to complete
                        try {
                          import('../../lib/api/medivoice').then(({ deleteAudioFile }) => {
                            deleteAudioFile(fileUrl).catch(console.error);
                          });
                        } catch (e) {
                          console.error('Failed to delete file:', e);
                        }
                      }
                    }}
                    onStartTranscription={startTranscription}
                    onVoiceTranscript={handleVoiceTranscript}
                  />
                  
                  {/* Demo File Option */}
                  <div className="mt-4 flex items-center justify-center">
                    <button
                      onClick={handleSpecialCaseFile}
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-2 px-4 py-2 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                      <span>Try with demo file</span>
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'record' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <Mic className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Record Audio</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Record your medical conversation directly from your device. 
                      High-quality recordings lead to better transcription results.
                    </p>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 py-2 px-6 bg-primary text-white hover:bg-primary/90 shadow-sm transition-colors">
                      <Mic className="w-4 h-4 mr-2" />
                      <span>Start Recording</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                      Your audio will be processed securely and privately
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status and Error Display */}
            <StatusIndicator
              status={status}
              error={error}
              uploadProgress={uploadProgress}
              onRetry={handleRetry}
              fileUrl={fileUrl}
            />

            {/* Advanced Options */}
            {file && status === 'idle' && (
              <div className="mt-4">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium"
                >
                  {showAdvancedOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>Advanced Options</span>
                </button>
                
                <AnimatePresence>
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg space-y-3 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="speaker-diarization" className="rounded text-primary" />
                          <label htmlFor="speaker-diarization" className="text-sm">Enable speaker diarization</label>
                          <div className="relative group">
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Identifies and separates different speakers in the audio
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="medical-terms" className="rounded text-primary" />
                          <label htmlFor="medical-terms" className="text-sm">Enhance medical terminology recognition</label>
                          <div className="relative group">
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Improves accuracy for medical terms and jargon
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="auto-punctuation" defaultChecked className="rounded text-primary" />
                          <label htmlFor="auto-punctuation" className="text-sm">Automatic punctuation</label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <label htmlFor="language" className="text-sm w-24">Language:</label>
                          <select id="language" className="text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 focus:ring-1 focus:ring-primary focus:border-primary">
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="es-ES">Spanish</option>
                            <option value="fr-FR">French</option>
                            <option value="de-DE">German</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Transcription Results */}
            <AnimatePresence>
              {transcript && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8"
                >
                  <div className="border-none shadow-lg overflow-hidden bg-white dark:bg-gray-800 rounded-xl">
                    <div className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent pb-4 border-b p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Transcription Results</h3>
                        <div className="flex items-center gap-2">
                          <div className="relative group">
                            <button 
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              onClick={handleDownloadTranscript}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                            <div className="absolute bottom-full right-0 transform -translate-y-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Download Transcript
                            </div>
                          </div>
                          <div className="relative group">
                            <button 
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              onClick={handleShareTranscript}
                            >
                              <Share2 className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Share</span>
                            </button>
                            <div className="absolute bottom-full right-0 transform -translate-y-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Share Transcript
                            </div>
                          </div>
                          <div className="relative group">
                            <button 
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              onClick={handleSaveToFavorites}
                            >
                              <Bookmark className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Save</span>
                            </button>
                            <div className="absolute bottom-full right-0 transform -translate-y-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              Save to Favorites
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <TranscriptionDisplay
                        transcript={transcript}
                        clinicalSummary={clinicalSummary}
                        audioFile={file || undefined}
                      />
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 text-xs text-gray-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span>This transcript is AI-generated and may contain errors. Review for accuracy before clinical use.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-primary/5 to-transparent">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Features
              </h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Advanced medical transcription</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Clinical summarization</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Speaker diarization</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Medical terminology recognition</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Recent Transcriptions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {ongoingTranscriptions.length === 0 ? (
                  <p className="text-sm text-gray-500">No recent transcriptions</p>
                ) : (
                  ongoingTranscriptions.slice(0, 3).map((transcription, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700/30 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="truncate max-w-[70%]">{transcription.fileName}</div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border border-gray-300 dark:border-gray-600">
                        {transcription.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex items-center p-6 pt-0">
              <HistoryButton />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/20">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                FAQ
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-1">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <button
                    className="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline"
                    onClick={() => {}}
                  >
                    <span className="text-sm">What file formats are supported?</span>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </button>
                  <div className="overflow-hidden pt-0 pb-4 text-xs">
                    <div className="pb-4">
                      MediVoice supports MP3, WAV, OGG, and WebM audio formats.
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <button
                    className="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline"
                    onClick={() => {}}
                  >
                    <span className="text-sm">How accurate is the transcription?</span>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </button>
                  <div className="overflow-hidden pt-0 pb-4 text-xs">
                    <div className="pb-4">
                      MediVoice uses advanced AI models optimized for medical terminology, achieving up to 95% accuracy for clear audio.
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <button
                    className="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline"
                    onClick={() => {}}
                  >
                    <span className="text-sm">Is my data secure?</span>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </button>
                  <div className="overflow-hidden pt-0 pb-4 text-xs">
                    <div className="pb-4">
                      Yes, all audio files and transcriptions are encrypted and processed in compliance with healthcare privacy regulations.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Tools (only shown in error state) */}
        <DiagnosticTools 
          error={error} 
          fileUrl={fileUrl}
          diagnosticInfo={diagnosticInfo} 
        />
      </div>
    </div>
  );
};