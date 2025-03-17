import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, X as XIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { usePatientStore } from '../../store/usePatientStore';
import { supabase } from '../../lib/supabase';

interface ShareRequest {
  id: string;
  sender_id: string;
  sender_email: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ShareRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareRequestsModal: React.FC<ShareRequestsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [requests, setRequests] = useState<ShareRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { loadPatients } = usePatientStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen && user) {
      loadRequests();
    }
  }, [isOpen, user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('patient_share_requests')
        .select(`
          id,
          sender_id,
          status,
          created_at,
          users:sender_id (
            email
          )
        `)
        .eq('recipient_id', user?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data.map(req => ({
        id: req.id,
        sender_id: req.sender_id,
        sender_email: req.users.email,
        created_at: req.created_at,
        status: req.status
      })));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('patient_share_requests')
        .update({ 
          status: action === 'accept' ? 'accepted' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      if (action === 'accept') {
        try {
          // Copy patient data
          const { error: copyError } = await supabase
            .rpc('copy_patient_data', { share_request_id: requestId });

          if (copyError) throw copyError;

          // Refresh patients list after successful copy
          await loadPatients();

          // Refresh requests
          loadRequests();
        } catch (copyError) {
          // Revert status if copy fails
          await supabase
            .from('patient_share_requests')
            .update({ 
              status: 'pending',
              updated_at: new Date().toISOString()
            })
            .eq('id', requestId);
          throw copyError;
        }
      }
    } catch (error) {
      let errorMessage = 'Failed to process request';
      
      if (error instanceof Error) {
        if (error.message.includes('copy_patient_data')) {
          errorMessage = 'Failed to copy patient data. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Share Requests</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : error ? (
                <div className="p-4 text-red-500 text-center">
                  {error}
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                  No pending share requests
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{request.sender_email}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(request.created_at), 'MMM d, yyyy HH:mm')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(request.id, 'accept')}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(request.id, 'reject')}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};