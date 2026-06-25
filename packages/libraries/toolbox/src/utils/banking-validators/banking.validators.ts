import { isValidIBAN, isValidBIC, extractIBAN, extractBIC } from 'ibantools'
import { IbanValidationError, BicValidationError } from './banking.validators.enum'
import type { IbanValidationResult, BicValidationResult, ExtractedIban, ExtractedBic } from './banking.validators.type'
import {
  IBAN_FR_REGEX,
  BBAN_FR_REGEX,
  BIC_REGEX,
  BANK_CODE_REGEX,
  BRANCH_CODE_REGEX,
  ACCOUNT_NUMBER_REGEX,
  RIB_KEY_REGEX,
  VALID_BIC_COUNTRY_CODES,
  RIB_LETTER_TO_DIGIT,
} from './banking.validators.const'

// === HELPER FUNCTIONS ===

/**
 * Normalizes banking input by removing spaces and converting to uppercase
 * @param value - Input string
 * @returns Normalized string
 */
function normalizeInput(value: string): string {
  return value.replaceAll(/\s/g, '').toUpperCase()
}

/**
 * Converts a RIB string (which may contain letters) to numeric string
 * Letters are converted using the French RIB conversion table
 * @param value - String that may contain letters (must only contain digits or letters A-Z)
 * @returns Numeric string, or null if the value contains invalid characters
 */
function convertRibToNumeric(value: string): string | null {
  let result = ''
  for (const char of value.toUpperCase()) {
    if (char >= '0' && char <= '9') {
      result += char
    } else if (RIB_LETTER_TO_DIGIT[char] === undefined) {
      return null
    } else {
      result += RIB_LETTER_TO_DIGIT[char].toString()
    }
  }
  return result
}

// === IBAN VALIDATION ===

/**
 * Validates IBAN format (FR + 2 digits + 23 alphanumeric)
 * @param iban - IBAN string (spaces are automatically removed)
 * @returns true if format is valid
 */
export function isValidIbanFormat(iban: string): boolean {
  if (!iban) {
    return false
  }
  const normalized = normalizeInput(iban)
  return IBAN_FR_REGEX.test(normalized)
}

/**
 * Validates IBAN checksum using ISO 13616 modulo 97
 * Moves first 4 characters to end, converts letters to numbers (A=10, B=11, etc.)
 * Valid if result mod 97 equals 1
 * @param iban - IBAN string (spaces are automatically removed)
 * @returns true if checksum is valid
 */
export function isValidIbanChecksum(iban: string): boolean {
  if (!iban) {
    return false
  }
  const normalized = normalizeInput(iban)

  if (normalized.length < 4) {
    return false
  }

  // Move first 4 characters to the end
  const rearranged = normalized.slice(4) + normalized.slice(0, 4)

  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numericString = ''
  for (const char of rearranged) {
    if (char >= 'A' && char <= 'Z') {
      numericString += (char.codePointAt(0)! - 55).toString()
    } else {
      numericString += char
    }
  }

  // Calculate modulo 97 using string arithmetic to handle large numbers
  let remainder = 0
  for (const digit of numericString) {
    remainder = (remainder * 10 + Number.parseInt(digit, 10)) % 97
  }

  return remainder === 1
}

/**
 * Complete IBAN validation (format + checksum)
 * @param iban - IBAN string
 * @returns true if IBAN is valid
 */
export function isValidIban(iban: string): boolean {
  return isValidIbanFormat(iban) && isValidIbanChecksum(iban)
}

/**
 * Validates IBAN with detailed error codes (inspired by ibantools)
 * @param iban - IBAN string
 * @returns Validation result with error codes
 */
export function validateIban(iban: string): IbanValidationResult {
  const errorCodes: IbanValidationError[] = []

  if (!iban) {
    return { valid: false, errorCodes: [IbanValidationError.NoIbanProvided] }
  }

  const normalized = normalizeInput(iban)

  // Check country code (currently only FR supported)
  if (!normalized.startsWith('FR')) {
    errorCodes.push(IbanValidationError.InvalidCountryCode)
  }

  // Check that check digits (positions 2-4) are numeric
  if (!/^\d{2}$/.test(normalized.slice(2, 4))) {
    errorCodes.push(IbanValidationError.ChecksumNotNumeric)
  }

  // Check length (French IBAN = 27 characters)
  if (normalized.length !== 27) {
    errorCodes.push(IbanValidationError.WrongLength)
  }

  // Check BBAN format: 10 digits + 11 alphanumeric + 2 digits
  if (!BBAN_FR_REGEX.test(normalized)) {
    errorCodes.push(IbanValidationError.WrongBbanFormat)
  }

  // Only check checksum if format is valid
  if (errorCodes.length === 0 && !isValidIbanChecksum(normalized)) {
    errorCodes.push(IbanValidationError.InvalidChecksum)
  }

  return {
    valid: errorCodes.length === 0,
    errorCodes,
  }
}

/**
 * Extracts components from a French IBAN
 * @param iban - IBAN string
 * @returns Extracted components or null if IBAN is invalid
 */
export function extractIban(iban: string): ExtractedIban | null {
  if (!isValidIban(iban)) {
    return null
  }

  const normalized = normalizeInput(iban)

  return {
    iban: normalized,
    countryCode: normalized.slice(0, 2),
    checkDigits: normalized.slice(2, 4),
    bankCode: normalized.slice(4, 9),
    branchCode: normalized.slice(9, 14),
    accountNumber: normalized.slice(14, 25),
    ribKey: normalized.slice(25, 27),
  }
}

/**
 * Composes a French IBAN from RIB components
 * @param bankCode - 5 digit bank code
 * @param branchCode - 5 digit branch code (guichet)
 * @param accountNumber - 11 alphanumeric account number
 * @param ribKey - 2 digit RIB key
 * @returns Complete IBAN string or null if components are invalid
 */
export function composeIban(
  bankCode: string,
  branchCode: string,
  accountNumber: string,
  ribKey: string,
): string | null {
  // Validate RIB components
  if (!isValidRibKey(bankCode, branchCode, accountNumber, ribKey)) {
    return null
  }

  const bban = bankCode + branchCode + accountNumber.toUpperCase() + ribKey

  // Calculate IBAN check digits
  // Move country code + 00 to end, convert letters to numbers, calculate 98 - (mod 97)
  const checkString = bban + 'FR00'

  let numericString = ''
  for (const char of checkString) {
    if (char >= 'A' && char <= 'Z') {
      numericString += (char.codePointAt(0)! - 55).toString()
    } else {
      numericString += char
    }
  }

  let remainder = 0
  for (const digit of numericString) {
    remainder = (remainder * 10 + Number.parseInt(digit, 10)) % 97
  }

  const checkDigits = (98 - remainder).toString().padStart(2, '0')

  return `FR${checkDigits}${bban}`
}

/**
 * Formats IBAN with separators for display (e.g., "FR76 3000 6000 0112 3456 7890 189")
 * @param iban - IBAN string
 * @param separator - Separator character (default: space)
 * @returns Formatted IBAN or null if input is invalid
 */
export function formatIbanFriendly(iban: string, separator = ' '): string | null {
  if (!iban || typeof iban !== 'string') {
    return null
  }

  const normalized = normalizeInput(iban)

  // Separate every 4 characters
  return normalized.replaceAll(/(.{4})(?!$)/g, `$1${separator}`)
}

// === IBAN/BIC CONSISTENCY ===

/**
 * Checks that an IBAN and a BIC are coherent — used to flag an unreliable RIB read.
 * Both must be individually valid (country-aware validation, mod-97 checksum and BIC
 * structure, delegated to `ibantools`) and refer to the same country.
 * @param iban - IBAN string (spaces are automatically removed)
 * @param bic - BIC/SWIFT string (spaces are automatically removed)
 * @returns true when the IBAN and BIC are both valid and share the same country
 */
export function areIbanAndBicCoherent(iban: string, bic: string): boolean {
  const normalizedIban = normalizeInput(iban)
  const normalizedBic = normalizeInput(bic)

  if (isValidIBAN(normalizedIban) === false || isValidBIC(normalizedBic) === false) {
    return false
  }

  return extractIBAN(normalizedIban).countryCode === extractBIC(normalizedBic).countryCode
}

// === BIC VALIDATION ===

/**
 * Validates BIC/SWIFT format (8 or 11 characters)
 * Format: 4 bank code + 2 country code + 2 location code + optional 3 branch code
 * @param bic - BIC/SWIFT code
 * @param validateCountryCode - Whether to validate that the country code exists (default: true)
 * @returns true if format is valid
 */
export function isValidBic(bic: string, validateCountryCode = true): boolean {
  if (!bic) {
    return false
  }
  const normalized = normalizeInput(bic)

  if (!BIC_REGEX.test(normalized)) {
    return false
  }

  // Optionally validate country code
  if (validateCountryCode) {
    const countryCode = normalized.slice(4, 6)
    if (!VALID_BIC_COUNTRY_CODES.has(countryCode)) {
      return false
    }
  }

  return true
}

/**
 * Validates BIC with detailed error codes
 * @param bic - BIC/SWIFT code
 * @returns Validation result with error codes
 */
export function validateBic(bic: string): BicValidationResult {
  const errorCodes: BicValidationError[] = []

  if (!bic) {
    return { valid: false, errorCodes: [BicValidationError.NoBicProvided] }
  }

  const normalized = normalizeInput(bic)

  // Check format
  if (!BIC_REGEX.test(normalized)) {
    errorCodes.push(BicValidationError.WrongFormat)
  }

  // Check country code
  const countryCode = normalized.slice(4, 6)
  if (!VALID_BIC_COUNTRY_CODES.has(countryCode)) {
    errorCodes.push(BicValidationError.InvalidCountryCode)
  }

  return {
    valid: errorCodes.length === 0,
    errorCodes,
  }
}

/**
 * Extracts components from a BIC
 * @param bic - BIC/SWIFT code
 * @returns Extracted components or null if BIC is invalid
 */
export function extractBic(bic: string): ExtractedBic | null {
  if (!isValidBic(bic)) {
    return null
  }

  const normalized = normalizeInput(bic)

  return {
    bankCode: normalized.slice(0, 4),
    countryCode: normalized.slice(4, 6),
    locationCode: normalized.slice(6, 8),
    branchCode: normalized.length > 8 ? normalized.slice(8) : null,
    // Second character of location code being '0' indicates test BIC
    isTestBic: normalized.charAt(7) === '0',
  }
}

// === RIB KEY VALIDATION ===

/**
 * Validates French RIB key using modulo 97
 * The key is calculated so that the concatenation of bank code, branch code,
 * account number, and key forms a number divisible by 97.
 * Formula: 97 - ((concatenated_number * 100) mod 97)
 * Note: The weighted formula (89*bank + 15*branch + 3*account) is mathematically
 * equivalent due to powers of 100 mod 97 (100^4=89, 100^3=15, 100^2=3 mod 97)
 * @param bankCode - 5 digit bank code
 * @param branchCode - 5 digit branch code (guichet)
 * @param accountNumber - 11 alphanumeric account number
 * @param ribKey - 2 digit RIB key
 * @returns true if key is valid
 */
export function isValidRibKey(
  bankCode: string,
  branchCode: string,
  accountNumber: string,
  ribKey: string,
): boolean {
  if (!bankCode || !branchCode || !accountNumber || !ribKey) {
    return false
  }

  // Validate format before length (catches invalid characters early)
  const normalizedAccountNumber = accountNumber.toUpperCase()
  if (!BANK_CODE_REGEX.test(bankCode)) {
    return false
  }
  if (!BRANCH_CODE_REGEX.test(branchCode)) {
    return false
  }
  if (!ACCOUNT_NUMBER_REGEX.test(normalizedAccountNumber)) {
    return false
  }
  if (!RIB_KEY_REGEX.test(ribKey)) {
    return false
  }

  // Convert all values to numeric
  const numericBankCode = convertRibToNumeric(bankCode)
  const numericBranchCode = convertRibToNumeric(branchCode)
  const numericAccountNumber = convertRibToNumeric(normalizedAccountNumber)

  // These should never be null at this point due to format validation above,
  // but we check for type safety
  if (numericBankCode === null || numericBranchCode === null || numericAccountNumber === null) {
    return false
  }

  const numericRibKey = Number.parseInt(ribKey, 10)

  // Calculate using BigInt for precision with large numbers
  // Formula: key = 97 - ((bankCode * 89 + branchCode * 15 + accountNumber * 3) mod 97)
  // We concatenate and use modulo arithmetic to handle large numbers
  const concatenated = numericBankCode + numericBranchCode + numericAccountNumber

  // Use iterative modulo calculation for large numbers
  let remainder = 0n
  for (const digit of concatenated) {
    remainder = (remainder * 10n + BigInt(digit)) % 97n
  }

  // Apply the formula: key = 97 - ((concatenated * 100) mod 97)
  // This is equivalent to adding "00" at the end and taking mod 97
  const finalRemainder = (remainder * 100n) % 97n
  const expectedKey = 97n - finalRemainder

  return BigInt(numericRibKey) === expectedKey
}

/**
 * Calculates the RIB key from bank code, branch code, and account number
 * @param bankCode - 5 digit bank code
 * @param branchCode - 5 digit branch code (guichet)
 * @param accountNumber - 11 alphanumeric account number
 * @returns 2 digit RIB key as string, or null if inputs are invalid
 */
export function calculateRibKey(
  bankCode: string,
  branchCode: string,
  accountNumber: string,
): string | null {
  if (!bankCode || !branchCode || !accountNumber) {
    return null
  }

  // Validate formats
  const normalizedAccountNumber = accountNumber.toUpperCase()
  if (!BANK_CODE_REGEX.test(bankCode)) {
    return null
  }
  if (!BRANCH_CODE_REGEX.test(branchCode)) {
    return null
  }
  if (!ACCOUNT_NUMBER_REGEX.test(normalizedAccountNumber)) {
    return null
  }

  // Convert all values to numeric
  const numericBankCode = convertRibToNumeric(bankCode)
  const numericBranchCode = convertRibToNumeric(branchCode)
  const numericAccountNumber = convertRibToNumeric(normalizedAccountNumber)

  if (numericBankCode === null || numericBranchCode === null || numericAccountNumber === null) {
    return null
  }

  const concatenated = numericBankCode + numericBranchCode + numericAccountNumber

  // Use iterative modulo calculation for large numbers
  let remainder = 0n
  for (const digit of concatenated) {
    remainder = (remainder * 10n + BigInt(digit)) % 97n
  }

  // Apply the formula: key = 97 - ((concatenated * 100) mod 97)
  const finalRemainder = (remainder * 100n) % 97n
  const key = 97n - finalRemainder

  return key.toString().padStart(2, '0')
}
