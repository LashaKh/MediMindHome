import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, BedDouble, MoveRight, Plus, AlertCircle, CheckCircle2, Timer, AlertTriangle } from 'lucide-react';
import { usePatientStore } from '../../store/usePatientStore';
import { TransferModal } from './TransferModal';
import { useTranslation } from '../../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types/patient';
import clsx from 'clsx';

const getStatusConfig = (t: (key: string) => string) => ({
  'unstable': {
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    icon: AlertCircle,
    label: t('patients.status.unstable')
  },
  'stable': {
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: Timer,
    label: t('patients.status.stable')
  },
  'discharge-ready': {
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    icon: CheckCircle2,
    label: t('patients.status.discharge-ready')
  }
});

interface PatientCellProps {
  roomNumber: string;
  patient?: Patient;
  bedLabel: string;
  isBed?: boolean;
}

export const PatientCell: React.FC<PatientCellProps> = ({
  roomNumber,
  patient,
  bedLabel,
  isBed
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const initialPatientState = {
    name: '',
    diagnosis: '',
    status: 'stable' as PatientStatus,
    admissionDate: new Date().toISOString()
  };
  const [editedPatient, setEditedPatient] = useState(initialPatientState);

  const { addPatient, deletePatient } = usePatientStore();
  const { t } = useTranslation();
  const STATUS_CONFIG = getStatusConfig(t);

  const handleCellClick = () => {
    if (patient) {
      navigate(`/patients/${patient.id}`);
    } else if (isBed) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!patient) {
      await addPatient({
        name: editedPatient.name,
        diagnosis: editedPatient.diagnosis,
        status: editedPatient.status,
        admissionDate: editedPatient.admissionDate,
        roomNumber,
      });
      setEditedPatient(initialPatientState);
      setIsEditing(false);
      if (!isBed) {
        setIsDetailsOpen(true);
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePatient(patient.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete patient';
      alert(errorMessage);
    }
  };

  // Guard against undefined patient when rendering delete confirmation
  const renderDeleteConfirm = () => {
    if (!patient) return null;
    
    return (
      <AnimatePresence>
        {showDeleteConfirm && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete patient <span className="font-medium">{patient.name}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
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
                  Delete Patient
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <>
      <motion.div 
        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${
          isBed ? 'border border-gray-200 dark:border-gray-700' : ''
        } ${patient || isBed ? 'cursor-pointer' : ''}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={handleCellClick}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {isBed && <BedDouble className="w-4 h-4 text-gray-400" />}
            {bedLabel}
          </h3>
          {patient ? (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTransferOpen(true);
                }}
                className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              >
                <MoveRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : isBed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 text-primary hover:bg-primary/10 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <div className="space-y-2" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              value={editedPatient.name}
              onChange={e => setEditedPatient({ ...editedPatient, name: e.target.value })}
              placeholder={t('patients.basicInfo.name')}
              className="w-full p-2 text-sm border rounded"
            />
            <input
              type="text"
              value={editedPatient.diagnosis}
              onChange={e => setEditedPatient({ ...editedPatient, diagnosis: e.target.value })}
              placeholder={t('patients.basicInfo.diagnosis')}
              className="w-full p-2 text-sm border rounded"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        ) : (
          patient && (
            <div>
              <p className="font-medium">{patient.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{patient.diagnosis}</p>
            </div>
          )
        )}

        {!patient && !isEditing && isBed && (
          <div className="flex items-center justify-center h-12 text-gray-400">
            <span className="text-sm">{t('patients.rooms.clickToAdd')}</span>
          </div>
        )}
        {patient && (
          <div className={clsx(
            'mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm',
            STATUS_CONFIG[patient.status].bgColor,
            STATUS_CONFIG[patient.status].color
          )}>
            {React.createElement(STATUS_CONFIG[patient.status].icon, { className: "w-4 h-4" })}
            <span className="font-medium">{STATUS_CONFIG[patient.status].label}</span>
          </div>
        )}
      </motion.div>
      
      {renderDeleteConfirm()}

      {patient && (
        <>
          <TransferModal
            patient={patient}
            isOpen={isTransferOpen}
            onClose={() => setIsTransferOpen(false)}
          />
        </>
      )}
    </>
  );
};