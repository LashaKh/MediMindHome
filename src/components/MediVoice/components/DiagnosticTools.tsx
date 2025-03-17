import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../../lib/api/constants';

interface DiagnosticToolsProps {
  error: string | null;
  fileUrl: string | null;
  diagnosticInfo?: any;
}

export const DiagnosticTools: React.FC<DiagnosticToolsProps> = ({ 
  error, 
  fileUrl,
  diagnosticInfo 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!error) return null;

  const checkS3Bucket = () => {
    // Lambda function that checks the S3 bucket
    const checkPayload = {
      action: 'check_s3',
      bucket: 'healthscribe-output-medi-mind',
      prefix: ''
    };
    
    console.log('Sending S3 check request');
    
    fetch(API_ENDPOINTS.MEDIVOICE_TRANSCRIPTION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkPayload)
    })
    .then(response => response.text())
    .then(data => {
      console.log('S3 check response:', data);
      alert(`S3 check completed. Check console for details.`);
    })
    .catch(err => {
      console.error('S3 check error:', err);
      alert(`S3 check failed: ${err.message}`);
    });
  };

  const useCustomKey = () => {
    // Use the exact filename that worked prior to refactoring
    const key = prompt('Enter the exact key from your S3 bucket for the file:', 'Doctor-Patient Cost of Care Conversation.mp3');
    if (!key) return;
    
    const directS3Uri = `s3://healthscribe-output-medi-mind/${key}`;
    console.log('Using custom S3 URI:', directS3Uri);
    
    alert(`Custom key set to: ${key}\nFull S3 URI: ${directS3Uri}\n\nPlease restart the transcription process.`);
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Diagnostic Information</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Error Message:</h3>
          <pre className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 text-xs overflow-auto rounded">
            {error}
          </pre>
        </div>
        
        <div>
          <h3 className="text-sm font-medium">S3 URI Information:</h3>
          <pre className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 text-xs overflow-auto rounded">
            {fileUrl || 'No S3 URI'}
          </pre>
        </div>
        
        {diagnosticInfo && (
          <div>
            <div className="flex items-center">
              <h3 className="text-sm font-medium mr-2">S3 Format Diagnostic:</h3>
              <button 
                className="text-xs text-blue-500 hover:text-blue-700"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            {showDetails && (
              <pre className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 text-xs overflow-auto rounded h-48">
                {JSON.stringify(diagnosticInfo, null, 2)}
              </pre>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">AWS Medical Scribe Troubleshooting:</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            AWS Medical Scribe requires specific S3 URI formats to access objects. 
            If you're experiencing "URI doesn't point to an S3 object" errors, 
            this could be due to:
          </p>
          <ul className="text-xs list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
            <li>Invalid S3 URI format (should be s3://bucket-name/key)</li>
            <li>File doesn't exist at the specified S3 location</li>
            <li>Spaces in filenames (using the exact original format)</li>
            <li>Case sensitivity in file extensions (try .mp3 instead of .MP3)</li>
            <li>Permissions issues (Lambda function needs access to the S3 bucket)</li>
          </ul>
          
          <div className="pt-2 space-y-2">
            <div>
              <button
                onClick={checkS3Bucket}
                className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200 text-xs rounded-md transition-colors"
              >
                Check S3 Bucket Contents
              </button>
              
              <button
                onClick={useCustomKey}
                className="ml-2 px-3 py-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-200 text-xs rounded-md transition-colors"
              >
                Try Custom Key
              </button>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-xs text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">Note:</p>
              <p>The 502 Bad Gateway error when getting a presigned URL can be a temporary AWS issue. Try again later or use a different file.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 