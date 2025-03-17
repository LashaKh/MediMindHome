import React from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { PatientStatus } from '../../../types/patient';

interface BedStatusProps {
  status: PatientStatus;
}

export const BedStatus: React.FC<BedStatusProps> = ({ status }) => {
  const statusConfig = {
    stable: {
      icon: CheckCircle,
      text: 'Stable',
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    critical: {
      icon: AlertTriangle,
      text: 'Critical',
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20'
    },
    monitoring: {
      icon: Clock,
      text: 'Monitoring',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20'
    }
  }[status];

  const Icon = statusConfig.icon;

  return (
    <div className={`mt-4 px-3 py-2 rounded-lg flex items-center gap-2 ${statusConfig.bg}`}>
      <Icon className={`w-4 h-4 ${statusConfig.color}`} />
      <span className={`text-sm font-medium ${statusConfig.color}`}>
        {statusConfig.text}
      </span>
    </div>
  );
};