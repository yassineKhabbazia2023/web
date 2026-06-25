/** Weights for confidence score calculation */
export const CONFIDENCE_WEIGHTS = {
  /** Points for IBAN presence */
  IBAN_PRESENCE: 10,
  /** Points for valid IBAN format */
  IBAN_FORMAT_VALID: 10,
  /** Points for valid IBAN checksum (ISO 13616 mod 97) */
  IBAN_CHECKSUM_VALID: 10,
  /** Points for BIC/SWIFT presence */
  BIC_PRESENCE: 10,
  /** Points for valid BIC format */
  BIC_FORMAT_VALID: 10,
  /** Points per RIB component (bankCode, branchCode, accountNumber, ribKey) */
  RIB_COMPONENT: 5,
  /** Points for valid RIB key verification */
  RIB_KEY_VALID: 10,
} as const

/** RIB component field names for iteration */
export const RIB_COMPONENT_FIELDS = ['bankCode', 'branchCode', 'accountNumber', 'ribKey'] as const

/** Maximum possible confidence score */
export const MAX_SCORE =
  CONFIDENCE_WEIGHTS.IBAN_PRESENCE +
  CONFIDENCE_WEIGHTS.IBAN_FORMAT_VALID +
  CONFIDENCE_WEIGHTS.IBAN_CHECKSUM_VALID +
  CONFIDENCE_WEIGHTS.BIC_PRESENCE +
  CONFIDENCE_WEIGHTS.BIC_FORMAT_VALID +
  CONFIDENCE_WEIGHTS.RIB_COMPONENT * RIB_COMPONENT_FIELDS.length +
  CONFIDENCE_WEIGHTS.RIB_KEY_VALID
