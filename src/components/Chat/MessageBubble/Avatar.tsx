import React from 'react';
import { Bot, User } from 'lucide-react';

interface AvatarProps {
  isAI: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ isAI }) => (
  <div className={`w-8 h-8 rounded-full ${
    isAI ? 'bg-primary' : 'bg-secondary'
  } text-white flex items-center justify-center`}>
    {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
  </div>
);