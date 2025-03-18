import { API_ENDPOINTS } from './constants';
import { APIResponse } from './types';
import { APIError } from './errors';
import { analyzeImage } from './vision';

export async function fetchAIResponse(
  message: string | { text: string; imageUrl?: string },
  sessionId: string
): Promise<APIResponse> {
  try {
    let messageText = typeof message === 'string' ? message : message.text;
    let imageAnalysis = '';

    // If there's an image, analyze it first
    if (typeof message === 'object' && message.imageUrl) {
      try {
        // Convert base64 image URL to blob
        const base64Data = message.imageUrl.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const imageFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });

        // Analyze the image
        imageAnalysis = await analyzeImage(imageFile);
        messageText = `${messageText}\n\nImage Analysis: ${imageAnalysis}`;
      } catch (error) {
        console.error('Failed to analyze image:', error);
      }
    }

    const response = await fetch(API_ENDPOINTS.FLOWISE_BOT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: messageText,
        overrideConfig: {
          sessionId: sessionId
        }
      }),
    });

    if (!response.ok) {
      throw new APIError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    
    // Extract sources if they exist in the response
    const sources = data.sourceDocuments || data.sources || [];
    
    return { 
      text: data.text || '',
      sources: sources,
      imageAnalysis: imageAnalysis || undefined
    };
  } catch (error) {
    console.error('Failed to fetch AI response:', error);
    throw new APIError(
      error instanceof Error ? error.message : 'Failed to fetch AI response'
    );
  }
}