export interface MessageInputProps {
  onSend: (message: string | { text: string; imageUrl?: string }) => void;
  disabled?: boolean;
}

export interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}