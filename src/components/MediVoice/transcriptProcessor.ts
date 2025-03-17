import { SpeakerSegment } from './types';
import { 
  parseConversationFromText, 
  isDoctorSpeech, 
  isPatientSpeech 
} from './transcriptionUtils';

// Process transcript data and extract segments based on format
export const processTranscriptData = (transcript: any): SpeakerSegment[] => {
  if (!transcript) return [];
  
  console.log('Processing transcript data:', transcript);
  
  // AWS Medical Scribe format
  if (transcript?.Conversation?.TranscriptSegments) {
    console.log('Using AWS Medical Scribe transcript format');
    const segments = transcript.Conversation.TranscriptSegments || [];
    
    // Log the ParticipantRole values found in the transcript
    const participantRoles = segments
      .map((s: any) => s.ParticipantDetails?.ParticipantRole)
      .filter(Boolean);
    
    console.log('Speaker roles found in transcript:', [...new Set(participantRoles)]);
    
    // Process segments directly using the ParticipantRole from AWS HealthScribe
    return segments.reduce((acc: SpeakerSegment[], segment: any, index: number) => {
      const time = parseFloat(segment.BeginAudioTime || '0');
      const content = segment.Content || '';
      
      // Get role directly from ParticipantRole
      let role = segment.ParticipantDetails?.ParticipantRole || 'UNKNOWN';
      
      // Simple validation of role format
      if (typeof role === 'string') {
        // If role doesn't start with "CLINICIAN" or "PATIENT", use default based on index
        if (!role.startsWith('CLINICIAN') && !role.startsWith('PATIENT') && role !== 'DOCTOR') {
          console.log(`Non-standard role "${role}" at segment ${index}, defaulting based on index`);
          role = index % 2 === 0 ? 'CLINICIAN' : 'PATIENT';
        }
        // Keep original role with numbering (CLINICIAN_0, PATIENT_1, etc.) when provided
      } else {
        console.log(`Non-string role value: ${role}, defaulting based on index ${index}`);
        role = index % 2 === 0 ? 'CLINICIAN' : 'PATIENT';
      }
      
      console.log(`Segment ${index} - Time: ${time}, Role: ${role}, Content: "${content.substring(0, 50)}..."`);
      
      // Find or create segment for this speaker
      let currentSegment = acc[acc.length - 1];
      if (!currentSegment || currentSegment.role !== role) {
        currentSegment = {
          role,
          startTime: time,
          content: content,
          items: []
        };
        acc.push(currentSegment);
      } else {
        // Append content with proper spacing
        currentSegment.content += (content.match(/^[.,!?]/) ? '' : ' ') + content;
      }
      
      currentSegment.items.push({
        time,
        content,
        type: 'SPEECH',
        role
      });
      
      return acc;
    }, []);
  }
  
  // For other formats, add better debug logging to help identify issues
  console.log('Not using AWS Medical Scribe format. Transcript structure:', 
    Object.keys(transcript || {}).join(', '));
    
  // If we have results format (from AWS Transcribe)
  if (transcript?.results?.transcripts) {
    console.log('Using AWS Transcribe format with results.transcripts');
    
    // If the results include speaker labels, use those directly
    if (transcript?.results?.speaker_labels?.segments) {
      console.log('Found speaker labels in AWS Transcribe results');
      const speakerSegments = transcript.results.speaker_labels.segments;
      const transcripts = transcript.results.transcripts[0]?.transcript || '';
      const items = transcript.results.items || [];
      
      // Map speaker labels to clinician/patient roles (speaker_0 = clinician, speaker_1 = patient, etc.)
      const speakerMapping: Record<string, string> = {};
      
      // Create segments based on speaker turns
      return speakerSegments.reduce((acc: SpeakerSegment[], segment: any, index: number) => {
        const speakerId = segment.speaker_label;
        
        // Determine role (first speaker is usually the clinician/doctor)
        // This mapping can be customized based on your data
        if (!speakerMapping[speakerId]) {
          speakerMapping[speakerId] = index % 2 === 0 ? 'CLINICIAN' : 'PATIENT';
        }
        
        const role = speakerMapping[speakerId];
        const segmentItems = segment.items || [];
        
        // Attempt to reconstruct the content for this segment
        let content = '';
        let startTime = parseFloat(segmentItems[0]?.start_time || '0');
        
        segmentItems.forEach((item: any) => {
          // Find the matching item in the transcript items
          const matchingItem = items.find((i: any) => 
            i.start_time === item.start_time && i.end_time === item.end_time);
          
          if (matchingItem) {
            content += (matchingItem.alternatives[0]?.content || '') + ' ';
          }
        });
        
        if (content.trim()) {
          return [
            ...acc,
            {
              role,
              startTime,
              content: content.trim(),
              items: [{
                time: startTime,
                content: content.trim(),
                type: 'SPEECH',
                role
              }]
            }
          ];
        }
        
        return acc;
      }, []);
    }
    
    const text = transcript.results.transcripts[0]?.transcript || '';
    
    // Try to parse the transcript to identify doctor vs patient speech
    // If the text contains patterns like "Doctor:" or "Patient:", parse it accordingly
    if (/Doctor:|Dr\.:|Patient:|Pt\.:|Physician:|Clinician:|Client:/i.test(text)) {
      console.log('Detected explicit speaker patterns in transcript, parsing speakers...');
      return parseConversationFromText(text);
    }

    // For more natural conversations without explicit speaker markers, we'll try to infer
    console.log('No explicit speaker markers, using content analysis and turn-taking...');
    
    // First try to split into logical turns/exchanges (using breaks like time markers or multiple line breaks)
    // Then parse each turn to determine the likely speaker
    const turns = text.split(/\n\s*\n|\r\n\s*\r\n|\d+:\d+(\s|$)/).filter((turn: string) => turn.trim().length > 0);
    
    // If we found logical turns, process them
    if (turns.length > 1) {
      console.log('Found logical turns in conversation:', turns.length);
      
      return turns.map((turn: string, index: number) => {
        // Try to determine the role based on content
        let role;
        if (isDoctorSpeech(turn)) {
          role = 'CLINICIAN';
        } else if (isPatientSpeech(turn)) {
          role = 'PATIENT';
        } else {
          // If content analysis is inconclusive, alternate roles, starting with doctor
          role = index % 2 === 0 ? 'CLINICIAN' : 'PATIENT';
        }
        
        // Create a segment for this turn
        return {
          role,
          startTime: index,
          content: turn.trim(),
          items: [{
            time: index,
            content: turn.trim(),
            type: 'SPEECH',
            role
          }]
        };
      });
    }

    // If no logical turns found, fall back to sentence-based splitting
    console.log('No logical turns found, falling back to sentence splitting and alternating speakers');
    
    // Split into sentences
    const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/).filter((s: string) => s.trim().length > 0);
    
    // Just alternate doctor/patient for each sentence as a last resort
    return sentences.reduce((acc: SpeakerSegment[], sentence: string, index: number) => {
      // Simply alternate roles starting with doctor
      const role = index % 2 === 0 ? 'CLINICIAN' : 'PATIENT';
      
      // Find or create segment for this speaker
      let currentSegment = acc[acc.length - 1];
      if (!currentSegment || currentSegment.role !== role) {
        currentSegment = {
          role,
          startTime: index,
          content: sentence,
          items: []
        };
        acc.push(currentSegment);
      } else {
        // Append content with proper spacing
        currentSegment.content += ' ' + sentence;
      }
      
      currentSegment.items.push({
        time: index,
        content: sentence,
        type: 'SPEECH',
        role
      });
      
      return acc;
    }, []);
  }
  
  // String format (direct text)
  if (typeof transcript === 'string') {
    console.log('Using string transcript format');
    // Try to parse the transcript text to identify doctor vs patient
    return parseConversationFromText(transcript);
  }
  
  // Empty or unknown format
  console.log('Unknown transcript format, returning empty array');
  return [];
}; 