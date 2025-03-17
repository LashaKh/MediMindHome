import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  content: string;
}

const CLINICAL_TEMPLATES: Template[] = [
  {
    id: 'soap',
    name: 'SOAP Note',
    content: `<h2>Subjective</h2>
<p>Chief complaint:</p>
<p>History of present illness:</p>
<p>Past medical history:</p>
<p>Medications:</p>
<p>Allergies:</p>
<p>Review of systems:</p>

<h2>Objective</h2>
<p>Vital signs:</p>
<p>Physical examination:</p>
<p>Laboratory results:</p>
<p>Imaging results:</p>

<h2>Assessment</h2>
<p>Primary diagnosis:</p>
<p>Differential diagnosis:</p>

<h2>Plan</h2>
<p>Treatment plan:</p>
<p>Medications:</p>
<p>Follow-up:</p>
<p>Patient education:</p>`
  },
  {
    id: 'progress',
    name: 'Progress Note',
    content: `<h2>Progress Note</h2>
<p>Date/Time:</p>
<p>Patient status:</p>
<p>Vital signs:</p>
<p>Assessment:</p>
<p>Interventions:</p>
<p>Response to treatment:</p>
<p>Plan:</p>`
  },
  {
    id: 'admission',
    name: 'Admission Note',
    content: `<h2>Admission Note</h2>
<p>Date/Time of admission:</p>
<p>Chief complaint:</p>
<p>History of present illness:</p>
<p>Past medical history:</p>
<p>Medications:</p>
<p>Allergies:</p>
<p>Physical examination:</p>
<p>Laboratory results:</p>
<p>Assessment:</p>
<p>Plan:</p>`
  },
  {
    id: 'discharge',
    name: 'Discharge Summary',
    content: `<h2>Discharge Summary</h2>
<p>Date of admission:</p>
<p>Date of discharge:</p>
<p>Admission diagnosis:</p>
<p>Discharge diagnosis:</p>
<p>Procedures performed:</p>
<p>Hospital course:</p>
<p>Discharge medications:</p>
<p>Follow-up instructions:</p>
<p>Condition at discharge:</p>`
  },
  {
    id: 'consultation',
    name: 'Consultation Note',
    content: `<h2>Consultation Note</h2>
<p>Date/Time:</p>
<p>Reason for consultation:</p>
<p>History:</p>
<p>Physical examination:</p>
<p>Diagnostic studies:</p>
<p>Assessment:</p>
<p>Recommendations:</p>`
  }
];

interface NoteTemplatesProps {
  onSelectTemplate: (content: string) => void;
}

export const NoteTemplates: React.FC<NoteTemplatesProps> = ({ onSelectTemplate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template.content);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <FileText className="w-5 h-5" />
        <span>Templates</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Clinical Templates</h3>
            <div className="space-y-1">
              {CLINICAL_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 