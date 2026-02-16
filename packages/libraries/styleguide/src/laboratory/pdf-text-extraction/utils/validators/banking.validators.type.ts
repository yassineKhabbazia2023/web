import type { IbanValidationError, BicValidationError } from './banking.validators.enum'

/** Result of IBAN validation with detailed error codes */
export interface IbanValidationResult {
  valid: boolean
  errorCodes: IbanValidationError[]
}

/** Result of BIC validation with detailed error codes */
export interface BicValidationResult {
  valid: boolean
  errorCodes: BicValidationError[]
}

/** Extracted components from a French IBAN */
export interface ExtractedIban {
  iban: string
  countryCode: string
  checkDigits: string
  bankCode: string
  branchCode: string
  accountNumber: string
  ribKey: string
}

/** Extracted components from a BIC */
export interface ExtractedBic {
  bankCode: string
  countryCode: string
  locationCode: string
  branchCode: string | null
  isTestBic: boolean
}
