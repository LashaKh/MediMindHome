import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  onKeyDown,
  disabled
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    placeholder="Type your message..."
    rows={1}
    disabled={disabled}
    className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-700 
             bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 
             focus:ring-primary dark:text-white disabled:opacity-50"
  />
);