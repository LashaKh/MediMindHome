import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ArrowRight } from 'lucide-react';

interface MigrationNoticeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MigrationNotice: React.FC<MigrationNoticeProps> = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isOpen && countdown === 0) {
      // Auto-redirect when countdown reaches 0
      const redirectTimer = setTimeout(() => {
        window.location.href = 'https://medimind.md';
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }
  }, [isOpen, countdown]);

  const handleRedirect = () => {
    window.location.href = 'https://medimind.md';
  };

  const handleClose = () => {
    localStorage.setItem('migration-notice-dismissed', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close notice"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Logo/Icon */}
          <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            We've Moved!
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            MediMind has migrated to our new domain for better performance and enhanced features.
          </p>

          {/* New Domain */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Find us at our new home:</p>
            <p className="text-xl font-semibold text-blue-600">
              medimind.md
            </p>
          </div>

          {/* Countdown */}
          {countdown > 0 && (
            <p className="text-sm text-gray-500 mb-6">
              Auto-redirecting in <span className="font-semibold text-blue-600">{countdown}</span> seconds
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRedirect}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Visit New Site
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Stay Here
            </button>
          </div>

          {/* Footer message */}
          <p className="text-xs text-gray-400 mt-4">
            This site will remain accessible but won't receive updates.
          </p>
        </div>
      </div>

    </div>
  );
};

export default MigrationNotice;