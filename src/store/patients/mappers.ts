import type { Patient, PatientNote } from '../../types/patient';

export function mapPatientFromDB(data: any): Patient {
  return {
    id: data.id,
    age: data.age || null,
    sex: data.sex || null,
    name: data.name,
    diagnosis: data.diagnosis,
    roomNumber: data.room_number,
    status: data.status,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    admissionDate: new Date(data.admission_date),
    echoData: data.echo_data,
    ecgData: data.ecg_data,
    medicalHistory: data.medical_history,
    documentationImages: data.documentation_images ? {
      images: data.documentation_images.images?.map((img: any) => ({
        url: img.url,
        description: img.description,
        uploadedAt: new Date(img.uploadedAt)
      })) || []
    } : { images: [] },
    comorbidities: Array.isArray(data.comorbidities) ? data.comorbidities : [],
    notes: data.patient_notes_with_users?.map(mapNoteFromDB) || [],
    userId: data.user_id,
    assigned_doctor_id: data.assigned_doctor_id,
    assigned_department: data.assigned_department,
    last_modified_by: data.last_modified_by,
    last_modified_at: data.last_modified_at ? new Date(data.last_modified_at) : undefined
  };
}

export function mapNoteFromDB(data: any): PatientNote {
  return {
    id: data.note_id || data.id,
    content: typeof data.content === 'string' 
      ? data.content 
      : typeof data.content === 'object' && 'content' in data.content
        ? data.content.content
        : data.content,
    type: data.type,
    timestamp: new Date(data.created_at),
    createdBy: data.created_by,
    createdByName: data.created_by_name || null,
    reminder: data.reminder ? {
      dueAt: new Date(data.reminder.dueAt),
      status: data.reminder.status,
      updatedAt: new Date(data.reminder.updatedAt)
    } : undefined
  };
}