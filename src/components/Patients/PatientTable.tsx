import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Share2, Bell, FileDown, UserPlus } from 'lucide-react';
import { usePatientStore } from '../../store/usePatientStore';
import { PatientCell } from './PatientCell';
import { CollapsibleRoom } from './CollapsibleRoom';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';
import { generatePatientPDF } from '../../utils/pdf/generatePatientPDF';
import { SharePatientsModal } from './SharePatientsModal';
import { ShareRequestsModal } from './ShareRequestsModal';
import { ReminderNotifications } from '../Notifications/ReminderNotification';
import { FloorSelector, type Floor } from './FloorSelector';
import { ICUTable } from './ICUTable';

// Room configuration
const ROOM_CONFIG = {
  'ICU': ['1', '2a', '2b', '3', '4', '5', '6', '7'],
  'Rooms': {
    '901': 3,
    '902': 4,
    '903': 2,
    '904': 2,
    '905': 2,
    '906': 2,
    '907': 4,
    '908': 2,
    '909': 2,
    '910': 2,
    '911': 2,
    '912': 4,
    '913': 2
  }
} as const;

export const PatientTable: React.FC = () => {
  const { patients, loadPatients, cleanup, addPatient, updatePatient } = usePatientStore();
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState<Floor>('9th-cardiac');
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { user } = useAuthStore();

  const loadPendingRequests = useCallback(async () => {
    if (!user) return;
    
    try {
      const { count } = await supabase
        .from('patient_share_requests')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('status', 'pending');
      
      setPendingRequestsCount(count || 0);
    } catch (error) {
      console.error('Failed to load pending requests count:', error);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      await loadPatients();
    };
    
    loadData();
    loadPendingRequests();
    
    // Subscribe to changes in share requests
    const channel = supabase
      .channel('share_requests_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patient_share_requests',
        filter: user ? `recipient_id=eq.${user.id}` : undefined
      }, () => {
        loadPendingRequests();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
      cleanup();
    };
  }, [user, loadPendingRequests]);

  const toggleRoom = (roomNumber: string) => {
    setExpandedRooms(prev =>
      prev.includes(roomNumber)
        ? prev.filter(r => r !== roomNumber)
        : [...prev, roomNumber]
    );
  };

  const handleClearAllPatients = async () => {
    if (patients.length === 0) return;
    
    const { deletePatient } = usePatientStore.getState();
    try {
      // Delete all patients one by one
      await Promise.all(patients.map(patient => deletePatient(patient.id)));
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Failed to clear patients:', error);
      throw error;
    }
  };

  const handleExportPDF = () => {
    generatePatientPDF(patients, selectedFloor === '9th-cardiac' ? 'cardiac' : 'icu');
  };

  const handleAddPatient = async (patient: Omit<Patient, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addPatient({
        ...patient,
        assigned_department: selectedFloor === '9th-cardiac' ? 'cardiac_icu' : 'cardiac_surgery_icu',
        last_modified_by: user?.id,
        last_modified_at: new Date()
      });
    } catch (error) {
      console.error('Failed to add patient:', error);
    }
  };

  const handleUpdatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      await updatePatient(id, {
        ...updates,
        last_modified_by: user?.id,
        last_modified_at: new Date()
      });
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4 pt-[1rem] md:p-6 md:pt-[1rem]">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-4 relative">
          {/* Title and Floor Selector */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedFloor === '9th-cardiac' ? 'Cardiac Patient Table - 9th Floor' : 'ICU Patient Table - 10th Floor'}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <FloorSelector 
                selectedFloor={selectedFloor}
                onFloorChange={setSelectedFloor}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 justify-end mt-4">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-3 py-1.5 text-primary hover:bg-primary/10 rounded-lg dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FileDown className="w-5 h-5" />
              <span className="text-sm">Export PDF</span>
            </button>
            <div className="relative inline-block">
              <button
                onClick={() => setShowRequestsModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <UserPlus className="w-5 h-5" />
                <span className="text-sm">Share Requests</span>
                {pendingRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
            </div>
            <ReminderNotifications />
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {selectedFloor === '9th-cardiac' ? (
          <div className="space-y-6 md:space-y-8">
            {/* ICU Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-base md:text-lg font-semibold">Cardiac ICU</h2>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {ROOM_CONFIG.ICU.map((number) => (
                  <PatientCell
                    key={`ICU-${number}`}
                    roomNumber={`ICU-${number}`}
                    patient={patients.find(p => p.roomNumber === `ICU-${number}`)}
                    bedLabel={t('patients.rooms.bed', { number })}
                    isBed
                  />
                ))}
              </div>
            </div>

            {/* Rooms Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-base md:text-lg font-semibold">{t('patients.rooms.title')}</h2>
              </div>
              <div className="divide-y dark:divide-gray-700">
                {Object.entries(ROOM_CONFIG.Rooms).map(([roomNumber, bedCount]) => (
                  <CollapsibleRoom
                    key={roomNumber}
                    roomNumber={roomNumber}
                    bedCount={bedCount}
                    isExpanded={expandedRooms.includes(roomNumber)}
                    onToggle={() => toggleRoom(roomNumber)}
                    patients={patients}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ICUTable />
        )}
        
        {/* Clear All Button */}
        {patients.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear All Patients</span>
            </button>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-semibold mb-4">Clear All Patients</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to remove all patients? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllPatients}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <SharePatientsModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
      
      <ShareRequestsModal
        isOpen={showRequestsModal}
        onClose={() => setShowRequestsModal(false)}
      />
    </div>
  );
};