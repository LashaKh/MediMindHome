import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const COMORBIDITIES = [
  'Hypertension',
  'Diabetes mellitus',
  'Coronary artery disease (CAD)',
  'Dyslipidemia',
  'Chronic kidney disease (CKD)',
  'Atrial fibrillation',
  'Heart failure',
  'Obesity',
  'Chronic obstructive pulmonary disease (COPD)',
  'Obstructive sleep apnea (OSA)',
  'Peripheral artery disease (PAD)',
  'Stroke or transient ischemic attack (TIA)',
  'Smoking or tobacco use',
  'Valvular heart disease',
  'Anemia',
  'Depression',
  'Thyroid disorders',
  'Dementia',
  'Cancer',
  'Liver disease',
  'Anxiety',
  'Substance use disorder',
  'Gout/hyperuricemia',
  'Pulmonary hypertension',
  'Osteoporosis',
  'Rheumatoid arthritis',
  'Frailty or geriatric syndromes',
  'Chronic HIV',
  'Hepatitis B/C',
  'Chronic inflammatory conditions'
] as const;

interface ComorbidityProps {
  selectedComorbidities: string[];
  onChange: (comorbidities: string[]) => void;
}

export const ComorbiditySelector: React.FC<ComorbidityProps> = ({
  selectedComorbidities,
  onChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleComorbidity = (comorbidity: string) => {
    const newSelection = selectedComorbidities.includes(comorbidity)
      ? selectedComorbidities.filter(c => c !== comorbidity)
      : [...selectedComorbidities, comorbidity];
    onChange(newSelection);
  };

  return (
    <div className="space-y-4">
      {/* Selected Comorbidities Summary */}
      {selectedComorbidities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedComorbidities.map((comorbidity) => (
            <div
              key={comorbidity}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 rounded-full text-sm"
            >
              <span className="truncate">{comorbidity}</span>
              <button
                onClick={() => toggleComorbidity(comorbidity)}
                className="p-0.5 hover:bg-primary/20 dark:hover:bg-primary/30 rounded-full"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-primary hover:text-primary/90 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <ChevronDown
          className={clsx(
            "w-4 h-4 transition-transform",
            isExpanded ? "rotate-180" : ""
          )}
        />
        <span>
          {isExpanded ? "Hide comorbidities" : "Add comorbidities"}
        </span>
      </button>

      {/* Comorbidities Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
          {COMORBIDITIES.map((comorbidity) => {
            const isSelected = selectedComorbidities.includes(comorbidity);
            return (
              <button
                key={comorbidity}
                onClick={() => toggleComorbidity(comorbidity)}
                type="button"
                className={clsx(
                  'flex items-center gap-2 p-2 text-sm rounded-lg border transition-all text-left',
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20 dark:border-blue-400 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-blue-400/30'
                )}
              >
                <div className={clsx(
                  'flex-shrink-0 w-4 h-4 border rounded flex items-center justify-center',
                  isSelected 
                    ? 'bg-primary border-primary dark:bg-blue-400 dark:border-blue-400' 
                    : 'border-gray-300'
                )}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="truncate">{comorbidity}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};