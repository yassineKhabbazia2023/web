/** IBAN validation error codes (inspired by ibantools) */
export enum IbanValidationError {
  NoIbanProvided = 'NO_IBAN_PROVIDED',
  InvalidCountryCode = 'INVALID_COUNTRY_CODE',
  ChecksumNotNumeric = 'CHECKSUM_NOT_NUMERIC',
  WrongLength = 'WRONG_LENGTH',
  WrongBbanFormat = 'WRONG_BBAN_FORMAT',
  InvalidChecksum = 'INVALID_CHECKSUM',
}

/** BIC validation error codes */
export enum BicValidationError {
  NoBicProvided = 'NO_BIC_PROVIDED',
  InvalidCountryCode = 'INVALID_COUNTRY_CODE',
  WrongFormat = 'WRONG_FORMAT',
}
