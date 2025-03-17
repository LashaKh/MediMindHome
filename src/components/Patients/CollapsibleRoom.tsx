import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PatientCell } from './PatientCell';
import { useTranslation } from '../../hooks/useTranslation';
import type { Patient } from '../../types/patient';

interface CollapsibleRoomProps {
  roomNumber: string;
  bedCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  patients: Patient[];
}

export const CollapsibleRoom: React.FC<CollapsibleRoomProps> = ({
  roomNumber,
  bedCount,
  isExpanded,
  onToggle,
  patients
}) => {
  const { t } = useTranslation();
  
  const getPatientByBed = (bedNumber: number) => {
    const fullRoomNumber = `${roomNumber}-${bedNumber}`;
    return patients.find(p => p.roomNumber === fullRoomNumber);
  };

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="font-medium">{t('patients.rooms.room', { number: roomNumber })}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: bedCount }, (_, i) => {
                const bedNumber = i + 1;
                const patient = getPatientByBed(bedNumber);
                return (
                  <PatientCell
                    key={`${roomNumber}-${bedNumber}`}
                    roomNumber={`${roomNumber}-${bedNumber}`}
                    patient={patient}
                    bedLabel={t('patients.rooms.bed', { number: bedNumber })}
                    isBed
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};