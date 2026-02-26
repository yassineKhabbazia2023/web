/**
 * Checks if details string has content.
 */
export function hasDetails(details: string | null): boolean {
  return details !== null && details.trim().length > 0
}

/**
 * Checks if details string contains bullet points.
 */
export function hasBulletPoints(details: string): boolean {
  return details.includes('\n- ')
}

/**
 * Extracts the introduction text (lines that are not bullet points).
 */
export function getIntroText(details: string): string {
  const lines = details.split('\n')
  const introLines = lines
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.startsWith('- ') === false)
  return introLines.join(' ')
}

/**
 * Extracts bullet points from details string.
 */
export function getBulletPoints(details: string): string[] {
  return details
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => line.substring(2).trim())
}
