import React from 'react';
import { Send } from 'lucide-react';

interface SendButtonProps {
  disabled: boolean;
}

export const SendButton: React.FC<SendButtonProps> = ({ disabled }) => (
  <button
    type="submit"
    disabled={disabled}
    className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-white 
             hover:bg-primary/90 focus:outline-none focus:ring-2 
             focus:ring-primary focus:ring-offset-2 
             disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Send className="w-5 h-5" />
  </button>
);