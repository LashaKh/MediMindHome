import { SpeakerSegment, TranscriptItem } from './types';

export const formatSectionName = (name: string) => {
  return name
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Improve the logic for determining doctor speech with more medical terminology
export const isDoctorSpeech = (text: string): boolean => {
  // Medical terminology and phrases more likely used by doctors
  const doctorPhrases = [
    /\b(?:prescribe|prescribed|medication|treatment plan|diagnosis|symptoms|examination|lab results|test results)\b/i,
    /\b(?:what brings you|how are you feeling|any pain|on a scale|follow-up|referred|specialist|history)\b/i,
    /\b(?:I recommend|I suggest|I'd like to|we should|let's schedule|let me check|I'll order|we need to)\b/i,
    /\b(?:your condition|your treatment|your medication|your recovery|your health|your blood pressure|your labs)\b/i,
    /\b(?:MRI|CT scan|blood work|X-ray|EKG|ultrasound|referring you to|follow up in|come back in)\b/i,
    /\b(?:mmHg|mg|mcg|mL|dosage|twice daily|once daily|with meals|before bed)\b/i,
    /\?$/ // Questions are often from doctors in medical conversations
  ];
  
  // Check if the text contains any doctor phrases
  return doctorPhrases.some(pattern => pattern.test(text));
};

// Improve the logic for determining patient speech
export const isPatientSpeech = (text: string): boolean => {
  // Phrases more likely used by patients
  const patientPhrases = [
    /\b(?:hurts|hurt|pain|ache|sore|feeling|felt|noticed|worried|concerned)\b/i,
    /\b(?:my back|my head|my chest|my stomach|my leg|my arm|my medication|my symptoms|my doctor)\b/i,
    /\b(?:started|began|woke up with|came on|got worse|improved|hasn't changed|getting better)\b/i,
    /\b(?:I've been|I'm having|I have|I feel|I felt|I've had|I've noticed|I'm worried|I can't)\b/i,
    /\b(?:it hurts when|makes it worse|helps with|for about|days ago|since last|been going on)\b/i,
    /\b(?:hard to|difficult to|can't seem to|trouble with|problem with|issues with)\b/i
  ];
  
  // Check if the text contains any patient phrases
  return patientPhrases.some(pattern => pattern.test(text));
};

// Helper function to detect transcript format
export const detectTranscriptFormat = (transcript: any): 'conversations' | 'results' | 'string' | 'unknown' => {
  if (!transcript) return 'unknown';
  
  if (transcript?.Conversation?.TranscriptSegments) {
    return 'conversations';
  } else if (transcript?.results?.transcripts) {
    return 'results';
  } else if (typeof transcript === 'string') {
    return 'string';
  } else {
    return 'unknown';
  }
};

// Helper function to parse doctor/patient conversations from text
export const parseConversationFromText = (text: string): SpeakerSegment[] => {
  if (!text) return [];

  // Regular expressions to identify explicit speaker patterns
  const doctorPatterns = [
    /^Doctor:/i, /^Dr\.:/i, /^Physician:/i, /^Clinician:/i
  ];
  const patientPatterns = [
    /^Patient:/i, /^Pt\.:/i, /^Client:/i
  ];

  // Split the text by new lines or potential speaker indicators
  const lines = text.split(/\n|(?=Doctor:|Dr\.:|Physician:|Clinician:|Patient:|Pt\.:|Client:)/i)
    .filter(line => line.trim().length > 0);

  const segments: SpeakerSegment[] = [];
  let currentRole = 'UNKNOWN';
  let currentContent = '';
  let startTime = 0;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // First check for explicit speaker indicators
    const isDoctorLine = doctorPatterns.some(pattern => pattern.test(trimmedLine));
    const isPatientLine = patientPatterns.some(pattern => pattern.test(trimmedLine));
    
    // Extract content without the speaker prefix
    let content = trimmedLine;
    let role = currentRole;
    
    if (isDoctorLine) {
      // Extract content after the "Doctor:" prefix
      content = trimmedLine.replace(/^(Doctor:|Dr\.:|Physician:|Clinician:)/i, '').trim();
      role = 'CLINICIAN';
    } else if (isPatientLine) {
      // Extract content after the "Patient:" prefix
      content = trimmedLine.replace(/^(Patient:|Pt\.:|Client:)/i, '').trim();
      role = 'PATIENT';
    } else if (role === 'UNKNOWN') {
      // If role is still unknown, try to determine based on content analysis
      if (isDoctorSpeech(trimmedLine)) {
        role = 'CLINICIAN';
      } else if (isPatientSpeech(trimmedLine)) {
        role = 'PATIENT';
      } else if (index % 2 === 0) {
        // As a fallback, alternate starting with doctor (common in medical transcripts)
        role = 'CLINICIAN';
      } else {
        role = 'PATIENT';
      }
    } else if (index > 0) {
      // For subsequent lines without explicit speaker markers, alternate roles
      role = currentRole === 'CLINICIAN' ? 'PATIENT' : 'CLINICIAN';
      
      // But use content analysis to override if there's strong evidence
      if (currentRole === 'CLINICIAN' && isDoctorSpeech(trimmedLine)) {
        role = 'CLINICIAN'; // Keep as doctor if it strongly seems like doctor speech
      } else if (currentRole === 'PATIENT' && isPatientSpeech(trimmedLine)) {
        role = 'PATIENT'; // Keep as patient if it strongly seems like patient speech
      }
    }
    
    // If role changed or this is the first line, create a new segment
    if (role !== currentRole || index === 0) {
      if (currentContent.length > 0) {
        // Save the previous segment
        segments.push({
          role: currentRole,
          startTime,
          content: currentContent,
          items: [{
            time: startTime,
            content: currentContent,
            type: 'SPEECH',
            role: currentRole
          }]
        });
      }
      
      // Start a new segment
      currentRole = role;
      currentContent = content;
      startTime = index; // Using index as a simple time proxy
    } else {
      // Append to current segment with proper spacing
      currentContent += (content.match(/^[.,!?]/) ? '' : ' ') + content;
    }
  });
  
  // Add the last segment
  if (currentContent.length > 0) {
    segments.push({
      role: currentRole,
      startTime,
      content: currentContent,
      items: [{
        time: startTime,
        content: currentContent,
        type: 'SPEECH',
        role: currentRole
      }]
    });
  }
  
  return segments;
}; 