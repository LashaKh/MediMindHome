import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MoveRight, BedDouble } from 'lucide-react';
import { usePatientStore } from '../../store/usePatientStore';
import type { Patient } from '../../types/patient';

interface TransferModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const { transferPatient, patients } = usePatientStore();

  const handleTransfer = async () => {
    if (!selectedLocation) return;
    
    try {
      await transferPatient(patient.id, selectedLocation);
      onClose();
    } catch (error) {
      console.error('Failed to transfer patient:', error);
    }
  };

  // Combined room configurations for all floors
  const ALL_LOCATIONS = {
    '9th Floor': {
      'Cardiac ICU': ['1', '2a', '2b', '3', '4', '5', '6', '7'],
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
    },
    '10th Floor': {
      'Cardiac Surgery': ['1', '2', '3', '4'],
      'Post-Op': ['1', '2', '3', '4', '5', '6', '7', '8']
    }
  } as const;

  // Helper function to check if a bed is occupied
  const isBedOccupied = (location: string) => {
    return patients.some(p => p.roomNumber === location && p.id !== patient.id);
  };

  // Helper function to get button styles
  const getButtonStyles = (location: string) => {
    const isOccupied = isBedOccupied(location);
    const isCurrent = location === patient.roomNumber;
    const isSelected = location === selectedLocation;

    if (isCurrent) {
      return 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400 cursor-not-allowed';
    }
    if (isOccupied) {
      return 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 cursor-not-allowed opacity-60';
    }
    if (isSelected) {
      return 'bg-primary text-white border-primary';
    }
    return 'border-gray-200 dark:border-gray-700 hover:border-primary';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-16 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Transfer Patient</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Location</label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-gray-400" />
                  {patient.roomNumber}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select New Location</label>
                <div className="space-y-4">
                  {Object.entries(ALL_LOCATIONS).map(([floor, sections]) => (
                    <div key={floor} className="border dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-base font-medium mb-4">{floor}</h3>
                      <div className="space-y-6">
                        {Object.entries(sections).map(([section, beds]) => (
                          <div key={section}>
                            <h4 className="text-sm font-medium mb-2">{section}</h4>
                            <div className="grid grid-cols-4 gap-2">
                              {typeof beds === 'object' && !Array.isArray(beds) ? (
                                // Handle regular rooms
                                Object.entries(beds).map(([room, count]) => (
                                  Array.from({ length: count }, (_, i) => {
                                    const location = `${room}-${i + 1}`;
                                    const isOccupied = isBedOccupied(location);
                                    const isCurrent = location === patient.roomNumber;
                                    return (
                                      <button
                                        key={location}
                                        onClick={() => {
                                          if (!isOccupied && !isCurrent) {
                                            setSelectedLocation(location);
                                          }
                                        }}
                                        className={`p-2 text-sm rounded-lg border transition-colors ${
                                          getButtonStyles(location)
                                        }`}
                                        disabled={isOccupied || isCurrent}
                                      >
                                        <div className="flex items-center justify-between gap-1">
                                        {location}
                                        {isOccupied && <span className="text-xs">(Occupied)</span>}
                                        {isCurrent && <span className="text-xs">(Current)</span>}
                                        </div>
                                      </button>
                                    );
                                  })
                                )).flat()
                              ) : (
                                // Handle ICU beds
                                beds.map((number) => {
                                  const location = section === 'Cardiac ICU' 
                                    ? `ICU-${number}`
                                    : section === 'Cardiac Surgery'
                                    ? `CS-${number}`
                                    : `PO-${number}`;
                                  const isOccupied = isBedOccupied(location);
                                  const isCurrent = location === patient.roomNumber;
                                  return (
                                    <button
                                      key={location}
                                      onClick={() => {
                                        if (!isOccupied && !isCurrent) {
                                          setSelectedLocation(location);
                                        }
                                      }}
                                      className={`p-2 text-sm rounded-lg border transition-colors ${
                                        getButtonStyles(location)
                                      }`}
                                      disabled={isOccupied || isCurrent}
                                    >
                                      <div className="flex items-center justify-between gap-1">
                                      {number}
                                      {isOccupied && <span className="text-xs">(Occupied)</span>}
                                      {isCurrent && <span className="text-xs">(Current)</span>}
                                      </div>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 p-4 border-t dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!selectedLocation}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MoveRight className="w-5 h-5" />
                Transfer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};