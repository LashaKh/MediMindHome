import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { supabase } from '../lib/supabase';
import { NotesState } from './notes/types';
import { 
  fetchNotes, 
  insertNote, 
  updateNoteRecord, 
  deleteNoteRecord 
} from './notes/queries';
import { mapNoteFromDB } from './notes/mappers';

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  selectedNoteId: null,
  selectedNote: null,
  loading: false,
  error: null,

  createNote: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      const data = await insertNote(user.id);
      const newNote = mapNoteFromDB(data);
      
      set(state => ({
        notes: [newNote, ...state.notes],
        selectedNoteId: newNote.id,
        selectedNote: newNote,
        loading: false
      }));
      return newNote.id;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create note',
        loading: false 
      });
      throw error;
    }
  },

  loadNotes: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      set({ loading: true, error: null });
      
      // Subscribe to notes changes
      const channel = supabase
        .channel('notes_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${user.id}`
        }, async () => {
          const data = await fetchNotes(user.id);
          const notes = data.map(mapNoteFromDB);
          set({ 
            notes,
            selectedNote: get().selectedNoteId 
              ? notes.find(n => n.id === get().selectedNoteId) 
              : notes[0] || null
          });
        })
        .subscribe();

      // Initial load
      const data = await fetchNotes(user.id);
      const notes = data.map(mapNoteFromDB);
      
      set({ 
        notes,
        selectedNoteId: notes[0]?.id || null,
        selectedNote: notes[0] || null,
        loading: false 
      });

      return () => {
        channel.unsubscribe();
      };
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load notes',
        loading: false 
      });
    }
  },

  selectNote: (id: string) => {
    const note = get().notes.find(n => n.id === id);
    set({ selectedNoteId: id, selectedNote: note || null });
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    try {
      set({ loading: true, error: null });
      
      // Update local state immediately for better responsiveness
      set(state => ({
        notes: state.notes.map(note =>
          note.id === id ? { ...note, ...updates } : note
        ),
        selectedNote: state.selectedNoteId === id 
          ? { ...state.selectedNote!, ...updates }
          : state.selectedNote
      }));

      // Then update the database
      await updateNoteRecord(id, updates);
      
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update note',
        loading: false 
      });
    }
  },

  deleteNote: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await deleteNoteRecord(id);
      
      set(state => {
        const remainingNotes = state.notes.filter(note => note.id !== id);
        return {
          notes: remainingNotes,
          selectedNoteId: state.selectedNoteId === id ? remainingNotes[0]?.id || null : state.selectedNoteId,
          selectedNote: state.selectedNoteId === id ? remainingNotes[0] || null : state.selectedNote,
          loading: false
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete note',
        loading: false 
      });
    }
  },

  saveNote: async (id: string) => {
    const note = get().notes.find(n => n.id === id);
    if (!note) return;

    try {
      set({ loading: true, error: null });
      await updateNoteRecord(id, {
        title: note.title,
        content: note.content
      });
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save note',
        loading: false 
      });
    }
  },

  cleanup: () => {
    set({ 
      notes: [],
      selectedNoteId: null,
      selectedNote: null
    });
  }
}));