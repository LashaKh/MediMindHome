import React from 'react';
import { format } from 'date-fns';
import { FileText, Heart, Activity, Printer, Download } from 'lucide-react';
import type { Patient } from '../../../types/patient';
import { generatePatientPDF } from '../../../utils/pdf/generatePatientPDF';

interface SummaryViewProps {
  patient: Patient;
  onClose: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ patient, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    generatePatientPDF([patient], patient.assigned_department === 'cardiac_icu' ? 'cardiac' : 'icu');
  };

  // Helper function to check if a section has data
  const hasData = (obj: any) => {
    if (!obj) return false;
    return Object.values(obj).some(value => 
      value !== null && value !== undefined && value !== ''
    );
  };

  // Format date with fallback
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return format(date, 'PPpp');
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-800 z-[70] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Patient Summary</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Print Summary"
          >
            <Printer className="w-5 h-5" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Export as PDF"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <span className="text-xl">×</span>
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <FileText className="w-5 h-5" />
                  <h3>Basic Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium">{patient.name}</p>
                  </div>
                  {patient.age && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                      <p className="font-medium">{patient.age} years</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Diagnosis</p>
                    <p className="font-medium">{patient.diagnosis || 'N/A'}</p>
                  </div>
                  {patient.sex && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sex</p>
                      <p className="font-medium capitalize">{patient.sex}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="font-medium capitalize">{patient.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Room Number</p>
                    <p className="font-medium">{patient.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Admission Date</p>
                    <p className="font-medium">{formatDate(patient.admissionDate)}</p>
                  </div>
                </div>
              </section>

              {/* Medical History Section */}
              {patient.medicalHistory && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <FileText className="w-5 h-5" />
                    <h3>Medical History</h3>
                  </div>
                  <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    {patient.medicalHistory.anamnesis && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Anamnesis Vitae</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {patient.medicalHistory.anamnesis}
                        </p>
                      </div>
                    )}

                    {patient.medicalHistory.familyHistory && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Family History</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {patient.medicalHistory.familyHistory}
                        </p>
                      </div>
                    )}

                    {patient.medicalHistory.pastConditions && patient.medicalHistory.pastConditions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Past Medical Conditions</p>
                        <div className="flex flex-wrap gap-2">
                          {patient.medicalHistory.pastConditions.map((condition, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 rounded-full text-sm"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {patient.medicalHistory.allergies && patient.medicalHistory.allergies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-2">
                          {patient.medicalHistory.allergies.map((allergy, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full text-sm"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {patient.medicalHistory.medications && patient.medicalHistory.medications.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Medications</p>
                        <div className="space-y-2">
                          {patient.medicalHistory.medications.map((medication, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-600 rounded-lg"
                            >
                              <div className="grid grid-cols-3 gap-4 flex-1">
                                <span className="text-sm font-medium">{medication.name}</span>
                                <span className="text-sm">{medication.dosage}</span>
                                <span className="text-sm">{medication.frequency}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {patient.comorbidities && patient.comorbidities.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <FileText className="w-5 h-5" />
                    <h3>Comorbidities</h3>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {patient.comorbidities.map((comorbidity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 rounded-full text-sm"
                        >
                          {comorbidity}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-6">
              {/* Echo Data */}
              {hasData(patient.echoData) && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <Heart className="w-5 h-5" />
                    <h3>Echo Data</h3>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2">
                      {Object.entries(patient.echoData)
                        .filter(([key, value]) => value && key !== 'notes' && key !== 'videos')
                        .map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{key}</p>
                            <p className="font-medium text-sm">{value}</p>
                          </div>
                        ))}
                    </div>
                    {patient.echoData.videos && patient.echoData.videos.length > 0 && (
                      <div className="border-t dark:border-gray-600 pt-3 mt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Videos</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {patient.echoData.videos.length} echo video{patient.echoData.videos.length !== 1 ? 's' : ''} available
                        </p>
                      </div>
                    )}
                    {patient.echoData.notes && (
                      <div className="border-t dark:border-gray-600 pt-3 mt-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                        <p className="text-sm whitespace-pre-wrap">
                          {patient.echoData.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* ECG Data */}
              {hasData(patient.ecgData) && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <Activity className="w-5 h-5" />
                    <h3>ECG Data</h3>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{patient.ecgData.notes}</p>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Notes */}
          {patient.notes && patient.notes.length > 0 && (
            <section className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <FileText className="w-5 h-5" />
                <h3>Clinical Notes</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {patient.notes.map((note, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {note.createdByName || 'Unknown User'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(note.timestamp, 'PPpp')}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">
                      {typeof note.content === 'string' 
                        ? note.content 
                        : typeof note.content === 'object' && 'content' in note.content
                          ? note.content.content
                          : JSON.stringify(note.content)
                      }
                    </p>
                    {note.reminder && (
                      <div className="mt-2 text-sm text-gray-500">
                        Reminder: {format(note.reminder.dueAt, 'PPp')}
                        {note.reminder.status !== 'pending' && ` (${note.reminder.status})`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Last Modified Info */}
          <section className="mt-6 text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
            <p>Last modified: {formatDate(patient.last_modified_at)}</p>
            {patient.last_modified_by && (
              <p>Modified by: {patient.last_modified_by}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};