/**
 * Utility functions for handling S3 URIs and operations
 */

/**
 * Extracts bucket and key from an S3 URI
 */
export const extractBucketAndKeyFromS3Uri = (s3Uri: string): { bucket: string, key: string } | null => {
  if (!s3Uri || !s3Uri.startsWith('s3://')) {
    return null;
  }

  const withoutProtocol = s3Uri.replace('s3://', '');
  const firstSlashIndex = withoutProtocol.indexOf('/');
  
  if (firstSlashIndex === -1) {
    return null;
  }

  const bucket = withoutProtocol.substring(0, firstSlashIndex);
  const key = withoutProtocol.substring(firstSlashIndex + 1);
  
  return { bucket, key };
};

/**
 * Normalizes an S3 URI by removing duplicate path segments
 */
export const normalizeS3Uri = (uri: string): string => {
  if (!uri || typeof uri !== 'string') return uri;
  
  // Check for duplicate 'uploads/' in the path
  if (uri.includes('uploads/uploads/')) {
    return uri.replace('uploads/uploads/', 'uploads/');
  }

  // Remove any double slashes except after protocol
  if (uri.includes('//') && uri.indexOf('//') > 5) {
    return uri.replace(/([^:])\/\/+/g, '$1/');
  }
  
  return uri;
};

/**
 * Creates alternative versions of a key to try multiple formats
 */
export const generateAlternativeKeys = (originalKey: string): string[] => {
  if (!originalKey) return [];
  
  return [
    originalKey,                          // Original key
    originalKey.replace(/ /g, '_'),       // Spaces to underscores
    originalKey.replace(/ /g, '%20'),     // URL-encoded spaces
    originalKey.replace(/ /g, '+'),       // Plus-encoded spaces
    encodeURIComponent(originalKey),      // Full URL encoding
    // Remove potential duplicate uploads/ prefix
    originalKey.startsWith('uploads/') ? originalKey : `uploads/${originalKey}`,
    // Try with lowercase extension
    originalKey.replace(/\.[A-Z0-9]+$/, match => match.toLowerCase()),
    // Try with uppercase extension
    originalKey.replace(/\.[a-z0-9]+$/, match => match.toUpperCase())
  ];
};

/**
 * Formats an S3 URI for AWS Medical Scribe service
 */
export const formatS3UriForAWS = (uri: string, bucket?: string, key?: string): string => {
  // If we have bucket and key directly, use those (most reliable)
  if (bucket && key) {
    // Format the key to ensure it's properly structured
    // Remove any leading slashes
    const cleanedKey = key.startsWith('/') ? key.substring(1) : key;
    
    // Use URL encoding for spaces, which worked in the pre-refactoring code
    const encodedKey = cleanedKey.replace(/ /g, '%20');
    
    // Remove any trailing slashes
    const finalKey = encodedKey.endsWith('/') ? encodedKey.slice(0, -1) : encodedKey;
    
    return `s3://${bucket}/${finalKey}`;
  }
  
  // Otherwise, try to extract from the URI and format it properly
  try {
    // Normalize the URI first (remove any duplicate upload paths)
    let normalizedUri = normalizeS3Uri(uri);
    
    const extractedValues = extractBucketAndKeyFromS3Uri(normalizedUri);
    if (extractedValues) {
      const { bucket: extractedBucket, key: extractedKey } = extractedValues;
      
      // Clean the key (remove leading/trailing slashes, replace spaces)
      let cleanedKey = extractedKey;
      if (cleanedKey.startsWith('/')) {
        cleanedKey = cleanedKey.substring(1);
      }
      if (cleanedKey.endsWith('/')) {
        cleanedKey = cleanedKey.slice(0, -1);
      }
      
      // URL encode spaces as was done pre-refactoring
      const finalKey = cleanedKey.replace(/ /g, '%20');
      
      // Direct format - this is what AWS Medical Scribe expects
      return `s3://${extractedBucket}/${finalKey}`;
    }
  } catch (error) {
    console.error('Error formatting S3 URI:', error);
  }
  
  // If we get here, try to clean up the URI directly
  if (uri.startsWith('s3://')) {
    // URL encode spaces as was done pre-refactoring
    return uri.replace(/ /g, '%20');
  }
  
  // If all else fails, return the original URI
  return uri;
}; 