import React from 'react';
import { Users, BedDouble, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBedStore } from '../../../store/useBedStore';

export const ICUStats: React.FC = () => {
  const { beds } = useBedStore();
  
  const stats = [
    {
      icon: BedDouble,
      label: 'Total Beds',
      value: '8',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Users,
      label: 'Occupied',
      value: beds.length.toString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: AlertTriangle,
      label: 'Critical',
      value: beds.filter(b => b.status === 'critical').length.toString(),
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: CheckCircle,
      label: 'Stable',
      value: beds.filter(b => b.status === 'stable').length.toString(),
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b dark:border-gray-700">
      {stats.map(({ icon: Icon, label, value, color, bgColor }) => (
        <div key={label} className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};