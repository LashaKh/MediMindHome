import type { Note } from '../../types/notes';

export function mapNoteFromDB(data: any): Note {
  return {
    id: data.id,
    title: data.title || '',
    content: data.content || '',
    tags: data.tags || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    userId: data.user_id
  };
}