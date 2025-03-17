import React from 'react';
import { format } from 'date-fns';

interface HeaderProps {
  isAI: boolean;
  timestamp: Date;
}

export const Header: React.FC<HeaderProps> = ({ isAI, timestamp }) => (
  <div className="flex items-center justify-between">
    <span className="font-medium">
      {isAI ? 'MediMind AI' : 'You'}
    </span>
    <span className="text-sm text-gray-500">
      {format(timestamp, 'HH:mm')}
    </span>
  </div>
);