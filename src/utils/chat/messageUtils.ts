import DOMPurify from 'dompurify';
import { sanitizeHTML } from '../messageFormatter';

export const sanitizeMessage = (content: string): string => {
  return DOMPurify.sanitize(sanitizeHTML(content));
};

export const formatTimestamp = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};