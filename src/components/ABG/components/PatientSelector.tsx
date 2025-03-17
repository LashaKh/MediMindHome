import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { usePatientStore } from '../../../store/usePatientStore';
import { useMyPatientsStore } from '../../../store/useMyPatientsStore';
import type { Patient } from '../../../types/patient';

interface PatientSelectorProps {
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient | null) => void;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({
  selectedPatient,
  onSelectPatient
}) => {
  const { patients: tablePatients, loadPatients } = usePatientStore();
  const { patients: myPatients, loadMyPatients } = useMyPatientsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  useEffect(() => {
    loadPatients();
    loadMyPatients();
  }, [loadPatients, loadMyPatients]);

  const handlePatientSelect = (patient: Patient) => {
    onSelectPatient(patient);
    setIsExpanded(false);
  };

  const handleClearPatient = () => {
    onSelectPatient(null);
  };

  // Filter patients based on search query
  const filteredTablePatients = tablePatients.filter(
    patient => 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMyPatients = myPatients.filter(
    patient => 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPatients = activeTab === 'all' ? filteredTablePatients : filteredMyPatients;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Patient (optional)</label>
      <div className="relative">
        {selectedPatient ? (
          <div className="flex items-center justify-between p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 p-2 rounded-full">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">{selectedPatient.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedPatient.diagnosis}
                </div>
              </div>
            </div>
            <button 
              onClick={handleClearPatient}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
        ) : (
          <div>
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:border-primary dark:bg-gray-700 dark:border-gray-600 dark:hover:border-primary"
            >
              <span className="text-gray-500 dark:text-gray-400">Select a patient (optional)</span>
              <div className="text-sm text-primary dark:text-blue-300">Click to select</div>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden">
            <div className="p-2 border-b dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 py-2 pr-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 text-sm"
                />
              </div>
            </div>
            
            <div className="flex border-b dark:border-gray-700">
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'all' 
                    ? 'text-primary border-b-2 border-primary dark:text-blue-300 dark:border-blue-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Patients
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'my' 
                    ? 'text-primary border-b-2 border-primary dark:text-blue-300 dark:border-blue-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('my')}
              >
                My Patients
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto p-2 space-y-1">
              {currentPatients.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  No patients found
                </div>
              ) : (
                currentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <div className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 p-1.5 rounded-full">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {patient.diagnosis}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 