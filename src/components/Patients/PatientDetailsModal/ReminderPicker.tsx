import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface ReminderPickerProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
  style?: React.CSSProperties;
}

export const ReminderPicker: React.FC<ReminderPickerProps> = ({
  selectedDate,
  onSelect,
  onClose,
  style
}) => {
  const [date, setDate] = useState(selectedDate || new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  // Update date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  // Handle clicks outside the picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const quickOptions = [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: '4 hours', value: 240 },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'Next week', value: 'week' }
  ];

  const handleQuickSelect = (option: typeof quickOptions[0]) => {
    const now = new Date();
    let reminderDate = new Date(now);

    if (typeof option.value === 'number') {
      reminderDate.setMinutes(now.getMinutes() + option.value);
    } else if (option.value === 'tomorrow') {
      reminderDate.setDate(now.getDate() + 1);
      reminderDate.setHours(9, 0, 0, 0);
    } else if (option.value === 'week') {
      reminderDate.setDate(now.getDate() + 7);
      reminderDate.setHours(9, 0, 0, 0);
    }

    onSelect(reminderDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-[200]"
      style={style}
      ref={pickerRef}
    >
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Set Reminder</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick options */}
        <div className="grid grid-cols-2 gap-2">
          {quickOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => handleQuickSelect(option)}
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Custom date/time picker */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <input
              min={format(new Date(), 'yyyy-MM-dd')}
              aria-label="Select date"
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={(e) => {
                try {
                  const [year, month, day] = e.target.value.split('-').map(Number);
                  const newDate = new Date(year, month - 1, day);
                  newDate.setHours(date.getHours(), date.getMinutes());
                  if (!isNaN(newDate.getTime())) {
                    setDate(newDate);
                  }
                } catch (error) {
                  console.error('Invalid date:', error);
                }
              }}
              className="flex-1 p-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <input
              aria-label="Select time"
              type="time"
              value={format(date, 'HH:mm')}
              onChange={(e) => {
                try {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(date.getTime());
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  if (!isNaN(newDate.getTime())) {
                    setDate(newDate);
                  }
                } catch (error) {
                  console.error('Invalid time:', error);
                }
              }}
              className="flex-1 p-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={() => {
            const now = new Date();
            if (!isNaN(date.getTime()) && date > now) {
              onSelect(date);
            }
          }}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isNaN(date.getTime()) || date <= new Date()}
        >
          Set Custom Reminder
        </button>
      </div>
    </motion.div>
  );
};