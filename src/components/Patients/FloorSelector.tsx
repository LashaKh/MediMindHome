import React from 'react';
import { ChevronDown } from 'lucide-react';

export type Floor = '9th-cardiac' | '10th-icu';

interface FloorSelectorProps {
  selectedFloor: Floor;
  onFloorChange: (floor: Floor) => void;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  selectedFloor,
  onFloorChange
}) => {
  const floors = [
    { id: '9th-cardiac', label: 'Cardiac Patient Table - 9th Floor' },
    { id: '10th-icu', label: 'ICU Patient Table - 10th Floor' }
  ] as const;

  return (
    <div className="relative">
      <select
        value={selectedFloor}
        onChange={(e) => onFloorChange(e.target.value as Floor)}
        className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary text-base"
      >
        {floors.map((floor) => (
          <option key={floor.id} value={floor.id}>
            {floor.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
    </div>
  );
};