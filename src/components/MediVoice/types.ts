export interface TranscriptionDisplayProps {
  transcript: any;
  clinicalSummary: any;
  audioFile?: File;
}

export interface AudioPlayerProps {
  audioFile?: File;
  onTimeUpdate: (time: number) => void;
}

export interface TranscriptItem {
  time: number;
  content: string;
  type: string;
  role: string;
}

export interface SpeakerSegment {
  role: string;
  startTime: number;
  content: string;
  items: TranscriptItem[];
} 