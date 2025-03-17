import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePatientStore } from '../../store/usePatientStore';
import { PatientCell } from './PatientCell';
import { useTranslation } from '../../hooks/useTranslation';

// Room configuration for 10th floor
const ICU_CONFIG = {
  'Cardiac Surgery': ['1', '2', '3', '4'],
  'Post-Op': ['1', '2', '3', '4', '5', '6', '7', '8']
} as const;

export const ICUTable: React.FC = () => {
  const { patients } = usePatientStore();
  const { t } = useTranslation();

  const getPatientByLocation = (section: string, bedNumber: string) =>
    patients.find(p => p.roomNumber === `${section}-${bedNumber}`);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cardiac Surgery Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-base md:text-lg font-semibold">Cardiac Surgery ICU</h2>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {ICU_CONFIG['Cardiac Surgery'].map((number) => (
            <PatientCell
              key={`CS-${number}`}
              roomNumber={`CS-${number}`}
              patient={getPatientByLocation('CS', number)}
              bedLabel={t('patients.rooms.bed', { number })}
              isBed
            />
          ))}
        </div>
      </div>

      {/* Post-Op Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-base md:text-lg font-semibold">Post-Op ICU</h2>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {ICU_CONFIG['Post-Op'].map((number) => (
            <PatientCell
              key={`PO-${number}`}
              roomNumber={`PO-${number}`}
              patient={getPatientByLocation('PO', number)}
              bedLabel={t('patients.rooms.bed', { number })}
              isBed
            />
          ))}
        </div>
      </div>
    </div>
  );
};