import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Timer, CheckCircle2, Trash2 } from 'lucide-react';
import type { Patient } from '../../../types/patient';
import { format } from 'date-fns';
import { useMyPatientsStore } from '../../../store/useMyPatientsStore';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deletePatient } = useMyPatientsStore();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePatient(patient.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete patient:', error);
      alert('Failed to delete patient. Please try again.');
    }
  };

  const getStatusIcon = () => {
    switch (patient.status) {
      case 'unstable':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'stable':
        return <Timer className="w-5 h-5 text-yellow-500" />;
      case 'discharge-ready':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 cursor-pointer relative group"
        onClick={onClick}
      >
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {patient.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {patient.diagnosis}
            </p>
          </div>
          {getStatusIcon()}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {patient.age && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Age</p>
              <p className="font-medium">{patient.age} years</p>
            </div>
          )}
          {patient.sex && (
            <div>
              <p className="text-gray-500 dark:text-gray-400">Sex</p>
              <p className="font-medium capitalize">{patient.sex}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500 dark:text-gray-400">Admission Date</p>
            <p className="font-medium">{format(patient.admissionDate, 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Room</p>
            <p className="font-medium">{patient.roomNumber}</p>
          </div>
        </div>

        {patient.comorbidities && patient.comorbidities.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Comorbidities</p>
            <div className="flex flex-wrap gap-2">
              {patient.comorbidities.slice(0, 3).map((comorbidity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                >
                  {comorbidity}
                </span>
              ))}
              {patient.comorbidities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                  +{patient.comorbidities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Delete Patient</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete {patient.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};