import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, X } from 'lucide-react';
import { VoiceInput } from '../../Notes/VoiceInput';
import type { Patient } from '../../../types/patient';

interface MedicalHistorySectionProps {
  patient: Patient;
  onMedicalHistoryChange: (field: keyof NonNullable<Patient['medicalHistory']>, value: any) => void;
}

export const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  patient,
  onMedicalHistoryChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const handleVoiceTranscript = (text: string) => {
    onMedicalHistoryChange('anamnesis', 
      patient.medicalHistory?.anamnesis 
        ? `${patient.medicalHistory.anamnesis}\n${text}`
        : text
    );
  };

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) return;

    const medications = [
      ...(patient.medicalHistory?.medications || []),
      newMedication
    ];
    onMedicalHistoryChange('medications', medications);
    setNewMedication({ name: '', dosage: '', frequency: '' });
  };

  const handleRemoveMedication = (index: number) => {
    const medications = patient.medicalHistory?.medications?.filter((_, i) => i !== index) || [];
    onMedicalHistoryChange('medications', medications);
  };

  const handleAddCondition = () => {
    if (!newCondition) return;
    const conditions = [...(patient.medicalHistory?.pastConditions || []), newCondition];
    onMedicalHistoryChange('pastConditions', conditions);
    setNewCondition('');
  };

  const handleRemoveCondition = (index: number) => {
    const conditions = patient.medicalHistory?.pastConditions?.filter((_, i) => i !== index) || [];
    onMedicalHistoryChange('pastConditions', conditions);
  };

  const handleAddAllergy = () => {
    if (!newAllergy) return;
    const allergies = [...(patient.medicalHistory?.allergies || []), newAllergy];
    onMedicalHistoryChange('allergies', allergies);
    setNewAllergy('');
  };

  const handleRemoveAllergy = (index: number) => {
    const allergies = patient.medicalHistory?.allergies?.filter((_, i) => i !== index) || [];
    onMedicalHistoryChange('allergies', allergies);
  };

  return (
    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="font-medium">Medical History & Anamnesis</span>
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
          >
            <div className="p-4 space-y-6">
              {/* Anamnesis Vitae */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">Anamnesis Vitae</label>
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                </div>
                <textarea
                  value={patient.medicalHistory?.anamnesis || ''}
                  onChange={(e) => onMedicalHistoryChange('anamnesis', e.target.value)}
                  rows={4}
                  className="w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter patient's anamnesis vitae..."
                />
              </div>

              {/* Past Medical Conditions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Past Medical Conditions</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Add condition..."
                  />
                  <button
                    onClick={handleAddCondition}
                    disabled={!newCondition}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory?.pastConditions?.map((condition, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      <span className="text-sm">{condition}</span>
                      <button
                        onClick={() => handleRemoveCondition(index)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family History */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Family History</label>
                <textarea
                  value={patient.medicalHistory?.familyHistory || ''}
                  onChange={(e) => onMedicalHistoryChange('familyHistory', e.target.value)}
                  rows={3}
                  className="w-full p-3 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter family history..."
                />
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Allergies</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Add allergy..."
                  />
                  <button
                    onClick={handleAddAllergy}
                    disabled={!newAllergy}
                    className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory?.allergies?.map((allergy, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      <span className="text-sm">{allergy}</span>
                      <button
                        onClick={() => handleRemoveAllergy(index)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Current Medications</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Medication name"
                  />
                  <input
                    type="text"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                    className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Dosage"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMedication.frequency}
                      onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                      className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Frequency"
                    />
                    <button
                      onClick={handleAddMedication}
                      disabled={!newMedication.name || !newMedication.dosage || !newMedication.frequency}
                      className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {patient.medicalHistory?.medications?.map((medication, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="grid grid-cols-3 gap-4 flex-1">
                        <span className="text-sm font-medium">{medication.name}</span>
                        <span className="text-sm">{medication.dosage}</span>
                        <span className="text-sm">{medication.frequency}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveMedication(index)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};