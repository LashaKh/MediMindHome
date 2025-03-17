import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ECGResult {
  id: string;
  raw_analysis: string;
  interpretation: string | null;
  action_plan: string | null;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

interface ECGState {
  results: ECGResult[];
  loading: boolean;
  error: string | null;
  loadResults: () => Promise<void>;
  addResult: (result: Omit<ECGResult, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
}

export const useECGStore = create<ECGState>((set, get) => ({
  results: [],
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
        .from('ecg_results')
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
      console.error('Failed to load ECG results:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load results',
        loading: false 
      });
    }
  },

  addResult: async (result) => {
    try {
      set({ loading: true, error: null });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('ecg_results')
        .insert([{
          user_id: session.user.id,
          raw_analysis: result.raw_analysis,
          interpretation: result.interpretation,
          action_plan: result.action_plan,
          image_url: result.image_url
        }])
        .select()
        .single();

      if (error) throw error;

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
      console.error('Failed to add ECG result:', error);
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
        .from('ecg_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        results: state.results.filter(result => result.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Failed to delete ECG result:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete result',
        loading: false 
      });
    }
  }
}));