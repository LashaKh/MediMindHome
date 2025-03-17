import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Save, UserRound, Stethoscope, StickyNote, Heart, Activity, AlertCircle, Timer, CheckCircle2, FileBarChart, MessageSquare, FileText } from 'lucide-react';
import clsx from 'clsx';
import { NotesSection } from '../PatientDetailsModal/NotesSection';
import { EchoSection } from '../PatientDetailsModal/EchoSection';
import { ECGSection } from '../PatientDetailsModal/ECGSection';
import { MedicalHistorySection } from '../PatientDetailsModal/MedicalHistorySection';
import { DocumentationSection } from '../PatientDetailsModal/DocumentationSection';
import { ComorbiditySelector } from '../PatientDetailsModal/ComorbiditySelector';
import { DoctorAssignment } from '../PatientDetailsModal/DoctorAssignment';
import { SummaryView } from '../PatientDetailsModal/SummaryView';
import { useMyPatientsStore } from '../../../store/useMyPatientsStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useTranslation } from '../../../hooks/useTranslation';
import { supabase } from '../../../lib/supabase';
import { useChatStore } from '../../../store/useChatStore';
import { useConversationStore } from '../../../store/useConversationStore';
import { format } from 'date-fns';
import { LoadingSpinner } from '../../common/LoadingSpinner';

const getStatusOptions = (t: (key: string) => string) => [
  { value: 'unstable', label: t('patients.status.unstable'), icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  { value: 'stable', label: t('patients.status.stable'), icon: Timer, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { value: 'discharge-ready', label: t('patients.status.discharge-ready'), icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' }
] as const;

export const MyPatientDetails: React.FC = () => {
  // Initialize refs
  const patientInfoRef = useRef<HTMLDivElement>(null);
  const echoRef = useRef<HTMLDivElement>(null);
  const ecgRef = useRef<HTMLDivElement>(null);
  const documentationRef = useRef<HTMLDivElement>(null);
  const comorbidityRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { patients, updatePatient, addNote, loadMyPatients, loading, error: patientError } = useMyPatientsStore();
  const patient = patients.find(p => p.id === patientId);
  const [editedPatient, setEditedPatient] = useState(patient ? { ...patient } : null);
  const { user } = useAuthStore();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const { t } = useTranslation();
  const [loadError, setLoadError] = useState<string | null>(null);
  const STATUS_OPTIONS = getStatusOptions(t);
  const [showSummary, setShowSummary] = useState(false);
  const { createConversation, selectConversation } = useConversationStore();
  const { setSessionId, sendMessage, loadMessages } = useChatStore();

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddNote = async (content: string, reminder?: { dueAt: Date }) => {
    if (!user || !patient) return;
    
    setLoadError(null);
    try {
      await addNote(patient.id, { 
        content, 
        type: 'general',
        reminder
      });

      // Reload patients to get updated notes
      await loadMyPatients();

    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  };

  const handleUpdateNote = async (noteId: string, content: string) => {
    if (!user) return;

    setLoadError(null);
    try {
      // First check if note exists and user owns it
      const { data: note, error: checkError } = await supabase
        .from('patient_notes')
        .select('id')
        .eq('id', noteId)
        .single();

      if (checkError || !note) {
        throw new Error('Note not found or you do not have permission to edit it');
      }

      const { error } = await supabase
        .from('patient_notes')
        .update({ content })
        .eq('id', noteId);

      if (error) throw error;

      // Update local state
      setEditedPatient(prev => ({
        ...prev,
        notes: prev.notes.map(note => 
          note.id === noteId 
            ? { ...note, content }
            : note
        )
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update note';
      setLoadError(errorMessage);
      return false;
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;
    
    setLoadError(null);
    try {
      // First check if note exists and user owns it
      const { data: note, error: checkError } = await supabase
        .from('patient_notes')
        .select('id')
        .eq('id', noteId)
        .single();

      if (checkError || !note) {
        throw new Error('Note not found or you do not have permission to delete it');
      }

      const { error } = await supabase
        .from('patient_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      // Update local state
      setEditedPatient(prev => ({
        ...prev,
        notes: prev.notes.filter(note => note.id !== noteId)
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete note';
      setLoadError(errorMessage);
      return false;
    }
  };

  const handleUpdateNoteReminder = async (noteId: string, reminder: { dueAt: Date }) => {
    try {
      setLoadError(null);
      const reminderData = {
        dueAt: reminder.dueAt.toISOString(),
        status: 'pending',
        updatedAt: new Date().toISOString()
      };

      const { error: updateError } = await supabase.rpc('update_note_reminder', {
        note_id: noteId,
        reminder_data: reminderData
      });

      if (updateError) throw updateError;

      setEditedPatient(prev => ({
        ...prev,
        notes: prev.notes.map(note => 
          note.id === noteId
            ? {
                ...note,
                reminder: reminderData,
                timestamp: new Date()
              }
            : note
        )
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update reminder';
      console.error('Failed to update reminder:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleECGDataChange = (notes: string) => {
    setEditedPatient(prev => ({
      ...prev,
      ecgData: prev.ecgData ? {
        ...prev.ecgData,
        notes,
        images: prev.ecgData.images || []
      } : { notes, images: [] }
    }));
  };

  const handleECGImagesChange = (images: string[]) => {
    setEditedPatient(prev => ({
      ...prev,
      ecgData: prev.ecgData ? {
        ...prev.ecgData,
        images,
        notes: prev.ecgData.notes || ''
      } : { images, notes: '' }
    }));
  };

  // Load patients data if not already loaded
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadMyPatients();
      } catch (error) {
        console.error('Failed to load patients:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load patients');
      }
    };
    
    loadData();
  }, [loadMyPatients]);

  // Update edited patient when patient data changes
  useEffect(() => {
    if (patient) {
      setEditedPatient({ ...patient });
    } else if (!loading && patients.length > 0) {
      // Only navigate away if patients are loaded and this one wasn't found
      navigate('/my-patients');
    }
  }, [patient, patients.length, loading, navigate, patientError]);

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      setLoadError(null);

      if (!patient?.id || !editedPatient) {
        throw new Error('Invalid patient data');
      }

      const updatedPatient = {
        ...editedPatient,
        last_modified_by: user?.id,
        last_modified_at: new Date()
      };

      try {
        await updatePatient(patient.id, updatedPatient);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          setLoadError('Patient no longer exists');
          navigate('/my-patients'); // Navigate back since patient doesn't exist
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Failed to save patient:', error);
      setSaveStatus('error');
      setLoadError(error instanceof Error ? error.message : 'Failed to save patient');
    }
  };

  const handleStartChat = async () => {
    if (!patient) return;
    
    try {
      // Create new conversation
      const conversationId = await createConversation(patient.name);
      
      // Prepare patient context
      const patientContext = {
        name: patient.name,
        age: patient.age,
        sex: patient.sex,
        diagnosis: patient.diagnosis,
        status: patient.status,
        admissionDate: patient.admissionDate,
        medicalHistory: patient.medicalHistory,
        comorbidities: patient.comorbidities,
        echoData: patient.echoData,
        ecgData: patient.ecgData
      };

      // Navigate immediately
      selectConversation(conversationId);
      navigate(`/chat/${conversationId}`);
      
      // Initialize chat in background
      setSessionId(conversationId);
      await loadMessages(conversationId);
      
      // Send initial context message
      const contextMessage = `System: This conversation is about patient ${patient.name}. Here is the patient context:\n\n${JSON.stringify(patientContext, null, 2)}`;
      await sendMessage(contextMessage, conversationId);

    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to start chat session');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state if patient not found after loading
  if (!loading && !patient && patients.length > 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Patient not found</p>
          <button
            onClick={() => navigate('/my-patients')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to My Patients
          </button>
        </div>
      </div>
    );
  }

  if (!editedPatient) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Patient Details</h1>
              <button
                onClick={handleStartChat}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 rounded-lg hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Start Chat</span>
              </button>
              <button
                onClick={() => setShowSummary(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 rounded-lg hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                <FileBarChart className="w-4 h-4" />
                <span className="hidden sm:inline">Summary View</span>
              </button>
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 rounded-full text-sm">
                <span>ID: {patient.id.slice(0, 8)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {patient.last_modified_by && patient.last_modified_at && (
                <div className="text-sm text-gray-500">
                  <span className="hidden lg:inline">
                    Last modified by {patient.last_modified_by === user?.id ? 'you' : 'another user'} at{' '}
                    {format(patient.last_modified_at, 'PPpp')}
                  </span>
                </div>
              )}
              <button
                onClick={() => navigate('/my-patients')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-6 gap-1 p-2">
            <button
              onClick={() => scrollToSection(patientInfoRef)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <UserRound className="w-5 h-5" />
              <span className="text-xs">Info</span>
            </button>
            <button
              onClick={() => scrollToSection(comorbidityRef)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <Stethoscope className="w-5 h-5" />
              <span className="text-xs">Comorbid</span>
            </button>
            <button
              onClick={() => scrollToSection(notesRef)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <StickyNote className="w-5 h-5" />
              <span className="text-xs">Notes</span>
            </button>
            <button
              onClick={() => scrollToSection(echoRef)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <Heart className="w-5 h-5" />
              <span className="text-xs">Echo</span>
            </button>
            <button
              onClick={() => scrollToSection(ecgRef)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs">ECG</span>
            </button>
            <button
              onClick={() => scrollToSection(documentationRef)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs">Docs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loadError && (
          <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
            {loadError}
          </div>
        )}

        {/* Patient Information Section */}
        <div ref={patientInfoRef} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={editedPatient.name}
                onChange={(e) => setEditedPatient(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                min="0"
                max="150"
                value={editedPatient.age || ''}
                onChange={(e) => setEditedPatient(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Diagnosis</label>
              <input
                type="text"
                value={editedPatient.diagnosis}
                onChange={(e) => setEditedPatient(prev => ({ ...prev, diagnosis: e.target.value }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sex</label>
              <select
                value={editedPatient.sex || ''}
                onChange={(e) => setEditedPatient(prev => ({ ...prev, sex: e.target.value as any }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="grid grid-cols-3 gap-3">
                {STATUS_OPTIONS.map(({ value, label, icon: Icon, color, bg }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEditedPatient(prev => ({ ...prev, status: value }))}
                    className={clsx(
                      'flex items-center gap-2 p-3 rounded-lg border transition-all',
                      editedPatient.status === value
                        ? `${bg} ${color} border-current`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Medical History & Anamnesis Section - Comes directly after patient info */}
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <MedicalHistorySection
              patient={editedPatient}
              onMedicalHistoryChange={(field, value) => {
                setEditedPatient(prev => ({
                  ...prev,
                  medicalHistory: {
                    ...prev.medicalHistory,
                    [field]: value
                  }
                }));
              }}
            />
          </div>

          {/* Comorbidities - Now after Medical History */}
          <div ref={comorbidityRef} className="mt-6 pt-6 border-t dark:border-gray-700">
            <label className="block text-sm font-medium mb-2">{t('patients.basicInfo.comorbidities')}</label>
            <ComorbiditySelector
              selectedComorbidities={editedPatient.comorbidities || []}
              onChange={(comorbidities) => setEditedPatient(prev => ({ ...prev, comorbidities }))}
            />
          </div>

          <div ref={notesRef} className="mt-6 pt-6 border-t dark:border-gray-700">
            <NotesSection 
              notes={editedPatient.notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onUpdateNoteReminder={handleUpdateNoteReminder}
            />
          </div>
        </div>

        {/* Echo Section */}
        <div ref={echoRef} className="py-6 border-t dark:border-gray-700 space-y-6">
          <h3 className="text-xl font-semibold">Echo Data</h3>
          <EchoSection 
            patient={editedPatient}
            onEchoDataChange={(field, value) => {
              setEditedPatient(prev => ({
                ...prev,
                echoData: {
                  ...prev.echoData,
                  [field]: value
                }
              }));
            }}
          />
        </div>

        {/* ECG Section */}
        <div ref={ecgRef} className="py-6 border-t dark:border-gray-700 space-y-6">
          <h3 className="text-xl font-semibold">ECG Data</h3>
          <ECGSection 
            patient={editedPatient}
            onECGDataChange={handleECGDataChange}
            onECGImagesChange={handleECGImagesChange}
          />
        </div>

        {/* Documentation Section */}
        <div ref={documentationRef} className="py-6 border-t dark:border-gray-700 space-y-6">
          <h3 className="text-xl font-semibold">Documentation Images</h3>
          <DocumentationSection 
            patient={editedPatient}
            onDocumentationChange={(images) => {
              setEditedPatient(prev => ({
                ...prev,
                documentationImages: { images }
              }));
            }}
          />
        </div>

        {/* Doctor Assignment Section */}
        <DoctorAssignment
          patientId={patient.id}
          currentDoctorId={editedPatient.assigned_doctor_id}
          onAssign={(doctorId) => {
            setEditedPatient(prev => ({
              ...prev,
              assigned_doctor_id: doctorId
            }));
          }}
        />
      </div>

      {/* Fixed Save Button at the bottom */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => navigate('/my-patients')}
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-colors ${
            saveStatus === 'saving' 
              ? 'bg-gray-400 cursor-not-allowed'
              : saveStatus === 'success'
              ? 'bg-green-500 hover:bg-green-600'
              : saveStatus === 'error'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-primary hover:bg-primary/90'
          } text-white`}
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Saving</span>
            </>
          ) : saveStatus === 'success' ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Saved</span>
            </>
          ) : saveStatus === 'error' ? (
            <>
              <X className="w-5 h-5" />
              <span>Error</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pt-16 bg-black/50 backdrop-blur-sm">
          <div 
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SummaryView 
              patient={editedPatient} 
              onClose={() => setShowSummary(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}; 