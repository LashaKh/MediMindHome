import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { supabase } from '../lib/supabase';
import { PatientState } from './patients/types';
import { 
  fetchPatients, 
  insertPatient, 
  updatePatientRecord, 
  deletePatientRecord,
  insertPatientNote
} from './patients/queries';
import { mapPatientFromDB, mapNoteFromDB } from './patients/mappers';

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  loading: false,
  error: null,

  loadPatients: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      // Initial load
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          patient_notes_with_users(*)
        `)
        .in('assigned_department', ['cardiac_icu', 'cardiac_surgery_icu']);

      if (error) throw error;
      const patients = data.map(mapPatientFromDB);
      
      set({ patients, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load patients',
        loading: false 
      });
      throw error;
    }
  },

  addPatient: async (patient) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const data = await insertPatient({
        ...patient,
        user_id: user.id,
        last_modified_by: user.id,
        last_modified_at: new Date().toISOString()
      });
      const newPatient = mapPatientFromDB(data);
      
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

      // First check if patient exists
      const { data: existingPatient, error: checkError } = await supabase
        .from('patients')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError || !existingPatient) {
        throw new Error('Patient not found');
      }

      // Update patient
      await updatePatientRecord(id, {
        ...updates,
        last_modified_by: user.id,
        last_modified_at: new Date()
      });
      
      // Fetch fresh data to ensure we have the latest state
      const { data: freshData, error: fetchError } = await supabase
        .from('patients')
        .select('*, patient_notes_with_users(*)')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!freshData) {
        set(state => ({
          patients: state.patients.filter(p => p.id !== id),
          loading: false
        }));
        throw new Error('Patient no longer exists');
      }

      const updatedPatient = mapPatientFromDB(freshData);
      set(state => ({
        patients: state.patients.map(p => 
          p.id === id ? updatedPatient : p
        ),
        loading: false
      }));
    } catch (error) {
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
      
      // First check if patient exists and user has permission
      const { data: existingPatient, error: checkError } = await supabase
        .from('patients')
        .select('id, assigned_department')
        .eq('id', id)
        .single();

      if (checkError) {
        throw new Error('Failed to verify patient');
      }

      if (!existingPatient) {
        throw new Error('Patient not found');
      }

      // Verify department is valid
      if (!['cardiac_icu', 'cardiac_surgery_icu'].includes(existingPatient.assigned_department)) {
        throw new Error('Invalid department - cannot delete patient');
      }

      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(error.message);
      }
      
      set(state => ({
        patients: state.patients.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Failed to delete patient:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete patient',
        loading: false 
      });
      throw error;
    }
  },

  addNote: async (patientId, { content, type, reminder }) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('You must be logged in to add notes');
    }

    try {
      set({ loading: true, error: null });
      
      // Get user's name first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();

      if (userError) {
        throw new Error('Failed to get user data');
      }

      const newNote = await insertPatientNote({
        patient_id: patientId,
        content,
        type: type || 'general',
        reminder
      }, user.id);

      // Update local state
      set(state => ({
        patients: state.patients.map(p => 
          p.id === patientId 
            ? { 
                ...p, 
                notes: [mapNoteFromDB(newNote), ...p.notes]
              }
            : p
        ),
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to add note';
      
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  deleteNote: async (patientId, noteId) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('patient_notes')
        .delete()
        .eq('id', noteId)
        .eq('created_by', user.id);

      if (error) throw error;

      // Update local state
      set(state => ({
        patients: state.patients.map(p => 
          p.id === patientId
            ? {
                ...p,
                notes: p.notes.filter(n => n.id !== noteId)
              }
            : p
        )
      }));

      return true;
    } catch (error) {
      console.error('Failed to delete note:', error);
      return false;
    }
  },

  transferPatient: async (patientId, newRoomNumber) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // First check if target room is available
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('room_number', newRoomNumber)
        .maybeSingle();

      if (existingPatient) {
        throw new Error('Room is already occupied');
      }

      // Update patient's room number
      const { error: updateError } = await supabase
        .from('patients')
        .update({ 
          room_number: newRoomNumber,
          last_modified_by: user.id,
          last_modified_at: new Date().toISOString()
        })
        .eq('id', patientId);

      if (updateError) throw updateError;

      // Update local state
      set(state => ({
        patients: state.patients.map(p =>
          p.id === patientId
            ? { ...p, roomNumber: newRoomNumber }
            : p
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Failed to transfer patient:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to transfer patient',
        loading: false 
      });
      throw error;
    }
  },

  cleanup: () => {
    set({ patients: [] });
  }
}));