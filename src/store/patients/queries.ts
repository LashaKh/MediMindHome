import { supabase } from '../../lib/supabase';
import type { Patient, PatientNote } from '../../types/patient';

export async function fetchPatients(userId: string) {
  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      patient_notes_with_users (
        id,
        patient_id,
        content,
        type,
        created_at,
        created_by,
        created_by_name,
        reminder
      )
    `)
    .in('assigned_department', ['cardiac_icu', 'cardiac_surgery_icu'])
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function insertPatient(patient: any) {
  const { data, error } = await supabase
    .from('patients')
    .insert({
      name: patient.name,
      diagnosis: patient.diagnosis,
      room_number: patient.roomNumber,
      status: patient.status || 'stable',
      user_id: patient.user_id,
      assigned_department: patient.assigned_department || 'cardiac_icu',
      last_modified_by: patient.last_modified_by,
      last_modified_at: patient.last_modified_at
    })
    .select(`
      *,
      patient_notes_with_users(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updatePatientRecord(id: string, updates: Partial<Patient>) {
  // Convert camelCase to snake_case for database fields
  const dbUpdates = {
    age: updates.age,
    sex: updates.sex,
    name: updates.name,
    diagnosis: updates.diagnosis,
    room_number: updates.roomNumber,
    status: updates.status,
    echo_data: updates.echoData,
    ecg_data: updates.ecgData,
    medical_history: updates.medicalHistory,
    documentation_images: updates.documentationImages ? {
      images: updates.documentationImages.images.map(img => ({
        url: img.url,
        description: img.description,
        uploadedAt: img.uploadedAt.toISOString()
      }))
    } : null,
    comorbidities: Array.isArray(updates.comorbidities) ? updates.comorbidities : [],
    last_modified_by: updates.last_modified_by,
    last_modified_at: updates.last_modified_at?.toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('patients')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

export async function deletePatientRecord(id: string) {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function insertPatientNote(
  note: { 
    content: string | { content: string }; 
    type: string; 
    patient_id: string;
    reminder?: {
      dueAt: Date;
      status: 'pending' | 'completed' | 'snoozed';
    };
  },
  userId: string
) {
  // Use the RPC function to create note
  const { data, error } = await supabase
    .rpc('create_patient_note', {
      p_patient_id: note.patient_id,
      p_content: typeof note.content === 'string' ? note.content : note.content.content,
      p_type: note.type,
      p_reminder: note.reminder ? {
        dueAt: note.reminder.dueAt.toISOString(),
        status: 'pending',
        updatedAt: new Date().toISOString()
      } : null
    })
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create note');
  }

  if (!data) {
    throw new Error('Failed to create note');
  }

  return data;
}