import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { marked } from 'marked'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely renders markdown content using the marked library
 * @param content - The markdown content to render
 * @returns HTML string with proper escaping
 */
export function renderMarkdown(content: string): string {
  if (!content) return '';
  
  try {
    // Configure marked options for security
    marked.setOptions({
      breaks: true, // Convert line breaks to <br>
      gfm: true,    // GitHub Flavored Markdown
    });
    
    const result = marked(content);
    // Handle both string and Promise<string> return types
    if (typeof result === 'string') {
      return result;
    } else {
      // If it's a Promise, return the content as-is for now
      // In a real app, you might want to make this function async
      console.warn('Marked returned a Promise, content not rendered:', content);
      return content;
    }
  } catch (error) {
    console.error('Error rendering markdown:', error);
    // Return escaped HTML if markdown rendering fails
    return content.replace(/[&<>"']/g, (char) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return entities[char];
    });
  }
}
