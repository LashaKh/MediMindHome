import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false
});

// Custom renderer
const renderer = new marked.Renderer();

renderer.heading = (text, level) => {
  return `<h${level} class="scroll-mt-20">${text}</h${level}>`;
};

renderer.list = (body, ordered) => {
  const type = ordered ? 'ol' : 'ul';
  const className = ordered ? 'list-decimal' : 'list-none';
  return `<${type} class="${className}">${body}</${type}>`;
};

renderer.listitem = text => `<li>${text}</li>`;

renderer.paragraph = text => `<p>${text}</p>`;

renderer.blockquote = quote => `<blockquote>${quote}</blockquote>`;

renderer.code = (code, language) => {
  return `<pre><code class="language-${language}">${code}</code></pre>`;
};

export const parseMarkdown = (content: string): string => {
  const parsedContent = marked(content, { renderer });
  return DOMPurify.sanitize(parsedContent);
};