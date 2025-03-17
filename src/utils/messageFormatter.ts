import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options for better formatting
marked.setOptions({
  headerIds: false,
  mangle: false,
  breaks: true,
  gfm: true
});

// Custom renderer for better HTML structure
const renderer = new marked.Renderer();

renderer.heading = (text, level) => {
  const size = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg'
  }[level] || 'text-base';
  
  return `<h${level} class="font-semibold ${size} text-gray-900 dark:text-white mt-6 mb-4">${text}</h${level}>`;
};

renderer.paragraph = (text) => {
  return `<p class="my-4 leading-relaxed">${text}</p>`;
};

renderer.list = (body, ordered) => {
  const type = ordered ? 'ol' : 'ul';
  return `<${type} class="my-4 ml-6 space-y-2">${body}</${type}>`;
};

renderer.listitem = (text) => {
  return `<li class="relative pl-2">${text}</li>`;
};

renderer.blockquote = (quote) => {
  return `<blockquote class="pl-4 border-l-4 border-primary/30 dark:border-primary/50 my-4 italic">${quote}</blockquote>`;
};

renderer.code = (code, language) => {
  return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto">
    <code class="text-sm font-mono">${code}</code>
  </pre>`;
};

renderer.table = (header, body) => {
  return `<div class="my-4 overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
      <thead class="bg-gray-100 dark:bg-gray-800">${header}</thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">${body}</tbody>
    </table>
  </div>`;
};

export const formatAIResponse = (text: string): string => {
  // Add semantic structure to the content
  const structuredContent = text
    // Add proper section breaks
    .replace(/\n{3,}/g, '\n\n---\n\n')
    // Format lists consistently
    .replace(/^[-*]\s/gm, '* ')
    // Add emphasis to key terms
    .replace(/\b(Note|Important|Warning|Key Point):/g, '**$1:**')
    // Format step numbers
    .replace(/^\d+\.\s/gm, (match) => `${match}__`);

  // Convert to HTML with custom renderer
  const html = marked(structuredContent, { renderer });

  // Sanitize the HTML
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'blockquote',
      'pre', 'code', 'strong', 'em', 'table', 'thead', 'tbody',
      'tr', 'th', 'td', 'hr', 'br', 'div', 'span'
    ],
    ALLOWED_ATTR: ['class']
  });
};