import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { VoiceInput } from '../../Notes/VoiceInput';
import { useAuthStore } from '../../../store/useAuthStore';
import { Plus, X, Trash2, Bell, Edit2 } from 'lucide-react';
import clsx from 'clsx';
import type { PatientNote } from '../../../types/patient';
import { ReminderPicker } from './ReminderPicker';

interface NotesSectionProps {
  notes?: PatientNote[];
  onAddNote: (content: string, reminder?: { dueAt: Date }) => Promise<void>;
  onUpdateNote: (id: string, content: string) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
  onUpdateNoteReminder?: (noteId: string, reminder: { dueAt: Date }) => Promise<void>;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ 
  notes = [], 
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onUpdateNoteReminder
}) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<{id: string; content: string} | null>(null);
  const [activeReminder, setActiveReminder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const { user } = useAuthStore();

  // Helper function to safely extract note content
  const getNoteContent = (note: PatientNote): string => {
    if (!note) return '';
    
    if (typeof note.content === 'string') {
      return note.content;
    }
    
    if (note.content && typeof note.content === 'object') {
      if ('content' in note.content) {
        return note.content.content || '';
      }
      return JSON.stringify(note.content);
    }
    
    return '';
  };

  const handleAddNote = async () => {
    if (!newNoteContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onAddNote(newNoteContent.trim());
      setNewNoteContent('');
      setShowAddNote(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (note: PatientNote) => {
    if (editingNote?.id === note.id) return;
    setEditingNote({ id: note.id, content: getNoteContent(note) });
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editingNote.content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onUpdateNote(editingNote.id, editingNote.content.trim());
      setEditingNote(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const success = await onDeleteNote(id);
      if (!success) {
        throw new Error('Failed to delete note');
      }

      // Clear editing state if deleting the note being edited
      if (editingNote?.id === id) {
        setEditingNote(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete note';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReminderClick = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    setActiveReminder(activeReminder === noteId ? null : noteId);
  };

  const handleSetReminder = async (date: Date) => {
    if (!activeReminder || !onUpdateNoteReminder) return;

    try {
      setError(null);
      await onUpdateNoteReminder(activeReminder, { dueAt: date });
      setActiveReminder(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to set reminder');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notes</h3>
        {!showAddNote && (
          <button
            onClick={() => setShowAddNote(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {showAddNote && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">New Note</h4>
              <button
                onClick={() => {
                  setShowAddNote(false);
                  setNewNoteContent('');
                }}
                className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Type your note here..."
                className="flex-1 p-2 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
              <VoiceInput
                onTranscript={(text) => setNewNoteContent(prev => prev + ' ' + text)}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddNote}
                disabled={!newNoteContent.trim() || isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>
        )}

        {notes.map((note) => {
          if (!note || !note.id) return null; // Skip invalid notes
          
          return (
            <div
              key={note.id}
              className={clsx(
                'p-4 rounded-lg',
                editingNote?.id === note.id 
                  ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-primary'
                  : 'bg-white dark:bg-gray-800'
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {note.createdBy === user?.id ? 'You' : note.createdByName || 'Anonymous'}
                  </span>
                  <div className="relative">
                    <button
                      onClick={(e) => handleReminderClick(e, note.id)}
                      className={clsx(
                        'p-1.5 rounded-lg transition-colors',
                        note.reminder
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    {activeReminder === note.id && (
                      <ReminderPicker
                        selectedDate={note.reminder?.dueAt ? new Date(note.reminder.dueAt) : null}
                        onSelect={handleSetReminder}
                        onClose={() => setActiveReminder(null)}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '0',
                          marginTop: '0.5rem',
                          zIndex: 100
                        }}
                      />
                    )}
                  </div>
                  {note.reminder && (
                    <div className={clsx(
                      'flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                      note.reminder.status === 'completed'
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20'
                        : note.reminder.status === 'snoozed'
                        ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                    )}>
                      <Bell className="w-3 h-3" />
                      <span>
                        {format(new Date(note.reminder.dueAt), 'PPpp')}
                        {note.reminder.status === 'snoozed' && ' (Snoozed)'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {format(new Date(note.timestamp), 'PPpp')}
                  </span>
                  {note.createdBy === user?.id && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStartEdit(note)}
                        className="p-1 text-primary hover:bg-primary/10 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {editingNote?.id === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote(prev => ({ ...prev!, content: e.target.value }))}
                    className="w-full p-2 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editingNote.content.trim() || isSubmitting}
                      className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">
                  {getNoteContent(note)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};