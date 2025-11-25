/**
 * Parses a full name into individual parts
 * @param fullName - The user's full name
 * @returns Array of name parts or null if invalid
 * @example parseUserName("Jean Pierre Dupont") // ["Jean", "Pierre", "Dupont"]
 */
export const parseUserName = (fullName: string | null | undefined): string[] | null => {
  if (fullName === null || fullName === undefined || fullName.trim() === '') {
    return null
  }
  return fullName.trim().split(/\s+/)
}

/**
 * Extracts the first name from a full name (uses last part)
 * @param fullName - The user's full name
 * @returns First name or 'Utilisateur' as fallback
 * @example getFirstName("Jean Pierre Dupont") // "Dupont"
 */
export const getFirstName = (fullName: string | null | undefined): string => {
  const parts = parseUserName(fullName)
  if (parts === null || parts.length === 0) {
    return 'Utilisateur'
  }
  return parts.at(-1) as string
}

/**
 * Generates user initials from full name
 * @param fullName - The user's full name
 * @returns Uppercase initials (first 2 letters of first 2 words) or 'U' as fallback
 * @example getUserInitials("Jean Pierre Dupont") // "JP"
 */
export const getUserInitials = (fullName: string | null | undefined): string => {
  const parts = parseUserName(fullName)
  if (parts === null || parts.length === 0) {
    return 'U'
  }

  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? 'U'
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}
