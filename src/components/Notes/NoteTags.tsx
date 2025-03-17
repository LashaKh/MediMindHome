import React, { useState } from 'react';
import { Tag as TagIcon, X, Plus } from 'lucide-react';

interface NoteTagsProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

// Predefined clinical categories
const CLINICAL_CATEGORIES = [
  'Follow-up',
  'Initial Assessment',
  'Lab Results',
  'Medication Review',
  'Procedure Note',
  'Consultation',
  'Emergency',
  'Radiology',
  'Surgery',
  'Therapy',
  'Mental Health',
  'Chronic Disease',
  'Preventive Care',
  'Pediatric',
  'Geriatric'
];

export const NoteTags: React.FC<NoteTagsProps> = ({
  tags,
  onAddTag,
  onRemoveTag
}) => {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = CLINICAL_CATEGORIES.filter(
    category => 
      !tags.includes(category) && 
      category.toLowerCase().includes(newTag.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <div 
            key={tag}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            <TagIcon className="w-3 h-3" />
            <span>{tag}</span>
            <button
              onClick={() => onRemoveTag(tag)}
              className="ml-1 hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="relative">
        <div className="flex">
          <input
            type="text"
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag..."
            className="flex-1 px-3 py-1 text-sm border dark:border-gray-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleAddTag}
            className="px-3 py-1 bg-primary text-white rounded-r-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredSuggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  onAddTag(suggestion);
                  setNewTag('');
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 