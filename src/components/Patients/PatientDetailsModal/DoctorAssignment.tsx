import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AlertCircle, Check, UserCircle } from 'lucide-react';
import clsx from 'clsx';

interface DoctorAssignmentProps {
  patientId: string;
  currentDoctorId?: string;
  onAssign: (doctorId: string) => void;
}

export const DoctorAssignment: React.FC<DoctorAssignmentProps> = ({
  patientId,
  currentDoctorId,
  onAssign
}) => {
  const [doctors, setDoctors] = useState<Array<{ id: string; email: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<{ id: string; email: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchWithRetry = async (attempt: number): Promise<void> => {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('id, email')
              .order('email');

            if (error) throw error;
            
            setDoctors(data || []);
            if (currentDoctorId) {
              const doctor = data?.find(d => d.id === currentDoctorId);
              if (doctor) {
                setCurrentDoctor(doctor);
              }
            }
            setRetryCount(0); // Reset retry count on success
          } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt < MAX_RETRIES - 1) {
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt)));
              return fetchWithRetry(attempt + 1);
            }
            throw error;
          }
        };

        await fetchWithRetry(0);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Unable to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentDoctorId, MAX_RETRIES]);

  const handleAssignDoctor = async (doctorId: string) => {
    if (!doctorId) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const assignWithRetry = async (attempt: number): Promise<void> => {
        try {
          const { error } = await supabase
            .from('patients')
            .update({ assigned_doctor_id: doctorId })
            .eq('id', patientId);

          if (error) throw error;

          const selectedDoctor = doctors.find(d => d.id === doctorId);
          if (selectedDoctor) {
            setCurrentDoctor(selectedDoctor);
          }

          onAssign(doctorId);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
          if (attempt < MAX_RETRIES - 1) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt)));
            return assignWithRetry(attempt + 1);
          }
          throw error;
        }
      };

      await assignWithRetry(0);
    } catch (err) {
      console.error('Failed to assign doctor:', err);
      setError('Failed to assign doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-2 space-y-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border dark:border-gray-700">
      <div className="flex flex-col">
        <label className="block text-base font-semibold text-gray-900 dark:text-white mb-4">
          Assigned Doctor
          {loading && <span className="ml-2 text-sm text-gray-500">(Loading...)</span>}
        </label>
        
        {/* Current Doctor Display */}
        {currentDoctor && (
          <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <UserCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {currentDoctor.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Currently Assigned
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Selection */}
        <div className="relative">
          <select
            value={currentDoctorId || ''}
            onChange={(e) => handleAssignDoctor(e.target.value)}
            disabled={loading}
            className={clsx(
              "w-full px-4 py-3 text-base rounded-lg appearance-none",
              "bg-white dark:bg-gray-800",
              "border border-gray-200 dark:border-gray-700",
              "focus:ring-2 focus:ring-primary focus:border-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-sm"
            )}
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option 
                key={doctor.id} 
                value={doctor.id}
                disabled={doctor.id === currentDoctorId}
              >
                {doctor.email}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 text-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Doctor assigned successfully</span>
        </div>
      )}
    </div>
  );
};