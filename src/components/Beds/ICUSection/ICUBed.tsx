import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Droplet, Plus, BedDouble } from 'lucide-react';
import { BedStatus } from './BedStatus';
import type { Patient } from '../../../types/patient';

interface ICUBedProps {
  id: string;
  label: string;
  patient?: Patient;
}

export const ICUBed: React.FC<ICUBedProps> = ({ id, label, patient }) => {
  const isOccupied = !!patient;

  return (
    <motion.div
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 
        ${isOccupied ? 'border-primary' : 'border-gray-200 dark:border-gray-700'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute -top-3 left-3 px-3 py-1 bg-primary text-white text-sm font-medium rounded-full flex items-center gap-2">
        <BedDouble className="w-4 h-4" />
        {label}
      </div>

      {isOccupied ? (
        <div className="p-4 pt-6">
          <div className="mb-3">
            <h3 className="font-medium text-lg">{patient.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{patient.diagnosis}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <VitalSign
              icon={Heart}
              label="HR"
              value={patient.vitals?.heartRate || '--'}
              unit="bpm"
              alert={patient.vitals?.heartRate > 100 || patient.vitals?.heartRate < 60}
            />
            <VitalSign
              icon={Activity}
              label="BP"
              value={patient.vitals?.bloodPressure || '--'}
              unit="mmHg"
              alert={false}
            />
            <VitalSign
              icon={Thermometer}
              label="Temp"
              value={patient.vitals?.temperature || '--'}
              unit="°C"
              alert={patient.vitals?.temperature > 38}
            />
            <VitalSign
              icon={Droplet}
              label="SpO2"
              value={patient.vitals?.oxygenSaturation || '--'}
              unit="%"
              alert={patient.vitals?.oxygenSaturation < 95}
            />
          </div>

          <BedStatus status={patient.status} />
        </div>
      ) : (
        <div className="p-4 pt-6 h-[200px] flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Available Bed</p>
        </div>
      )}
    </motion.div>
  );
};

interface VitalSignProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string | number;
  unit: string;
  alert?: boolean;
}

const VitalSign: React.FC<VitalSignProps> = ({ icon: Icon, label, value, unit, alert }) => (
  <div className={`flex items-center gap-2 p-2 rounded-lg ${
    alert ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/50'
  }`}>
    <Icon className={`w-4 h-4 ${alert ? 'text-red-500' : 'text-primary'}`} />
    <div className="text-sm">
      <div className="flex items-center gap-1">
        <span className="font-medium">{value}</span>
        <span className="text-gray-500 dark:text-gray-400">{unit}</span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  </div>
);