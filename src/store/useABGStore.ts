import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface ABGResult {
  id: string;
  raw_analysis: string;
  interpretation: string | null;
  action_plan: string | null;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  patient_id?: string | null;
  patient?: {
    id: string;
    name: string;
    diagnosis: string;
  } | null;
  type?: 'Arterial Blood Gas' | 'Venous Blood Gas';
}

interface ABGState {
  results: ABGResult[];
  loading: boolean;
  error: string | null;
  loadResults: () => Promise<void>;
  addResult: (result: Omit<ABGResult, 'id' | 'created_at' | 'updated_at'>) => Promise<string>;
  updateResult: (id: string, updates: Partial<Omit<ABGResult, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
}

export const useABGStore = create<ABGState>((set, get) => ({
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
        .from('abg_results')
        .select('*, patients:patient_id(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const results = data.map(result => {
        // Handle the nested patients data
        let patientData = null;
        if (result.patients) {
          patientData = {
            id: result.patients.id,
            name: result.patients.name,
            diagnosis: result.patients.diagnosis
          };
        } else if (result.patient) {
          // For backward compatibility with existing data
          patientData = result.patient;
        }

        return {
          ...result,
          patient: patientData,
          created_at: new Date(result.created_at),
          updated_at: new Date(result.updated_at)
        };
      });

      set({ results, loading: false });
    } catch (error) {
      console.error('Failed to load ABG results:', error);
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

      // Extract patient information
      let patient_id = null;
      let patientInfo = null;
      
      if (result.patient) {
        patient_id = result.patient.id;
        patientInfo = {
          id: result.patient.id,
          name: result.patient.name,
          diagnosis: result.patient.diagnosis
        };
      }

      const { data, error } = await supabase
        .from('abg_results')
        .insert([{
          user_id: session.user.id,
          raw_analysis: result.raw_analysis,
          interpretation: result.interpretation,
          action_plan: result.action_plan,
          image_url: result.image_url,
          patient_id: patient_id // Only use the patient_id reference
        }])
        .select()
        .single();

      if (error) throw error;

      const newResult = {
        ...data,
        patient: patientInfo, // Ensure patient data is available in the UI
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

      set(state => ({
        results: [newResult, ...state.results],
        loading: false
      }));
      
      // Return the ID of the newly created result
      return data.id;
    } catch (error) {
      console.error('Failed to add ABG result:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add result',
        loading: false 
      });
      throw error; // Re-throw to allow handling in the component
    }
  },
  
  updateResult: async (id, updates) => {
    try {
      set({ loading: true, error: null });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('abg_results')
        .update(updates)
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Update the local state
      set(state => ({
        results: state.results.map(result => 
          result.id === id 
            ? { ...result, ...updates, updated_at: new Date() }
            : result
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Failed to update ABG result:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update result',
        loading: false 
      });
      throw error; // Re-throw to allow handling in the component
    }
  },

  deleteResult: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('abg_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        results: state.results.filter(result => result.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Failed to delete ABG result:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete result',
        loading: false 
      });
    }
  }
}));