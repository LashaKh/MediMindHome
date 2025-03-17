export type PatientStatus = 'unstable' | 'stable' | 'discharge-ready';
export type Department = 'cardiac_icu' | 'cardiac_surgery_icu';

export interface Patient {
  id: string;
  name: string;
  age?: number;
  sex?: 'male' | 'female';
  diagnosis: string;
  roomNumber: string;
  status: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
  admissionDate: Date;
  echoData?: {
    ivs?: string;
    lvedd?: string;
    ef?: string;
    la?: string;
    aoAsc?: string;
    aoArch?: string;
    aoAb?: string;
    rv?: string;
    tr?: string;
    mr?: string;
    ivcCollapsed?: string;
    ivcCm?: string;
    notes?: string;
    videos?: string[];
  };
  ecgData?: {
    notes?: string;
    images?: string[];
  };
  medicalHistory?: {
    anamnesis?: string;
    pastConditions?: string[];
    familyHistory?: string;
    allergies?: string[];
    medications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
    }>;
  };
  documentationImages?: {
    images: Array<{
      url: string;
      description: string;
      uploadedAt: Date;
    }>;
  };
  comorbidities?: string[];
  notes: PatientNote[];
  userId: string;
  assigned_department: Department;
  last_modified_by?: string;
  last_modified_at?: Date;
  assigned_doctor_id?: string;
}

export interface PatientNote {
  id: string;
  content: string;
  type?: string;
  timestamp: Date;
  createdBy: string;
  createdByName?: string;
  reminder?: {
    dueAt: Date;
    status: 'pending' | 'completed' | 'snoozed';
    updatedAt?: Date;
  };
}