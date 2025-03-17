import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { PatientNote } from '../../types/patient';

interface ReminderNotification {
  id: string;
  patientName: string;
  noteContent: string;
  dueAt: Date;
}

export const ReminderNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<ReminderNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Deduplicate notifications by ID
  const addNotifications = (newNotifications: ReminderNotification[]) => {
    setNotifications(prev => {
      const notificationMap = new Map(prev.map(n => [n.id, n]));
      newNotifications.forEach(n => notificationMap.set(n.id, n));
      return Array.from(notificationMap.values());
    });
  };

  const loadPendingRequests = useCallback(async () => {
    if (!user) return;
    
    if (!supabase) {
      console.warn('Supabase client not initialized');
      return;
    }

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    try {
      setLoading(true);
      setError(null);

      const fetchWithRetry = async (attempt: number): Promise<void> => {
        try {
          const { count } = await supabase
            .from('patient_notes')
            .select('id', { count: 'exact', head: true })
            .eq('created_by', user.id)
            .eq('reminder->>status', 'pending');

          setPendingRequestsCount(count || 0);
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
            return fetchWithRetry(attempt + 1);
          }
          throw error;
        }
      };

      await fetchWithRetry(0);
    } catch (error) {
      console.error('Failed to load reminders:', error);
      setPendingRequestsCount(0); // Fallback to 0 if all retries fail
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const checkReminders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (!session?.user || !supabase) {
        if (mounted) {
          setUser(null);
          setIsInitialized(true);
        }
        return;
      }
      
      if (mounted) {
        setUser(session.user);
        setIsInitialized(true);
      }

      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

      // Query for pending reminders with correct JSONB syntax
      const { data: notes, error } = await supabase
        .from('patient_notes')
        .select(`
          id,
          content,
          reminder,
          patients!patient_notes_patient_id_fkey(
            name
          )
        `)
        .not('reminder', 'is', null)
        .containedBy('reminder', { status: 'pending' })
        .eq('reminder->>status', 'pending')
        .gte('reminder->>dueAt', now.toISOString())
        .lte('reminder->>dueAt', fiveMinutesFromNow.toISOString());

      if (error) {
        console.error('Error fetching reminders:', error);
        return;
      }

      const newNotifications = notes
        .filter(note => note.reminder && note.patients)
        .map(note => ({
          id: note.id,
          patientName: note.patients.name,
          noteContent: typeof note.content === 'string' 
            ? note.content 
            : typeof note.content === 'object' && 'content' in note.content
              ? note.content.content
              : JSON.stringify(note.content),
          dueAt: new Date(note.reminder?.dueAt)
        }));
      
      // Use the deduplication function
      addNotifications(newNotifications);
    };

    // Check initially
    checkReminders();

    // Set up interval to check every minute
    const interval = setInterval(checkReminders, 60000);

    // Subscribe to reminder updates
    const channel = supabase
      .channel('reminder_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patient_notes'
      }, () => {
        checkReminders();
      })
      .subscribe();

    return () => {
      mounted = false;
      clearInterval(interval);
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const loadData = async () => {
      await loadPendingRequests();
    };
    
    loadData();
    
    // Subscribe to changes in reminders
    const channel = supabase
      .channel('reminder_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patient_notes',
        filter: user ? `created_by=eq.${user.id}` : undefined
      }, () => {
        loadPendingRequests();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, loadPendingRequests, isInitialized]);

  const handleDismiss = async (noteId: string) => {
    try {
      // Update the reminder status to completed
      await supabase.rpc('update_note_reminder', {
        note_id: noteId,
        reminder_data: {
          dueAt: new Date().toISOString(), 
          status: 'completed',
          updatedAt: new Date().toISOString()
        }
      });

      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== noteId));
    } catch (error) {
      console.error('Error dismissing reminder:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Reminders"
      >
        <Clock className="w-5 h-5" />
        {pendingRequestsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {pendingRequestsCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="font-medium">Reminders ({pendingRequestsCount})</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? notifications.map((notification, index) => (
                <div
                  key={`${notification.id}-${notification.dueAt.getTime()}-${index}`}
                  className="p-4 border-b dark:border-gray-700 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{notification.patientName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {notification.noteContent}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {format(notification.dueAt, 'HH:mm')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDismiss(notification.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No pending reminders
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};