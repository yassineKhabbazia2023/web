/**
 * Escape HTML special characters to prevent XSS
 */
export const escapeHtml = (text: string): string => {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replaceAll(/[&<>"']/g, (char) => htmlEntities[char])
}
