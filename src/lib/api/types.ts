export interface APIResponse {
  text: string;
  error?: string;
}

export interface APIError {
  message: string;
  status?: number;
}