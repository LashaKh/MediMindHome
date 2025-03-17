import type { Patient, PatientNote } from '../../types/patient';

export interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  loadPatients: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  transferPatient: (patientId: string, newRoomNumber: string) => Promise<void>;
  addNote: (patientId: string, note: Pick<PatientNote, 'content' | 'type'>) => Promise<void>;
  cleanup: () => void;
}