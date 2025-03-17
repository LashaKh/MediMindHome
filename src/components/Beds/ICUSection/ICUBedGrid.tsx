import React from 'react';
import { ICUBed } from './ICUBed';
import { useBedStore } from '../../../store/useBedStore';

export const ICUBedGrid: React.FC = () => {
  const { beds } = useBedStore();

  const icuBeds = [
    { id: 'ICU-1', label: 'Bed 1' },
    { id: 'ICU-2A', label: 'Bed 2A' },
    { id: 'ICU-2B', label: 'Bed 2B' },
    { id: 'ICU-3', label: 'Bed 3' },
    { id: 'ICU-4', label: 'Bed 4' },
    { id: 'ICU-5', label: 'Bed 5' },
    { id: 'ICU-6', label: 'Bed 6' },
    { id: 'ICU-7', label: 'Bed 7' }
  ];

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {icuBeds.map((bed) => (
        <ICUBed
          key={bed.id}
          id={bed.id}
          label={bed.label}
          patient={beds.find(p => p.bedId === bed.id)}
        />
      ))}
    </div>
  );
};