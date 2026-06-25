// === REGEX CONSTANTS ===

/** French IBAN format: FR + 2 check digits + 23 alphanumeric characters */
export const IBAN_FR_REGEX = /^FR\d{2}[A-Z0-9]{23}$/

/** French BBAN format: 10 digits + 11 alphanumeric + 2 digits (more precise than IBAN_FR_REGEX) */
export const BBAN_FR_REGEX = /^FR\d{2}\d{10}[A-Z0-9]{11}\d{2}$/

/** BIC/SWIFT format: 8 or 11 characters (4 bank + 2 country + 2 location + optional 3 branch) */
export const BIC_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/

/** Bank code format: 5 digits */
export const BANK_CODE_REGEX = /^\d{5}$/

/** Branch code format: 5 digits */
export const BRANCH_CODE_REGEX = /^\d{5}$/

/** Account number format: 11 alphanumeric characters (digits and letters A-Z) */
export const ACCOUNT_NUMBER_REGEX = /^[0-9A-Z]{11}$/

/** RIB key format: 2 digits */
export const RIB_KEY_REGEX = /^\d{2}$/

// === VALID COUNTRY CODES ===

/** ISO 3166-1 alpha-2 country codes for SEPA countries */
export const VALID_BIC_COUNTRY_CODES = new Set([
  'AD', 'AT', 'BE', 'BG', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE',
  'ES', 'FI', 'FR', 'GB', 'GI', 'GR', 'HR', 'HU', 'IE', 'IS',
  'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MT', 'NL', 'NO', 'PL',
  'PT', 'RO', 'SE', 'SI', 'SK', 'SM', 'VA',
])

/**
 * RIB letter to digit conversion table
 * Used for converting alphanumeric account numbers to numeric for key calculation
 */
export const RIB_LETTER_TO_DIGIT: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
}
