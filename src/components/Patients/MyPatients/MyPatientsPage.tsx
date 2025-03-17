import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMyPatientsStore } from '../../../store/useMyPatientsStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { PatientCard } from './PatientCard';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import type { Patient } from '../../../types/patient';

export const MyPatientsPage: React.FC = () => {
  const { patients, loading, error, loadMyPatients } = useMyPatientsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadMyPatients();
  }, [loadMyPatients]);

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePatientClick = (patient: Patient) => {
    navigate(`/my-patients/${patient.id}`);
  };

  const handleAddNewPatient = () => {
    navigate('/my-patients/new');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Patients
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {patients.length} {patients.length === 1 ? 'patient' : 'patients'} in your care
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNewPatient}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients by name or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
            {error}
          </div>
        ) : filteredPatients.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => handlePatientClick(patient)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery
                ? 'No patients found matching your search'
                : 'No patients added yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddNewPatient}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Patient</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};