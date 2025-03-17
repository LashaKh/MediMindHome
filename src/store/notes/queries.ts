import { supabase } from '../../lib/supabase';
import type { Note } from '../../types/notes';

export async function fetchNotes(userId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function insertNote(userId: string) {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: userId,
      title: 'Untitled Note',
      content: '',
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNoteRecord(id: string, updates: Partial<Note>) {
  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  if (updates.title !== undefined) {
    updateData.title = updates.title;
  }

  if (updates.content !== undefined) {
    updateData.content = updates.content;
  }

  if (updates.tags !== undefined) {
    updateData.tags = updates.tags;
  }

  const { error } = await supabase
    .from('notes')
    .update(updateData)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteNoteRecord(id: string) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}