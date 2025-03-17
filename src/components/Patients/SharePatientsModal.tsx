import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { supabase } from '../../lib/supabase';

interface SharePatientsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharePatientsModal: React.FC<SharePatientsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const handleShare = async () => {
    if (!user || !email.trim()) return;

    try {
      setStatus('loading');
      setError(null);

      if (email.trim() === user.email) {
        throw new Error('You cannot share patients with yourself');
      }

      // Find recipient user
      const { data: userData, error: lookupError } = await supabase
        .rpc('lookup_user_by_email', {
          lookup_email: email.trim()
        })
        .single();

      if (lookupError) {
        if (lookupError.message.includes('No rows')) {
          throw new Error('No user found with this email address');
        }
        throw lookupError;
      }

      // Then ensure they have a record in public.users
      const { data: publicUser, error: publicError } = await supabase
        .from('users')
        .upsert({
          id: userData.id,
          email: userData.email
        })
        .select('id')
        .single();

      if (publicError) {
        throw publicError;
      }

      const recipientId = publicUser.id;

      // Check if there's already a pending request
      const { data: existingRequest } = await supabase
        .from('patient_share_requests')
        .select('id')
        .eq('sender_id', user.id)
        .eq('recipient_id', recipientId)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingRequest) {
        throw new Error('A pending share request already exists for this user');
      }

      // Create share request
      const { error: shareError } = await supabase
        .from('patient_share_requests')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          status: 'pending'
        });

      if (shareError) throw shareError;

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setEmail('');
      }, 2000);
    } catch (error) {
      let errorMessage = 'Failed to share patients';

      if (error instanceof Error && error.message.includes('No rows match')) {
        errorMessage = 'No user found with this email address';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setStatus('error');
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
              <h2 className="text-lg font-semibold">Share Patient Data</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Recipient Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter recipient's email"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleShare}
                  disabled={status === 'loading' || !email.trim()}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                    status === 'loading'
                      ? 'bg-gray-400'
                      : status === 'success'
                      ? 'bg-green-500'
                      : status === 'error'
                      ? 'bg-red-500'
                      : 'bg-primary'
                  } text-white disabled:opacity-50`}
                >
                  {status === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Sharing...</span>
                    </>
                  ) : status === 'success' ? (
                    'Shared Successfully!'
                  ) : status === 'error' ? (
                    'Failed - Try Again'
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Share Patient Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};