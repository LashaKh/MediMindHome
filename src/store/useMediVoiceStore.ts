import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { persist } from 'zustand/middleware';

interface MediVoiceResult {
  id: string;
  job_name: string;
  file_name: string;
  transcript: any;
  clinical_summary: any;
  media_url?: string;
  created_at: Date;
  updated_at: Date;
}

interface OngoingTranscription {
  jobName: string;
  fileName: string;
  fileUrl: string | null;
  status: 'uploading' | 'processing';
  startTime: Date;
}

interface MediVoiceState {
  results: MediVoiceResult[];
  ongoingTranscriptions: OngoingTranscription[];
  loading: boolean;
  error: string | null;
  loadResults: () => Promise<void>;
  addResult: (result: Omit<MediVoiceResult, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  addOngoingTranscription: (transcription: OngoingTranscription) => void;
  updateOngoingTranscription: (jobName: string, updates: Partial<OngoingTranscription>) => void;
  removeOngoingTranscription: (jobName: string) => void;
  getOngoingTranscription: (jobName: string) => OngoingTranscription | undefined;
}

export const useMediVoiceStore = create<MediVoiceState>()(
  persist(
    (set, get) => ({
      results: [],
      ongoingTranscriptions: [],
      loading: false,
      error: null,

      loadResults: async () => {
        try {
          set({ loading: true, error: null });

          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) {
            throw new Error('User not authenticated');
          }

          const { data, error } = await supabase
            .from('medivoice_results')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const results = data.map(result => ({
            ...result,
            created_at: new Date(result.created_at),
            updated_at: new Date(result.updated_at)
          }));

          set({ results, loading: false });
        } catch (error) {
          console.error('Failed to load MediVoice results:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load results',
            loading: false 
          });
        }
      },

      addResult: async (result) => {
        try {
          set({ loading: true, error: null });

          console.log('useMediVoiceStore - addResult received:', result);
          
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) {
            throw new Error('User not authenticated');
          }

          // Create data object with defaults for NULL values
          const dataToInsert = {
            user_id: session.user.id,
            job_name: result.job_name,
            file_name: result.file_name,
            transcript: result.transcript || { results: { transcripts: [{ transcript: 'No transcript available' }] } },
            clinical_summary: result.clinical_summary || null,
            media_url: result.media_url
          };
          
          console.log('useMediVoiceStore - Inserting to Supabase:', dataToInsert);

          const { data, error } = await supabase
            .from('medivoice_results')
            .insert([dataToInsert])
            .select()
            .single();

          if (error) {
            console.error('Supabase insert error:', error);
            throw error;
          }

          console.log('useMediVoiceStore - Insert successful, returned data:', data);
          
          const newResult = {
            ...data,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at)
          };

          set(state => ({
            results: [newResult, ...state.results],
            loading: false
          }));
        } catch (error) {
          console.error('Failed to add MediVoice result:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add result',
            loading: false 
          });
        }
      },

      deleteResult: async (id: string) => {
        try {
          set({ loading: true, error: null });

          const { error } = await supabase
            .from('medivoice_results')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set(state => ({
            results: state.results.filter(result => result.id !== id),
            loading: false
          }));
        } catch (error) {
          console.error('Failed to delete MediVoice result:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete result',
            loading: false 
          });
        }
      },

      // Methods for managing ongoing transcriptions
      addOngoingTranscription: (transcription: OngoingTranscription) => {
        set(state => ({
          ongoingTranscriptions: [
            ...state.ongoingTranscriptions.filter(t => t.jobName !== transcription.jobName), 
            transcription
          ]
        }));
      },

      updateOngoingTranscription: (jobName: string, updates: Partial<OngoingTranscription>) => {
        set(state => ({
          ongoingTranscriptions: state.ongoingTranscriptions.map(t => 
            t.jobName === jobName ? { ...t, ...updates } : t
          )
        }));
      },

      removeOngoingTranscription: (jobName: string) => {
        set(state => ({
          ongoingTranscriptions: state.ongoingTranscriptions.filter(t => t.jobName !== jobName)
        }));
      },

      getOngoingTranscription: (jobName: string) => {
        return get().ongoingTranscriptions.find(t => t.jobName === jobName);
      }
    }),
    {
      name: 'medivoice-storage',
      partialize: (state) => ({ 
        ongoingTranscriptions: state.ongoingTranscriptions 
      }),
    }
  )
); 