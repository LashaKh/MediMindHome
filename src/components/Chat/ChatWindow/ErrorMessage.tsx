import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-center rounded-lg">
    {message}
  </div>
);