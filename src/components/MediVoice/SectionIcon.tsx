import React from 'react';
import { AlertCircle, History, Heart, Stethoscope, Activity, Clipboard } from 'lucide-react';

interface SectionIconProps {
  name: string;
}

export const SectionIcon: React.FC<SectionIconProps> = ({ name }) => {
  switch (name) {
    case 'CHIEF_COMPLAINT':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'HISTORY_OF_PRESENT_ILLNESS':
      return <History className="w-5 h-5 text-blue-500" />;
    case 'PAST_MEDICAL_HISTORY':
      return <Heart className="w-5 h-5 text-purple-500" />;
    case 'PHYSICAL_EXAMINATION':
      return <Stethoscope className="w-5 h-5 text-green-500" />;
    case 'ASSESSMENT':
      return <Activity className="w-5 h-5 text-yellow-500" />;
    default:
      return <Clipboard className="w-5 h-5 text-gray-500" />;
  }
}; 