import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { supabase } from '../lib/supabase';
import type { Patient } from '../types/patient';

interface MyPatientsState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  loadMyPatients: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  cleanup: () => void;
}

export const useMyPatientsStore = create<MyPatientsState>((set, get) => ({
  patients: [],
  loading: false,
  error: null,
  unsubscribe: null,

  loadMyPatients: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });

      // Unsubscribe from previous subscription if exists
      const currentUnsubscribe = get().unsubscribe;
      if (currentUnsubscribe) {
        currentUnsubscribe();
      }

      // Subscribe to personal patient changes
      const channel = supabase
        .channel('my_patients_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'personal_patients',
          filter: `user_id=eq.${user.id}`
        }, async () => {
          const { data, error } = await supabase
            .from('personal_patients')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

          if (error) throw error;
          const patients = data.map(p => ({
            ...p,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at),
            admissionDate: new Date(p.admission_date),
            userId: p.user_id,
            roomNumber: p.room_number,
            echoData: p.echo_data,
            ecgData: p.ecg_data,
            notes: p.notes || [],
            documentationImages: p.documentation_images || { images: [] }
          }));
          set({ patients });
        })
        .subscribe();

      // Store unsubscribe function
      set({ unsubscribe: () => channel.unsubscribe() });

      // Initial load
      const { data, error } = await supabase
        .from('personal_patients')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      const patients = data.map(p => ({
        ...p,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at),
        admissionDate: new Date(p.admission_date),
        userId: p.user_id,
        roomNumber: p.room_number,
        echoData: p.echo_data,
        ecgData: p.ecg_data,
        notes: p.notes || [],
        documentationImages: p.documentation_images || { images: [] }
      }));
      
      set({ patients, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load patients',
        loading: false 
      });
    }
  },

  addPatient: async (patient) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('personal_patients')
        .insert({
          name: patient.name,
          diagnosis: patient.diagnosis,
          room_number: patient.roomNumber,
          status: patient.status,
          user_id: user.id,
          admission_date: new Date().toISOString(),
          echo_data: patient.echoData || {},
          ecg_data: patient.ecgData || {},
          age: patient.age,
          sex: patient.sex,
          comorbidities: patient.comorbidities || [],
          notes: [],
          last_modified_by: user.id,
          last_modified_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const newPatient = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        admissionDate: new Date(data.admission_date),
        userId: data.user_id,
        roomNumber: data.room_number,
        echoData: data.echo_data,
        ecgData: data.ecg_data,
        notes: data.notes || []
      };
      
      set(state => ({
        patients: [newPatient, ...state.patients],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add patient',
        loading: false 
      });
    }
  },

  updatePatient: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // Convert camelCase to snake_case for database
      const dbUpdates = {
        name: updates.name,
        diagnosis: updates.diagnosis,
        room_number: updates.roomNumber,
        status: updates.status,
        admission_date: updates.admissionDate?.toISOString(),
        echo_data: updates.echoData,
        ecg_data: updates.ecgData,
        age: updates.age,
        sex: updates.sex,
        comorbidities: updates.comorbidities || [],
        notes: updates.notes || [],
        documentation_images: updates.documentationImages,
        last_modified_by: user.id,
        last_modified_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('personal_patients')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedPatient = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        admissionDate: new Date(data.admission_date),
        userId: data.user_id,
        roomNumber: data.room_number,
        echoData: data.echo_data,
        ecgData: data.ecg_data,
        notes: data.notes || [],
        documentationImages: data.documentation_images || { images: [] }
      };

      set(state => ({
        patients: state.patients.map(p => p.id === id ? updatedPatient : p),
        loading: false
      }));
    } catch (error) {
      console.error('Failed to update patient:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update patient',
        loading: false 
      });
      throw error;
    }
  },

  deletePatient: async (id) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('personal_patients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      set(state => ({
        patients: state.patients.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete patient',
        loading: false 
      });
    }
  },

  cleanup: () => {
    const currentUnsubscribe = get().unsubscribe;
    if (currentUnsubscribe) {
      currentUnsubscribe();
    }
    set({ patients: [], unsubscribe: null });
  }
}));