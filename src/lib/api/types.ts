export interface APIResponse {
  text: string;
  error?: string;
  sources?: any[];
  imageAnalysis?: string;
}

export interface APIError {
  message: string;
  status?: number;
}