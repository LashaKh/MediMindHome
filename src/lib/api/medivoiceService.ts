import { API_ENDPOINTS } from './constants';
import { formatS3UriForAWS } from '../../utils/s3Utils';
import { uploadAudioFile } from './medivoice';

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Helper for delaying execution
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Makes a request to the API with timeout and proper headers
 */
export async function makeRequest(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    console.log('Making request to:', url);
    console.log('Request options:', {
      method: options.method,
      headers: options.headers,
      bodyPreview: options.body ? (options.body as string).substring(0, 150) + '...' : 'No body'
    });
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors',
      headers: {
        ...options.headers,
        'Accept': 'application/json',
        'Origin': window.location.origin
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // For debugging, log the full error content
      const errorText = await response.text();
      console.error('Error response from API:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }
      
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to reach transcription service. Please check your connection and try again.');
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout: The server took too long to respond. Please try again.');
    }
    throw error;
  }
}

/**
 * Starts a transcription job
 */
export const startTranscriptionJob = async (
  s3Uri: string, 
  file: File | null,
  bucket?: string, 
  key?: string
): Promise<{ job_name: string }> => {
  // Validate S3 URI format
  if (!s3Uri || !s3Uri.startsWith('s3://')) {
    throw new Error('Invalid S3 URI format: ' + s3Uri);
  }

  // Don't modify the S3 URI format - use it exactly as provided
  console.log('Using S3 URI for Medical Scribe:', s3Uri);

  // Create unique job name
  const uniqueJobName = `job-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  console.log('Generated job name:', uniqueJobName);

  // Prepare request payload - match the exact format that worked prior to refactoring
  const requestPayload = {
    action: 'start',
    job_name: uniqueJobName,
    media_url: s3Uri,
    metadata: {
      fileName: file ? file.name : 'audio_file.mp3',
      fileType: file ? file.type : 'audio/mpeg',
      fileSize: file ? file.size : 0,
      bucket,
      key,
      timestamp: new Date().toISOString()
    }
  };
  
  console.log('Sending transcription request with payload:', requestPayload);

  const response = await makeRequest(API_ENDPOINTS.MEDIVOICE_TRANSCRIPTION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestPayload)
  });

  // Log the raw response
  const rawResponseText = await response.clone().text();
  console.log('Raw response from transcription service:', rawResponseText);
  
  let data;
  try {
    data = JSON.parse(rawResponseText);
  } catch (parseError) {
    console.error('Failed to parse response as JSON:', parseError);
    throw new Error(`Invalid JSON response: ${rawResponseText.substring(0, 100)}...`);
  }
  
  if (!data.job_name) {
    console.error('Invalid response format:', data);
    throw new Error('Server error: Invalid response format (missing job name)');
  }

  return { job_name: data.job_name };
};

/**
 * Special case handling for known files
 */
export const startSpecialCaseTranscription = async (
  fileName: string, 
  file: File | null
): Promise<{ job_name: string }> => {
  console.log('Using direct S3 URI for known file');
  
  // Use the exact values that worked before refactoring
  const bucket = 'healthscribe-output-medi-mind';
  const key = fileName; // Use the original filename without modifications
  
  // Create a direct S3 URI in the exact format that worked previously
  const directS3Uri = `s3://${bucket}/${key}`;
  console.log('Using direct S3 URI:', directS3Uri);
  
  try {
    // Call the transcription job with the exact URI format that worked before
    const response = await startTranscriptionJob(directS3Uri, file, bucket, key);
    return response;
  } catch (err) {
    console.error(`Failed with key ${key}:`, err);
    throw err;
  }
};

/**
 * Checks the status of a transcription job
 */
export const checkTranscriptionStatus = async (jobId: string): Promise<any> => {
  console.log(`Checking job status for job: ${jobId}`);

  const response = await makeRequest(API_ENDPOINTS.MEDIVOICE_TRANSCRIPTION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'status',
      job_name: jobId
    })
  });

  // Log the raw response for debugging
  const rawData = await response.clone().text();
  console.log('Raw API response:', rawData);

  return response.json();
};

/**
 * Fetches transcription results from provided URIs
 */
export const fetchTranscriptionResults = async (
  transcriptUri: string, 
  clinicalDocumentUri: string
): Promise<{ transcriptData: any, summaryData: any }> => {
  console.log('Fetching transcript and clinical summary from URIs...');
  const [transcriptResponse, summaryResponse] = await Promise.all([
    fetch(transcriptUri),
    fetch(clinicalDocumentUri)
  ]);

  if (!transcriptResponse.ok || !summaryResponse.ok) {
    console.error('Error fetching results:', {
      transcript: transcriptResponse.status,
      summary: summaryResponse.status
    });
    throw new Error('Failed to fetch transcription results');
  }

  const transcriptData = await transcriptResponse.json();
  const summaryData = await summaryResponse.json();
  
  return { transcriptData, summaryData };
};

/**
 * Handles the full transcription process
 */
export const processAudioTranscription = async (
  file: File,
  setUploadProgress: (progress: number) => void,
  onS3UriGenerated?: (uri: string) => void
) => {
  console.log('Starting transcription for file:', file.name);
  
  // Special case handling for the specific file we know exists in S3
  if (file.name === "Doctor-Patient Cost of Care Conversation.mp3") {
    try {
      console.log('Recognized special case file, using direct S3 access');
      const { job_name } = await startSpecialCaseTranscription(file.name, file);
      
      // Use the exact URI format that worked before
      const s3Uri = `s3://healthscribe-output-medi-mind/${file.name}`;
      
      return { 
        jobName: job_name, 
        s3Uri,
        bucket: 'healthscribe-output-medi-mind',
        key: file.name
      };
    } catch (error) {
      console.error('Special case handling failed, falling back to regular upload:', error);
      // Fall through to regular upload if special case fails
    }
  }
  
  // Regular upload flow
  const { s3Uri, bucket, key } = await uploadAudioFile(file, setUploadProgress);
  if (onS3UriGenerated) {
    onS3UriGenerated(s3Uri);
  }
  
  const { job_name } = await startTranscriptionJob(s3Uri, file, bucket, key);
  return { jobName: job_name, s3Uri, bucket, key };
}; 