/**
 * Git SHA commit ID regex pattern
 * Matches full (40 char) or abbreviated (7+ char) hexadecimal commit IDs
 */
const GIT_SHA_REGEX = /^[a-f0-9]{7,40}$/i

/**
 * Validates if a string is a valid Git SHA commit ID
 * Accepts full 40-character SHAs or abbreviated 7+ character SHAs
 * Does NOT trim whitespace - caller should trim first
 */
export const isValidCommitId = (commitId: string): boolean => {
  return GIT_SHA_REGEX.test(commitId)
}

/**
 * Validates a commit ID and returns an error message if invalid
 * Returns null if valid
 */
export const validateCommitId = (commitId: string, fieldName: string): string | null => {
  const trimmed = commitId.trim()

  if (trimmed.length === 0) {
    return null // Empty is not an error, just not filled yet
  }

  if (trimmed.length < 7) {
    return `${fieldName} doit contenir au moins 7 caractères`
  }

  if (trimmed.length > 40) {
    return `${fieldName} ne peut pas dépasser 40 caractères`
  }

  if (isValidCommitId(trimmed) === false) {
    return `${fieldName} doit être un identifiant hexadécimal valide (0-9, a-f)`
  }

  return null
}
